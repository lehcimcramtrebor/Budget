// =========================================================================
// GESTIONNAIRE D'ÉTAT APPLICATIF GLOBAL ET PERSISTANCE (state.js)
// Rôle : Définir le modèle de données, sauvegarder/charger et migrer l'état
// =========================================================================

import { EXPENSE_TAGS, TAG_CATEGORIES } from '../config/tags.js';

/**
 * Modèle d'état initial de l'application (valeurs par défaut).
 * Cet objet contient toutes les données volatiles et persistantes du budget.
 */
export let state = {
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
    budgetMonth: "",      // Mois actif du budget courant (format YYYY-MM)
    isCertified: false,
    settings: {
        username: "",
        genderTheme: "masculin",
        warningThreshold: 150
    },
    ticketArchives: [],   // Liste des tickets de caisse scannés archivés
    customTags: [],       // Liste des tags personnalisés créés par l'utilisateur
    disabledTags: []      // Clés des tags système désactivés par l'utilisateur
};

// Variables d'état complémentaires non persistées ou variables de contrôle de l'application
export let hasUnsavedChanges = false;
export let lastRemaining = null;
export let isFirstLaunchAndInTolerance = false;

// -------------------------------------------------------------------------
// EXPOSITION DES VARIABLES SUR WINDOW (COMPATIBILITÉ MODE STRICT / ESM)
// -------------------------------------------------------------------------
// En mode ES Modules (strict), réassigner une variable importée directement (ex: state = ...) lève une erreur.
// L'utilisation de Object.defineProperty lie dynamiquement les lectures et écritures de variables sur l'objet 'window'
// pour conserver la compatibilité avec le reste de l'application et les tests de certification.

Object.defineProperty(window, 'state', {
    get() { return state; },
    set(val) { state = val; },
    configurable: true
});

Object.defineProperty(window, 'hasUnsavedChanges', {
    get() { return hasUnsavedChanges; },
    set(val) { hasUnsavedChanges = val; },
    configurable: true
});

Object.defineProperty(window, 'lastRemaining', {
    get() { return lastRemaining; },
    set(val) { lastRemaining = val; },
    configurable: true
});

Object.defineProperty(window, 'isFirstLaunchAndInTolerance', {
    get() { return isFirstLaunchAndInTolerance; },
    set(val) { isFirstLaunchAndInTolerance = val; },
    configurable: true
});

// -------------------------------------------------------------------------
// FONCTIONS DE PERSISTANCE ET DE GESTION DES DONNÉES
// -------------------------------------------------------------------------

/**
 * Sauvegarde l'état actuel de l'application dans le localStorage.
 * Déclenche la mise à jour visuelle du bouton de sauvegarde rapide.
 */
export function saveState() {
    localStorage.setItem("budget_hmr_simple", JSON.stringify(state));
    hasUnsavedChanges = true;
    // Appel du composant d'UI global si déjà chargé
    if (window.updateQuickSaveUI) {
        window.updateQuickSaveUI();
    }
}

/**
 * Fusionne les tags personnalisés de l'utilisateur (`state.customTags`)
 * dans les dictionnaires globaux de configuration (`EXPENSE_TAGS` et `TAG_CATEGORIES`).
 * Doit être appelé à chaque fois que la liste des tags perso change.
 */
export function mergeCustomTagsIntoExpenseTags() {
    // 1. Nettoyage des anciens tags perso précédemment fusionnés pour éviter les doublons
    Object.keys(EXPENSE_TAGS).forEach(k => { 
        if (k.startsWith('custom_')) delete EXPENSE_TAGS[k]; 
    });
    delete TAG_CATEGORIES['custom'];
    
    // 2. Si l'utilisateur possède des tags personnalisés, on les injecte
    if (state.customTags && state.customTags.length > 0) {
        TAG_CATEGORIES['custom'] = { 
            label: '⭐ Mes Tags Perso', 
            keys: state.customTags.map(t => t.key) 
        };
        state.customTags.forEach(t => { 
            EXPENSE_TAGS[t.key] = { icon: t.icon, label: t.label }; 
        });
    }
}

/**
 * Initialise les données au démarrage de l'application (Chargement & Migrations).
 * - Lit les données du localStorage.
 * - Applique des migrations automatiques (ex: dépôt d'espèces, format de dates, réglages).
 * - Initialise la période budgétaire si premier lancement.
 */
