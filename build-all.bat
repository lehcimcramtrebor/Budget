@echo off
echo ====================================================
echo BUDGETHMR - Compilateur de projet
echo ====================================================
echo.
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
