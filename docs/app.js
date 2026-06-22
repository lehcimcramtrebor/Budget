// --- BLOC UNIQUE DE CONFIGURATION DES TAGS ---
const TAG_DATA = {
    alimentation: {
        label: "🍔 Alimentation",
        items: {
            courses: { icon: "🛒", label: "Courses" },
            resto: { icon: "🍽️", label: "Resto" },
            fastfood: { icon: "🍔", label: "Fast-Food" },
            boulangerie: { icon: "🥖", label: "Boulangerie" },
            boucherie: { icon: "🥩", label: "Boucherie" },
            marche: { icon: "🍎", label: "Marché" },
            cantine: { icon: "🍱", label: "Cantine" },
            bar: { icon: "🍺", label: "Bar/Café" },
            livraison: { icon: "🛵", label: "Livraison" }
        }
    },
    vehicule: {
        label: "🚗 Véhicules & Transports",
        items: {
            auto: { icon: "⛽", label: "Auto" },
            moto: { icon: "🏍️", label: "Moto" },
            garage: { icon: "🔧", label: "Garage" },
            transport: { icon: "🚌", label: "Transports" },
            train: { icon: "🚆", label: "Train" },
            avion: { icon: "✈️", label: "Avion" },
            taxi: { icon: "🚕", label: "Taxi/VTC" },
            peage: { icon: "🎫", label: "Péage" },
            parking: { icon: "🅿️", label: "Parking" },
            velo: { icon: "🚲", label: "Vélo/Trot" }
        }
    },
    maison: {
        label: "🏠 Maison & Quotidien",
        items: {
            logement: { icon: "🏠", label: "Logement" },
            factures: { icon: "⚡", label: "Factures" },
            assurance: { icon: "🛡️", label: "Assurance" },
            internet: { icon: "🌐", label: "Internet" },
            electro: { icon: "📺", label: "Équipement" },
            menage: { icon: "🧹", label: "Entretien" },
            deco: { icon: "🛋️", label: "Déco" },
            jardin: { icon: "🌱", label: "Jardin" },
            brico: { icon: "🛠️", label: "Matos" },
            travaux: { icon: "🏗️", label: "Gros Travaux" }
        }
    },
    loisirs: {
        label: "🍿 Loisirs & Culture",
        items: {
            loisirs: { icon: "🔫", label: "Loisirs" },
            vape: { icon: "💨", label: "Vape" },
            cine: { icon: "🍿", label: "Cinéma" },
            jeuxvideo: { icon: "🎮", label: "Gaming" },
            musique: { icon: "🎵", label: "Musique" },
            streaming: { icon: "📺", label: "Streaming" },
            livres: { icon: "📚", label: "Lecture" },
            presse: { icon: "📰", label: "Presse" },
            sorties: { icon: "🎟️", label: "Sorties" },
            voyage: { icon: "🏖️", label: "Voyage" },
            tabac: { icon: "🚬", label: "Tabac" },
            numerique: { icon: "📱", label: "Numérique" },
            abonnement: { icon: "💳", label: "Abos divers" }
        }
    },
    sante: {
        label: "💊 Santé & Beauté",
        items: {
            medical: { icon: "👨‍⚕️", label: "Généraliste" }, // Icone ajustée
            specialiste: { icon: "🩺", label: "Spécialiste" }, // Ajout (Cardio, ophtalmo, etc.)
            pharmacie: { icon: "⚕️", label: "Pharmacie" },
            labo: { icon: "🔬", label: "Analyses/Labo" }, // Ajout (Prises de sang, examens)
            mutuelle: { icon: "🏥", label: "Mutuelle" }, // Ajout (Cotisations ou reste à charge)
            complements: { icon: "🌿", label: "Compléments" }, // Ajout (Vitamines, nutrition spécifique)
            therapie: { icon: "🧘", label: "Kiné/Ostéo" },
            dentiste: { icon: "🦷", label: "Dentiste" },
            opticien: { icon: "👓", label: "Opticien" },
            coiffeur: { icon: "✂️", label: "Coiffeur" },
            beaute: { icon: "🧴", label: "Beauté/Soin" }
        }
    },
    sport: {
        label: "🏋️ Sports",
        items: {
            club: { icon: "💳", label: "Abo/Licence" }, // Ajout (Inscriptions, cotisations club)
            matos_sport: { icon: "👟", label: "Équipement" }, // Ajout (Chaussures, fringues, accessoires)
            evenement: { icon: "🏅", label: "Dossard/Tournoi" }, // Ajout (Frais de compète ou d'inscription aux courses)
            running: { icon: "🏃", label: "Running" },
            muscu: { icon: "💪", label: "Muscu/Fitness" },
            cyclisme: { icon: "🚴", label: "Cyclisme" },
            rando: { icon: "🏔️", label: "Rando/Ski" },
            natation: { icon: "🏊", label: "Natation" },
            combat: { icon: "🥊", label: "Combat" },
            raquette: { icon: "🎾", label: "Raquette" },
            foot: { icon: "⚽", label: "Collectif" }
        }
    },
    famille: {
        label: "👧 Famille & Animaux",
        items: {
            enfant: { icon: "👧", label: "Enfants" },
            ecole: { icon: "🎒", label: "École" },
            jouets: { icon: "🧸", label: "Jouets" },
            nounou: { icon: "🍼", label: "Garde" },
            animaux: { icon: "🐶", label: "Animaux" },
            veto: { icon: "🩺", label: "Véto" },
            vetements: { icon: "👕", label: "Fringues" },
            cadeaux: { icon: "🎁", label: "Cadeaux" },
            poche: { icon: "🪙", label: "Argent de poche" }
        }
    },
    admin: {
        label: "🏦 Admin & Finances",
        items: {
            banque: { icon: "🏦", label: "Banque" },
            epargne: { icon: "🐷", label: "Épargne" },
            impots: { icon: "📄", label: "Impôts" },
            juridique: { icon: "⚖️", label: "Justice/Notaire" },
            amende: { icon: "👮", label: "Amende" },
            dons: { icon: "🤝", label: "Dons/Asso" },
            poste: { icon: "📮", label: "Poste" },
            divers: { icon: "📝", label: "Divers" }
        }
    }
};

// --- GÉNÉRATION AUTOMATIQUE DES VARIABLES UTILISÉES PAR L'APP ---
const EXPENSE_TAGS = {};
const TAG_CATEGORIES = {};

Object.keys(TAG_DATA).forEach(catKey => {
    const category = TAG_DATA[catKey];
    // On extrait les clés pour TAG_CATEGORIES
    TAG_CATEGORIES[catKey] = { 
        label: category.label, 
        keys: Object.keys(category.items) 
    };
    // On fusionne tous les items dans EXPENSE_TAGS
    Object.assign(EXPENSE_TAGS, category.items);
});

// --- CALCUL DES TAGS LES PLUS UTILISÉS (POUR LA SECTION DYNAMIQUE) ---
function getTopUsedTags(limit = 12) {
    const counts = {};
    const allOps = [...state.expenses];
    state.budgets.forEach(b => {
        if (b.expenses) allOps.push(...b.expenses);
        if (b.archivedExpenses) allOps.push(...b.archivedExpenses);
    });

    allOps.forEach(op => {
        if (op.tag) counts[op.tag] = (counts[op.tag] || 0) + 1;
    });

    let sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    
    // Tes anciens tags par défaut si l'historique est vierge ou faible
    const defaultTop = ['courses', 'resto', 'loisirs', 'vape', 'numerique', 'auto', 'moto', 'brico', 'enfant', 'medical', 'vetements', 'animaux', 'cadeaux', 'divers'];
    
    defaultTop.forEach(tag => {
        if (!sorted.includes(tag)) sorted.push(tag);
    });

    return sorted.slice(0, limit);
}

// --- NOUVEAU SYSTEME DE TAGS COMPACTS ---
function getSuggestedTags(titleVal) {
    const counts = {};
    const titleLower = (titleVal || "").trim().toLowerCase();

    // Récupérer tout l'historique
    const allOps = [...state.expenses];
    state.budgets.forEach(b => {
        if (b.expenses) allOps.push(...b.expenses);
        if (b.archivedExpenses) allOps.push(...b.archivedExpenses);
    });

    // 1. Chercher des correspondances intelligentes sur le titre tapé
    let matchedOps = [];
    if (titleLower.length >= 2) {
        // On découpe la saisie en mots de 3 lettres minimum (pour ignorer "le", "de", "au"...)
        const searchWords = titleLower.split(/\s+/).filter(w => w.length >= 3);
        
        // Si on tape juste un mot court (ex: "Mc"), on le garde quand même
        if (searchWords.length === 0 && titleLower.length > 0) {
            searchWords.push(titleLower);
        }

        matchedOps = allOps.filter(op => {
            if (!op.title) return false;
            const opTitleLower = op.title.toLowerCase();
            
            // 1. Le libellé historique contient ce qu'on tape (ex: tapé="Boul", historique="Boulangerie")
            if (opTitleLower.includes(titleLower)) return true;
            
            // 2. Ce qu'on tape contient le libellé historique (ex: tapé="Courses Auchan", historique="Auchan")
            if (titleLower.includes(opTitleLower)) return true;
            
            // 3. Un des mots tapés correspond à l'historique
            return searchWords.some(word => opTitleLower.includes(word));
        });
    }

    if (matchedOps.length > 0) {
        matchedOps.forEach(op => {
            if (op.tag && op.tag !== 'divers') counts[op.tag] = (counts[op.tag] || 0) + 1;
        });
    }

    let sortedTags = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

    // 2. Compléter avec les tags les plus utilisés globalement si besoin
    if (sortedTags.length < 2) {
        const globalCounts = {};
        allOps.forEach(op => {
            if (op.tag && op.tag !== 'divers') globalCounts[op.tag] = (globalCounts[op.tag] || 0) + 1;
        });
        const globalSorted = Object.keys(globalCounts).sort((a, b) => globalCounts[b] - globalCounts[a]);
        globalSorted.forEach(tag => {
            if (!sortedTags.includes(tag) && sortedTags.length < 2) sortedTags.push(tag);
        });
    }

    // 3. Valeurs par défaut de secours
    const fallbacks = ['courses', 'auto', 'resto', 'loisirs'];
    fallbacks.forEach(tag => {
        if (!sortedTags.includes(tag) && sortedTags.length < 2) sortedTags.push(tag);
    });

    return sortedTags.slice(0, 2);
}

function renderCompactTags(containerId, inputId, titleVal = "") {
    const container = document.getElementById(containerId);
    const input = document.getElementById(inputId);
    if (!container || !input) return;

    let selectedKey = input.value || 'divers';
    const suggestions = getSuggestedTags(titleVal);

    // Détection intelligente du changement pour éviter le tremblement à la frappe
    const currentSugStr = suggestions.join(',');
    const hasChanged = container.dataset.lastSug !== currentSugStr;
    container.dataset.lastSug = currentSugStr;

    let thirdBtnKey = 'divers';
    if (!suggestions.includes(selectedKey)) {
        thirdBtnKey = selectedKey;
    }

    container.innerHTML = "";

    // Boutons de suggestion (gauche & milieu)
    suggestions.forEach(key => {
        container.appendChild(createCompactTagBtn(key, key === selectedKey, () => {
            input.value = key;
            renderCompactTags(containerId, inputId, titleVal);
            triggerHaptic(10);
        }, true, hasChanged)); // Transmet le signal d'animation
    });

    // 3ème Bouton (Ouvre la modale)
    const thirdBtn = createCompactTagBtn(thirdBtnKey, thirdBtnKey === selectedKey, () => {
        openTagSelectionModal(inputId, containerId, titleVal, suggestions);
    }, false, false);
    thirdBtn.innerHTML += `<span class="ml-1 text-[8px] opacity-50">▼</span>`;
    container.appendChild(thirdBtn);
}

function createCompactTagBtn(key, isActive, onClick, isMagic = false, shouldAnimate = false) {
    const tag = EXPENSE_TAGS[key] || EXPENSE_TAGS['divers'];
    const btn = document.createElement("button");
    btn.type = "button";
    
    let baseClass = "";
    if (isActive) {
        // Touche enfoncée (Incrustée dans la carte)
        baseClass = "w-full py-2 px-1 rounded-lg text-xs font-black bg-brand-500 text-white border-t border-brand-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)] select-none overflow-hidden flex items-center justify-center gap-1 scale-[0.98]";
    } else if (isMagic) {
        // Touche en relief avec pointillés magiques
        baseClass = "w-full py-2 px-1 rounded-lg text-[10px] font-bold border border-dashed border-brand-500/40 dark:border-brand-400/40 bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-850 text-stone-600 dark:text-stone-300 shadow-[0_2px_0_#cbd5e1] dark:shadow-[0_2px_0_#000000] select-none overflow-hidden flex items-center justify-center gap-1 active:scale-[0.97] transition-all";
        if (shouldAnimate) {
            baseClass += " animate-tag-pop";
        }
    } else {
        // Touche en relief classique au repos
        baseClass = "w-full py-2 px-1 rounded-lg text-[10px] font-bold bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-850 text-stone-600 dark:text-stone-300 border-t border-white dark:border-stone-700/50 shadow-[0_2px_0_#cbd5e1] dark:shadow-[0_2px_0_#000000] select-none overflow-hidden flex items-center justify-center gap-1 active:scale-[0.97] transition-all";
    }

    btn.className = baseClass;
    btn.innerHTML = `<span class="text-xs shrink-0">${tag.icon}</span> <span class="truncate">${tag.label}</span>`;
    btn.onclick = onClick;
    return btn;
}

// Variables de session pour la modale
let activeTagInputId = "";
let activeTagContainerId = "";
let activeTagTitleVal = "";
let activeExcludedKeys = []; // NOUVEAU : Pour recharger la modale dynamiquement

function toggleTagCategory(catKey) {
    let collapsed = JSON.parse(localStorage.getItem('budget_hmr_collapsed_cats') || '[]');
    if (collapsed.includes(catKey)) {
        collapsed = collapsed.filter(k => k !== catKey); // Déroule
    } else {
        collapsed.push(catKey); // Enroule
    }
    localStorage.setItem('budget_hmr_collapsed_cats', JSON.stringify(collapsed));
    
    // Recharge la modale instantanément avec les mêmes paramètres
    openTagSelectionModal(activeTagInputId, activeTagContainerId, activeTagTitleVal, activeExcludedKeys);
}

function openTagSelectionModal(inputId, containerId, titleVal, excludedKeys) {
    activeTagInputId = inputId;
    activeTagContainerId = containerId;
    activeTagTitleVal = titleVal;
    activeExcludedKeys = excludedKeys; // Sauvegarde pour la bascule

    const container = document.getElementById("tag_selection_grid");
    container.innerHTML = "";

    // Helper pour générer un bouton de tag
    const createBtn = (key) => {
        if (excludedKeys.includes(key)) return null; 
        
        const tag = EXPENSE_TAGS[key];
        if (!tag) return null;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "py-2.5 px-1 rounded-xl text-[10px] font-bold border transition-all flex flex-col items-center justify-center gap-1 active:scale-95 bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-brand-400 select-none";
        btn.innerHTML = `<span class="text-xl">${tag.icon}</span> <span class="truncate w-full text-center">${tag.label}</span>`;

        btn.onclick = () => {
            const input = document.getElementById(activeTagInputId);
            if (input) input.value = key;
            renderCompactTags(activeTagContainerId, activeTagInputId, activeTagTitleVal);
            closeTagSelectionModal();
            triggerHaptic(10);
        };
        return btn;
    };

    // --- CALCUL DES STATISTIQUES GLOBAL ---
    const tagCounts = {};
    const allOps = [...state.expenses];
    state.budgets.forEach(b => {
        if (b.expenses) allOps.push(...b.expenses);
        if (b.archivedExpenses) allOps.push(...b.archivedExpenses);
    });
    allOps.forEach(op => {
        if (op.tag) tagCounts[op.tag] = (tagCounts[op.tag] || 0) + 1;
    });

    // Lecture des préférences d'affichage
    const collapsedCats = JSON.parse(localStorage.getItem('budget_hmr_collapsed_cats') || '[]');

    // --- 1. SECTION DYNAMIQUE (FAVORIS) ---
    const topTags = getTopUsedTags(12);
    const dynSection = document.createElement("div");
    dynSection.innerHTML = `<h4 class="text-[9px] font-black text-brand-500 uppercase tracking-widest mb-2 px-1">⭐ Les plus utilisés</h4><div class="grid grid-cols-3 gap-2"></div>`;
    const dynGrid = dynSection.querySelector(".grid");
    
    topTags.forEach(key => {
        const btn = createBtn(key);
        if (btn) dynGrid.appendChild(btn);
    });
    if (dynGrid.children.length > 0) container.appendChild(dynSection);

    // --- 2. SECTIONS PAR CATÉGORIE (TRIÉES PAR STATS ET ÉTAT) ---
    const scoredCategories = Object.keys(TAG_CATEGORIES).map(catKey => {
        const cat = TAG_CATEGORIES[catKey];
        let score = 0;
        cat.keys.forEach(key => { score += (tagCounts[key] || 0); });
        return { catKey, score, cat, isCollapsed: collapsedCats.includes(catKey) };
    });

    // Tri : Déroulés d'abord (par score), puis Enroulés à la fin (par score)
    scoredCategories.sort((a, b) => {
        if (a.isCollapsed === b.isCollapsed) return b.score - a.score;
        return a.isCollapsed ? 1 : -1;
    });

    scoredCategories.forEach(scoredCat => {
        const { catKey, cat, isCollapsed } = scoredCat;
        const sec = document.createElement("div");
        
        // En-tête cliquable
        const header = document.createElement("div");
        header.className = "flex justify-between items-center mb-2 px-1 cursor-pointer select-none active:scale-95 transition-transform";
        header.onclick = () => { 
            triggerHaptic(10); 
            toggleTagCategory(catKey); 
        };
        
        header.innerHTML = `
            <h4 class="text-[9px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">${cat.label}</h4>
            <span class="text-stone-500 dark:text-stone-400 bg-stone-200/50 dark:bg-stone-800 rounded-full w-6 h-6 flex items-center justify-center transition-transform duration-300 ${isCollapsed ? '-rotate-90' : 'rotate-0'}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </span>
        `;
        sec.appendChild(header);

        // Grille de boutons (injectée seulement si la catégorie est déroulée)
        if (!isCollapsed) {
            const grid = document.createElement("div");
            grid.className = "grid grid-cols-3 gap-2";
            cat.keys.forEach(key => {
                const btn = createBtn(key);
                if (btn) grid.appendChild(btn);
            });
            if (grid.children.length > 0) sec.appendChild(grid);
        }
        
        container.appendChild(sec);
    });

    // Affichage de la modale
    const modal = document.getElementById("tag_selection_modal");
    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.querySelector(".glass-card").classList.remove("scale-95");
    }, 10);
}

function closeTagSelectionModal() {
    const modal = document.getElementById("tag_selection_modal");
    modal.classList.add("opacity-0");
    modal.querySelector(".glass-card").classList.add("scale-95");
    setTimeout(() => modal.classList.add("hidden"), 300);
}

// --- APPLICATION STATE (SIMPLE MODEL) ---
let state = {
    revenues: [
        { id: "r1", title: "Salaire", amount: 2000 }
    ],
    fixedCharges: [
        { id: "c1", title: "Loyer", amount: 650 },
        { id: "c2", title: "Électricité", amount: 85 },
        { id: "c3", title: "Abonnement internet & mobile", amount: 45 }
    ],
    expenses: [],
    darkMode: true,
    budgetMonth: "", // Stores the active budgeted month (YYYY-MM)
    isCertified: false,
    settings: {
        username: "",
        genderTheme: "masculin",
        warningThreshold: 150
    },
    ticketArchives: [] // Stockage local des tickets bruts
};

let hasUnsavedChanges = false;
let lastRemaining = null;

// Renewal flow state
let selectedRenewalMonth = null;
let renewalSecurityCode = "";
let willCarryOver = false;
let carryOverAmount = 0;
let isFirstLaunchAndInTolerance = false;
let isImportRenewalFlow = false;
let budgetRenewalActions = {}; // budgetId -> "close" or "carry"
let budgetsToCarryForward = []; // Array of budget objects to recreate in the new month

// Active tab state
let activeTab = "main"; // "main" or "budgets"
let pendingBudgetTitle = "";
let pendingBudgetAmount = 0;
let pendingBudgetSubType = "classic"; // "classic" or "friends"
let pendingBudgetTag = "divers";

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    initDatabase();
    initUI();
    checkAppVersionAndWelcome();
    checkMonthTransitionOnLaunch();
    registerServiceWorker();
    initPWAInstall();
    initStoragePersistence();
    initApkDownload();
    setupHapticFeedback();
    initPlatformSpecifics();
    initScrollEffects();
    hideSplashScreen();
});

function hideSplashScreen() {
    const splash = document.getElementById("app_splash_screen");
    if (!splash) return;

    // Mettre à jour la version dynamiquement avec la constante de l'application
    const versionLabel = document.getElementById("splash_version_label");
    if (versionLabel && typeof BUDGET_HMR_VERSION !== "undefined") {
        versionLabel.innerText = "v" + BUDGET_HMR_VERSION;
    }

    const elapsed = Date.now() - (window.appStartTime || Date.now());
    const minDelay = 850; // Garantir une durée minimale pour un rendu premium
    const remainingTime = Math.max(0, minDelay - elapsed);

    setTimeout(() => {
        splash.style.opacity = "0";
        splash.style.transform = "scale(1.03)";
        splash.style.pointerEvents = "none";

        // Supprimer l'élément du DOM après la transition
        setTimeout(() => {
            splash.remove();
        }, 500);
    }, remainingTime);
}

function initDatabase() {
    const savedState = localStorage.getItem("budget_hmr_simple");
    if (savedState) {
        let migrationPerformed = false;
        try {
            const parsed = JSON.parse(savedState);
            
            // Migration: Auto-confirm cash deposits for active (open) budgets
            if (Array.isArray(parsed.budgets) && Array.isArray(parsed.expenses)) {
                parsed.budgets.forEach(budget => {
                    if (!budget.closed) {
                        parsed.expenses.forEach(e => {
                            if (e.isCashDepositPending && e.budgetId === budget.id && !e.isDeposited) {
                                e.isDeposited = true;
                                migrationPerformed = true;
                                if (e.title.startsWith("Espèces à déposer :")) {
                                    e.title = e.title.replace("Espèces à déposer :", "Dépôt espèces :");
                                }
                                // Also ensure all cash operations in this open budget are marked deposited
                                const markDep = (op) => {
                                    if (op.isCash && op.amount < 0 && (!op.isDeposited || op.depositTxId === e.id)) {
                                        op.isDeposited = true;
                                        op.depositTxId = e.id;
                                    }
                                };
                                if (budget.expenses) budget.expenses.forEach(markDep);
                                if (budget.archivedExpenses) budget.archivedExpenses.forEach(markDep);
                            }
                        });
                    }
                });
            }

            if (Array.isArray(parsed.revenues)) {
                state.revenues = parsed.revenues;
            } else if (typeof parsed.baseBudget === 'number') {
                state.revenues = [{ id: "r1", title: "Revenu Principal", amount: parsed.baseBudget }];
            }
            if (Array.isArray(parsed.fixedCharges)) state.fixedCharges = parsed.fixedCharges;
            if (Array.isArray(parsed.expenses)) state.expenses = parsed.expenses;
            if (typeof parsed.darkMode === 'boolean') state.darkMode = parsed.darkMode;
            
            // Load budgetMonth
            if (parsed.budgetMonth) {
                state.budgetMonth = parsed.budgetMonth;
            } else {
                const now = new Date();
                state.budgetMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            }

            // Load budgets
            if (Array.isArray(parsed.budgets)) {
                state.budgets = parsed.budgets;
            } else {
                state.budgets = [];
            }

            // Load isCertified
            if (typeof parsed.isCertified === 'boolean') {
                state.isCertified = parsed.isCertified;
            } else {
                state.isCertified = false;
            }

            if (parsed.settings) {
                state.settings = { ...state.settings, ...parsed.settings };
            }
            if (!state.settings.genderTheme) {
                state.settings.genderTheme = "masculin";
            }
            if (typeof state.settings.warningThreshold !== 'number') {
                state.settings.warningThreshold = 150;
            }

            if (migrationPerformed) {
                saveState();
            }
        } catch (e) {
            console.error("Erreur lors de la lecture du localStorage", e);
        }
    } else {
        const now = new Date();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const thresholdDay = daysInMonth - 10;
        
        state.budgetMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        state.budgets = [];
        state.isCertified = false;
        
        if (now.getDate() >= thresholdDay) {
            isFirstLaunchAndInTolerance = true;
        }
        saveState();
    }
}

function initUI() {
    // Apply dark mode
    if (state.darkMode) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
    updateThemeToggleIcon();
    updateThemeColorMeta();
    updateSystemBars();

    // Apply visual theme
    applyVisualTheme();
	document.getElementById("exp_tag").value = "divers";
    renderCompactTags("tag_selector_container", "exp_tag", "");

    // Écoute la saisie pour auto-suggérer
    const expTitle = document.getElementById("exp_title");
    if (expTitle) {
        expTitle.addEventListener("input", (e) => renderCompactTags("tag_selector_container", "exp_tag", e.target.value));
    }

    const editTitle = document.getElementById("edit_title");
    if (editTitle) {
        editTitle.addEventListener("input", (e) => renderCompactTags("edit_tag_selector_container", "edit_exp_tag", e.target.value));
    }
	
    // Display current date month based on budgetMonth
    const currentMonthLabel = formatYearMonthFrench(state.budgetMonth);
    document.getElementById("current_date_label").innerText = currentMonthLabel;

    updateQuickSaveUI();
    initModalScrollLock(); // Bind background scroll locking

    updateUI();
    
    // Default tabs styling
    switchDashboardTab('main');
}

function saveState() {
    localStorage.setItem("budget_hmr_simple", JSON.stringify(state));
    hasUnsavedChanges = true;
    updateQuickSaveUI();
}

// --- CORE LOGIC & CALCULATIONS ---
function calculateTotals() {
    const totalRevenues = state.revenues.reduce((sum, r) => sum + r.amount, 0);
    const totalFixed = state.fixedCharges.reduce((sum, c) => sum + c.amount, 0);
    // Exclude pending cash deposits from total expenses until they are actually deposited
    const totalExpenses = state.expenses
        .filter(e => !(e.isCashDepositPending && !e.isDeposited))
        .reduce((sum, e) => sum + e.amount, 0);
    const remaining = totalRevenues - totalFixed - totalExpenses;
    return { totalRevenues, totalFixed, totalExpenses, remaining };
}