export function initDatabase() {
    const savedState = localStorage.getItem("budget_hmr_simple");
    if (savedState) {
        let migrationPerformed = false;
        try {
            const parsed = JSON.parse(savedState);
            
            // --- MIGRATION 1 : Auto-confirmation des dépôts d'espèces pour les budgets ouverts ---
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

            // --- MIGRATION 2 : Restauration des revenus et frais fixes ---
            if (Array.isArray(parsed.revenues)) {
                state.revenues = parsed.revenues;
            } else if (typeof parsed.baseBudget === 'number') {
                state.revenues = [{ id: "r1", title: "Revenu Principal", amount: parsed.baseBudget }];
            }
            if (Array.isArray(parsed.fixedCharges)) {
                state.fixedCharges = parsed.fixedCharges.map(c => {
                    if (!c.periodicity) c.periodicity = { type: 'monthly' };
                    return c;
                });
                migrationPerformed = true;
            }

            // --- MIGRATION 3 : Normalisation des formats de dates des dépenses (français -> ISO) ---
            if (Array.isArray(parsed.expenses)) {
                const MOIS_NORM = {
                    'janvier':'01','février':'02','fevrier':'02','mars':'03','avril':'04','mai':'05','juin':'06',
                    'juillet':'07','août':'08','aout':'08','septembre':'09','octobre':'10','novembre':'11','décembre':'12','decembre':'12'
                };
                const [budgYear] = (parsed.budgetMonth || state.budgetMonth).split('-');
                parsed.expenses = parsed.expenses.map(e => {
                    if (e.date && !/^\d{4}-\d{2}-\d{2}$/.test(e.date)) {
                        const frMatch = e.date.toLowerCase().trim().match(/^(\d{1,2})\s+([a-zéûôèàâùîœ]+)/);
                        if (frMatch) {
                            const mo = MOIS_NORM[frMatch[2]];
                            if (mo) {
                                e.date = `${budgYear}-${mo}-${frMatch[1].padStart(2,'0')}`;
                                migrationPerformed = true;
                            }
                        }
                    }
                    return e;
                });
                state.expenses = parsed.expenses;
            }

            // --- MIGRATION 4 : Restauration du thème sombre ---
            if (typeof parsed.darkMode === 'boolean') state.darkMode = parsed.darkMode;
            
            // --- MIGRATION 5 : Restauration du mois budgétaire ---
            if (parsed.budgetMonth) {
                state.budgetMonth = parsed.budgetMonth;
            } else {
                const now = new Date();
                state.budgetMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            }

            // --- MIGRATION 6 : Restauration de la liste des enveloppes ---
            if (Array.isArray(parsed.budgets)) {
                state.budgets = parsed.budgets;
            } else {
                state.budgets = [];
            }

            // --- MIGRATION 7 : Restauration du statut de certification de l'application ---
            if (typeof parsed.isCertified === 'boolean') {
                state.isCertified = parsed.isCertified;
            } else {
                state.isCertified = false;
            }

            // --- MIGRATION 8 : Restauration des réglages utilisateur ---
            if (parsed.settings) {
                state.settings = { ...state.settings, ...parsed.settings };
            }
            if (!state.settings.genderTheme) {
                state.settings.genderTheme = "masculin";
            }
            if (typeof state.settings.warningThreshold !== 'number') {
                state.settings.warningThreshold = 150;
            }

            // --- MIGRATION 10 : Restauration des tags configurés ---
            if (Array.isArray(parsed.customTags)) state.customTags = parsed.customTags;
            if (Array.isArray(parsed.disabledTags)) state.disabledTags = parsed.disabledTags;

            // Si des migrations ont modifié la structure, on force une sauvegarde immédiate
            if (migrationPerformed) {
                saveState();
            }
        } catch (e) {
            console.error("Erreur lors de la lecture du localStorage", e);
        }
    } else {
        // Premier lancement absolu de l'application (création d'un profil vierge)
        const now = new Date();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const thresholdDay = daysInMonth - 10;
        
        state.budgetMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        state.budgets = [];
        state.isCertified = false;
        
        // Si l'utilisateur lance l'app les 10 derniers jours du mois, on lui tolère un démarrage anticipé
        if (now.getDate() >= thresholdDay) {
            isFirstLaunchAndInTolerance = true;
        }
        saveState();
    }
    // Fusion des tags personnalisés
    mergeCustomTagsIntoExpenseTags();
}
