// =========================================================================
// UTILITAIRES D'INTERACTION DOM ET DE RETOUR HAPTIQUE (domUtils.js)
// Rôle : Gérer les vibrations physiques, le focus et le scroll des modales
// =========================================================================

// Variables internes pour le contrôle de fréquence (throttling) des vibrations
let lastClickVibrateTime = 0;
let lastScrollTop = 0;
let lastScrollTime = 0;
const SCROLL_THRESHOLD = 30; // Nombre minimal de pixels défilés pour vibrer
const SCROLL_THROTTLE = 60;   // Délai minimal (en ms) entre deux vibrations de scroll

let hasUserInteracted = false;
if (typeof document !== 'undefined') {
    const markInteracted = () => {
        hasUserInteracted = true;
        document.removeEventListener('click', markInteracted);
        document.removeEventListener('touchstart', markInteracted);
        document.removeEventListener('keydown', markInteracted);
    };
    document.addEventListener('click', markInteracted);
    document.addEventListener('touchstart', markInteracted);
    document.addEventListener('keydown', markInteracted);
}

/**
 * Déclenche une vibration physique (retour haptique) sur l'appareil.
 * Supporte le plugin natif Capacitor Haptics (applications mobiles)
 * avec un fallback transparent sur l'API Web Vibration HTML5 standard.
 * 
 * @param {string|number} typeOrDuration - Type de vibration ('success', 'confirm', 'focus', 'scroll', 'click') ou durée en ms.
 */
export async function triggerHaptic(typeOrDuration = 'click') {
    let duration = typeof typeOrDuration === 'number' ? typeOrDuration : 40;
    let type = typeof typeOrDuration === 'string' ? typeOrDuration : 'click';

    // 1. Essai avec le plugin natif Capacitor Haptics (si exécuté dans une webview d'application mobile APK/iOS)
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics) {
        try {
            const haptics = window.Capacitor.Plugins.Haptics;
            if (type === 'success') {
                // Effet de validation "V" : Vibration moyenne -> Pause -> Légère -> Pause -> Forte
                await haptics.impact({ style: 'MEDIUM' });
                setTimeout(async () => {
                    await haptics.impact({ style: 'LIGHT' });
                    setTimeout(async () => {
                        await haptics.impact({ style: 'HEAVY' });
                    }, 120);
                }, 120);
            } else if (type === 'confirm') {
                // Double vibration légère successive
                await haptics.impact({ style: 'LIGHT' });
                setTimeout(async () => {
                    await haptics.impact({ style: 'LIGHT' });
                }, 120);
            } else if (type === 'focus') {
                // Vibration d'activation (focus sur input)
                await haptics.impact({ style: 'LIGHT' });
            } else if (type === 'scroll') {
                // Micro-vibration de défilement de liste
                await haptics.vibrate({ duration: 12 });
            } else { // 'click'
                // Retour de clic standard léger
                await haptics.impact({ style: 'LIGHT' });
            }
            return;
        } catch (e) {
            console.warn("Capacitor Haptics non disponible, bascule sur l'API Web standard", e);
        }
    }

    // 2. Fallback : Utilisation de l'API standard HTML5 du navigateur (si supportée par l'appareil)
    if (hasUserInteracted && navigator.vibrate) {
        if (type === 'success') {
            navigator.vibrate([50, 120, 20, 120, 150]); // Rythme du profil de succès
        } else if (type === 'confirm') {
            navigator.vibrate([20, 120, 20]);           // Double pulsation rapide
        } else if (type === 'focus') {
            navigator.vibrate(35);                       // Pulsation intermédiaire
        } else if (type === 'scroll') {
            navigator.vibrate(12);                       // Micro-impulsion
        } else { // 'click'
            navigator.vibrate(20);                       // Clic léger standard
        }
    }
}

/**
 * Parcourt récursivement l'arbre du DOM pour déterminer si un élément cliqué est interactif.
 * Permet d'éviter de déclencher des vibrations inutiles sur des zones neutres de l'écran.
 * 
 * @param {HTMLElement} el - L'élément HTML à analyser.
 * @returns {boolean} True si l'élément ou un de ses parents est cliquable/interactif.
 */
export function isClickableElement(el) {
    // Si on remonte jusqu'au body ou html, l'élément n'est pas cliquable
    if (!el || el === document.body || el === document.documentElement) return false;
    
    const tag = el.tagName;
    const classes = el.classList;
    
    // Détection des balises interactives natives ou éléments ayant un événement clic inline
    if (tag === 'BUTTON' || tag === 'A' || el.getAttribute('role') === 'button' || el.onclick) {
        return true;
    }
    
    // Détection des champs de saisie interactifs
    if (tag === 'INPUT' && (el.type === 'checkbox' || el.type === 'radio' || el.type === 'file' || el.type === 'submit' || el.type === 'button')) {
        return true;
    }
    
    // Détection des classes CSS couramment utilisées pour les éléments interactifs de l'application
    if (classes.contains('cursor-pointer') || classes.contains('custom-option') || classes.contains('custom-option-month') || classes.contains('custom-option-year') || classes.contains('autocomplete-item')) {
        return true;
    }
    
    // Remonte au parent pour vérification (récursion)
    return isClickableElement(el.parentElement);
}