function getNextMonth(ymStr) {
    if (!ymStr) {
        const now = new Date();
        ymStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
    const [year, month] = ymStr.split('-').map(Number);
    const d = new Date(year, month - 1 + 1, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function updateUI() {
    const { totalRevenues, totalFixed, totalExpenses, remaining } = calculateTotals();

    // Toggle tabs visibility based on budgets count
    const tabsContainer = document.getElementById("dashboard_tabs_container");
    const hasBudgets = state.budgets && state.budgets.some(b => !b.closed);
    if (tabsContainer) {
        if (hasBudgets) {
            tabsContainer.classList.remove("hidden");
        } else {
            tabsContainer.classList.add("hidden");
            // If we are currently on the budgets tab but there are no budgets left, switch back to main
            if (activeTab === "budgets") {
                switchDashboardTab('main');
            }
        }
    }

    // Display totals
    document.getElementById("remaining_balance_disp").innerText = formatCurrency(remaining);
    document.getElementById("base_budget_disp").innerText = formatCurrency(totalRevenues);
    document.getElementById("fixed_charges_disp").innerText = formatCurrency(totalFixed);
    document.getElementById("expenses_disp").innerText = formatCurrency(totalExpenses);

    // Play overdraft sound if transition from non-negative to negative occurs
    if (lastRemaining !== null && lastRemaining >= 0 && remaining < 0) {
        playOverdraftSound();
    }
    lastRemaining = remaining;

    // Update dashboard label month and apply alert style if transition is delayed
    const currentMonthLabel = formatYearMonthFrench(state.budgetMonth);
    const dateLabelEl = document.getElementById("current_date_label");
    if (dateLabelEl) {
        const now = new Date();
        const currentRealMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const diffMonths = getMonthDifference(state.budgetMonth, currentRealMonth);
        
        if (diffMonths >= 1) {
            dateLabelEl.innerHTML = `⚠️ ${currentMonthLabel} (En retard)`;
            dateLabelEl.className = "inline-block px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-full border border-amber-400/50 animate-pulse select-none cursor-pointer";
            dateLabelEl.onclick = function() {
                confirmReset();
            };
        } else {
            dateLabelEl.innerHTML = currentMonthLabel;
            dateLabelEl.className = "inline-block px-3 py-1 bg-white/20 text-white font-black text-xs rounded-full border border-white/10 select-none";
            dateLabelEl.onclick = null;
        }
    }

    // Apply color themes
    const htmlEl = document.documentElement;
    const threshold = typeof state.settings.warningThreshold === 'number' ? state.settings.warningThreshold : 150;
    if (remaining < 0) {
        htmlEl.setAttribute("data-theme", "alerte");
    } else if (remaining < threshold) {
        htmlEl.setAttribute("data-theme", "warning");
    } else {
        htmlEl.setAttribute("data-theme", "sain");
    }

    // Update logo dynamically
    const logoSuffix = document.getElementById("logo_suffix");
    if (logoSuffix) {
        let name = state.settings.username;
        if (!name || name === "Utilisateur") {
            logoSuffix.innerText = "HMR";
        } else {
            logoSuffix.innerText = name.toUpperCase();
        }
    }

    // Render lists
    renderExpensesList();
    renderFixedChargesList();
    renderRevenuesList();
    updateCollapsibleUI();
    measureBannerHeights();
}

// --- RENDER LISTS ---
function renderExpensesList() {
    const container = document.getElementById("expenses_container");
    const emptyState = document.getElementById("empty_state");
    container.innerHTML = "";

    if (state.expenses.length === 0) {
        container.classList.add("hidden");
        emptyState.classList.remove("hidden");
        return;
    }

    container.classList.remove("hidden");
    emptyState.classList.add("hidden");

    // Render reverse chronologically
    [...state.expenses].reverse().forEach(e => {
        const isRefund = e.amount < 0 || e.isCashDepositPending;
        const absAmount = e.isCashDepositPending ? (e.originalCashAmount || Math.abs(e.amount)) : Math.abs(e.amount);
        const amountColor = isRefund ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400";
        const amountSign = isRefund ? "+" : "-";

        const item = document.createElement("div");
        
        // Visual identity of budget transactions
        const isBudget = e.isBudgetReference;
        let bgClass = "";
        if (isBudget) {
            bgClass = "bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/30 border-indigo-200/50 dark:border-indigo-900/30";
        } else if (isRefund) {
            bgClass = "bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/30";
        } else {
            bgClass = "bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 border-stone-200/40 dark:border-stone-800/60";
        }
        
        item.className = `flex items-center justify-between p-3 rounded-2xl border shadow-sm transition-all ${bgClass}`;
        
        // Display negative offsets if earlier than budgetMonth
        const dateDisplay = formatExpenseDate(e.date, state.budgetMonth);
        const displayTitle = isBudget ? (e.isCashDepositPending ? `🏦 ${e.title}` : `🎯 ${e.title}`) : e.title;
        
        let badgeHTML = "";
		const tagData = EXPENSE_TAGS[e.tag] || EXPENSE_TAGS['divers'];
		const tagBadge = `
		<div class="flex items-center gap-1.5">
			<span class="w-6 h-6 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs shrink-0 select-none border border-brand-500/15">
				${tagData.icon}
			</span>
			<span class="text-[9px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-wider select-none">
				${tagData.label}
			</span>
		</div>
		`;
        let modifierText = "Modifier";
        let indicatorEmoji = "✏️";
        if (isBudget) {
            modifierText = "Consulter";
            indicatorEmoji = "👁️";
            if (e.isCashDepositPending) {
                badgeHTML = e.isDeposited
                    ? `<span class="inline-flex items-center gap-0.5 text-[8px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-md uppercase tracking-wider select-none">✅ Dépôt effectué</span>`
                    : `<span class="inline-flex items-center gap-0.5 text-[8px] font-black bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded-md uppercase tracking-wider select-none animate-pulse">🏦 Espèces à déposer</span>`;
            } else {
                badgeHTML = `<span class="inline-flex items-center gap-0.5 text-[8px] font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded-md uppercase tracking-wider select-none">👁️ Enveloppe</span>`;
            }
        }
        
        const depositButtonHTML = (e.isCashDepositPending && !e.isDeposited)
            ? `<button onclick="confirmCashDeposit(event, '${e.id}')" class="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[8px] uppercase tracking-wider active:scale-95 transition-all shadow-sm flex items-center gap-1 select-none">🏦 Remis sur mon compte ?</button>`
            : "";
        
        item.innerHTML = `
            <div onclick="openEditItem('expense', '${e.id}')" class="min-w-0 pr-2 flex-1 cursor-pointer group/item-click">
                <div class="font-bold text-sm text-stone-800 dark:text-stone-100 truncate group-hover/item-click:text-brand-500 transition-colors">${displayTitle}</div>
                <div class="flex items-center gap-2 mt-1 flex-wrap">
                    <span class="text-[9px] font-semibold text-stone-400 dark:text-stone-500">${dateDisplay}</span>
                    ${tagBadge}
					${badgeHTML}
                    ${depositButtonHTML}
                    <span class="text-[8px] font-bold text-brand-500 opacity-0 group-hover/item-click:opacity-100 transition-all">${indicatorEmoji} ${modifierText}</span>
                </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <span class="font-black text-sm ${amountColor}">${amountSign} ${absAmount.toFixed(2).replace('.', ',')} €</span>
                <button onclick="deleteExpense('${e.id}')" class="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all flex items-center justify-center font-bold text-xs shadow-sm active:scale-90" title="Supprimer">
                    ✕
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

function renderFixedChargesList() {
    const container = document.getElementById("fixed_charges_container");
    container.innerHTML = "";

    state.fixedCharges.forEach(c => {
        const item = document.createElement("div");
        item.className = "flex items-center justify-between p-2.5 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200/40 dark:border-stone-800/40";
        item.innerHTML = `
            <div onclick="openEditItem('fixedCharge', '${c.id}')" class="min-w-0 pr-2 flex-1 cursor-pointer group/item-click">
                <span class="font-semibold text-xs text-stone-700 dark:text-stone-300 truncate block group-hover/item-click:text-brand-500 transition-colors">${c.title} <span class="text-[8px] font-bold text-brand-500 opacity-0 group-hover/item-click:opacity-100 transition-all ml-1">✏️</span></span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <span class="font-bold text-xs text-stone-600 dark:text-stone-400">${c.amount.toFixed(2).replace('.', ',')} €</span>
                <button onclick="deleteFixedCharge('${c.id}')" class="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all flex items-center justify-center font-bold text-[9px] shadow-sm active:scale-90" title="Supprimer">
                    ✕
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

function renderRevenuesList() {
    const container = document.getElementById("revenues_container");
    if (!container) return;
    container.innerHTML = "";

    state.revenues.forEach(r => {
        const item = document.createElement("div");
        item.className = "flex items-center justify-between p-2.5 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200/40 dark:border-stone-800/40";
        item.innerHTML = `
            <div onclick="openEditItem('revenue', '${r.id}')" class="min-w-0 pr-2 flex-1 cursor-pointer group/item-click">
                <span class="font-semibold text-xs text-stone-700 dark:text-stone-300 truncate block group-hover/item-click:text-brand-500 transition-colors">${r.title} <span class="text-[8px] font-bold text-brand-500 opacity-0 group-hover/item-click:opacity-100 transition-all ml-1">✏️</span></span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <span class="font-bold text-xs text-stone-600 dark:text-stone-400">${r.amount.toFixed(2).replace('.', ',')} €</span>
                <button onclick="deleteRevenue('${r.id}')" class="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all flex items-center justify-center font-bold text-[9px] shadow-sm active:scale-90" title="Supprimer">
                    ✕
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

// --- DYNAMIC EXPENSES OPERATIONS ---
function addExpense(event) {
    event.preventDefault();

    const titleInput = document.getElementById("exp_title");
    const amountInput = document.getElementById("exp_amount");

    const title = toTitleCase(titleInput.value.trim());
    let amountStr = amountInput.value.trim().replace(",", ".");
    const amount = parseFloat(amountStr);

    if (isNaN(amount) || amount <= 0) {
        const form = document.getElementById("expense_form");
        form.classList.add("animate-shake");
        setTimeout(() => form.classList.remove("animate-shake"), 400);
        return;
    }

    // Read date from custom date input or fallback to today
    let selectedDate = document.getElementById("expense_date_value").value;
    if (!selectedDate) {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        selectedDate = `${y}-${m}-${d}`;
    }
	
	const tag = document.getElementById("exp_tag").value || "divers"; // <-- NOUVEAU
    const newExpense = {
        id: Date.now().toString(),
        title,
        amount,
        date: selectedDate,
        tag: tag
    };

    state.expenses.push(newExpense);
    saveState();
    expensesCollapsed = false; // Auto-expand when adding new
    updateUI();
    showSuccessAnimation();

    // Clear Inputs & Reset date
    titleInput.value = "";
    amountInput.value = "";
    clearExpenseDate();
	document.getElementById("exp_tag").value = "divers";
    renderCompactTags("tag_selector_container", "exp_tag", "");
    titleInput.focus();
}

function deleteExpense(id) {
    const expense = state.expenses.find(e => e.id === id);
    if (!expense) return;

    if (expense.isBudgetReference) {
        const budget = state.budgets.find(b => b.mainTransactionId === id || b.id === expense.budgetId);
        if (budget && !budget.closed) {
            triggerHaptic('error');
            showGenericAlert(
                "Suppression impossible",
                "Cette dépense est liée à une enveloppe dédiée active. Pour la supprimer, rendez-vous dans l'onglet <strong>Enveloppes Dédiées</strong> pour la clôturer ou la supprimer.",
                "🎯"
            );
            return;
        }
        
        // If the budget is closed, allow deleting it with a double confirmation sequence
        const titleWord = "l'enveloppe clôturée";
        const emoji = "🗑️";
        
        showGenericConfirm(
            "Supprimer l'enveloppe clôturée ? (1/2)",
            `Voulez-vous vraiment supprimer l'enveloppe clôturée <strong>"${expense.title}"</strong> ? Cela supprimera également son historique d'opérations.`,
            emoji,
            () => {
                setTimeout(() => {
                    showGenericConfirm(
                        "Confirmer la suppression (2/2)",
                        `Êtes-vous absolument sûr ? Cette action effacera définitivement cette enveloppe et tout son historique.`,
                        "⚠️",
                        () => {
                             if (budget) {
                                 state.expenses = state.expenses.filter(e => e.budgetId !== budget.id && e.id !== id);
                                 state.budgets = state.budgets.filter(b => b.id !== budget.id);
                             } else {
                                 state.expenses = state.expenses.filter(e => e.id !== id);
                             }
                            saveState();
                            updateUI();
                            triggerHaptic('confirm');
                        }
                    );
                }, 300);
            }
        );
        return;
    }

    const isRefund = expense.amount < 0;
    const absAmount = Math.abs(expense.amount);
    const titleWord = isRefund ? "le remboursement" : "la dépense";
    const emoji = isRefund ? "💵" : "🗑️";

    // Double confirmation sequence
    showGenericConfirm(
        isRefund ? "Supprimer le remboursement ? (1/2)" : "Supprimer la dépense ? (1/2)",
        `Voulez-vous vraiment supprimer ${titleWord} <strong>"${expense.title}"</strong> de <strong>${absAmount.toFixed(2).replace('.', ',')} €</strong> ?`,
        emoji,
        () => {
            setTimeout(() => {
                showGenericConfirm(
                    "Confirmer la suppression (2/2)",
                    `Êtes-vous absolument sûr ? Cette action effacera définitivement ${titleWord} <strong>"${expense.title}"</strong>.`,
                    "⚠️",
                    () => {
                        state.expenses = state.expenses.filter(e => e.id !== id);
                        saveState();
                        updateUI();
                        triggerHaptic('confirm');
                    }
                );
            }, 350);
        }
    );
}

function confirmAddRefund() {
    const titleInput = document.getElementById("exp_title");
    const amountInput = document.getElementById("exp_amount");
    const form = document.getElementById("expense_form");

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const title = toTitleCase(titleInput.value.trim());
    let amountStr = amountInput.value.trim().replace(",", ".");
    const amount = parseFloat(amountStr);

    if (isNaN(amount) || amount <= 0) {
        return;
    }

    // Read date from custom date input or fallback to today
    let selectedDate = document.getElementById("expense_date_value").value;
    if (!selectedDate) {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        selectedDate = `${y}-${m}-${d}`;
    }
	
	const tag = document.getElementById("exp_tag").value || "divers";
	
    showGenericConfirm(
        "Enregistrer un remboursement ?",
        `Voulez-vous enregistrer le remboursement <strong>"${title}"</strong> de <strong>${amount.toFixed(2).replace('.', ',')} €</strong> ?<br><br>Il sera déduit de vos dépenses.`,
        "💵",
        () => {
            const newRefund = {
                id: Date.now().toString(),
                title,
                amount: -amount,
                date: selectedDate
            };
            state.expenses.push(newRefund);
            saveState();
            expensesCollapsed = false;
            updateUI();
            showSuccessAnimation();

            // Clear inputs
            titleInput.value = "";
            amountInput.value = "";
            clearExpenseDate();
			document.getElementById("exp_tag").value = "divers";
    renderCompactTags("tag_selector_container", "exp_tag", "");
            titleInput.focus();
        }
    );
}

// --- FIXED CHARGES & BUDGET SETTING ---
function updateBaseBudget() {
    const inputStr = document.getElementById("input_base_budget").value.trim().replace(",", ".");
    const inputVal = parseFloat(inputStr);
    if (!isNaN(inputVal) && inputVal >= 0) {
        state.baseBudget = inputVal;
        saveState();
        updateUI();
    }
}

function addFixedCharge() {
    const titleInput = document.getElementById("new_charge_title");
    const amountInput = document.getElementById("new_charge_amount");

    const title = toTitleCase(titleInput.value.trim());
    let amountStr = amountInput.value.trim().replace(",", ".");
    const amount = parseFloat(amountStr);

    if (title && !isNaN(amount) && amount >= 0) {
        state.fixedCharges.push({
            id: Date.now().toString(),
            title,
            amount
        });
        saveState();
        fixedChargesCollapsed = false; // Auto-expand when adding new
        updateUI();
        triggerHaptic('success');

        // Clear Inputs
        titleInput.value = "";
        amountInput.value = "";
    }
}

function deleteFixedCharge(id) {
    const charge = state.fixedCharges.find(c => c.id === id);
    if (!charge) return;
    showGenericConfirm(
        "Supprimer le frais fixe ? (1/2)",
        `Voulez-vous vraiment supprimer le frais fixe <strong>"${charge.title}"</strong> de <strong>${charge.amount.toFixed(2)} €</strong> ?`,
        "🗑️",
        () => {
            setTimeout(() => {
                showGenericConfirm(
                    "Confirmer la suppression (2/2)",
                    `Êtes-vous absolument sûr ? Cette action effacera définitivement le frais fixe <strong>"${charge.title}"</strong>.`,
                    "⚠️",
                    () => {
                        state.fixedCharges = state.fixedCharges.filter(c => c.id !== id);
                        saveState();
                        updateUI();
                        triggerHaptic('confirm');
                    }
                );
            }, 350);
        }
    );
}

function addRevenue() {
    const titleInput = document.getElementById("new_revenue_title");
    const amountInput = document.getElementById("new_revenue_amount");

    const title = toTitleCase(titleInput.value.trim());
    let amountStr = amountInput.value.trim().replace(",", ".");
    const amount = parseFloat(amountStr);

    if (title && !isNaN(amount) && amount >= 0) {
        state.revenues.push({
            id: Date.now().toString(),
            title,
            amount
        });
        saveState();
        revenuesCollapsed = false; // Auto-expand when adding new
        updateUI();
        triggerHaptic('success');

        // Clear Inputs
        titleInput.value = "";
        amountInput.value = "";
    }
}

function deleteRevenue(id) {
    const revenue = state.revenues.find(r => r.id === id);
    if (!revenue) return;
    showGenericConfirm(
        "Supprimer le revenu ? (1/2)",
        `Voulez-vous vraiment supprimer le revenu <strong>"${revenue.title}"</strong> de <strong>${revenue.amount.toFixed(2)} €</strong> ?`,
        "🗑️",
        () => {
            setTimeout(() => {
                showGenericConfirm(
                    "Confirmer la suppression (2/2)",
                    `Êtes-vous absolument sûr ? Cette action effacera définitivement le revenu <strong>"${revenue.title}"</strong>.`,
                    "⚠️",
                    () => {
                        state.revenues = state.revenues.filter(r => r.id !== id);
                        saveState();
                        updateUI();
                        triggerHaptic('confirm');
                    }
                );
            }, 350);
        }
    );
}

// --- RENEW MONTHLY BUDGET (MULTI-STEP WIZARD) ---
function confirmReset() {
    // On cache toutes les étapes par sécurité
    document.getElementById("renewal_step_budgets").classList.add("hidden");
    document.getElementById("renewal_step_1").classList.add("hidden");
    document.getElementById("renewal_step_2").classList.add("hidden");
    if (document.getElementById("renewal_step_2_5")) document.getElementById("renewal_step_2_5").classList.add("hidden");
    if (document.getElementById("renewal_step_revenues")) document.getElementById("renewal_step_revenues").classList.add("hidden");
    document.getElementById("renewal_step_3").classList.add("hidden");
    
    // Si des enveloppes sont actives, on demande d'abord quoi en faire
    const activeBudgets = state.budgets ? state.budgets.filter(b => !b.closed) : [];
    if (activeBudgets.length > 0) {
        budgetRenewalActions = {}; 
        renderRenewalBudgetsList();
        document.getElementById("renewal_step_budgets").classList.remove("hidden");
    } else {
        // SINON : On saute l'étape 1 et on va DIRECT à l'étape 2 (Saisie du Reste à vivre)
        if (isImportRenewalFlow) {
            proceedToImportRenewalCarryover();
        } else {
            document.getElementById("renewal_step_2").classList.remove("hidden");
        }
    }
    
    const modal = document.getElementById("renewal_modal");
    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.querySelector(".glass-card").classList.remove("scale-95");
    }, 10);
    triggerHaptic('confirm');
}

function closeRenewalModal() {
    const modal = document.getElementById("renewal_modal");
    modal.classList.add("opacity-0");
    modal.querySelector(".glass-card").classList.add("scale-95");
    setTimeout(() => {
        modal.classList.add("hidden");
    }, 300);
    isImportRenewalFlow = false;
}

function renderRenewalBudgetsList() {
    const container = document.getElementById("renewal_budgets_list");
    if (!container) return;
    
    container.innerHTML = "";
    const activeBudgets = state.budgets ? state.budgets.filter(b => !b.closed) : [];
    
    activeBudgets.forEach(budget => {
        const isFriends = budget.subType === "friends";
        const spent = budget.expenses.filter(e => !e.isCashDeposit).reduce((sum, e) => sum + e.amount, 0);
        const displayVal = isFriends ? (budget.allocated + spent) : (budget.allocated - spent);
        const label = isFriends ? "Part" : "Reste";
        
        // Initialize default action to "carry" (Reporter)
        if (!budgetRenewalActions[budget.id]) {
            budgetRenewalActions[budget.id] = "carry";
        }
        
        const isCarry = budgetRenewalActions[budget.id] === "carry";
        
        const item = document.createElement("div");
        item.className = "flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/80 rounded-xl my-1.5 shadow-sm";
        item.innerHTML = `
            <div class="min-w-0 pr-2 flex-1">
                <span class="block font-black text-xs text-stone-800 dark:text-stone-200 truncate">${budget.title}</span>
                <span class="block text-[10px] text-stone-500 dark:text-stone-400 font-bold mt-0.5">${label} : ${formatCurrency(displayVal)}</span>
            </div>
            <div class="flex bg-stone-200 dark:bg-stone-800 p-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider select-none shrink-0">
                <button type="button" onclick="setBudgetRenewalAction('${budget.id}', 'close')" class="px-2.5 py-1 rounded-md transition-all ${!isCarry ? 'bg-white dark:bg-stone-700 text-stone-800 dark:text-white shadow-xs' : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'}">Clôturer</button>
                <button type="button" onclick="setBudgetRenewalAction('${budget.id}', 'carry')" class="px-2.5 py-1 rounded-md transition-all ${isCarry ? 'bg-white dark:bg-stone-700 text-stone-800 dark:text-white shadow-xs' : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'}">Reporter</button>
            </div>
        `;
        container.appendChild(item);
    });
}

function setBudgetRenewalAction(budgetId, action) {
    budgetRenewalActions[budgetId] = action;
    renderRenewalBudgetsList();
    triggerHaptic(5);
}

function confirmBudgetsRenewalSelection() {
    budgetsToCarryForward = [];
    const activeBudgets = state.budgets ? state.budgets.filter(b => !b.closed) : [];
    
    activeBudgets.forEach(budget => {
        const action = budgetRenewalActions[budget.id] || "carry";
        const spent = budget.expenses.filter(e => !e.isCashDeposit).reduce((sum, e) => sum + e.amount, 0);
        
        const isFriends = budget.subType === "friends";
        const carryAmount = isFriends ? (budget.allocated + spent) : (budget.allocated - spent);
        
        if (action === "carry") {
            const carriedExpenses = budget.expenses.map(op => ({
                ...op,
                isArchived: true
            }));
            budgetsToCarryForward.push({
                title: budget.title,
                allocated: carryAmount,
                originalAllocated: budget.originalAllocated || budget.allocated,
                type: budget.type,
                subType: budget.subType || "classic",
                createdDate: budget.createdDate,
                archivedExpenses: [
                    ...(budget.archivedExpenses || []),
                    ...carriedExpenses
                ]
            });
        }
        
        closeBudgetSilently(budget.id);
    });
    
    document.getElementById("renewal_step_budgets").classList.add("hidden");
    
    // ICI AUSSI : On saute l'étape 1 pour aller directement à l'étape 2
    if (isImportRenewalFlow) {
        proceedToImportRenewalCarryover();
    } else {
        document.getElementById("renewal_step_2").classList.remove("hidden");
    }
    triggerHaptic(10);
}

function closeBudgetSilently(budgetId) {
    const budget = state.budgets.find(b => b.id === budgetId);
    if (!budget) return;
    
    executeCloseBudgetLogic(budget);
}

function goToRenewalStep2() {
    if (isImportRenewalFlow) {
        proceedToImportRenewalCarryover();
    } else {
        document.getElementById("renewal_step_1").classList.add("hidden");
        document.getElementById("renewal_step_2").classList.remove("hidden");
        triggerHaptic(10);
    }
}

function proceedToImportRenewalCarryover() {
    document.getElementById("renewal_step_1").classList.add("hidden");
    
    const now = new Date();
    const currentRealMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    selectedRenewalMonth = currentRealMonth;
    
    // Check balance
    const { remaining } = calculateTotals();
    
    if (Math.abs(remaining) > 0.009) {
        document.getElementById("renewal_step_2_5").classList.remove("hidden");
        
        const sign = remaining > 0 ? "+" : "";
        const colorClass = remaining > 0 ? "text-emerald-500" : "text-red-500";
        document.getElementById("renewal_carryover_amount").innerHTML = `<span class="${colorClass}">${sign}${formatCurrency(remaining)}</span>`;
        
        triggerHaptic(10);
    } else {
        willCarryOver = false;
        goToRenewalStep3();
    }
}

function selectRenewSameMonth() {
    selectedRenewalMonth = state.budgetMonth;
    willCarryOver = false;
    goToRenewalStep3();
}

function selectRenewNextMonth() {
    // Date verification constraint:
    // Only allow passing to the next month if today's date is at least (daysInMonth - 10) of the current budget month,
    // or if the current budget month is already in the past.
    const today = new Date();
    const [bYear, bMonth] = state.budgetMonth.split('-').map(Number);
    
    const isSameMonth = (today.getFullYear() === bYear && (today.getMonth() + 1) === bMonth);
    const isFutureMonth = (today.getFullYear() < bYear || (today.getFullYear() === bYear && (today.getMonth() + 1) < bMonth));
    
    if (isSameMonth || isFutureMonth) {
        const daysInMonth = new Date(bYear, bMonth, 0).getDate();
        const thresholdDay = daysInMonth - 10;
        if (isFutureMonth || (isSameMonth && today.getDate() < thresholdDay)) {
            triggerHaptic('error');
            const monthLabel = formatYearMonthFrench(state.budgetMonth);
            showGenericAlert(
                "Action refusée",
                `Vous ne pouvez pas encore passer au mois suivant.<br><br>Le renouvellement anticipé n'est autorisé que durant les <strong>10 derniers jours</strong> du mois en cours (à partir du <strong>${thresholdDay}</strong> pour le mois de ${monthLabel}).`,
                "📅"
            );
            return;
        }
    }

    selectedRenewalMonth = getNextMonth(state.budgetMonth);
    
    // Check balance
    const { remaining } = calculateTotals();
    
    if (Math.abs(remaining) > 0.009) { // Not zero
        document.getElementById("renewal_step_2").classList.add("hidden");
        document.getElementById("renewal_step_2_5").classList.remove("hidden");
        
        const sign = remaining > 0 ? "+" : "";
        const colorClass = remaining > 0 ? "text-emerald-500" : "text-red-500";
        document.getElementById("renewal_carryover_amount").innerHTML = `<span class="${colorClass}">${sign}${formatCurrency(remaining)}</span>`;
        
        triggerHaptic(10);
    } else {
        willCarryOver = false;
        goToRenewalStep3();
    }
}

function confirmCarryOver(choice) {
    willCarryOver = choice;
    if (choice) {
        const { remaining } = calculateTotals();
        carryOverAmount = remaining;
    }
    
    document.getElementById("renewal_step_2_5").classList.add("hidden");
    goToRenewalStep3();
}

function goToRenewalStep3() {
    if (state.revenues && state.revenues.length > 0) {
        document.getElementById("renewal_step_2").classList.add("hidden");
        document.getElementById("renewal_step_2_5").classList.add("hidden");
        document.getElementById("renewal_step_revenues").classList.remove("hidden");
        renderRenewalRevenuesList();
        triggerHaptic(10);
    } else {
        proceedToSecurityCode();
    }
}

function renderRenewalRevenuesList() {
    const container = document.getElementById("renewal_revenues_list");
    if (!container) return;
    
    container.innerHTML = "";
    state.revenues = state.revenues || [];
    
    state.revenues.forEach(r => {
        const item = document.createElement("div");
        item.className = "p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/80 rounded-xl space-y-1 shadow-xs my-1.5";
        item.innerHTML = `
            <div class="grid grid-cols-3 gap-2">
                <div class="col-span-2">
                    <label class="block text-[8px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-0.5 select-none">Libellé</label>
                    <input type="text" id="renewal_rev_title_${r.id}" value="${r.title}" class="form-input h-9 text-xs font-bold border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 rounded-lg focus:ring-1 focus:ring-stone-600">
                </div>
                <div>
                    <label class="block text-[8px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-0.5 select-none">Montant</label>
                    <div class="relative">
                        <input type="text" inputmode="decimal" id="renewal_rev_amount_${r.id}" value="${r.amount.toFixed(2).replace('.', ',')}" class="form-input h-9 text-right pr-5 text-xs font-black border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 rounded-lg focus:ring-1 focus:ring-stone-600" oninput="normalizeAmountInput(event)">
                        <span class="absolute right-1.5 top-1/2 -translate-y-1/2 font-bold text-stone-400 dark:text-stone-500 text-[10px] pointer-events-none">€</span>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(item);
    });
}

function confirmRevenuesRenewalSelection() {
    state.revenues = state.revenues || [];
    
    state.revenues.forEach(r => {
        const titleInput = document.getElementById(`renewal_rev_title_${r.id}`);
        const amountInput = document.getElementById(`renewal_rev_amount_${r.id}`);
        
        if (titleInput && amountInput) {
            const newTitle = toTitleCase(titleInput.value.trim());
            const amountVal = parseFloat(amountInput.value.trim().replace(",", "."));
            
            if (newTitle) {
                r.title = newTitle;
            }
            if (!isNaN(amountVal) && amountVal >= 0) {
                r.amount = amountVal;
            }
        }
    });
    
    saveState();
    
    document.getElementById("renewal_step_revenues").classList.add("hidden");
    proceedToSecurityCode();
}

function proceedToSecurityCode() {
    document.getElementById("renewal_step_2").classList.add("hidden");
    document.getElementById("renewal_step_2_5").classList.add("hidden");
    document.getElementById("renewal_step_revenues").classList.add("hidden");
    document.getElementById("renewal_step_3").classList.remove("hidden");
    triggerHaptic(10);
    
    renewalSecurityCode = Math.floor(1000 + Math.random() * 9000).toString();
    document.getElementById("renewal_security_code_display").innerText = renewalSecurityCode;
    
    const input = document.getElementById("renewal_security_code_input");
    input.value = "";
    
    const btn = document.getElementById("btn_confirm_renewal");
    btn.disabled = true;
    
    setTimeout(() => {
        input.focus();
    }, 150);
}

function validateRenewalCode() {
    const val = document.getElementById("renewal_security_code_input").value.trim();
    const btn = document.getElementById("btn_confirm_renewal");
    if (val === renewalSecurityCode) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

async function renewalExportPDF() {
    try {
        autoCloseAllBudgets(); // Close and finalize all budgets before PDF generation
        await generateBudgetPDF();
        goToRenewalStep2();
    } catch (err) {
        console.error("PDF generation failed:", err);
        showGenericAlert("Erreur PDF", "Impossible de générer le PDF. Vous pouvez continuer sans.", "❌");
        goToRenewalStep2();
    }
}

function executeRenewal() {
    // 1. Clôture forcée des enveloppes pour figer les calculs du mois qui s'achève
    autoCloseAllBudgets(); 
    
    const userName = state.settings.username ? state.settings.username.toUpperCase() : "HMR";
    const monthLabel = formatYearMonthFrench(state.budgetMonth);
    const { totalRevenues, totalFixed, totalExpenses, remaining } = calculateTotals();
    
    const groups = {};
    state.expenses.forEach(e => {
        const key = e.date || "Sans date";
        if (!groups[key]) groups[key] = [];
        groups[key].push(e);
    });
    
    const getTimestamp = (str) => {
        if (!str || str === "Sans date") return 0;
        const match = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (match) {
            return new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, parseInt(match[3], 10)).getTime();
        }
        const t = Date.parse(str);
        return isNaN(t) ? 0 : t;
    };
    const sortedKeys = Object.keys(groups).sort((a, b) => getTimestamp(a) - getTimestamp(b));
    
    const maxLen = 38;
    const padLine = (left, right) => {
        let lStr = String(left);
        const rStr = String(right);
        if (lStr.length + rStr.length + 1 > maxLen) {
            lStr = lStr.substring(0, maxLen - rStr.length - 2) + "…";
        }
        const dots = maxLen - lStr.length - rStr.length;
        return lStr + ".".repeat(dots > 0 ? dots : 1) + rStr;
    };
    const makeSep = (char = "=") => char.repeat(maxLen);
    
    // --- CONSTRUCTION DU TEXTE BRUT DU TICKET ---
    let pdfTx = "";
    pdfTx += `BUDGET ${userName}\n`;
    pdfTx += `PERIODE : ${monthLabel.toUpperCase()}\n`;
    pdfTx += `DATE    : ${new Date().toLocaleDateString("fr-FR")} - ${new Date().toLocaleTimeString("fr-FR", {hour: '2-digit', minute:'2-digit'})}\n`;
    pdfTx += makeSep("=") + "\n";
    pdfTx += `RESUME COMPTABLE\n`;
    pdfTx += makeSep("=") + "\n";
    pdfTx += padLine("TOTAL REVENUS (+)", formatCurrency(totalRevenues)) + "\n";
    pdfTx += padLine("TOTAL FRAIS FIXES (-)", formatCurrency(totalFixed)) + "\n";
    pdfTx += padLine("TOTAL DEPENSES (-)", formatCurrency(totalExpenses)) + "\n";
    pdfTx += makeSep("-") + "\n";
    pdfTx += padLine("RESTE A VIVRE NET", formatCurrency(remaining)) + "\n";
    pdfTx += makeSep("=") + "\n\n";
	
	// --- NOUVEAU : RÉPARTITION DES DÉPENSES PAR CATÉGORIE ---
    const tagTotals = {};
    state.expenses.forEach(e => {
        if (e.isCashDepositPending && !e.isDeposited) return;
        const tagKey = e.tag || 'divers';
        if (!tagTotals[tagKey]) tagTotals[tagKey] = 0;
        tagTotals[tagKey] += e.amount;
    });
    
    pdfTx += `REPARTITION DES DEPENSES\n`;
    pdfTx += makeSep("-") + "\n";
    const sortedTags = Object.keys(tagTotals).sort((a, b) => tagTotals[b] - tagTotals[a]);
    let hasTags = false;
    sortedTags.forEach(key => {
        if (tagTotals[key] === 0) return;
        hasTags = true;
        const tagData = EXPENSE_TAGS[key] || EXPENSE_TAGS['divers'];
        pdfTx += padLine(` ${tagData.icon} ${tagData.label}`, formatCurrency(tagTotals[key])) + "\n";
    });
    if (!hasTags) {
        pdfTx += ` [Aucune dépense catégorisée]\n`;
    }
    pdfTx += "\n";
    
    pdfTx += `DETAIL DES REVENUS\n`;
    pdfTx += makeSep("-") + "\n";
    if (!state.revenues || state.revenues.length === 0) {
        pdfTx += `[Aucun revenu enregistré]\n`;
    } else {
        state.revenues.forEach(r => {
            pdfTx += padLine(` • ${r.title}`, formatCurrency(r.amount)) + "\n";
        });
    }
    pdfTx += "\n";
    
    pdfTx += `DETAIL DES FRAIS FIXES\n`;
    pdfTx += makeSep("-") + "\n";
    if (!state.fixedCharges || state.fixedCharges.length === 0) {
        pdfTx += `[Aucun frais fixe enregistré]\n`;
    } else {
        state.fixedCharges.forEach(c => {
            pdfTx += padLine(` • ${c.title}`, formatCurrency(c.amount)) + "\n";
        });
    }
    pdfTx += "\n";
    
    pdfTx += `DETAIL DES OPERATIONS\n`;
    pdfTx += makeSep("=") + "\n";
    
    if (sortedKeys.length === 0) {
        pdfTx += `[Aucune opération enregistrée]\n\n`;
    } else {
        sortedKeys.forEach(key => {
            let dateLong = key;
            if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
                const [year, month, day] = key.split("-").map(Number);
                const dateObj = new Date(year, month - 1, day);
                dateLong = dateObj.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
                dateLong = dateLong.charAt(0).toUpperCase() + dateLong.slice(1);
            }
            pdfTx += `${dateLong.toUpperCase()}\n` + makeSep("-") + "\n";
            groups[key].forEach(e => {
                const isRefund = e.amount < 0 || e.isCashDepositPending;
                const absAmt = e.isCashDepositPending ? (e.originalCashAmount || Math.abs(e.amount)) : Math.abs(e.amount);
                const sign = isRefund ? "+" : "-";
                const formattedAmt = `${sign} ${absAmt.toFixed(2).replace('.', ',')} €`;
                const titleStr = e.isBudgetReference ? (e.isCashDepositPending ? `[CASH] ${e.title}` : `[ENV] ${e.title}`) : e.title;
                pdfTx += padLine(` • ${titleStr}`, formattedAmt) + "\n";
            });
            pdfTx += "\n";
        });
    }
    
    if (state.budgets && state.budgets.length > 0) {
        pdfTx += makeSep("=") + "\n";
        pdfTx += `SUIVI DES ENVELOPPES DEDIEES\n`;
        pdfTx += makeSep("=") + "\n";
        state.budgets.forEach(budget => {
            const isFriends = budget.subType === "friends";
            const activeSpent = budget.expenses.filter(e => !e.isCashDeposit).reduce((sum, e) => sum + e.amount, 0);
            const archivedSpent = (budget.archivedExpenses || []).filter(e => !e.isCashDeposit).reduce((sum, e) => sum + e.amount, 0);
            const totalSpent = activeSpent + archivedSpent;
            const origAlloc = budget.originalAllocated || budget.allocated;
            let displayAmount = isFriends ? (origAlloc + totalSpent) : (origAlloc - totalSpent);
            let labelDisplay = isFriends ? `PART ${userName}` : "SOLDE DISPONIBLE";
            
            let statusLabel = budget.closed ? "CLOTUREE" : "ACTIVE";
            if (typeof budgetRenewalActions !== "undefined" && budgetRenewalActions[budget.id]) {
                statusLabel = budgetRenewalActions[budget.id] === "carry" ? "REPORTEE" : "CLOTUREE";
            }
            
            pdfTx += `>>> ENVELOPPE : ${budget.title.toUpperCase()} [${statusLabel}]\n`;
            pdfTx += padLine("  Montant alloué initial", formatCurrency(origAlloc)) + "\n";
            pdfTx += padLine("  " + labelDisplay, formatCurrency(displayAmount)) + "\n";
            pdfTx += `  Détail des mouvements :\n`;
            let allOps = [];
            if (isFriends) {
                allOps.push({ title: "Dépense de départ", amount: origAlloc, isCash: false, isArchived: false });
            }
            allOps = [...allOps, ...(budget.archivedExpenses || []), ...budget.expenses];
            if (allOps.length > 0) {
                allOps.forEach(op => {
                    const isOpRefund = op.amount < 0;
                    const opSign = isOpRefund ? "+" : "-";
                    const formattedOpAmt = `${opSign} ${Math.abs(op.amount).toFixed(2).replace('.', ',')} €`;
                    const prefix = op.isCash ? "   [CASH] " : "   • ";
                    const archLabel = op.isArchived ? " (PREC)" : "";
                    pdfTx += padLine(`${prefix}${op.title}${archLabel}`, formattedOpAmt) + "\n";
                });
            } else {
                pdfTx += `   [Aucun mouvement enregistré]\n`;
            }
            pdfTx += makeSep("-") + "\n\n";
        });
    }
    pdfTx += makeSep("=") + "\n";
    pdfTx += `FIN DE TICKET — MERCI\n`;
    pdfTx += makeSep("=") + "\n";
    
    // 2. ENREGISTREMENT AUTOMATIQUE DU TICKET DANS LES ARCHIVES
    const archiveId = `arch_${state.budgetMonth}_main`;
    if (!state.ticketArchives) state.ticketArchives = [];
    state.ticketArchives = state.ticketArchives.filter(a => a.id !== archiveId);
    state.ticketArchives.push({
        id: archiveId,
        date: state.budgetMonth,
        type: "Mensuel",
        title: `Bilan ${monthLabel}`,
        rawText: pdfTx
    });
    
    // 3. Bascule des données vers le mois suivant
    const pendingDeposits = state.expenses ? state.expenses.filter(e => e.isCashDepositPending && !e.isDeposited) : [];
    state.expenses = [];
    state.budgets = []; 
    state.budgetMonth = selectedRenewalMonth;
    
    pendingDeposits.forEach(d => {
        d.date = `${selectedRenewalMonth}-01`;
        state.expenses.push(d);
    });
    
    if (budgetsToCarryForward && budgetsToCarryForward.length > 0) {
        budgetsToCarryForward.forEach(b => {
            const budgetId = "b_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
            const mainTransactionId = "exp_budget_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
            const newBudget = {
                id: budgetId,
                title: b.title,
                allocated: b.allocated,
                originalAllocated: b.originalAllocated || b.allocated,
                type: b.type,
                subType: b.subType || "classic",
                expenses: [],
                archivedExpenses: b.archivedExpenses || [],
                mainTransactionId: mainTransactionId,
                createdDate: b.createdDate || getTodayDateString()
            };
            state.budgets.push(newBudget);
            if (b.type === "deducted") {
                const titlePrefix = b.subType === "friends" ? "Avance" : "Enveloppe";
                const budgetExpense = {
                    id: mainTransactionId,
                    title: `${titlePrefix} : ${b.title}`,
                    amount: b.allocated,
                    date: `${selectedRenewalMonth}-01`,
                    isBudgetReference: true,
                    budgetId: budgetId
                };
                state.expenses.push(budgetExpense);
            }
        });
    }
    budgetsToCarryForward = []; 
    
    if (willCarryOver && Math.abs(carryOverAmount) > 0.009) {
        const newExpense = {
            id: 'exp_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            title: "Bilan précédent",
            amount: -carryOverAmount,
            date: `${selectedRenewalMonth}-01`
        };
        state.expenses.push(newExpense);
    }
    
    saveState();
    
    const currentMonthLabel = formatYearMonthFrench(state.budgetMonth);
    document.getElementById("current_date_label").innerText = currentMonthLabel;
    
    updateUI();
    closeRenewalModal();
    
	// Appel direct avec injection du texte dans l'overlay HTML
		showSuccessAnimation(`Bilan de ${monthLabel} archivé automatiquement dans les réglages !`);
	}

// --- THEME & UTILS ---
function toggleTheme() {
    state.darkMode = !state.darkMode;
    if (state.darkMode) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
    updateThemeToggleIcon();
    updateThemeColorMeta();
    updateSystemBars();
    saveState();
}

function updateThemeToggleIcon() {
    const btn = document.getElementById("theme_toggle_btn");
    if (state.darkMode) {
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    } else {
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }
}

function updateThemeColorMeta() {
    const metaThemeColor = document.getElementById("meta-theme-color");
    if (metaThemeColor) {
        metaThemeColor.setAttribute("content", state.darkMode ? "#0c0a09" : "#f5f5f4");
    }
}

function applyVisualTheme() {
    const theme = state.settings.genderTheme || "masculin";
    const htmlEl = document.documentElement;
    const btnMasculin = document.getElementById("theme_opt_masculin");
    const btnFeminin = document.getElementById("theme_opt_feminin");

    if (theme === "feminin") {
        htmlEl.classList.add("theme-feminin");
    } else {
        htmlEl.classList.remove("theme-feminin");
    }

    if (btnMasculin && btnFeminin) {
        // Reset classes
        btnMasculin.className = "py-2 px-3 rounded-xl font-bold text-xs border active:scale-95 transition-all flex items-center justify-center gap-1.5";
        btnFeminin.className = "py-2 px-3 rounded-xl font-bold text-xs border active:scale-95 transition-all flex items-center justify-center gap-1.5";

        if (theme === "feminin") {
            btnFeminin.classList.add("bg-pink-50", "border-pink-200", "text-pink-600", "hover:bg-pink-100/70", "dark:bg-pink-950/30", "dark:border-pink-900/50", "dark:text-pink-400", "dark:hover:bg-pink-950/50");
            btnMasculin.classList.add("bg-stone-50/50", "border-stone-200", "text-stone-400", "hover:bg-stone-100", "dark:bg-stone-900/50", "dark:border-stone-800", "dark:text-stone-500", "dark:hover:bg-stone-800");
        } else {
            btnMasculin.classList.add("bg-indigo-50", "border-indigo-200", "text-indigo-600", "hover:bg-indigo-100/70", "dark:bg-indigo-950/30", "dark:border-indigo-900/50", "dark:text-indigo-400", "dark:hover:bg-indigo-950/50");
            btnFeminin.classList.add("bg-stone-50/50", "border-stone-200", "text-stone-400", "hover:bg-stone-100", "dark:bg-stone-900/50", "dark:border-stone-800", "dark:text-stone-500", "dark:hover:bg-stone-800");
        }
    }
}

function setVisualTheme(theme) {
    state.settings.genderTheme = theme;
    saveState();
    applyVisualTheme();
    updateUI();
}

let revenuesCollapsed = true;
let expensesCollapsed = true;
let fixedChargesCollapsed = true;

function toggleRevenuesCollapse() {
    revenuesCollapsed = !revenuesCollapsed;
    updateCollapsibleUI();
}

function toggleExpensesCollapse() {
    expensesCollapsed = !expensesCollapsed;
    updateCollapsibleUI();
}

function toggleFixedChargesCollapse() {
    fixedChargesCollapsed = !fixedChargesCollapsed;
    updateCollapsibleUI();
}

function updateCollapsibleUI() {
    const revContent = document.getElementById("revenues_content");
    const revChevron = document.getElementById("revenues_chevron");
    const revSummary = document.getElementById("revenues_summary");

    if (revContent && revChevron && revSummary) {
        if (revenuesCollapsed) {
            revContent.classList.add("hidden");
            revChevron.classList.remove("rotate-180");
            const total = state.revenues.reduce((sum, r) => sum + r.amount, 0);
            revSummary.innerText = `${state.revenues.length} revenu${state.revenues.length > 1 ? 's' : ''} (${formatCurrency(total)})`;
        } else {
            revContent.classList.remove("hidden");
            revChevron.classList.add("rotate-180");
            revSummary.innerText = "";
        }
    }

    const expContent = document.getElementById("expenses_content");
    const expChevron = document.getElementById("expenses_chevron");
    const expSummary = document.getElementById("expenses_summary");

    if (expContent && expChevron && expSummary) {
        if (expensesCollapsed) {
            expContent.classList.add("hidden");
            expChevron.classList.remove("rotate-180");
            const total = state.expenses.reduce((sum, e) => sum + e.amount, 0);
            expSummary.innerText = `${state.expenses.length} opération${state.expenses.length > 1 ? 's' : ''} (${formatCurrency(total)})`;
        } else {
            expContent.classList.remove("hidden");
            expChevron.classList.add("rotate-180");
            expSummary.innerText = "";
        }
    }

    const fcContent = document.getElementById("fixed_charges_content");
    const fcChevron = document.getElementById("fixed_charges_chevron");
    const fcSummary = document.getElementById("fixed_charges_summary");

    if (fcContent && fcChevron && fcSummary) {
        if (fixedChargesCollapsed) {
            fcContent.classList.add("hidden");
            fcChevron.classList.remove("rotate-180");
            const total = state.fixedCharges.reduce((sum, c) => sum + c.amount, 0);
            fcSummary.innerText = `${state.fixedCharges.length} frais (${formatCurrency(total)})`;
        } else {
            fcContent.classList.remove("hidden");
            fcChevron.classList.add("rotate-180");
            fcSummary.innerText = "";
        }
    }
}

function formatCurrency(num) {
    return num.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}

function normalizeAmountInput(event) {
    let val = event.target.value;
    val = val.replace(/\./g, ',');
    val = val.replace(/[^0-9,]/g, '');
    
    const parts = val.split(',');
    if (parts.length > 2) {
        val = parts[0] + ',' + parts.slice(1).join('');
    }
    event.target.value = val;
}

function toTitleCase(str) {
    if (!str) return "";
    return str.split(' ').map(word => {
        if (word.length === 0) return '';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

// --- GENERIC CONFIRMATION MODAL LOGIC ---
let activeConfirmCallback = null;
let activeCancelCallback = null;
let confirmTimeoutId = null;
let activeGenericConfirmCode = null;

function showGenericConfirm(title, message, icon, confirmCallback, cancelCallback = null, confirmText = "Confirmer", cancelText = "Annuler", requireSecurityCode = false) {
    if (confirmTimeoutId) {
        clearTimeout(confirmTimeoutId);
        confirmTimeoutId = null;
    }
    
    document.getElementById("generic_confirm_title").innerText = title;
    document.getElementById("generic_confirm_message").innerHTML = message;
    document.getElementById("generic_confirm_icon").innerText = icon;
    
    const confirmBtn = document.getElementById("generic_confirm_btn");
    confirmBtn.innerText = confirmText;
    
    const cancelBtn = document.getElementById("generic_cancel_btn");
    if (cancelBtn) cancelBtn.innerText = cancelText;
    
    activeConfirmCallback = confirmCallback;
    activeCancelCallback = cancelCallback;

    const securitySection = document.getElementById("generic_confirm_security_section");
    const securityInput = document.getElementById("generic_confirm_security_input");
    
    if (requireSecurityCode) {
        // Generate a random 4-digit code
        activeGenericConfirmCode = Math.floor(1000 + Math.random() * 9000).toString();
        document.getElementById("generic_confirm_security_code_display").innerText = activeGenericConfirmCode;
        if (securityInput) {
            securityInput.value = "";
        }
        if (securitySection) {
            securitySection.classList.remove("hidden");
        }
        confirmBtn.disabled = true;
        // Auto focus input
        setTimeout(() => {
            if (securityInput) securityInput.focus();
        }, 100);
    } else {
        activeGenericConfirmCode = null;
        if (securitySection) {
            securitySection.classList.add("hidden");
        }
        confirmBtn.disabled = false;
    }

    const modal = document.getElementById("generic_confirm_modal");
    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.querySelector(".glass-card").classList.remove("scale-95");
    }, 10);
}

function validateGenericConfirmCode() {
    const input = document.getElementById("generic_confirm_security_input");
    const confirmBtn = document.getElementById("generic_confirm_btn");
    if (!input || !confirmBtn) return;
    
    const val = input.value.trim().toUpperCase();
    if (val === activeGenericConfirmCode) {
        confirmBtn.disabled = false;
    } else {
        confirmBtn.disabled = true;
    }
}

function closeGenericConfirmModal() {
    const modal = document.getElementById("generic_confirm_modal");
    modal.classList.add("opacity-0");
    modal.querySelector(".glass-card").classList.add("scale-95");
    
    if (confirmTimeoutId) clearTimeout(confirmTimeoutId);
    
    confirmTimeoutId = setTimeout(() => {
        modal.classList.add("hidden");
        // Reset texts back to default
        const confirmBtn = document.getElementById("generic_confirm_btn");
        confirmBtn.innerText = "Confirmer";
        confirmBtn.disabled = false;
        
        const cancelBtn = document.getElementById("generic_cancel_btn");
        if (cancelBtn) cancelBtn.innerText = "Annuler";
        
        const securitySection = document.getElementById("generic_confirm_security_section");
        if (securitySection) {
            securitySection.classList.add("hidden");
        }
        
        activeConfirmCallback = null;
        activeCancelCallback = null;
        activeGenericConfirmCode = null;
        confirmTimeoutId = null;
    }, 300);
}

function showGenericAlert(title, message, icon = "ℹ️") {
    document.getElementById("generic_alert_title").innerText = title;
    document.getElementById("generic_alert_message").innerHTML = message;
    document.getElementById("generic_alert_icon").innerText = icon;

    const modal = document.getElementById("generic_alert_modal");
    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.querySelector(".glass-card").classList.remove("scale-95");
    }, 10);
}

function closeGenericAlertModal() {
    const modal = document.getElementById("generic_alert_modal");
    modal.classList.add("opacity-0");
    modal.querySelector(".glass-card").classList.add("scale-95");
    setTimeout(() => {
        modal.classList.add("hidden");
    }, 300);
}

// Bind generic modal confirm button click
document.getElementById("generic_confirm_btn").addEventListener("click", () => {
    if (activeConfirmCallback) {
        activeConfirmCallback();
    }
    closeGenericConfirmModal();
});

function handleCancelClick() {
    if (activeCancelCallback) {
        activeCancelCallback();
    }
    closeGenericConfirmModal();
}

// --- EDIT MODAL CONTROL ---
let currentEditingItem = null;

function openEditItem(type, id, parentId = null) {
    let item = null;
    let modalTitle = "";

    if (type === "expense") {
        item = state.expenses.find(e => e.id === id);
        if (item) {
            if (item.isBudgetReference) {
                openViewBudgetModal(item.budgetId);
                return;
            }
            modalTitle = item.amount < 0 ? "Modifier le remboursement" : "Modifier la dépense";
        }
    } else if (type === "budgetOperation") {
        const budget = state.budgets.find(b => b.id === parentId);
        if (budget) {
            item = (budget.expenses || []).find(op => op.id === id) || (budget.archivedExpenses || []).find(op => op.id === id);
            if (item) {
                modalTitle = item.amount < 0 ? "Modifier le remboursement" : "Modifier la dépense";
            }
        }
    } else if (type === "fixedCharge") {
        item = state.fixedCharges.find(c => c.id === id);
        modalTitle = "Modifier le frais fixe";
    } else if (type === "revenue") {
        item = state.revenues.find(r => r.id === id);
        modalTitle = "Modifier le revenu";
    }

    if (!item) return;

    currentEditingItem = { type, id, parentId };

    document.getElementById("edit_modal_title").innerText = modalTitle;
    document.getElementById("edit_title").value = item.title;
    
    const absAmount = Math.abs(item.amount);
    document.getElementById("edit_amount").value = absAmount.toFixed(2).replace(".", ",");

    // Hide or show date picker section inside edit modal
    const dateSection = document.getElementById("edit_date_section");
    if (type === "expense" || type === "budgetOperation") {
        dateSection.classList.remove("hidden");
        const dateVal = document.getElementById("edit_expense_date_value");
        const dateLabel = document.getElementById("edit_expense_date_label");
        
        dateVal.value = item.date || "";
        if (item.date) {
            if (/^\d{4}-\d{2}-\d{2}$/.test(item.date)) {
                const [y, m, d] = item.date.split("-").map(Number);
                const dObj = new Date(y, m - 1, d);
                dateLabel.textContent = dObj.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
            } else {
                dateLabel.textContent = item.date;
            }
        } else {
            dateLabel.textContent = "Date : Aujourd'hui";
        }
    } else {
        dateSection.classList.add("hidden");
    }

// Gestion de l'affichage du tag en édition
    const editTagSection = document.getElementById("edit_tag_section");
    if (editTagSection) {
	if (type === "expense" || type === "budget") {
		editTagSection.classList.remove("hidden");
            let currentTag = "divers";
            
            if (type === "expense") {
                const exp = state.expenses.find(e => e.id === id);
                if (exp && exp.tag) currentTag = exp.tag;
            } else if (type === "budget") {
                const budget = state.budgets.find(b => b.id === id);
                if (budget && budget.tag) currentTag = budget.tag;
            }
            const editTagInput = document.getElementById("edit_exp_tag");
			if (editTagInput) editTagInput.value = currentTag;
			renderCompactTags("edit_tag_selector_container", "edit_exp_tag", item.title);
        } else {
            editTagSection.classList.add("hidden");
        }
    }
	
    const modal = document.getElementById("edit_modal");
    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.querySelector(".glass-card").classList.remove("scale-95");
    }, 10);
}

function closeEditModal() {
    const modal = document.getElementById("edit_modal");
    modal.classList.add("opacity-0");
    modal.querySelector(".glass-card").classList.add("scale-95");
    setTimeout(() => {
        modal.classList.add("hidden");
        currentEditingItem = null;
    }, 300);
}

function saveEdit(event) {
    event.preventDefault();
    if (!currentEditingItem) return;

    const { type, id, parentId } = currentEditingItem;
    const titleInput = document.getElementById("edit_title");
    const amountInput = document.getElementById("edit_amount");
    const newTag = document.getElementById("edit_exp_tag").value || "divers"; 

    const title = toTitleCase(titleInput.value.trim());
    let amountStr = amountInput.value.trim().replace(",", ".");
    const amount = parseFloat(amountStr);

    if (isNaN(amount) || amount < 0) {
        return;
    }

    if (type === "expense") {
        const item = state.expenses.find(e => e.id === id);
        if (item) {
            const isRefund = item.amount < 0;
            item.title = title;
            item.amount = isRefund ? -amount : amount;
            item.date = document.getElementById("edit_expense_date_value").value;
            item.tag = newTag; 

            // SYNCHRONISATION RETROACTIVE VERS L'ENVELOPPE LIEER
            if (item.budgetId) {
                const budget = state.budgets.find(b => b.id === item.budgetId);
                if (budget) {
                    if (item.budgetOpId) {
                        const op = budget.expenses.find(o => o.id === item.budgetOpId) || (budget.archivedExpenses && budget.archivedExpenses.find(o => o.id === item.budgetOpId));
                        if (op) op.tag = newTag;
                    } else {
                        budget.tag = newTag;
                    }
                    updateEnvelopeTicket(budget.id);
                }
            }
        }
    } else if (type === "budget") {
        const item = state.budgets.find(b => b.id === id);
        if (item) {
            item.title = title;
            item.allocated = amount;
            item.tag = newTag;
            
            // Met à jour la ligne de référence correspondante dans la liste principale
            if (item.mainTransactionId) {
                const mainTx = state.expenses.find(e => e.id === item.mainTransactionId);
                if (mainTx) {
                    mainTx.title = (item.subType === "friends" ? "Avance : " : "Enveloppe : ") + title;
                    mainTx.amount = amount;
                    mainTx.tag = newTag;
                }
            }
            updateEnvelopeTicket(item.id);
        }
    } else if (type === "budgetOperation") {
        const budget = state.budgets.find(b => b.id === parentId);
        if (budget) {
            const item = (budget.expenses || []).find(op => op.id === id) || (budget.archivedExpenses || []).find(op => op.id === id);
            if (item) {
                const isRefund = item.amount < 0;
                item.title = title;
                item.amount = isRefund ? -amount : amount;
                item.date = document.getElementById("edit_expense_date_value").value;
                
                if (budget.subType === "friends" && isRefund) {
                    if (!item.isCash) {
                        const mainTx = state.expenses.find(e => e.id === "tx_ref_cb_" + item.id || e.budgetOpId === item.id);
                        if (mainTx) {
                            mainTx.title = `Remb. numérique : ${budget.title} (${title})`;
                            mainTx.amount = item.amount;
                            mainTx.date = item.date;
                        } else {
                            const txId = "tx_ref_cb_" + item.id;
                            const refCbTx = {
                                id: txId,
                                title: `Remb. numérique : ${budget.title} (${title})`,
                                amount: item.amount,
                                date: item.date,
                                isBudgetReference: true,
                                budgetId: budget.id,
                                isDigitalRefundTx: true,
                                budgetOpId: item.id,
                            };
                            state.expenses.push(refCbTx);
                        }
                    } else if (item.isDeposited && item.depositTxId) {
                        const mainTx = state.expenses.find(e => e.id === item.depositTxId);
                        if (mainTx) {
                            const linkedOps = [...(budget.archivedExpenses || []), ...budget.expenses].filter(op => op.depositTxId === mainTx.id);
                            const newOriginalCashAmount = linkedOps.reduce((sum, op) => sum + Math.abs(op.amount), 0);
                            
                            mainTx.originalCashAmount = newOriginalCashAmount;
                            mainTx.amount = calculateCashDepositAmount(budget, newOriginalCashAmount, mainTx.id);
                        }
                    }
                }
                
                syncMainBudgetReference(budget);
            }
        }
    } else if (type === "fixedCharge") {
        const item = state.fixedCharges.find(c => c.id === id);
        if (item) {
            item.title = title;
            item.amount = amount;
        }
    } else if (type === "revenue") {
        const item = state.revenues.find(r => r.id === id);
        if (item) {
            item.title = title;
            item.amount = amount;
        }
    }

    if (type === "budgetOperation" && parentId) {
        updateEnvelopeTicket(parentId);
    }
    saveState();
    closeEditModal();
    renderBudgetsList();
    updateUI();
    showSuccessAnimation();

    if (type === "budgetOperation" && parentId) {
        const viewModal = document.getElementById("view_budget_modal");
        if (viewModal && !viewModal.classList.contains("hidden")) {
            openViewBudgetModal(parentId);
        }
    }
}



// --- SETTINGS MODAL CONTROL ---
function openSettingsModal() {
    const modal = document.getElementById("settings_modal");
    if (!modal) return;

    document.getElementById("settings_username").value = state.settings.username || "";
    document.getElementById("settings_warning_threshold").value = state.settings.warningThreshold || 150;

    const currentTheme = state.settings.genderTheme || "masculin";
    const optMasculin = document.getElementById("theme_opt_masculin");
    const optFeminin = document.getElementById("theme_opt_feminin");

    if (currentTheme === "feminin") {
        optFeminin.className = "py-2 px-3 rounded-xl font-bold text-xs border bg-pink-500 text-white border-pink-500 active:scale-95 transition-all flex items-center justify-center gap-1.5";
        optMasculin.className = "py-2 px-3 rounded-xl font-bold text-xs border bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 active:scale-95 transition-all flex items-center justify-center gap-1.5";
    } else {
        optMasculin.className = "py-2 px-3 rounded-xl font-bold text-xs border bg-brand-500 text-white border-brand-500 active:scale-95 transition-all flex items-center justify-center gap-1.5";
        optFeminin.className = "py-2 px-3 rounded-xl font-bold text-xs border bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 active:scale-95 transition-all flex items-center justify-center gap-1.5";
    }

	checkStoragePersistence();

    const certBadge = document.getElementById("settings_certification_badge_container");
    if (certBadge) {
        if (state.isCertified) {
            certBadge.classList.remove("hidden");
        } else {
            certBadge.classList.add("hidden");
        }
    }

    // Chargement dynamique de la liste des archives
    renderTicketArchives();

    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.querySelector(".glass-card").classList.remove("scale-95");
    }, 10);
}

function closeSettingsModal() {
    const modal = document.getElementById("settings_modal");
    modal.classList.add("opacity-0");
    modal.querySelector(".glass-card").classList.add("scale-95");
    setTimeout(() => {
        modal.classList.add("hidden");
    }, 300);
}

function shareApp() {
    const shareData = {
        title: 'BUDGETHMR — Mes Comptes Simplifiés',
        text: 'Découvre BUDGETHMR, l\'application web PWA ultra-simple et gratuite pour suivre tes comptes, tes enveloppes et ton reste à vivre en temps réel !',
        url: 'https://lehcimcramtrebor.github.io/Budget/index.html'
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Partage réussi !'))
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    console.error('Erreur lors du partage :', err);
                }
            });
    } else {
        const dummyInput = document.createElement("input");
        dummyInput.value = shareData.url;
        document.body.appendChild(dummyInput);
        dummyInput.select();
        try {
            document.execCommand('copy');
            showGenericAlert("Lien copié", "Le lien de l'application a été copié dans votre presse-papiers. Vous pouvez maintenant le partager !", "🔗");
        } catch (err) {
            console.error('Impossible de copier le lien :', err);
            showGenericAlert("Partager l'application", `Copiez ce lien pour le partager : <br><strong class="select-all">${shareData.url}</strong>`, "🔗");
        }
        document.body.removeChild(dummyInput);
    }
}

function saveUserSettings() {
    const nameVal = document.getElementById("settings_username").value.trim();
    state.settings.username = toTitleCase(nameVal);
    
    const thresholdInput = document.getElementById("settings_warning_threshold");
    if (thresholdInput) {
        const thresholdVal = parseFloat(thresholdInput.value.trim().replace(",", "."));
        state.settings.warningThreshold = !isNaN(thresholdVal) ? thresholdVal : 150;
    }
    
    saveState();
    updateUI();
    triggerHaptic('success');
}

async function exportJSONData() {
    const jsonString = JSON.stringify(state, null, 2);
    const defaultFileName = "BUDGET-BACKUP.json";

    // 1. If running in Capacitor, use Filesystem to write a temporary file and Share to export it natively
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Filesystem && window.Capacitor.Plugins.Share) {
        try {
            const { Filesystem, Share } = window.Capacitor.Plugins;
            
            // Write to a temporary file in the app cache
            await Filesystem.writeFile({
                path: defaultFileName,
                data: jsonString,
                directory: 'CACHE',
                encoding: 'utf8'
            });
            
            // Get the native file URI
            const uriResult = await Filesystem.getUri({
                directory: 'CACHE',
                path: defaultFileName
            });

            // Share the file URI
            await Share.share({
                title: defaultFileName,
                files: [uriResult.uri],
                dialogTitle: 'Exporter les données de budget'
            });
            
            hasUnsavedChanges = false;
            updateQuickSaveUI();
            triggerHaptic('success');
            return;
        } catch (err) {
            console.error("Erreur export natif :", err);
        }
    }

    // 2. Try using File System Access API (showSaveFilePicker)
    if ('showSaveFilePicker' in window) {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: defaultFileName,
                types: [{
                    description: 'Fichier Sauvegarde BUDGETHMR',
                    accept: {
                        'application/json': ['.json']
                    }
                }]
            });
            const writable = await handle.createWritable();
            await writable.write(jsonString);
            await writable.close();
            try {
                await saveFileHandle(handle);
            } catch (saveErr) {
                console.error("Erreur lors de la sauvegarde du handle :", saveErr);
            }
            hasUnsavedChanges = false;
            updateQuickSaveUI();
            showGenericAlert("Export réussi", "Vos données de budget ont été enregistrées avec succès !", "📤");
            triggerHaptic('success');
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error("Erreur lors de la sauvegarde :", err);
                showGenericAlert("Erreur de sauvegarde", "Une erreur est survenue lors de l'enregistrement du fichier : " + err.message, "❌");
            }
        }
    } else {
        // Fallback for older browsers or mobile
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);
        const dlAnchorElem = document.createElement("a");
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", defaultFileName);
        dlAnchorElem.click();
        hasUnsavedChanges = false;
        updateQuickSaveUI();
        triggerHaptic('success');
    }
}

let pendingImportData = null;

function importJSONData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if ((typeof imported.baseBudget === 'number' || Array.isArray(imported.revenues)) && Array.isArray(imported.fixedCharges) && Array.isArray(imported.expenses)) {
                pendingImportData = imported;
                showImportWizardOptions(imported);
            } else {
                showGenericAlert("Format invalide", "Le format du fichier JSON n'est pas valide pour BUDGETHMR.", "⚠️");
            }
        } catch (err) {
            showGenericAlert("Erreur de lecture", "Erreur lors de la lecture du fichier : " + err.message, "❌");
        }
    };
    reader.readAsText(file);
    event.target.value = "";
}

function getPreviousMonth(ymStr) {
    if (!ymStr) {
        const now = new Date();
        ymStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
    const [year, month] = ymStr.split('-').map(Number);
    const d = new Date(year, month - 1 - 1, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function closeImportOptionsModal() {
    const modal = document.getElementById("import_options_modal");
    if (modal) {
        modal.classList.add("opacity-0");
        modal.querySelector(".glass-card").classList.add("scale-95");
        setTimeout(() => {
            modal.classList.add("hidden");
            pendingImportData = null;
        }, 300);
    }
}

function showImportWizardOptions(imported) {
    const desc = document.getElementById("import_options_description");
    const container = document.getElementById("import_options_container");
    if (!desc || !container) return;

    const now = new Date();
    const currentRealMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prevRealMonth = getPreviousMonth(currentRealMonth);
    const importedMonth = imported.budgetMonth || currentRealMonth;

    container.innerHTML = "";

    const cardClass = "w-full py-3.5 px-4 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700/80 border border-stone-200 dark:border-stone-800 rounded-2xl text-stone-800 dark:text-stone-100 text-xs font-bold text-left active:scale-98 transition-all flex flex-col space-y-0.5 shadow-sm";

    if (importedMonth === currentRealMonth) {
        desc.innerHTML = `Cette sauvegarde correspond exactement au mois en cours (<strong>${formatYearMonthFrench(importedMonth)}</strong>). <br><br>Choisissez l'option de restauration :`;
        
        container.innerHTML = `
            <button onclick="executeImportOption('full')" class="${cardClass}">
                <span class="text-stone-800 dark:text-stone-100">🚀 La totale (Restauration complète)</span>
                <span class="text-[10px] text-stone-400 dark:text-stone-500 font-semibold leading-normal">Importe tout : dépenses, enveloppes, revenus et frais fixes.</span>
            </button>
            <button onclick="executeImportOption('partial')" class="${cardClass}">
                <span class="text-stone-800 dark:text-stone-100">🧹 Juste frais fixes et revenus</span>
                <span class="text-[10px] text-stone-400 dark:text-stone-500 font-semibold leading-normal">Importe uniquement revenus & frais fixes. Les dépenses et enveloppes de ce mois repartent de zéro.</span>
            </button>
        `;
    } else if (importedMonth === prevRealMonth) {
        desc.innerHTML = `Cette sauvegarde correspond au mois précédent (<strong>${formatYearMonthFrench(importedMonth)}</strong>). <br><br>Choisissez comment l'importer :`;
        
        container.innerHTML = `
            <button onclick="executeImportOption('past_as_is')" class="${cardClass}">
                <span class="text-stone-800 dark:text-stone-100">⏳ Importer tout en l'état (Mois précédent)</span>
                <span class="text-[10px] text-stone-400 dark:text-stone-500 font-semibold leading-normal">Importe tout. Se positionne sur le mois précédent. Vous gérerez le passage au mois suivant manuellement plus tard.</span>
            </button>
            <button onclick="executeImportOption('past_renew')" class="${cardClass}">
                <span class="text-stone-800 dark:text-stone-100">🔄 Importer pour le mois en cours (avec report)</span>
                <span class="text-[10px] text-stone-400 dark:text-stone-500 font-semibold leading-normal">Calcule le report de solde et des enveloppes, puis lance les étapes de renouvellement (PDF, revenus, etc.).</span>
            </button>
            <button onclick="executeImportOption('past_partial')" class="${cardClass}">
                <span class="text-stone-800 dark:text-stone-100">🧹 Frais fixes & revenus uniquement</span>
                <span class="text-[10px] text-stone-400 dark:text-stone-500 font-semibold leading-normal">Ignore le reste. Importe uniquement les revenus & frais fixes directement dans le mois en cours (${formatYearMonthFrench(currentRealMonth)}).</span>
            </button>
        `;
    } else {
        // Hors période
        desc.innerHTML = `⚠️ <strong>Période décalée</strong> : Cette sauvegarde correspond au mois de <strong>${formatYearMonthFrench(importedMonth)}</strong>, ce qui est en dehors de la période de sécurité. <br><br>Seuls vos revenus et frais fixes seront importés pour le mois en cours, suivis d'une revue des revenus.`;
        
        container.innerHTML = `
            <button onclick="executeImportOption('out_of_period')" class="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold text-xs active:scale-95 transition-all shadow-md">
                📥 Importer uniquement Revenus & Frais Fixes
            </button>
            <button onclick="closeImportOptionsModal()" class="w-full py-3.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-2xl font-bold text-xs active:scale-95 transition-all border border-stone-200 dark:border-stone-700 shadow-sm">
                Annuler
            </button>
        `;
    }

    const modal = document.getElementById("import_options_modal");
    if (modal) {
        modal.classList.remove("hidden");
        setTimeout(() => {
            modal.classList.remove("opacity-0");
            modal.querySelector(".glass-card").classList.remove("scale-95");
        }, 10);
    }
}

function applyImportFull(imported) {
    if (Array.isArray(imported.revenues)) {
        state.revenues = imported.revenues;
    } else {
        state.revenues = [{ id: "r1", title: "Revenu Principal", amount: imported.baseBudget }];
    }
    state.fixedCharges = imported.fixedCharges;
    state.expenses = imported.expenses;
    if (typeof imported.darkMode === 'boolean') state.darkMode = imported.darkMode;
    if (imported.settings) state.settings = { ...state.settings, ...imported.settings };
    if (imported.budgetMonth) state.budgetMonth = imported.budgetMonth;
    if (Array.isArray(imported.budgets)) {
        state.budgets = imported.budgets;
    } else {
        state.budgets = [];
    }
    saveState();
    initUI();
}

function applyImportPartial(imported, targetMonth) {
    if (Array.isArray(imported.revenues)) {
        state.revenues = imported.revenues;
    } else {
        state.revenues = [{ id: "r1", title: "Revenu Principal", amount: imported.baseBudget }];
    }
    state.fixedCharges = imported.fixedCharges;
    state.expenses = [];
    state.budgets = [];
    state.budgetMonth = targetMonth;
    if (typeof imported.darkMode === 'boolean') state.darkMode = imported.darkMode;
    if (imported.settings) state.settings = { ...state.settings, ...imported.settings };
    
    saveState();
    initUI();
}

function startImportRevenuesReview(imported, targetMonth) {
    // 1. Set state to partial import data
    if (Array.isArray(imported.revenues)) {
        state.revenues = imported.revenues;
    } else {
        state.revenues = [{ id: "r1", title: "Revenu Principal", amount: imported.baseBudget }];
    }
    state.fixedCharges = imported.fixedCharges;
    state.expenses = [];
    state.budgets = [];
    
    // Set budgetMonth temporarily to the previous month so executeRenewal transitions to targetMonth
    state.budgetMonth = getPreviousMonth(targetMonth);
    
    // Set renewal variables
    selectedRenewalMonth = targetMonth;
    willCarryOver = false;
    carryOverAmount = 0;
    budgetsToCarryForward = [];
    
    // 2. Hide all renewal wizard step views
    document.getElementById("renewal_step_budgets").classList.add("hidden");
    document.getElementById("renewal_step_1").classList.add("hidden");
    document.getElementById("renewal_step_2").classList.add("hidden");
    if (document.getElementById("renewal_step_2_5")) document.getElementById("renewal_step_2_5").classList.add("hidden");
    
    // 3. Show revenues step
    document.getElementById("renewal_step_revenues").classList.remove("hidden");
    renderRenewalRevenuesList();
    
    // 4. Open renewal modal
    const modal = document.getElementById("renewal_modal");
    if (modal) {
        modal.classList.remove("hidden");
        setTimeout(() => {
            modal.classList.remove("opacity-0");
            modal.querySelector(".glass-card").classList.remove("scale-95");
        }, 10);
    }
    
    closeSettingsModal();
    triggerHaptic('confirm');
}

function executeImportOption(option) {
    const imported = pendingImportData;
    if (!imported) return;

    const now = new Date();
    const currentRealMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prevRealMonth = getPreviousMonth(currentRealMonth);

    closeImportOptionsModal();

    if (option === 'full') {
        applyImportFull(imported);
        closeSettingsModal();
        showGenericAlert("Import réussi", "Vos données ont été entièrement restaurées pour le mois en cours.", "📥");
        triggerHaptic('success');
    } else if (option === 'partial') {
        applyImportPartial(imported, currentRealMonth);
        closeSettingsModal();
        showGenericAlert("Import réussi", "Les revenus et frais fixes ont été importés. Les dépenses et enveloppes ont été réinitialisées.", "📥");
        triggerHaptic('success');
    } else if (option === 'past_as_is') {
        applyImportFull(imported);
        closeSettingsModal();
        showGenericAlert("Import réussi", `Vos données ont été restaurées en l'état pour le mois de <strong>${formatYearMonthFrench(prevRealMonth)}</strong>.<br><br>Vous pourrez passer au mois suivant manuellement depuis le tableau de bord principal.`, "📥");
        triggerHaptic('success');
    } else if (option === 'past_renew') {
        isImportRenewalFlow = true;
        applyImportFull(imported);
        closeSettingsModal();
        // Start renewal flow from step 0 (envelopes selection) or step 1
        confirmReset();
    } else if (option === 'past_partial') {
        startImportRevenuesReview(imported, currentRealMonth);
    } else if (option === 'out_of_period') {
        startImportRevenuesReview(imported, currentRealMonth);
    }
}

function getMonthDifference(ym1, ym2) {
    if (!ym1 || !ym2) return 0;
    const [y1, m1] = ym1.split('-').map(Number);
    const [y2, m2] = ym2.split('-').map(Number);
    return (y2 - y1) * 12 + (m2 - m1);
}

function checkMonthTransitionOnLaunch() {
    if (!state.budgetMonth) return;

    // Prevent collision with onboarding / update modals
    const welcome = document.getElementById("welcome_modal");
    const versionUpdate = document.getElementById("version_update_modal");
    if ((welcome && !welcome.classList.contains("hidden")) || (versionUpdate && !versionUpdate.classList.contains("hidden"))) {
        return;
    }
    
    const now = new Date();
    const currentRealMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const diffMonths = getMonthDifference(state.budgetMonth, currentRealMonth);
    
    if (diffMonths <= 0) return;
    
    if (diffMonths === 1) {
        // Show non-blocking transition reminder modal
        const desc = document.getElementById("transition_reminder_description");
        if (desc) {
            desc.innerHTML = `Votre budget est resté sur le mois de <strong>${formatYearMonthFrench(state.budgetMonth)}</strong>, alors que nous sommes en <strong>${formatYearMonthFrench(currentRealMonth)}</strong>.<br><br>Souhaitez-vous effectuer la transition mensuelle vers la nouvelle période maintenant ?`;
        }
        const modal = document.getElementById("transition_reminder_modal");
        if (modal) {
            modal.classList.remove("hidden");
            setTimeout(() => {
                modal.classList.remove("opacity-0");
                modal.querySelector(".glass-card").classList.remove("scale-95");
            }, 10);
        }
    } else if (diffMonths === 2) {
        // Show blocking transition forced modal
        const desc = document.getElementById("transition_forced_description");
        if (desc) {
            desc.innerHTML = `Votre période budgétaire (<strong>${formatYearMonthFrench(state.budgetMonth)}</strong>) est en retard de plus d'un mois par rapport au mois réel actuel (<strong>${formatYearMonthFrench(currentRealMonth)}</strong>).<br><br>Vous devez transitionner vers le mois actuel pour continuer à utiliser l'application.`;
        }
        const modal = document.getElementById("transition_forced_modal");
        if (modal) {
            modal.classList.remove("hidden");
            setTimeout(() => {
                modal.classList.remove("opacity-0");
                modal.querySelector(".glass-card").classList.remove("scale-95");
            }, 10);
        }
    } else {
        // diffMonths >= 3: Show blocking transition reinit modal
        const desc = document.getElementById("transition_reinit_description");
        if (desc) {
            desc.innerHTML = `Vous n'avez pas ouvert l'application depuis longtemps (mois géré : <strong>${formatYearMonthFrench(state.budgetMonth)}</strong>, mois actuel : <strong>${formatYearMonthFrench(currentRealMonth)}</strong>).<br><br>Une réinitialisation vers la période actuelle est requise pour utiliser l'application. Souhaitez-vous conserver vos frais fixes et revenus de base ?`;
        }
        const modal = document.getElementById("transition_reinit_modal");
        if (modal) {
            modal.classList.remove("hidden");
            setTimeout(() => {
                modal.classList.remove("opacity-0");
                modal.querySelector(".glass-card").classList.remove("scale-95");
            }, 10);
        }
    }
}

function closeTransitionReminderModal() {
    const modal = document.getElementById("transition_reminder_modal");
    if (modal) {
        modal.classList.add("opacity-0");
        modal.querySelector(".glass-card").classList.add("scale-95");
        setTimeout(() => {
            modal.classList.add("hidden");
        }, 300);
    }
    triggerHaptic(5);
}

function acceptTransitionReminder() {
    closeTransitionReminderModal();
    confirmReset();
}

function executeForcedTransition(type) {
    const modal = document.getElementById("transition_forced_modal");
    if (modal) {
        modal.classList.add("opacity-0");
        modal.querySelector(".glass-card").classList.add("scale-95");
        setTimeout(() => {
            modal.classList.add("hidden");
        }, 300);
    }
    
    if (type === 'renew') {
        isImportRenewalFlow = true;
        confirmReset();
    } else {
        // 'reset'
        const now = new Date();
        const currentRealMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        applyImportPartial(state, currentRealMonth);
        showGenericAlert("Période réinitialisée", `L'application a été réinitialisée pour le mois de <strong>${formatYearMonthFrench(currentRealMonth)}</strong> avec vos réglages de base.`, "🧹");
        triggerHaptic('success');
    }
}

function executeReinitOption(type) {
    const modal = document.getElementById("transition_reinit_modal");
    if (modal) {
        modal.classList.add("opacity-0");
        modal.querySelector(".glass-card").classList.add("scale-95");
        setTimeout(() => {
            modal.classList.add("hidden");
        }, 300);
    }
    
    if (type === 'keep') {
        const now = new Date();
        const currentRealMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        startImportRevenuesReview(state, currentRealMonth);
    } else {
        // 'wipe'
        clearDatabase(() => {
            // If they cancel either step of the database wiping, re-trigger the check which will re-show the reinit modal
            checkMonthTransitionOnLaunch();
        });
    }
}

function clearDatabase(onCancelCallback = null) {
    showGenericConfirm(
        "Réinitialiser l'application ?",
        "Voulez-vous vraiment supprimer TOUTES les données ? Vos dépenses, vos frais fixes et vos réglages seront effacés.",
        "🗑️",
        () => {
            // First step with security code validated. Show final confirmation step.
            setTimeout(() => {
                showGenericConfirm(
                    "⚠️ Suppression Définitive",
                    "Cette action est totalement irréversible et va effacer l'intégralité de votre budget. Êtes-vous ABSOLUMENT sûr de vouloir tout supprimer ?",
                    "💥",
                    () => {
                        localStorage.removeItem("budget_hmr_simple");
                        localStorage.removeItem("budget_hmr_version");
                        
                        state.revenues = [{ id: "r1", title: "Salaire", amount: 2000 }];
                        state.fixedCharges = [
                            { id: "c1", title: "Loyer", amount: 650 },
                            { id: "c2", title: "Électricité", amount: 85 },
                            { id: "c3", title: "Abonnement internet & mobile", amount: 45 }
                        ];
                        state.expenses = [];
                        state.darkMode = true;
                        state.budgets = [];
                        state.isCertified = false;
                        state.settings = { username: "", genderTheme: "masculin", warningThreshold: 150 };
                        
                        const now = new Date();
                        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                        const thresholdDay = daysInMonth - 10;
                        state.budgetMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                        
                        isFirstLaunchAndInTolerance = (now.getDate() >= thresholdDay);
                        
                        saveState();
                        initUI();
                        closeSettingsModal();
                        
                        // Show welcome modal immediately
                        setTimeout(() => {
                            openWelcomeModal();
                        }, 500);
                    },
                    onCancelCallback,
                    "Tout supprimer",
                    "Annuler"
                );
            }, 300);
        },
        onCancelCallback,
        "Réinitialiser",
        "Annuler",
        true
    );
}

// --- CONFIRMATION SOUND & SUCCESS ANIMATION ---
function playConfirmationSound() {
    try {
        const audio = new Audio('assets/Mario Coin.mp3');
        audio.play();
    } catch (e) {
        console.error("Failed to play confirmation sound", e);
    }
}

function playOverdraftSound() {
    try {
        const audio = new Audio('assets/Mario death sound.mp3');
        audio.play();
    } catch (e) {
        console.error("Failed to play overdraft sound", e);
    }
}

function showSuccessAnimation(customDesc = "") {
    playConfirmationSound();
    triggerHaptic('success');
    
    const overlay = document.getElementById('validation_success_overlay');
    if (!overlay) return;
    
    // Gestion du message HTML personnalisé
    const descEl = document.getElementById('success_overlay_desc');
    if (descEl) {
        if (customDesc) {
            descEl.textContent = customDesc;
            descEl.classList.remove('hidden');
        } else {
            descEl.classList.add('hidden');
        }
    }
    
    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        const card = overlay.querySelector('.glass-card');
        if (card) card.classList.remove('scale-95');
    }, 10);
    
    // Si on a un texte, on laisse 2.5 secondes pour lire, sinon 1 seconde standard
    const displayDuration = customDesc ? 2500 : 1000;
    
    setTimeout(() => {
        overlay.classList.add('opacity-0');
        const card = overlay.querySelector('.glass-card');
        if (card) card.classList.add('scale-95');
        setTimeout(() => {
            overlay.classList.add('hidden');
            if (descEl) descEl.classList.add('hidden'); // Reset pour les prochains affichages
        }, 300);
    }, displayDuration);
}

// --- HAPTIC FEEDBACK (VIBRATION) ENGINE ---
let lastClickVibrateTime = 0;
let lastScrollTop = 0;
let lastScrollTime = 0;
const SCROLL_THRESHOLD = 30; // pixels
const SCROLL_THROTTLE = 60;   // ms

async function triggerHaptic(typeOrDuration = 'click') {
    let duration = typeof typeOrDuration === 'number' ? typeOrDuration : 40;
    let type = typeof typeOrDuration === 'string' ? typeOrDuration : 'click';

    // 1. Utiliser le plugin natif Capacitor Haptics si disponible
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics) {
        try {
            const haptics = window.Capacitor.Plugins.Haptics;
            if (type === 'success') {
                // Sensation de dessin d'un "V" de validation : MEDIUM -> LIGHT (après 120ms) -> HEAVY (après 120ms)
                await haptics.impact({ style: 'MEDIUM' });
                setTimeout(async () => {
                    await haptics.impact({ style: 'LIGHT' });
                    setTimeout(async () => {
                        await haptics.impact({ style: 'HEAVY' });
                    }, 120);
                }, 120);
            } else if (type === 'confirm') {
                // Double vibration successive légère espacée de 120ms (évite la sensation de vibration continue longue)
                await haptics.impact({ style: 'LIGHT' });
                setTimeout(async () => {
                    await haptics.impact({ style: 'LIGHT' });
                }, 120);
            } else if (type === 'focus') {
                await haptics.impact({ style: 'LIGHT' }); // Retour d'activation de zone de saisie
            } else if (type === 'scroll') {
                await haptics.vibrate({ duration: 12 }); // Micro-vibration de défilement ultra-courte (12ms)
            } else { // 'click'
                await haptics.impact({ style: 'LIGHT' }); // Clic standard très discret
            }
            return;
        } catch (e) {
            console.warn("Capacitor Haptics non disponible, bascule sur l'API Web standard", e);
        }
    }

    // 2. Fallback sur l'API Vibrations HTML5 classique
    if (navigator.vibrate) {
        if (type === 'success') {
            navigator.vibrate([50, 120, 20, 120, 150]); // Profil V
        } else if (type === 'confirm') {
            navigator.vibrate([20, 120, 20]); // Double impulsion de 20ms
        } else if (type === 'focus') {
            navigator.vibrate(35); // Impulsion intermédiaire (35ms)
        } else if (type === 'scroll') {
            navigator.vibrate(12); // Micro-impulsion de 12ms
        } else { // 'click'
            navigator.vibrate(20); // Impulsion légère de 20ms
        }
    }
}

function isClickableElement(el) {
    if (!el || el === document.body || el === document.documentElement) return false;
    const tag = el.tagName;
    const classes = el.classList;
    if (tag === 'BUTTON' || tag === 'A' || el.getAttribute('role') === 'button' || el.onclick) {
        return true;
    }
    if (tag === 'INPUT' && (el.type === 'checkbox' || el.type === 'radio' || el.type === 'file' || el.type === 'submit' || el.type === 'button')) {
        return true;
    }
    if (classes.contains('cursor-pointer') || classes.contains('custom-option') || classes.contains('custom-option-month') || classes.contains('custom-option-year') || classes.contains('autocomplete-item')) {
        return true;
    }
    return isClickableElement(el.parentElement);
}

function setupHapticFeedback() {
    // 1. Évitement de clavier pour les inputs de type texte/nombre
    document.addEventListener('focusin', (e) => {
        const target = e.target;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
            const type = target.type;
            if (type !== 'hidden' && type !== 'checkbox' && type !== 'radio' && type !== 'file' && type !== 'submit' && type !== 'button' && type !== 'image') {
                triggerHaptic('focus');
            }
        }
    });

    // 2. Gestion globale des vibrations de clic sur éléments interactifs
    const handleGlobalClickHaptic = (e) => {
        const now = Date.now();
        if (now - lastClickVibrateTime < 100) return;
        if (isClickableElement(e.target)) {
            triggerHaptic('click');
            lastClickVibrateTime = now;
        }
    };
    document.addEventListener('click', handleGlobalClickHaptic);
    document.addEventListener('mousedown', handleGlobalClickHaptic);

    // 3. Gestion globale des vibrations rapides de défilement (scroll)
    document.addEventListener('scroll', (e) => {
        const target = e.target;
        let scrollTop = 0;
        if (target === document || target === window || target === document.documentElement || target === document.body) {
            scrollTop = window.scrollY || document.documentElement.scrollTop;
        } else if (target instanceof HTMLElement) {
            scrollTop = target.scrollTop;
        } else {
            return;
        }
        
        const now = Date.now();
        if (now - lastScrollTime > SCROLL_THROTTLE) {
            const diff = Math.abs(scrollTop - lastScrollTop);
            if (diff > SCROLL_THRESHOLD) {
                triggerHaptic('scroll');
                lastScrollTop = scrollTop;
                lastScrollTime = now;
            }
        }
    }, true);
}


// --- INTERACTIVE TOUR LOGIC ---
let tourTrackingActive = false;
let tourAnimationId = null;
let currentTourStep = 0;

const tourSteps = [
    {
        elementId: "app_logo",
        title: "Logo Dynamique",
        message: "BUDGETHMR affiche votre prénom directement dans le logo dès que vous le renseignez dans les réglages !",
        placement: "bottom"
    },
    {
        elementId: "remaining_balance_disp",
        title: "Le Reste à Vivre",
        message: "C'est l'indicateur central de l'application. Il s'ajuste en couleur : Vert (sain), Orange (vigilance) ou Rouge (alerte) pour vous guider en temps réel.",
        placement: "bottom"
    },
    {
        elementId: "btn_settings",
        title: "Réglages & Sauvegarde ⚙️",
        message: ('showSaveFilePicker' in window)
            ? "Cette roue crantée s'anime d'une pulsation et tourne lentement dès que vous modifiez votre budget. Cliquez dessus pour accéder aux réglages et sauvegarder vos changements !"
            : "Cette roue crantée s'anime d'une pulsation et tourne lentement dès que vous modifiez votre budget. Cliquez dessus pour accéder aux réglages et télécharger votre sauvegarde BUDGET-BACKUP.json !",
        placement: "bottom"
    },
    {
        elementId: "tour_add_title",
        title: "Saisie Rapide",
        message: "Enregistrez vos dépenses ou vos remboursements (calcul inverse). La saisie est simplifiée : que vous tapiez un point ou une virgule, elle normalise automatiquement !",
        placement: "bottom"
    },
    {
        elementId: "expenses_content",
        title: "Opérations en cours",
        message: "Retrouvez ici l'ensemble de vos opérations du mois. La liste est pliable pour garder une vue d'ensemble compacte et propre.",
        placement: "top"
    },
    {
        elementId: "revenues_container",
        title: "Revenus Mensuels",
        message: "Gérez plusieurs revenus récurrents. Le cumul de ces revenus forme votre budget de base global du mois.",
        placement: "top"
    },
    {
        elementId: "fixed_charges_container",
        title: "Frais Fixes",
        message: "Ajoutez ici vos charges récurrentes mensuelles (Loyer, abonnements...). Ces frais sont déduits en priorité.",
        placement: "top"
    },
    {
        elementId: "btn_settings",
        title: "Réglages & Données",
        message: "Accédez à ce menu pour changer votre prénom, importer une sauvegarde JSON, réinitialiser l'application ou relancer ce guide !",
        placement: "left"
    }
];

function repositionTooltip() {
    const step = tourSteps[currentTourStep];
    if (!step) return;
    const target = document.getElementById(step.elementId);
    const tooltip = document.getElementById("tour_tooltip");
    if (!target || !tooltip) return;

    const isVisible = target.offsetWidth > 0 || target.offsetHeight > 0;
    if (!isVisible) {
        // Fallback: center of screen
        tooltip.style.top = "50%";
        tooltip.style.left = "50%";
        tooltip.style.transform = "translate(-50%, -50%) scale(1)";
        return;
    }

    const rect = target.getBoundingClientRect();
    const tooltipW = tooltip.offsetWidth;
    const tooltipH = tooltip.offsetHeight;
    const margin = 16;

    let preferredPlacement = step.placement || "bottom";

    // Function to calculate clamped position coordinates
    function getPosition(placement) {
        let t = 0;
        let l = 0;
        if (placement === "bottom") {
            t = rect.bottom + 12;
            l = rect.left + (rect.width - tooltipW) / 2;
        } else if (placement === "top") {
            t = rect.top - tooltipH - 12;
            l = rect.left + (rect.width - tooltipW) / 2;
        } else if (placement === "left") {
            t = rect.top + (rect.height - tooltipH) / 2;
            l = rect.left - tooltipW - 12;
        } else if (placement === "right") {
            t = rect.top + (rect.height - tooltipH) / 2;
            l = rect.right + 12;
        }

        // Clamp to viewport
        t = Math.max(margin, Math.min(t, window.innerHeight - tooltipH - margin));
        l = Math.max(margin, Math.min(l, window.innerWidth - tooltipW - margin));

        return { top: t, left: l };
    }

    let pos = getPosition(preferredPlacement);

    // Collision detection
    const targetBox = {
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom
    };

    function hasCollision(top, left) {
        const tooltipBox = {
            left: left,
            right: left + tooltipW,
            top: top,
            bottom: top + tooltipH
        };
        return tooltipBox.left < targetBox.right &&
               tooltipBox.right > targetBox.left &&
               tooltipBox.top < targetBox.bottom &&
               tooltipBox.bottom > targetBox.top;
    }

    if (hasCollision(pos.top, pos.left)) {
        const opposites = {
            "bottom": "top",
            "top": "bottom",
            "left": "right",
            "right": "left"
        };
        const oppositePlacement = opposites[preferredPlacement];
        const altPos = getPosition(oppositePlacement);
        pos = altPos;
    }

    tooltip.style.top = `${pos.top}px`;
    tooltip.style.left = `${pos.left}px`;
    tooltip.style.transform = ""; // clear center transform
}

function trackTourTooltip() {
    if (!tourTrackingActive) return;
    repositionTooltip();
    tourAnimationId = requestAnimationFrame(trackTourTooltip);
}

function startTour() {
    closeSettingsModal();
    currentTourStep = 0;
    
    // Auto expand all collapsible sections to make sure highlights work and items are visible
    revenuesCollapsed = false;
    expensesCollapsed = false;
    fixedChargesCollapsed = false;
    updateUI();

    const mainAppContainer = document.getElementById("main_app_container");
    if (mainAppContainer) {
        mainAppContainer.classList.add("tour-active-padding");
    }

    const overlay = document.getElementById("tour_overlay");
    const tooltip = document.getElementById("tour_tooltip");
    
    if (overlay && tooltip) {
        overlay.classList.remove("hidden");
        tooltip.classList.remove("hidden");
        tooltip.classList.add("z-[70]"); // ensure it is above overlay
        
        tourTrackingActive = true;
        trackTourTooltip();

        setTimeout(() => {
            overlay.classList.remove("opacity-0");
            showTourStep();
        }, 10);
    }
}

function showTourStep() {
    if (currentTourStep >= tourSteps.length) {
        endTour();
        return;
    }

    const step = tourSteps[currentTourStep];
    const target = document.getElementById(step.elementId);
    const tooltip = document.getElementById("tour_tooltip");

    if (!tooltip) return;

    // Update texts
    document.getElementById("tour_step_num").innerText = `Étape ${currentTourStep + 1} sur ${tourSteps.length}`;
    document.getElementById("tour_title").innerText = step.title;
    document.getElementById("tour_message").innerText = step.message;
    document.getElementById("tour_next_btn").innerText = currentTourStep === tourSteps.length - 1 ? "Terminer" : "Suivant";

    // Clear previous highlights
    document.querySelectorAll(".tour-highlight").forEach(el => {
        el.classList.remove("tour-highlight");
    });

    const isVisible = target && (target.offsetWidth > 0 || target.offsetHeight > 0);

    if (target && isVisible) {
        // Scroll target into view
        target.scrollIntoView({ behavior: "smooth", block: "center" });

        // Highlight target
        target.classList.add("tour-highlight");

        // Position tooltip and fade it in
        tooltip.classList.remove("hidden");
        tooltip.classList.add("opacity-0", "scale-95");
        
        repositionTooltip();
        
        setTimeout(() => {
            tooltip.classList.remove("opacity-0", "scale-95");
        }, 50);
    } else {
        // Fallback: center of screen
        tooltip.classList.remove("hidden");
        tooltip.classList.add("opacity-0", "scale-95");
        
        repositionTooltip();
        
        setTimeout(() => {
            tooltip.classList.remove("opacity-0", "scale-95");
        }, 50);
    }
}

function nextTourStep() {
    currentTourStep++;
    showTourStep();
}

function endTour() {
    tourTrackingActive = false;
    if (tourAnimationId) {
        cancelAnimationFrame(tourAnimationId);
        tourAnimationId = null;
    }

    const mainAppContainer = document.getElementById("main_app_container");
    if (mainAppContainer) {
        mainAppContainer.classList.remove("tour-active-padding");
    }

    const overlay = document.getElementById("tour_overlay");
    const tooltip = document.getElementById("tour_tooltip");

    if (overlay) {
        overlay.classList.add("opacity-0");
        setTimeout(() => {
            overlay.classList.add("hidden");
        }, 300);
    }
    if (tooltip) {
        tooltip.classList.add("opacity-0", "scale-95");
        setTimeout(() => {
            tooltip.classList.add("hidden");
            tooltip.style.top = "";
            tooltip.style.left = "";
            tooltip.style.transform = "";
        }, 300);
    }

    // Remove highlights
    document.querySelectorAll(".tour-highlight").forEach(el => {
        el.classList.remove("tour-highlight");
    });
}

// --- PWA SERVICE WORKER & INSTALL LOGIC ---
function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
        if (document.readyState === "complete" || document.readyState === "interactive") {
            navigator.serviceWorker.register("./sw.js")
                .then(reg => console.log("Service Worker enregistré avec succès !", reg.scope))
                .catch(err => console.error("Échec de l'enregistrement du Service Worker :", err));
        } else {
            window.addEventListener("load", () => {
                navigator.serviceWorker.register("./sw.js")
                    .then(reg => console.log("Service Worker enregistré avec succès !", reg.scope))
                    .catch(err => console.error("Échec de l'enregistrement du Service Worker :", err));
            });
        }
    }
}

