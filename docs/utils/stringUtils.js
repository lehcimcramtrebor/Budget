// =========================================================================
// UTILITAIRES DE CHAÎNES DE CARACTÈRES ET DE DATES (stringUtils.js)
// Rôle : Fournir des fonctions pures pour formater le texte et les dates
// =========================================================================

/**
 * Met en majuscule la première lettre de chaque mot d'une chaîne.
 * Exemple : "courses auchan" -> "Courses Auchan"
 * 
 * @param {string} str - La chaîne de caractères à formater.
 * @returns {string} La chaîne formatée en TitleCase.
 */
export function toTitleCase(str) {
    if (!str) return "";
    return str.split(' ').map(word => {
        if (word.length === 0) return '';
        // Première lettre en majuscule, le reste en minuscule
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

/**
 * Supprime les accents d'une chaîne de caractères (normalisation Unicode).
 * Exemple : "café et hébergement" -> "cafe et hebergement"
 * 
 * @param {string} str - La chaîne avec de potentiels accents.
 * @returns {string} La chaîne sans accents.
 */
export function stripAccents(str) {
    if (!str) return "";
    // NFD sépare les caractères de base de leurs accents, puis la regex supprime les accents
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Formate une période YYYY-MM en libellé français complet.
 * Exemple : "2026-06" -> "Juin 2026"
 * 
 * @param {string} ym - Période au format "YYYY-MM" (ex: "2026-06").
 * @returns {string} Date en français avec majuscule initiale (ex: "Juin 2026").
 */
export function formatYearMonthFrench(ym) {
    if (!ym) return "";
    const [year, month] = ym.split("-");
    // Crée une date locale (le jour 1 du mois)
    const date = new Date(year, month - 1, 1);
    // Formate en français (ex: "juin 2026")
    const label = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    // Force la majuscule sur la première lettre du mois
    return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
 * Formate la date d'une dépense en fonction du mois budgétaire en cours.
 * - Si la dépense est du mois en cours : affiche "jour mois" (ex: "24 juin").
 * - Si la dépense est en dehors du mois : calcule et affiche l'écart en jours négatifs (ex: "-3" jours).
 * 
 * @param {string} dateStr - Date de la dépense au format "YYYY-MM-DD".
 * @param {string} budgetMonth - Mois actif du budget au format "YYYY-MM".
 * @returns {string} Date formatée ou écart relatif en jours.
 */
export function formatExpenseDate(dateStr, budgetMonth) {
    if (!dateStr) return "";
    
    // Vérification du format strict YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split("-").map(Number);
        const [bYear, bMonth] = budgetMonth.split("-").map(Number);
        
        // Cas 1 : La dépense appartient au mois budgétaire en cours
        if (year === bYear && month === bMonth) {
            const d = new Date(year, month - 1, day);
            return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
        } else {
            // Cas 2 : La dépense est hors période (décalée). On calcule l'écart relatif en jours
            const budgetFirstDay = new Date(bYear, bMonth - 1, 1);
            const expenseDate = new Date(year, month - 1, day);
            
            const utcBudget = Date.UTC(budgetFirstDay.getFullYear(), budgetFirstDay.getMonth(), budgetFirstDay.getDate());
            const utcExpense = Date.UTC(expenseDate.getFullYear(), expenseDate.getMonth(), expenseDate.getDate());
            
            const diffTime = utcExpense - utcBudget;
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            
            // Si la date est antérieure au mois en cours, on affiche la différence négative (ex: -2)
            if (diffDays < 0) {
                return `${diffDays}`;
            } else {
                // Par sécurité, si c'est dans le futur (non bloqué), on affiche la date simple
                return expenseDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
            }
        }
    }
    return dateStr;
}

/**
 * Retourne la date du jour au format ISO YYYY-MM-DD.
 * Exemple : "2026-06-26"
 * 
 * @returns {string} La date d'aujourd'hui.
 */
export function getTodayDateString() {
    const now = new Date();
    const y = now.getFullYear();
    // Ajoute un zéro initial pour les mois et jours inférieurs à 10
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}
