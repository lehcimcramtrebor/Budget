// =========================================================================
// SERVICES ET LOGIQUE MÉTIER DE CALCUL DES TAGS (tagService.js)
// Rôle : Analyser l'historique et recommander des tags
// =========================================================================

import { state } from '../store/state.js';

/**
 * Calcule et retourne la liste des tags les plus fréquemment utilisés dans l'historique.
 * Utilisé pour afficher les "Favoris" dans la grille de sélection.
 * Si l'historique est trop faible, complète la liste avec les tags par défaut de secours.
 * 
 * @param {number} limit - Le nombre maximal de tags à retourner (par défaut 12).
 * @returns {Array<string>} La liste ordonnée des clés de tags favoris.
 */
export function getTopUsedTags(limit = 12) {
    const counts = {};
    const allOps = [...state.expenses];
    
    // Agglomère toutes les dépenses des enveloppes budgétaires fermées ou archivées
    state.budgets.forEach(b => {
        if (b.expenses) allOps.push(...b.expenses);
        if (b.archivedExpenses) allOps.push(...b.archivedExpenses);
    });

    // Compte le nombre d'occurrences de chaque tag utilisé
    allOps.forEach(op => {
        if (op.tag) counts[op.tag] = (counts[op.tag] || 0) + 1;
    });

    // Ajoute l'historique des mois précédents
    if (state.historicalOps) {
        state.historicalOps.forEach(op => {
            if (op.g) counts[op.g] = (counts[op.g] || 0) + 1;
        });
    }

    // Trie par fréquence d'utilisation décroissante
    let sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    
    // Liste de tags par défaut si l'historique utilisateur est faible ou vierge
    const defaultTop = ['courses', 'resto', 'loisirs', 'vape', 'numerique', 'carburant', 'entretien_auto', 'entretien_moto', 'brico_jardin', 'enfants', 'generaliste', 'pharmacie', 'vetements', 'animaux', 'cadeaux', 'divers'];
    
    // Injecte les valeurs par défaut manquantes en fin de liste
    defaultTop.forEach(tag => {
        if (!sorted.includes(tag)) sorted.push(tag);
    });

    return sorted.slice(0, limit);
}

/**
 * Algorithme de suggestion de tags en temps réel basé sur la saisie textuelle.
 * - Nettoie le titre recherché.
 * - Cherche des correspondances dans le titre des dépenses passées (historique).
 * - Calcule les tags les plus probables.
 * - Retourne les deux meilleures suggestions et un auto-match si la pertinence est forte.
 * 
 * @param {string} titleVal - Le titre du frais en cours de saisie par l'utilisateur.
 * @returns {Object} Un objet contenant :
 *                  - tags {Array<string>} : Les deux suggestions de clés de tags.
 *                  - autoMatch {string|null} : La clé du meilleur match si trouvé.
 */
export function getSuggestedTags(titleVal) {
    const counts = {};
    
    // Helper local pour normaliser le texte (minuscules, sans accents)
    const normalizeStr = str => (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
    const titleLower = normalizeStr(titleVal).trim();

    // 1. Récupération de l'historique complet de toutes les opérations
    const allOps = [...state.expenses];
    state.budgets.forEach(b => {
        if (b.expenses) allOps.push(...b.expenses);
        if (b.archivedExpenses) allOps.push(...b.archivedExpenses);
    });

    let searchableOps = allOps.map(op => ({ t: op.title, g: op.tag }));
    if (state.historicalOps) {
        searchableOps.push(...state.historicalOps);
    }

    let matchedOps = [];
    if (titleLower.length >= 2) {
        // Découpe la saisie de l'utilisateur en mots (ignorant les mots courts de moins de 3 lettres)
        const searchWords = titleLower.split(/\s+/).filter(w => w.length >= 3);
        
        // Si la saisie est très courte (ex: "Mc"), on la prend brute
        if (searchWords.length === 0 && titleLower.length > 0) {
            searchWords.push(titleLower);
        }

        // Filtre l'historique pour trouver des correspondances de titres
        matchedOps = searchableOps.filter(op => {
            if (!op.t) return false;
            const opTitleLower = normalizeStr(op.t);
            
            // Critère A : Le titre tapé est inclus dans le titre historique (ex: tapé="Boul", historique="Boulangerie")
            if (opTitleLower.includes(titleLower)) return true;
            
            // Critère B : Le titre historique est inclus dans le titre tapé (ex: tapé="Courses Auchan", historique="Auchan")
            if (titleLower.includes(opTitleLower)) return true;
            
            // Critère C : L'un des mots de recherche correspond au titre historique
            return searchWords.some(word => opTitleLower.includes(word));
        });
    }

    // Incrémente le poids des tags trouvés dans les correspondances historiques
    if (matchedOps.length > 0) {
        matchedOps.forEach(op => {
            if (op.g && op.g !== 'divers') counts[op.g] = (counts[op.g] || 0) + 1;
        });
    }

    // Liste des tags désactivés par l'utilisateur à exclure
    const disabledSet = new Set(state.disabledTags || []);
    
    // Trie les tags matchés par pertinence de fréquence
    let sortedTags = Object.keys(counts).filter(k => !disabledSet.has(k)).sort((a, b) => counts[b] - counts[a]);

    // La clé de tag avec le score le plus élevé devient le match automatique
    const autoMatch = sortedTags.length > 0 ? sortedTags[0] : null;

    // 2. Si on a moins de 2 suggestions, on complète avec les tags les plus utilisés globalement
    if (sortedTags.length < 2) {
        const globalCounts = {};
        allOps.forEach(op => {
            if (op.tag && op.tag !== 'divers') globalCounts[op.tag] = (globalCounts[op.tag] || 0) + 1;
        });
        const globalSorted = Object.keys(globalCounts).filter(k => !disabledSet.has(k)).sort((a, b) => globalCounts[b] - globalCounts[a]);
        globalSorted.forEach(tag => {
            if (!sortedTags.includes(tag) && sortedTags.length < 2) sortedTags.push(tag);
        });
    }

    // 3. Si on a toujours moins de 2 suggestions, on complète avec des valeurs par défaut fixes
    const fallbacks = ['courses', 'carburant', 'resto', 'loisirs'];
    fallbacks.forEach(tag => {
        if (!disabledSet.has(tag) && !sortedTags.includes(tag) && sortedTags.length < 2) sortedTags.push(tag);
    });

    return { tags: sortedTags.slice(0, 2), autoMatch };
}