let deferredPrompt = null;

function initPWAInstall() {
    const installBtn = document.getElementById("pwa_install_btn");
    if (!installBtn) return;

    window.addEventListener("beforeinstallprompt", (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI to notify the user they can install the PWA
        installBtn.classList.remove("hidden");
    });

    installBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent opening settings
        if (!deferredPrompt) return;
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
                console.log("L'utilisateur a accepté l'installation");
            } else {
                console.log("L'utilisateur a décliné l'installation");
            }
            deferredPrompt = null;
            installBtn.classList.add("hidden");
        });
    });

    window.addEventListener("appinstalled", () => {
        console.log("PWA installée !");
        deferredPrompt = null;
        installBtn.classList.add("hidden");
    });
}

// --- STORAGE PERSISTENCE LOGIC (ANTI-CLEANUP) ---
function checkStoragePersistence() {
    if (window.Capacitor) {
        updateStorageUI("capacitor");
        return;
    }
    if (navigator.storage && navigator.storage.persisted) {
        navigator.storage.persisted().then((persisted) => {
            updateStorageUI(persisted);
        }).catch(err => {
            console.error("Erreur vérification stockage :", err);
            updateStorageUI(false);
        });
    } else {
        updateStorageUI(null);
    }
}

function initStoragePersistence() {
    if (window.Capacitor) {
        updateStorageUI("capacitor");
        return;
    }
    if (navigator.storage && navigator.storage.persisted) {
        navigator.storage.persisted().then((persisted) => {
            if (persisted) {
                updateStorageUI(true);
            } else {
                navigator.storage.persist().then((granted) => {
                    updateStorageUI(granted);
                }).catch(err => {
                    console.warn("Demande de persistance automatique impossible :", err);
                    updateStorageUI(false);
                });
            }
        }).catch(() => {
            updateStorageUI(false);
        });
    } else {
        updateStorageUI(null);
    }
}

