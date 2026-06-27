// =========================================================================
// INTERFACE UTILISATEUR ET COMPOSANTS DOM DES TAGS (tagsUI.js)
// Rôle : Gérer l'affichage visuel des tags et les modales de sélection
// =========================================================================

import { state, saveState, mergeCustomTagsIntoExpenseTags } from '../store/state.js';
import { TAG_DATA, EXPENSE_TAGS, TAG_CATEGORIES, TAG_EMOJI_PICKER } from '../config/tags.js';
import { stripAccents } from '../utils/stringUtils.js';
import { triggerHaptic } from '../utils/domUtils.js';
import { getTopUsedTags, getSuggestedTags } from '../services/tagService.js';

// Variables de session locales pour mémoriser l'état des fenêtres modales ouvertes
let activeTagInputId = "";      // ID de l'input caché recevant la clé du tag sélectionné
let activeTagContainerId = "";  // ID du conteneur div affichant les boutons compacts
let activeTagTitleVal = "";     // Libellé textuel en cours de frappe
let activeExcludedKeys = [];    // Clés de tags déjà affichées (à masquer de la modale)

// Variables pour le gestionnaire de tags système
let tagManagerSelectMode = false;
let tagManagerSelected = new Set();
let pendingTagEmoji = '';       // Emoji temporairement sélectionné lors de la création d'un tag perso

/**
 * Enroule ou déroule une catégorie de tags dans la grille de la modale.
 * Mémorise l'état dans le localStorage.
 * 
 * @param {string} catKey - Clé de la catégorie à basculer (ex: 'alimentation').
 */
export function toggleTagCategory(catKey) {
    let collapsed = JSON.parse(localStorage.getItem('budget_hmr_collapsed_cats') || '[]');
    if (collapsed.includes(catKey)) {
        collapsed = collapsed.filter(k => k !== catKey); // Déroule la catégorie
    } else {
        collapsed.push(catKey); // Enroule la catégorie
    }
    localStorage.setItem('budget_hmr_collapsed_cats', JSON.stringify(collapsed));
    
    // Recharge la modale avec les mêmes paramètres pour mettre à jour l'affichage
    openTagSelectionModal(activeTagInputId, activeTagContainerId, activeTagTitleVal, activeExcludedKeys);
}

/**
 * Ouvre la modale globale de sélection de tag complet (avec barre de recherche).
 * 
 * @param {string} inputId - ID de l'input masqué stockant la valeur sélectionnée.
 * @param {string} containerId - ID du conteneur affichant les tags compacts.
 * @param {string} titleVal - Valeur du titre de la dépense en cours de frappe.
 * @param {Array<string>} excludedKeys - Liste des tags compacts affichés (à ne pas afficher en double).
 */
export function openTagSelectionModal(inputId, containerId, titleVal, excludedKeys) {
    activeTagInputId = inputId;
    activeTagContainerId = containerId;
    activeTagTitleVal = titleVal;
    activeExcludedKeys = excludedKeys;

    // Réinitialise et lie l'événement de frappe sur le champ de recherche de la modale
    const searchInput = document.getElementById("tag_search_input");
    if (searchInput) {
        searchInput.value = "";
        searchInput.oninput = (e) => {
            renderTagSelectionGrid(e.target.value);
        };
    }

    // Affiche la grille par défaut (vide)
    renderTagSelectionGrid("");

    // Animation d'affichage CSS (effet d'apparition fluide)
    const modal = document.getElementById("tag_selection_modal");
    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.querySelector(".glass-card").classList.remove("scale-95");
        if (searchInput) {
            searchInput.focus(); // Focus direct pour saisie immédiate
        }
    }, 10);
}

/**
 * Génère dynamiquement la grille des boutons de tags dans la modale de sélection.
 * Gère deux modes d'affichage :
 * - Mode normal : Affiche les tags favoris (les plus utilisés) puis les catégories triées par pertinence.
 * - Mode recherche : Filtre les tags par mot-clé de recherche.
 * 
 * @param {string} query - Requête de recherche textuelle saisie par l'utilisateur.
 */
