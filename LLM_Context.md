# Contexte de l'application - BUDGETHMR

Ce document sert de guide de reference pour tout assistant de programmation (LLM) ou developpeur intervenant sur le projet **BUDGETHMR**.

---

## 1. Presentation et Objectifs
**BUDGETHMR** (Reste a Vivre) est une application ultra-simple, rapide et gratuite de suivi de budget mensuel.
- **But** : Saisir rapidement ses depenses et ses remboursements, configurer ses revenus et ses frais fixes, et calculer en temps reel son "Reste a Vivre" mensuel.
- **Philosophie** : Donnes locales et privees. Pas de compte utilisateur distant. Les donnees sont sauvegardees uniquement dans le stockage local de l'appareil.

---

## 2. Stack Technique et Architectures Cibles
- **Frontend** : HTML5, Vanilla JavaScript, Tailwind CSS (moteur Play / Standalone injecte dynamiquement via `tailwind.config.js`).
- **Plateforme Web** : Hebergee sur GitHub Pages dans le dossier `/docs`.
- **Plateforme Mobile** : Encapsulation native Android via **Capacitor** (cible `/www` pour le package Web et dossier natif `/android`).
- **Plateforme Desktop** : Prevue pour le packaging via **Electron** (non configuree a ce jour, mais structurellement compatible).

---

## 3. Structure des Repertoires (Arborescence)
Le projet respecte l'organisation propre suivante :

```text
/
├── android/                 # Projet natif Android (Capacitor)
├── docs/                    # Build final Web (servi par GitHub Pages)
├── node_modules/            # Dependances npm locales (ignorees par Git)
├── src/                     # DOSSIER SOURCES (Fichiers de developpement)
│   ├── assets/              # Polices, CSS, Javascript additionnels, images
│   ├── app.js               # Logique de l'application
│   ├── BUDGET-HMR.APK       # APK source compile officiellement (a distribuer)
│   ├── google*.html         # Fichier SEO de validation Google Webmaster
│   ├── icon.svg             # Logo vectoriel source (512x512)
│   ├── index.html           # Structure HTML principale
│   ├── manifest.json        # Manifeste pour l'installation PWA
│   ├── robots.txt           # Fichier SEO de directives robots
│   ├── sitemap.xml          # Plan du site SEO
│   ├── sw.js                # Service Worker pour le cache hors-ligne
│   └── tailwind.config.js   # Configuration de style Tailwind CSS
├── www/                     # Build cible de synchronisation mobile (ignore)
├── .gitignore               # Regles d'exclusion Git
├── build-all.bat            # Script Batch global de compilation (PURE ASCII)
├── build.js                 # Script Node.js de compilation et deploiement local
├── generate-icons.js        # Script de generation des icones d'applications Android
├── package.json             # Declaration des dependances et commandes npm
└── LLM_Context.md           # Ce fichier de contexte
```

---

## 4. Workflows et Compilation
Toutes les compilations locales sont automatisees et doivent passer par les scripts de la racine :

- **Compilation Globale (Recommandee sous Windows)** :
  Double-cliquez sur `build-all.bat` ou lancez-le dans la console :
  ```cmd
  build-all.bat
  ```
  Ce script nettoie la racine, lance la compilation web, synchronise les plugins et les fichiers web de la plateforme mobile (`npx cap sync`), propose d'ouvrir Android Studio et gere le squelette d'Electron.

- **Compilation Web (Docs et WWW)** :
  ```bash
  npm run build
  ```
  Cette commande lance `node build.js`. Elle vide les repertoires `/docs` et `/www`, y copie tous les fichiers requis de `/src`, et y deploie l'APK `BUDGET-HMR.APK` dans `/docs` pour le telechargement en ligne.

- **Generation des Icones Android** :
  ```bash
  node generate-icons.js
  ```
  Redimensionne l'icone `src/icon.svg` pour generer toutes les densites de l'application Android dans `android/app/src/main/res/`. Elle configure l'icone adaptative avec une **marge de securite de 40%** (logo de 60% de la surface active) pour eviter les rognages de forme d'Android 8+ et regle la couleur de fond sur `#020617` dans `ic_launcher_background.xml`.

- **Ouverture d'Android Studio** :
  ```bash
  npx cap open android
  ```

---

## 5. Contraintes Techniques Specifiques au Projet

### A. Scripts Batch sous Windows (Pure ASCII)
Tous les fichiers de script d'invite de commande Windows (`.bat`, `.cmd`) doivent etre ecrit en **PURE ASCII** :
- **INTERDIT** : Tout caractere accentue (e, e, a, c, etc.). Ils font planter la console ou affichent des caracteres corrompus.
- **INTERDIT** : Le caractere esperluette (`&`). Il doit etre remplace par la conjonction `et` pour eviter que l'interpreteur CMD de Windows le considere comme un operateur de chainage de commandes et crash.

### B. WebView et Compatibilites Mobile (Android)
- **Fichier de style** : `src/tailwind.config.js` est indispensable au chargement dynamique de Tailwind Play. Il doit etre systematiquement deploie dans `/www` (et donc declare dans `build.js`).
- **Exportation JSON** : Sur Android WebView, le telechargement de Blob ou de Data URI HTML5 (`data:application/json...`) est bloque par le systeme. L'export de donnees doit utiliser les plugins Capacitor `@capacitor/filesystem` (pour ecrire le fichier temporairement dans le cache local) et `@capacitor/share` (pour l'ouvrir via le menu de partage natif d'Android).
- **Importation JSON** : L'element `<input type="file">` doit posseder l'attribut `accept="application/json, .json"` pour s'assurer que les fichiers ne soient pas grises dans l'explorateur d'Android. A la fin de la fonction d'importation dans `app.js`, la valeur de l'input doit etre forcee a vide (`event.target.value = ""`) pour permettre l'importation de fichiers ayant le meme nom a la suite.
- **Stockage permanent** : L'API `navigator.storage` etant restrictive ou non supportee dans le WebView mobile, l'application verifie si elle s'execute sous Capacitor (`window.Capacitor`) pour afficher directement le badge vert `🛡️ Application Native` et desactiver les demandes manuelles de persistance (Android isolant et securisant nativement le stockage local de l'application installee).
- **Verrouillage Portrait** : L'orientation de l'application est bloquee verticalement via l'attribut `android:screenOrientation="portrait"` dans le fichier `android/app/src/main/AndroidManifest.xml` sur l'activite `MainActivity`.