function updateStorageUI(persisted) {
    const badge = document.getElementById("storage_status_badge");
    const desc = document.getElementById("storage_status_desc");
    const btn = document.getElementById("btn_request_persistence");
    
    if (!badge || !desc || !btn) return;
    
    if (persisted === "capacitor") {
        badge.innerText = "🛡️ Application Native";
        badge.className = "text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30";
        desc.innerHTML = "<strong>Stockage natif permanent !</strong> En utilisant la version installée (APK), le système Android sécurise vos données de manière isolée et cryptée. Elles ne risquent pas d'être effacées automatiquement par le navigateur.";
        btn.classList.add("hidden");
    } else if (persisted === null) {
        badge.innerText = "Non supporté";
        badge.className = "text-[10px] font-black px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700";
        desc.innerHTML = "Votre navigateur actuel ne supporte pas la protection du stockage. Vos données risquent d'être effacées automatiquement par l'OS en cas d'espace faible. Pensez à exporter régulièrement vos données au format JSON.";
        btn.classList.add("hidden");
    } else if (persisted) {
        badge.innerText = "🛡️ Protégé";
        badge.className = "text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30";
        desc.innerHTML = "<strong>Statut persistant activé !</strong> Le navigateur a accepté de sécuriser le stockage local. Vos données ne seront pas supprimées automatiquement, même en cas de stockage faible.";
        btn.classList.add("hidden");
    } else {
        badge.innerText = "⚠️ Temporaire";
        badge.className = "text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30";
        desc.innerHTML = "Le navigateur considère vos données comme temporaires. Elles risquent d'être effacées en cas de manque d'espace disque. Vous pouvez tenter d'activer la protection manuellement ci-dessous.";
        btn.classList.remove("hidden");
    }
}

function tryRequestPersistence() {
    if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().then((granted) => {
            if (granted) {
                showGenericAlert("Protection activée !", "Le stockage est maintenant persistant. Vos données sont sécurisées contre les nettoyages automatiques.", "🛡️");
            } else {
                showGenericAlert("Protection refusée", "Le navigateur a refusé d'activer la protection automatique pour l'instant.<br><br>💡 <strong>Astuce :</strong> Ajoutez cette application à votre <strong>écran d'accueil</strong> (PWA) et ouvrez-la depuis l'icône, puis réessayez de cliquer ici pour forcer l'autorisation.", "💡");
            }
            updateStorageUI(granted);
        }).catch(err => {
            console.error("Erreur demande persistance :", err);
            checkStoragePersistence();
        });
    }
}

// --- INDEXEDDB HELPERS FOR QUICK BACKUP ---
const DB_NAME = "budget_hmr_files";
const STORE_NAME = "handles";
const KEY_NAME = "last_backup_handle";

function getDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            db.createObjectStore(STORE_NAME);
        };
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

async function saveFileHandle(handle) {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readwrite");
            const store = tx.objectStore(STORE_NAME);
            const req = store.put(handle, KEY_NAME);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    } catch (e) {
        console.error("Erreur IndexedDB lors du stockage du handle :", e);
    }
}

async function getFileHandle() {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readonly");
            const store = tx.objectStore(STORE_NAME);
            const req = store.get(KEY_NAME);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    } catch (e) {
        console.error("Erreur IndexedDB lors de la récupération du handle :", e);
        return null;
    }
}

async function verifyPermission(fileHandle, readWrite) {
    const options = {};
    if (readWrite) {
        options.mode = 'readwrite';
    }
    if ((await fileHandle.queryPermission(options)) === 'granted') {
        return true;
    }
    if ((await fileHandle.requestPermission(options)) === 'granted') {
        return true;
    }
    return false;
}

// --- QUICK BACKUP ACTION ---
async function quickExportJSON() {
    if (!('showSaveFilePicker' in window)) {
        exportJSONData();
        return;
    }

    try {
        const handle = await getFileHandle();
        if (handle) {
            const hasPermission = await verifyPermission(handle, true);
            if (hasPermission) {
                const jsonString = JSON.stringify(state, null, 2);
                const writable = await handle.createWritable();
                await writable.write(jsonString);
                await writable.close();
                hasUnsavedChanges = false;
                updateQuickSaveUI();
                showGenericAlert("Sauvegarde rapide", `Les données ont été écrasées avec succès dans votre fichier de sauvegarde local :<br><br>📁 <strong>${handle.name}</strong>`, "💾");
                return;
            }
        }
        
        // Pas de handle ou autorisation refusée -> export complet avec sélecteur de fichier
        await exportJSONData();
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error("Erreur lors de la sauvegarde rapide :", err);
            await exportJSONData();
        }
    }
}

function updateQuickSaveUI() {
    const btn = document.getElementById("btn_settings");
    if (!btn) return;

    const settingsSvg = btn.querySelector("svg");

    if (hasUnsavedChanges) {
        btn.classList.add("animate-unsaved");
        if (settingsSvg) {
            settingsSvg.classList.add("animate-spin-slow");
        }
        btn.setAttribute("title", "Réglages & Données (Modifications non sauvegardées)");
    } else {
        btn.classList.remove("animate-unsaved");
        if (settingsSvg) {
            settingsSvg.classList.remove("animate-spin-slow");
        }
        btn.setAttribute("title", "Réglages & Données");
    }
}

// --- APK DETECTION & DOWNLOAD LOGIC ---
function initApkDownload() {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isNative = !!window.Capacitor;
    const apkBtn = document.getElementById("apk_download_btn");
    
    if (apkBtn && isAndroid && !isNative) {
        apkBtn.classList.remove("hidden");
    }
}

function showApkDownloadPrompt() {
    showGenericConfirm(
        "Version APK Android",
        "Le navigateur web peut parfois vider votre cache et supprimer vos budgets enregistrés sans votre accord (notamment si votre téléphone manque d'espace).<br><br>Installer la <strong>version APK Android</strong> résout ce problème en stockant vos données de manière isolée et permanente.<br><br>Voulez-vous télécharger <strong>BUDGET-HMR.APK</strong> maintenant ?",
        "🤖",
        () => {
            const dlLink = document.createElement("a");
            dlLink.href = "./BUDGET-HMR.APK";
            dlLink.download = "BUDGET-HMR.APK";
            document.body.appendChild(dlLink);
            dlLink.click();
            document.body.removeChild(dlLink);
        }
    );
}

// --- PLATFORM SPECIFIC UI ADJUSTMENTS ---
function initPlatformSpecifics() {
    const isNative = !!window.Capacitor;
    if (isNative) {
        const shareBtn = document.getElementById("settings_share_btn");
        if (shareBtn) shareBtn.classList.add("hidden");

        const footerLinks = document.getElementById("footer_links_row");
        if (footerLinks) footerLinks.classList.add("hidden");
    }
}

// --- DYNAMIC SYSTEM BARS CONTROL (STATUS & NAVIGATION) ---
async function updateSystemBars() {
    if (window.Capacitor && window.Capacitor.Plugins) {
        const isDark = state.darkMode;
        const color = isDark ? '#0c0a09' : '#f5f5f4';
        
        // 1. Status Bar
        if (window.Capacitor.Plugins.StatusBar) {
            try {
                const StatusBar = window.Capacitor.Plugins.StatusBar;
                await StatusBar.setBackgroundColor({ color: color });
                await StatusBar.setStyle({ style: isDark ? 'DARK' : 'LIGHT' });
            } catch (e) {
                console.error("StatusBar plugin error:", e);
            }
        }
        
        // 2. Navigation Bar
        if (window.Capacitor.Plugins.NavigationBar) {
            try {
                const NavigationBar = window.Capacitor.Plugins.NavigationBar;
                await NavigationBar.setNavigationBarColor({
                    color: color,
                    darkButtons: !isDark
                });
            } catch (e) {
                console.error("NavigationBar plugin error:", e);
            }
        }
    }
}

// --- NEW BUDGET MANAGEMENT FUNCTIONS ---

function formatYearMonthFrench(ym) {
    if (!ym) return "";
    const [year, month] = ym.split("-");
    const date = new Date(year, month - 1, 1);
    const label = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatExpenseDate(dateStr, budgetMonth) {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split("-").map(Number);
        const [bYear, bMonth] = budgetMonth.split("-").map(Number);
        
        if (year === bYear && month === bMonth) {
            const d = new Date(year, month - 1, day);
            return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
        } else {
            const budgetFirstDay = new Date(bYear, bMonth - 1, 1);
            const expenseDate = new Date(year, month - 1, day);
            
            const utcBudget = Date.UTC(budgetFirstDay.getFullYear(), budgetFirstDay.getMonth(), budgetFirstDay.getDate());
            const utcExpense = Date.UTC(expenseDate.getFullYear(), expenseDate.getMonth(), expenseDate.getDate());
            
            const diffTime = utcExpense - utcBudget;
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays < 0) {
                return `${diffDays}`;
            } else {
                return expenseDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
            }
        }
    }
    return dateStr;
}

// Visual scroll lock mechanism for modals
function initModalScrollLock() {
    const updateBodyScroll = () => {
        const modals = document.querySelectorAll('.backdrop-blur-sm');
        const anyModalVisible = Array.from(modals).some(el => {
            return el && !el.classList.contains("hidden");
        });
        if (anyModalVisible) {
            document.body.classList.add("overflow-hidden");
            document.documentElement.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
            document.documentElement.classList.remove("overflow-hidden");
        }
    };
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "attributes" && mutation.attributeName === "class") {
                updateBodyScroll();
            }
        });
    });
    
    const modals = document.querySelectorAll('.backdrop-blur-sm');
    modals.forEach(el => {
        observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    });
    
    updateBodyScroll();
}

