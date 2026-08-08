# 🗺️ Atlas de Code — BUDGETHMR

Bienvenue dans l'Atlas de Code de **BUDGETHMR**. Ce document a été conçu pour vous aider à comprendre précisément comment s'organise l'application, quel est le rôle de chaque fichier, et où trouver les éléments clés du code (HTML, CSS, JavaScript).

---

## 📂 1. Structure Globale du Projet

L'application suit une architecture modulaire en cours de séparation. Voici la répartition des rôles :

```
src/
├── index.html                 # Interface utilisateur principale (Structure & Modales)
├── app.js                     # Point d'entrée principal (Logique globale, Initialisation, Tests)
├── manifest.json              # Fichier de configuration PWA (Installation mobile)
├── sw.js                      # Service Worker (Cache hors-ligne)
│
├── config/
│   └── tags.js                # Configuration statique des tags de dépenses (Dictionnaires et émojis)
│
├── store/
│   └── state.js               # Gestionnaire d'état applicatif centralisé (Sauvegarde & LocalStorage)
│
├── utils/
│   ├── stringUtils.js         # Utilitaires de chaînes (Nettoyage d'accents, formateurs de dates)
│   └── domUtils.js            # Utilitaires d'interface (Retour haptique, verrous de défilement)
│
├── services/
│   └── tagService.js          # Moteur algorithmique de suggestion et statistiques des tags
│
└── components/
    └── tagsUI.js              # Composants visuels pour la sélection et l'édition des tags
```

---

## 🏛️ 2. Carte de l'Interface UI (`index.html`)

Le fichier `index.html` regroupe toute la structure visuelle de l'application. Elle est découpée en blocs sémantiques clairs :

| Nom de la Zone | ID HTML principal | Rôle / Description |
| :--- | :--- | :--- |
| **Splash Screen** | `id="app_splash_screen"` | Écran de démarrage affichant le logo et effectuant les vérifications initiales. |
| **Top Header** | *(Balise `<header>`)* | Barre supérieure contenant le logo et le sélecteur de thème dynamique. |
| **Bannière Reste à Vivre** | `id="main_banner"` | Affiche le solde global restant et les revenus cumulés. |
| **Saisie Rapide** | `id="quick_expense_card"` | Formulaire principal pour enregistrer immédiatement une dépense. |
| **Enveloppes Dédiées** | `id="envelopes_section"` | Liste dynamique des budgets enveloppes (Courses, Cadeaux, etc.). |
| **Frais Fixes** | `id="fixed_charges_section"` | Liste et édition des prélèvements récurrents (Loyer, Abonnements). |
| **Historique Général** | `id="history_section"` | Journal complet de toutes les dépenses effectuées au cours du mois. |

### Modales Système (En bas de `index.html`)
*   `id="settings_modal"` : Panneau de configuration (Changement de prénom, seuils d'alerte, import/export).
*   `id="tag_manager_modal"` : Gestionnaire complet des tags (Activer/Désactiver des catégories).
*   `id="guide_modal"` : Guide interactif pour accompagner les nouveaux utilisateurs.
*   `id="certification_modal"` : Le banc de test intégré exécutant la suite de certification.

---

## 🧠 3. Carte de la Logique JavaScript (`app.js`)

Le fichier `app.js` orchestre la logique générale de l'application. Il contient environ 250 fonctions réparties dans les sections suivantes :

### A. Initialisation & Cycle de vie
*   `initUI()` : Démarre l'application, configure les écouteurs d'événements globaux et vérifie la transition de mois.
*   `hideSplashScreen()` : Masque l'écran de démarrage après s'être assuré que la base de données est chargée.
*   `checkMonthTransitionOnLaunch()` : Vérifie si le mois a changé depuis la dernière visite pour proposer le renouvellement de budget.

### B. Moteur Financier & Calculs
*   `calculateTotals()` : La fonction la plus critique de l'application. Elle recalcule en direct le solde bancaire réel, le reste à dépenser quotidien, et met à jour tous les badges visuels.
*   `getEffectiveChargeAmount(charge)` : Calcule le montant applicable d'un frais fixe en tenant compte de sa périodicité (hebdomadaire, bimensuelle, etc.).

### C. Paiements en Plusieurs Fois (Fractionnés)
*   `openInstallmentModal()` : Ouvre le configurateur de paiement fractionné.
*   `confirmInstallmentModal()` : Valide et répartit la dépense sur les prochains mois.
*   `updateInstallmentPreview()` : Affiche les mensualités estimées en temps réel pendant la saisie.

### D. Renouvellement Mensuel (Passage au mois suivant)
*   `selectRenewNextMonth()` : Démarre l'assistant de renouvellement.
*   `generateBudgetPDF()` : Crée un export PDF interactif et structuré du bilan mensuel (via la bibliothèque `html2pdf`).
*   `executeRenewal()` : Clôture le mois actif, archive le ticket de bilan, reporte les dépenses fractionnées en attente, et réinitialise les enveloppes.

### E. Système de Certification (Banc d'Essai)
Pour garantir la robustesse du code, `app.js` intègre sa propre suite de tests automatisés :
*   `runCertificationTests()` : Déclenche l'exécution séquentielle des tests.
*   `testBaseCalculations()` : Valide l'exactitude des calculs de base (addition, soustraction, restes).
*   `testInstallmentPayments()` : Vérifie la répartition et le report automatique des paiements fractionnés.

---

## 🔗 4. Le pont de compatibilité globale (`window`)

Comme `app.js` est chargé sous forme de module ES6 (`type="module"`), ses fonctions ne sont plus accessibles dans la portée globale par défaut. Pour éviter de casser les attributs événementiels inline du HTML (comme `onclick="openSettingsModal()"`), toutes les fonctions requises sont explicitement exposées sur l'objet global `window` en fin de fichier :

```javascript
// Exemple d'exposition en fin de app.js :
window.openSettingsModal = openSettingsModal;
window.calculateTotals = calculateTotals;
```

Cela garantit une compatibilité totale tout en profitant des avantages du strict mode et du découpage modulaire !
