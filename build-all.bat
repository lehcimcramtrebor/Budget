@echo off
echo ====================================================
echo BUDGETHMR - Compilateur de projet
echo ====================================================
echo.

echo Etape 0 : Verification de l'environnement et des dependances
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Erreur : Node.js n'est pas installe ou n'est pas dans le PATH.
    echo Veuillez installer Node.js pour compiler ce projet.
    goto end
)

where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Erreur : npm n'est pas installe ou n'est pas dans le PATH.
    goto end
)

if not exist node_modules (
    echo Dossier node_modules introuvable.
    echo Installation des dependances npm en cours...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo.
        echo Erreur lors de l'installation des dependances npm !
        goto end
    )
    echo Dependances installees avec succes.
    echo.
) else (
    echo Dependances npm deja installees.
    echo.
)

echo Etape 1 : Compilation Web (generations www et docs)
call npm run build
if %ERRORLEVEL% neq 0 (
    echo.
    echo Erreur lors de la compilation Web !
    goto end
)
echo Compilation Web reussie.
echo.

echo Etape 2 : Synchronisation des fichiers Capacitor (Mobile)
call npx cap sync
if %ERRORLEVEL% neq 0 (
    echo.
    echo Erreur lors de la synchronisation Capacitor !
    goto end
)
echo Synchronisation Capacitor reussie.
echo.

echo Etape 3 : Compilation Desktop (Electron)
echo Notice : Aucune configuration Electron detectee pour ce projet.
echo (Vous pouvez configurer Electron et decommenter la commande ci-dessous)
echo Remarque : npx electron-builder build --dir (Placeholder)
echo.

echo Etape 4 : Choix de compilation Android (Android Studio)
echo Voulez-vous ouvrir Android Studio pour compiler l'APK ?
set /p choix="Entrez O pour Oui, ou N pour Non : "

if /i "%choix%"=="O" (
    echo Ouverture de Android Studio en cours...
    call npx cap open android
) else (
    echo Ouverture de Android Studio annulee.
)
echo.

:end
echo Processus termine.
pause