// Recap Modal opening & rendering
function openRecapModal(category) {
    const modal = document.getElementById("recap_modal");
    const titleEl = document.getElementById("recap_modal_title");
    const contentEl = document.getElementById("recap_modal_content");
    
    let title = "";
    let html = "";
    
    if (category === "revenues") {
        title = "💰 Revenus";
        state.revenues.forEach(r => {
            html += `
                <div class="flex justify-between items-center p-3 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200/40 dark:border-stone-800/40">
                    <span class="font-bold text-xs text-stone-800 dark:text-stone-300">${r.title}</span>
                    <span class="font-black text-xs text-green-600 dark:text-green-400">+ ${formatCurrency(r.amount)}</span>
                </div>
            `;
        });
        if (state.revenues.length === 0) {
            html = `<div class="text-center py-6 text-xs text-stone-400 font-bold">Aucun revenu enregistré</div>`;
        }
    } else if (category === "fixedCharges") {
        title = "⚙️ Frais Fixes";
        state.fixedCharges.forEach(c => {
            html += `
                <div class="flex justify-between items-center p-3 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200/40 dark:border-stone-800/40">
                    <span class="font-bold text-xs text-stone-800 dark:text-stone-300">${c.title}</span>
                    <span class="font-black text-xs text-red-500 dark:text-red-400">- ${formatCurrency(c.amount)}</span>
                </div>
            `;
        });
        if (state.fixedCharges.length === 0) {
            html = `<div class="text-center py-6 text-xs text-stone-400 font-bold">Aucun frais fixe enregistré</div>`;
        }
    } else if (category === "expenses") {
        title = "💸 Dépenses en Cours";
        
        // Group expenses by date key
        const groups = {};
        state.expenses.forEach(e => {
            const key = e.date || "Sans date";
            if (!groups[key]) groups[key] = [];
            groups[key].push(e);
        });
        
        // Sort keys reverse chronologically
        const getTimestamp = (str) => {
            if (!str || str === "Sans date") return 0;
            const match = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
            if (match) {
                return new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, parseInt(match[3], 10)).getTime();
            }
            const t = Date.parse(str);
            return isNaN(t) ? 0 : t;
        };
        const sortedKeys = Object.keys(groups).sort((a, b) => getTimestamp(b) - getTimestamp(a));
        
        sortedKeys.forEach(key => {
            const exps = groups[key];
            let dayText = "";
            let monthText = "";
            let dateLong = key;
            let isNegative = false;
            
            if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
                const [year, month, day] = key.split("-").map(Number);
                const dateObj = new Date(year, month - 1, day);
                
                const [bYear, bMonth] = state.budgetMonth.split("-").map(Number);
                const utcBudget = Date.UTC(bYear, bMonth - 1, 1);
                const utcExpense = Date.UTC(year, month - 1, day);
                const diffTime = utcExpense - utcBudget;
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays < 0) {
                    dayText = `${diffDays}`;
                    monthText = "Ant.";
                    dateLong = `Dépense anticipée (${dateObj.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })})`;
                    isNegative = true;
                } else {
                    dayText = `${day}`;
                    monthText = dateObj.toLocaleDateString("fr-FR", { month: "short" }).replace('.', '');
                    dateLong = dateObj.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
                    dateLong = dateLong.charAt(0).toUpperCase() + dateLong.slice(1);
                }
            } else {
                dayText = key.split(" ")[0] || "?";
                monthText = key.split(" ")[1] || "Mois";
                dateLong = key;
            }
            
            const isFem = state.settings.genderTheme === "feminin";
            const headerColorClass = isNegative 
                ? "bg-amber-500 text-white" 
                : (isFem ? "bg-pink-500 text-white" : "bg-brand-500 text-white");
                
            html += `
                <div class="space-y-2 mb-4">
                    <div class="flex items-center gap-3 border-b border-stone-100 dark:border-stone-800/60 pb-1.5 mt-2 select-none">
                        <div class="w-10 h-10 border border-stone-300 dark:border-stone-700 rounded-xl overflow-hidden flex flex-col text-center shadow-sm shrink-0">
                            <div class="${headerColorClass} text-[7px] font-black py-0.5 uppercase tracking-wider">${monthText}</div>
                            <div class="text-stone-800 dark:text-stone-200 text-xs font-black flex-1 flex items-center justify-center bg-stone-50 dark:bg-stone-900">${dayText}</div>
                        </div>
                        <div class="text-xs font-bold text-stone-600 dark:text-stone-400 capitalize-first">${dateLong}</div>
                    </div>
                    <div class="space-y-1.5 pl-2">
            `;
            
            exps.forEach(e => {
                const isRefund = e.amount < 0;
                const absAmt = Math.abs(e.amount);
                const amtColor = isRefund ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400";
                const amtSign = isRefund ? "+" : "-";
                
                html += `
                    <div class="flex justify-between items-center text-xs py-1 hover:bg-stone-50 dark:hover:bg-stone-800 px-2 rounded-lg transition-colors">
                        <span class="text-stone-700 dark:text-stone-300 font-semibold truncate max-w-[200px]">${e.title}</span>
                        <span class="font-black ${amtColor}">${amtSign} ${formatCurrency(absAmt)}</span>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        if (state.expenses.length === 0) {
            html = `<div class="text-center py-6 text-xs text-stone-400 font-bold">Aucune dépense enregistrée</div>`;
        } else {
            // --- NOUVEAU : CALCUL ET AFFICHAGE DES TOTAUX PAR TAG ---
            const tagTotals = {};
            state.expenses.forEach(e => {
                if (e.isCashDepositPending && !e.isDeposited) return; // Ignore les espèces en transit
                const tagKey = e.tag || 'divers';
                if (!tagTotals[tagKey]) tagTotals[tagKey] = 0;
                tagTotals[tagKey] += e.amount;
            });

            let summaryHTML = `<div class="grid grid-cols-2 gap-2 mb-4 bg-stone-100 dark:bg-stone-800/40 p-2.5 rounded-2xl border border-stone-200/50 dark:border-stone-800">`;
            let hasSummary = false;
            
            // Tri décroissant pour afficher les plus grosses dépenses en premier
            Object.keys(tagTotals).sort((a, b) => tagTotals[b] - tagTotals[a]).forEach(key => {
                if (tagTotals[key] === 0) return; // On masque les catégories à zéro
                hasSummary = true;
                const tagData = EXPENSE_TAGS[key] || EXPENSE_TAGS['divers'];
                summaryHTML += `
                    <div class="flex items-center justify-between bg-white dark:bg-stone-900 px-2.5 py-2 rounded-xl shadow-sm border border-stone-100 dark:border-stone-800">
                        <span class="text-[9px] font-black text-stone-500 uppercase tracking-wider flex items-center gap-1">${tagData.icon} ${tagData.label}</span>
                        <span class="text-[11px] font-black text-stone-800 dark:text-stone-200">${formatCurrency(tagTotals[key])}</span>
                    </div>
                `;
            });
            summaryHTML += `</div>`;
            
            if (hasSummary) {
                html = summaryHTML + html; // On place le résumé AU-DESSUS de la liste chronologique
            }
        }
    }
    
    titleEl.innerText = title;
    contentEl.innerHTML = html;
    
    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.querySelector(".glass-card").classList.remove("scale-95");
    }, 10);
    triggerHaptic('confirm');
}

function closeRecapModal() {
    const modal = document.getElementById("recap_modal");
    modal.classList.add("opacity-0");
    modal.querySelector(".glass-card").classList.add("scale-95");
    setTimeout(() => {
        modal.classList.add("hidden");
    }, 300);
}

// Custom Date Picker Picker control
let calendarSelectedDate = new Date();
let calendarTargetInputId = "";
let calendarTargetSpanId = "";
let calendarTargetClearBtnId = "";
let calendarMonth = 0;
let calendarYear = 2026;

function openExpenseDatePicker() {
    const val = document.getElementById("expense_date_value").value;
    openCustomDatePicker("expense_date_value", "expense_date_label", "btn_clear_expense_date", val);
}

function openEditExpenseDatePicker() {
    const val = document.getElementById("edit_expense_date_value").value;
    openCustomDatePicker("edit_expense_date_value", "edit_expense_date_label", "", val);
}

function openCustomDatePicker(targetInputId, targetSpanId, clearBtnId, initialDateVal) {
    calendarTargetInputId = targetInputId;
    calendarTargetSpanId = targetSpanId;
    calendarTargetClearBtnId = clearBtnId;
    
    const [bYear, bMonth] = state.budgetMonth.split("-").map(Number);
    let defaultDate = new Date();
    if (defaultDate.getFullYear() !== bYear || (defaultDate.getMonth() + 1) !== bMonth) {
        defaultDate = new Date(bYear, bMonth - 1, 1);
    }
    
    if (initialDateVal && /^\d{4}-\d{2}-\d{2}$/.test(initialDateVal)) {
        const [y, m, d] = initialDateVal.split("-").map(Number);
        calendarSelectedDate = new Date(y, m - 1, d);
    } else {
        calendarSelectedDate = defaultDate;
    }
    
    calendarMonth = calendarSelectedDate.getMonth();
    calendarYear = calendarSelectedDate.getFullYear();
    
    renderCalendarGrid();
    
    const modal = document.getElementById("custom_date_picker_modal");
    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.querySelector(".glass-card").classList.remove("scale-95");
    }, 10);
}

function closeCustomDatePicker() {
    const modal = document.getElementById("custom_date_picker_modal");
    modal.classList.add("opacity-0");
    modal.querySelector(".glass-card").classList.add("scale-95");
    setTimeout(() => {
        modal.classList.add("hidden");
    }, 300);
}

function renderCalendarGrid() {
    const grid = document.getElementById("calendar_days_grid");
    const monthYearSpan = document.getElementById("calendar_current_month_year");
    const selectedDateLongSpan = document.getElementById("calendar_selected_date_long");
    const selectedYearSpan = document.getElementById("calendar_selected_year");
    
    // Always center calendar around budgeted month
    const [bYear, bMonth] = state.budgetMonth.split("-").map(Number);
    calendarMonth = bMonth - 1;
    calendarYear = bYear;
    
    const monthName = new Date(calendarYear, calendarMonth, 1).toLocaleDateString('fr-FR', { month: 'long' });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    monthYearSpan.textContent = `${capitalizedMonth} ${calendarYear}`;
    
    selectedYearSpan.textContent = calendarSelectedDate.getFullYear();
    selectedDateLongSpan.textContent = calendarSelectedDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' });
    
    grid.innerHTML = "";
    
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
    const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Monday first
    
    for (let i = 0; i < offset; i++) {
        const empty = document.createElement("div");
        grid.appendChild(empty);
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement("div");
        cell.className = "h-8 w-8 flex items-center justify-center rounded-full cursor-pointer transition-colors mx-auto font-semibold text-xs";
        
        const cellDate = new Date(calendarYear, calendarMonth, day);
        const isToday = today.getDate() === day && today.getMonth() === calendarMonth && today.getFullYear() === calendarYear;
        const isSelected = calendarSelectedDate.getDate() === day && calendarSelectedDate.getMonth() === calendarMonth && calendarSelectedDate.getFullYear() === calendarYear;
        
        cell.textContent = day;
        
        if (isSelected) {
            cell.classList.add("bg-brand-500", "text-white", "font-black", "shadow-sm");
        } else if (isToday) {
            cell.classList.add("border", "border-brand-500", "dark:border-brand-400", "text-brand-600", "dark:text-brand-400", "font-bold");
        } else {
            cell.classList.add("text-stone-700", "dark:text-stone-300", "hover:bg-stone-100", "dark:hover:bg-stone-800");
        }
        
        cell.addEventListener("click", (e) => {
            e.stopPropagation();
            triggerHaptic(12);
            calendarSelectedDate = new Date(calendarYear, calendarMonth, day);
            renderCalendarGrid();
        });
        
        cell.addEventListener("dblclick", (e) => {
            e.stopPropagation();
            triggerHaptic(25);
            calendarSelectedDate = new Date(calendarYear, calendarMonth, day);
            confirmSelectedDate();
        });
        
        grid.appendChild(cell);
    }
}

function confirmSelectedDate() {
    const input = document.getElementById(calendarTargetInputId);
    const span = document.getElementById(calendarTargetSpanId);
    const clearBtn = document.getElementById(calendarTargetClearBtnId);
    
    if (input) {
        const y = calendarSelectedDate.getFullYear();
        const m = String(calendarSelectedDate.getMonth() + 1).padStart(2, '0');
        const d = String(calendarSelectedDate.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${d}`;
        
        input.value = dateStr;
        
        if (span) {
            span.textContent = calendarSelectedDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
        }
        
        if (clearBtn) {
            clearBtn.classList.remove("hidden");
        }
    }
    
    closeCustomDatePicker();
}

function clearExpenseDate() {
    const input = document.getElementById("expense_date_value");
    const span = document.getElementById("expense_date_label");
    const clearBtn = document.getElementById("btn_clear_expense_date");
    
    if (input) input.value = "";
    if (span) span.textContent = "Date : Aujourd'hui";
    if (clearBtn) clearBtn.classList.add("hidden");
    triggerHaptic(15);
}

function clearCustomDatePickerDate() {
    const input = document.getElementById(calendarTargetInputId);
    const span = document.getElementById(calendarTargetSpanId);
    const clearBtn = document.getElementById(calendarTargetClearBtnId);
    
    if (input) input.value = "";
    if (span) {
        if (calendarTargetInputId === "edit_expense_date_value") {
            span.textContent = "-";
        } else {
            span.textContent = "Date : Aujourd'hui";
        }
    }
    if (clearBtn) clearBtn.classList.add("hidden");
    
    closeCustomDatePicker();
    triggerHaptic(15);
}


// Month selection options for renewal
function getRenewalMonthOptions() {
    const options = [];
    const now = new Date();
    
    for (let i = 0; i < 3; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const monthLabel = d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
        const label = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
        options.push({ ym, label });
    }
    return options;
}

// --- GENERATION DU BILAN MENSUEL FORMAT TICKET ---
function generateBudgetPDF() {
    return new Promise((resolve, reject) => {
        const userName = state.settings.username ? state.settings.username.toUpperCase() : "HMR";
        const monthLabel = formatYearMonthFrench(state.budgetMonth);
        
        const { totalRevenues, totalFixed, totalExpenses, remaining } = calculateTotals();
        
        const groups = {};
        state.expenses.forEach(e => {
            const key = e.date || "Sans date";
            if (!groups[key]) groups[key] = [];
            groups[key].push(e);
        });
        
        const getTimestamp = (str) => {
            if (!str || str === "Sans date") return 0;
            const match = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
            if (match) {
                return new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, parseInt(match[3], 10)).getTime();
            }
            const t = Date.parse(str);
            return isNaN(t) ? 0 : t;
        };
        const sortedKeys = Object.keys(groups).sort((a, b) => getTimestamp(a) - getTimestamp(b));
        
        const maxLen = 38;
        const padLine = (left, right) => {
            let lStr = String(left);
            const rStr = String(right);
            if (lStr.length + rStr.length + 1 > maxLen) {
                lStr = lStr.substring(0, maxLen - rStr.length - 2) + "…";
            }
            const dots = maxLen - lStr.length - rStr.length;
            return lStr + ".".repeat(dots > 0 ? dots : 1) + rStr;
        };
        const makeSep = (char = "=") => char.repeat(maxLen);
        
        let pdfTx = "";
        
        pdfTx += `BUDGET ${userName}\n`;
        pdfTx += `PERIODE : ${monthLabel.toUpperCase()}\n`;
        pdfTx += `DATE    : ${new Date().toLocaleDateString("fr-FR")} - ${new Date().toLocaleTimeString("fr-FR", {hour: '2-digit', minute:'2-digit'})}\n`;
        pdfTx += makeSep("=") + "\n";
        pdfTx += `RESUME COMPTABLE\n`;
        pdfTx += makeSep("=") + "\n";
        pdfTx += padLine("TOTAL REVENUS (+)", formatCurrency(totalRevenues)) + "\n";
        pdfTx += padLine("TOTAL FRAIS FIXES (-)", formatCurrency(totalFixed)) + "\n";
        pdfTx += padLine("TOTAL DEPENSES (-)", formatCurrency(totalExpenses)) + "\n";
        pdfTx += makeSep("-") + "\n";
        pdfTx += padLine("RESTE A VIVRE NET", formatCurrency(remaining)) + "\n";
        pdfTx += makeSep("=") + "\n\n";
        
		// --- NOUVEAU : RÉPARTITION DES DÉPENSES PAR CATÉGORIE ---
		const tagTotals = {};
		state.expenses.forEach(e => {
			if (e.isCashDepositPending && !e.isDeposited) return;
			const tagKey = e.tag || 'divers';
			if (!tagTotals[tagKey]) tagTotals[tagKey] = 0;
			tagTotals[tagKey] += e.amount;
		});
		
		pdfTx += `REPARTITION DES DEPENSES\n`;
		pdfTx += makeSep("-") + "\n";
		const sortedTags = Object.keys(tagTotals).sort((a, b) => tagTotals[b] - tagTotals[a]);
		let hasTags = false;
		sortedTags.forEach(key => {
			if (tagTotals[key] === 0) return;
			hasTags = true;
			const tagData = EXPENSE_TAGS[key] || EXPENSE_TAGS['divers'];
			pdfTx += padLine(` ${tagData.icon} ${tagData.label}`, formatCurrency(tagTotals[key])) + "\n";
		});
		if (!hasTags) {
			pdfTx += ` [Aucune dépense catégorisée]\n`;
		}
		pdfTx += "\n";
	
        pdfTx += `DETAIL DES REVENUS\n`;
        pdfTx += makeSep("-") + "\n";
        if (!state.revenues || state.revenues.length === 0) {
            pdfTx += `[Aucun revenu enregistré]\n`;
        } else {
            state.revenues.forEach(r => {
                pdfTx += padLine(` • ${r.title}`, formatCurrency(r.amount)) + "\n";
            });
        }
        pdfTx += "\n";
        
        pdfTx += `DETAIL DES FRAIS FIXES\n`;
        pdfTx += makeSep("-") + "\n";
        if (!state.fixedCharges || state.fixedCharges.length === 0) {
            pdfTx += `[Aucun frais fixe enregistré]\n`;
        } else {
            state.fixedCharges.forEach(c => {
                pdfTx += padLine(` • ${c.title}`, formatCurrency(c.amount)) + "\n";
            });
        }
        pdfTx += "\n";
        
        pdfTx += `DETAIL DES OPERATIONS\n`;
        pdfTx += makeSep("=") + "\n";
        
        if (sortedKeys.length === 0) {
            pdfTx += `[Aucune opération enregistrée]\n\n`;
        } else {
            sortedKeys.forEach(key => {
                let dateLong = key;
                if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
                    const [year, month, day] = key.split("-").map(Number);
                    const dateObj = new Date(year, month - 1, day);
                    dateLong = dateObj.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
                    dateLong = dateLong.charAt(0).toUpperCase() + dateLong.slice(1);
                }
                
                pdfTx += `${dateLong.toUpperCase()}\n` + makeSep("-") + "\n";
                groups[key].forEach(e => {
                    const isRefund = e.amount < 0 || e.isCashDepositPending;
                    const absAmt = e.isCashDepositPending ? (e.originalCashAmount || Math.abs(e.amount)) : Math.abs(e.amount);
                    const sign = isRefund ? "+" : "-";
                    const formattedAmt = `${sign} ${absAmt.toFixed(2).replace('.', ',')} €`;
                    const titleStr = e.isBudgetReference ? (e.isCashDepositPending ? `[CASH] ${e.title}` : `[ENV] ${e.title}`) : e.title;
                    
                    pdfTx += padLine(` • ${titleStr}`, formattedAmt) + "\n";
                });
                pdfTx += "\n";
            });
        }
        
        if (state.budgets && state.budgets.length > 0) {
            pdfTx += makeSep("=") + "\n";
            pdfTx += `SUIVI DES ENVELOPPES DEDIEES\n`;
            pdfTx += makeSep("=") + "\n";
            
            state.budgets.forEach(budget => {
                const isFriends = budget.subType === "friends";
                const activeSpent = budget.expenses.filter(e => !e.isCashDeposit).reduce((sum, e) => sum + e.amount, 0);
                const archivedSpent = (budget.archivedExpenses || []).filter(e => !e.isCashDeposit).reduce((sum, e) => sum + e.amount, 0);
                const totalSpent = activeSpent + archivedSpent;
                const origAlloc = budget.originalAllocated || budget.allocated;
                
                let displayAmount = isFriends ? (origAlloc + totalSpent) : (origAlloc - totalSpent);
                let labelDisplay = isFriends ? `PART ${userName}` : "SOLDE DISPONIBLE";
                
                let statusLabel = budget.closed ? "CLOTUREE" : "ACTIVE";
                if (typeof budgetRenewalActions !== "undefined" && budgetRenewalActions[budget.id]) {
                    statusLabel = budgetRenewalActions[budget.id] === "carry" ? "REPORTEE" : "CLOTUREE";
                }
                
                pdfTx += `>>> ENVELOPPE : ${budget.title.toUpperCase()} [${statusLabel}]\n`;
                pdfTx += padLine("  Montant alloué initial", formatCurrency(origAlloc)) + "\n";
                pdfTx += padLine(`  ${labelDisplay}`, formatCurrency(displayAmount)) + "\n";
                pdfTx += `  Détail des mouvements :\n`;
                
                let allOps = [];
                if (isFriends) {
                    allOps.push({ title: "Dépense de départ", amount: origAlloc, isCash: false, isArchived: false });
                }
                allOps = [...allOps, ...(budget.archivedExpenses || []), ...budget.expenses];
                
                if (allOps.length > 0) {
                    allOps.forEach(op => {
                        const isOpRefund = op.amount < 0;
                        const opSign = isOpRefund ? "+" : "-";
                        const formattedOpAmt = `${opSign} ${Math.abs(op.amount).toFixed(2).replace('.', ',')} €`;
                        const prefix = op.isCash ? "   [CASH] " : "   • ";
                        const archLabel = op.isArchived ? " (PREC)" : "";
                        
                        pdfTx += padLine(`${prefix}${op.title}${archLabel}`, formattedOpAmt) + "\n";
                    });
                } else {
                    pdfTx += `   [Aucun mouvement enregistré]\n`;
                }
                pdfTx += makeSep("-") + "\n\n";
            });
        }
        
        pdfTx += makeSep("=") + "\n";
        pdfTx += `FIN DE TICKET — MERCI\n`;
        pdfTx += makeSep("=") + "\n";
        
        // Enregistrement automatique dans l'archive locale
        const archiveId = `arch_${state.budgetMonth}_main`;
        if (!state.ticketArchives) state.ticketArchives = [];
        state.ticketArchives = state.ticketArchives.filter(a => a.id !== archiveId);
        state.ticketArchives.push({
            id: archiveId,
            date: state.budgetMonth,
            type: "Mensuel",
            title: `Bilan ${formatYearMonthFrench(state.budgetMonth)}`,
            rawText: pdfTx
        });
        saveState();
        
        let htmlString = `<div style="width: 302px; font-family: monospace; font-size: 9pt; line-height: 1.3; color: #000000; background: #ffffff; padding: 10px; box-sizing: border-box; margin: 0 auto;">`;
        htmlString += `<pre style="font-family: monospace; font-size: 9pt; line-height: 1.3; white-space: pre-wrap; margin: 0; padding: 0; border: none; background: none; color: #000000;">${pdfTx}</pre>`;
        htmlString += `</div>`;
        
        const tempDiv = document.createElement("div");
        tempDiv.style.position = "absolute"; tempDiv.style.top = "-9999px"; tempDiv.innerHTML = htmlString;
        document.body.appendChild(tempDiv);
        const measuredHeightMm = Math.ceil(tempDiv.offsetHeight * 0.264583) + 8;
        document.body.removeChild(tempDiv);

        const opt = {
            margin: [2, 2, 2, 2],
            filename: `Bilan_Budget_${state.budgetMonth}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false, scrollY: 0, scrollX: 0 },
            jsPDF: { unit: 'mm', format: [80, measuredHeightMm], orientation: 'portrait' }
        };
        
        document.body.classList.remove("overflow-hidden");
        document.documentElement.classList.remove("overflow-hidden");
        
        html2pdf().set(opt).from(htmlString).toPdf().outputPdf('blob').then(async (blob) => {
            const fileName = `Bilan_Budget_${state.budgetMonth}.pdf`;
            const isNativeAPK = window.Capacitor && window.Capacitor.isNativePlatform();
            const isMobileWebView = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.chrome;

            if (isNativeAPK || isMobileWebView) {
                const fs = window.Capacitor?.Plugins?.Filesystem;
                if (fs) {
                    try {
                        const base64Data = await new Promise((res, rej) => {
                            const reader = new FileReader();
                            reader.onloadend = () => res(reader.result.split(',')[1]);
                            reader.onerror = rej;
                            reader.readAsDataURL(blob);
                        });
                        await fs.writeFile({ path: fileName, data: base64Data, directory: 'DOWNLOAD' });
                        alert("PDF enregistré dans tes Téléchargements.");
                        resolve();
                        return;
                    } catch (err) {
                        await shareBlob(blob, fileName, `Bilan Budget ${monthLabel}`, `Bilan de budget`);
                    }
                } else {
                    await shareBlob(blob, fileName, `Bilan Budget ${monthLabel}`, `Bilan de budget`);
                }
            } else {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
            document.body.classList.add("overflow-x-hidden");
            resolve();
        }).catch(err => {
            document.body.classList.add("overflow-x-hidden");
            reject(err);
        });
    });
}

// --- AUTOMATISATION DES TICKETS D'ENVELOPPE ---
function updateEnvelopeTicket(budgetId) {
    const budget = state.budgets.find(b => b.id === budgetId);
    if (!budget) return;

    const userName = state.settings.username ? state.settings.username.toUpperCase() : "HMR";
    const isFriends = budget.subType === "friends";
    
    const activeSpent = budget.expenses.filter(e => !e.isCashDeposit).reduce((sum, e) => sum + e.amount, 0);
    const archivedSpent = (budget.archivedExpenses || []).filter(e => !e.isCashDeposit).reduce((sum, e) => sum + e.amount, 0);
    const totalSpent = activeSpent + archivedSpent;
    const origAlloc = budget.originalAllocated || budget.allocated;
    
    let displayAmount = isFriends ? (origAlloc + totalSpent) : (origAlloc - totalSpent);
    let labelDisplay = isFriends ? `PART ${userName}` : "SOLDE DISPONIBLE";
    const statusLabel = budget.closed ? "CLOTUREE" : "ACTIVE";

    const maxLen = 38;
    const padLine = (left, right) => {
        let lStr = String(left);
        const rStr = String(right);
        if (lStr.length + rStr.length + 1 > maxLen) {
            lStr = lStr.substring(0, maxLen - rStr.length - 2) + "…";
        }
        const dots = maxLen - lStr.length - rStr.length;
        return lStr + ".".repeat(dots > 0 ? dots : 1) + rStr;
    };
    const makeSep = (char = "=") => char.repeat(maxLen);

    let receiptTx = "";
    receiptTx += `TICKET ENVELOPPE : ${budget.title.toUpperCase()}\n`;
    receiptTx += `PROPRIETAIRE     : ${userName}\n`;
    receiptTx += `STATUT           : ${statusLabel}\n`;
    
    // Formatage de la date d'ouverture
    let createdStr = budget.createdDate || getTodayDateString();
    if (/^\d{4}-\d{2}-\d{2}$/.test(createdStr)) {
        const [y, m, d] = createdStr.split("-");
        createdStr = `${d}/${m}/${y}`;
    }
    
    receiptTx += `OUVERTURE        : ${createdStr}\n`;
    receiptTx += `DERNIERE MAJ     : ${new Date().toLocaleDateString("fr-FR")} - ${new Date().toLocaleTimeString("fr-FR", {hour: '2-digit', minute:'2-digit'})}\n`;
    receiptTx += makeSep("=") + "\n";
    receiptTx += padLine("MONTANT ALLOUE INITIAL", formatCurrency(origAlloc)) + "\n";
    receiptTx += padLine(labelDisplay, formatCurrency(displayAmount)) + "\n";
    receiptTx += makeSep("-") + "\n";
    receiptTx += `JOURNAL DES MOUVEMENTS\n`;
    receiptTx += makeSep("=") + "\n";

    let allOps = [];
    if (isFriends) {
        allOps.push({ title: "Dépense de départ", amount: origAlloc, isCash: false, isArchived: false, date: budget.createdDate });
    }
    allOps = [...allOps, ...(budget.archivedExpenses || []).map(o => ({...o, isArchived: true})), ...budget.expenses];

    if (allOps.length > 0) {
        allOps.forEach(op => {
            const isOpRefund = op.amount < 0;
            const opSign = isOpRefund ? "+" : "-";
            const formattedOpAmt = `${opSign} ${Math.abs(op.amount).toFixed(2).replace('.', ',')} €`;
            const prefix = op.isCash ? "[CASH] " : "";
            const archLabel = op.isArchived ? " (PREC)" : "";
            const dateLabel = (op.date && op.date.includes('-')) ? `[${op.date.split('-').slice(1).reverse().join('/')}] ` : "";
            receiptTx += padLine(` • ${dateLabel}${prefix}${op.title}${archLabel}`, formattedOpAmt) + "\n";
        });
    } else {
        receiptTx += `[Aucun mouvement enregistré]\n`;
    }

    receiptTx += makeSep("=") + "\n";
    receiptTx += `BUDGETHMR — FIN DE TICKET\n`;
    receiptTx += makeSep("=") + "\n";

    // Mise à jour de l'archive (écrase l'ancienne version si elle existe)
    const archiveId = `arch_env_${budget.id}`;
    if (!state.ticketArchives) state.ticketArchives = [];
    state.ticketArchives = state.ticketArchives.filter(a => a.id !== archiveId);
    
    state.ticketArchives.push({
        id: archiveId,
        date: state.budgetMonth,
        type: "Enveloppe",
        title: `Ticket ${budget.title} (${createdStr})`,
        rawText: receiptTx,
        budgetId: budget.id
    });
}

function viewEnvelopeTicket(budgetId) {
    // Force la mise à jour avant ouverture pour être certain d'avoir la dernière version
    updateEnvelopeTicket(budgetId);
    saveState();
    openArchiveModal(`arch_env_${budgetId}`);
}

// Capacitor and web-compatible sharing
async function shareBlob(blob, filename, shareText = 'Partager', dialogTitle = 'Enregistrer ou envoyer le fichier') {
    const blobToBase64 = (b) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(b);
        });
    };

    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Filesystem && window.Capacitor.Plugins.Share) {
        try {
            const { Filesystem, Share } = window.Capacitor.Plugins;
            const base64Data = await blobToBase64(blob);
            const rawBase64 = base64Data.split(',')[1];
            
            await Filesystem.writeFile({
                path: filename,
                data: rawBase64,
                directory: 'CACHE'
            });

            const fileUriObj = await Filesystem.getUri({
                path: filename,
                directory: 'CACHE'
            });

            await Share.share({
                title: filename,
                files: [fileUriObj.uri],
                dialogTitle: dialogTitle
            });
            return true;
        } catch (capShareErr) {
            console.error("Capacitor Native Share failed:", capShareErr);
            const errStr = String(capShareErr).toLowerCase();
            if (!errStr.includes("cancel") && !errStr.includes("dismiss") && !errStr.includes("abort")) {
                showGenericAlert("Erreur de partage", "Échec du partage : " + (capShareErr.message || capShareErr), "❌");
            }
            return false;
        }
    }

    const file = new File([blob], filename, { type: blob.type });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({
                files: [file],
                title: filename,
                text: shareText
            });
            return true;
        } catch (shareErr) {
            console.log("Web Share failed or cancelled, falling back to download link:", shareErr);
            if (shareErr.name === 'AbortError') return true;
        }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
}

// --- DEDICATED BUDGETS (ENVELOPES) MANAGEMENT ---
function switchDashboardTab(tab) {
    activeTab = tab;
    triggerHaptic(10);
    
    const tabBtnMain = document.getElementById("tab_btn_main");
    const tabBtnBudgets = document.getElementById("tab_btn_budgets");
    
    const mainContent = document.getElementById("main_dashboard_content");
    const budgetsContent = document.getElementById("budgets_dashboard_content");
    
    if (tab === "main") {
        if (tabBtnMain) tabBtnMain.className = "flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg text-center transition-all bg-white text-stone-900 shadow-sm";
        if (tabBtnBudgets) tabBtnBudgets.className = "flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg text-center transition-all text-white/80 hover:text-white font-bold";
        
        if (mainContent) mainContent.classList.remove("hidden");
        if (budgetsContent) budgetsContent.classList.add("hidden");
    } else {
        if (tabBtnMain) tabBtnMain.className = "flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg text-center transition-all text-white/80 hover:text-white font-bold";
        if (tabBtnBudgets) tabBtnBudgets.className = "flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg text-center transition-all bg-white text-stone-900 shadow-sm";
        
        if (mainContent) mainContent.classList.add("hidden");
        if (budgetsContent) budgetsContent.classList.remove("hidden");
        
        renderBudgetsList();
    }
}

function confirmCreateBudget() {
    const titleInput = document.getElementById("exp_title");
    const amountInput = document.getElementById("exp_amount");

    const title = toTitleCase(titleInput.value.trim());
    let amountStr = amountInput.value.trim().replace(",", ".");
    const amount = parseFloat(amountStr);

    if (!title || isNaN(amount) || amount <= 0) {
        const form = document.getElementById("expense_form");
        if (form) {
            form.classList.add("animate-shake");
            setTimeout(() => form.classList.remove("animate-shake"), 400);
        }
        return;
    }

    pendingBudgetTitle = title;
    pendingBudgetAmount = amount;
    pendingBudgetSubType = "classic"; // default
	pendingBudgetTag = document.getElementById("exp_tag").value || "divers";
	
    document.getElementById("budget_funding_title").innerText = title;
    document.getElementById("budget_funding_amount").innerText = formatCurrency(amount);

    // Reset wizard steps
    document.getElementById("budget_creation_step_type").classList.remove("hidden");
    document.getElementById("budget_creation_step_funding").classList.add("hidden");

    const modal = document.getElementById("budget_funding_modal");
    if (modal) {
        modal.classList.remove("hidden");
        setTimeout(() => {
            modal.classList.remove("opacity-0");
            modal.querySelector(".glass-card").classList.remove("scale-95");
        }, 10);
    }
    triggerHaptic(10);
}

function selectBudgetSubType(subType) {
    pendingBudgetSubType = subType;
    handleBudgetFundingChoice("deducted");
}

function goBackToBudgetSubTypeSelection() {
    document.getElementById("budget_creation_step_type").classList.remove("hidden");
    document.getElementById("budget_creation_step_funding").classList.add("hidden");
    triggerHaptic(10);
}

function closeBudgetFundingModal() {
    const modal = document.getElementById("budget_funding_modal");
    if (modal) {
        modal.classList.add("opacity-0");
        modal.querySelector(".glass-card").classList.add("scale-95");
        setTimeout(() => {
            modal.classList.add("hidden");
        }, 300);
    }
}

function handleBudgetFundingChoice(type) {
    closeBudgetFundingModal();
    
    const budgetId = "b_" + Date.now();
    const mainTransactionId = "exp_budget_" + Date.now();
    
    const newBudget = {
        id: budgetId,
        title: pendingBudgetTitle,
        allocated: pendingBudgetAmount,
        originalAllocated: pendingBudgetAmount,
        type: type, // "deducted" or "independent"
        subType: pendingBudgetSubType, // "classic" or "friends"
        expenses: [],
        archivedExpenses: [],
        mainTransactionId: mainTransactionId,
        createdDate: getTodayDateString(),
		tag: pendingBudgetTag
    };
    
    state.budgets = state.budgets || [];
    state.budgets.push(newBudget);
    
    if (type === "deducted") {
        const titlePrefix = pendingBudgetSubType === "friends" ? "Avance" : "Enveloppe";
        const budgetExpense = {
            id: mainTransactionId,
            title: `${titlePrefix} : ${pendingBudgetTitle}`,
            amount: pendingBudgetAmount,
            date: getTodayDateString(),
            isBudgetReference: true,
            budgetId: budgetId,
			tag: pendingBudgetTag
        };
        state.expenses.push(budgetExpense);
    }
    
	updateEnvelopeTicket(budgetId);
    saveState();
    
    // Clear inputs
    document.getElementById("exp_title").value = "";
    document.getElementById("exp_amount").value = "";
    clearExpenseDate();
	document.getElementById("exp_tag").value = "divers";
    renderCompactTags("tag_selector_container", "exp_tag", "");
    
    updateUI();
    switchDashboardTab('budgets');
    
    triggerHaptic('success');
    showSuccessAnimation();
}

function getTodayDateString() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function renderBudgetsList() {
    const container = document.getElementById("budgets_dashboard_content");
    if (!container) return;

    // Capture which histories were open before clearing the DOM
    const openHistories = {};
    state.budgets = state.budgets || [];
    
    // Only process active (non-closed) budgets
    const activeBudgets = state.budgets.filter(b => !b.closed);
    
    activeBudgets.forEach(budget => {
        const historyEl = document.getElementById(`budget_history_block_${budget.id}`);
        if (historyEl && !historyEl.classList.contains("hidden")) {
            openHistories[budget.id] = true;
        }
    });

    container.innerHTML = "";

    if (activeBudgets.length === 0) {
        container.innerHTML = `
            <div class="glass-card text-center py-10 text-stone-400 space-y-2 select-none">
                <span class="text-4xl">🤷‍♂️</span>
                <p class="font-bold text-sm text-stone-700 dark:text-stone-300">Aucune enveloppe dédiée</p>
                <p class="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-semibold max-w-xs mx-auto">
                    Créez une enveloppe depuis la Saisie Rapide sur le Solde Principal pour mieux organiser vos enveloppes de dépenses (courses, vacances, cadeaux...).
                </p>
            </div>
        `;
        return;
    }

    activeBudgets.forEach(budget => {
        const isFriends = budget.subType === "friends";
        
        // Sum up active operations (new month)
        const activeSpent = budget.expenses.filter(e => !e.isCashDeposit).reduce((sum, e) => sum + e.amount, 0);
        const activeRefunds = budget.expenses.filter(e => e.amount < 0 && !e.isCashDeposit).reduce((sum, e) => sum + Math.abs(e.amount), 0);
        const activeExpenses = budget.expenses.filter(e => e.amount > 0 && !e.isCashDeposit).reduce((sum, e) => sum + e.amount, 0);
        
        // Sum up archived operations (from previous months)
        const archivedSpent = (budget.archivedExpenses || []).filter(e => !e.isCashDeposit).reduce((sum, e) => sum + e.amount, 0);
        const archivedRefunds = (budget.archivedExpenses || []).filter(e => e.amount < 0 && !e.isCashDeposit).reduce((sum, e) => sum + Math.abs(e.amount), 0);
        const archivedExpenses = (budget.archivedExpenses || []).filter(e => e.amount > 0 && !e.isCashDeposit).reduce((sum, e) => sum + e.amount, 0);
        
        // Total sums across all months
        const totalSpent = activeSpent + archivedSpent;
        const totalRefunds = activeRefunds + archivedRefunds;
        const totalExpenses = activeExpenses + archivedExpenses;
        
        const origAlloc = budget.originalAllocated || budget.allocated;
        const totalAdvanced = origAlloc + totalExpenses;
        
        let displayAmount = 0;
        let isOverdrawn = false;
        let pct = 0;
        let progressColor = "bg-emerald-500";
        let labelDisplay = "Disponible";
        let subTextHTML = "";
        let cashAvailable = 0;
        
        if (isFriends) {
            const partUtilisateur = origAlloc + totalSpent;
            // Cash available counts all active and archived cash operations that are not yet deposited
            const allCashOps = [...(budget.archivedExpenses || []), ...budget.expenses].filter(e => e.isCash && !e.isDeposited);
            cashAvailable = Math.max(0, - allCashOps.reduce((sum, e) => sum + e.amount, 0));
            
            displayAmount = partUtilisateur;
            isOverdrawn = partUtilisateur > 0.009; // Red if still out-of-pocket
            labelDisplay = "Part utilisateur";
            
            pct = totalAdvanced > 0 ? (totalRefunds / totalAdvanced) * 100 : 0;
            pct = Math.min(100, Math.max(0, pct));
            
            if (pct >= 100) {
                progressColor = "bg-emerald-500";
            } else if (pct >= 50) {
                progressColor = "bg-yellow-500";
            } else {
                progressColor = "bg-orange-500";
            }
            
            subTextHTML = `
                <span>Remboursé: ${formatCurrency(totalRefunds)}</span>
                <span>Avancé: ${formatCurrency(totalAdvanced)}</span>
            `;
        } else {
            const remaining = origAlloc - totalSpent;
            displayAmount = remaining;
            isOverdrawn = remaining < 0;
            labelDisplay = "Disponible";
            
            if (isOverdrawn) {
                pct = 100;
                progressColor = "bg-red-500 animate-pulse";
            } else {
                pct = (remaining / origAlloc) * 100;
                pct = Math.min(100, Math.max(0, pct));
                if (pct <= 25) {
                    progressColor = "bg-orange-500";
                } else {
                    progressColor = "bg-emerald-500";
                }
            }
            
            subTextHTML = `
                <span>Dépensé: ${formatCurrency(totalSpent)}</span>
                <span>Alloué: ${formatCurrency(origAlloc)}</span>
            `;
        }
        
        const badgeText = budget.type === "deducted" ? "Déduit du Reste à Vivre" : (isFriends ? "💵 Espèces" : "Source Indépendante");
        
        let opsHTML = "";
        let allOps = [];
        if (isFriends) {
            allOps.push({
                id: "op_init_" + budget.id,
                title: "Dépense de départ",
                amount: origAlloc,
                date: budget.createdDate || (state.budgetMonth + "-01"),
                isCash: false,
                isInitialAdvance: true
            });
        }
        allOps = [
            ...allOps,
            ...(budget.archivedExpenses || []),
            ...budget.expenses
        ];
        
        allOps.forEach(op => {
            const isRefund = op.amount < 0;
            const absAmt = Math.abs(op.amount);
            const amtColor = isRefund ? "text-green-600 dark:text-green-400 font-bold" : "text-red-500 dark:text-red-400 font-bold";
            const amtSign = isRefund ? "+" : "-";
            
            const archivedBadge = op.isArchived 
                ? `<span class="inline-block text-[8px] font-extrabold bg-stone-100 dark:bg-stone-900 text-stone-500 dark:text-stone-400 border border-stone-300 dark:border-stone-700/60 px-1.5 py-0.5 rounded select-none mr-1">Mois préc.</span>` 
                : '';
                
            const deleteButton = (op.isArchived || op.isInitialAdvance)
                ? `<div class="w-6.5 h-6.5"></div>`
                : `<button onclick="deleteBudgetOperation('${budget.id}', '${op.id}')" class="w-6.5 h-6.5 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all flex items-center justify-center font-bold text-[10px] shadow-sm active:scale-90">
                       ✕
                   </button>`;
            
            const isEditable = !op.isInitialAdvance && !op.isCashDeposit;
            const clickAttr = isEditable ? `onclick="openEditItem('budgetOperation', '${op.id}', '${budget.id}')"` : '';
            const cursorClass = isEditable ? 'cursor-pointer hover:text-brand-500 transition-colors group/op-click' : '';
            const editIndicator = isEditable ? `<span class="text-[8px] font-bold text-brand-500 opacity-0 group-hover/op-click:opacity-100 transition-all ml-1">👁️</span>` : '';
                       
            let depositStatusBadge = "";
            if (op.isCash && op.amount < 0) {
                if (op.isDeposited) {
                    const mainTx = state.expenses.find(e => e.id === op.depositTxId);
                    const isConfirmed = !mainTx || mainTx.isDeposited;
                    if (isConfirmed) {
                        depositStatusBadge = `<span class="inline-flex items-center gap-0.5 text-[8px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded select-none ml-1">✅ Déposé</span>`;
                    } else {
                        depositStatusBadge = `<span class="inline-flex items-center gap-0.5 text-[8px] font-black bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded select-none ml-1 animate-pulse">⏳ En cours</span>`;
                    }
                } else {
                    depositStatusBadge = `<span class="inline-flex items-center gap-0.5 text-[8px] font-black bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded select-none ml-1">🏦 Non déposé</span>`;
                }
            }
            
            opsHTML += `
                <div class="flex items-center justify-between py-2.5 border-b border-stone-200/60 dark:border-stone-800/40 text-[13px] md:text-sm ${op.isArchived ? 'opacity-70' : ''}">
                    <div ${clickAttr} class="min-w-0 flex-1 pr-2 ${cursorClass}">
                        <span class="font-bold text-stone-800 dark:text-stone-300 truncate block">
                            ${op.isCash ? '💵 ' : ''}${archivedBadge}${op.title}${depositStatusBadge}${editIndicator}
                        </span>
                    </div>
                    <div class="flex items-center gap-2.5 shrink-0">
                        <span class="${amtColor} font-black">${amtSign} ${formatCurrency(absAmt)}</span>
                        ${deleteButton}
                    </div>
                </div>
            `;
        });
        
        if (allOps.length === 0) {
            opsHTML = `<div class="text-center py-5 text-[11px] md:text-xs text-stone-400 font-bold select-none">Aucune opération dans cette enveloppe</div>`;
        }

        const historyWasOpen = !!openHistories[budget.id];
        const historyClass = historyWasOpen ? "" : "hidden";
        const chevronTransform = historyWasOpen ? "style=\"transform: rotate(180deg)\"" : "";

        const cardClass = isFriends 
            ? "glass-card bg-gradient-to-br from-indigo-100/60 to-indigo-50/40 dark:from-indigo-950/60 dark:to-stone-900/80 border-indigo-300/50 dark:border-indigo-500/15"
            : "glass-card bg-gradient-to-br from-emerald-100/60 to-emerald-50/40 dark:from-emerald-950/20 dark:to-stone-900/60 border-emerald-300/40 dark:border-emerald-500/15";
			const cardIcon = isFriends ? "👥" : "🎯";

        let buttonsHTML = "";
        if (isFriends) {
            buttonsHTML = `
                <div class="space-y-2 col-span-2">
                    <div class="grid grid-cols-2 gap-2">
                        <button onclick="addBudgetOperation('${budget.id}', 'refund', false)" class="h-11 bg-gradient-to-b from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 text-white font-black rounded-xl border-t border-emerald-400 dark:border-emerald-500/30 shadow-[0_3px_0_#047857] dark:shadow-[0_3px_0_#000000] transition-all active:translate-y-[3px] active:shadow-none flex items-center justify-center gap-1 text-[9px] uppercase tracking-wider">
                            📱 Remb. Numérique
                        </button>
                        <button onclick="addBudgetOperation('${budget.id}', 'expense', false)" class="h-11 bg-gradient-to-b from-stone-100 to-stone-200 dark:from-stone-700 dark:to-stone-800 text-emerald-600 dark:text-emerald-400 font-black rounded-xl border-t border-white dark:border-stone-600 shadow-[0_3px_0_#cbd5e1] dark:shadow-[0_3px_0_#000000] transition-all active:translate-y-[3px] active:shadow-none flex items-center justify-center gap-1 text-[9px] uppercase tracking-wider">
                            💳 Dépense CB
                        </button>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <button onclick="addBudgetOperation('${budget.id}', 'refund', true)" class="h-11 bg-gradient-to-b from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 text-white font-black rounded-xl border-t border-amber-400 dark:border-amber-500/30 shadow-[0_3px_0_#b45309] dark:shadow-[0_3px_0_#000000] transition-all active:translate-y-[3px] active:shadow-none flex items-center justify-center gap-1 text-[9px] uppercase tracking-wider">
                            💵 Remb. Espèces
                        </button>
                        <button onclick="addBudgetOperation('${budget.id}', 'expense', true)" class="h-11 bg-gradient-to-b from-stone-100 to-stone-200 dark:from-stone-700 dark:to-stone-800 text-amber-600 dark:text-amber-500 font-black rounded-xl border-t border-white dark:border-stone-600 shadow-[0_3px_0_#cbd5e1] dark:shadow-[0_3px_0_#000000] transition-all active:translate-y-[3px] active:shadow-none flex items-center justify-center gap-1 text-[9px] uppercase tracking-wider">
                            🪙 Dépense Espèces
                        </button>
                    </div>
                </div>
            `;
        } else {
            buttonsHTML = `
                <div class="grid grid-cols-2 gap-2 col-span-2 w-full">
                    <button onclick="addBudgetOperation('${budget.id}', 'expense', false)" class="h-11 bg-gradient-to-b from-stone-800 to-stone-900 dark:from-stone-200 dark:to-stone-300 text-white dark:text-stone-900 font-black rounded-xl border-t border-stone-700 dark:border-white/60 shadow-[0_3px_0_#44403c] dark:shadow-[0_3px_0_#000000] transition-all active:translate-y-[3px] active:shadow-none text-[10px] uppercase tracking-wider">
                        ➖ Dépense
                    </button>
                    <button onclick="addBudgetOperation('${budget.id}', 'refund', false)" class="h-11 bg-gradient-to-b from-stone-100 to-stone-200 dark:from-stone-700 dark:to-stone-800 text-stone-700 dark:text-stone-300 font-black rounded-xl border-t border-white dark:border-stone-600 shadow-[0_3px_0_#cbd5e1] dark:shadow-[0_3px_0_#000000] transition-all active:translate-y-[3px] active:shadow-none text-[10px] uppercase tracking-wider">
                        ➕ Remboursement
                    </button>
                </div>
            `;
        }

        const card = document.createElement("div");
        // On ajoute bien "relative overflow-hidden" ici pour fixer le rabat
        card.className = `${cardClass} p-5 space-y-4 relative overflow-hidden`;
        
        // Look skeuomorphique calqué sur les vrais tickets de caisse de l'app
        const ticketColors = isFriends
            ? "bg-[#eef6fc] dark:bg-[#121921] text-[#1a2836] dark:text-[#cedee8] border-[#c8d9e6] dark:border-[#3d4f64]"
            : "bg-[#faf6ee] dark:bg-[#1e1b15] text-[#2a2720] dark:text-[#e2dbcd] border-[#e5dcc5] dark:border-[#4d4433]";
			
        card.innerHTML = `
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-2.5 bg-stone-900/5 dark:bg-white/5 rounded-b-lg border-x border-b border-stone-300/40 dark:border-stone-700/20 pointer-events-none"></div>

            <div class="flex justify-between items-start pt-1.5">
                <div>
                    <h3 class="text-base font-black uppercase tracking-tight flex items-center gap-1.5 text-stone-800 dark:text-stone-100">
                        <span>${cardIcon}</span> ${budget.title}
                    </h3>
                    <span class="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-stone-300 dark:border-stone-700 mt-1.5 select-none">
                        ${badgeText}
                    </span>
                </div>
                <div class="text-right select-none">
                    <span class="block text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-1">${labelDisplay}</span>
                    
                    <div class="relative overflow-hidden inline-flex items-center justify-end bg-stone-900 dark:bg-black/35 border border-stone-300 dark:border-stone-800 px-3 py-1 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] dark:shadow-[inset_0_3px_6px_rgba(0,0,0,0.6)] before:absolute before:inset-0 before:bg-gradient-to-tr before:from-transparent before:via-white/5 before:to-transparent before:pointer-events-none">
                        <span class="font-mono text-sm md:text-base font-black tracking-tight ${isOverdrawn ? 'text-red-500 dark:text-red-400 drop-shadow-[0_0_2px_rgba(239,68,68,0.4)]' : 'text-emerald-600 dark:text-emerald-400 drop-shadow-[0_0_2px_rgba(52,211,153,0.4)]'} relative z-10">
                            ${formatCurrency(displayAmount)}
                        </span>
                    </div>
                    ${isFriends ? `
                    <div class="mt-1.5 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-tight flex items-center justify-end gap-1 select-none">
                        <span>💵 Espèces dispo :</span>
                        <span class="font-mono font-black text-emerald-600 dark:text-emerald-400 bg-stone-100 dark:bg-stone-900 px-1 py-0.5 rounded-xl border border-stone-200 dark:border-stone-800">${formatCurrency(Math.max(0, cashAvailable))}</span>
                        ${cashAvailable > 0.009 ? `
                        <button onclick="depositBudgetCash('${budget.id}')" class="ml-1 px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold uppercase active:scale-95 transition-all text-[8px]">🏦 Déposer</button>
                        ` : ''}
                    </div>
                    ` : ''}
                </div>
            </div>

            <!-- Remaining progress bar -->
            <div class="space-y-2 select-none pt-1">
                <div class="w-full bg-stone-200/60 dark:bg-stone-800/80 h-3 rounded-xl overflow-hidden border border-stone-300/50 dark:border-stone-700/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                    <div class="${progressColor} h-full rounded-xl transition-all duration-300 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:8px_8px]" style="width: ${pct}%"></div>
                </div>
                <div class="flex justify-between text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    ${subTextHTML}
                </div>
            </div>

            <!-- Enregistrement d'une nouvelle opération (Toujours visible) -->
				<div class="space-y-2.5 pt-3.5 border-t border-stone-200 dark:border-stone-800">
                <span class="block text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-wider select-none">Nouvelle Opération</span>
                <div class="grid grid-cols-3 gap-2">
                    <div class="col-span-2">
                        <input type="text" id="budget_op_title_${budget.id}" placeholder="Opération (ex: Courses...)" class="form-input h-11 text-xs md:text-sm font-mono font-bold bg-stone-950/[0.03] dark:bg-black/40 text-stone-800 dark:text-stone-100 border border-stone-700 dark:border-stone-800/80 rounded-xl shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)] focus:ring-1 focus:ring-stone-500 placeholder-stone-400 dark:placeholder-stone-600" autocomplete="off" onblur="this.value = toTitleCase(this.value)">
                    </div>
                    <div class="relative">
                        <input type="text" inputmode="decimal" id="budget_op_amount_${budget.id}" placeholder="0,00" class="form-input h-11 text-right pr-6 text-xs md:text-sm font-mono font-black bg-stone-950/[0.03] dark:bg-black/40 text-stone-800 dark:text-stone-100 border border-stone-700 dark:border-stone-800/80 rounded-xl shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)] focus:ring-1 focus:ring-stone-500 placeholder-stone-400 dark:placeholder-stone-600" oninput="normalizeAmountInput(event)">
                        <span class="absolute right-2 top-1/2 -translate-y-1/2 font-mono font-bold text-stone-400 dark:text-stone-600 text-xs pointer-events-none">€</span>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2 mt-1">
                    ${buttonsHTML}
                </div>
            </div>

            <!-- Historique des opérations (Repliable) -->
            <div class="pt-1.5 select-none border-t border-stone-200 dark:border-stone-800">
                <button onclick="toggleBudgetOpHistory('${budget.id}')" class="w-full flex justify-between items-center py-3 text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 hover:opacity-80">
                    <span>🛒 Historique des opérations (${allOps.length})</span>
                    <span id="budget_history_chevron_${budget.id}" class="text-[10px] transition-transform duration-200" ${chevronTransform}>▼</span>
                </button>
                
                <div id="budget_history_block_${budget.id}" class="${historyClass} space-y-2 mt-2.5 max-h-48 overflow-y-auto pr-1 hide-scrollbar">
                    ${opsHTML}
                </div>
            </div>

			<div class="pt-2 border-t border-stone-200 dark:border-stone-800 select-none grid grid-cols-3 gap-2">
				<button onclick="viewEnvelopeTicket('${budget.id}')" class="w-full py-2.5 ${ticketColors} font-mono font-black rounded-xl border border-dashed transition-all active:scale-95 flex items-center justify-center gap-1 text-[9px] md:text-[10px] uppercase tracking-wider shadow-xs">
					📋 Ticket
				</button>
				<button onclick="confirmCloseBudget('${budget.id}')" class="w-full py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black rounded-xl border border-emerald-500/25 dark:border-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-1 text-[9px] md:text-[10px] uppercase tracking-wider shadow-xs">
					🔒 Clôturer
				</button>
				<button onclick="confirmDeleteBudget('${budget.id}')" class="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-black rounded-xl border border-red-500/25 dark:border-red-500/20 transition-all active:scale-95 flex items-center justify-center gap-1 text-[9px] md:text-[10px] uppercase tracking-wider shadow-xs">
					🗑️ Supprimer
				</button>
			</div>
        `;
        
        container.appendChild(card);
    });
}

function toggleBudgetOpHistory(budgetId) {
    const block = document.getElementById(`budget_history_block_${budgetId}`);
    const chevron = document.getElementById(`budget_history_chevron_${budgetId}`);
    if (block) {
        const isHidden = block.classList.contains("hidden");
        if (isHidden) {
            block.classList.remove("hidden");
            if (chevron) chevron.style.transform = "rotate(180deg)";
        } else {
            block.classList.add("hidden");
            if (chevron) chevron.style.transform = "rotate(0deg)";
        }
        triggerHaptic(10);
    }
}

function addBudgetOperation(budgetId, type, isCash = false) {
    const budget = state.budgets.find(b => b.id === budgetId);
    if (!budget) return;
    
    const titleInput = document.getElementById(`budget_op_title_${budgetId}`);
    const amountInput = document.getElementById(`budget_op_amount_${budgetId}`);
   
	const title = toTitleCase(titleInput.value.trim());
    let amountStr = amountInput.value.trim().replace(",", ".");
    let amount = parseFloat(amountStr);
    
    if (!title) {
        titleInput.setCustomValidity("Veuillez renseigner un libellé.");
        titleInput.reportValidity();
        titleInput.addEventListener('input', () => titleInput.setCustomValidity(''), { once: true });
        triggerHaptic('error');
        return;
    }
    
    if (isNaN(amount) || amount <= 0) {
        amountInput.setCustomValidity("Veuillez saisir un montant supérieur à 0.");
        amountInput.reportValidity();
        amountInput.addEventListener('input', () => amountInput.setCustomValidity(''), { once: true });
        triggerHaptic('error');
        return;
    }
    
    const opAmount = type === 'expense' ? amount : -amount;
    
    const newOp = {
        id: "op_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
        title: title,
        amount: opAmount,
        date: getTodayDateString(),
        isCash: !!isCash,
        isDeposited: false
    };
    
    budget.expenses.push(newOp);
    
    if (budget.subType === "friends" && type === "refund" && !isCash) {
        const txId = "tx_ref_cb_" + newOp.id;
        const refCbTx = {
            id: txId,
            title: `Remb. numérique : ${budget.title} (${title})`,
            amount: opAmount,
            date: getTodayDateString(),
            isBudgetReference: true,
            budgetId: budget.id,
            isDigitalRefundTx: true,
            budgetOpId: newOp.id
        };
        state.expenses.push(refCbTx);
    }
    
    syncMainBudgetReference(budget);
    
	updateEnvelopeTicket(budget.id);
    saveState();
    renderBudgetsList();
    updateUI();
    triggerHaptic('success');
    
    titleInput.value = "";
    amountInput.value = "";
	
}

function calculateCashDepositAmount(budget, cashAvailable, targetDepositTxId) {
    if (budget.type !== "deducted") {
        return -cashAvailable;
    }
    const spent = budget.expenses.filter(e => {
        if (e.isCashDeposit) return false;
        if (budget.subType === "friends" && e.amount < 0 && !e.isCash) return false;
        if (e.isCash && e.amount < 0 && e.isDeposited && e.depositTxId && e.depositTxId !== targetDepositTxId) {
            return false;
        }
        return true;
    }).reduce((sum, ex) => sum + ex.amount, 0);
    
    const partUtilisateur = budget.allocated + spent;
    return Math.max(0, partUtilisateur + cashAvailable) - cashAvailable - Math.max(0, partUtilisateur);
}

function depositBudgetCash(budgetId) {
    const budget = state.budgets.find(b => b.id === budgetId);
    if (!budget) return;
    
    const allCashOps = [...(budget.archivedExpenses || []), ...budget.expenses].filter(e => e.isCash && !e.isDeposited);
    const cashAvailable = Math.max(0, - allCashOps.reduce((sum, e) => sum + e.amount, 0));
    if (cashAvailable <= 0.009) return;
    
    showGenericConfirm(
        "Déposer les espèces ?",
        `Confirmez-vous le dépôt de <strong>${formatCurrency(cashAvailable)}</strong> d'espèces de cette enveloppe sur votre compte bancaire (Reste à Vivre) ? <br><br>Cela va créer un dépôt d'espèces en attente dans votre historique principal.`,
        "🏦",
        () => {
            // 2. Create pending cash deposit transaction in main history
            const txId = "tx_cash_" + Date.now() + "_" + Math.floor(Math.random() * 1005);
            const depositAmount = calculateCashDepositAmount(budget, cashAvailable, txId);
            const cashTx = {
                id: txId,
                title: `Dépôt espèces : ${budget.title}`,
                amount: depositAmount,
                date: getTodayDateString(),
                isBudgetReference: true,
                budgetId: budget.id,
                isCashDepositPending: true,
                isDeposited: true,
                originalCashAmount: cashAvailable
            };
            state.expenses.push(cashTx);
            
            // 1. Mark undeposited cash operations in envelope as deposited and link them
            const markDeposited = (op) => {
                if (op.isCash && op.amount < 0 && !op.isDeposited) {
                    op.isDeposited = true;
                    op.depositTxId = txId;
                }
            };
            if (budget.expenses) budget.expenses.forEach(markDeposited);
            if (budget.archivedExpenses) budget.archivedExpenses.forEach(markDeposited);
            
            syncMainBudgetReference(budget);
			updateEnvelopeTicket(budget.id);
            saveState();
            renderBudgetsList();
            updateUI();
            triggerHaptic('success');
        }
    );
}

function deleteBudgetOperation(budgetId, opId) {
    const budget = state.budgets.find(b => b.id === budgetId);
    if (!budget) return;
    
    showGenericConfirm(
        "Supprimer l'opération ?",
        "Voulez-vous supprimer cette opération de cette enveloppe ?",
        "🗑️",
        () => {
            const op = budget.expenses.find(o => o.id === opId);
            if (op) {
                if (budget.subType === "friends" && op.amount < 0 && !op.isCash) {
                    // Remove corresponding digital refund transaction from main history
                    state.expenses = state.expenses.filter(e => e.id !== "tx_ref_cb_" + op.id && e.budgetOpId !== op.id);
                } else if (op.isCash && op.amount < 0 && op.isDeposited && op.depositTxId) {
                    // Adjust or remove corresponding main cash deposit transaction
                    const cashTx = state.expenses.find(e => e.id === op.depositTxId);
                    if (cashTx) {
                        // Filter the expense first so the helper sees the updated list
                        budget.expenses = budget.expenses.filter(o => o.id !== opId);
                        cashTx.originalCashAmount = (cashTx.originalCashAmount || 0) - Math.abs(op.amount);
                        cashTx.amount = calculateCashDepositAmount(budget, cashTx.originalCashAmount, cashTx.id);
                        
                        if (cashTx.originalCashAmount <= 0.009) {
                            state.expenses = state.expenses.filter(e => e.id !== op.depositTxId);
                        }
                    }
                }
            }
            budget.expenses = budget.expenses.filter(op => op.id !== opId);
            syncMainBudgetReference(budget);
			updateEnvelopeTicket(budget.id);
            saveState();
            renderBudgetsList();
            updateUI();
            triggerHaptic('success');
        }
    );
}

function syncMainBudgetReference(budget) {
    if (budget.type !== "deducted") return;
    
    const refTx = state.expenses.find(e => e.id === budget.mainTransactionId);
    if (!refTx) return;
    
    // For Friends envelopes, exclude digital refunds from the reference transaction's spent amount,
    // since they are pushed as separate negative transactions in state.expenses to avoid double counting.
    const spent = budget.expenses.filter(e => !e.isCashDeposit && !(budget.subType === "friends" && e.amount < 0 && !e.isCash)).reduce((sum, ex) => sum + ex.amount, 0);
    const isFriends = budget.subType === "friends";
    
    if (isFriends) {
        const partUtilisateur = budget.allocated + spent;
        const allCashOps = [...(budget.archivedExpenses || []), ...budget.expenses].filter(e => e.isCash && !e.isDeposited);
        const cashAvailable = Math.max(0, - allCashOps.reduce((sum, e) => sum + e.amount, 0));
        refTx.amount = Math.max(0, partUtilisateur + Math.max(0, cashAvailable));
    } else {
        if (spent > budget.allocated) {
            refTx.amount = spent;
        } else {
            refTx.amount = budget.allocated;
        }
    }
}

function confirmCloseBudget(budgetId) {
    const budget = state.budgets.find(b => b.id === budgetId);
    if (!budget) return;
    
    const activeSpent = budget.expenses.filter(e => !e.isCashDeposit).reduce((sum, ex) => sum + ex.amount, 0);
    const archivedSpent = (budget.archivedExpenses || []).filter(e => !e.isCashDeposit).reduce((sum, ex) => sum + ex.amount, 0);
    const totalSpent = activeSpent + archivedSpent;
    const origAlloc = budget.originalAllocated || budget.allocated;
    
    const isFriends = budget.subType === "friends";
    
    let msg = "";
    if (budget.type === "deducted") {
        if (isFriends) {
            const partUtilisateur = origAlloc + totalSpent;
            msg = `Vous allez clôturer cette enveloppe entre amis. Elle sera archivée avec sa part utilisateur finale globale de <strong>${formatCurrency(partUtilisateur)}</strong>.`;
        } else {
            const left = origAlloc - totalSpent;
            if (left > 0) {
                msg = `Vous allez clôturer cette enveloppe. La somme restante globale de <strong>${formatCurrency(left)}</strong> sera recréditée sur votre Solde Principal.`;
            } else if (left < 0) {
                msg = `Vous allez clôturer cette enveloppe. Un dépassement global de <strong>${formatCurrency(Math.abs(left))}</strong> a déjà été déduit de votre Solde Principal.`;
            } else {
                msg = "Vous allez clôturer cette enveloppe. Elle a été entièrement dépensée.";
            }
        }
    } else {
        if (isFriends) {
            msg = "Vous allez clôturer cette enveloppe entre amis indépendante. Cela l'archivera définitivement.";
        } else {
            msg = "Vous allez clôturer cette enveloppe indépendante. Cela supprimera l'enveloppe.";
        }
    }
    
    showGenericConfirm(
        "Clôturer l'Enveloppe ?",
        msg,
        "🔒",
        () => {
            closeBudget(budgetId);
        }
    );
}

function executeCloseBudgetLogic(budget) {
    budget.closed = true;
    budget.closedDate = getTodayDateString();
    
    const isFriends = budget.subType === "friends";
    const spent = budget.expenses.filter(e => !e.isCashDeposit).reduce((sum, ex) => sum + ex.amount, 0);
    
    if (budget.type === "deducted") {
        // Remove the original main transaction
        if (budget.mainTransactionId) {
            state.expenses = state.expenses.filter(e => e.id !== budget.mainTransactionId);
        }
        
        if (isFriends) {
            // Remove all digital refund transactions of this envelope to consolidate them under the final share transaction.
            state.expenses = state.expenses.filter(e => !(e.isDigitalRefundTx && e.budgetId === budget.id));
            
            const partUtilisateur = budget.allocated + spent;
            const allCashOps = [...(budget.archivedExpenses || []), ...budget.expenses].filter(e => e.isCash && !e.isDeposited);
            const cashAvailable = Math.max(0, - allCashOps.reduce((sum, e) => sum + e.amount, 0));
            
            // Auto-mark any pending cash deposit transactions of this envelope in the main list as deposited!
            if (state.expenses) {
                state.expenses.forEach(e => {
                    if (e.isCashDepositPending && e.budgetId === budget.id && !e.isDeposited) {
                        e.isDeposited = true;
                        e.amount = e.amount < 0 ? e.amount : 0;
                    }
                });
            }
            
            // 1. Create final share transaction (includes cashAvailable so it remains debited from bank until deposited)
            const shareTx = {
                id: "tx_share_" + Date.now() + "_" + Math.floor(Math.random() * 1005),
                title: `Part finale : ${budget.title}`,
                amount: Math.max(0, partUtilisateur + cashAvailable),
                date: getTodayDateString(),
                isBudgetReference: true,
                budgetId: budget.id,
                isFinalShare: true
            };
            state.expenses.push(shareTx);
            
            // 2. Create cash deposit transaction if cashAvailable > 0
            if (cashAvailable > 0.009) {
                const txId = "tx_cash_" + Date.now() + "_" + Math.floor(Math.random() * 1005);
                const cashTx = {
                    id: txId,
                    title: `Espèces à déposer : ${budget.title}`,
                    amount: -cashAvailable, // Always -cashAvailable so confirming the deposit credits Reste à Vivre
                    date: getTodayDateString(),
                    isBudgetReference: true,
                    budgetId: budget.id,
                    isCashDepositPending: true,
                    isDeposited: false,
                    originalCashAmount: cashAvailable
                };
                state.expenses.push(cashTx);
                
                // Mark deposited in envelope
                const markDep = (op) => {
                    if (op.isCash && op.amount < 0 && !op.isDeposited) {
                        op.isDeposited = true;
                        op.depositTxId = txId;
                    }
                };
                if (budget.expenses) budget.expenses.forEach(markDep);
                if (budget.archivedExpenses) budget.archivedExpenses.forEach(markDep);
            }
        } else {
            // Classic envelope: single transaction with spent amount
            const finalTx = {
                id: "tx_final_" + Date.now() + "_" + Math.floor(Math.random() * 1005),
                title: `Enveloppe finale : ${budget.title}`,
                amount: Math.max(0, spent),
                date: getTodayDateString(),
                isBudgetReference: true,
                budgetId: budget.id,
                isClassicFinal: true
            };
            state.expenses.push(finalTx);
        }
    } else {
        // Independent envelope
        if (isFriends) {
            const allCashOps = [...(budget.archivedExpenses || []), ...budget.expenses].filter(e => e.isCash && !e.isDeposited);
            const cashAvailable = Math.max(0, - allCashOps.reduce((sum, e) => sum + e.amount, 0));
            
            if (cashAvailable > 0.009) {
                const txId = "tx_cash_" + Date.now() + "_" + Math.floor(Math.random() * 1005);
                const cashTx = {
                    id: txId,
                    title: `Espèces à déposer : ${budget.title}`,
                    amount: -cashAvailable,
                    date: getTodayDateString(),
                    isBudgetReference: true,
                    budgetId: budget.id,
                    isCashDepositPending: true,
                    isDeposited: false,
                    originalCashAmount: cashAvailable
                };
                state.expenses.push(cashTx);
                
                const markDep = (op) => {
                    if (op.isCash && op.amount < 0 && !op.isDeposited) {
                        op.isDeposited = true;
                        op.depositTxId = txId;
                    }
                };
                if (budget.expenses) budget.expenses.forEach(markDep);
                if (budget.archivedExpenses) budget.archivedExpenses.forEach(markDep);
            }
        }
    }
	updateEnvelopeTicket(budget.id);
}

function closeBudget(budgetId) {
    const budget = state.budgets.find(b => b.id === budgetId);
    if (!budget) return;
    
    executeCloseBudgetLogic(budget);
    
    saveState();
    renderBudgetsList();
    updateUI();
    triggerHaptic('success');
}

function confirmDeleteBudget(budgetId) {
    const budget = state.budgets.find(b => b.id === budgetId);
    if (!budget) return;
    
    let msg = "";
    if (budget.type === "deducted") {
        msg = `Voulez-vous vraiment supprimer l'enveloppe active <strong>"${budget.title}"</strong> ? La transaction de déduction associée sera annulée et son montant sera recrédité sur votre Solde Principal. Cela supprimera également son historique d'opérations.`;
    } else {
        msg = `Voulez-vous vraiment supprimer l'enveloppe active <strong>"${budget.title}"</strong> ? Cela supprimera également son historique d'opérations.`;
    }
    
    showGenericConfirm(
        "Supprimer l'enveloppe ? (1/2)",
        msg,
        "🗑️",
        () => {
            setTimeout(() => {
                showGenericConfirm(
                    "Confirmer la suppression (2/2)",
                    `Êtes-vous absolument sûr ? Cette action effacera définitivement l'enveloppe "${budget.title}" et tout son historique.`,
                    "⚠️",
                    () => {
                        state.expenses = state.expenses.filter(e => e.budgetId !== budgetId && e.id !== budget.mainTransactionId);
                        state.budgets = state.budgets.filter(b => b.id !== budgetId);
                        
						state.ticketArchives = state.ticketArchives.filter(a => a.id !== `arch_env_${budgetId}`);
                        saveState();
                        renderBudgetsList();
                        updateUI();
                        triggerHaptic('confirm');
                    }
                );
            }, 300);
        }
    );
}

