// =========================================================================
// 🧠 POINT D'ENTRÉE PRINCIPAL DE L'APPLICATION (app.js)
// Rôle : Gestion globale des dépenses, enveloppes, frais fixes et persistance.
// =========================================================================

// --- IMPORTS DES MODULES ---
import { TAG_DATA, EXPENSE_TAGS, TAG_CATEGORIES, TAG_EMOJI_PICKER } from './config/tags.js';
import { toTitleCase, stripAccents, formatYearMonthFrench, formatExpenseDate, getTodayDateString } from './utils/stringUtils.js';
import { triggerHaptic, isClickableElement, setupHapticFeedback, initModalScrollLock, initScrollOnFocus } from './utils/domUtils.js';
import { state, hasUnsavedChanges, lastRemaining, isFirstLaunchAndInTolerance, saveState, initDatabase, mergeCustomTagsIntoExpenseTags } from './store/state.js';
import { getTopUsedTags, getSuggestedTags } from './services/tagService.js';
import {
    renderCompactTags,
    createCompactTagBtn,
    toggleTagCategory,
    openTagSelectionModal,
    closeTagSelectionModal,
    openTagManager,
    closeTagManager,
    renderTagManager,
    toggleTagCategory_mgr,
    toggleCategoryAllTags,
    bulkSetAllSystemTags,
    toggleSingleTag,
    toggleTagManagerSelect,
    enterTagManagerSelectMode,
    bulkSetTags,
    openCreateTagModal,
    closeCreateTagModal,
    selectTagEmoji,
    saveCustomTag,
    deleteCustomTag
} from './components/tagsUI.js';

// =========================================================================
// 🛠️ SYSTEME DE CAPTURE D'ERREURS (BOÎTE NOIRE)
// =========================================================================
window.debugErrors = [];

window.onerror = function (message, source, lineno, colno, error) {
    const file = source ? source.split('/').pop() : 'inconnu';
    const errStr = `${message} (à ${file}:${lineno})`;
    if (!window.debugErrors.includes(errStr)) {
        window.debugErrors.push(errStr);
        if (window.debugErrors.length > 5) window.debugErrors.shift(); // Garde les 5 dernières
    }
    return false; // Permet à l'erreur de se propager normalement
};

window.onunhandledrejection = function (event) {
    const errStr = `Rejet de promesse non géré : ${event.reason}`;
    if (!window.debugErrors.includes(errStr)) {
        window.debugErrors.push(errStr);
        if (window.debugErrors.length > 5) window.debugErrors.shift();
    }
};

// --- CALCUL DES TAGS LES PLUS UTILISÉS (POUR LA SECTION DYNAMIQUE) ---


// --- NOUVEAU SYSTEME DE TAGS COMPACTS ---






// Variables de session pour la modale
 // NOUVEAU : Pour recharger la modale dynamiquement







// ============================================================
// GESTIONNAIRE DE TAGS — Custom + Activation/Désactivation
// ============================================================
let selectedRenewalMonth = null;
let renewalSecurityCode = "";
let willCarryOver = false;
let carryOverAmount = 0;
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
    hideSplashScreen();
    // Initialiser le sélecteur de périodicité pour le formulaire de nouveau frais fixe
    resetChargePeriodicityUI();
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



// ============================================================
// --- PAIEMENTS EN PLUSIEURS FOIS — UTILITAIRES UI ---
// ============================================================

const INSTALLMENT_OPTIONS = [2, 3, 4, 6, 10, 12];
let installmentAmounts = []; // montants par échéance, modifiables individuellement

function generateInstallmentGroupId() {
    return 'inst_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
}

function openInstallmentModal() {
    // Vérifier qu'un montant a été saisi
    const amountInput = document.getElementById('exp_amount');
    const amount = parseFloat((amountInput?.value || '0').replace(',', '.'));
    if (!amount || amount <= 0) {
        if (amountInput) {
            amountInput.focus();
            amountInput.classList.add('ring-2', 'ring-red-400');
            const form = document.getElementById('expense_form');
            if (form) {
                form.classList.add('animate-shake');
                setTimeout(() => form.classList.remove('animate-shake'), 400);
            }
            setTimeout(() => amountInput.classList.remove('ring-2', 'ring-red-400'), 1500);
        }
        return;
    }
    // Sauvegarder les valeurs actuelles pour pouvoir annuler
    const modal = document.getElementById('installment_config_modal');
    if (!modal) return;
    // Rendre les boutons dans la modale
    renderInstallmentButtons();
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.glass-card').classList.remove('translate-y-4');
    }, 10);
    triggerHaptic(5);
}

function closeInstallmentModal() {
    const modal = document.getElementById('installment_config_modal');
    if (!modal) return;
    modal.classList.add('opacity-0');
    modal.querySelector('.glass-card').classList.add('translate-y-4');
    setTimeout(() => modal.classList.add('hidden'), 280);
}

function cancelInstallmentModal() {
    // Remet à 1/1 et ferme
    document.getElementById('exp_installment_total').value   = '1';
    document.getElementById('exp_installment_current').value = '1';
    installmentAmounts = [];
    updateInstallmentTriggerLabel();
    closeInstallmentModal();
}

function confirmCancelInstallment() {
    const total   = parseInt(document.getElementById('exp_installment_total').value) || 1;
    const current = parseInt(document.getElementById('exp_installment_current').value) || 1;
    showGenericConfirm(
        'Annuler le paiement fractionné ?',
        `Le paiement en <strong>×${total}</strong> (échéance N°${current}) sera supprimé et vous reviendrez à un paiement simple.`,
        '🔢',
        () => { resetInstallmentUI(); triggerHaptic(10); }
    );
}

function confirmInstallmentModal() {
    // Vérifier que les montants sont cohérents
    const total = parseInt(document.getElementById('exp_installment_total').value) || 1;
    if (total > 1 && installmentAmounts.length === total) {
        // Vérifier qu'aucun montant n'est zéro
        const hasZero = installmentAmounts.some(a => a <= 0);
        if (hasZero) {
            showGenericAlert('Montants invalides', 'Chaque échéance doit avoir un montant supérieur à 0.');
            return;
        }
    }
    updateInstallmentTriggerLabel();
    closeInstallmentModal();
    triggerHaptic('confirm');
}

function updateInstallmentTriggerLabel() {
    const total   = parseInt(document.getElementById('exp_installment_total').value)   || 1;
    const current = parseInt(document.getElementById('exp_installment_current').value) || 1;
    const label   = document.getElementById('installment_trigger_label');
    const badge   = document.getElementById('installment_active_badge');

    if (total > 1) {
        if (label) label.textContent = `×${total}`;
        if (badge) {
            badge.textContent = `${current}/${total}`;
            badge.classList.add('visible');
            badge.classList.remove('hidden');
        }
        // Colorer le bouton trigger
        const btn = document.getElementById('installment_trigger_btn');
        if (btn) {
            btn.classList.add('text-violet-500', 'dark:text-violet-400');
            btn.classList.remove('text-stone-500', 'dark:text-stone-400');
        }
    } else {
        if (label) label.textContent = '×1';
        if (badge) {
            badge.classList.remove('visible');
            badge.classList.add('hidden');
        }
        const btn = document.getElementById('installment_trigger_btn');
        if (btn) {
            btn.classList.remove('text-violet-500', 'dark:text-violet-400');
            btn.classList.add('text-stone-500', 'dark:text-stone-400');
        }
    }
    updateInstallmentIncompatibleButtons(total);
}

function updateInstallmentIncompatibleButtons(total) {
    const isActive = (total || parseInt(document.getElementById('exp_installment_total')?.value) || 1) > 1;
    const btnRefund   = document.getElementById('btn_refund');
    const btnEnvelope = document.getElementById('tour_new_envelope');
    const btnCancel   = document.getElementById('installment_cancel_btn');
    const amountInput = document.getElementById('exp_amount');
    const tip = isActive ? 'Non disponible avec un paiement fractionné' : '';

    [btnRefund, btnEnvelope].forEach(btn => {
        if (!btn) return;
        if (isActive) {
            btn.disabled = true;
            btn.title = tip;
            btn.classList.add('opacity-40', 'cursor-not-allowed', 'pointer-events-none');
            btn.classList.remove('active:translate-y-[3px]', 'active:shadow-none');
        } else {
            btn.disabled = false;
            btn.title = '';
            btn.classList.remove('opacity-40', 'cursor-not-allowed', 'pointer-events-none');
            btn.classList.add('active:translate-y-[3px]', 'active:shadow-none');
        }
    });

    // Verrouillage du champ montant
    if (amountInput) {
        if (isActive) {
            amountInput.readOnly = true;
            amountInput.classList.add('opacity-60', 'cursor-not-allowed', 'bg-violet-50/50', 'dark:bg-violet-950/20', 'border-violet-300/50', 'dark:border-violet-800/40');
        } else {
            amountInput.readOnly = false;
            amountInput.classList.remove('opacity-60', 'cursor-not-allowed', 'bg-violet-50/50', 'dark:bg-violet-950/20', 'border-violet-300/50', 'dark:border-violet-800/40');

        }
    }

    // Bouton d'annulation rapide
    if (btnCancel) {
        if (isActive) {
            btnCancel.classList.remove('hidden');
            btnCancel.classList.add('flex');
        } else {
            btnCancel.classList.add('hidden');
            btnCancel.classList.remove('flex');
        }
    }
}

function onAmountClickWhenLocked(event) {
    const amountInput = document.getElementById('exp_amount');
    if (!amountInput?.readOnly) return;
    
    event.preventDefault();
    amountInput.blur();
    
    // Ouvre la modale
    const modal = document.getElementById('locked_amount_modal');
    if (modal) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.querySelector('.glass-card').classList.remove('scale-95');
        }, 10);
        triggerHaptic(10);
    }
}