/**
 * Configure les écouteurs d'événements globaux pour automatiser les retours haptiques
 * sur les actions de l'utilisateur (focus de saisie, clics interactifs et défilement).
 */
export function setupHapticFeedback() {
    // 1. Vibration lors de la focalisation (focus) sur un champ texte ou zone d'écriture
    document.addEventListener('focusin', (e) => {
        const target = e.target;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
            const type = target.type;
            // On ignore les inputs non textuels (boutons, checkbox, fichiers...)
            if (type !== 'hidden' && type !== 'checkbox' && type !== 'radio' && type !== 'file' && type !== 'submit' && type !== 'button' && type !== 'image') {
                triggerHaptic('focus');
            }
        }
    });

    // 2. Vibration de clic automatique sur tous les éléments détectés comme cliquables
    const handleGlobalClickHaptic = (e) => {
        const now = Date.now();
        // Évite les double-déclenchements trop rapprochés (anti-rebond de 100ms)
        if (now - lastClickVibrateTime < 100) return;
        if (isClickableElement(e.target)) {
            triggerHaptic('click');
            lastClickVibrateTime = now;
        }
    };
    document.addEventListener('click', handleGlobalClickHaptic);
    document.addEventListener('mousedown', handleGlobalClickHaptic);

    // 3. Micro-vibrations discrètes lors du défilement des listes (scroll)
    document.addEventListener('scroll', (e) => {
        const target = e.target;
        let scrollTop = 0;
        
        // Résolution de la position de défilement selon la cible (fenêtre globale ou élément conteneur)
        if (target === document || target === window || target === document.documentElement || target === document.body) {
            scrollTop = window.scrollY || document.documentElement.scrollTop;
        } else if (target instanceof HTMLElement) {
            scrollTop = target.scrollTop;
        } else {
            return;
        }
        
        const now = Date.now();
        // Contrôle de la fréquence (throttling) de vibration de défilement
        if (now - lastScrollTime > SCROLL_THROTTLE) {
            const diff = Math.abs(scrollTop - lastScrollTop);
            // Ne vibre que si le défilement dépasse le seuil minimal défini en pixels
            if (diff > SCROLL_THRESHOLD) {
                triggerHaptic('scroll');
                lastScrollTop = scrollTop;
                lastScrollTime = now;
            }
        }
    }, true);
}

/**
 * Configure un observateur DOM (MutationObserver) pour verrouiller le défilement de l'arrière-plan
 * de la page dès qu'une modale de l'application est affichée à l'écran.
 */
export function initModalScrollLock() {
    const MODAL_SELECTOR = '.fixed.inset-0.backdrop-blur-sm';
    
    // Fonction qui applique ou retire la classe overflow-hidden sur le document
    const updateBodyScroll = () => {
        const modals = document.querySelectorAll(MODAL_SELECTOR);
        const anyModalVisible = Array.from(modals).some(el => {
            return el && !el.classList.contains("hidden");
        });
        
        if (anyModalVisible) {
            // Empêche le défilement de l'arrière-plan
            document.body.classList.add("overflow-hidden");
            document.documentElement.classList.add("overflow-hidden");
        } else {
            // Rétablit le défilement normal
            document.body.classList.remove("overflow-hidden");
            document.documentElement.classList.remove("overflow-hidden");
        }
    };
    
    // Observateur qui écoute les changements de classe sur les conteneurs de modale (hidden/visible)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "attributes" && mutation.attributeName === "class") {
                updateBodyScroll();
            }
        });
    });
    
    // Attache l'observateur à toutes les modales existantes
    const modals = document.querySelectorAll(MODAL_SELECTOR);
    modals.forEach(el => {
        observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    });
    
    // Exécution initiale par sécurité
    updateBodyScroll();
}

/**
 * Centrer automatiquement à l'écran les champs de saisie de formulaire focalisés.
 * Particulièrement utile sur mobile pour éviter que le clavier virtuel ne masque la saisie.
 */
export function initScrollOnFocus() {
    const nonKeyboardTypes = ["checkbox", "radio", "button", "submit", "reset", "file", "hidden", "range", "color"];
    document.addEventListener("focusin", (e) => {
        const target = e.target;
        // On cible uniquement les zones d'écriture de texte
        if (target && (target.tagName === "TEXTAREA" || (target.tagName === "INPUT" && !nonKeyboardTypes.includes(target.type)))) {
            // Petit délai d'attente pour laisser le temps au clavier de se déployer complètement
            setTimeout(() => {
                target.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 300);
        }
    });
}