function confirmCashDeposit(event, txId) {
    if (event) event.stopPropagation();
    
    const tx = state.expenses.find(e => e.id === txId);
    if (!tx) return;
    
    showGenericConfirm(
        "Confirmer le dépôt ?",
        `Confirmez-vous avoir déposé la somme de <strong>${formatCurrency(tx.originalCashAmount || tx.amount)}</strong> en espèces sur votre compte bancaire ?`,
        "🏦",
        () => {
            tx.isDeposited = true;
            tx.amount = tx.amount < 0 ? tx.amount : 0;
            
            // Mettre à jour les opérations internes de l'enveloppe correspondante
            if (tx.budgetId) {
                const budget = state.budgets.find(b => b.id === tx.budgetId);
                if (budget) {
                    const markDeposited = (op) => {
                        if (op.depositTxId === tx.id) {
                            op.isDeposited = true;
                        }
                    };
                    if (budget.expenses) budget.expenses.forEach(markDeposited);
                    if (budget.archivedExpenses) budget.archivedExpenses.forEach(markDeposited);
                }
            }
            
			if (tx.budgetId) updateEnvelopeTicket(tx.budgetId);
            saveState();
            updateUI();
            triggerHaptic('success');
        }
    );
}

function autoCloseAllBudgets() {
    if (!state.budgets || state.budgets.length === 0) return;
    
    state.budgets.forEach(budget => {
        if (budget.closed) return;
        executeCloseBudgetLogic(budget);
    });
    
    saveState();
}