export function renderTagSelectionGrid(query = "") {
    const container = document.getElementById("tag_selection_grid");
    if (!container) return;
    container.innerHTML = "";

    const excludedKeys = activeExcludedKeys || [];

    // Helper interne pour instancier un bouton de tag dans la grille
    const createBtn = (key) => {
        if (excludedKeys.includes(key)) return null;
        if (!key.startsWith('custom_') && (state.disabledTags || []).includes(key)) return null;
        
        const tag = EXPENSE_TAGS[key];
        if (!tag) return null;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "py-2.5 px-1 rounded-xl text-[10px] font-mono font-black border transition-all flex flex-col items-center justify-center gap-1 active:scale-95 bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-800 hover:border-brand-400 hover:bg-brand-50/40 dark:hover:bg-brand-900/20 select-none";
        btn.innerHTML = `<span class="text-xl">${tag.icon}</span> <span class="truncate w-full text-center uppercase tracking-tight">${tag.label}</span>`;

        // Événement au clic sur un tag
        btn.onclick = () => {
            const input = document.getElementById(activeTagInputId);
            if (input) input.value = key;
            // Met à jour la barre de raccourcis compacts
            renderCompactTags(activeTagContainerId, activeTagInputId, activeTagTitleVal);
            closeTagSelectionModal();
            triggerHaptic(10);
        };
        return btn;
    };

    // Calcul des statistiques d'usage
    const tagCounts = {};
    const allOps = [...state.expenses];
    state.budgets.forEach(b => {
        if (b.expenses) allOps.push(...b.expenses);
        if (b.archivedExpenses) allOps.push(...b.archivedExpenses);
    });
    allOps.forEach(op => {
        if (op.tag) tagCounts[op.tag] = (tagCounts[op.tag] || 0) + 1;
    });

    const cleanQuery = stripAccents(query.trim().toLowerCase());

    if (cleanQuery.length > 0) {
        // --- CAS A : MODE RECHERCHE ACTIVÉ ---
        const matchedKeys = Object.keys(EXPENSE_TAGS).filter(key => {
            const tag = EXPENSE_TAGS[key];
            const cleanLabel = stripAccents(tag.label.toLowerCase());
            const cleanKey = stripAccents(key.toLowerCase());
            return cleanLabel.includes(cleanQuery) || cleanKey.includes(cleanQuery);
        });

        // Tri par pertinence (les tags commençant par la requête d'abord, puis par fréquence)
        matchedKeys.sort((a, b) => {
            const tagA = EXPENSE_TAGS[a];
            const tagB = EXPENSE_TAGS[b];
            const cleanLabelA = stripAccents(tagA.label.toLowerCase());
            const cleanLabelB = stripAccents(tagB.label.toLowerCase());
            
            const startsA = cleanLabelA.startsWith(cleanQuery) ? 1 : 0;
            const startsB = cleanLabelB.startsWith(cleanQuery) ? 1 : 0;
            
            if (startsA !== startsB) return startsB - startsA;
            
            const countA = tagCounts[a] || 0;
            const countB = tagCounts[b] || 0;
            if (countA !== countB) return countB - countA;
            
            return cleanLabelA.localeCompare(cleanLabelB);
        });

        if (matchedKeys.length === 0) {
            const noResult = document.createElement("div");
            noResult.className = "text-xs text-center text-stone-500 dark:text-stone-400 py-6 font-bold select-none";
            noResult.textContent = "Aucun tag correspondant";
            container.appendChild(noResult);
        } else {
            const searchSection = document.createElement("div");
            searchSection.innerHTML = `<h4 class="text-[10px] font-black text-brand-500 uppercase tracking-tight mb-2 px-1">🔍 Résultats (${matchedKeys.length})</h4><div class="grid grid-cols-3 gap-2"></div>`;
            const searchGrid = searchSection.querySelector(".grid");
            
            matchedKeys.forEach(key => {
                const btn = createBtn(key);
                if (btn) searchGrid.appendChild(btn);
            });
            container.appendChild(searchSection);
        }

        const queryText = query.trim();
        const capitalizedQuery = queryText.charAt(0).toUpperCase() + queryText.slice(1);
        const createBtnDiv = document.createElement("div");
        createBtnDiv.className = "mt-4 pt-2 border-t border-stone-150 dark:border-stone-800";
        createBtnDiv.innerHTML = `
            <button onclick="closeTagSelectionModal(); openCreateTagModal('${capitalizedQuery.replace(/'/g, "\\'")}')" class="w-full py-2.5 rounded-xl border-2 border-dashed border-brand-400/40 text-brand-500 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-brand-50/30 dark:hover:bg-brand-900/20 transition-all active:scale-95">
                ＋ Créer le tag "${capitalizedQuery}"
            </button>
        `;
        container.appendChild(createBtnDiv);
    } else {
        // --- CAS B : MODE NORMAL (AFFICHAGE PAR CATÉGORIES) ---
        
        // 0. Affiche en premier les tags personnalisés de l'utilisateur
        if (state.customTags && state.customTags.length > 0) {
            const customSec = document.createElement("div");
            customSec.innerHTML = `<h4 class="text-[10px] font-black text-brand-500 uppercase tracking-tight mb-2 px-1">⭐ Mes Tags Perso</h4><div class="grid grid-cols-3 gap-2"></div>`;
            const customGrid = customSec.querySelector(".grid");
            state.customTags.forEach(t => {
                const btn = createBtn(t.key);
                if (btn) customGrid.appendChild(btn);
            });
            if (customGrid.children.length > 0) container.appendChild(customSec);
        }

        // 1. Affiche ensuite les favoris les plus utilisés
        const topTags = getTopUsedTags(12);
        const dynSection = document.createElement("div");
        dynSection.innerHTML = `<h4 class="text-[10px] font-black text-brand-500 uppercase tracking-tight mb-2 px-1 flex items-center gap-1">⭐ Les plus utilisés</h4><div class="grid grid-cols-3 gap-2"></div>`;
        const dynGrid = dynSection.querySelector(".grid");
        topTags.forEach(key => {
            const btn = createBtn(key);
            if (btn) dynGrid.appendChild(btn);
        });
        if (dynGrid.children.length > 0) container.appendChild(dynSection);

        // 2. Affiche toutes les catégories système triées par taux d'utilisation
        const collapsedCats = JSON.parse(localStorage.getItem('budget_hmr_collapsed_cats') || '[]');
        const scoredCategories = Object.keys(TAG_CATEGORIES).map(catKey => {
            const cat = TAG_CATEGORIES[catKey];
            let score = 0;
            cat.keys.forEach(key => { score += (tagCounts[key] || 0); });
            return { catKey, score, cat, isCollapsed: collapsedCats.includes(catKey) };
        });

        // Tri des catégories (les déroulées en premier par score d'utilisation, puis les enroulées)
        scoredCategories.sort((a, b) => {
            if (a.isCollapsed === b.isCollapsed) return b.score - a.score;
            return a.isCollapsed ? 1 : -1;
        });

        scoredCategories.forEach(scoredCat => {
            const { catKey, cat, isCollapsed } = scoredCat;
            const sec = document.createElement("div");
            
            const header = document.createElement("div");
            header.className = "flex justify-between items-center mb-2 px-1 cursor-pointer select-none active:scale-95 transition-transform";
            header.onclick = () => { 
                triggerHaptic(10); 
                toggleTagCategory(catKey); 
            };
            
            header.innerHTML = `
                <h4 class="text-[10px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-tight">${cat.label}</h4>
                <span class="text-stone-500 dark:text-stone-400 bg-stone-200/50 dark:bg-stone-800 rounded-full w-6 h-6 flex items-center justify-center transition-transform duration-300 ${isCollapsed ? '-rotate-90' : 'rotate-0'}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                </span>
            `;
            sec.appendChild(header);

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
    }

    // Bouton de pied de page pour ouvrir directement la modale de création d'un tag perso
    const createBtn_el = document.createElement("div");
    createBtn_el.className = "pt-2 border-t border-stone-200/60 dark:border-stone-700/60 mt-2";
    createBtn_el.innerHTML = `<button onclick="closeTagSelectionModal(); setTimeout(openTagManager, 320);" class="w-full py-2.5 rounded-xl border-2 border-dashed border-brand-400/40 text-brand-500 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-brand-50/30 dark:hover:bg-brand-900/20 transition-all active:scale-95">＋ Créer un tag perso</button>`;
    container.appendChild(createBtn_el);
}

/**
 * Ferme la modale de sélection de tag avec animation de sortie.
 */
export function closeTagSelectionModal() {
    const modal = document.getElementById("tag_selection_modal");
    modal.classList.add("opacity-0");
    modal.querySelector(".glass-card").classList.add("scale-95");
    setTimeout(() => modal.classList.add("hidden"), 300);
}

/**
 * Ouvre l'interface de gestion de tous les tags (perso & système).
 */
export function openTagManager() {
    tagManagerSelectMode = false;
    tagManagerSelected = new Set();
    renderTagManager();
    const modal = document.getElementById('tag_manager_modal');
    modal.classList.remove('hidden');
    setTimeout(() => { 
        modal.classList.remove('opacity-0'); 
        modal.querySelector('.glass-card').classList.remove('scale-95'); 
    }, 10);
}

/**
 * Ferme l'interface du gestionnaire de tags avec animation de sortie.
 */
export function closeTagManager() {
    const modal = document.getElementById('tag_manager_modal');
    modal.classList.add('opacity-0');
    modal.querySelector('.glass-card').classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

/**
 * Génère le contenu visuel du gestionnaire de tags (CRUD des tags perso et activation des tags système).
 */
export function renderTagManager() {
    const body = document.getElementById('tag_manager_body');
    if (!body) return;
    const disabled = new Set(state.disabledTags || []);
    let html = '';

    // --- SECTION A : Rendu des Tags Perso de l'utilisateur ---
    html += `<div class="space-y-2"><h4 class="text-[10px] font-black text-brand-500 uppercase tracking-wider">⭐ Mes Tags Perso</h4>`;
    if (!state.customTags || state.customTags.length === 0) {
        html += `<p class="text-[10px] text-stone-400 dark:text-stone-500 font-mono px-1">Aucun tag perso — crée-en un ci-dessous.</p>`;
    } else {
        html += `<div class="space-y-1.5">`;
        state.customTags.forEach(t => {
            html += `<div class="flex items-center justify-between px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-700/60">
                <span class="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-200"><span class="text-base">${t.icon}</span>${t.label}</span>
                <button onclick="deleteCustomTag('${t.key}')" class="w-6 h-6 rounded-md bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all flex items-center justify-center text-[10px] font-black border border-red-500/20">✕</button>
            </div>`;
        });
        html += `</div>`;
    }
    html += `<button onclick="openCreateTagModal()" class="w-full py-2.5 rounded-xl border-2 border-dashed border-brand-400/40 text-brand-500 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-brand-50/30 dark:hover:bg-brand-900/20 transition-all active:scale-95">＋ Créer un tag</button></div>`;
    html += `<hr class="border-stone-200 dark:border-stone-800"/>`;

    // --- SECTION B : Rendu des Tags Système de l'application ---
    html += `<div class="space-y-2">
        <div class="flex items-center justify-between">
            <h4 class="text-[10px] font-black text-stone-400 uppercase tracking-wider">Tags Système</h4>
            <button onclick="bulkSetAllSystemTags(true)" class="text-[9px] font-black text-emerald-500 uppercase tracking-wider px-2 py-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all">Tout activer</button>
        </div>`;

    Object.keys(TAG_DATA).forEach(catKey => {
        const cat = TAG_DATA[catKey];
        const keys = Object.keys(cat.items);
        const activeCount = keys.filter(k => !disabled.has(k)).length;
        const allActive = activeCount === keys.length;
        const noneActive = activeCount === 0;
        const badgeLabel = allActive ? 'COMPLET' : noneActive ? 'AUCUN' : 'PARTIEL';
        const badgeClass = allActive
            ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
            : noneActive
                ? 'bg-red-500/15 text-red-500 border-red-500/30'
                : 'bg-amber-500/15 text-amber-500 border-amber-500/30';
                
        html += `<div class="rounded-xl border border-stone-200/60 dark:border-stone-700/60 overflow-hidden">
            <div class="w-full flex items-center justify-between px-3 py-2.5 bg-stone-50 dark:bg-stone-900">
                <button onclick="toggleTagCategory_mgr('${catKey}')" class="flex items-center gap-2 flex-1 text-left active:scale-[0.99] transition-transform">
                    <span class="text-sm">${cat.label.split(' ')[0]}</span>
                    <span class="text-[10px] font-black text-stone-600 dark:text-stone-300">${cat.label.split(' ').slice(1).join(' ')}</span>
                    <span class="text-stone-400 text-[9px]">▶</span>
                </button>
                <button onclick="toggleCategoryAllTags('${catKey}')"
                     class="text-[8px] font-black px-2 py-0.5 rounded-full border tracking-wider transition-all ${badgeClass}">
                     ${badgeLabel}
                </button>
            </div>
            <div id="catblock_${catKey}" class="hidden px-3 pb-2 pt-1 bg-white dark:bg-stone-950 space-y-1">`;
            
        keys.forEach(k => {
            const tag = cat.items[k];
            const isOn = !disabled.has(k);
            html += `<div class="flex items-center justify-between py-1.5">
                <span class="flex items-center gap-2 text-[11px] font-bold text-stone-600 dark:text-stone-300 select-none">
                     ${tagManagerSelectMode ? `<input type="checkbox" class="accent-brand-500" ${tagManagerSelected.has(k) ? 'checked' : ''} onchange="toggleTagManagerSelect('${k}')">` : ''}
                     <span class="text-sm">${tag.icon}</span><span>${tag.label}</span>
                </span>
                ${!tagManagerSelectMode ? `<button onclick="toggleSingleTag('${k}')" class="relative w-10 h-5 rounded-full transition-all ${isOn ? 'bg-emerald-400' : 'bg-stone-300 dark:bg-stone-600'}">
                     <span class="absolute top-0.5 ${isOn ? 'left-5' : 'left-0.5'} w-4 h-4 rounded-full bg-white shadow transition-all duration-200"></span>
                </button>` : ''}
            </div>`;
        });
        html += `</div></div>`;
    });
    html += `</div>`;
    body.innerHTML = html;

    // Affichage conditionnel de la barre d'action par lot (sélection multiple)
    const bulkBar = document.getElementById('tag_manager_bulk_bar');
    if (bulkBar) {
        const show = tagManagerSelectMode && tagManagerSelected.size > 0;
        bulkBar.classList.toggle('hidden', !show);
        const countEl = document.getElementById('bulk_count');
        if (countEl) countEl.textContent = `${tagManagerSelected.size} sélectionné(s)`;
    }
    const selectBtn = document.getElementById('tag_manager_select_btn');
    if (selectBtn) selectBtn.textContent = tagManagerSelectMode ? 'Annuler' : 'Sélection multiple';
}

/**
 * Affiche ou masque la sous-grille d'une catégorie dans le gestionnaire.
 */
export function toggleTagCategory_mgr(catKey) {
    const block = document.getElementById(`catblock_${catKey}`);
    if (block) block.classList.toggle('hidden');
}

/**
 * Active ou désactive à la volée tous les tags d'une catégorie donnée.
 */
export function toggleCategoryAllTags(catKey) {
    const cat = TAG_DATA[catKey];
    if (!cat) return;
    const keys = Object.keys(cat.items);
    const disabled = new Set(state.disabledTags || []);
    const allActive = keys.every(k => !disabled.has(k));
    keys.forEach(k => { if (allActive) disabled.add(k); else disabled.delete(k); });
    state.disabledTags = Array.from(disabled);
    saveState(); renderTagManager(); triggerHaptic(10);
}

/**
 * Active ou désactive tous les tags système d'un seul clic.
 */
export function bulkSetAllSystemTags(active) {
    state.disabledTags = active ? [] : Object.keys(TAG_DATA).flatMap(c => Object.keys(TAG_DATA[c].items));
    saveState(); renderTagManager(); triggerHaptic(10);
}

/**
 * Active ou désactive un tag système spécifique (bouton toggle switch).
 */
export function toggleSingleTag(key) {
    const disabled = new Set(state.disabledTags || []);
    if (disabled.has(key)) disabled.delete(key); else disabled.add(key);
    state.disabledTags = Array.from(disabled);
    saveState(); renderTagManager(); triggerHaptic(10);
}

/**
 * Ajoute ou retire un tag de la liste de sélection par lot.
 */
export function toggleTagManagerSelect(key) {
    if (tagManagerSelected.has(key)) tagManagerSelected.delete(key); else tagManagerSelected.add(key);
    renderTagManager();
}

/**
 * Bascule le gestionnaire vers le mode sélection multiple par checkboxes.
 */
export function enterTagManagerSelectMode() {
    tagManagerSelectMode = !tagManagerSelectMode;
    tagManagerSelected = new Set();
    renderTagManager();
}

/**
 * Active ou désactive d'un coup tous les tags sélectionnés en mode multiple.
 */
export function bulkSetTags(active) {
    const disabled = new Set(state.disabledTags || []);
    tagManagerSelected.forEach(k => { if (active) disabled.delete(k); else disabled.add(k); });
    state.disabledTags = Array.from(disabled);
    saveState(); tagManagerSelectMode = false; tagManagerSelected = new Set();
    renderTagManager(); triggerHaptic(15);
}

/**
 * Ouvre la modale de création d'un nouveau tag personnalisé.
 */
export function openCreateTagModal(defaultLabel = '') {
    pendingTagEmoji = '';
    const modal = document.getElementById('create_tag_modal');
    if (!modal) return;
    modal.querySelector('#new_tag_label').value = defaultLabel;
    modal.querySelector('#new_tag_emoji_preview').textContent = '?';
    modal.querySelectorAll('.emoji-picker-btn').forEach(b => b.classList.remove('ring-2','ring-brand-500','scale-110'));
    modal.classList.remove('hidden');
    setTimeout(() => { 
        modal.classList.remove('opacity-0'); 
        modal.querySelector('.glass-card').classList.remove('scale-95'); 
    }, 10);
}

/**
 * Ferme la modale de création de tag perso avec animation.
 */
export function closeCreateTagModal() {
    const modal = document.getElementById('create_tag_modal');
    modal.classList.add('opacity-0');
    modal.querySelector('.glass-card').classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

/**
 * Enregistre l'emoji choisi dans le formulaire de création de tag perso.
 */
export function selectTagEmoji(emoji, btn) {
    pendingTagEmoji = emoji;
    document.querySelectorAll('.emoji-picker-btn').forEach(b => b.classList.remove('ring-2','ring-brand-500','scale-110'));
    btn.classList.add('ring-2','ring-brand-500','scale-110');
    document.getElementById('new_tag_emoji_preview').textContent = emoji;
}

/**
 * Sauvegarde le nouveau tag personnalisé, l'injecte dans le modèle et met à jour l'UI.
 */
export function saveCustomTag() {
    const label = (document.getElementById('new_tag_label')?.value || '').trim();
    if (!pendingTagEmoji) { window.showGenericAlert('Choisis un emoji !', ''); return; }
    if (!label) { window.showGenericAlert('Saisis un libellé !', ''); return; }
    const key = `custom_${Date.now()}`;
    if (!state.customTags) state.customTags = [];
    
    state.customTags.push({ key, icon: pendingTagEmoji, label });
    mergeCustomTagsIntoExpenseTags();
    saveState(); closeCreateTagModal(); renderTagManager(); triggerHaptic(15);
}

/**
 * Supprime définitivement un tag personnalisé de la configuration de l'utilisateur.
 */
export function deleteCustomTag(key) {
    state.customTags = (state.customTags || []).filter(t => t.key !== key);
    mergeCustomTagsIntoExpenseTags();
    saveState(); renderTagManager(); triggerHaptic(10);
}

/**
 * Gère le rendu et la sélection des 3 raccourcis rapides de tags (section compacte sous la saisie).
 */
export function renderCompactTags(containerId, inputId, titleVal = "", isTyping = false) {
    const container = document.getElementById(containerId);
    const input = document.getElementById(inputId);
    if (!container || !input) return;

    // Récupération des deux meilleures suggestions
    const { tags: suggestions, autoMatch } = getSuggestedTags(titleVal);

    // Si l'utilisateur est en cours de frappe, on pré-sélectionne le meilleur match trouvé
    if (isTyping) {
        input.value = autoMatch || 'divers';
    }
    let selectedKey = input.value || 'divers';

    // Anti-tremblement lors de la saisie (évite de réinjecter le HTML si les suggestions n'ont pas changé)
    const currentSugStr = suggestions.join(',');
    const hasChanged = container.dataset.lastSug !== currentSugStr;
    container.dataset.lastSug = currentSugStr;

    // Détermination de la valeur du 3ème bouton (si le tag sélectionné n'est pas dans les deux premiers)
    let thirdBtnKey = 'divers';
    if (!suggestions.includes(selectedKey)) {
        thirdBtnKey = selectedKey;
    }

    container.innerHTML = "";

    // Boutons de raccourcis magiques (gauche & milieu)
    suggestions.forEach(key => {
        container.appendChild(createCompactTagBtn(key, key === selectedKey, () => {
            input.value = key;
            renderCompactTags(containerId, inputId, titleVal);
            triggerHaptic(10);
        }, true, hasChanged));
    });

    // 3ème Bouton (Ouvre la modale complète avec icône flèche ▼)
    const thirdBtn = createCompactTagBtn(thirdBtnKey, thirdBtnKey === selectedKey, () => {
        openTagSelectionModal(inputId, containerId, titleVal, suggestions);
    }, false, false);
    thirdBtn.innerHTML += `<span class="ml-1 text-[8px] opacity-50">▼</span>`;
    container.appendChild(thirdBtn);
}

/**
 * Instancie l'élément bouton HTML stylisé d'un tag compact de raccourci.
 */
export function createCompactTagBtn(key, isActive, onClick, isMagic = false, shouldAnimate = false) {
    const tag = EXPENSE_TAGS[key] || EXPENSE_TAGS['divers'];
    const btn = document.createElement("button");
    btn.type = "button";
    
    let baseClass = "";
    if (isActive) {
        // Raccourci enfoncé actif
        baseClass = "w-full py-2 px-1 rounded-lg text-xs font-black bg-brand-500 text-white border-t border-brand-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)] select-none overflow-hidden flex items-center justify-center gap-1 scale-[0.98]";
    } else if (isMagic) {
        // Raccourci suggéré (bordures pointillées et effet de zoom dynamique)
        baseClass = "w-full py-2 px-1 rounded-lg text-[10px] font-bold border border-dashed border-brand-500/40 dark:border-brand-400/40 bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-850 text-stone-600 dark:text-stone-300 shadow-[0_2px_0_#cbd5e1] dark:shadow-[0_2px_0_#000000] select-none overflow-hidden flex items-center justify-center gap-1 active:scale-[0.97] transition-all";
        if (shouldAnimate) {
            baseClass += " animate-tag-pop";
        }
    } else {
        // Raccourci neutre (état de repos)
        baseClass = "w-full py-2 px-1 rounded-lg text-[10px] font-bold bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-850 text-stone-600 dark:text-stone-300 border-t border-white dark:border-stone-700/50 shadow-[0_2px_0_#cbd5e1] dark:shadow-[0_2px_0_#000000] select-none overflow-hidden flex items-center justify-center gap-1 active:scale-[0.97] transition-all";
    }

    btn.className = baseClass;
    btn.innerHTML = `<span class="text-xs shrink-0">${tag.icon}</span> <span class="truncate">${tag.label}</span>`;
    btn.onclick = onClick;
    return btn;
}

// -------------------------------------------------------------------------
// EXPOSITION DES FONCTIONS SUR WINDOW (COMPATIBILITÉ ÉVÉNEMENTS INLINE HTML)
// -------------------------------------------------------------------------

window.renderCompactTags = renderCompactTags;
window.toggleTagCategory = toggleTagCategory;
window.openTagSelectionModal = openTagSelectionModal;
window.closeTagSelectionModal = closeTagSelectionModal;
window.openTagManager = openTagManager;
window.closeTagManager = closeTagManager;
window.toggleTagCategory_mgr = toggleTagCategory_mgr;
window.toggleCategoryAllTags = toggleCategoryAllTags;
window.bulkSetAllSystemTags = bulkSetAllSystemTags;
window.toggleSingleTag = toggleSingleTag;
window.toggleTagManagerSelect = toggleTagManagerSelect;
window.enterTagManagerSelectMode = enterTagManagerSelectMode;
window.bulkSetTags = bulkSetTags;
window.openCreateTagModal = openCreateTagModal;
window.closeCreateTagModal = closeCreateTagModal;
window.selectTagEmoji = selectTagEmoji;
window.saveCustomTag = saveCustomTag;
window.deleteCustomTag = deleteCustomTag;