function closeLockedAmountModal() {
    const modal = document.getElementById('locked_amount_modal');
    if (!modal) return;
    
    modal.classList.add('opacity-0');
    modal.querySelector('.glass-card').classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

function renderInstallmentButtons() {
    const totalSelected   = parseInt(document.getElementById('exp_installment_total').value) || 1;
    const currentSelected = parseInt(document.getElementById('exp_installment_current').value) || 1;

    // Boutons nombre total d'échéances
    const totalContainer = document.getElementById('installment_total_btns');
    if (totalContainer) {
        totalContainer.innerHTML = INSTALLMENT_OPTIONS.map(n => {
            const active = n === totalSelected;
            return `<button type="button" onclick="selectInstallmentTotal(${n})"
                class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border select-none
                ${active
                    ? 'bg-violet-500 text-white border-violet-600 shadow-[0_2px_0_#6d28d9]'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-violet-400 hover:text-violet-500'
                }">×${n}</button>`;
        }).join('');
    }

    // Boutons échéance de départ (1 à total-1)
    const currentSection   = document.getElementById('installment_current_section');
    const currentContainer = document.getElementById('installment_current_btns');
    if (totalSelected > 1 && currentSection && currentContainer) {
        currentSection.classList.remove('hidden');
        const opts = Array.from({ length: totalSelected - 1 }, (_, i) => i + 1);
        currentContainer.innerHTML = opts.map(n => {
            const active = n === currentSelected;
            return `<button type="button" onclick="selectInstallmentCurrent(${n})"
                class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border select-none
                ${active
                    ? 'bg-violet-500 text-white border-violet-600 shadow-[0_2px_0_#6d28d9]'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-violet-400 hover:text-violet-500'
                }">N°${n}</button>`;
        }).join('');
    } else if (currentSection) {
        currentSection.classList.add('hidden');
    }

    updateInstallmentPreview();
    renderInstallmentAmountRows();
}

function selectInstallmentTotal(n) {
    document.getElementById('exp_installment_total').value = n;
    // Si l'échéance courante dépasse total-1, la ramener à 1
    const cur = parseInt(document.getElementById('exp_installment_current').value) || 1;
    if (cur >= n) document.getElementById('exp_installment_current').value = 1;
    // Initialiser les montants égaux
    const amountRaw = parseFloat((document.getElementById('exp_amount').value || '0').replace(',', '.')) || 0;
    const mensualite = Math.round((amountRaw / n) * 100) / 100;
    installmentAmounts = Array.from({ length: n }, () => mensualite);
    // Ajustement du dernier pour absorber les arrondis
    const diff = Math.round((amountRaw - mensualite * n) * 100) / 100;
    if (diff !== 0) installmentAmounts[n - 1] = Math.round((installmentAmounts[n - 1] + diff) * 100) / 100;
    renderInstallmentButtons();
}

function selectInstallmentCurrent(n) {
    document.getElementById('exp_installment_current').value = n;
    renderInstallmentButtons();
}

function renderInstallmentAmountRows() {
    const container = document.getElementById('installment_amounts_container');
    if (!container) return;
    const total = installmentAmounts.length;
    if (total < 2) { container.innerHTML = ''; return; }
    const currentSel = parseInt(document.getElementById('exp_installment_current').value) || 1;

    container.innerHTML = `
        <span class="block text-[9px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-2 select-none">Montants par échéance</span>
        <div class="space-y-1.5">
            ${installmentAmounts.map((amt, i) => `
                <div class="flex items-center gap-2">
                    <span class="text-[9px] font-black uppercase tracking-wider w-14 shrink-0 ${
                        i + 1 === currentSel
                            ? 'text-violet-500 dark:text-violet-400'
                            : 'text-stone-400 dark:text-stone-500'
                    }">N°${i + 1}${ i + 1 === currentSel ? ' ◄' : '' }</span>
                    <div class="relative flex-1">
                        <input type="text" inputmode="decimal"
                            id="inst_amt_${i}"
                            value="${String(amt.toFixed(2)).replace('.', ',')}"
                            oninput="onInstallmentAmountChange(${i}, this.value)"
                            onblur="onInstallmentAmountBlur(${i}, this.value)"
                            class="form-input h-8 text-right pr-5 text-[11px] font-mono font-black px-2 w-full
                                   ${ i + 1 === currentSel
                                       ? 'border-violet-400 dark:border-violet-600 ring-1 ring-violet-400/30'
                                       : '' }">
                        <span class="absolute right-1.5 top-1/2 -translate-y-1/2 font-black text-stone-400 pointer-events-none text-[10px]">€</span>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="flex justify-between items-center pt-2 border-t border-stone-100 dark:border-stone-800 mt-1">
            <span class="text-[9px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-wider">Total</span>
            <span id="installment_amounts_total" class="text-[11px] font-mono font-black text-violet-500 dark:text-violet-400">
                ${String(installmentAmounts.reduce((s,a) => s+a, 0).toFixed(2)).replace('.', ',')} €
            </span>
        </div>
    `;
}

function onInstallmentAmountChange(index, rawVal) {
    const val = parseFloat(rawVal.replace(',', '.')) || 0;
    const total = installmentAmounts.length;
    if (total < 2) return;

    if (index === 0) {
        // Échéance 1 : recalculer les suivantes à égalité sur ce qui reste
        const amountRaw = parseFloat((document.getElementById('exp_amount').value || '0').replace(',', '.')) || 0;
        const remaining = Math.max(0, amountRaw - val);
        const perOther = Math.round((remaining / (total - 1)) * 100) / 100;
        installmentAmounts[0] = val;
        for (let i = 1; i < total; i++) installmentAmounts[i] = perOther;
        // Ajustement arrondi sur le dernier
        const diff = Math.round((remaining - perOther * (total - 1)) * 100) / 100;
        if (diff !== 0 && total > 1) installmentAmounts[total - 1] = Math.round((installmentAmounts[total - 1] + diff) * 100) / 100;
        // Mettre à jour les autres champs
        for (let i = 1; i < total; i++) {
            const inp = document.getElementById(`inst_amt_${i}`);
            if (inp) inp.value = String(installmentAmounts[i].toFixed(2)).replace('.', ',');
        }
    } else {
        // Autre échéance : pas de recalcul automatique
        installmentAmounts[index] = val;
    }
    // Mettre à jour le total affiché
    const totalSpan = document.getElementById('installment_amounts_total');
    if (totalSpan) {
        const sum = installmentAmounts.reduce((s, a) => s + a, 0);
        totalSpan.textContent = String(sum.toFixed(2)).replace('.', ',') + ' €';
    }
    updateInstallmentPreview();
}

function onInstallmentAmountBlur(index, rawVal) {
    // Normaliser l'affichage à la perte de focus
    const val = parseFloat(rawVal.replace(',', '.')) || 0;
    installmentAmounts[index] = Math.round(val * 100) / 100;
    const inp = document.getElementById(`inst_amt_${index}`);
    if (inp) inp.value = String(installmentAmounts[index].toFixed(2)).replace('.', ',');
    onInstallmentAmountChange(index, String(installmentAmounts[index]));
}

function updateInstallmentPreview() {
    const preview   = document.getElementById('installment_preview');
    const total     = parseInt(document.getElementById('exp_installment_total').value) || 1;
    const current   = parseInt(document.getElementById('exp_installment_current').value) || 1;
    const amountRaw = parseFloat((document.getElementById('exp_amount').value || '0').replace(',', '.')) || 0;
    const badge     = document.getElementById('installment_active_badge');

    if (!preview) return;

    if (total > 1) {
        let mensualite = (amountRaw / total);
        if (installmentAmounts && installmentAmounts.length === total) {
            mensualite = installmentAmounts[current - 1];
        }
        const mensualiteStr = mensualite.toFixed(2).replace('.', ',');
        const remaining = total - current + 1;
        preview.textContent = `Éch. ${current}/${total} — ${mensualiteStr} € / mois · ${remaining} paiement${remaining > 1 ? 's' : ''} restant${remaining > 1 ? 's' : ''}`;
        preview.classList.remove('hidden');
        if (badge) {
            badge.textContent = `${current}/${total}`;
            badge.classList.add('visible');
            badge.classList.remove('hidden');
        }
    } else {
        preview.classList.add('hidden');
        if (badge) badge.classList.add('hidden');
    }
}

function resetInstallmentUI() {
    document.getElementById('exp_installment_total').value   = '1';
    document.getElementById('exp_installment_current').value = '1';
    installmentAmounts = [];
    updateInstallmentTriggerLabel();
    updateInstallmentIncompatibleButtons(1);
    const preview = document.getElementById('installment_preview');
    if (preview) preview.classList.add('hidden');
    const curSection = document.getElementById('installment_current_section');
    if (curSection) curSection.classList.add('hidden');
    const totalContainer = document.getElementById('installment_total_btns');
    if (totalContainer) totalContainer.innerHTML = '';
    const amountsContainer = document.getElementById('installment_amounts_container');
    if (amountsContainer) amountsContainer.innerHTML = '';
}

// Synchroniser l'aperçu quand le montant change
document.addEventListener('DOMContentLoaded', () => {
    const amtInput = document.getElementById('exp_amount');
    if (amtInput) {
        amtInput.addEventListener('input', () => {
            const total = parseInt(document.getElementById('exp_installment_total').value) || 1;
            if (total > 1) {
                // Recalculer les mensualités à égalité sur le nouveau montant
                const amountRaw = parseFloat((amtInput.value || '0').replace(',', '.')) || 0;
                const mensualite = Math.round((amountRaw / total) * 100) / 100;
                installmentAmounts = Array.from({ length: total }, () => mensualite);
                const diff = Math.round((amountRaw - mensualite * total) * 100) / 100;
                if (diff !== 0) installmentAmounts[total - 1] = Math.round((installmentAmounts[total - 1] + diff) * 100) / 100;
            }
            updateInstallmentPreview();
        });
    }

    // Sélectionner automatiquement tout le texte lors de la mise au point d'un champ de montant
    document.addEventListener('focusin', (e) => {
        if (e.target && e.target.tagName === 'INPUT') {
            const id = e.target.id || '';
            const inputmode = e.target.getAttribute('inputmode') || '';
            const type = e.target.type || 'text';
            
            const isAmountInput = inputmode === 'decimal' || 
                                  inputmode === 'numeric' ||
                                  id.includes('amount') ||
                                  id.includes('amt') ||
                                  id.includes('budget') ||
                                  id.includes('threshold') ||
                                  id.includes('target');
                                  
            const skipTypes = ['checkbox', 'radio', 'file', 'range', 'hidden', 'submit', 'button'];
            
            if (isAmountInput && !skipTypes.includes(type)) {
                setTimeout(() => {
                    try {
                        e.target.select();
                        e.target.setSelectionRange(0, 99999);
                    } catch (err) {
                        // Certains types d'inputs ne supportent pas setSelectionRange
                    }
                }, 85); // Délai optimal pour contrer le comportement natif sur mobile/tactile
            }
        }
    });
});

// ============================================================

function initUI() {
    // Déclencheur secret du Panel de Diagnostic (Easter Egg : 10 clics en 5 secondes)
    const logo = document.getElementById("app_logo");
    if (logo) {
        let logoClicks = [];
        logo.addEventListener("click", () => {
            const now = Date.now();
            logoClicks.push(now);
            logoClicks = logoClicks.filter(t => now - t < 5000);
            if (logoClicks.length >= 10) {
                logoClicks = [];
                triggerHaptic('success');
                openDebugModal();
            }
        });
    }

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
        expTitle.addEventListener("input", (e) => renderCompactTags("tag_selector_container", "exp_tag", e.target.value, true));
    }

    const editTitle = document.getElementById("edit_title");
    if (editTitle) {
        editTitle.addEventListener("input", (e) => renderCompactTags("edit_tag_selector_container", "edit_exp_tag", e.target.value, true));
    }
	
    // Display current date month based on budgetMonth
    const currentMonthLabel = formatYearMonthFrench(state.budgetMonth);
    document.getElementById("current_date_label").innerText = currentMonthLabel;

    updateQuickSaveUI();
    initModalScrollLock(); // Bind background scroll locking

    updateUI();
    
    // Default tabs styling
    switchDashboardTab('main', true);
}



// --- PERIODICITY HELPERS ---

/**
 * Compte combien de fois un jour de la semaine apparaît dans un mois donné.
 * dayOfWeek : 0=Dim, 1=Lun, 2=Mar, 3=Mer, 4=Jeu, 5=Ven, 6=Sam
 * month : 0-indexed (getMonth())
 */
function countDayOccurrences(dayOfWeek, year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let count = 0;
    for (let d = 1; d <= daysInMonth; d++) {
        if (new Date(year, month, d).getDay() === dayOfWeek) count++;
    }
    return count;
}

/**
 * Retourne le montant effectif d'un frais fixe pour le mois courant du budget.
 * Tout est débité immédiatement — aucune simulation de date.
 */
function getEffectiveChargeAmount(charge) {
    const [year, monthNum] = state.budgetMonth.split('-').map(Number);
    const month = monthNum - 1; // 0-indexed
    const p = charge.periodicity || { type: 'monthly' };

    if (p.type === 'specific_months') {
        return Array.isArray(p.months) && p.months.includes(month) ? charge.amount : 0;
    }
    if (p.type === 'weekly') {
        const count = countDayOccurrences(p.dayOfWeek, year, month);
        return charge.amount * count;
    }
    // 'monthly' par défaut
    return charge.amount;
}

// Noms des jours pour affichage
const DAY_NAMES_SHORT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const DAY_NAMES_FULL  = ['Dimanches', 'Lundis', 'Mardis', 'Mercredis', 'Jeudis', 'Vendredis', 'Samedis'];
const MONTH_NAMES_SHORT = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

// --- CORE LOGIC & CALCULATIONS ---
function calculateTotals() {
    const totalRevenues = state.revenues.reduce((sum, r) => sum + r.amount, 0);
    const totalFixed = state.fixedCharges.reduce((sum, c) => sum + getEffectiveChargeAmount(c), 0);
    // Exclude: pending cash deposits, savings lines (cochon épargne), floor shift lines (cochon zéro déplacé)
    const totalExpenses = state.expenses
        .filter(e => !(e.isCashDepositPending && !e.isDeposited)
                  && !e.isSavingsLine
                  && !e.isFloorShift)
        .reduce((sum, e) => sum + e.amount, 0);
    const remaining = totalRevenues - totalFixed - totalExpenses;
    return { totalRevenues, totalFixed, totalExpenses, remaining };
}

// --- POURBOIRE COCHON ---
/**
 * Calcule le palier optimal pour alimenter le cochon (Pourboire Cochon).
 * Paliers (du plus élevé au plus bas) : 10€, 5€, 1€, 0.10€, 0.01€
 * Le palier 5€ (demi-dizaine) est un intermédiaire entre le pourboire à l'euro et à la dizaine.
 * Retourne { roundedAmount, delta } ou null si pas de pourboire applicable.
 */
function calculateSmartRounding(amount) {
    if (!state.settings.isRoundingEnabled) return null;
    if (!amount || amount <= 0) return null;
    const pct = state.settings.roundingCeiling || 3.0;
    const delta = Math.round((amount * (pct / 100)) * 100) / 100;
    if (delta <= 0) return null;
    return { roundedAmount: Math.round((amount + delta) * 100) / 100, delta };
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
    
    const dateWrapper = document.getElementById("date_label_wrapper");
    const chipBlock = document.getElementById("card_chip_block");
    const ligne1 = document.getElementById("card_ligne_1");

    if (tabsContainer) {
        if (hasBudgets) {
            tabsContainer.classList.remove("hidden");
            if (dateWrapper && ligne1) ligne1.appendChild(dateWrapper);
        } else {
            tabsContainer.classList.add("hidden");
            // If we are currently on the budgets tab but there are no budgets left, switch back to main
            if (activeTab === "budgets") {
                switchDashboardTab('main');
            }
            if (dateWrapper && chipBlock) chipBlock.appendChild(dateWrapper);
        }
    }

    // Display totals
    document.getElementById("remaining_balance_disp").innerText = formatCurrency(remaining);
    document.getElementById("base_budget_disp").innerText = formatCurrency(totalRevenues);
    document.getElementById("fixed_charges_disp").innerText = formatCurrency(totalFixed);
    document.getElementById("expenses_disp").innerText = formatCurrency(totalExpenses);

    // Nom gravé style CB
    const cardHolderEl = document.getElementById("card_holder_name");
    if (cardHolderEl) {
        const rawName = state.settings?.username?.trim();
        cardHolderEl.textContent = rawName ? rawName.toUpperCase() : "HMR";
    }

    // Play overdraft sound if transition from non-negative to negative occurs
    if (lastRemaining !== null && lastRemaining >= 0 && remaining < 0) {
        playOverdraftSound();
    }
    window.lastRemaining = remaining;

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
    // Synchroniser le badge cochon
    updateCochonBadge();
}

/**
 * Retourne le code SVG du cochon (normal ou fissuré) pour affichage sous le bouton de suppression.
 * La taille est de 18px pour s'intégrer harmonieusement sous le bouton ✕.
 */
function getCochonSVG(isFissured) {
    const crackPath = isFissured 
        ? `<path d="M 20 10.5 L 18 14 L 22 18 L 19 22 L 23 25" stroke="#1c1917" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />`
        : '';
    
    return `<svg width="18" height="18" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:0 auto;filter:drop-shadow(0 1px 2px rgba(244,63,94,0.15));" class="select-none">
        <ellipse cx="20" cy="36.5" rx="9" ry="2.2" fill="url(#pg-shadow)" />
        <ellipse cx="10" cy="13" rx="4.5" ry="5.5" fill="url(#pg-ear)" transform="rotate(-18 10 13)" />
        <ellipse cx="10.5" cy="13.5" rx="2.2" ry="3.2" fill="#ffb3c6" opacity="0.7" transform="rotate(-18 10 13)" />
        <ellipse cx="30" cy="13" rx="4.5" ry="5.5" fill="url(#pg-ear)" transform="rotate(18 30 13)" />
        <ellipse cx="29.5" cy="13.5" rx="2.2" ry="3.2" fill="#ffb3c6" opacity="0.7" transform="rotate(18 30 13)" />
        <circle cx="20" cy="22" r="13" fill="url(#pg-body)" />
        <circle cx="20" cy="22" r="13" fill="none" stroke="rgba(196,130,255,0.65)" stroke-width="1.5" style="filter: drop-shadow(0 0 2px rgba(196,130,255,0.5));"/>
        <rect x="15.5" y="9.5" width="9" height="2.5" rx="1.25" fill="rgba(10,8,20,0.75)" />
        <rect x="15.5" y="9.5" width="9" height="1" rx="0.5" fill="rgba(255,255,255,0.12)" />
        <ellipse cx="20" cy="27" rx="6.5" ry="4.8" fill="url(#pg-snout)" />
        <ellipse cx="17.5" cy="27.5" rx="1.4" ry="1.8" fill="#e63870" opacity="0.65" />
        <ellipse cx="22.5" cy="27.5" rx="1.4" ry="1.8" fill="#e63870" opacity="0.65" />
        <circle cx="14.8" cy="20" r="1.8" fill="#1a0a2e" />
        <circle cx="25.2" cy="20" r="1.8" fill="#1a0a2e" />
        <circle cx="15.5" cy="19.3" r="0.7" fill="rgba(255,255,255,0.75)" />
        <circle cx="25.9" cy="19.3" r="0.7" fill="rgba(255,255,255,0.75)" />
        <ellipse cx="11.5" cy="24.5" rx="2.8" ry="1.8" fill="#f43f5e" opacity="0.30" />
        <ellipse cx="28.5" cy="24.5" rx="2.8" ry="1.8" fill="#f43f5e" opacity="0.30" />
        <ellipse cx="15" cy="16" rx="4.5" ry="3" fill="rgba(255,255,255,0.28)" transform="rotate(-25 15 16)" />
        <ellipse cx="14" cy="15" rx="2" ry="1.2" fill="rgba(255,255,255,0.45)" transform="rotate(-25 14 15)" />
        ${crackPath}
    </svg>`;
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
        
        item.className = `flex flex-col p-3 rounded-2xl border shadow-sm transition-all ${bgClass}`;
        
        // Display negative offsets if earlier than budgetMonth
        const dateDisplay = formatExpenseDate(e.date, state.budgetMonth);
        const displayTitle = isBudget ? (e.isCashDepositPending ? `🏦 ${e.title}` : `🎯 ${e.title}`) : e.title;
        
        // Badge installment si paiement en plusieurs fois
        let installmentBadgeHTML = "";
        if (e.installment && e.installment.total > 1) {
            installmentBadgeHTML = `<span class="installment-badge visible">${e.installment.current}/${e.installment.total}</span>`;
        }

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
        
        let cochonLineHTML = "";
        let cochonIconHTML = "";
        if (e.piocheCochon && e.piocheCochon > 0) {
            cochonLineHTML = `<div class="text-[10px] text-stone-400 dark:text-stone-500 font-mono font-semibold italic select-none">${e.piocheCochon.toFixed(2).replace('.', ',')} €</div>`;
            cochonIconHTML = getCochonSVG(true);
        } else if (e.roundingDelta && e.roundingDelta > 0) {
            cochonLineHTML = `<div class="text-[10px] text-stone-400 dark:text-stone-500 font-mono font-semibold italic select-none">+${e.roundingDelta.toFixed(2).replace('.', ',')} €</div>`;
            cochonIconHTML = getCochonSVG(false);
        }

        item.innerHTML = `
            <div class="flex flex-col w-full gap-1 group/item-click">
                
                <div class="flex justify-between items-start w-full gap-2">
                    <div onclick="openEditItem('expense', '${e.id}')" class="w-0 flex-1 cursor-pointer flex items-center min-h-[28px]">
                        <div class="font-mono font-bold text-[11px] uppercase truncate text-stone-800 dark:text-stone-100 group-hover/item-click:text-brand-500 transition-colors w-full">
                            ${displayTitle}
                        </div>
                    </div>
                    <div class="shrink-0">
                        <button onclick="deleteExpense('${e.id}')" class="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all flex items-center justify-center font-bold text-[9px] active:scale-90 border border-red-500/20" title="Supprimer">
                            ✕
                        </button>
                    </div>
                </div>

                <div class="flex justify-between items-center w-full gap-2">
                    <div onclick="openEditItem('expense', '${e.id}')" class="min-w-0 flex-1 cursor-pointer flex items-center gap-2">
                        <span class="font-mono font-bold text-[10px] text-stone-500 dark:text-stone-400 shrink-0">${dateDisplay}</span>
                        <span class="text-[8px] font-bold text-brand-500 uppercase tracking-wider opacity-0 group-hover/item-click:opacity-100 transition-all whitespace-nowrap select-none truncate">
                            ${indicatorEmoji} ${modifierText}
                        </span>
                    </div>
                    <div class="shrink-0 flex items-center justify-end min-h-[24px]">
                        ${(cochonLineHTML || cochonIconHTML) ? `
                            <div class="flex items-center justify-center gap-1">
                                ${cochonIconHTML}
                                <span class="text-[10px] select-none">${e.piocheCochon && e.piocheCochon > 0 ? '⛏️' : '🪙'}</span>
                            </div>
                            ${cochonLineHTML}
                        ` : ""}
                    </div>
                </div>

                <div class="flex justify-between items-center w-full gap-2">
                    <div onclick="openEditItem('expense', '${e.id}')" class="min-w-0 flex-1 cursor-pointer flex items-center flex-wrap gap-2 mt-1">
                        ${tagBadge}
                        ${installmentBadgeHTML}
                        ${badgeHTML}
                        ${depositButtonHTML}
                    </div>
                    <div class="shrink-0 flex items-center justify-end">
                        <span class="font-mono font-bold text-xs ${amountColor} truncate">${amountSign} ${absAmount.toFixed(2).replace('.', ',')} €</span>
                    </div>
                </div>

            </div>
        `;
        container.appendChild(item);
    });
}

function renderFixedChargesList() {
    const container = document.getElementById("fixed_charges_container");
    container.innerHTML = "";

    const [yr, mo] = state.budgetMonth.split('-').map(Number);
    const currentMonth = mo - 1; // 0-indexed

    state.fixedCharges.forEach(c => {
        const p = c.periodicity || { type: 'monthly' };
        const eff = getEffectiveChargeAmount(c);
        const isInactive = eff === 0;

        // Badge périodicité
        let badgeHtml = '';
        if (p.type === 'weekly') {
            const n = countDayOccurrences(p.dayOfWeek, yr, currentMonth);
            badgeHtml = `<span class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-md bg-sky-500/10 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 font-mono font-black text-[9px] border border-sky-500/20 select-none">×${n}</span>`;
        } else if (p.type === 'specific_months') {
            if (isInactive) {
                badgeHtml = `<span class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-md bg-red-500/10 dark:bg-red-500/15 text-red-600 dark:text-red-400 font-black text-[9px] border border-red-500/20 select-none">INACTIF</span>`;
            } else {
                badgeHtml = `<span class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black text-[9px] border border-emerald-500/20 select-none">ACTIF</span>`;
            }
        }

        // Sous-texte périodicité
        let subText = '';
        if (p.type === 'weekly') {
            const n = countDayOccurrences(p.dayOfWeek, yr, currentMonth);
            subText = `<span class="font-mono text-[9px] text-stone-400 dark:text-stone-600 mt-0.5 block">${formatCurrency(c.amount)} × ${n} ${DAY_NAMES_FULL[p.dayOfWeek]} dans le mois</span>`;
        } else if (p.type === 'specific_months' && isInactive) {
            const activeMonthNames = (p.months || []).map(m => MONTH_NAMES_SHORT[m]).join(', ');
            subText = `<span class="font-mono text-[9px] text-stone-400 dark:text-stone-600 mt-0.5 block">Actif en : ${activeMonthNames || '–'}</span>`;
        }

        const item = document.createElement("div");
        item.className = `flex items-center justify-between px-3 py-2 bg-stone-950/[0.03] dark:bg-black/30 rounded-xl border border-stone-200/60 dark:border-stone-800/60 group/charge transition-opacity ${isInactive ? 'opacity-50' : ''}`;
        item.innerHTML = `
            <div onclick="openEditItem('fixedCharge', '${c.id}')" class="min-w-0 pr-2 flex-1 cursor-pointer">
                <div class="flex items-center flex-wrap gap-0.5">
                    <span class="font-mono font-bold text-xs text-stone-800 dark:text-stone-200 truncate group-hover/charge:text-brand-500 transition-colors">${c.title}</span>
                    ${badgeHtml}
                </div>
                ${subText}
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <span class="font-mono font-black text-[11px] ${isInactive ? 'text-stone-400 dark:text-stone-600 line-through' : 'text-red-500 dark:text-red-400'}">- ${formatCurrency(eff)}</span>
                <button onclick="deleteFixedCharge('${c.id}')" class="w-6 h-6 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all flex items-center justify-center font-bold text-[9px] active:scale-90 border border-red-500/20" title="Supprimer">
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
        item.className = "flex items-center justify-between px-3 py-2 bg-stone-950/[0.03] dark:bg-black/30 rounded-xl border border-stone-200/60 dark:border-stone-800/60 group/rev";
        item.innerHTML = `
            <div onclick="openEditItem('revenue', '${r.id}')" class="min-w-0 pr-2 flex-1 cursor-pointer">
                <span class="font-mono font-bold text-xs text-stone-800 dark:text-stone-200 truncate block group-hover/rev:text-brand-500 transition-colors">${r.title}</span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <span class="font-mono font-black text-[11px] text-emerald-600 dark:text-emerald-400">+ ${r.amount.toFixed(2).replace('.', ',')} €</span>
                <button onclick="deleteRevenue('${r.id}')" class="w-6 h-6 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all flex items-center justify-center font-bold text-[9px] active:scale-90 border border-red-500/20" title="Supprimer">
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

    const titleInput  = document.getElementById("exp_title");
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

    const tag              = document.getElementById("exp_tag").value || "divers";
    const installTotal     = parseInt(document.getElementById("exp_installment_total").value) || 1;
    const installCurrent   = parseInt(document.getElementById("exp_installment_current").value) || 1;

    const newExpense = {
        id: Date.now().toString(),
        title,
        amount,
        date: selectedDate,
        tag
    };

    // Ajouter les données d'installment si paiement en plusieurs fois
    // Utilise le montant de l'échéance courante (personnalisable)
    if (installTotal > 1) {
        const groupId = generateInstallmentGroupId();
        // Montant de l'échéance actuelle (index = installCurrent - 1)
        const echMontant = (installmentAmounts.length === installTotal)
            ? (installmentAmounts[installCurrent - 1] || Math.round((amount / installTotal) * 100) / 100)
            : Math.round((amount / installTotal) * 100) / 100;
        newExpense.amount = echMontant;
        newExpense.installment = {
            groupId,
            current:     installCurrent,
            total:       installTotal,
            totalAmount: amount,
            amounts:     installmentAmounts.length === installTotal ? [...installmentAmounts] : null
        };
    }

    // --- POURBOIRE ET PIOCHE COCHON ---
    const isCochonMode = document.getElementById('cochon_mode_toggle')?.checked;
    const isRefundMode = newExpense.amount < 0;
    
    // Autorisé tant que ce n'est pas un remboursement (peu importe si c'est une mensualité ou son numéro)
    const canUseCochon = !isRefundMode;

    if (isCochonMode && canUseCochon) {
        const piocheDelta = Math.min(newExpense.amount, state.cochon);
        if (piocheDelta > 0) {
            newExpense.piocheCochon = piocheDelta;
            newExpense.amount = Math.round((newExpense.amount - piocheDelta) * 100) / 100;
            state.cochon = Math.round((state.cochon - piocheDelta) * 100) / 100;
            updateCochonBadge();
        }
    } else if (!isCochonMode && canUseCochon && state.settings.isRoundingEnabled) {
        const rounding = calculateSmartRounding(newExpense.amount);
        if (rounding && rounding.delta > 0) {
            newExpense.roundingDelta = rounding.delta;
            newExpense.amount = rounding.roundedAmount;
            state.cochon = Math.round((state.cochon + rounding.delta) * 100) / 100;
            updateCochonBadge();
        }
    }
    state.expenses.push(newExpense);
    saveState();
    expensesCollapsed = false;
    updateUI();
    showSuccessAnimation();
    // Auto-reset du mode cochon après l'opération
    if (isCochonMode) resetCochonMode();

    // Reset du formulaire
    titleInput.value  = "";
    amountInput.value = "";
    clearExpenseDate();
    document.getElementById("exp_tag").value = "divers";
    renderCompactTags("tag_selector_container", "exp_tag", "");
    resetInstallmentUI();
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
                                 state.budgets  = state.budgets.filter(b => b.id !== budget.id);
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

    // --- CAS PAIEMENT EN PLUSIEURS FOIS ---
    if (expense.installment && expense.installment.groupId) {
        const groupId    = expense.installment.groupId;
        const instCur    = expense.installment.current;
        const instTotal  = expense.installment.total;
        const amounts    = expense.installment.amounts;
        const totalAmount = expense.installment.totalAmount || (Math.abs(expense.amount) * instTotal);

        // Échéances restantes à annuler (current à total)
        const remaining  = instTotal - instCur + 1;
        let totalDueSum  = 0;

        // Construire le détail des échéances en tableau HTML
        let rows = '';
        for (let i = instCur; i <= instTotal; i++) {
            let amt = 0;
            if (i === instCur) {
                amt = Math.abs(expense.amount);
            } else {
                if (amounts && amounts.length === instTotal) {
                    amt = amounts[i - 1];
                } else {
                    amt = Math.round((totalAmount / instTotal) * 100) / 100;
                    if (i === instTotal) {
                        const equalAmount = Math.round((totalAmount / instTotal) * 100) / 100;
                        const diff = Math.round((totalAmount - equalAmount * instTotal) * 100) / 100;
                        if (diff !== 0) amt = Math.round((amt + diff) * 100) / 100;
                    }
                }
            }
            totalDueSum += amt;
            rows += `<tr>
                <td style="padding:2px 6px 2px 0;font-weight:900;color:rgb(139,92,246)">${i}/${instTotal}</td>
                <td style="padding:2px 0;color:#6b7280">− ${amt.toFixed(2).replace('.',',')} €</td>
                <td style="padding:2px 0 2px 8px;font-size:9px;color:#9ca3af">${i === instCur ? '← ce mois' : 'futur'}</td>
            </tr>`;
        }

        const totalDue = totalDueSum.toFixed(2).replace('.', ',');

        const detailHTML = `
            <table style="width:100%;font-family:monospace;font-size:10px;margin-top:8px;border-collapse:collapse">
                ${rows}
                <tr style="border-top:1px solid rgba(139,92,246,0.25);margin-top:4px">
                    <td style="padding:4px 6px 0 0;font-weight:900;font-size:9px;color:#9ca3af">TOTAL</td>
                    <td style="padding:4px 0 0 0;font-weight:900;color:#ef4444">− ${totalDue} €</td>
                </tr>
            </table>`;

        showGenericConfirm(
            `⚠️ Annuler le paiement fractionné ?`,
            `Vous êtes sur le point de supprimer <strong>"${expense.title}"</strong> — <strong>échéance ${instCur}/${instTotal}</strong>.<br><br>
            <strong>${remaining} échéance${remaining > 1 ? 's' : ''} seront annulée${remaining > 1 ? 's' : ''}</strong> (dont ${remaining - 1} future${remaining - 1 > 1 ? 's' : ''}) :
            ${detailHTML}
            <br><span style="font-size:9px;color:#9ca3af">Cette action est irréversible. Les échéances futures ne seront plus reportées automatiquement.</span>`,
            "💳",
            () => {
                state.expenses = state.expenses.filter(e =>
                    !(e.installment && e.installment.groupId === groupId &&
                      e.installment.current >= instCur)
                );
                saveState();
                updateUI();
                triggerHaptic('confirm');
            }
        );
        return;
    }

    // --- CAS NORMAL ---
    const isRefund   = expense.amount < 0;
    const absAmount  = Math.abs(expense.amount);
    const titleWord  = isRefund ? "le remboursement" : "la dépense";
    const emoji      = isRefund ? "💵" : "🗑️";

    // Avertissement cochon si la dépense avait généré un pourboire cochon ou utilisé la pioche cochon
    let cochonWarning = '';
    if (expense.roundingDelta && expense.roundingDelta > 0) {
        const delta    = expense.roundingDelta;
        const canGet   = Math.min(delta, state.cochon);
        const isFull   = canGet >= delta;
        const cochonFmt = canGet.toFixed(2).replace('.', ',');
        const deltaFmt  = delta.toFixed(2).replace('.', ',');
        cochonWarning = `
            <div style="margin-top:10px; display:flex; align-items:flex-start; gap:8px; background:rgba(244,63,94,0.08); border:1px solid rgba(244,63,94,0.25); border-radius:10px; padding:8px 10px;">
                <span style="font-size:20px; line-height:1; flex-shrink:0;">🐷</span>
                <div style="font-size:10px; font-weight:700; color:rgba(244,63,94,0.9); line-height:1.5;">
                    ${isFull
                        ? `Cette dépense avait généré un pourboire cochon de <strong>${deltaFmt}&nbsp;€</strong> dans le cochon.<br>En supprimant, <strong>${cochonFmt}&nbsp;€</strong> seront retirés du cochon.`
                        : `Cette dépense avait généré un pourboire cochon de <strong>${deltaFmt}&nbsp;€</strong> dans le cochon, mais il ne contient que <strong>${state.cochon.toFixed(2).replace('.', ',')}&nbsp;€</strong>.<br>Seulement <strong>${cochonFmt}&nbsp;€</strong> seront récupérés — le budget crédité sera réduit d'autant.`
                    }
                </div>
            </div>`;
    } else if (expense.piocheCochon && expense.piocheCochon > 0) {
        const piocheFmt = expense.piocheCochon.toFixed(2).replace('.', ',');
        cochonWarning = `
            <div style="margin-top:10px; display:flex; align-items:flex-start; gap:8px; background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.25); border-radius:10px; padding:8px 10px;">
                <span style="font-size:20px; line-height:1; flex-shrink:0;">🐷</span>
                <div style="font-size:10px; font-weight:700; color:rgb(5,150,105); line-height:1.5;">
                    Cette dépense a été co-payée avec le cochon à hauteur de <strong>${piocheFmt}&nbsp;€</strong>.<br>En la supprimant, <strong>${piocheFmt}&nbsp;€</strong> seront reversés dans votre réserve cochon.
                </div>
            </div>`;
    }

    showGenericConfirm(
        isRefund ? "Supprimer le remboursement ? (1/2)" : "Supprimer la dépense ? (1/2)",
        `Voulez-vous vraiment supprimer ${titleWord} <strong>"${expense.title}"</strong> de <strong>${absAmount.toFixed(2).replace('.', ',')} €</strong> ?${cochonWarning}`,
        emoji,
        () => {
            setTimeout(() => {
                showGenericConfirm(
                    "Confirmer la suppression (2/2)",
                    `Êtes-vous absolument sûr ? Cette action effacera définitivement ${titleWord} <strong>"${expense.title}"</strong>.`,
                    "⚠️",
                    () => {
                        // Sécurité cochon : si pourboire cochon delta ou pioche cochon, réajuster
                        const toDelete = state.expenses.find(e => e.id === id);
                        if (toDelete) {
                            if (toDelete.roundingDelta) {
                                state.cochon = Math.max(0, Math.round((state.cochon - toDelete.roundingDelta) * 100) / 100);
                                updateCochonBadge();
                            } else if (toDelete.piocheCochon) {
                                state.cochon = Math.round((state.cochon + toDelete.piocheCochon) * 100) / 100;
                                updateCochonBadge();
                            }
                        }
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
            resetInstallmentUI();
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
        // Lire la périodicité depuis le formulaire via la fonction utilitaire partagée
        const periodicity = readPeriodicityFromUI('new_charge_periodicity_section', 'new_charge_periodicity_type');

        state.fixedCharges.push({
            id: Date.now().toString(),
            title,
            amount,
            periodicity
        });
        saveState();
        fixedChargesCollapsed = false;
        updateUI();
        triggerHaptic('success');

        // Clear Inputs
        titleInput.value = "";
        amountInput.value = "";
        // Reset periodicity selector to monthly
        resetChargePeriodicityUI();
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

function proceedToRenewalCarryover() {
    document.getElementById("renewal_step_1").classList.add("hidden");
    
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

    // --- STEP 1 : Proposer l'export PDF avant de continuer ---
    document.getElementById("renewal_step_2").classList.add("hidden");
    showRenewalPdfStep();
}

/**
 * Affiche le step 1 de renouvellement : proposition d'export PDF du bilan du mois.
 */
function showRenewalPdfStep() {
    const monthLabel = formatYearMonthFrench(state.budgetMonth);
    const { totalRevenues, totalFixed, totalExpenses, remaining } = calculateTotals();
    const sign = remaining >= 0 ? '+' : '';
    const colorClass = remaining >= 0 ? 'text-emerald-400' : 'text-red-400';

    const step1 = document.getElementById('renewal_step_1');
    step1.innerHTML = `
        <div class="text-center space-y-4">
            <!-- Icône -->
            <div class="text-4xl">📄</div>

            <!-- Titre -->
            <div>
                <h3 class="text-base font-black text-stone-800 dark:text-stone-100 font-display">Bilan du mois</h3>
                <p class="text-[11px] text-stone-500 dark:text-stone-400 font-semibold mt-1">${monthLabel}</p>
            </div>

            <!-- Résumé chiffré -->
            <div class="bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-4 space-y-2 text-left">
                <div class="flex justify-between text-[11px] font-semibold text-stone-600 dark:text-stone-400">
                    <span>Revenus</span>
                    <span class="text-emerald-500 font-black">${formatCurrency(totalRevenues)}</span>
                </div>
                <div class="flex justify-between text-[11px] font-semibold text-stone-600 dark:text-stone-400">
                    <span>Frais fixes</span>
                    <span class="text-stone-700 dark:text-stone-300 font-black">-${formatCurrency(totalFixed)}</span>
                </div>
                <div class="flex justify-between text-[11px] font-semibold text-stone-600 dark:text-stone-400">
                    <span>Dépenses</span>
                    <span class="text-stone-700 dark:text-stone-300 font-black">-${formatCurrency(totalExpenses)}</span>
                </div>
                <div class="h-px bg-stone-200 dark:bg-stone-700 my-1"></div>
                <div class="flex justify-between text-[12px] font-black">
                    <span class="text-stone-700 dark:text-stone-200">Reste à vivre</span>
                    <span class="${colorClass}">${sign}${formatCurrency(remaining)}</span>
                </div>
                ${state.cochon > 0 ? `<div class="flex justify-between text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                    <span>Réserve 🐷</span>
                    <span class="text-amber-500 font-black">${formatCurrency(state.cochon)}</span>
                </div>` : ''}
            </div>

            <!-- Boutons -->
            <div class="grid grid-cols-1 gap-2 pt-1">
                <button onclick="renewalExportPDF()" class="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-black text-xs active:scale-95 transition-all shadow-md flex items-center justify-center gap-2">
                    <span class="text-base">📄</span> Exporter le bilan PDF
                </button>
                <button onclick="skipPdfAndContinue()" class="w-full py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-xl font-bold text-xs active:scale-95 transition-all border border-stone-200 dark:border-stone-700">
                    Continuer sans exporter
                </button>
            </div>
        </div>
    `;
    step1.classList.remove('hidden');
    triggerHaptic(10);
}

/**
 * Saute l'étape PDF et reprend le flux normal de renouvellement
 * (vérification du solde -> report ou step 3).
 */
function skipPdfAndContinue() {
    document.getElementById('renewal_step_1').classList.add('hidden');
    proceedToRenewalCarryover();
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
        proceedToRenewalCarryover();
    } catch (err) {
        console.error("PDF generation failed:", err);
        showGenericAlert("Erreur PDF", "Impossible de générer le PDF. Vous pouvez continuer sans.", "❌");
        proceedToRenewalCarryover();
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
    if (state.cochon > 0) {
        pdfTx += padLine("RESERVE COCHON", formatCurrency(state.cochon)) + "\n";
    }
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
    // --- SECTION MOUVEMENTS D'ÉPARGNE COCHON ---
    const savingsLines = state.expenses.filter(e => e.isSavingsLine || e.isFloorShift);
    if (savingsLines.length > 0) {
        pdfTx += makeSep("=") + "\n";
        pdfTx += `MOUVEMENTS D'EPARGNE (COCHON)\n`;
        pdfTx += makeSep("-") + "\n";
        let cumulEpargne = 0, cumulZero = 0;
        savingsLines.forEach(e => {
            const abs = Math.abs(e.amount);
            if (e.isSavingsLine) { cumulEpargne += abs; }
            if (e.isFloorShift)  { cumulZero    += abs; }
            const label = e.isSavingsLine ? '[EPARGNE]' : '[PLANCHER]';
            pdfTx += padLine(` ${label} ${e.title || 'Mouvement'}`, formatCurrency(abs)) + "\n";
        });
        pdfTx += makeSep("-") + "\n";
        if (cumulEpargne > 0) pdfTx += padLine(" Cumul Epargne Reelle", formatCurrency(cumulEpargne)) + "\n";
        if (cumulZero > 0)    pdfTx += padLine(" Cumul Zero Deplace",   formatCurrency(cumulZero))    + "\n";
        pdfTx += padLine(" EFFORT FINANCIER TOTAL", formatCurrency(cumulEpargne + cumulZero)) + "\n";
        pdfTx += "\n";
    }
    pdfTx += makeSep("=") + "\n";
    pdfTx += `FIN DE TICKET — MERCI\n`;
    pdfTx += makeSep("=") + "\n";
    
    // --- ALERTE RAPPEL ÉPARGNE DESACTIVEE ---

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
    // --- REPORT DES PAIEMENTS EN PLUSIEURS FOIS ---
    const pendingInstallments = (state.expenses || []).filter(
        e => e.installment && e.installment.current < e.installment.total
    );
    const pendingDeposits = state.expenses ? state.expenses.filter(e => e.isCashDepositPending && !e.isDeposited) : [];
    state.expenses = [];
    state.budgets  = [];
    state.budgetMonth = selectedRenewalMonth;

    // Reporter les dépôts en attente
    pendingDeposits.forEach(d => {
        d.date = `${selectedRenewalMonth}-01`;
        state.expenses.push(d);
    });

	// Créer la prochaine échéance pour chaque paiement en cours
    pendingInstallments.forEach(e => {
        // 1. Retrouver le vrai montant (annuler l'arrondi ou la pioche du mois précédent)
        let nextAmount = e.amount;
        if (e.roundingDelta) {
            nextAmount = Math.round((e.amount - e.roundingDelta) * 100) / 100;
        } else if (e.piocheCochon) {
            nextAmount = Math.round((e.amount + e.piocheCochon) * 100) / 100;
        }
        
        // Priorité aux montants personnalisés s'ils ont été modifiés manuellement
        if (e.installment && e.installment.amounts && e.installment.amounts.length >= e.installment.current + 1) {
            nextAmount = e.installment.amounts[e.installment.current];
        }

        const nextInstallment = {
            id:    `${Date.now()}_${Math.floor(Math.random() * 10000)}`,
            title: e.title,
            amount: nextAmount, // Montant de base propre
            date:  `${selectedRenewalMonth}-01`,
            tag:   e.tag || 'divers',
            installment: {
                groupId: e.installment.groupId,
                current: e.installment.current + 1,
                total:   e.installment.total,
                amounts: e.installment.amounts ? [...e.installment.amounts] : null
            }
        };

        // 2. Appliquer le NOUVEL arrondi (pourboire) pour ce mois-ci
        if (state.settings.isRoundingEnabled) {
            const rounding = calculateSmartRounding(nextInstallment.amount);
            if (rounding && rounding.delta > 0) {
                nextInstallment.roundingDelta = rounding.delta;
                nextInstallment.amount = rounding.roundedAmount;
                state.cochon = Math.round((state.cochon + rounding.delta) * 100) / 100;
            }
        }

        state.expenses.push(nextInstallment);
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

function updateCollapsibleUI() {
    // Mise à jour des 3 cartes façade (Opérations / Revenus / Frais Fixes)
    const expSummary = document.getElementById("expenses_summary");
    if (expSummary) {
        const n = state.expenses.length;
        const totalNet = state.expenses.reduce((s, e) => s + e.amount, 0);
        // Reset color classes
        expSummary.className = expSummary.className
            .replace(/text-(?:red|emerald|stone|green)-\d+(?:\s+dark:text-(?:red|emerald|stone|green)-\d+)?/g, '').trim();
        if (n === 0) {
            expSummary.textContent = "0 opération";
            expSummary.classList.add("text-stone-400", "dark:text-stone-500");
        } else {
            const sign = totalNet <= 0 ? "+" : "-";
            const colorClass = totalNet <= 0 ? "text-emerald-500 dark:text-emerald-400" : "text-red-500 dark:text-red-400";
            expSummary.textContent = `${n} opération${n > 1 ? 's' : ''} · ${sign} ${formatCurrency(Math.abs(totalNet))}`;
            expSummary.classList.add(...colorClass.split(' '));
        }
    }


    const revSummary = document.getElementById("revenues_summary");
    if (revSummary) {
        const total = state.revenues.reduce((s, r) => s + r.amount, 0);
        revSummary.textContent = formatCurrency(total);
    }

    const fcSummary = document.getElementById("fixed_charges_summary");
    if (fcSummary) {
        const total = state.fixedCharges.reduce((s, c) => s + getEffectiveChargeAmount(c), 0);
        fcSummary.textContent = formatCurrency(total);
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



// --- GENERIC CONFIRMATION MODAL LOGIC ---
let activeConfirmCallback = null;
let activeCancelCallback = null;
let confirmTimeoutId = null;
let activeGenericConfirmCode = null;

function showGenericConfirm(title, message, icon, confirmCallback, cancelCallback = null, confirmText = "Confirmer", cancelText = "Annuler", requireSecurityCode = false, swapButtonsOrder = false) {
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

    if (swapButtonsOrder) {
        confirmBtn.classList.add("order-first");
        if (cancelBtn) cancelBtn.classList.add("order-last");
    } else {
        confirmBtn.classList.remove("order-first");
        if (cancelBtn) cancelBtn.classList.remove("order-last");
    }
    
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
    if (window.showGenericAlert && window.showGenericAlert !== showGenericAlert) {
        return window.showGenericAlert(title, message, icon);
    }
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
            item = (budget.expenses || []).find(op => op.id === id) || (budget.archivedExpenses && budget.archivedExpenses.find(op => op.id === id));
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

    const isInstallment = (type === "expense" && item.installment && item.installment.total > 1);
    const titleInput = document.getElementById("edit_title");
    const amountInput = document.getElementById("edit_amount");
    const dateSection = document.getElementById("edit_date_section");
    const tagSection = document.getElementById("edit_tag_section");
    const submitBtn = document.getElementById("edit_submit_btn");
    const cancelBtn = document.getElementById("edit_cancel_btn");

    if (isInstallment) {
        document.getElementById("edit_modal_title").innerHTML = `💳 Paiement fractionné`;
        
        // Rendre les champs de saisie en lecture seule
        if (titleInput) {
            titleInput.value = item.title;
            titleInput.readOnly = true;
            titleInput.classList.add('opacity-60', 'cursor-not-allowed', 'bg-stone-50/50', 'dark:bg-stone-950/20');
        }
        if (amountInput) {
            amountInput.value = Math.abs(item.amount).toFixed(2).replace(".", ",");
            amountInput.readOnly = true;
            amountInput.classList.add('opacity-60', 'cursor-not-allowed', 'bg-stone-50/50', 'dark:bg-stone-950/20');
        }
        
        // Cacher la date et la catégorie car elles ne sont pas modifiables individuellement
        if (dateSection) dateSection.classList.add("hidden");
        if (tagSection) tagSection.classList.add("hidden");
        
        // Ajuster les boutons d'action (consultatif)
        if (submitBtn) submitBtn.classList.add("hidden");
        if (cancelBtn) {
            cancelBtn.textContent = "Fermer";
            cancelBtn.classList.add("col-span-2");
        }
    } else {
        document.getElementById("edit_modal_title").innerHTML = `✏️ ${modalTitle}`;
        
        if (titleInput) {
            titleInput.value = item.title;
            titleInput.readOnly = false;
            titleInput.classList.remove('opacity-60', 'cursor-not-allowed', 'bg-stone-50/50', 'dark:bg-stone-950/20');
        }
        if (amountInput) {
            amountInput.value = Math.abs(item.amount).toFixed(2).replace(".", ",");
            amountInput.readOnly = false;
            amountInput.classList.remove('opacity-60', 'cursor-not-allowed', 'bg-stone-50/50', 'dark:bg-stone-950/20');
        }
        
        // Gérer la date
        if (dateSection) {
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
        }
        
        // Gérer la catégorie (tag)
        if (tagSection) {
            if (type === "expense" || type === "budget") {
                tagSection.classList.remove("hidden");
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
                tagSection.classList.add("hidden");
            }
        }
        
        // Ajuster les boutons d'action
        if (submitBtn) submitBtn.classList.remove("hidden");
        if (cancelBtn) {
            cancelBtn.textContent = "Annuler";
            cancelBtn.classList.remove("col-span-2");
        }
    }

    // Section périodicité : visible uniquement pour les frais fixes
    const periodicitySection = document.getElementById("edit_periodicity_section");
    if (periodicitySection) {
        if (type === "fixedCharge") {
            periodicitySection.classList.remove("hidden");
            renderPeriodicitySelector('edit_periodicity_section', 'edit_periodicity_type', item.periodicity || { type: 'monthly' });
        } else {
            periodicitySection.classList.add("hidden");
        }
    }

    // Section remboursement anticipé : visible uniquement pour les dépenses en plusieurs fois
    const earlyRepaySection = document.getElementById("edit_early_repay_section");
    if (earlyRepaySection) {
        if (type === "expense" && item.installment && item.installment.total > 1) {
            earlyRepaySection.classList.remove("hidden");
            const inst      = item.installment;
            const amounts    = inst.amounts;
            const totalAmount = inst.totalAmount || (Math.abs(item.amount) * inst.total);
            const remaining = inst.total - inst.current + 1;

            let totalDueSum = 0;
            let rows = '';
            for (let i = 1; i <= inst.total; i++) {
                let amt = 0;
                let status = '';
                if (i < inst.current) {
                    if (amounts && amounts.length === inst.total) {
                        amt = amounts[i - 1];
                    } else {
                        amt = Math.round((totalAmount / inst.total) * 100) / 100;
                    }
                    status = '<span class="text-stone-400 dark:text-stone-600 font-black">payé</span>';
                } else if (i === inst.current) {
                    amt = Math.abs(item.amount);
                    status = '<span class="text-violet-500 font-black">ce mois</span>';
                } else {
                    if (amounts && amounts.length === inst.total) {
                        amt = amounts[i - 1];
                    } else {
                        amt = Math.round((totalAmount / inst.total) * 100) / 100;
                        if (i === inst.total) {
                            const equalAmount = Math.round((totalAmount / inst.total) * 100) / 100;
                            const diff = Math.round((totalAmount - equalAmount * inst.total) * 100) / 100;
                            if (diff !== 0) amt = Math.round((amt + diff) * 100) / 100;
                        }
                    }
                    status = '<span class="text-stone-400 dark:text-stone-500 font-black">futur</span>';
                }
                totalDueSum += amt;
                
                rows += `
                <tr style="border-bottom: 1px solid rgba(139, 92, 246, 0.1)">
                    <td style="padding: 4px 0; font-weight: 900; color: rgb(139,92,246); text-align: left; font-size: 10px;">${i}/${inst.total}</td>
                    <td style="padding: 4px 0; font-family: monospace; font-weight: 700; color: #6b7280; text-align: right; font-size: 10px;">${amt.toFixed(2).replace('.', ',')} €</td>
                    <td style="padding: 4px 0; text-align: right; font-size: 8px; text-transform: uppercase; letter-spacing: 0.05em; padding-left: 16px;">${status}</td>
                </tr>`;
            }
            
            const tableHTML = `
            <div style="margin-top: 8px; background-color: rgba(139, 92, 246, 0.03); border: 1px solid rgba(139, 92, 246, 0.15); border-radius: 12px; padding: 10px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 1px solid rgba(139, 92, 246, 0.2)">
                            <th style="text-align: left; font-size: 8px; font-weight: 900; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 4px;">Échéance</th>
                            <th style="text-align: right; font-size: 8px; font-weight: 900; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 4px;">Montant</th>
                            <th style="text-align: right; font-size: 8px; font-weight: 900; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 4px;">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 6px; border-top: 1px solid rgba(139, 92, 246, 0.2); margin-top: 6px; font-weight: 900; font-size: 10px;">
                    <span style="color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; font-size: 8px;">TOTAL DUÉ (PAYÉ+RESTANT)</span>
                    <span style="color: rgb(139,92,246); font-family: monospace;">${totalDueSum.toFixed(2).replace('.', ',')} €</span>
                </div>
            </div>`;

            const infoEl   = document.getElementById('edit_installment_info');
            if (infoEl) {
                infoEl.innerHTML = `Échéance actuelle : <strong class="text-violet-500">${inst.current}/${inst.total}</strong><br>${tableHTML}`;
            }
        } else {
            earlyRepaySection.classList.add("hidden");
        }
    }

    const modal = document.getElementById("edit_modal");
    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.querySelector(".glass-card").classList.remove("scale-95");
    }, 10);
}

// Affiche le sélecteur de périodicité dans la section #edit_periodicity_section ou #new_charge_periodicity_section
function renderPeriodicitySelector(containerId, hiddenInputId, currentPeriodicity) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const p = currentPeriodicity || { type: 'monthly' };
    const [yr, mo] = state.budgetMonth.split('-').map(Number);
    const currentMonth = mo - 1;

    const types = [
        { key: 'monthly', label: 'Mensuel', icon: '🗓️' },
        { key: 'weekly', label: 'Hebdo', icon: '🔁' },
        { key: 'specific_months', label: 'Mois choisis', icon: '📅' }
    ];

    let typeButtons = types.map(t => `
        <button type="button"
            onclick="selectPeriodicityType('${containerId}','${hiddenInputId}','${t.key}')"
            class="periodicity-type-btn flex-1 py-2 rounded-xl font-black text-[9px] uppercase tracking-wider border transition-all active:scale-95 select-none
                   ${ p.type === t.key
                       ? 'bg-gradient-to-b from-brand-500 to-brand-600 text-white border-brand-600 shadow-[0_2px_0_theme(colors.brand.700)]'
                       : 'bg-stone-100 dark:bg-stone-900 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-800'}"
            data-ptype="${t.key}">
            ${t.icon} ${t.label}
        </button>
    `).join('');

    // Panel hebdo
    const weeklyPanel = (() => {
        const days = DAY_NAMES_SHORT.map((d, i) => `
            <button type="button"
                onclick="selectPeriodicityDay('${containerId}','${hiddenInputId}',${i})"
                class="periodicity-day-btn py-1.5 rounded-lg font-black text-[9px] uppercase tracking-wider border transition-all active:scale-95 select-none
                       ${ p.type === 'weekly' && p.dayOfWeek === i
                           ? 'bg-brand-500 text-white border-brand-500'
                           : 'bg-stone-100 dark:bg-stone-900 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-800'}"
                data-day="${i}">${d}</button>
        `).join('');
        const n = p.type === 'weekly' ? countDayOccurrences(p.dayOfWeek ?? 1, yr, currentMonth) : 0;
        const previewDay = p.type === 'weekly' ? DAY_NAMES_SHORT[p.dayOfWeek ?? 1] : DAY_NAMES_SHORT[1];
        return `<div id="${containerId}_weekly" class="space-y-2 ${ p.type === 'weekly' ? '' : 'hidden' }">
            <div class="grid grid-cols-7 gap-1">${days}</div>
            <div id="${containerId}_weekly_preview" class="font-mono text-[9px] text-brand-500 dark:text-brand-400 text-center font-black">
                ${n} ${DAY_NAMES_FULL[p.dayOfWeek ?? 1]} dans le mois
            </div>
        </div>`;
    })();

    // Panel mois spécifiques
    const specificPanel = (() => {
        const months = MONTH_NAMES_SHORT.map((m, i) => `
            <label class="flex flex-col items-center gap-0.5 cursor-pointer select-none">
                <input type="checkbox" class="${hiddenInputId}_month_cb sr-only" value="${i}"
                    ${ p.type === 'specific_months' && Array.isArray(p.months) && p.months.includes(i) ? 'checked' : '' }
                    onchange="updateSpecificMonthsPreview('${containerId}','${hiddenInputId}')">
                <span class="w-8 h-7 rounded-lg font-black text-[9px] flex items-center justify-center border transition-all
                    month-pill ${ p.type === 'specific_months' && Array.isArray(p.months) && p.months.includes(i)
                        ? 'bg-brand-500 text-white border-brand-500'
                        : (i === currentMonth ? 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-600' : 'bg-stone-100 dark:bg-stone-900 text-stone-400 dark:text-stone-500 border-stone-200 dark:border-stone-800')}
                ">${m}</span>
            </label>
        `).join('');
        return `<div id="${containerId}_specific" class="space-y-2 ${ p.type === 'specific_months' ? '' : 'hidden' }">
            <div class="grid grid-cols-6 gap-1.5">${months}</div>
            <div id="${containerId}_specific_preview" class="font-mono text-[9px] text-brand-500 dark:text-brand-400 text-center font-black">
                ${ p.type === 'specific_months' && Array.isArray(p.months) ? `Actif ${p.months.length} mois/an` : 'Aucun mois sélectionné' }
            </div>
        </div>`;
    })();

    container.innerHTML = `
        <input type="hidden" id="${hiddenInputId}" value="${p.type}">
        <div class="flex gap-1.5 mb-2">${typeButtons}</div>
        ${weeklyPanel}
        ${specificPanel}
    `;

    // Appliquer style checkbox checkmark via JS (les inputs sont sr-only)
    container.querySelectorAll(`.${hiddenInputId}_month_cb`).forEach(cb => {
        cb.addEventListener('change', () => {
            const pill = cb.nextElementSibling;
            if (cb.checked) {
                pill.classList.add('bg-brand-500','text-white','border-brand-500');
                pill.classList.remove('bg-stone-100','dark:bg-stone-900','text-stone-400','dark:text-stone-500','border-stone-200','dark:border-stone-800','bg-stone-200','dark:bg-stone-700','text-stone-700','dark:text-stone-300','border-stone-300','dark:border-stone-600');
            } else {
                pill.classList.remove('bg-brand-500','text-white','border-brand-500');
                const isCurrentMonth = parseInt(cb.value) === currentMonth;
                if (isCurrentMonth) {
                    pill.classList.add('bg-stone-200','dark:bg-stone-700','text-stone-700','dark:text-stone-300','border-stone-300','dark:border-stone-600');
                } else {
                    pill.classList.add('bg-stone-100','dark:bg-stone-900','text-stone-400','dark:text-stone-500','border-stone-200','dark:border-stone-800');
                }
            }
        });
    });
}

function selectPeriodicityType(containerId, hiddenInputId, type) {
    const hiddenInput = document.getElementById(hiddenInputId);
    if (hiddenInput) hiddenInput.value = type;
    // Toggle panels
    const weeklyPanel = document.getElementById(`${containerId}_weekly`);
    const specificPanel = document.getElementById(`${containerId}_specific`);
    if (weeklyPanel) weeklyPanel.classList.toggle('hidden', type !== 'weekly');
    if (specificPanel) specificPanel.classList.toggle('hidden', type !== 'specific_months');
    // Update button styles
    document.querySelectorAll(`#${containerId} .periodicity-type-btn`).forEach(btn => {
        const active = btn.dataset.ptype === type;
        btn.className = btn.className
            .replace(/bg-gradient-to-b from-brand-500 to-brand-600 text-white border-brand-600 shadow-\[0_2px_0_theme\(colors\.brand\.700\)\]/g, '')
            .replace(/bg-stone-100 dark:bg-stone-900 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-800/g, '').trim();
        if (active) {
            btn.classList.add('bg-gradient-to-b','from-brand-500','to-brand-600','text-white','border-brand-600','shadow-[0_2px_0_theme(colors.brand.700)]');
            btn.classList.remove('bg-stone-100','dark:bg-stone-900','text-stone-500','dark:text-stone-400','border-stone-200','dark:border-stone-800');
        } else {
            btn.classList.add('bg-stone-100','dark:bg-stone-900','text-stone-500','dark:text-stone-400','border-stone-200','dark:border-stone-800');
            btn.classList.remove('bg-gradient-to-b','from-brand-500','to-brand-600','text-white','border-brand-600','shadow-[0_2px_0_theme(colors.brand.700)]');
        }
    });
    triggerHaptic(10);
}

function selectPeriodicityDay(containerId, hiddenInputId, dayIndex) {
    // Update button styles
    document.querySelectorAll(`#${containerId} .periodicity-day-btn`).forEach(btn => {
        const active = parseInt(btn.dataset.day) === dayIndex;
        if (active) {
            btn.classList.add('bg-brand-500','text-white','border-brand-500');
            btn.classList.remove('bg-stone-100','dark:bg-stone-900','text-stone-500','dark:text-stone-400','border-stone-200','dark:border-stone-800');
        } else {
            btn.classList.add('bg-stone-100','dark:bg-stone-900','text-stone-500','dark:text-stone-400','border-stone-200','dark:border-stone-800');
            btn.classList.remove('bg-brand-500','text-white','border-brand-500');
        }
    });
    // Mettre à jour le préview
    const [yr, mo] = state.budgetMonth.split('-').map(Number);
    const n = countDayOccurrences(dayIndex, yr, mo - 1);
    const preview = document.getElementById(`${containerId}_weekly_preview`);
    if (preview) preview.textContent = `${n} ${DAY_NAMES_FULL[dayIndex]} dans le mois`;
    triggerHaptic(10);
}

function updateSpecificMonthsPreview(containerId, hiddenInputId) {
    const checked = document.querySelectorAll(`.${hiddenInputId}_month_cb:checked`).length;
    const preview = document.getElementById(`${containerId}_specific_preview`);
    if (preview) preview.textContent = checked > 0 ? `Actif ${checked} mois/an` : 'Aucun mois sélectionné';
}

function readPeriodicityFromUI(containerId, hiddenInputId) {
    const type = document.getElementById(hiddenInputId)?.value || 'monthly';
    if (type === 'weekly') {
        const activeDay = document.querySelector(`#${containerId} .periodicity-day-btn.bg-brand-500`);
        const dayOfWeek = activeDay ? parseInt(activeDay.dataset.day) : 1;
        return { type: 'weekly', dayOfWeek };
    } else if (type === 'specific_months') {
        const months = [];
        document.querySelectorAll(`.${hiddenInputId}_month_cb:checked`).forEach(cb => months.push(parseInt(cb.value)));
        return { type: 'specific_months', months };
    }
    return { type: 'monthly' };
}

function resetChargePeriodicityUI() {
    renderPeriodicitySelector('new_charge_periodicity_section', 'new_charge_periodicity_type', { type: 'monthly' });
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

function earlyRepayInstallment() {
    if (!currentEditingItem || currentEditingItem.type !== 'expense') return;
    const expense = state.expenses.find(e => e.id === currentEditingItem.id);
    if (!expense || !expense.installment) return;

    const inst      = expense.installment;
    const remaining = inst.total - inst.current + 1;
    const groupId   = inst.groupId;
    const amounts    = inst.amounts;
    const totalAmount = inst.totalAmount || (Math.abs(expense.amount) * inst.total);

    let totalDueSum = 0;
    // Construire le tableau récap
    let rows = '';
    for (let i = inst.current; i <= inst.total; i++) {
        let amt = 0;
        if (i === inst.current) {
            amt = Math.abs(expense.amount);
        } else {
            if (amounts && amounts.length === inst.total) {
                amt = amounts[i - 1];
            } else {
                amt = Math.round((totalAmount / inst.total) * 100) / 100;
                if (i === inst.total) {
                    const equalAmount = Math.round((totalAmount / inst.total) * 100) / 100;
                    const diff = Math.round((totalAmount - equalAmount * inst.total) * 100) / 100;
                    if (diff !== 0) amt = Math.round((amt + diff) * 100) / 100;
                }
            }
        }
        totalDueSum += amt;
        rows += `<tr>
            <td style="padding:2px 6px 2px 0;font-weight:900;color:rgb(139,92,246)">${i}/${inst.total}</td>
            <td style="padding:2px 0;color:#6b7280">${amt.toFixed(2).replace('.', ',')} €</td>
            <td style="padding:2px 0 2px 8px;font-size:9px;color:#9ca3af">${i === inst.current ? '← ce mois' : 'soldé'}</td>
        </tr>`;
    }
    const totalDue  = totalDueSum;
    const detailHTML = `<table style="width:100%;font-family:monospace;font-size:10px;margin-top:8px;border-collapse:collapse">
        ${rows}
        <tr style="border-top:1px solid rgba(139,92,246,0.25)">
            <td style="padding:4px 6px 0 0;font-weight:900;font-size:9px;color:#9ca3af">À DÉBITER</td>
            <td style="padding:4px 0 0 0;font-weight:900;color:#ef4444">− ${totalDue.toFixed(2).replace('.',',')} €</td>
        </tr>
    </table>`;

    // Fermer la modale d'édition AVANT d'afficher la confirmation
    // pour que la modale de confirmation soit bien au premier plan
    closeEditModal();

    setTimeout(() => {
        showGenericConfirm(
            `💳 Remboursement anticipé ?`,
            `<strong>${remaining} échéance${remaining > 1 ? 's' : ''}</strong> vont être consolidées en une seule dépense de <strong>${totalDue.toFixed(2).replace('.',',')} €</strong> :
            ${detailHTML}
            <br><span style="font-size:9px;color:#9ca3af">Les futures échéances seront supprimées. La dépense de ce mois sera remplacée par le montant total soldé.</span>`,
            '💰',
            () => {
                // 1. Supprimer toutes les échéances du groupe (current et futures)
                state.expenses = state.expenses.filter(e =>
                    !(e.installment && e.installment.groupId === groupId &&
                      e.installment.current >= inst.current)
                );
                // 2. Créer une dépense unique pour le montant total, sans installment
                const repaidExpense = {
                    id:     `${Date.now()}_repaid`,
                    title:  expense.title,
                    amount: totalDue,
                    date:   expense.date,
                    tag:    expense.tag || 'divers'
                };
                state.expenses.push(repaidExpense);
                saveState();
                updateUI();
                triggerHaptic('success');
                showGenericAlert(
                    'Remboursement effectué',
                    `<strong>${expense.title}</strong> soldé pour <strong>${totalDue.toFixed(2).replace('.',',')} €</strong>. Les ${remaining - 1} échéance${remaining - 1 > 1 ? 's' : ''} future${remaining - 1 > 1 ? 's' : ''} ont été supprimée${remaining - 1 > 1 ? 's' : ''}.`,
                    '✅'
                );
            }
        );
    }, 320); // Attendre la fin de l'animation de fermeture de l'edit modal
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

            // Si c'est un paiement fractionné, mettre à jour le tableau des montants personnalisés
            if (item.installment) {
                if (!item.installment.amounts) {
                    // Initialiser avec la répartition égale si elle était nulle
                    const equalAmount = Math.round((item.installment.totalAmount / item.installment.total) * 100) / 100;
                    item.installment.amounts = Array.from({ length: item.installment.total }, () => equalAmount);
                    const diff = Math.round((item.installment.totalAmount - equalAmount * item.installment.total) * 100) / 100;
                    if (diff !== 0) {
                        item.installment.amounts[item.installment.total - 1] = Math.round((item.installment.amounts[item.installment.total - 1] + diff) * 100) / 100;
                    }
                }
                if (item.installment.amounts && item.installment.amounts.length >= item.installment.current) {
                    item.installment.amounts[item.installment.current - 1] = amount;
                }
            }

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
            const newPeriodicity = readPeriodicityFromUI('edit_periodicity_section', 'edit_periodicity_type');
            const wasActive = getEffectiveChargeAmount(item) > 0;

            item.title = title;
            item.amount = amount;
            item.periodicity = newPeriodicity;

            const isNowActive = getEffectiveChargeAmount(item) > 0;

            // Dialog si désactivation en cours de mois
            if (wasActive && !isNowActive) {
                const today = new Date();
                const dayStr = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
                saveState();
                updateUI();
                closeEditModal();
                setTimeout(() => {
                    showGenericConfirm(
                        `⚠️ Frais peut-être déjà prélevé`,
                        `Nous sommes le <strong>${dayStr}</strong>. Le frais <strong>« ${title} »</strong> de <strong>${formatCurrency(amount)}</strong> a peut-être déjà été prélevé ce mois-ci.<br><br>Souhaitez-vous le <strong>conserver dans le budget ce mois</strong>, ou le <strong>supprimer de ce mois</strong> ?`,
                        '💸',
                        () => { /* Supprimer = déjà fait (inactif = 0) */ },
                        () => {
                            // Conserver = on le force actif pour ce mois uniquement en ajoutant une dépense exceptionnelle
                            state.expenses.push({
                                id: Date.now().toString(),
                                title: `[Report] ${title}`,
                                amount: amount,
                                date: today.toISOString().split('T')[0],
                                tag: 'divers'
                            });
                            saveState();
                            updateUI();
                        },
                        'Supprimer du budget',
                        'Conserver ce mois'
                    );
                }, 350);
                return;
            }
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

    // --- Cochon & Pourboire Cochon : peupler les champs ---
    const roundingToggle = document.getElementById('settings_rounding_toggle');
    if (roundingToggle) {
        roundingToggle.checked = state.settings.isRoundingEnabled !== false;
        const cochonFields = document.getElementById('cochon_settings_fields');
        if (cochonFields) cochonFields.classList.toggle('hidden', !roundingToggle.checked);
    }
    const ceilingInput = document.getElementById('settings_rounding_ceiling');
    if (ceilingInput) {
        ceilingInput.value = state.settings.roundingCeiling || 3.0;
        // Générer les exemples dynamiques dès l'ouverture
        onRoundingCeilingChange(ceilingInput.value);
    }
    const targetInput = document.getElementById('settings_cochon_target');
    if (targetInput) targetInput.value = state.settings.cochonTarget || 60;
    // Cochon thresholds — supprimés (plus de paliers visuels)
    // (la barre de progression suffit)

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

/**
 * Appelé quand le slider "Pourboire Cochon max %" change.
 * Met à jour le display + génère des exemples dynamiques.
 */
function onRoundingCeilingChange(val) {
    const pct = parseFloat(val);
    const disp = document.getElementById('rounding_ceiling_disp');
    if (disp) disp.textContent = pct + '%';

    // Exemples représentatifs : montants pour chaque type de pourboire cochon (triés par montant croissant)
    const examples = [
        { label: 'Café / snack', amount: 3.20 },
        { label: 'Déjeuner', amount: 15.50 },
        { label: 'Courses', amount: 65.00 },
        { label: 'Achat moyen', amount: 120.00 },
        { label: 'Gros achat', amount: 350.00 },
    ];

    const container = document.getElementById('rounding_examples');
    if (!container) { saveUserSettings(); return; }

    const rows = examples.map(ex => {
        const delta = Math.round((ex.amount * (pct / 100)) * 100) / 100;
        const rounded = Math.round((ex.amount + delta) * 100) / 100;
        
        const amtFmt = ex.amount.toFixed(2).replace('.', ',');
        const roundedFmt = rounded.toFixed(2).replace('.', ',');
        const deltaFmt   = delta.toFixed(2).replace('.', ',');
        
        return `<div class="flex items-center justify-between text-[9px] font-semibold leading-tight py-0.5 px-1">
                    <span class="text-stone-500 dark:text-stone-400">${amtFmt} € (${ex.label}) → <strong class="text-stone-700 dark:text-stone-200">${roundedFmt} €</strong></span>
                    <span class="text-brand-500 font-black">+${deltaFmt} € 🐷</span>
                </div>`;
    });

    container.innerHTML = rows.join('');
    saveUserSettings();
}

function saveUserSettings() {
    const nameVal = document.getElementById("settings_username").value.trim();
    state.settings.username = toTitleCase(nameVal);
    
    const thresholdInput = document.getElementById("settings_warning_threshold");
    if (thresholdInput) {
        const thresholdVal = parseFloat(thresholdInput.value.trim().replace(",", "."));
        state.settings.warningThreshold = !isNaN(thresholdVal) ? thresholdVal : 150;
    }

    // --- Cochon & Pourboire Cochon ---
    // Ne lire le toggle QUE si la modale réglages est visible (évite d'écraser avec false)
    const settingsModal = document.getElementById('settings_modal');
    const isSettingsOpen = settingsModal && !settingsModal.classList.contains('hidden');
    const roundingToggle = document.getElementById('settings_rounding_toggle');
    if (roundingToggle && isSettingsOpen) {
        state.settings.isRoundingEnabled = roundingToggle.checked;
        const cochonFields = document.getElementById('cochon_settings_fields');
        if (cochonFields) cochonFields.classList.toggle('hidden', !roundingToggle.checked);
    }
    const ceilingInput = document.getElementById('settings_rounding_ceiling');
    if (ceilingInput) {
        const v = parseFloat(ceilingInput.value);
        state.settings.roundingCeiling = (!isNaN(v) && v >= 1 && v <= 10) ? v : 3.0;
    }
    const targetInput = document.getElementById('settings_cochon_target');
    if (targetInput) {
        const v = parseFloat(targetInput.value.replace(',', '.'));
        state.settings.cochonTarget = !isNaN(v) && v > 0 ? v : 60;
    }
    // Seuils cochon [0,20,50,100] — lus depuis les inputs
    // Cochon thresholds — supprimés
    // (plus de paliers visuels, la barre de progression suffit)
    
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
            
            window.hasUnsavedChanges = false;
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
            window.hasUnsavedChanges = false;
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
        window.hasUnsavedChanges = false;
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
                        state.cochon = 0;
                        state.settings = { 
                            username: "", 
                            genderTheme: "masculin", 
                            warningThreshold: 150,
                            cochonThresholds: [0, 20, 50, 100],
                            cochonTarget: 60,
                            roundingCeiling: 3.0,
                            isRoundingEnabled: true
                        };
                        
                        const now = new Date();
                        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                        const thresholdDay = daysInMonth - 10;
                        state.budgetMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                        
                        window.isFirstLaunchAndInTolerance = (now.getDate() >= thresholdDay);
                        
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








// --- INTERACTIVE TOUR LOGIC ---
let tourTrackingActive = false;
let tourAnimationId = null;
let currentTourStep = 0;

const tourSteps = [
    {
        elementId: "app_logo",
        title: "Bienvenue dans BudgetHMR 👋",
        message: "L'application affiche votre prénom directement dans le logo dès que vous le renseignez dans les réglages. Personnalisez-la à votre image !",
        placement: "bottom"
    },
    {
        elementId: "remaining_balance_disp",
        title: "Le Reste à Vivre 💰",
        message: "C'est l'indicateur central. Il change de couleur en temps réel : 🟢 Vert (budget sain), 🟠 Orange (vigilance), 🔴 Rouge (alerte). Il est calculé après déduction de tous vos frais fixes et dépenses.",
        placement: "bottom"
    },
    {
        elementId: "tour_recap_revenues",
        title: "La Carte Principale 💳",
        message: "Cette carte est votre tableau de bord instantané. En bas, trois chiffres clés : vos Revenus, vos Frais Fixes et vos Dépenses du mois. Tap sur l'un d'eux pour ouvrir son récapitulatif détaillé.",
        placement: "bottom"
    },
    {
        elementId: "tour_recap_expenses",
        title: "Récap Dépenses 📊",
        message: "Le récapitulatif des dépenses est un outil de consultation. Les dépenses y sont classées par date que vous avez déclarée — pas par date de saisie. Ainsi, une dépense datée du 1er juin apparaît toujours en bas, même si vous l'avez enregistrée le 20.",
        placement: "bottom"
    },
    {
        elementId: "tour_recap_charges",
        title: "Récaps Revenus & Frais Fixes 📋",
        message: "Les récapitulatifs Revenus et Frais Fixes sont purement consultatifs : ils vous donnent une vue détaillée de ce qui compose votre budget de base, ventilée poste par poste.",
        placement: "bottom"
    },
    {
        elementId: "tour_add_title",
        title: "Saisie Rapide ✏️",
        message: "Saisissez le libellé de votre dépense ici. L'application normalise automatiquement la ponctuation (virgule ou point acceptés). Pour enregistrer un remboursement, utilisez le bouton dédié dans le formulaire.",
        placement: "bottom"
    },
    {
        elementId: "tag_selector_container",
        title: "Tags Intelligents 🏷️",
        message: "Les deux premiers boutons de tag se mettent à jour automatiquement selon ce que vous tapez et votre historique. Plus vous utilisez l'app, plus les suggestions sont pertinentes ! Le troisième bouton ouvre la liste complète des tags.",
        placement: "bottom"
    },
    {
        elementId: "expense_date_label",
        title: "Date de la Dépense 📅",
        message: "Par défaut, la date du jour est utilisée. Tap sur ce bouton pour sélectionner une date différente dans le calendrier. La date choisie servira au classement dans le récapitulatif mensuel.",
        placement: "bottom"
    },
    {
        elementId: "installment_trigger_btn",
        title: "Paiement en Plusieurs Fois 🔢",
        message: "Ce bouton permet de fractionner une dépense en 2, 3, 4, 6, 10 ou 12 mensualités. Saisissez le montant total de l'achat — l'app calcule automatiquement la mensualité. Indiquez aussi le numéro de l'échéance actuelle si vous n'en êtes pas à la première. Chaque mois, l'app reporte automatiquement la suivante avec le bon numéro.",
        placement: "top"
    },
    {
        elementId: "tour_expenses_btn",
        title: "Opérations en Cours 🛒",
        message: "Tap sur cette carte pour ouvrir la liste de toutes vos dépenses du mois. Elles sont affichées dans l'ordre de saisie — contrairement au récap qui lui trie par date déclarée. Tap sur une opération pour la modifier ou la supprimer.",
        placement: "top"
    },
    {
        elementId: "revenues_container",
        title: "Revenus Mensuels 💵",
        message: "Gérez ici plusieurs sources de revenus récurrents. Le cumul forme votre budget de base du mois. Tap sur ➕ pour en ajouter, ou sur un revenu existant pour le modifier.",
        placement: "top"
    },
    {
        elementId: "fixed_charges_container",
        title: "Frais Fixes 📋",
        message: "Vos charges récurrentes (loyer, abonnements...) sont listées ici et déduites en priorité. Vous pouvez configurer des fréquences variées : mensuel, hebdomadaire, bimensuel, et bien plus. Tap sur une charge pour la modifier.",
        placement: "top"
    },
    {
        elementId: "tour_new_envelope",
        title: "Enveloppes Entre Amis 👥",
        message: "Créez une enveloppe de type « Entre Amis » pour gérer un pot commun avec d'autres personnes. Chacun peut rembourser sa part — en espèces ou par virement — et l'app suit l'avancement des remboursements en temps réel jusqu'à ce que l'enveloppe soit soldée.",
        placement: "top"
    },
    {
        elementId: "budgets_dashboard_content",
        title: "Enveloppes Budget 🎯",
        message: "Les enveloppes Budget sont personnelles : elles vous permettent de réserver une somme pour un projet précis (voyage, appareil électro...) et de suivre ce qu'il reste à dépenser sur ce projet, indépendamment de votre budget mensuel courant.",
        placement: "top"
    },
    {
        elementId: "btn_settings",
        title: "Tags Personnalisés 🏷️",
        message: "Dans les Réglages, vous trouverez le Gestionnaire de Tags. Créez vos propres catégories avec l'emoji de votre choix, désactivez les tags système qui ne vous sont pas utiles, ou désactivez des catégories entières en un tap !",
        placement: "left"
    },
    {
        elementId: "btn_settings",
        title: "Réglages & Données ⚙️",
        message: "Cet icône s'anime quand des changements non sauvegardés sont en attente. Depuis les réglages : changez votre prénom, importez ou exportez une sauvegarde JSON, certifiez les calculs de l'app, ou relancez ce guide à tout moment !",
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
                window.hasUnsavedChanges = false;
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





// Visual scroll lock mechanism for modals



// Recap Modal opening & rendering
function openRecapModal(category) {
    const modal = document.getElementById("recap_modal");
    const titleEl = document.getElementById("recap_modal_title");
    const contentEl = document.getElementById("recap_modal_content");
    
    let title = "";
    let html = "";
    
    const isDark = document.documentElement.classList.contains('dark');
    const ticketBg = isDark ? 'bg-[#1a1712] border-[#3d3929]' : 'bg-[#faf6ee] border-[#e8e0cc]';
    const ticketText = isDark ? 'text-[#d4c9a8]' : 'text-[#2a2315]';
    const sepColor = isDark ? 'text-[#4d4433]' : 'text-[#c8b99a]';
    const subText = isDark ? 'text-[#7a6e55]' : 'text-[#a89070]';
    const lineHover = isDark ? 'hover:bg-[#2a2618]' : 'hover:bg-[#f0e8d8]';

    const makeSep = (char = '─') => `<div class="font-mono text-[10px] ${sepColor} tracking-tighter overflow-hidden whitespace-nowrap select-none">${char.repeat(36)}</div>`;
    const makeRow = (left, right, rightClass = '') => `
        <div class="${lineHover} flex justify-between items-baseline px-1 py-0.5 rounded transition-colors">
            <span class="font-mono text-[11px] ${ticketText} truncate max-w-[60%]">${left}</span>
            <span class="font-mono font-black text-[11px] ${rightClass || ticketText} tabular-nums">${right}</span>
        </div>`;

    if (category === "revenues") {
        title = "💰 REVENUS";
        const total = state.revenues.reduce((s, r) => s + r.amount, 0);
        let rows = state.revenues.map(r => makeRow(r.title.toUpperCase(), `+ ${formatCurrency(r.amount)}`, 'text-emerald-600 dark:text-emerald-400')).join('');
        if (!rows) rows = `<div class="text-center py-4 font-mono text-[11px] ${subText}">-- AUCUN REVENU --</div>`;
        html = `
            <div class="rounded-2xl border ${ticketBg} overflow-hidden">
                <div class="px-4 pt-4 pb-2 text-center border-b border-dashed ${isDark ? 'border-[#4d4433]' : 'border-[#c8b99a]'}">
                    <div class="font-mono font-black text-[13px] ${ticketText} uppercase tracking-widest mb-0.5">BUDGETHMR</div>
                    <div class="font-mono text-[9px] ${subText} uppercase tracking-widest">Récapitulatif — Revenus</div>
                    <div class="font-mono text-[9px] ${subText} mt-0.5">${new Date().toLocaleDateString('fr-FR', {day:'2-digit',month:'long',year:'numeric'})}</div>
                </div>
                <div class="px-4 py-3 space-y-0.5">
                    ${makeSep('·')}
                    <div class="font-mono text-[9px] ${subText} uppercase tracking-widest px-1 py-1">Libellé · · · · · · · Montant</div>
                    ${makeSep('·')}
                    ${rows}
                    ${makeSep('─')}
                    <div class="flex justify-between items-baseline px-1 py-1">
                        <span class="font-mono font-black text-[11px] ${ticketText} uppercase tracking-wider">TOTAL REVENUS</span>
                        <span class="font-mono font-black text-[13px] text-emerald-600 dark:text-emerald-400 tabular-nums">+ ${formatCurrency(total)}</span>
                    </div>
                    ${makeSep('=')}
                </div>
                <div class="px-4 pb-3 text-center">
                    <div class="font-mono text-[8px] ${subText} uppercase tracking-widest">*** Merci et bonne gestion ***</div>
                </div>
            </div>`;
    } else if (category === "fixedCharges") {
        title = "⚙️ FRAIS FIXES";
        const total = state.fixedCharges.reduce((s, c) => s + getEffectiveChargeAmount(c), 0);
        let rows = state.fixedCharges.map(c => {
            const eff = getEffectiveChargeAmount(c);
            const p = c.periodicity || { type: 'monthly' };
            let badge = '';
            if (p.type === 'weekly') {
                const [yr2, mo2] = state.budgetMonth.split('-').map(Number);
                const n = countDayOccurrences(p.dayOfWeek, yr2, mo2 - 1);
                badge = ` ×${n}`;
            } else if (p.type === 'specific_months') {
                const [, mo2] = state.budgetMonth.split('-').map(Number);
                const active = Array.isArray(p.months) && p.months.includes(mo2 - 1);
                badge = active ? '' : ' (inactif)';
            }
            const dimmed = eff === 0 ? 'opacity-50' : '';
            return `<div class="flex justify-between items-baseline px-1 py-0.5 ${dimmed}">
                        <span class="font-mono text-[11px] ${ticketText} truncate max-w-[55%]">${c.title.toUpperCase()}${badge}</span>
                        <span class="font-mono font-black text-[11px] text-red-500 dark:text-red-400 tabular-nums">- ${formatCurrency(eff)}</span>
                    </div>`;
        }).join('');
        if (!rows) rows = `<div class="text-center py-4 font-mono text-[11px] ${subText}">-- AUCUN FRAIS FIXE --</div>`;
        html = `
            <div class="rounded-2xl border ${ticketBg} overflow-hidden">
                <div class="px-4 pt-4 pb-2 text-center border-b border-dashed ${isDark ? 'border-[#4d4433]' : 'border-[#c8b99a]'}">
                    <div class="font-mono font-black text-[13px] ${ticketText} uppercase tracking-widest mb-0.5">BUDGETHMR</div>
                    <div class="font-mono text-[9px] ${subText} uppercase tracking-widest">Récapitulatif — Frais Fixes</div>
                    <div class="font-mono text-[9px] ${subText} mt-0.5">${new Date().toLocaleDateString('fr-FR', {day:'2-digit',month:'long',year:'numeric'})}</div>
                </div>
                <div class="px-4 py-3 space-y-0.5">
                    ${makeSep('·')}
                    <div class="font-mono text-[9px] ${subText} uppercase tracking-widest px-1 py-1">Libellé · · · · · · · Montant effectif</div>
                    ${makeSep('·')}
                    ${rows}
                    ${makeSep('─')}
                    <div class="flex justify-between items-baseline px-1 py-1">
                        <span class="font-mono font-black text-[11px] ${ticketText} uppercase tracking-wider">TOTAL CHARGES</span>
                        <span class="font-mono font-black text-[13px] text-red-500 dark:text-red-400 tabular-nums">- ${formatCurrency(total)}</span>
                    </div>
                    ${makeSep('=')}
                </div>
                <div class="px-4 pb-3 text-center">
                    <div class="font-mono text-[8px] ${subText} uppercase tracking-widest">*** Merci et bonne gestion ***</div>
                </div>
            </div>`;
    } else if (category === "expenses") {
        title = "💸 DÉPENSES EN COURS";
        
        // Group expenses by date key
        const groups = {};
        state.expenses.forEach(e => {
            const key = e.date || "Sans date";
            if (!groups[key]) groups[key] = [];
            groups[key].push(e);
        });
        
        // Sort keys reverse chronologically
        const MOIS_FR = {
            'janvier':0,'février':1,'fevrier':1,'mars':2,'avril':3,'mai':4,'juin':5,
            'juillet':6,'août':7,'aout':7,'septembre':8,'octobre':9,'novembre':10,'décembre':11,'decembre':11
        };
        const getTimestamp = (str) => {
            if (!str || str === "Sans date") return 0;
            // Format ISO : YYYY-MM-DD ou YYYY-M-D
            const isoMatch = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
            if (isoMatch) {
                return new Date(parseInt(isoMatch[1],10), parseInt(isoMatch[2],10)-1, parseInt(isoMatch[3],10)).getTime();
            }
            // Format français : "7 juin", "12 mars", etc.
            const frMatch = str.toLowerCase().trim().match(/^(\d{1,2})\s+([a-zéûôèàâùîœ]+)/);
            if (frMatch) {
                const day   = parseInt(frMatch[1], 10);
                const month = MOIS_FR[frMatch[2]];
                if (month !== undefined) {
                    const [yr] = state.budgetMonth.split('-').map(Number);
                    return new Date(yr, month, day).getTime();
                }
            }
            // Dernier recours : Date.parse
            const t = Date.parse(str);
            return isNaN(t) ? 0 : t;
        };
        const sortedKeys = Object.keys(groups).sort((a, b) => getTimestamp(b) - getTimestamp(a));
        
        let bodyHTML = '';
        sortedKeys.forEach(key => {
            const exps = groups[key];
            let dateLong = key;
            let isNegative = false;
            
            if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
                const [year, month, day] = key.split("-").map(Number);
                const dateObj = new Date(year, month - 1, day);
                const [bYear, bMonth] = state.budgetMonth.split("-").map(Number);
                const utcBudget = Date.UTC(bYear, bMonth - 1, 1);
                const utcExpense = Date.UTC(year, month - 1, day);
                const diffDays = Math.round((utcExpense - utcBudget) / (1000 * 60 * 60 * 24));
                if (diffDays < 0) {
                    dateLong = `ANTICIPÉ — ${dateObj.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }).toUpperCase()}`;
                    isNegative = true;
                } else {
                    dateLong = dateObj.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }).toUpperCase();
                }
            }
            
            bodyHTML += `<div class="font-mono text-[9px] ${isNegative ? 'text-amber-500' : subText} uppercase tracking-widest px-1 pt-2 pb-0.5">— ${dateLong} —</div>`;
            exps.forEach(e => {
                const isRefund = e.amount < 0;
                const absAmt = Math.abs(e.amount);
                const amtColor = isRefund ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400';
                const amtSign = isRefund ? '+' : '-';
                const instSuffix = (e.installment && e.installment.total > 1)
                    ? ` <span style="font-size:9px;opacity:0.55">${e.installment.current}/${e.installment.total}</span>`
                    : '';
                let subLinesHTML = '';
                if (e.piocheCochon && e.piocheCochon > 0) {
                    subLinesHTML = `
                        <div class="flex justify-between items-baseline px-1 py-0.5 opacity-60 pl-4 -mt-0.5 select-none">
                            <span class="font-mono text-[9px] ${subText} italic">   PART COCHON</span>
                            <span class="font-mono font-semibold text-[9px] ${subText} tabular-nums">${formatCurrency(e.piocheCochon)}</span>
                        </div>`;
                } else if (e.roundingDelta && e.roundingDelta > 0) {
                    subLinesHTML = `
                        <div class="flex justify-between items-baseline px-1 py-0.5 opacity-60 pl-4 -mt-0.5 select-none">
                            <span class="font-mono text-[9px] ${subText} italic">   POURBOIRE COCHON</span>
                            <span class="font-mono font-semibold text-[9px] ${subText} tabular-nums">+${formatCurrency(e.roundingDelta)}</span>
                        </div>`;
                }
                bodyHTML += `
                    <div class="${lineHover} flex justify-between items-baseline px-1 py-0.5 rounded transition-colors">
                        <span class="font-mono text-[11px] ${ticketText} truncate max-w-[60%]">${e.title.toUpperCase()}${instSuffix}</span>
                        <span class="font-mono font-black text-[11px] ${amtColor} tabular-nums">${amtSign} ${formatCurrency(absAmt)}</span>
                    </div>${subLinesHTML}`;
            });
        });
        
        if (state.expenses.length === 0) {
            bodyHTML = `<div class="text-center py-4 font-mono text-[11px] ${subText}">-- AUCUNE DÉPENSE --</div>`;
        }

        const totalDep = state.expenses.filter(e => e.amount > 0).reduce((s, e) => s + e.amount, 0);
        const totalRef = state.expenses.filter(e => e.amount < 0).reduce((s, e) => s + Math.abs(e.amount), 0);

        // Tag totals block
        let tagBlock = '';
        if (state.expenses.length > 0) {
            const tagTotals = {};
            state.expenses.forEach(e => {
                if (e.isCashDepositPending && !e.isDeposited) return;
                const tagKey = e.tag || 'divers';
                if (!tagTotals[tagKey]) tagTotals[tagKey] = 0;
                tagTotals[tagKey] += e.amount;
            });
            const hasTags = Object.values(tagTotals).some(v => v !== 0);
            if (hasTags) {
                tagBlock = `
                    <div class="font-mono text-[9px] ${subText} uppercase tracking-widest px-1 py-1">Par catégorie</div>
                    <div class="grid grid-cols-2 gap-1 mb-1">
                        ${Object.keys(tagTotals).sort((a,b) => tagTotals[b]-tagTotals[a]).filter(k => tagTotals[k] !== 0).map(key => {
                            const td = EXPENSE_TAGS[key] || EXPENSE_TAGS['divers'];
                            return `<div class="flex items-center justify-between gap-1.5 overflow-hidden ${isDark ? 'bg-[#2a2618]' : 'bg-[#f0e8d8]'} px-2 py-1 rounded-lg border ${isDark ? 'border-[#4d4433]' : 'border-[#d8cdb0]'}">
                                <span class="font-mono text-[9px] ${subText} uppercase truncate min-w-0">${td.icon} ${td.label}</span>
                                <span class="font-mono font-black text-[10px] ${ticketText} shrink-0 ml-1">${formatCurrency(tagTotals[key])}</span>
                            </div>`;
                        }).join('')}
                    </div>
                    ${makeSep('─')}`;
            }
        }

        html = `
            <div class="rounded-2xl border ${ticketBg} overflow-hidden">
                <div class="px-4 pt-4 pb-2 text-center border-b border-dashed ${isDark ? 'border-[#4d4433]' : 'border-[#c8b99a]'}">
                    <div class="font-mono font-black text-[13px] ${ticketText} uppercase tracking-widest mb-0.5">BUDGETHMR</div>
                    <div class="font-mono text-[9px] ${subText} uppercase tracking-widest">Récapitulatif — Dépenses</div>
                    <div class="font-mono text-[9px] ${subText} mt-0.5">${new Date().toLocaleDateString('fr-FR', {day:'2-digit',month:'long',year:'numeric'})}</div>
                </div>
                <div class="px-4 py-3 space-y-0.5">
                    ${tagBlock}
                    ${makeSep('·')}
                    <div class="font-mono text-[9px] ${subText} uppercase tracking-widest px-1 py-1">Libellé · · · · · · · Montant</div>
                    ${makeSep('·')}
                    ${bodyHTML}
                    ${makeSep('─')}
                    <div class="flex justify-between items-baseline px-1 py-0.5">
                        <span class="font-mono text-[10px] ${subText} uppercase">DÉPENSES</span>
                        <span class="font-mono font-black text-[11px] text-red-500 dark:text-red-400 tabular-nums">- ${formatCurrency(totalDep)}</span>
                    </div>
                    ${totalRef > 0 ? `<div class="flex justify-between items-baseline px-1 py-0.5">
                        <span class="font-mono text-[10px] ${subText} uppercase">REMBOURSEMENTS</span>
                        <span class="font-mono font-black text-[11px] text-emerald-600 dark:text-emerald-400 tabular-nums">+ ${formatCurrency(totalRef)}</span>
                    </div>` : ''}
                    ${makeSep('=')}
                    <div class="flex justify-between items-baseline px-1 py-1">
                        <span class="font-mono font-black text-[11px] ${ticketText} uppercase tracking-wider">NET DÉPENSES</span>
                        <span class="font-mono font-black text-[13px] text-red-500 dark:text-red-400 tabular-nums">- ${formatCurrency(Math.max(0, totalDep - totalRef))}</span>
                    </div>
                    ${makeSep('=')}
                </div>
                <div class="px-4 pb-3 text-center">
                    <div class="font-mono text-[8px] ${subText} uppercase tracking-widest">*** Merci et bonne gestion ***</div>
                </div>
            </div>`;
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
        const cellDate = new Date(calendarYear, calendarMonth, day);
        const isToday = today.getDate() === day && today.getMonth() === calendarMonth && today.getFullYear() === calendarYear;
        const isSelected = calendarSelectedDate.getDate() === day && calendarSelectedDate.getMonth() === calendarMonth && calendarSelectedDate.getFullYear() === calendarYear;
        const isFuture = cellDate > today && day !== 1;
        
        cell.textContent = day;
        
        if (isFuture) {
            cell.className = "h-8 w-8 flex items-center justify-center rounded-full mx-auto font-semibold text-xs text-stone-300 dark:text-stone-700 opacity-40 cursor-not-allowed pointer-events-none";
        } else {
            cell.className = "h-8 w-8 flex items-center justify-center rounded-full cursor-pointer transition-colors mx-auto font-semibold text-xs";
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
        }
        
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
    if (window.generateBudgetPDF && window.generateBudgetPDF !== generateBudgetPDF) {
        return window.generateBudgetPDF();
    }
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
                    if (e.piocheCochon && e.piocheCochon > 0) {
                        pdfTx += padLine(`     Pioche cochon`, `${e.piocheCochon.toFixed(2).replace('.', ',')} €`) + "\n";
                    } else if (e.roundingDelta && e.roundingDelta > 0) {
                        pdfTx += padLine(`     Pourboire cochon`, `+${e.roundingDelta.toFixed(2).replace('.', ',')} €`) + "\n";
                    }
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
            if (op.piocheCochon && op.piocheCochon > 0) {
                receiptTx += padLine(`     Pioche cochon`, `${op.piocheCochon.toFixed(2).replace('.', ',')} €`) + "\n";
            } else if (op.roundingDelta && op.roundingDelta > 0) {
                receiptTx += padLine(`     Pourboire cochon`, `+${op.roundingDelta.toFixed(2).replace('.', ',')} €`) + "\n";
            }
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
function switchDashboardTab(tab, bypassHaptic = false) {
    activeTab = tab;
    if (!bypassHaptic) triggerHaptic(10);
    
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
    if (window.autoCloseAllBudgets && window.autoCloseAllBudgets !== autoCloseAllBudgets) {
        return window.autoCloseAllBudgets();
    }
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
const BUDGET_HMR_VERSION = "4.0.0";

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

function closeVersionUpdateModal(skipOnboardingClose = false) {
    const modal = document.getElementById("version_update_modal");
    if (!modal) return;
    modal.classList.add("opacity-0");
    modal.querySelector(".glass-card").classList.add("scale-95");
    setTimeout(() => {
        modal.classList.add("hidden");
        if (!skipOnboardingClose) {
            handleOnboardingOrUpdateClose();
        }
    }, 300);
}

function acceptVersionUpdateCertify() {
    closeVersionUpdateModal(true);
    openCertification();
}

// --- INTERACTIVE GUIDE SLIDER ---
let currentGuideSlideIndex = 0;
const totalGuideSlides = 8; // +1 pour le slide Cochon

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
        window.isFirstLaunchAndInTolerance = false;
        
        const now = new Date();
        const currentMonthName = formatYearMonthFrench(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
        const nextMonthName = formatYearMonthFrench(getNextMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`));
        
        showGenericConfirm(
            "Bienvenue !",
            `Nous sommes en fin de mois (période de tolérance). Souhaitez-vous démarrer la gestion de vos comptes sur le mois en cours (<strong>${currentMonthName}</strong>) ou directement sur le mois prochain (<strong>${nextMonthName}</strong>) ?`,
            "📅",
            // Confirm callback (Mois en cours)
            () => {
                triggerHaptic('success');
            },
            // Cancel callback (Mois prochain)
            () => {
                const n = new Date();
                state.budgetMonth = getNextMonth(`${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`);
                saveState();
                
                const newMonthLabel = formatYearMonthFrench(state.budgetMonth);
                document.getElementById("current_date_label").innerText = newMonthLabel;
                updateUI();
                
                triggerHaptic('success');
            },
            "Mois en cours",
            "Mois prochain",
            false,
            true
        );
    }
}

// --- CERTIFICATION SYSTEM (TEST RUNNER) ---
let isTestingRunning = false;

function openCertification() {
    // Nombre total de tests = longueur du tableau dans runCertificationTests (13 actuellement)
    const TOTAL_TESTS = 13;
    for (let i = 0; i < TOTAL_TESTS; i++) {
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
        { name: "Garde-fous de date", fn: testPeriodSecurity },
        { name: "Périodicité des frais", fn: testPeriodicityCalculations },
        { name: "Paiements fractionnés", fn: testInstallmentPayments },
        { name: "Cas limites fractionnés", fn: testInstallmentEdgeCases },
        { name: "Montants d'échéances personnalisés", fn: testInstallmentCustomAmounts },
        { name: "Pourboire intelligent cochon",          fn: testSmartRounding },
        { name: "Dépôt, retrait & remboursement cochon", fn: testCochonLogic },
        { name: "Export PDF & flux fin de mois",        fn: testPdfExportFlow }
    ];
    
    function runNext() {
        if (currentTestIndex >= tests.length) {
            window.state = originalState;
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
                
                window.state = originalState;
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

function testPeriodicityCalculations() {
    // Sauvegarde du mois courant
    const savedMonth = state.budgetMonth;

    // === TEST 1 : Mode mensuel — comportement inchangé ===
    state.budgetMonth = "2026-06";
    state.fixedCharges = [
        { id: "c1", title: "Loyer", amount: 800, periodicity: { type: 'monthly' } }
    ];
    state.revenues = [{ id: "r1", title: "Salaire", amount: 2000 }];
    state.expenses = [];
    let totals = calculateTotals();
    if (totals.totalFixed !== 800) throw new Error(`Mensuel: totalFixed attendu 800, obtenu ${totals.totalFixed}`);
    if (totals.remaining !== 1200) throw new Error(`Mensuel: remaining attendu 1200, obtenu ${totals.remaining}`);

    // === TEST 2 : Mode hebdomadaire — juin 2026 ===
    // Juin 2026 : lundis = 1, 8, 15, 22, 29 → 5 lundis
    state.budgetMonth = "2026-06";
    const lundisJuin = countDayOccurrences(1, 2026, 5); // 5 = juin (0-indexed)
    if (lundisJuin !== 5) throw new Error(`Comptage lundis juin 2026: attendu 5, obtenu ${lundisJuin}`);

    state.fixedCharges = [
        { id: "c1", title: "Coach", amount: 60, periodicity: { type: 'weekly', dayOfWeek: 1 } }
    ];
    totals = calculateTotals();
    const expectedWeekly = 60 * lundisJuin;
    if (totals.totalFixed !== expectedWeekly) throw new Error(`Hebdo: totalFixed attendu ${expectedWeekly}, obtenu ${totals.totalFixed}`);

    // === TEST 3 : Mode hebdomadaire — juillet 2026 ===
    // Juillet 2026 : lundis = 6, 13, 20, 27 → 4 lundis
    state.budgetMonth = "2026-07";
    const lundisJuillet = countDayOccurrences(1, 2026, 6); // 6 = juillet (0-indexed)
    if (lundisJuillet !== 4) throw new Error(`Comptage lundis juillet 2026: attendu 4, obtenu ${lundisJuillet}`);

    state.fixedCharges = [
        { id: "c1", title: "Coach", amount: 60, periodicity: { type: 'weekly', dayOfWeek: 1 } }
    ];
    totals = calculateTotals();
    if (totals.totalFixed !== 240) throw new Error(`Hebdo juillet: totalFixed attendu 240, obtenu ${totals.totalFixed}`);

    // === TEST 4 : Mois spécifiques — actif ===
    state.budgetMonth = "2026-04"; // Avril = index 3
    state.fixedCharges = [
        { id: "c1", title: "Assurance auto", amount: 180, periodicity: { type: 'specific_months', months: [3, 6, 9] } }
    ];
    totals = calculateTotals();
    if (totals.totalFixed !== 180) throw new Error(`Mois spéc. actif: totalFixed attendu 180, obtenu ${totals.totalFixed}`);

    // === TEST 5 : Mois spécifiques — inactif ===
    state.budgetMonth = "2026-05"; // Mai = index 4, pas dans [3,6,9]
    totals = calculateTotals();
    if (totals.totalFixed !== 0) throw new Error(`Mois spéc. inactif: totalFixed attendu 0, obtenu ${totals.totalFixed}`);

    // === TEST 6 : Mix mensuel + hebdo + inactif ===
    state.budgetMonth = "2026-06";
    state.revenues = [{ id: "r1", title: "Salaire", amount: 3000 }];
    state.fixedCharges = [
        { id: "c1", title: "Loyer", amount: 900, periodicity: { type: 'monthly' } },
        { id: "c2", title: "Coach", amount: 50, periodicity: { type: 'weekly', dayOfWeek: 1 } }, // 5 lundis = 250
        { id: "c3", title: "Assurance", amount: 200, periodicity: { type: 'specific_months', months: [0, 6] } } // inactif en juin
    ];
    state.expenses = [];
    totals = calculateTotals();
    // Attendu: 900 + 50*5 + 0 = 1150
    if (totals.totalFixed !== 1150) throw new Error(`Mix: totalFixed attendu 1150, obtenu ${totals.totalFixed}`);
    if (totals.remaining !== 1850) throw new Error(`Mix: remaining attendu 1850, obtenu ${totals.remaining}`);

    // Restaurer le mois original
    state.budgetMonth = savedMonth;
    return true;
}

// ============================================================
// --- TEST : PAIEMENTS EN PLUSIEURS FOIS ---
// ============================================================

function testInstallmentPayments() {
    state.budgetMonth = "2026-06";
    state.revenues    = [{ id: "r1", title: "Salaire", amount: 2000 }];
    state.fixedCharges = [];
    state.expenses    = [];

    // === 1. Création d'un paiement 4× à partir de l'échéance 1 ===
    const groupId = "test_inst_group_1";
    const baseExpense = {
        id:     "inst_1",
        title:  "Samsung Galaxy",
        amount: 50,
        date:   "2026-06-10",
        tag:    "divers",
        installment: { groupId, current: 1, total: 4 }
    };
    state.expenses.push(baseExpense);

    // Vérifier la présence et le badge
    const found = state.expenses.find(e => e.id === "inst_1");
    if (!found)                                throw new Error("Dépense installment non créée");
    if (!found.installment)                    throw new Error("Métadonnée installment absente");
    if (found.installment.current !== 1)       throw new Error("current doit être 1");
    if (found.installment.total !== 4)         throw new Error("total doit être 4");
    if (found.installment.groupId !== groupId) throw new Error("groupId incorrect");

    // === 2. Calcul du reste à vivre (1 échéance de 50 €) ===
    let totals = calculateTotals();
    if (totals.totalExpenses !== 50)  throw new Error(`totalExpenses attendu 50, obtenu ${totals.totalExpenses}`);
    if (totals.remaining !== 1950)    throw new Error(`remaining attendu 1950, obtenu ${totals.remaining}`);

    // === 3. Simulation du report automatique au mois suivant ===
    // (logique de finalizeRenewal : copier les installments avec current < total)
    const carriedInstallments = state.expenses
        .filter(e => e.installment && e.installment.current < e.installment.total)
        .map(e => ({
            ...e,
            id:   `${e.id}_carried`,
            date: "2026-07-01",
            installment: { ...e.installment, current: e.installment.current + 1 }
        }));

    state.budgetMonth = "2026-07";
    state.expenses    = [];
    carriedInstallments.forEach(e => state.expenses.push(e));

    if (state.expenses.length !== 1) throw new Error(`Report: attendu 1 dépense, obtenu ${state.expenses.length}`);
    const carried = state.expenses[0];
    if (carried.installment.current !== 2) throw new Error(`Report: current attendu 2, obtenu ${carried.installment.current}`);
    if (carried.installment.total !== 4)   throw new Error(`Report: total attendu 4, obtenu ${carried.installment.total}`);
    if (carried.amount !== 50)             throw new Error(`Report: montant attendu 50, obtenu ${carried.amount}`);

    // === 4. Suppression en cascade (toutes les échéances current >= instCur) ===
    // On simule: on est à l'échéance 2, on supprime → 2, 3, 4 supprimées
    // D'abord, simuler les échéances 2, 3, 4 dans state
    state.expenses = [
        { id: "inst_2", title: "Samsung Galaxy", amount: 50, date: "2026-07-01", tag: "divers", installment: { groupId, current: 2, total: 4 } },
        { id: "inst_3", title: "Samsung Galaxy", amount: 50, date: "2026-08-01", tag: "divers", installment: { groupId, current: 3, total: 4 } },
        { id: "inst_4", title: "Samsung Galaxy", amount: 50, date: "2026-09-01", tag: "divers", installment: { groupId, current: 4, total: 4 } }
    ];
    const instCurToDelete = 2;
    state.expenses = state.expenses.filter(e =>
        !(e.installment && e.installment.groupId === groupId && e.installment.current >= instCurToDelete)
    );
    if (state.expenses.length !== 0) throw new Error(`Suppression cascade: attendu 0 restant, obtenu ${state.expenses.length}`);

    // === 5. Remboursement anticipé (consolidation) ===
    // Simuler: on est à l'échéance 2/4, on consolide → 3 échéances × 50 = 150 €
    const instExpense = { id: "inst_cur", title: "Samsung Galaxy", amount: 50, date: "2026-07-01", tag: "divers",
        installment: { groupId: "test_inst_group_2", current: 2, total: 4 } };
    state.expenses = [
        instExpense,
        { id: "inst_f3", title: "Samsung Galaxy", amount: 50, date: "2026-08-01", tag: "divers", installment: { groupId: "test_inst_group_2", current: 3, total: 4 } },
        { id: "inst_f4", title: "Samsung Galaxy", amount: 50, date: "2026-09-01", tag: "divers", installment: { groupId: "test_inst_group_2", current: 4, total: 4 } }
    ];
    const perMonth   = Math.abs(instExpense.amount);
    const remaining  = instExpense.installment.total - instExpense.installment.current + 1; // 3
    const totalDue   = perMonth * remaining; // 150
    if (remaining !== 3)    throw new Error(`Remb. anticipé: remaining attendu 3, obtenu ${remaining}`);
    if (totalDue !== 150)   throw new Error(`Remb. anticipé: totalDue attendu 150, obtenu ${totalDue}`);

    // Supprimer toutes les échéances current >= 2 et créer une dépense unique
    const gId2 = instExpense.installment.groupId;
    state.expenses = state.expenses.filter(e =>
        !(e.installment && e.installment.groupId === gId2 && e.installment.current >= instExpense.installment.current)
    );
    const repaid = { id: "repaid_1", title: instExpense.title, amount: totalDue, date: instExpense.date, tag: instExpense.tag };
    state.expenses.push(repaid);

    if (state.expenses.length !== 1)       throw new Error(`Remb. anticipé: attendu 1 dépense après consolidation, obtenu ${state.expenses.length}`);
    if (state.expenses[0].amount !== 150)  throw new Error(`Remb. anticipé: montant consolidé attendu 150, obtenu ${state.expenses[0].amount}`);
    if (state.expenses[0].installment)     throw new Error("Remb. anticipé: la dépense consolidée ne doit pas avoir de métadonnée installment");

    return true;
}

function testInstallmentEdgeCases() {
    state.budgetMonth  = "2026-06";
    state.revenues     = [{ id: "r1", title: "Salaire", amount: 3000 }];
    state.fixedCharges = [];
    state.expenses     = [];

    // === 1. Départ à N°3 sur 6 (paiement en cours depuis 2 mois) ===
    const groupId = "test_edge_group";
    state.expenses = [
        { id: "e_3", title: "PayPal 6x", amount: 100, date: "2026-06-15", tag: "divers",
          installment: { groupId, current: 3, total: 6 } }
    ];

    const e3 = state.expenses[0];
    if (e3.installment.current !== 3) throw new Error("Départ N°3 : current incorrect");
    if (e3.installment.total !== 6)   throw new Error("Départ N°3 : total incorrect");

    // Reste à payer : 6 - 3 + 1 = 4 échéances × 100 = 400 €
    const remainingFromN3 = e3.installment.total - e3.installment.current + 1;
    if (remainingFromN3 !== 4) throw new Error(`Reste depuis N°3 : attendu 4, obtenu ${remainingFromN3}`);

    // === 2. Report successif jusqu'à la dernière échéance ===
    // Simuler les reports de N°3 à N°6
    let mockExpense = { ...e3 };
    const reportTrace = [3];
    while (mockExpense.installment.current < mockExpense.installment.total) {
        mockExpense = { ...mockExpense, installment: { ...mockExpense.installment, current: mockExpense.installment.current + 1 } };
        reportTrace.push(mockExpense.installment.current);
    }
    if (reportTrace.length !== 4) throw new Error(`Report successif: attendu 4 étapes, obtenu ${reportTrace.length}`);
    if (mockExpense.installment.current !== 6) throw new Error(`Fin de report: current final attendu 6, obtenu ${mockExpense.installment.current}`);

    // === 3. À la dernière échéance, le report ne doit PAS être généré ===
    const lastExpense = { ...e3, installment: { ...e3.installment, current: 6 } };
    const shouldCarry = lastExpense.installment.current < lastExpense.installment.total;
    if (shouldCarry) throw new Error("Dernière échéance : ne doit pas être reportée");

    // === 4. Total cohérent sur 6× 100 = 600 € ===
    const fullTotal = e3.amount * e3.installment.total;
    if (fullTotal !== 600) throw new Error(`Total 6× 100 : attendu 600, obtenu ${fullTotal}`);

    // === 5. Vérification que le calcul du reste à vivre n'inclut que l'échéance courante ===
    // (pas le total du groupe — chaque mois ne débite que sa propre échéance)
    state.budgetMonth = "2026-06";
    state.expenses    = [
        { id: "e_cur", title: "PayPal 6x", amount: 100, date: "2026-06-15", tag: "divers",
          installment: { groupId, current: 3, total: 6 } }
    ];
    const totals = calculateTotals();
    if (totals.totalExpenses !== 100) throw new Error(`RAV: seule l'échéance courante compte (100), obtenu ${totals.totalExpenses}`);
    if (totals.remaining !== 2900)    throw new Error(`RAV: remaining attendu 2900, obtenu ${totals.remaining}`);

    return true;
}

function testInstallmentCustomAmounts() {
    // Simule la logique de modification de montants par échéance (sans DOM)
    const totalAmount = 200;
    const n = 4;

    // 1. Initialisation égale : 4 × 50 €
    const mensualite = Math.round((totalAmount / n) * 100) / 100;
    let amounts = Array.from({ length: n }, () => mensualite);
    const diff = Math.round((totalAmount - mensualite * n) * 100) / 100;
    if (diff !== 0) amounts[n - 1] = Math.round((amounts[n - 1] + diff) * 100) / 100;

    if (amounts.length !== 4)  throw new Error("Init : longueur attendue 4");
    if (amounts[0] !== 50)     throw new Error(`Init : éch.1 attendu 50, obtenu ${amounts[0]}`);
    if (amounts[3] !== 50)     throw new Error(`Init : éch.4 attendu 50, obtenu ${amounts[3]}`);
    const sumInit = Math.round(amounts.reduce((s, a) => s + a, 0) * 100) / 100;
    if (sumInit !== 200)       throw new Error(`Init : total attendu 200, obtenu ${sumInit}`);

    // 2. Modification éch.1 → 60 € : les suivantes recalculées sur 140 ÷ 3
    const newFirst = 60;
    const rem140 = Math.max(0, totalAmount - newFirst);
    const perOther = Math.round((rem140 / (n - 1)) * 100) / 100; // 46.67
    amounts[0] = newFirst;
    for (let i = 1; i < n; i++) amounts[i] = perOther;
    const adjDiff = Math.round((rem140 - perOther * (n - 1)) * 100) / 100;
    if (adjDiff !== 0) amounts[n - 1] = Math.round((amounts[n - 1] + adjDiff) * 100) / 100;

    if (amounts[0] !== 60)     throw new Error(`Modif éch.1 : attendu 60, obtenu ${amounts[0]}`);
    if (amounts[1] !== 46.67)  throw new Error(`Modif éch.1 : éch.2 attendu 46.67, obtenu ${amounts[1]}`);
    if (amounts[2] !== 46.67)  throw new Error(`Modif éch.1 : éch.3 attendu 46.67, obtenu ${amounts[2]}`);
    const expectedLast = Math.round((perOther + adjDiff) * 100) / 100; // 46.66
    if (amounts[3] !== expectedLast) throw new Error(`Modif éch.1 : éch.4 attendu ${expectedLast}, obtenu ${amounts[3]}`);
    const sumAfter = Math.round(amounts.reduce((s, a) => s + a, 0) * 100) / 100;
    if (sumAfter !== 200) throw new Error(`Modif éch.1 : total doit rester 200, obtenu ${sumAfter}`);

    // 3. Modification libre éch.2 → 55 € (pas de recalcul des autres)
    amounts[1] = 55;
    if (amounts[0] !== 60)    throw new Error("Modif libre : éch.1 ne doit pas changer");
    if (amounts[2] !== 46.67) throw new Error("Modif libre : éch.3 ne doit pas changer");
    const sumFree = Math.round(amounts.reduce((s, a) => s + a, 0) * 100) / 100;
    if (sumFree === 200) throw new Error("Modif libre éch.2 : le total ne devrait plus être 200");

    // 4. Montant enregistré = montant de l'échéance courante
    if (amounts[0] !== 60) throw new Error(`Enregistrement éch.1 : attendu 60, obtenu ${amounts[0]}`);
    if (amounts[1] !== 55) throw new Error(`Enregistrement éch.2 : attendu 55, obtenu ${amounts[1]}`);

    // 5. Report : l'échéance 3 porte son montant propre
    if (amounts[2] !== 46.67) throw new Error(`Report éch.3 : attendu 46.67, obtenu ${amounts[2]}`);

    return true;
}

// --- TESTS COCHON ---

/**
 * Test 11 : Pourboire Cochon - vérifie que calculateSmartRounding
 * sélectionne TOUJOURS le palier le plus élevé acceptable sous le plafond %.
 */
function testSmartRounding() {
    // Sauvegarde temporaire des settings
    const savedEnabled  = state.settings.isRoundingEnabled;
    const savedCeiling  = state.settings.roundingCeiling;
    state.settings.isRoundingEnabled = true;

    function sim(amount, ceiling) {
        state.settings.roundingCeiling = ceiling;
        return calculateSmartRounding(amount);
    }

    // 1. 12,50 € à 3% -> pourboire de 0,38 € (12,50 * 0,03 = 0,375 -> arrondi à 0,38), total 12,88 €
    const r1 = sim(12.50, 3);
    if (!r1) throw new Error("12,50€ @3% : aucun pourboire cochon retourné");
    if (r1.roundedAmount !== 12.88) throw new Error(`12,50€ @3% : attendu 12,88, obtenu ${r1.roundedAmount}`);
    if (r1.delta !== 0.38) throw new Error(`12,50€ @3% : delta attendu 0,38, obtenu ${r1.delta}`);

    // 2. 9,30 € à 3% -> pourboire de 0,28 € (9,30 * 0,03 = 0,279 -> 0,28), total 9,58 €
    const r2 = sim(9.30, 3);
    if (!r2) throw new Error("9,30€ @3% : aucun pourboire cochon retourné");
    if (r2.roundedAmount !== 9.58) throw new Error(`9,30€ @3% : attendu 9,58, obtenu ${r2.roundedAmount}`);
    if (r2.delta !== 0.28) throw new Error(`9,30€ @3% : delta attendu 0,28, obtenu ${r2.delta}`);

    // 3. 10,00 € à 3% -> pourboire de 0,30 € (10,00 * 0,03 = 0,30), total 10,30 €
    const r3 = sim(10.00, 3);
    if (!r3) throw new Error("10,00€ @3% : aucun pourboire cochon retourné");
    if (r3.roundedAmount !== 10.30) throw new Error(`10,00€ @3% : attendu 10,30, obtenu ${r3.roundedAmount}`);
    if (r3.delta !== 0.30) throw new Error(`10,00€ @3% : delta attendu 0,30, obtenu ${r3.delta}`);

    // 4. 0,10 € à 1% -> pourboire de 0,00 € (0,10 * 0,01 = 0,001 -> 0,00), doit renvoyer null
    const r4 = sim(0.10, 1);
    if (r4 !== null) throw new Error("0,10€ @1% : attendu null, obtenu un résultat");

    // 5. Pourboire désactivé -> null obligatoire
    state.settings.isRoundingEnabled = false;
    const r5 = calculateSmartRounding(100);
    if (r5 !== null) throw new Error("Pourboire cochon désactivé : doit retourner null");

    // Restauration
    state.settings.isRoundingEnabled = savedEnabled;
    state.settings.roundingCeiling   = savedCeiling;
    return true;
}

/**
 * Test 12 : Logique Cochon - dépôt via pourboire cochon, suppression avec remboursement,
 * et vérification que isSavingsLine & isFloorShift sont exclus des totaux.
 */
function testCochonLogic() {
    const savedCochon   = state.cochon;
    const savedEnabled  = state.settings.isRoundingEnabled;
    const savedCeiling  = state.settings.roundingCeiling;
    state.settings.isRoundingEnabled = true;
    state.settings.roundingCeiling   = 5;
    state.cochon = 0;

    // Setup budget de base
    state.revenues     = [{ id: "r1", title: "Salaire", amount: 2000 }];
    state.fixedCharges = [{ id: "c1", title: "Loyer",  amount: 650 }];
    state.expenses     = [];

    // 1. Simulation d'un pourboire cochon sur 9.63€ -> 10,11€, delta=0.48€ au cochon
    const rounding = calculateSmartRounding(9.63);
    if (!rounding) throw new Error("Pourboire cochon 9.63€ : attendu un résultat");
    if (rounding.delta !== 0.48) throw new Error(`Delta attendu 0.48, obtenu ${rounding.delta}`);

    state.expenses.push({
        id: "e_test_1", title: "Courses",
        amount: rounding.roundedAmount, // 10.11€
        roundingDelta: rounding.delta,  // 0.48€
        date: "2026-06-01", tag: "alimentation"
    });
    state.cochon = Math.round((state.cochon + rounding.delta) * 100) / 100;

    if (state.cochon !== 0.48) throw new Error(`Cochon après dépôt : attendu 0.48, obtenu ${state.cochon}`);

    // 2. La dépense de 10.11€ doit apparaître dans calculateTotals
    const t1 = calculateTotals();
    if (t1.totalExpenses !== 10.11) throw new Error(`totalExpenses attendu 10.11, obtenu ${t1.totalExpenses}`);
    if (t1.remaining !== 1339.89) throw new Error(`Remaining attendu 1339.89, obtenu ${t1.remaining}`);

    // 3. Suppression : le delta doit être remboursé du cochon
    const toDelete = state.expenses.find(e => e.id === "e_test_1");
    if (toDelete && toDelete.roundingDelta) {
        state.cochon = Math.max(0, Math.round((state.cochon - toDelete.roundingDelta) * 100) / 100);
    }
    state.expenses = state.expenses.filter(e => e.id !== "e_test_1");

    if (state.cochon !== 0) throw new Error(`Cochon après remboursement : attendu 0, obtenu ${state.cochon}`);

    // 3.b Test de la Pioche Cochon :
    state.cochon = 10;
    state.expenses = [];
    
    // Simuler l'ajout avec pioche cochon active
    const rawExpenseAmt = 100;
    const piocheDelta = Math.min(rawExpenseAmt, state.cochon); // 10€
    const expenseWithPioche = {
        id: "e_pioche_test",
        title: "Achat Test Pioche",
        amount: Math.round((rawExpenseAmt - piocheDelta) * 100) / 100, // 90.00€
        piocheCochon: piocheDelta, // 10.00€
        date: "2026-06-01",
        tag: "divers"
    };
    state.expenses.push(expenseWithPioche);
    state.cochon = Math.round((state.cochon - piocheDelta) * 100) / 100; // 0€
    
    if (state.cochon !== 0) throw new Error(`Pioche Cochon : solde cochon attendu 0, obtenu ${state.cochon}`);
    if (expenseWithPioche.amount !== 90) throw new Error(`Pioche Cochon : montant dépense attendu 90, obtenu ${expenseWithPioche.amount}`);
    
    const tPioche = calculateTotals();
    if (tPioche.totalExpenses !== 90) throw new Error(`Pioche Cochon : totalExpenses attendu 90, obtenu ${tPioche.totalExpenses}`);
    
    // Simuler la suppression et la restauration de la pioche cochon
    const toDeletePioche = state.expenses.find(e => e.id === "e_pioche_test");
    if (toDeletePioche && toDeletePioche.piocheCochon) {
        state.cochon = Math.round((state.cochon + toDeletePioche.piocheCochon) * 100) / 100;
    }
    state.expenses = state.expenses.filter(e => e.id !== "e_pioche_test");
    
    if (state.cochon !== 10) throw new Error(`Restauration Pioche Cochon : solde cochon attendu 10, obtenu ${state.cochon}`);
    const tRestore = calculateTotals();
    if (tRestore.totalExpenses !== 0) throw new Error(`Restauration Pioche Cochon : totalExpenses attendu 0, obtenu ${tRestore.totalExpenses}`);

    // 4. isSavingsLine ne doit PAS compter dans totalExpenses
    state.cochon = 20;
    state.expenses.push({
        id: "e_savings", title: "Epargne Cochon",
        amount: 20, date: "2026-06-01",
        tag: "epargne", isSavingsLine: true
    });
    const t2 = calculateTotals();
    if (t2.totalExpenses !== 0) throw new Error(`isSavingsLine doit être exclu : totalExpenses attendu 0, obtenu ${t2.totalExpenses}`);

    // 5. isFloorShift ne doit PAS compter dans totalExpenses
    state.expenses = [{
        id: "e_floor", title: "Plancher",
        amount: 15, date: "2026-06-01",
        tag: "epargne", isFloorShift: true
    }];
    const t3 = calculateTotals();
    if (t3.totalExpenses !== 0) throw new Error(`isFloorShift doit être exclu : totalExpenses attendu 0, obtenu ${t3.totalExpenses}`);

    // Restauration
    state.cochon                     = savedCochon;
    state.settings.isRoundingEnabled = savedEnabled;
    state.settings.roundingCeiling   = savedCeiling;
    return true;
}

/**
 * Test 13 : Export PDF & flux fin de mois
 * Vérifie :
 *  - La garde temporelle de selectRenewNextMonth (bloque trop tôt)
 *  - showRenewalPdfStep génère un résumé cohérent avec calculateTotals()
 *  - skipPdfAndContinue enchaîne correctement selon le solde restant
 *  - La fonction executeRenewal produit un texte PDF non vide avec les sections attendues
 *  - La fonction renewalExportPDF est définie et invocable
 */
function testPdfExportFlow() {
    // Sauvegarde de l'état
    const savedMonth    = state.budgetMonth;
    const savedRevenues = JSON.parse(JSON.stringify(state.revenues));
    const savedFixed    = JSON.parse(JSON.stringify(state.fixedCharges));
    const savedExpenses = JSON.parse(JSON.stringify(state.expenses));

    // --- 1. Garde temporelle : un mois FUTUR doit être bloqué ---
    const today = new Date();
    const futureYear  = today.getFullYear() + 1;
    state.budgetMonth = `${futureYear}-01`;
    // On simule l'appel sans déclencher le vrai alert :
    // la fonction retourne undefined si elle appelle showGenericAlert + return.
    // On patche showGenericAlert temporairement.
    const origAlert = window.showGenericAlert;
    let alertCalled = false;
    window.showGenericAlert = () => { alertCalled = true; };
    selectRenewNextMonth(); // doit déclencher l'alerte
    window.showGenericAlert = origAlert;
    if (!alertCalled) throw new Error("Garde temporelle : l'alerte n'a pas été déclenchée pour un mois futur");

    // --- 2. showRenewalPdfStep : vérifier que le résumé est cohérent ---
    state.budgetMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    state.revenues     = [{ id: 'tr1', title: 'Salaire test', amount: 2000 }];
    state.fixedCharges = [{ id: 'tc1', title: 'Loyer test',   amount: 500  }];
    state.expenses     = [{ id: 'te1', title: 'Courses test', amount: 300, date: state.budgetMonth + '-01', tag: 'divers' }];

    const { totalRevenues, totalFixed, totalExpenses, remaining } = calculateTotals();
    if (totalRevenues !== 2000) throw new Error(`PDF step : revenus attendus 2000, obtenus ${totalRevenues}`);
    if (totalFixed    !== 500)  throw new Error(`PDF step : frais fixes attendus 500, obtenus ${totalFixed}`);
    if (totalExpenses !== 300)  throw new Error(`PDF step : dépenses attendues 300, obtenues ${totalExpenses}`);
    const expectedRemaining = 2000 - 500 - 300; // 1200
    if (Math.abs(remaining - expectedRemaining) > 0.01) {
        throw new Error(`PDF step : reste attendu ${expectedRemaining}, obtenu ${remaining}`);
    }

    // --- 3. Vérifier que executeRenewal génère un texte PDF non vide ---
    // On patche generateBudgetPDF et autoCloseAllBudgets pour éviter les effets de bord UI
    const origGenerate     = window.generateBudgetPDF;
    const origAutoClose    = window.autoCloseAllBudgets;
    let pdfGenerateCalled  = false;
    window.autoCloseAllBudgets = () => {};
    window.generateBudgetPDF   = async () => { pdfGenerateCalled = true; };

    // Vérifier que le texte du ticket contiendrait les sections clés
    // (on appelle directement la logique de construction sans I/O)
    const userName = state.settings.username ? state.settings.username.toUpperCase() : "HMR";
    const monthLabel = formatYearMonthFrench(state.budgetMonth);
    if (!monthLabel || monthLabel.length < 3) throw new Error("formatYearMonthFrench() retourne une valeur invalide");

    // Vérifier que renewalExportPDF est une fonction définie
    if (typeof renewalExportPDF !== 'function') throw new Error("renewalExportPDF n'est pas définie");

    // --- 4. skipPdfAndContinue avec solde = 0 -> doit sauter le step 2.5 ---
    // On s'assure que calculateTotals() renvoie remaining=0
    state.expenses = [{ id: 'te2', title: 'Equilibre', amount: 1500, date: state.budgetMonth + '-01', tag: 'divers' }];
    const { remaining: r0 } = calculateTotals(); // 2000-500-1500=0
    if (Math.abs(r0) > 0.01) throw new Error(`skipPdf test setup : solde attendu 0, obtenu ${r0}`);

    // --- 5. skipPdfAndContinue avec solde != 0 -> remaining non nul correctement calculé ---
    state.expenses = [{ id: 'te3', title: 'Partiel', amount: 300, date: state.budgetMonth + '-01', tag: 'divers' }];
    const { remaining: rNonZero } = calculateTotals(); // 2000-500-300=1200
    if (Math.abs(rNonZero - 1200) > 0.01) throw new Error(`Solde non nul attendu 1200, obtenu ${rNonZero}`);

    // Restauration
    window.generateBudgetPDF   = origGenerate;
    window.autoCloseAllBudgets = origAutoClose;
    state.budgetMonth  = savedMonth;
    state.revenues     = savedRevenues;
    state.fixedCharges = savedFixed;
    state.expenses     = savedExpenses;
    return true;
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

// --- GESTION DES MODALES DU DASHBOARD ---
function openExpensesModal() {
    const modal = document.getElementById('expenses_modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.glass-card').classList.remove('scale-95');
    }, 10);
}
function closeExpensesModal() {
    const modal = document.getElementById('expenses_modal');
    modal.classList.add('opacity-0');
    modal.querySelector('.glass-card').classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

function openRevenuesModal() {
    const modal = document.getElementById('revenues_modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.glass-card').classList.remove('scale-95');
    }, 10);
}
function closeRevenuesModal() {
    const modal = document.getElementById('revenues_modal');
    modal.classList.add('opacity-0');
    modal.querySelector('.glass-card').classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

function openChargesModal() {
    const modal = document.getElementById('charges_modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.glass-card').classList.remove('scale-95');
    }, 10);
}
function closeChargesModal() {
    const modal = document.getElementById('charges_modal');
    modal.classList.add('opacity-0');
    modal.querySelector('.glass-card').classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
}


// ============================================================
// ===  FONCTIONNALITÉ COCHON (CAGNOTTE / RÉSERVE)          ===
// ============================================================

/**
 * Met à jour le badge cochon sur la golden card.
 */
function updateCochonBadge() {
    // Ne plus afficher le montant — aide psychologique à "oublier" l'argent
    // Le badge montre juste le cochon SVG (bouton cliquable)
    const badge = document.getElementById('cochon_badge');
    if (badge) badge.style.display = 'none'; // cacher le montant
    const badgeTitle = document.getElementById('cochon_badge_title');
    if (badgeTitle) badgeTitle.style.display = 'none'; // cacher le label "Réserve"
    const solde = state.cochon || 0;
    // Afficher/masquer le badge cochon sur la golden card (via classe cochon-hidden pour permettre la transition CSS)
    const container = document.getElementById('cochon_badge_container');
    if (container) {
        if (solde === 0) {
            container.classList.add('cochon-hidden');
        } else {
            container.classList.remove('hidden', 'cochon-hidden');
        }
    }
    // Afficher/masquer le bouton Mode Cochon dans le formulaire
    const cochonModeRow = document.getElementById('cochon_mode_row');
    const cochonBtn = document.getElementById('cochon_mode_btn');
    if (cochonModeRow) {
        cochonModeRow.classList.toggle('hidden', solde === 0);
        if (solde === 0 && cochonBtn) {
            cochonBtn.dataset.active = 'false';
            cochonBtn.classList.remove('cochon-btn-active');
        }
    }
    // Sync hidden checkbox for backward compat
    const toggle = document.getElementById('cochon_mode_toggle');
    if (toggle && solde === 0) { toggle.checked = false; }
}

/**
 * Génère un SVG de tête de cochon en wireframe pur — segments droits uniquement.
 * Maillage triangulé style low-poly, aucune courbe. ~45 segments déconnectés.
 * Animation de luminescence CSS quand objectif atteint (.goal-reached).
 */
function renderCochonSVG(solde) {
    const target = state.settings.cochonTarget || 60;
    const isGoalReached = solde >= target;
    const goalCls = isGoalReached ? 'goal-reached' : '';

    // Falling coin animation when balance > 0
    const coinHtml = solde > 0 ? `
        <g>
            <circle cx="75" cy="22" r="8" fill="#fbbf24" stroke="#d97706" stroke-width="1.2">
                <animate attributeName="cy" values="10;42" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;1;1;0" dur="2.5s" keyTimes="0;0.15;0.85;1" repeatCount="indefinite" />
            </circle>
            <text x="75" y="27" font-size="9" font-family="sans-serif" font-weight="900" fill="#78350f" text-anchor="middle">
                €
                <animate attributeName="y" values="15;47" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;1;1;0" dur="2.5s" keyTimes="0;0.15;0.85;1" repeatCount="indefinite" />
            </text>
        </g>` : '';

    return `<svg id="cochon_svg_main" class="${goalCls}" viewBox="0 0 150 150" width="140" height="140" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="cm-body" cx="38%" cy="32%" r="62%">
                <stop offset="0%" stop-color="#ffd6e0" />
                <stop offset="38%" stop-color="#ff8fab" />
                <stop offset="78%" stop-color="#e63870" />
                <stop offset="100%" stop-color="#c0254e" />
            </radialGradient>
            <radialGradient id="cm-ear" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stop-color="#ffdce8" />
                <stop offset="100%" stop-color="#ff8fab" />
            </radialGradient>
            <radialGradient id="cm-snout" cx="45%" cy="38%" r="58%">
                <stop offset="0%" stop-color="#ffe0ea" />
                <stop offset="100%" stop-color="#ffb3c6" />
            </radialGradient>
            <radialGradient id="cm-shadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="rgba(0,0,0,0.25)" />
                <stop offset="100%" stop-color="rgba(0,0,0,0)" />
            </radialGradient>
        </defs>

        <!-- Drop shadow -->
        <ellipse cx="75" cy="138" rx="28" ry="5" fill="url(#cm-shadow)" />

        <!-- Left ear -->
        <ellipse cx="34" cy="42" rx="15" ry="18" fill="url(#cm-ear)" transform="rotate(-18 34 42)" />
        <ellipse cx="35" cy="43" rx="7" ry="11" fill="#ffb3c6" opacity="0.75" transform="rotate(-18 34 42)" />

        <!-- Right ear -->
        <ellipse cx="116" cy="42" rx="15" ry="18" fill="url(#cm-ear)" transform="rotate(18 116 42)" />
        <ellipse cx="115" cy="43" rx="7" ry="11" fill="#ffb3c6" opacity="0.75" transform="rotate(18 116 42)" />

        <!-- Main body sphere -->
        <circle cx="75" cy="75" r="38" fill="url(#cm-body)" />

        <!-- Coin slot on top -->
        <rect x="61" y="35" width="28" height="7" rx="3.5" fill="rgba(10,8,20,0.78)" />
        <rect x="61" y="35" width="28" height="3" rx="1.5" fill="rgba(255,255,255,0.12)" />

        <!-- Coin animation -->
        ${coinHtml}

        <!-- Snout -->
        <ellipse cx="75" cy="94" rx="20" ry="14" fill="url(#cm-snout)" />
        <ellipse cx="67" cy="95" rx="4" ry="5.5" fill="#e63870" opacity="0.65" />
        <ellipse cx="83" cy="95" rx="4" ry="5.5" fill="#e63870" opacity="0.65" />

        <!-- Eyes -->
        <circle cx="57" cy="65" r="5.5" fill="#1a0a2e" />
        <circle cx="93" cy="65" r="5.5" fill="#1a0a2e" />
        <circle cx="59" cy="63" r="2.2" fill="rgba(255,255,255,0.78)" />
        <circle cx="95" cy="63" r="2.2" fill="rgba(255,255,255,0.78)" />

        <!-- Blush cheeks -->
        <ellipse cx="42" cy="82" rx="9" ry="6" fill="#f43f5e" opacity="0.28" />
        <ellipse cx="108" cy="82" rx="9" ry="6" fill="#f43f5e" opacity="0.28" />

        <!-- Specular highlight -->
        <ellipse cx="57" cy="55" rx="14" ry="9" fill="rgba(255,255,255,0.26)" transform="rotate(-25 57 55)" />
        <ellipse cx="54" cy="52" rx="6" ry="3.5" fill="rgba(255,255,255,0.44)" transform="rotate(-25 54 52)" />
    </svg>`;
}



/** Ouvre la modale du Cochon */
function openCochonModal() {
    renderCochonModal();
    const modal = document.getElementById('cochon_modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.cochon-panel').classList.remove('scale-95');
    }, 10);
    triggerHaptic(10);
}

/** Ferme la modale du Cochon */
function closeCochonModal() {
    const modal = document.getElementById('cochon_modal');
    if (!modal) return;
    // Stop confetti to free GPU resources
    const canvas = document.getElementById('cochon_confetti_canvas');
    if (canvas) stopCochonConfetti(canvas);
    modal.classList.add('opacity-0');
    modal.querySelector('.cochon-panel').classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

/** Rend le contenu de la modale cochon */
function renderCochonModal() {
    const solde = state.cochon || 0;
    const target = state.settings.cochonTarget || 60;
    const { remaining } = calculateTotals();
    const isGoalReached = solde >= target;
    const pct = target > 0 ? Math.min(100, Math.round((solde / target) * 100)) : 0;

    const thresholds = state.settings.cochonThresholds || [0, 20, 50, 100];
    let stateLabel = 'Vide';
    if (isGoalReached)                { stateLabel = 'Objectif atteint'; }
    else if (solde >= thresholds[3])  { stateLabel = 'Plein'; }
    else if (solde >= thresholds[2])  { stateLabel = 'Bien rempli'; }
    else if (solde >= thresholds[1])  { stateLabel = 'En cours'; }
    else if (solde > 0)              { stateLabel = 'Début'; }

    // SVG pig
    const svgEl = document.getElementById('cochon_svg_container');
    if (svgEl) svgEl.innerHTML = renderCochonSVG(solde);

    // Solde — nouveau design premium avec gradient text
    const soldeEl = document.getElementById('cochon_solde_display');
    if (soldeEl) {
        soldeEl.innerHTML = `<span class="cochon-balance-amount${isGoalReached ? ' goal-reached' : ''}">${formatCurrency(solde)}</span>
        <p class="cochon-balance-label">${stateLabel}</p>`;
    }

    // Barre objectif
    const barFill = document.getElementById('cochon_goal_fill');
    const barLabel = document.getElementById('cochon_goal_label');
    if (barFill) {
        barFill.style.width = `${pct}%`;
        barFill.classList.toggle('goal-reached', isGoalReached);
    }
    if (barLabel) barLabel.textContent = `${pct}% — objectif ${formatCurrency(target)}`;

    // Slider — incréments intelligents adaptés au montant disponible
    const maxAmt = Math.max(0, solde);
    const sliderEl = document.getElementById('cochon_action_slider');
    const sliderVal = document.getElementById('cochon_slider_value');
    if (sliderEl) {
        const step = cochonSliderStep(maxAmt);
        const minVal = maxAmt >= 1.0 ? 1.0 : 0;
        sliderEl.min   = minVal;
        sliderEl.max   = maxAmt;           // toujours le montant exact, même décimal
        sliderEl.step  = 'any';
        sliderEl.dataset.step = step;
        // Initialise à la première marche (1€ ou montant max si < 1)
        const prevVal  = parseFloat(sliderEl.dataset.userSet || '0');
        const defaultInit = maxAmt >= 1.0 ? 1.0 : maxAmt;
        const initVal  = prevVal > 0 ? Math.min(prevVal, maxAmt) : defaultInit;
        sliderEl.value = maxAmt > 0 ? Math.max(minVal, Math.min(initVal, maxAmt)) : 0;
        if (sliderVal) sliderVal.textContent = formatCurrency(parseFloat(sliderEl.value) || 0);
    }

    // Bouton "Combler le trou"
    const btnFill = document.getElementById('cochon_btn_fill_gap');
    if (btnFill) {
        if (remaining < 0 && solde > 0) {
            btnFill.classList.remove('hidden');
            const fillAmt = Math.min(Math.abs(remaining), solde);
            btnFill.querySelector('span.fill-amount').textContent = formatCurrency(fillAmt);
        } else {
            btnFill.classList.add('hidden');
        }
    }

    // --- Confettis + Bravo si objectif atteint ---
    const bravoEl = document.getElementById('cochon_bravo');
    const canvas  = document.getElementById('cochon_confetti_canvas');
    if (isGoalReached) {
        if (bravoEl) {
            bravoEl.classList.remove('hidden');
            // Re-trigger animation
            bravoEl.style.animation = 'none';
            bravoEl.offsetHeight; // reflow
            bravoEl.style.animation = '';
        }
        if (canvas) startCochonConfetti(canvas);
    } else {
        if (bravoEl) bravoEl.classList.add('hidden');
        if (canvas) stopCochonConfetti(canvas);
    }
}

/* =========================================================
   MOTEUR DE CONFETTIS LÉGER — canvas cochon modal
   ========================================================= */
let _cochonConfettiRAF = null;

function startCochonConfetti(canvas) {
    if (_cochonConfettiRAF) return; // already running
    const ctx = canvas.getContext('2d');
    let W = canvas.clientWidth  || 400;
    let H = canvas.clientHeight || 600;
    canvas.width  = W;
    canvas.height = H;

    const COLORS = [
        '#f43f5e','#fb7185','#fbbf24','#f59e0b',
        '#8b5cf6','#a78bfa','#34d399','#60a5fa','#fde68a'
    ];
    const COUNT = 60;
    const particles = Array.from({ length: COUNT }, () => ({
        x:  Math.random() * W,
        y:  Math.random() * H - H,      // start above
        w:  6 + Math.random() * 8,
        h:  10 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rot:   Math.random() * Math.PI * 2,
        rotV:  (Math.random() - 0.5) * 0.15,
        vx:    (Math.random() - 0.5) * 1.5,
        vy:    1.5 + Math.random() * 2.5,
        opacity: 0.7 + Math.random() * 0.3
    }));

    function draw() {
        // Mettre à jour la taille si elle a changé (ex: après ouverture de la modale)
        const currentW = canvas.clientWidth  || 400;
        const currentH = canvas.clientHeight || 600;
        if (canvas.width !== currentW || canvas.height !== currentH) {
            canvas.width  = currentW;
            canvas.height = currentH;
            W = currentW;
            H = currentH;
        }

        ctx.clearRect(0, 0, W, H);
        for (const p of particles) {
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();

            p.x   += p.vx;
            p.y   += p.vy;
            p.rot += p.rotV;

            // reset when out of canvas
            if (p.y > H + 20) {
                p.y = -20;
                p.x = Math.random() * W;
            }
        }
        _cochonConfettiRAF = requestAnimationFrame(draw);
    }
    draw();
}

function stopCochonConfetti(canvas) {
    if (_cochonConfettiRAF) {
        cancelAnimationFrame(_cochonConfettiRAF);
        _cochonConfettiRAF = null;
    }
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Calcule un incrément optimal pour le slider cochon selon le montant max.
 * Principe : l'utilisation du slider doit toujours être confortable sur un écran fixe.
 * On cible ~20-60 "crans" visibles sur la plage [1€ → max].
 */
function cochonSliderStep(max) {
    if (max <= 0) return 0.10;
    const range = Math.max(1, max - 1); // plage effective au-dessus du plancher 1€
    // Paliers candidats en ordre croissant
    const STEPS = [0.10, 0.50, 1, 2, 5, 10, 20, 25, 50, 100, 200, 500];
    for (const s of STEPS) {
        const crans = Math.floor(range / s);
        if (crans >= 10 && crans <= 80) return s;
    }
    // Montant très élevé : dernier palier utile
    return STEPS[STEPS.length - 1];
}

/** Met à jour l'affichage du slider cochon et mémorise la valeur utilisateur */
function onCochonSliderChange() {
    const slider = document.getElementById('cochon_action_slider');
    const display = document.getElementById('cochon_slider_value');
    if (slider && display) {
        let v = parseFloat(slider.value) || 0;
        const max = parseFloat(slider.max) || 0;
        const step = parseFloat(slider.dataset.step) || 0.01;
        const min = parseFloat(slider.min) || 0;

        // Arrondir au step le plus proche
        let rounded = Math.round(v / step) * step;
        // Si on est à moins d'un demi-pas du max, on snap au max
        if (v >= max - (step / 2)) {
            rounded = max;
        }

        // S'assurer de rester dans les limites
        rounded = Math.max(min, Math.min(rounded, max));

        // Mettre à jour la valeur physique du slider pour bloquer le thumb sur le cran
        slider.value = rounded;

        slider.dataset.userSet = rounded; // mémorise pour re-init
        display.textContent = formatCurrency(rounded);
    }
}

/**
 * Exécute une action depuis la modale cochon.
 * @param {string} type - 'budget' | 'savings' | 'floor' | 'gap'
 */
function cochonAction(type) {
    const slider = document.getElementById('cochon_action_slider');
    const { remaining } = calculateTotals();
    let amount;

    if (type === 'gap') {
        amount = Math.min(Math.abs(remaining), state.cochon);
    } else {
        amount = parseFloat(slider?.value) || 0;
    }

    if (amount <= 0) { showGenericAlert('Montant invalide', 'Sélectionne un montant supérieur à 0 €', '🐷'); return; }
    if (amount > state.cochon) { showGenericAlert('Solde insuffisant', `Le cochon ne contient que ${formatCurrency(state.cochon)}`, '🐷'); return; }

    const today = getTodayDateString();

    if (type === 'budget') {
        // Remettre en budget = remboursement (amount négatif dans expenses)
        showGenericConfirm(
            'Remettre en budget ?',
            `Retirer <strong>${formatCurrency(amount)}</strong> du cochon et les réintégrer dans ton solde ?`,
            '💰',
            () => {
                state.cochon = Math.round((state.cochon - amount) * 100) / 100;
                state.expenses.push({
                    id: `cochon_budget_${Date.now()}`,
                    title: 'Retrait Cochon → Budget',
                    amount: -amount, // négatif = remboursement
                    date: today,
                    tag: 'epargne',
                    isCochonWithdrawal: true
                });
                saveState(); updateUI(); updateCochonBadge(); renderCochonModal(); triggerHaptic('success');
            }
        );
    } else if (type === 'floor') {
        // Déplacer le Zéro (oublier) : ligne grise ignorée par calculateTotals
        showGenericConfirm(
            'Déplacer le Zéro ?',
            `Confirmer la "pénurie artificielle" de <strong>${formatCurrency(amount)}</strong> ?<br><br><em style="font-size:10px">Le cochon sera réduit. Cette ligne est mémorisée comme "Plancher de sécurité" et ignorée dans les calculs.</em>`,
            '📍',
            () => {
                state.cochon = Math.round((state.cochon - amount) * 100) / 100;
                state.expenses.push({
                    id: `cochon_floor_${Date.now()}`,
                    title: `Plancher sécurité (+${formatCurrency(amount)})`,
                    amount: amount,
                    date: today,
                    tag: 'epargne',
                    isFloorShift: true
                });
                saveState(); updateUI(); updateCochonBadge(); renderCochonModal(); triggerHaptic('success');
            }
        );
    } else if (type === 'gap') {
        // Combler le trou
        showGenericConfirm(
            'Combler le déficit ?',
            `Utiliser <strong>${formatCurrency(amount)}</strong> du cochon pour combler le déficit de ${formatCurrency(Math.abs(remaining))} ?`,
            '🚑',
            () => {
                state.cochon = Math.round((state.cochon - amount) * 100) / 100;
                state.expenses.push({
                    id: `cochon_gap_${Date.now()}`,
                    title: 'Cochon → Combler Déficit',
                    amount: -amount,
                    date: today,
                    tag: 'epargne',
                    isCochonWithdrawal: true
                });
                saveState(); updateUI(); updateCochonBadge(); renderCochonModal(); triggerHaptic('success');
                closeCochonModal();
            }
        );
    }
}

/** Active/désactive le Mode Cochon via le bouton pill */
function toggleCochonMode() {
    const btn = document.getElementById('cochon_mode_btn');
    // hidden checkbox for backward compat with addExpense
    const toggle = document.getElementById('cochon_mode_toggle');
    if (!btn) return;

    const isActive = btn.dataset.active === 'true';
    const newActive = !isActive;
    btn.dataset.active = newActive ? 'true' : 'false';

    if (toggle) toggle.checked = newActive;

    if (newActive) {
        btn.classList.add('cochon-btn-active');
        btn.innerHTML = `<span>🐷</span><span>Piocher le cochon</span>
            <svg class="cochon-checkmark" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>`;
    } else {
        btn.classList.remove('cochon-btn-active');
        btn.innerHTML = `<span>🐷</span><span>Piocher le cochon</span>
            <svg class="cochon-indicator" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" stroke-dasharray="4 3" fill="none"></circle>
            </svg>`;
    }

    // Désactiver "Remboursement" quand mode cochon actif
    const btnRefund = document.getElementById('btn_refund');
    if (btnRefund) {
        btnRefund.disabled = newActive;
        btnRefund.classList.toggle('opacity-40', newActive);
        btnRefund.classList.toggle('cursor-not-allowed', newActive);
        btnRefund.classList.toggle('pointer-events-none', newActive);
    }
}

/** Désactive le mode cochon après une opération (appelé depuis addExpense) */
function resetCochonMode() {
    const btn = document.getElementById('cochon_mode_btn');
    const toggle = document.getElementById('cochon_mode_toggle');
    if (btn) {
        btn.dataset.active = 'false';
        btn.classList.remove('cochon-btn-active');
        btn.innerHTML = `<span>🐷</span><span>Piocher le cochon</span>
            <svg class="cochon-indicator" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" stroke-dasharray="4 3" fill="none"></circle>
            </svg>`;
    }
    if (toggle) toggle.checked = false;
    // Re-enable refund button
    const btnRefund = document.getElementById('btn_refund');
    if (btnRefund) {
        btnRefund.disabled = false;
        btnRefund.classList.remove('opacity-40', 'cursor-not-allowed', 'pointer-events-none');
    }
}



// ============================================================
// FIN DU BLOC COCHON
// ============================================================


// =========================================================================
// 🛠️ LOGIQUE DU PANEL DE DIAGNOSTIC (MODE DEBUG CACHÉ)
// =========================================================================

function openDebugModal() {
    const modal = document.getElementById("debug_modal");
    if (!modal) return;
    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.querySelector(".glass-card").classList.remove("scale-95");
    }, 10);
    generateDiagnosticReport();
}

function closeDebugModal() {
    const modal = document.getElementById("debug_modal");
    if (!modal) return;
    modal.classList.add("opacity-0");
    modal.querySelector(".glass-card").classList.add("scale-95");
    setTimeout(() => {
        modal.classList.add("hidden");
    }, 300);
}

function generateDiagnosticReport() {
    let report = "# Rapport de Diagnostic BUDGETHMR\n";
    report += `Généré le : ${new Date().toLocaleString('fr-FR')}\n\n`;
    
    // 1. Stats Système
    const platform = window.Capacitor ? "Android/iOS (Native Capacitor)" : "Navigateur Web";
    let storageUsed = 0;
    try {
        const savedState = localStorage.getItem("budget_hmr_simple") || "";
        storageUsed = new Blob([savedState]).size;
    } catch(e) {}
    const storagePercent = ((storageUsed / (5 * 1024 * 1024)) * 100).toFixed(2);
    
    report += "## 🖥️ Statuts Système\n";
    report += `- Version de l'application : v${window.BUDGET_HMR_VERSION || '4.0.0'}\n`;
    report += `- Plateforme : ${platform}\n`;
    report += `- Espace occupé LocalStorage : ${(storageUsed / 1024).toFixed(2)} KB (${storagePercent}%)\n`;
    report += `- Mois budgétaire actif : ${state.budgetMonth}\n\n`;
    
    // Update UI elements
    const verEl = document.getElementById("debug_version");
    if (verEl) verEl.innerText = "v" + (window.BUDGET_HMR_VERSION || '4.0.0');
    const platEl = document.getElementById("debug_platform");
    if (platEl) platEl.innerText = platform;
    const storEl = document.getElementById("debug_storage_used");
    if (storEl) storEl.innerText = `${(storageUsed / 1024).toFixed(2)} KB (${storagePercent}%)`;
    
    // 2. Autodiagnostic des Données
    report += "## 🔍 Intégrité des Données\n";
    let issues = [];
    
    // Check state schema
    const requiredKeys = ['revenues', 'fixedCharges', 'expenses', 'budgets', 'settings', 'cochon'];
    requiredKeys.forEach(k => {
        if (!(k in state)) {
            issues.push(`Clé manquante dans le schéma : ${k}`);
        }
    });
    
    // Check duplicate IDs
    const checkDuplicateIds = (arr, name) => {
        const ids = new Set();
        arr.forEach((item, index) => {
            if (!item.id) {
                issues.push(`Élément sans ID dans ${name} à l'index ${index}`);
            } else if (ids.has(item.id)) {
                issues.push(`ID en doublon dans ${name} : ${item.id} (Titre : ${item.title || item.label || 'sans titre'})`);
            } else {
                ids.add(item.id);
            }
        });
    };
    
    if (state.expenses) checkDuplicateIds(state.expenses, "Dépenses");
    if (state.revenues) checkDuplicateIds(state.revenues, "Revenus");
    if (state.fixedCharges) checkDuplicateIds(state.fixedCharges, "Frais Fixes");
    if (state.budgets) checkDuplicateIds(state.budgets, "Enveloppes");
    
    // Check amounts and dates in expenses
    if (state.expenses) {
        state.expenses.forEach(e => {
            if (typeof e.amount !== 'number' || isNaN(e.amount)) {
                issues.push(`Dépense [ID: ${e.id}] : Montant invalide (${e.amount})`);
            }
            if (!e.date || !/^\d{4}-\d{2}-\d{2}$/.test(e.date)) {
                issues.push(`Dépense [ID: ${e.id}, Titre: ${e.title}] : Format de date incorrect (${e.date})`);
            }
        });
    }
    
    const diagHtmlContainer = document.getElementById("debug_diagnostic_results");
    if (diagHtmlContainer) {
        if (issues.length === 0) {
            diagHtmlContainer.innerHTML = '<span class="text-emerald-500 font-bold">✅ Zéro anomalie détectée. Base de données intègre.</span>';
            report += "✅ Zéro anomalie détectée. Base de données intègre.\n\n";
        } else {
            diagHtmlContainer.innerHTML = issues.map(i => `<span class="text-red-500 block">⚠️ ${i}</span>`).join('');
            report += issues.map(i => `⚠️ ${i}`).join('\n') + "\n\n";
        }
    }
    
    // 3. Error Logs
    report += "## 🛞 Erreurs JavaScript Récentes (Boîte Noire)\n";
    const errorContainer = document.getElementById("debug_error_log");
    if (errorContainer) {
        if (!window.debugErrors || window.debugErrors.length === 0) {
            errorContainer.innerHTML = '<span class="text-emerald-500">Aucune erreur détectée.</span>';
            report += "Aucune erreur détectée.\n";
        } else {
            errorContainer.innerHTML = window.debugErrors.map(e => `<div class="py-1">❌ ${e}</div>`).join('');
            report += window.debugErrors.map(e => `❌ ${e}`).join('\n') + "\n";
        }
    }
    
    return report;
}

function copyDiagnosticReport() {
    const reportText = generateDiagnosticReport();
    navigator.clipboard.writeText(reportText).then(() => {
        showGenericAlert("Rapport copié", "Le rapport de diagnostic a été copié dans le presse-papier.", "📋");
    }).catch(err => {
        console.error("Clipboard copy failed:", err);
    });
}

function copyRawStateJSON() {
    const stateStr = JSON.stringify(state, null, 2);
    navigator.clipboard.writeText(stateStr).then(() => {
        showGenericAlert("JSON copié", "L'état complet JSON a été copié dans le presse-papier.", "💾");
    }).catch(err => {
        console.error("Clipboard copy failed:", err);
    });
}

function runDebugSelfTests() {
    showGenericAlert("Lancement des tests", "La suite de tests de certification va s'exécuter en arrière-plan.", "🧪");
    runCertificationTests();
    setTimeout(() => {
        generateDiagnosticReport();
    }, 1500);
}


window.openDebugModal = openDebugModal;
window.closeDebugModal = closeDebugModal;
window.generateDiagnosticReport = generateDiagnosticReport;
window.copyDiagnosticReport = copyDiagnosticReport;
window.copyRawStateJSON = copyRawStateJSON;
window.runDebugSelfTests = runDebugSelfTests;

// --- EXPOSITION DES FONCTIONS GLOBALES POUR LA COMPATIBILITÉ HTML ---
window.hideSplashScreen = hideSplashScreen;
window.generateInstallmentGroupId = generateInstallmentGroupId;
window.openInstallmentModal = openInstallmentModal;
window.closeInstallmentModal = closeInstallmentModal;
window.cancelInstallmentModal = cancelInstallmentModal;
window.confirmCancelInstallment = confirmCancelInstallment;
window.confirmInstallmentModal = confirmInstallmentModal;
window.updateInstallmentTriggerLabel = updateInstallmentTriggerLabel;
window.updateInstallmentIncompatibleButtons = updateInstallmentIncompatibleButtons;
window.onAmountClickWhenLocked = onAmountClickWhenLocked;
window.closeLockedAmountModal = closeLockedAmountModal;
window.renderInstallmentButtons = renderInstallmentButtons;
window.selectInstallmentTotal = selectInstallmentTotal;
window.selectInstallmentCurrent = selectInstallmentCurrent;
window.renderInstallmentAmountRows = renderInstallmentAmountRows;
window.onInstallmentAmountChange = onInstallmentAmountChange;
window.onInstallmentAmountBlur = onInstallmentAmountBlur;
window.updateInstallmentPreview = updateInstallmentPreview;
window.resetInstallmentUI = resetInstallmentUI;
window.initUI = initUI;
window.countDayOccurrences = countDayOccurrences;
window.getEffectiveChargeAmount = getEffectiveChargeAmount;
window.calculateTotals = calculateTotals;
window.calculateSmartRounding = calculateSmartRounding;
window.getNextMonth = getNextMonth;
window.updateUI = updateUI;
window.getCochonSVG = getCochonSVG;
window.renderExpensesList = renderExpensesList;
window.renderFixedChargesList = renderFixedChargesList;
window.renderRevenuesList = renderRevenuesList;
window.addExpense = addExpense;
window.deleteExpense = deleteExpense;
window.confirmAddRefund = confirmAddRefund;
window.updateBaseBudget = updateBaseBudget;
window.addFixedCharge = addFixedCharge;
window.deleteFixedCharge = deleteFixedCharge;
window.addRevenue = addRevenue;
window.deleteRevenue = deleteRevenue;
window.confirmReset = confirmReset;
window.closeRenewalModal = closeRenewalModal;
window.renderRenewalBudgetsList = renderRenewalBudgetsList;
window.setBudgetRenewalAction = setBudgetRenewalAction;
window.confirmBudgetsRenewalSelection = confirmBudgetsRenewalSelection;
window.closeBudgetSilently = closeBudgetSilently;
window.goToRenewalStep2 = goToRenewalStep2;
window.proceedToImportRenewalCarryover = proceedToImportRenewalCarryover;
window.proceedToRenewalCarryover = proceedToRenewalCarryover;
window.selectRenewSameMonth = selectRenewSameMonth;
window.selectRenewNextMonth = selectRenewNextMonth;
window.showRenewalPdfStep = showRenewalPdfStep;
window.skipPdfAndContinue = skipPdfAndContinue;
window.confirmCarryOver = confirmCarryOver;
window.goToRenewalStep3 = goToRenewalStep3;
window.renderRenewalRevenuesList = renderRenewalRevenuesList;
window.confirmRevenuesRenewalSelection = confirmRevenuesRenewalSelection;
window.proceedToSecurityCode = proceedToSecurityCode;
window.validateRenewalCode = validateRenewalCode;
window.renewalExportPDF = renewalExportPDF;
window.executeRenewal = executeRenewal;
window.toggleTheme = toggleTheme;
window.updateThemeToggleIcon = updateThemeToggleIcon;
window.updateThemeColorMeta = updateThemeColorMeta;
window.applyVisualTheme = applyVisualTheme;
window.setVisualTheme = setVisualTheme;
window.updateCollapsibleUI = updateCollapsibleUI;
window.formatCurrency = formatCurrency;
window.normalizeAmountInput = normalizeAmountInput;
window.showGenericConfirm = showGenericConfirm;
window.validateGenericConfirmCode = validateGenericConfirmCode;
window.closeGenericConfirmModal = closeGenericConfirmModal;
window.showGenericAlert = showGenericAlert;
window.closeGenericAlertModal = closeGenericAlertModal;
window.handleCancelClick = handleCancelClick;
window.openEditItem = openEditItem;
window.renderPeriodicitySelector = renderPeriodicitySelector;
window.selectPeriodicityType = selectPeriodicityType;
window.selectPeriodicityDay = selectPeriodicityDay;
window.updateSpecificMonthsPreview = updateSpecificMonthsPreview;
window.readPeriodicityFromUI = readPeriodicityFromUI;
window.resetChargePeriodicityUI = resetChargePeriodicityUI;
window.closeEditModal = closeEditModal;
window.earlyRepayInstallment = earlyRepayInstallment;
window.saveEdit = saveEdit;
window.openSettingsModal = openSettingsModal;
window.closeSettingsModal = closeSettingsModal;
window.shareApp = shareApp;
window.onRoundingCeilingChange = onRoundingCeilingChange;
window.saveUserSettings = saveUserSettings;
window.exportJSONData = exportJSONData;
window.importJSONData = importJSONData;
window.getPreviousMonth = getPreviousMonth;
window.closeImportOptionsModal = closeImportOptionsModal;
window.showImportWizardOptions = showImportWizardOptions;
window.applyImportFull = applyImportFull;
window.applyImportPartial = applyImportPartial;
window.startImportRevenuesReview = startImportRevenuesReview;
window.executeImportOption = executeImportOption;
window.getMonthDifference = getMonthDifference;
window.checkMonthTransitionOnLaunch = checkMonthTransitionOnLaunch;
window.closeTransitionReminderModal = closeTransitionReminderModal;
window.acceptTransitionReminder = acceptTransitionReminder;
window.executeForcedTransition = executeForcedTransition;
window.executeReinitOption = executeReinitOption;
window.clearDatabase = clearDatabase;
window.playConfirmationSound = playConfirmationSound;
window.playOverdraftSound = playOverdraftSound;
window.showSuccessAnimation = showSuccessAnimation;
window.repositionTooltip = repositionTooltip;
window.trackTourTooltip = trackTourTooltip;
window.startTour = startTour;
window.showTourStep = showTourStep;
window.nextTourStep = nextTourStep;
window.endTour = endTour;
window.registerServiceWorker = registerServiceWorker;
window.initPWAInstall = initPWAInstall;
window.checkStoragePersistence = checkStoragePersistence;
window.initStoragePersistence = initStoragePersistence;
window.updateStorageUI = updateStorageUI;
window.tryRequestPersistence = tryRequestPersistence;
window.getDB = getDB;
window.saveFileHandle = saveFileHandle;
window.getFileHandle = getFileHandle;
window.verifyPermission = verifyPermission;
window.quickExportJSON = quickExportJSON;
window.updateQuickSaveUI = updateQuickSaveUI;
window.initApkDownload = initApkDownload;
window.showApkDownloadPrompt = showApkDownloadPrompt;
window.initPlatformSpecifics = initPlatformSpecifics;
window.updateSystemBars = updateSystemBars;
window.openRecapModal = openRecapModal;
window.closeRecapModal = closeRecapModal;
window.openExpenseDatePicker = openExpenseDatePicker;
window.openEditExpenseDatePicker = openEditExpenseDatePicker;
window.openCustomDatePicker = openCustomDatePicker;
window.closeCustomDatePicker = closeCustomDatePicker;
window.renderCalendarGrid = renderCalendarGrid;
window.confirmSelectedDate = confirmSelectedDate;
window.clearExpenseDate = clearExpenseDate;
window.clearCustomDatePickerDate = clearCustomDatePickerDate;
window.getRenewalMonthOptions = getRenewalMonthOptions;
window.generateBudgetPDF = generateBudgetPDF;
window.updateEnvelopeTicket = updateEnvelopeTicket;
window.viewEnvelopeTicket = viewEnvelopeTicket;
window.shareBlob = shareBlob;
window.switchDashboardTab = switchDashboardTab;
window.confirmCreateBudget = confirmCreateBudget;
window.selectBudgetSubType = selectBudgetSubType;
window.goBackToBudgetSubTypeSelection = goBackToBudgetSubTypeSelection;
window.closeBudgetFundingModal = closeBudgetFundingModal;
window.handleBudgetFundingChoice = handleBudgetFundingChoice;
window.renderBudgetsList = renderBudgetsList;
window.toggleBudgetOpHistory = toggleBudgetOpHistory;
window.addBudgetOperation = addBudgetOperation;
window.calculateCashDepositAmount = calculateCashDepositAmount;
window.depositBudgetCash = depositBudgetCash;
window.deleteBudgetOperation = deleteBudgetOperation;
window.syncMainBudgetReference = syncMainBudgetReference;
window.confirmCloseBudget = confirmCloseBudget;
window.executeCloseBudgetLogic = executeCloseBudgetLogic;
window.closeBudget = closeBudget;
window.confirmDeleteBudget = confirmDeleteBudget;
window.confirmCashDeposit = confirmCashDeposit;
window.autoCloseAllBudgets = autoCloseAllBudgets;
window.openViewBudgetModal = openViewBudgetModal;
window.closeViewBudgetModal = closeViewBudgetModal;
window.executeReopenBudgetLogic = executeReopenBudgetLogic;
window.reopenBudget = reopenBudget;
window.checkAppVersionAndWelcome = checkAppVersionAndWelcome;
window.openWelcomeModal = openWelcomeModal;
window.closeWelcomeModal = closeWelcomeModal;
window.acceptWelcomeOption = acceptWelcomeOption;
window.openVersionUpdateModal = openVersionUpdateModal;
window.closeVersionUpdateModal = closeVersionUpdateModal;
window.acceptVersionUpdateCertify = acceptVersionUpdateCertify;
window.openAppGuide = openAppGuide;
window.closeAppGuide = closeAppGuide;
window.updateGuideUI = updateGuideUI;
window.nextGuideSlide = nextGuideSlide;
window.prevGuideSlide = prevGuideSlide;
window.resetDemoState = resetDemoState;
window.updateDemoUI = updateDemoUI;
window.runDemoAction = runDemoAction;
window.handleOnboardingOrUpdateClose = handleOnboardingOrUpdateClose;
window.triggerFirstLaunchToleranceCheck = triggerFirstLaunchToleranceCheck;
window.openCertification = openCertification;
window.closeCertification = closeCertification;
window.updateTestRowStatus = updateTestRowStatus;
window.runCertificationTests = runCertificationTests;
window.testBaseCalculations = testBaseCalculations;
window.testMonthTransitions = testMonthTransitions;
window.testClassicEnvelopes = testClassicEnvelopes;
window.testFriendsEnvelopes = testFriendsEnvelopes;
window.testCashManagement = testCashManagement;
window.testPeriodSecurity = testPeriodSecurity;
window.testPeriodicityCalculations = testPeriodicityCalculations;
window.testInstallmentPayments = testInstallmentPayments;
window.testInstallmentEdgeCases = testInstallmentEdgeCases;
window.testInstallmentCustomAmounts = testInstallmentCustomAmounts;
window.testSmartRounding = testSmartRounding;
window.testCochonLogic = testCochonLogic;
window.testPdfExportFlow = testPdfExportFlow;
window.renderTicketArchives = renderTicketArchives;
window.deleteArchiveTicket = deleteArchiveTicket;
window.openArchiveModal = openArchiveModal;
window.closeArchiveModal = closeArchiveModal;
window.reexportArchiveToPDF = reexportArchiveToPDF;
window.openExpensesModal = openExpensesModal;
window.closeExpensesModal = closeExpensesModal;
window.openRevenuesModal = openRevenuesModal;
window.closeRevenuesModal = closeRevenuesModal;
window.openChargesModal = openChargesModal;
window.closeChargesModal = closeChargesModal;
window.updateCochonBadge = updateCochonBadge;
window.renderCochonSVG = renderCochonSVG;
window.openCochonModal = openCochonModal;
window.closeCochonModal = closeCochonModal;
window.renderCochonModal = renderCochonModal;
window.startCochonConfetti = startCochonConfetti;
window.stopCochonConfetti = stopCochonConfetti;
window.cochonSliderStep = cochonSliderStep;
window.onCochonSliderChange = onCochonSliderChange;
window.cochonAction = cochonAction;
window.toggleCochonMode = toggleCochonMode;
window.resetCochonMode = resetCochonMode;
window.openDebugModal = openDebugModal;
window.closeDebugModal = closeDebugModal;
window.generateDiagnosticReport = generateDiagnosticReport;
window.copyDiagnosticReport = copyDiagnosticReport;
window.copyRawStateJSON = copyRawStateJSON;
window.runDebugSelfTests = runDebugSelfTests;
window.toTitleCase = toTitleCase;