function openViewBudgetModal(budgetId) {
    const budget = state.budgets.find(b => b.id === budgetId);
    if (!budget) return;
    
    // Sum up active and archived spent
    const activeSpent = budget.expenses.filter(e => !e.isCashDeposit).reduce((sum, e) => sum + e.amount, 0);
    const archivedSpent = (budget.archivedExpenses || []).filter(e => !e.isCashDeposit).reduce((sum, e) => sum + e.amount, 0);
    const totalSpent = activeSpent + archivedSpent;
    
    const origAlloc = budget.originalAllocated || budget.allocated;
    const isFriends = budget.subType === "friends";
    
    const remaining = isFriends ? (origAlloc + totalSpent) : (origAlloc - totalSpent);
    const isOverdrawn = isFriends ? (remaining > 0.009) : (remaining < 0);
    
    const badgeText = budget.type === "deducted" ? "Déduit du Reste à Vivre" : (isFriends ? "💵 Espèces" : "Source Indépendante");
    
    let pct = 0;
    let spentText = "";
    let allocatedText = "";
    let labelDisplay = "Disponible";
    
    if (isFriends) {
        const activeRefunds = budget.expenses.filter(e => e.amount < 0 && !e.isCashDeposit).reduce((sum, e) => sum + Math.abs(e.amount), 0);
        const archivedRefunds = (budget.archivedExpenses || []).filter(e => e.amount < 0 && !e.isCashDeposit).reduce((sum, e) => sum + Math.abs(e.amount), 0);
        const totalRefunds = activeRefunds + archivedRefunds;
        
        const activeExpenses = budget.expenses.filter(e => e.amount > 0 && !e.isCashDeposit).reduce((sum, e) => sum + e.amount, 0);
        const archivedExpenses = (budget.archivedExpenses || []).filter(e => e.amount > 0 && !e.isCashDeposit).reduce((sum, e) => sum + e.amount, 0);
        const totalExpenses = activeExpenses + archivedExpenses;
        
        const totalAdvanced = origAlloc + totalExpenses;
        pct = totalAdvanced > 0 ? (totalRefunds / totalAdvanced) * 100 : 0;
        pct = Math.min(100, Math.max(0, pct));
        
        spentText = `Remboursé: ${formatCurrency(totalRefunds)}`;
        allocatedText = `Avancé: ${formatCurrency(totalAdvanced)}`;
        labelDisplay = "Part utilisateur";
    } else {
        pct = (remaining / origAlloc) * 100;
        pct = Math.min(100, Math.max(0, pct));
        
        spentText = `Dépensé: ${formatCurrency(totalSpent)}`;
        allocatedText = `Alloué: ${formatCurrency(origAlloc)}`;
        labelDisplay = "Disponible";
    }
    
    let opsHTML = "";
    let allOps = [];
    if (isFriends) {
        allOps.push({
            id: "op_init_" + budget.id,
            title: "Dépense de départ",
            amount: origAlloc,
            date: budget.createdDate || (state.budgetMonth + "-01"),
            isCash: false,
            isInitialAdvance: true,
        });
    }
    allOps = [
        ...allOps,
        ...(budget.archivedExpenses || []),
        ...budget.expenses
    ];
    
    allOps.forEach(op => {
        const isRefund = op.amount < 0;
        const absAmt = Math.abs(op.amount);
        const amtColor = isRefund ? "text-green-600 dark:text-green-400 font-bold" : "text-red-500 dark:text-red-400 font-bold";
        const amtSign = isRefund ? "+" : "-";
        
        const archivedBadge = op.isArchived 
            ? `<span class="inline-block text-[8px] font-extrabold bg-stone-100 dark:bg-stone-900 text-stone-500 dark:text-stone-400 border border-stone-300 dark:border-stone-700/60 px-1 py-0.2 rounded select-none mr-1">Mois préc.</span>` 
            : '';
        
        const isEditable = !op.isInitialAdvance && !op.isCashDeposit;
        
        // CORRECTION : On passe bien budget.id comme 3ème paramètre
        const clickAttr = isEditable ? `onclick="openEditItem('budgetOperation', '${op.id}', '${budget.id}')"` : '';
        const cursorClass = isEditable ? 'cursor-pointer hover:text-brand-500 transition-colors group/op-click' : '';
        const editIndicator = isEditable ? `<span class="text-[8px] font-bold text-brand-500 opacity-0 group-hover/op-click:opacity-100 transition-all ml-1">👁️</span>` : '';

        opsHTML += `
            <div class="flex items-center justify-between py-2 border-b border-stone-200/50 dark:border-stone-800/40 text-xs ${op.isArchived ? 'opacity-70' : ''}">
                <div ${clickAttr} class="min-w-0 flex-1 pr-2 ${cursorClass}">
                    <span class="font-bold text-stone-800 dark:text-stone-300 truncate block flex items-center flex-wrap">
                        ${op.isCash ? '💵 ' : ''}${archivedBadge}${op.title}${editIndicator}
                    </span>
                    <span class="text-[9px] text-stone-400 dark:text-stone-500 font-semibold block mt-0.5">${op.date ? op.date.split('-').reverse().join('/') : ""}</span>
                </div>
                <div class="shrink-0">
                    <span class="${amtColor} font-black">${amtSign} ${formatCurrency(absAmt)}</span>
                </div>
            </div>
        `;
    });
    
    if (allOps.length === 0) {
        opsHTML = `<div class="text-center py-4 text-[10px] text-stone-400 font-bold select-none">Aucune opération enregistrée</div>`;
    }
    
    const statusBadge = budget.closed 
        ? `<span class="inline-block text-[9px] font-black bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30 px-2 py-0.5 rounded uppercase select-none">🔒 Clôturée</span>`
        : `<span class="inline-block text-[9px] font-black bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30 px-2 py-0.5 rounded uppercase select-none">🔓 Active</span>`;
        
    const cardClass = isFriends 
        ? "glass-card bg-indigo-100/70 dark:bg-indigo-950/45 border border-indigo-300/80 dark:border-indigo-800/50"
        : "glass-card bg-emerald-100/60 dark:bg-emerald-950/30 border border-emerald-300/80 dark:border-emerald-900/40";
        
    const contentContainer = document.getElementById("view_budget_modal_content");
    contentContainer.innerHTML = `
        <div class="${cardClass} p-5 space-y-4 shadow-none">
            <div class="flex justify-between items-start pt-1.5">
                <div>
                    <h4 class="text-sm font-black uppercase text-stone-800 dark:text-stone-100">${budget.title}</h4>
                    <div class="flex gap-1.5 mt-2">
                        <span class="inline-block text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border border-stone-300 dark:border-stone-700">
                            ${badgeText}
                        </span>
                        ${statusBadge}
                    </div>
                </div>
                <div class="text-right select-none">
                    <span class="block text-[8px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">${labelDisplay}</span>
                    <div class="inline-flex items-center justify-end bg-stone-900 dark:bg-black/35 border border-stone-300 dark:border-stone-800 px-2.5 py-0.5 rounded shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                        <span class="font-mono text-xs font-black tracking-tight ${isOverdrawn ? 'text-red-500 dark:text-red-400 drop-shadow-[0_0_2px_rgba(239,68,68,0.4)]' : 'text-emerald-600 dark:text-emerald-400 drop-shadow-[0_0_2px_rgba(52,211,153,0.4)]'}">
                            ${formatCurrency(remaining)}
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="space-y-1.5 select-none pt-1">
                <div class="w-full bg-stone-200 dark:bg-stone-800/80 h-2 rounded overflow-hidden border border-stone-300 dark:border-stone-700/60">
                    <div class="${isOverdrawn ? 'bg-red-500' : (pct <= 25 ? 'bg-orange-500' : 'bg-emerald-500')} h-full rounded transition-all duration-300" style="width: ${pct}%"></div>
                </div>
                <div class="flex justify-between text-[8px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    <span>${spentText}</span>
                    <span>${allocatedText}</span>
                </div>
            </div>
            
            <div class="space-y-2 pt-3.5 border-t border-stone-200 dark:border-stone-800">
                <span class="block text-[9px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500">Journal des Opérations</span>
                <div class="space-y-1.5">
                    ${opsHTML}
                </div>
            </div>
        </div>
    `;
    
    const modal = document.getElementById("view_budget_modal");
    if (modal) {
        const footerContainer = document.getElementById("view_budget_modal_footer");
        if (footerContainer) {
            if (budget.closed) {
                footerContainer.innerHTML = `
                    <button onclick="viewEnvelopeTicket('${budget.id}')" class="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs active:scale-95 transition-all flex items-center justify-center gap-1 shadow-sm">
                        📋 Ticket PDF
                    </button>
                    <button onclick="reopenBudget('${budget.id}')" class="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm">
                        🔓 Réouvrir
                    </button>
                    <button onclick="closeViewBudgetModal()" class="flex-1 py-2.5 bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 font-bold rounded-xl text-xs active:scale-95 transition-all">
                        Fermer
                    </button>
                `;
            } else {
                footerContainer.innerHTML = `
                    <button onclick="viewEnvelopeTicket('${budget.id}')" class="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs active:scale-95 transition-all flex items-center justify-center gap-1 shadow-sm">
                        📋 Ticket PDF
                    </button>
                    <button onclick="closeViewBudgetModal()" class="flex-1 py-2.5 bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 font-bold rounded-xl text-xs active:scale-95 transition-all">
                        Fermer
                    </button>
                `;
            }
        }

        modal.classList.remove("hidden");
        setTimeout(() => {
            modal.classList.remove("opacity-0");
            modal.querySelector(".glass-card").classList.remove("scale-95");
        }, 10);
        triggerHaptic(10);
    }
}

function closeViewBudgetModal() {
    const modal = document.getElementById("view_budget_modal");
    if (modal) {
        modal.classList.add("opacity-0");
        modal.querySelector(".glass-card").classList.add("scale-95");
        setTimeout(() => {
            modal.classList.add("hidden");
        }, 300);
    }
}

function executeReopenBudgetLogic(budget) {
    const isFriends = budget.subType === "friends";
    budget.closed = false;
    delete budget.closedDate;
    
    // Récupérer l'ID de la transaction de dépôt d'espèces de clôture (créée spécifiquement à la clôture avec le préfixe "Espèces à déposer :")
    const closureCashTx = state.expenses.find(e => e.budgetId === budget.id && e.title.startsWith("Espèces à déposer :"));
    const closureCashTxId = closureCashTx ? closureCashTx.id : null;
    const wasClosureCashTxDeposited = closureCashTx ? closureCashTx.isDeposited : false;

    // Supprimer uniquement les transactions consolidées de clôture (Part finale, Enveloppe finale et Espèces à déposer de clôture) de l'historique principal.
    // Les dépôts intermédiaires effectués pendant que l'enveloppe était active ("Dépôt espèces :") restent inchangés dans le grand livre.
    state.expenses = state.expenses.filter(e => {
        const isFinalShareTx = e.budgetId === budget.id && e.isFinalShare;
        const isClosureCashTx = e.budgetId === budget.id && e.title.startsWith("Espèces à déposer :");
        const isClassicFinalTx = e.budgetId === budget.id && (e.isClassicFinal || (e.id && e.id.startsWith("tx_final_")));
        return !(isFinalShareTx || isClosureCashTx || isClassicFinalTx);
    });
    
    // Si l'enveloppe est déduite du reste à vivre, recréer la transaction de référence principale et restaurer les remboursements numériques
    if (budget.type === "deducted") {
        // Restaurer les remboursements numériques individuels (CB/virements) dans l'historique principal
        if (isFriends) {
            budget.expenses.forEach(op => {
                if (op.amount < 0 && !op.isCash) {
                    const txId = "tx_ref_cb_" + op.id;
                    const refCbTx = {
                        id: txId,
                        title: `Remb. numérique : ${budget.title} (${op.title})`,
                        amount: op.amount,
                        date: op.date || getTodayDateString(),
                        isBudgetReference: true,
                        budgetId: budget.id,
                        isDigitalRefundTx: true,
                        budgetOpId: op.id
                    };
                    state.expenses.push(refCbTx);
                }
            });
        }

        // Recréer la transaction de référence d'origine
        const titlePrefix = isFriends ? "Avance" : "Enveloppe";
        const refTx = {
            id: budget.mainTransactionId,
            title: `${titlePrefix} : ${budget.title}`,
            amount: budget.allocated, // Sera resynchronisé ci-dessous
            date: getTodayDateString(),
            isBudgetReference: true,
            budgetId: budget.id
        };
        state.expenses.push(refTx);
    }

    // Gérer la remise en état des opérations d'espèces de clôture
    if (closureCashTxId) {
        if (wasClosureCashTxDeposited) {
            // Si le dépôt de clôture avait déjà été validé comme déposé en banque par l'utilisateur, 
            // on le recrée sous forme de dépôt intermédiaire actif validé (amount = 0 ou -cash)
            const newActiveTxId = "tx_cash_reopened_" + Date.now() + "_" + Math.floor(Math.random() * 1005);
            const cashAvailable = closureCashTx.originalCashAmount || 0;
            
            const updateDepId = (op) => {
                if (op.depositTxId === closureCashTxId) {
                    op.depositTxId = newActiveTxId;
                    op.isDeposited = true;
                }
            };
            if (budget.expenses) budget.expenses.forEach(updateDepId);
            if (budget.archivedExpenses) budget.archivedExpenses.forEach(updateDepId);

            const depositAmount = calculateCashDepositAmount(budget, cashAvailable, newActiveTxId);

            const activeCashTx = {
                id: newActiveTxId,
                title: `Dépôt espèces : ${budget.title}`,
                amount: depositAmount,
                date: getTodayDateString(),
                isBudgetReference: true,
                budgetId: budget.id,
                isCashDepositPending: true,
                isDeposited: true,
                originalCashAmount: cashAvailable
            };
            state.expenses.push(activeCashTx);
        } else {
            // Si le dépôt était encore en attente de versement, on remet les opérations en espèces correspondantes 
            // comme "non déposées" dans l'enveloppe
            const resetDep = (op) => {
                if (op.depositTxId === closureCashTxId) {
                    op.isDeposited = false;
                    delete op.depositTxId;
                }
            };
            if (budget.expenses) budget.expenses.forEach(resetDep);
            if (budget.archivedExpenses) budget.archivedExpenses.forEach(resetDep);
        }
    }

    if (budget.type === "deducted") {
        syncMainBudgetReference(budget);
    }
	updateEnvelopeTicket(budget.id);
}

function reopenBudget(budgetId) {
    const budget = state.budgets.find(b => b.id === budgetId);
    if (!budget) return;
    
    let msg = "";
    const isFriends = budget.subType === "friends";
    
    if (budget.type === "deducted") {
        if (isFriends) {
            msg = `Voulez-vous réouvrir l'enveloppe entre amis <strong>"${budget.title}"</strong> ?`;
        } else {
            const spent = budget.expenses.filter(e => !e.isCashDeposit).reduce((sum, ex) => sum + ex.amount, 0);
            const left = budget.allocated - spent;
            if (left > 0) {
                msg = `En réouvrant cette enveloppe, la somme non consommée de <strong>${formatCurrency(left)}</strong> qui vous avait été recréditée sera à nouveau déduite de votre Reste à Vivre.`;
            } else {
                msg = `Voulez-vous réouvrir l'enveloppe <strong>"${budget.title}"</strong> ?`;
            }
        }
    } else {
        if (isFriends) {
            msg = `Voulez-vous réouvrir l'enveloppe entre amis indépendante <strong>"${budget.title}"</strong> ?`;
        } else {
            msg = `Voulez-vous réouvrir l'enveloppe indépendante <strong>"${budget.title}"</strong> ?`;
        }
    }
    
    closeViewBudgetModal(); // Close details modal first
    
    setTimeout(() => {
        showGenericConfirm(
            "Réouvrir l'Enveloppe ?",
            msg,
            "🔓",
            () => {
                executeReopenBudgetLogic(budget);
                
                saveState();
                renderBudgetsList();
                updateUI();
                triggerHaptic('success');
                showGenericAlert(
                    "Enveloppe Réouverte",
                    `L'enveloppe <strong>"${budget.title}"</strong> a été réouverte avec succès.`,
                    "🔓"
                );
            },
            () => {
                // Reopen details modal on cancel
                setTimeout(() => {
                    openViewBudgetModal(budgetId);
                }, 350);
            }
        );
    }, 300);
}


// --- VERSIONING & ONBOARDING SYSTEM ---
const BUDGET_HMR_VERSION = "2.0.0";

function checkAppVersionAndWelcome() {
    const savedVersion = localStorage.getItem("budget_hmr_version");
    const hasExistingState = localStorage.getItem("budget_hmr_simple");

    if (!hasExistingState) {
        // First launch, save version and open welcome modal
        localStorage.setItem("budget_hmr_version", BUDGET_HMR_VERSION);
        openWelcomeModal();
    } else {
        // App is already initialized, check if version upgraded
        if (savedVersion !== BUDGET_HMR_VERSION) {
            state.isCertified = false;
            saveState();
            localStorage.setItem("budget_hmr_version", BUDGET_HMR_VERSION);
            
            // Show update details modal
            openVersionUpdateModal();
        }
    }
}

function openWelcomeModal() {
    const modal = document.getElementById("welcome_modal");
    if (!modal) return;
    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.querySelector(".glass-card").classList.remove("scale-95");
    }, 10);
}

function closeWelcomeModal() {
    const modal = document.getElementById("welcome_modal");
    if (!modal) return;
    modal.classList.add("opacity-0");
    modal.querySelector(".glass-card").classList.add("scale-95");
    setTimeout(() => {
        modal.classList.add("hidden");
    }, 300);
}

function acceptWelcomeOption(option) {
    closeWelcomeModal();
    if (option === 'certify') {
        openCertification();
    } else if (option === 'guide') {
        openAppGuide();
    } else {
        // 'start'
        handleOnboardingOrUpdateClose();
    }
}

function openVersionUpdateModal() {
    const modal = document.getElementById("version_update_modal");
    if (!modal) return;
    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.querySelector(".glass-card").classList.remove("scale-95");
    }, 10);
}

function closeVersionUpdateModal() {
    const modal = document.getElementById("version_update_modal");
    if (!modal) return;
    modal.classList.add("opacity-0");
    modal.querySelector(".glass-card").classList.add("scale-95");
    setTimeout(() => {
        modal.classList.add("hidden");
        handleOnboardingOrUpdateClose();
    }, 300);
}

function acceptVersionUpdateCertify() {
    closeVersionUpdateModal();
    openCertification();
}

// --- INTERACTIVE GUIDE SLIDER ---
let currentGuideSlideIndex = 0;
const totalGuideSlides = 6;

function openAppGuide() {
    currentGuideSlideIndex = 0;
    resetDemoState();
    updateGuideUI();
    const modal = document.getElementById("app_guide_modal");
    if (!modal) return;
    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.querySelector(".glass-card").classList.remove("scale-95");
    }, 10);
}

function closeAppGuide() {
    const modal = document.getElementById("app_guide_modal");
    if (!modal) return;
    modal.classList.add("opacity-0");
    modal.querySelector(".glass-card").classList.add("scale-95");
    setTimeout(() => {
        modal.classList.add("hidden");
        handleOnboardingOrUpdateClose();
    }, 300);
}

function updateGuideUI() {
    for (let i = 0; i < totalGuideSlides; i++) {
        const slide = document.getElementById(`guide_slide_${i}`);
        const dot = document.getElementById(`guide_dot_${i}`);
        if (slide) {
            if (i === currentGuideSlideIndex) {
                slide.classList.remove("hidden");
            } else {
                slide.classList.add("hidden");
            }
        }
        if (dot) {
            if (i === currentGuideSlideIndex) {
                dot.classList.add("bg-brand-500");
                dot.classList.remove("bg-stone-300", "dark:bg-stone-700");
            } else {
                dot.classList.remove("bg-brand-500");
                dot.classList.add("bg-stone-300", "dark:bg-stone-700");
            }
        }
    }
    
    const btnPrev = document.getElementById("btn_guide_prev");
    const btnNext = document.getElementById("btn_guide_next");
    
    if (btnPrev) {
        if (currentGuideSlideIndex === 0) {
            btnPrev.classList.add("opacity-50", "pointer-events-none");
        } else {
            btnPrev.classList.remove("opacity-50", "pointer-events-none");
        }
    }
    
    if (btnNext) {
        if (currentGuideSlideIndex === totalGuideSlides - 1) {
            btnNext.innerText = "Terminer";
        } else {
            btnNext.innerText = "Suivant";
        }
    }
}

function nextGuideSlide() {
    if (currentGuideSlideIndex < totalGuideSlides - 1) {
        currentGuideSlideIndex++;
        updateGuideUI();
    } else {
        closeAppGuide();
    }
}

function prevGuideSlide() {
    if (currentGuideSlideIndex > 0) {
        currentGuideSlideIndex--;
        updateGuideUI();
    }
}

// --- INTERACTIVE GUIDE DEMO STATE & LOGIC ---
let demoState = {
    mainBalance: 1000,
    travauxAllocated: 500,
    travauxSpent: 100,
    restoAdvanced: 120,
    restoRefundCb: 0,
    restoRefundCash: 0,
    restoCashDeposited: false
};

function resetDemoState() {
    demoState.mainBalance = 1000;
    demoState.travauxAllocated = 500;
    demoState.travauxSpent = 100;
    demoState.restoAdvanced = 120;
    demoState.restoRefundCb = 0;
    demoState.restoRefundCash = 0;
    demoState.restoCashDeposited = false;
    
    const btnCb = document.getElementById("demo_btn_cb");
    const btnCash = document.getElementById("demo_btn_cash");
    if (btnCb) btnCb.classList.remove("opacity-50", "pointer-events-none");
    if (btnCash) btnCash.classList.remove("opacity-50", "pointer-events-none");
    
    updateDemoUI();
}

function updateDemoUI() {
    const partUtilisateur = demoState.restoAdvanced - demoState.restoRefundCb - demoState.restoRefundCash;
    const cashAvailable = demoState.restoRefundCash;
    
    let restoDebit = 0;
    if (demoState.restoCashDeposited) {
        restoDebit = partUtilisateur;
    } else {
        restoDebit = partUtilisateur + cashAvailable;
    }
    
    const balance = demoState.mainBalance - demoState.travauxAllocated - restoDebit;
    
    const balEl = document.getElementById("demo_main_balance");
    if (balEl) balEl.innerText = formatCurrency(balance);
    
    const travEl = document.getElementById("demo_env_travaux_status");
    if (travEl) travEl.innerText = "Reste: " + formatCurrency(demoState.travauxAllocated - demoState.travauxSpent);
    
    const restoStatusEl = document.getElementById("demo_env_resto_status");
    if (restoStatusEl) restoStatusEl.innerText = "Part: " + formatCurrency(partUtilisateur);
    
    const pct = Math.round(((demoState.restoRefundCb + demoState.restoRefundCash) / demoState.restoAdvanced) * 100);
    const pctEl = document.getElementById("demo_env_resto_pct");
    if (pctEl) pctEl.innerText = pct + "%";
    
    const progressEl = document.getElementById("demo_env_resto_progress");
    if (progressEl) progressEl.style.width = pct + "%";
    
    const cashInHand = demoState.restoCashDeposited ? 0 : demoState.restoRefundCash;
    const cashEl = document.getElementById("demo_env_resto_cash");
    if (cashEl) cashEl.innerText = formatCurrency(cashInHand);
    
    const badgeEl = document.getElementById("demo_env_resto_cash_badge");
    const btnDeposit = document.getElementById("demo_btn_deposit");
    
    if (cashInHand > 0) {
        if (badgeEl) badgeEl.classList.remove("hidden");
        if (btnDeposit) btnDeposit.classList.remove("hidden");
    } else {
        if (badgeEl) badgeEl.classList.add("hidden");
        if (btnDeposit) btnDeposit.classList.add("hidden");
    }
}

function runDemoAction(action) {
    if (action === 'refund_cb') {
        demoState.restoRefundCb = 40;
        const btn = document.getElementById("demo_btn_cb");
        if (btn) btn.classList.add("opacity-50", "pointer-events-none");
        triggerHaptic('success');
    } else if (action === 'refund_cash') {
        demoState.restoRefundCash = 30;
        const btn = document.getElementById("demo_btn_cash");
        if (btn) btn.classList.add("opacity-50", "pointer-events-none");
        triggerHaptic('success');
    } else if (action === 'deposit') {
        demoState.restoCashDeposited = true;
        triggerHaptic('success');
        showGenericAlert("Dépôt Simulé", "Les 30,00 € d'espèces ont été simulés comme déposés à la banque. Votre solde principal augmente de 30,00 € !", "🏦");
    }
    updateDemoUI();
}

// --- POST-ONBOARDING / UPDATE HANDLERS ---
function handleOnboardingOrUpdateClose() {
    triggerFirstLaunchToleranceCheck();
    checkMonthTransitionOnLaunch();
}

function triggerFirstLaunchToleranceCheck() {
    if (isFirstLaunchAndInTolerance) {
        isFirstLaunchAndInTolerance = false;
        
        const now = new Date();
        const currentMonthName = formatYearMonthFrench(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
        const nextMonthName = formatYearMonthFrench(getNextMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`));
        
        showGenericConfirm(
            "Bienvenue !",
            `Nous sommes en fin de mois (période de tolérance). Souhaitez-vous démarrer la gestion de vos comptes sur le mois en cours (<strong>${currentMonthName}</strong>) ou directement sur le mois prochain (<strong>${nextMonthName}</strong>) ?`,
            "📅",
            // Confirm callback (Mois prochain)
            () => {
                const n = new Date();
                state.budgetMonth = getNextMonth(`${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`);
                saveState();
                
                const newMonthLabel = formatYearMonthFrench(state.budgetMonth);
                document.getElementById("current_date_label").innerText = newMonthLabel;
                updateUI();
                
                triggerHaptic('success');
            },
            // Cancel callback (Mois en cours)
            () => {
                triggerHaptic('success');
            },
            "Mois prochain",
            "Mois en cours"
        );
    }
}

// --- CERTIFICATION SYSTEM (TEST RUNNER) ---
let isTestingRunning = false;

function openCertification() {
    for (let i = 0; i < 6; i++) {
        updateTestRowStatus(i, "pending");
    }
    document.getElementById("cert_testing_view").classList.remove("hidden");
    document.getElementById("cert_success_view").classList.add("hidden");
    document.getElementById("cert_loading_spinner").classList.remove("hidden");
    
    const modal = document.getElementById("certification_modal");
    if (!modal) return;
    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.querySelector(".glass-card").classList.remove("scale-95");
    }, 10);

    setTimeout(() => {
        runCertificationTests();
    }, 400);
}

function closeCertification() {
    const modal = document.getElementById("certification_modal");
    if (!modal) return;
    modal.classList.add("opacity-0");
    modal.querySelector(".glass-card").classList.add("scale-95");
    setTimeout(() => {
        modal.classList.add("hidden");
        handleOnboardingOrUpdateClose();
    }, 300);
}

function updateTestRowStatus(index, status, errorMsg = "") {
    const row = document.getElementById(`cert_test_row_${index}`);
    if (!row) return;
    const iconSpan = row.querySelector(".status-icon");
    const badgeSpan = row.querySelector(".status-badge");
    
    if (status === "running") {
        if (iconSpan) iconSpan.innerText = "🌀";
        if (badgeSpan) {
            badgeSpan.innerText = "En cours";
            badgeSpan.className = "status-badge font-bold text-brand-500 text-[10px] animate-pulse";
        }
    } else if (status === "success") {
        if (iconSpan) iconSpan.innerText = "✅";
        if (badgeSpan) {
            badgeSpan.innerText = "Succès";
            badgeSpan.className = "status-badge font-bold text-emerald-500 text-[10px]";
        }
    } else if (status === "failed") {
        if (iconSpan) iconSpan.innerText = "❌";
        if (badgeSpan) {
            badgeSpan.innerText = errorMsg || "Échec";
            badgeSpan.className = "status-badge font-bold text-red-500 text-[10px]";
        }
    } else {
        if (iconSpan) iconSpan.innerText = "⏳";
        if (badgeSpan) {
            badgeSpan.innerText = "En attente";
            badgeSpan.className = "status-badge font-bold text-stone-400 text-[10px]";
        }
    }
}

function runCertificationTests() {
    if (isTestingRunning) return;
    isTestingRunning = true;
    
    const originalState = JSON.parse(JSON.stringify(state));
    let currentTestIndex = 0;
    
    const tests = [
        { name: "Calculs de base", fn: testBaseCalculations },
        { name: "Transitions courantes", fn: testMonthTransitions },
        { name: "Enveloppes classiques", fn: testClassicEnvelopes },
        { name: "Enveloppes amis", fn: testFriendsEnvelopes },
        { name: "Gestion des espèces", fn: testCashManagement },
        { name: "Garde-fous de date", fn: testPeriodSecurity }
    ];
    
    function runNext() {
        if (currentTestIndex >= tests.length) {
            state = originalState;
            saveState();
            updateUI();
            
            document.getElementById("cert_testing_view").classList.add("hidden");
            document.getElementById("cert_success_view").classList.remove("hidden");
            document.getElementById("cert_loading_spinner").classList.add("hidden");
            
            state.isCertified = true;
            saveState();
            isTestingRunning = false;
            triggerHaptic('success');
            playConfirmationSound();
            return;
        }
        
        updateTestRowStatus(currentTestIndex, "running");
        
        setTimeout(() => {
            try {
                const test = tests[currentTestIndex];
                
                // Reset state for isolation
                state.revenues = [];
                state.fixedCharges = [];
                state.expenses = [];
                state.budgets = [];
                
                const success = test.fn();
                if (success) {
                    updateTestRowStatus(currentTestIndex, "success");
                    currentTestIndex++;
                    runNext();
                } else {
                    throw new Error("Échec silencieux");
                }
            } catch (err) {
                console.error("Test failed:", err);
                updateTestRowStatus(currentTestIndex, "failed", err.message);
                
                state = originalState;
                saveState();
                updateUI();
                
                document.getElementById("cert_loading_spinner").classList.add("hidden");
                isTestingRunning = false;
                triggerHaptic('error');
            }
        }, 400);
    }
    
    runNext();
}

// --- INTEGRATION TESTS CHECKERS ---
function testBaseCalculations() {
    state.revenues = [
        { id: "r1", title: "Salaire", amount: 2000 },
        { id: "r2", title: "Freelance", amount: 500 }
    ];
    state.fixedCharges = [
        { id: "c1", title: "Loyer", amount: 650 },
        { id: "c2", title: "Abonnement", amount: 50 }
    ];
    state.expenses = [
        { id: "e1", title: "Courses", amount: 150 },
        { id: "e2", title: "Cinéma", amount: 30 }
    ];
    
    const totals = calculateTotals();
    if (totals.totalRevenues !== 2500) throw new Error("Revenus incorrects");
    if (totals.totalFixed !== 700) throw new Error("Charges fixes incorrectes");
    if (totals.totalExpenses !== 180) throw new Error("Dépenses incorrectes");
    if (totals.remaining !== 1620) throw new Error("Reste à vivre incorrect");
    return true;
}

function testMonthTransitions() {
    state.budgetMonth = "2026-05";
    state.revenues = [{ id: "r1", title: "Salaire", amount: 2000 }];
    state.fixedCharges = [{ id: "c1", title: "Loyer", amount: 650 }];
    state.expenses = [
        { id: "e1", title: "Course", amount: 150 },
        { id: "e2", title: "Espèces à déposer : Amis", amount: 60, date: "2026-05-15", isBudgetReference: true, budgetId: "b_friends", isCashDepositPending: true, isDeposited: false, originalCashAmount: 60 }
    ];
    state.budgets = [];
    
    const targetMonth = "2026-06";
    const carryAmount = 1200;
    
    const carriedBudgets = [{
        title: "Vacances",
        allocated: 300,
        originalAllocated: 300,
        type: "deducted",
        subType: "classic",
        createdDate: "2026-05-10",
        archivedExpenses: []
    }];
    
    const pendingDeposits = state.expenses ? state.expenses.filter(e => e.isCashDepositPending && !e.isDeposited) : [];
    
    state.expenses = [];
    state.budgets = [];
    state.budgetMonth = targetMonth;
    
    pendingDeposits.forEach(d => {
        const dCopy = { ...d };
        dCopy.date = `${targetMonth}-01`;
        state.expenses.push(dCopy);
    });
    
    carriedBudgets.forEach(b => {
        const budgetId = "b_test_carried";
        const mainTransactionId = "exp_budget_test_carried";
        
        const newBudget = {
            id: budgetId,
            title: b.title,
            allocated: b.allocated,
            originalAllocated: b.originalAllocated || b.allocated,
            type: b.type,
            subType: b.subType || "classic",
            expenses: [],
            archivedExpenses: b.archivedExpenses || [],
            mainTransactionId: mainTransactionId,
            createdDate: b.createdDate || "2026-06-01"
        };
        
        state.budgets.push(newBudget);
        
        if (b.type === "deducted") {
            const budgetExpense = {
                id: mainTransactionId,
                title: `Enveloppe : ${b.title}`,
                amount: b.allocated,
                date: `${targetMonth}-01`,
                isBudgetReference: true,
                budgetId: budgetId
            };
            state.expenses.push(budgetExpense);
        }
    });
    
    if (carryAmount > 0) {
        const newExpense = {
            id: 'exp_test_carry',
            title: "Bilan précédent",
            amount: -carryAmount,
            date: `${targetMonth}-01`
        };
        state.expenses.push(newExpense);
    }
    
    if (state.budgetMonth !== "2026-06") throw new Error("Mois non transitionné");
    if (state.expenses.length !== 3) throw new Error("Nombre de transactions incorrect: " + state.expenses.length);
    
    const depositTx = state.expenses.find(e => e.isCashDepositPending);
    if (!depositTx || depositTx.amount !== 60) throw new Error("Dépôt espèces non reporté");
    
    const balanceTx = state.expenses.find(e => e.title === "Bilan précédent");
    if (!balanceTx || balanceTx.amount !== -1200) throw new Error("Report solde incorrect");
    
    const budgetTx = state.expenses.find(e => e.id === "exp_budget_test_carried");
    if (!budgetTx || budgetTx.amount !== 300) throw new Error("Transaction enveloppe reportée incorrecte");
    
    return true;
}

function testClassicEnvelopes() {
    state.budgetMonth = "2026-06";
    state.revenues = [{ id: "r1", title: "Salaire", amount: 2000 }];
    state.fixedCharges = [];
    state.expenses = [];
    state.budgets = [];
    
    const budgetId = "classic_b";
    const mainTransactionId = "main_tx_classic";
    
    const newBudget = {
        id: budgetId,
        title: "Restaurants",
        allocated: 150,
        originalAllocated: 150,
        type: "deducted",
        subType: "classic",
        expenses: [],
        archivedExpenses: [],
        mainTransactionId: mainTransactionId,
        createdDate: "2026-06-01"
    };
    state.budgets.push(newBudget);
    
    const budgetExpense = {
        id: mainTransactionId,
        title: `Enveloppe : Restaurants`,
        amount: 150,
        date: "2026-06-01",
        isBudgetReference: true,
        budgetId: budgetId
    };
    state.expenses.push(budgetExpense);
    
    let totals = calculateTotals();
    if (totals.remaining !== 1850) throw new Error("Calcul initial reste à vivre erroné: " + totals.remaining);
    
    newBudget.expenses.push({
        id: "op_1",
        title: "Pizzeria",
        amount: 100,
        date: "2026-06-05"
    });
    syncMainBudgetReference(newBudget);
    
    totals = calculateTotals();
    if (totals.remaining !== 1850) throw new Error("Reste à vivre après dépense enveloppe erroné: " + totals.remaining);
    
    newBudget.expenses.push({
        id: "op_2",
        title: "Sushi",
        amount: 80,
        date: "2026-06-10"
    });
    syncMainBudgetReference(newBudget);
    
    totals = calculateTotals();
    if (totals.remaining !== 1820) throw new Error("Calcul dépassement reste à vivre erroné: " + totals.remaining);
    
    // Test CLOSE of classic envelope
    executeCloseBudgetLogic(newBudget);
    
    if (!newBudget.closed) throw new Error("L'enveloppe classique ne s'est pas fermée");
    
    const finalTx = state.expenses.find(e => e.budgetId === budgetId && (e.isClassicFinal || e.id.startsWith("tx_final_")));
    if (!finalTx) throw new Error("La transaction finale de l'enveloppe classique est manquante");
    if (finalTx.amount !== 180) throw new Error("Montant de la transaction finale classique erroné: " + finalTx.amount);
    
    const originalRefExists = state.expenses.some(e => e.id === mainTransactionId);
    if (originalRefExists) throw new Error("La transaction de référence d'origine est restée active après clôture classique");
    
    totals = calculateTotals();
    if (totals.remaining !== 1820) throw new Error("Reste à vivre après clôture classique erroné: " + totals.remaining);
    
    // Test REOPEN of classic envelope
    executeReopenBudgetLogic(newBudget);
    
    if (newBudget.closed) throw new Error("L'enveloppe classique ne s'est pas réouverte");
    
    const finalTxAfterReopen = state.expenses.some(e => e.budgetId === budgetId && (e.isClassicFinal || e.id.startsWith("tx_final_")));
    if (finalTxAfterReopen) throw new Error("La transaction finale classique n'a pas été supprimée lors de la réouverture");
    
    const originalRefRestored = state.expenses.find(e => e.id === mainTransactionId);
    if (!originalRefRestored) throw new Error("La transaction de référence d'origine n'a pas été restaurée après réouverture classique");
    if (originalRefRestored.amount !== 180) throw new Error("Montant de la transaction de référence restaurée erroné: " + originalRefRestored.amount);
    
    totals = calculateTotals();
    if (totals.remaining !== 1820) throw new Error("Reste à vivre après réouverture classique erroné: " + totals.remaining);
    
    return true;
}

function testFriendsEnvelopes() {
    state.budgetMonth = "2026-06";
    state.revenues = [{ id: "r1", title: "Salaire", amount: 2000 }];
    state.fixedCharges = [];
    state.expenses = [];
    state.budgets = [];
    
    const budgetId = "friends_b";
    const mainTransactionId = "main_tx_friends";
    
    const newBudget = {
        id: budgetId,
        title: "Cadeau Commun",
        allocated: 200,
        originalAllocated: 200,
        type: "deducted",
        subType: "friends",
        expenses: [],
        archivedExpenses: [],
        mainTransactionId: mainTransactionId,
        createdDate: "2026-06-01"
    };
    state.budgets.push(newBudget);
    
    const budgetExpense = {
        id: mainTransactionId,
        title: `Avance : Cadeau Commun`,
        amount: 200,
        date: "2026-06-01",
        isBudgetReference: true,
        budgetId: budgetId
    };
    state.expenses.push(budgetExpense);
    
    let totals = calculateTotals();
    if (totals.remaining !== 1800) throw new Error("Reste à vivre initial erroné: " + totals.remaining);
    
    newBudget.expenses.push({
        id: "op_ref_1",
        title: "Remb. A",
        amount: -50,
        date: "2026-06-05",
        isCash: false
    });
    // Mimic addBudgetOperation by adding the digital refund transaction to main expenses
    state.expenses.push({
        id: "tx_ref_cb_op_ref_1",
        title: `Remb. numérique : ${newBudget.title} (Remb. A)`,
        amount: -50,
        date: "2026-06-05",
        isBudgetReference: true,
        budgetId: newBudget.id,
        isDigitalRefundTx: true,
        budgetOpId: "op_ref_1"
    });
    syncMainBudgetReference(newBudget);
    
    totals = calculateTotals();
    if (totals.remaining !== 1850) throw new Error("Reste à vivre après virement erroné: " + totals.remaining);
    
    newBudget.expenses.push({
        id: "op_ref_2",
        title: "Remb. B (Cash)",
        amount: -60,
        date: "2026-06-06",
        isCash: true
    });
    syncMainBudgetReference(newBudget);
    
    totals = calculateTotals();
    if (totals.remaining !== 1850) throw new Error("Reste à vivre après espèces erroné: " + totals.remaining);
    
    const refTx = state.expenses.find(e => e.id === mainTransactionId);
    if (!refTx || refTx.amount !== 200) throw new Error("Reste à vivre attendu incorrect sur la transaction de référence: " + (refTx ? refTx.amount : "null"));
    
    const refundTx = state.expenses.find(e => e.isDigitalRefundTx && e.budgetId === budgetId);
    if (!refundTx || refundTx.amount !== -50) throw new Error("Remboursement numérique manquant ou incorrect dans l'historique principal");
    
    return true;
}

function testCashManagement() {
    state.budgetMonth = "2026-06";
    state.revenues = [{ id: "r1", title: "Salaire", amount: 2000 }];
    state.fixedCharges = [];
    state.expenses = [];
    state.budgets = [];
    
    const budgetId = "friends_b_cash";
    const mainTransactionId = "main_tx_friends_cash";
    
    const newBudget = {
        id: budgetId,
        title: "Cadeau Commun",
        allocated: 200,
        originalAllocated: 200,
        type: "deducted",
        subType: "friends",
        expenses: [
            { id: "op_ref_1", title: "Remb. A", amount: -50, date: "2026-06-05", isCash: false },
            { id: "op_ref_2", title: "Remb. B (Cash)", amount: -60, date: "2026-06-06", isCash: true },
            { id: "op_ref_3", title: "Remb. C (Cash)", amount: -40, date: "2026-06-07", isCash: true }
        ],
        archivedExpenses: [],
        mainTransactionId: mainTransactionId,
        createdDate: "2026-06-01"
    };
    state.budgets.push(newBudget);
    
    const budgetExpense = {
        id: mainTransactionId,
        title: `Avance : Cadeau Commun`,
        amount: 150,
        date: "2026-06-01",
        isBudgetReference: true,
        budgetId: budgetId
    };
    state.expenses.push(budgetExpense);
    
    // --- 1. Test ACTIVE DEPOSIT (for op_ref_2, -60 €) ---
    // Simulate active deposit of the 60 € cash refund from op_ref_2
    const activeTxId = "tx_active_cash_test";
    const isIndependent = newBudget.type !== "deducted";
    const activeCashTx = {
        id: activeTxId,
        title: `Dépôt espèces : ${newBudget.title}`,
        amount: isIndependent ? -60 : 0,
        date: "2026-06-06",
        isBudgetReference: true,
        budgetId: newBudget.id,
        isCashDepositPending: true,
        isDeposited: true, // Active deposit is deposited immediately!
        originalCashAmount: 60
    };
    state.expenses.push(activeCashTx);
    
    // Mark op_ref_2 as deposited inside the envelope
    const opRef2 = newBudget.expenses.find(e => e.id === "op_ref_2");
    opRef2.isDeposited = true;
    opRef2.depositTxId = activeTxId;
    
    // Verification: Active deposit must be immediately completed (isDeposited === true)
    if (!opRef2.isDeposited || opRef2.depositTxId !== activeTxId) {
        throw new Error("L'opération active d'espèces n'a pas été marquée déposée");
    }
    const foundActiveTx = state.expenses.find(e => e.id === activeTxId);
    if (!foundActiveTx || !foundActiveTx.isDeposited || foundActiveTx.isCashDepositPending !== true) {
        throw new Error("La transaction de dépôt actif principal n'est pas marquée comme effectuée immédiatement");
    }
    
    // --- 2. Test CLOSURE DEPOSIT (for remaining cash: op_ref_3, -40 €) ---
    executeCloseBudgetLogic(newBudget);
    
    if (!newBudget.closed) throw new Error("L'enveloppe ne s'est pas fermée");
    
    const refTxExists = state.expenses.some(e => e.id === mainTransactionId);
    if (refTxExists) throw new Error("La transaction de référence est restée active");
    
    // Spent = -50 (digital) + -60 (cash) + -40 (cash) = -150
    // partUtilisateur = 200 - 150 = 50
    // Avec la nouvelle logique, la part finale de Reste à Vivre initiale lors de la clôture
    // doit inclure les espèces non déposées (40 €), soit 50 + 40 = 90 €
    const shareTx = state.expenses.find(e => e.isFinalShare);
    if (!shareTx || shareTx.amount !== 90) throw new Error("Part finale erronée: attendu 90, obtenu " + (shareTx ? shareTx.amount : "null"));
    
    // Check that active cash deposit is still there and completed
    const activeTxAfterClose = state.expenses.find(e => e.id === activeTxId);
    if (!activeTxAfterClose || !activeTxAfterClose.isDeposited) {
        throw new Error("Le dépôt d'espèces actif a été altéré ou supprimé lors de la clôture");
    }
    
    // Check that remaining cash (40 €) generated a pending deposit with amount = -40 (always negative)
    const pendingCashTx = state.expenses.find(e => e.isCashDepositPending && e.id !== activeTxId);
    if (!pendingCashTx || pendingCashTx.amount !== -40 || pendingCashTx.isDeposited !== false || pendingCashTx.originalCashAmount !== 40) {
        throw new Error("Transaction d'espèces de clôture manquante ou erronée (attendu en attente de 40 €)");
    }
    
    // Verify that before deposit confirmation, the balance is 2000 - 90 = 1910 € (40 € non-deposited are NOT reinjected yet)
    let totals = calculateTotals();
    if (totals.remaining !== 1910) {
        throw new Error("Calcul avant dépôt espèces de clôture erroné: attendu 1910, obtenu " + totals.remaining);
    }
    
    // Confirm the pending closure deposit
    pendingCashTx.isDeposited = true;
    pendingCashTx.amount = -40;
    
    totals = calculateTotals();
    if (totals.remaining !== 1950) throw new Error("Calcul final après dépôt espèces erroné: " + totals.remaining);
    
    // --- 3. Test REOPEN after cash deposit confirmed ---
    executeReopenBudgetLogic(newBudget);
    
    if (newBudget.closed) throw new Error("L'enveloppe entre amis ne s'est pas réouverte");
    
    // The final share and closure cash transactions should be removed
    const shareTxAfterReopen = state.expenses.some(e => e.id === shareTx.id);
    if (shareTxAfterReopen) throw new Error("La part finale n'a pas été supprimée lors de la réouverture");
    const closureCashTxAfterReopen = state.expenses.some(e => e.id === pendingCashTx.id);
    if (closureCashTxAfterReopen) throw new Error("La transaction d'espèces de clôture n'a pas été supprimée lors de la réouverture");
    
    // The original main transaction must be restored
    const restoredRef = state.expenses.find(e => e.id === mainTransactionId);
    if (!restoredRef) throw new Error("La transaction d'avance d'origine n'a pas été restaurée");
    
    // Since all cash is deposited (60 € + 40 €), cashAvailable = 0, spent (excluding CB) = -100.
    // refTx.amount = Math.max(0, partUtilisateur + cashAvailable) = Math.max(0, 100 + 0) = 100 €
    if (restoredRef.amount !== 100) throw new Error("Montant de la transaction d'avance restaurée erroné: " + restoredRef.amount);
    
    // The reopened deposit for the 40 € cash should be created with amount = 0
    const reopenedCashTx = state.expenses.find(e => e.isCashDepositPending && e.id !== activeTxId);
    if (!reopenedCashTx) throw new Error("Dépôt d'espèces réouvert manquant");
    if (reopenedCashTx.amount !== 0 || reopenedCashTx.isDeposited !== true || reopenedCashTx.originalCashAmount !== 40) {
        throw new Error("Dépôt d'espèces réouvert non configuré comme validé ou montant erroné: " + reopenedCashTx.amount);
    }
    
    totals = calculateTotals();
    if (totals.remaining !== 1950) {
        throw new Error("Reste à vivre après réouverture enveloppe amis erroné: attendu 1950, obtenu " + totals.remaining);
    }
    
    return true;
}

function testPeriodSecurity() {
    const today = new Date();
    const nextMonthStr = getNextMonth(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`);
    const [bYear, bMonth] = nextMonthStr.split('-').map(Number);
    
    const isSameMonth = (today.getFullYear() === bYear && (today.getMonth() + 1) === bMonth);
    const isFutureMonth = (today.getFullYear() < bYear || (today.getFullYear() === bYear && (today.getMonth() + 1) < bMonth));
    
    let isBlocked = false;
    if (isSameMonth || isFutureMonth) {
        const daysInMonth = new Date(bYear, bMonth, 0).getDate();
        const thresholdDay = daysInMonth - 10;
        if (isFutureMonth || (isSameMonth && today.getDate() < thresholdDay)) {
            isBlocked = true;
        }
    }
    
    if (!isBlocked) {
        throw new Error("Transition anticipée non bloquée");
    }
    
    const pastMonthStr = getPreviousMonth(getPreviousMonth(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`));
    const [pYear, pMonth] = pastMonthStr.split('-').map(Number);
    
    const isSameMonthP = (today.getFullYear() === pYear && (today.getMonth() + 1) === pMonth);
    const isFutureMonthP = (today.getFullYear() < pYear || (today.getFullYear() === pYear && (today.getMonth() + 1) < pMonth));
    
    let isBlockedP = false;
    if (isSameMonthP || isFutureMonthP) {
        const daysInMonthP = new Date(pYear, pMonth, 0).getDate();
        const thresholdDayP = daysInMonthP - 10;
        if (isFutureMonthP || (isSameMonthP && today.getDate() < thresholdDayP)) {
            isBlockedP = true;
        }
    }
    
    if (isBlockedP) {
        throw new Error("Transition passée bloquée à tort");
    }
    
    return true;
}

let bannerHeightDiffMax = 0;
let bannerStickyTop = 0;

function measureBannerHeights() {
    requestAnimationFrame(() => {
        const bannerContainer = document.getElementById("sticky_banner_container");
        if (!bannerContainer) return;
        
        // Sauvegarder la valeur actuelle de --scroll-progress
        const currentProgress = bannerContainer.style.getPropertyValue("--scroll-progress") || "0";
        
        // Mesurer la hauteur en mode étendu (progress = 0)
        bannerContainer.style.setProperty("--scroll-progress", "0");
        const H_expanded = bannerContainer.offsetHeight;
        
        // Mesurer la hauteur en mode compact (progress = 1)
        bannerContainer.style.setProperty("--scroll-progress", "1");
        const H_compact = bannerContainer.offsetHeight;
        
        // Restaurer la progression actuelle
        bannerContainer.style.setProperty("--scroll-progress", currentProgress);
        
        bannerHeightDiffMax = H_expanded - H_compact;
        
        // Mesurer le point de blocage absolu du conteneur sticky (via le sentinel non-sticky si disponible)
        const sentinel = document.getElementById("sticky_banner_sentinel");
        if (sentinel) {
            const rect = sentinel.getBoundingClientRect();
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            bannerStickyTop = rect.top + scrollTop;
        } else {
            const originalPositionStyle = bannerContainer.style.position;
            bannerContainer.style.position = "relative";
            const rect = bannerContainer.getBoundingClientRect();
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            bannerStickyTop = rect.top + scrollTop;
            bannerContainer.style.position = originalPositionStyle;
        }

        // Assurer que la hauteur de page est suffisante pour permettre une transition complète de 100px past bannerStickyTop
        const mainAppContainer = document.getElementById("main_app_container");
        const scrollSpacer = document.getElementById("scroll_spacer");
        if (mainAppContainer) {
            mainAppContainer.style.paddingBottom = ""; // Réinitialiser pour mesurer la hauteur naturelle
            if (scrollSpacer) scrollSpacer.style.height = "0px"; // Réinitialiser le spacer

            const computedStyle = window.getComputedStyle(mainAppContainer);
            const defaultPb = parseFloat(computedStyle.paddingBottom) || 32;
            
            const currentScrollHeight = document.documentElement.scrollHeight;
            const collapseDistance = 100; // Distance en px pour réaliser le pliage complet
            const neededScrollHeight = bannerStickyTop + collapseDistance + window.innerHeight;
            if (currentScrollHeight < neededScrollHeight) {
                const deficit = neededScrollHeight - currentScrollHeight;
                mainAppContainer.style.paddingBottom = `${defaultPb + deficit}px`;
            }
        }

        // Mettre à jour immédiatement
        updateScrollEffects();
    });
}

function updateScrollEffects() {
    const bannerContainer = document.getElementById("sticky_banner_container");
    const scrollSpacer = document.getElementById("scroll_spacer");
    const cardBottomGrid = document.getElementById("card_bottom_grid");
    if (!bannerContainer) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const collapseDistance = 100; // Distance en px pour réaliser le pliage complet

    let progress = 0;
    if (scrollTop > bannerStickyTop) {
        progress = (scrollTop - bannerStickyTop) / collapseDistance;
        progress = Math.max(0, Math.min(1, progress));
    }

    // Appliquer la progression sur la variable CSS
    bannerContainer.style.setProperty("--scroll-progress", progress);

    // Ajuster le spacer pour compenser exactement la hauteur perdue par la carte
    if (scrollSpacer) {
        scrollSpacer.style.height = `${progress * bannerHeightDiffMax}px`;
    }

    // Bloquer les clics sur les boutons du bas en mode compact
    if (cardBottomGrid) {
        cardBottomGrid.style.pointerEvents = progress > 0.5 ? "none" : "auto";
    }

    // Gestion de la classe sémantique compacte
    if (progress >= 0.95) {
        bannerContainer.classList.add("is-compact");
    } else {
        bannerContainer.classList.remove("is-compact");
    }
}

function initScrollEffects() {
    window.addEventListener("scroll", updateScrollEffects, { passive: true });
    window.addEventListener("resize", measureBannerHeights);
    
    measureBannerHeights();
}

// --- LOGIQUE DES ARCHIVES DE TICKETS ---
function renderTicketArchives() {
    const container = document.getElementById("settings_archives_container");
    if (!container) return;

    if (!state.ticketArchives || state.ticketArchives.length === 0) {
        container.innerHTML = `<p class="text-[11px] text-stone-400 italic text-center py-2">Aucun ticket archivé pour le moment.</p>`;
        return;
    }

    // --- ETAPE 1 : AUTO-RÉPARATION & NETTOYAGE DES DOUBLONS ---
    let archivesToKeep = [];
    let envelopeTicketMap = new Map();

    state.ticketArchives.forEach(arch => {
        if (arch.type === "Mensuel") {
            archivesToKeep.push(arch);
        } else {
            // Extraction sécurisée de l'ID (compatible anciens et nouveaux tickets)
            let bId = arch.budgetId;
            if (!bId && arch.id) {
                const match = arch.id.match(/env_(b_.*)/);
                if (match) bId = match[1];
            }

            let budget = state.budgets ? state.budgets.find(b => b.id === bId) : null;

            // AUTO-RÉPARATION : Si l'ID a changé avec le report de mois, on la retrouve par son titre
            if (!budget && state.budgets) {
                budget = state.budgets.find(b => arch.title.includes(b.title));
            }

            if (budget) {
                // On met à jour l'ID du ticket pour le lier à l'enveloppe actuelle
                arch.budgetId = budget.id;
                arch.id = `arch_env_${budget.id}`;
                
                // Le Map fusionne automatiquement les tickets en double (garde le plus récent)
                envelopeTicketMap.set(arch.id, arch);
            } else {
                // L'enveloppe n'existe vraiment plus (suppression manuelle)
                archivesToKeep.push(arch);
            }
        }
    });

    // Mise à jour silencieuse de la base si on a réparé ou nettoyé des tickets
    const healedArchives = [...archivesToKeep, ...Array.from(envelopeTicketMap.values())];
    if (JSON.stringify(state.ticketArchives) !== JSON.stringify(healedArchives)) {
        state.ticketArchives = healedArchives;
        localStorage.setItem("budget_hmr_simple", JSON.stringify(state));
    }

    // --- ETAPE 2 : TRI (En cours vs Supprimables) ---
    const currentItems = [];
    const deletableItems = [];

    state.ticketArchives.forEach(arch => {
        let isDeletable = false;

        if (arch.type === "Mensuel") {
            isDeletable = (arch.date !== state.budgetMonth);
        } else {
            const budget = state.budgets ? state.budgets.find(b => b.id === arch.budgetId) : null;
            
            if (!budget) {
                isDeletable = true; // Orphelin
            } else {
                if (budget.closed && arch.date !== state.budgetMonth) {
                    isDeletable = true;
                } else {
                    isDeletable = false;
                }
            }
        }

        if (isDeletable) {
            deletableItems.push(arch);
        } else {
            currentItems.push(arch);
        }
    });

    currentItems.sort((a, b) => b.id.localeCompare(a.id));
    deletableItems.sort((a, b) => b.id.localeCompare(a.id));

    // --- ETAPE 3 : AFFICHAGE HTML ---
    let html = "";

    if (currentItems.length > 0) {
        html += `<div class="text-[9px] font-black text-stone-400 uppercase tracking-wider mb-1.5 select-none mt-1">En cours</div>`;
        html += currentItems.map(arch => `
            <div onclick="openArchiveModal('${arch.id}')" class="p-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-brand-400 dark:hover:border-brand-500 transition-all active:scale-98 mb-2">
                <div class="flex items-center gap-2">
                    <span>${arch.type === 'Mensuel' ? '📊' : '🎯'}</span>
                    <div>
                        <span class="block font-bold text-stone-800 dark:text-stone-200 text-[11px]">${arch.title}</span>
                        <span class="block text-[9px] text-stone-400 uppercase font-black">${arch.type}</span>
                    </div>
                </div>
                <span class="text-stone-400 text-[10px] pr-1">👁️</span>
            </div>
        `).join("");
    }

    if (deletableItems.length > 0) {
        html += `<div class="text-[9px] font-black text-stone-400 uppercase tracking-wider mb-1.5 select-none mt-3">Archives (Supprimables)</div>`;
        html += deletableItems.map(arch => `
            <div onclick="openArchiveModal('${arch.id}')" class="p-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-brand-400 dark:hover:border-brand-500 transition-all active:scale-98 mb-2">
                <div class="flex items-center gap-2">
                    <span>${arch.type === 'Mensuel' ? '📊' : '🎯'}</span>
                    <div>
                        <span class="block font-bold text-stone-800 dark:text-stone-200 text-[11px]">${arch.title}</span>
                        <span class="block text-[9px] text-stone-400 uppercase font-black">${arch.type}</span>
                    </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <span class="text-stone-400 text-[10px]">👁️</span>
                    <button onclick="deleteArchiveTicket(event, '${arch.id}')" class="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all flex items-center justify-center font-bold text-[9px] shadow-sm active:scale-90" title="Supprimer le ticket">
                        ✕
                    </button>
                </div>
            </div>
        `).join("");
    }

    container.innerHTML = html;
}

function deleteArchiveTicket(event, archiveId) {
    if (event) event.stopPropagation();
    const arch = state.ticketArchives.find(a => a.id === archiveId);
    if (!arch) return;

    showGenericConfirm(
        "Supprimer ce ticket ?",
        `Voulez-vous définitivement supprimer le ticket <strong>"${arch.title}"</strong> de l'archive ? Cette action est irréversible.`,
        "🗑️",
        () => {
            state.ticketArchives = state.ticketArchives.filter(a => a.id !== archiveId);
            saveState();
            renderTicketArchives();
            triggerHaptic('confirm');
        }
    );
}

function openArchiveModal(archiveId) {
    const arch = state.ticketArchives.find(a => a.id === archiveId);
    if (!arch) return;

    document.getElementById("archive_modal_text").textContent = arch.rawText;
    
    const pdfBtn = document.getElementById("btn_reexport_archive");
    pdfBtn.onclick = () => {
        reexportArchiveToPDF(arch);
    };

    const modal = document.getElementById("view_archive_modal");
    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.querySelector(".glass-card").classList.remove("scale-95");
    }, 10);
}

function closeArchiveModal() {
    const modal = document.getElementById("view_archive_modal");
    modal.classList.add("opacity-0");
    modal.querySelector(".glass-card").classList.add("scale-95");
    setTimeout(() => modal.classList.add("hidden"), 300);
}

function reexportArchiveToPDF(archive) {
    let htmlString = `<div style="width: 302px; font-family: monospace; font-size: 9pt; line-height: 1.3; color: #000000; background: #ffffff; padding: 10px; box-sizing: border-box; margin: 0 auto;">`;
    htmlString += `<pre style="font-family: monospace; font-size: 9pt; line-height: 1.3; white-space: pre-wrap; margin: 0; padding: 0; border: none; background: none; color: #000000;">${archive.rawText}</pre>`;
    htmlString += `</div>`;

    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute"; tempDiv.style.top = "-9999px"; tempDiv.innerHTML = htmlString;
    document.body.appendChild(tempDiv);
    const measuredHeightMm = Math.ceil(tempDiv.offsetHeight * 0.264583) + 8;
    document.body.removeChild(tempDiv);

    // Formatage propre du nom de fichier pour éviter les caractères spéciaux
    const cleanTitle = archive.title.replace(/[^a-zA-Z0-9_\u00C0-\u017F\s-]/g, '').replace(/\s+/g, '_');
    const safeFileName = `Ticket_${cleanTitle}.pdf`;

    const opt = {
        margin: [2, 2, 2, 2],
        filename: safeFileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: [80, measuredHeightMm], orientation: 'portrait' }
    };

    html2pdf().set(opt).from(htmlString).toPdf().outputPdf('blob').then(async (blob) => {
        const isNativeAPK = window.Capacitor && window.Capacitor.isNativePlatform();
        const isMobileWebView = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.chrome;

        // Branchement natif APK / Mobile
        if (isNativeAPK || isMobileWebView) {
            const fs = window.Capacitor?.Plugins?.Filesystem;
            if (fs) {
                try {
                    const base64Data = await new Promise((res, rej) => {
                        const reader = new FileReader();
                        reader.onloadend = () => res(reader.result.split(',')[1]);
                        reader.onerror = rej;
                        reader.readAsDataURL(blob);
                    });
                    await fs.writeFile({ path: safeFileName, data: base64Data, directory: 'DOWNLOAD' });
                    showGenericAlert("Succès", "Ticket PDF enregistré dans tes Téléchargements.", "✅");
                } catch (err) {
                    // Fallback sur le partage si l'écriture directe échoue
                    await shareBlob(blob, safeFileName, `Ticket ${archive.title}`, `Ticket d'archive`);
                }
            } else {
                await shareBlob(blob, safeFileName, `Ticket ${archive.title}`, `Ticket d'archive`);
            }
        } else {
            // Branchement Navigateur Web Classique
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = safeFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        triggerHaptic('success');
    }).catch(err => {
        console.error("Erreur génération PDF:", err);
        showGenericAlert("Erreur PDF", "Impossible de générer le document.", "❌");
        triggerHaptic('error');
    });
}


