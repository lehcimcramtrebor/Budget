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
    settings: {
        username: "",
        genderTheme: "masculin"
    }
};

let hasUnsavedChanges = false;

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    initDatabase();
    initUI();
    registerServiceWorker();
    initPWAInstall();
    initStoragePersistence();
});

function initDatabase() {
    const savedState = localStorage.getItem("budget_hmr_simple");
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            if (Array.isArray(parsed.revenues)) {
                state.revenues = parsed.revenues;
            } else if (typeof parsed.baseBudget === 'number') {
                state.revenues = [{ id: "r1", title: "Revenu Principal", amount: parsed.baseBudget }];
            }
            if (Array.isArray(parsed.fixedCharges)) state.fixedCharges = parsed.fixedCharges;
            if (Array.isArray(parsed.expenses)) state.expenses = parsed.expenses;
            if (typeof parsed.darkMode === 'boolean') state.darkMode = parsed.darkMode;
            if (parsed.settings) {
                state.settings = { ...state.settings, ...parsed.settings };
            }
            if (!state.settings.genderTheme) {
                state.settings.genderTheme = "masculin";
            }
        } catch (e) {
            console.error("Erreur lors de la lecture du localStorage", e);
        }
    } else {
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

    // Apply visual theme
    applyVisualTheme();

    // Display current date month
    const currentMonthLabel = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    document.getElementById("current_date_label").innerText = currentMonthLabel;

    updateQuickSaveUI();

    updateUI();
}

function saveState() {
    localStorage.setItem("budget_hmr_simple", JSON.stringify(state));
    hasUnsavedChanges = true;
    updateQuickSaveUI();
}

// --- CORE LOGIC & CALCULATIONS ---
function updateUI() {
    const totalRevenues = state.revenues.reduce((sum, r) => sum + r.amount, 0);
    const totalFixed = state.fixedCharges.reduce((sum, c) => sum + c.amount, 0);
    const totalExpenses = state.expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = totalRevenues - totalFixed - totalExpenses;

    // Display totals
    document.getElementById("remaining_balance_disp").innerText = formatCurrency(remaining);
    document.getElementById("base_budget_disp").innerText = formatCurrency(totalRevenues);
    document.getElementById("fixed_charges_disp").innerText = formatCurrency(totalFixed);
    document.getElementById("expenses_disp").innerText = formatCurrency(totalExpenses);

    // Apply color themes
    const htmlEl = document.documentElement;
    if (remaining < 0) {
        htmlEl.setAttribute("data-theme", "alerte");
    } else if (remaining < 150) {
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
        const isRefund = e.amount < 0;
        const absAmount = Math.abs(e.amount);
        const amountColor = isRefund ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400";
        const amountSign = isRefund ? "+" : "-";

        const item = document.createElement("div");
        item.className = "flex items-center justify-between p-3 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-2xl border border-stone-200/40 dark:border-stone-800/60 shadow-sm transition-all";
        item.innerHTML = `
            <div onclick="openEditItem('expense', '${e.id}')" class="min-w-0 pr-2 flex-1 cursor-pointer group/item-click">
                <div class="font-bold text-sm text-stone-800 dark:text-stone-100 truncate group-hover/item-click:text-brand-500 transition-colors">${e.title}</div>
                <div class="text-[9px] font-semibold text-stone-400 dark:text-stone-500 mt-0.5">${e.date} <span class="text-[8px] font-bold text-brand-500 opacity-0 group-hover/item-click:opacity-100 transition-all ml-1.5">✏️ Modifier</span></div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <span class="font-black text-sm ${amountColor}">${amountSign} ${absAmount.toFixed(2).replace('.', ',')} €</span>
                <button onclick="deleteExpense('${e.id}')" class="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-red-100 dark:hover:bg-red-950/20 text-stone-400 hover:text-red-500 dark:hover:text-red-450 transition-all flex items-center justify-center font-bold text-xs" title="Supprimer">
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
        item.className = "flex items-center justify-between p-2.5 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200/40 dark:border-stone-800/40";
        item.innerHTML = `
            <div onclick="openEditItem('fixedCharge', '${c.id}')" class="min-w-0 pr-2 flex-1 cursor-pointer group/item-click">
                <span class="font-semibold text-xs text-stone-700 dark:text-stone-300 truncate block group-hover/item-click:text-brand-500 transition-colors">${c.title} <span class="text-[8px] font-bold text-brand-500 opacity-0 group-hover/item-click:opacity-100 transition-all ml-1">✏️</span></span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <span class="font-bold text-xs text-stone-600 dark:text-stone-400">${c.amount.toFixed(2)} €</span>
                <button onclick="deleteFixedCharge('${c.id}')" class="w-6 h-6 rounded-full bg-stone-200/50 hover:bg-red-100 dark:bg-stone-800 dark:hover:bg-red-950/20 text-stone-400 hover:text-red-500 transition-all flex items-center justify-center font-bold text-[9px]" title="Supprimer">
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
        item.className = "flex items-center justify-between p-2.5 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200/40 dark:border-stone-800/40";
        item.innerHTML = `
            <div onclick="openEditItem('revenue', '${r.id}')" class="min-w-0 pr-2 flex-1 cursor-pointer group/item-click">
                <span class="font-semibold text-xs text-stone-700 dark:text-stone-300 truncate block group-hover/item-click:text-brand-500 transition-colors">${r.title} <span class="text-[8px] font-bold text-brand-500 opacity-0 group-hover/item-click:opacity-100 transition-all ml-1">✏️</span></span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <span class="font-bold text-xs text-stone-600 dark:text-stone-400">${r.amount.toFixed(2)} €</span>
                <button onclick="deleteRevenue('${r.id}')" class="w-6 h-6 rounded-full bg-stone-200/50 hover:bg-red-100 dark:bg-stone-800 dark:hover:bg-red-950/20 text-stone-400 hover:text-red-500 transition-all flex items-center justify-center font-bold text-[9px]" title="Supprimer">
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

    const dayStr = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

    const newExpense = {
        id: Date.now().toString(),
        title,
        amount,
        date: dayStr
    };

    state.expenses.push(newExpense);
    saveState();
    expensesCollapsed = false; // Auto-expand when adding new
    updateUI();

    // Clear Inputs
    titleInput.value = "";
    amountInput.value = "";
    titleInput.focus();
}

function deleteExpense(id) {
    const expense = state.expenses.find(e => e.id === id);
    if (!expense) return;

    const isRefund = expense.amount < 0;
    const absAmount = Math.abs(expense.amount);
    const titleWord = isRefund ? "le remboursement" : "la dépense";
    const emoji = isRefund ? "💵" : "🗑️";

    showGenericConfirm(
        isRefund ? "Supprimer le remboursement ?" : "Supprimer la dépense ?",
        `Voulez-vous vraiment supprimer ${titleWord} <strong>"${expense.title}"</strong> de <strong>${absAmount.toFixed(2).replace('.', ',')} €</strong> ?`,
        emoji,
        () => {
            state.expenses = state.expenses.filter(e => e.id !== id);
            saveState();
            updateUI();
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
        form.classList.add("animate-shake");
        setTimeout(() => form.classList.remove("animate-shake"), 400);
        return;
    }

    showGenericConfirm(
        "Enregistrer un remboursement ?",
        `Voulez-vous vraiment enregistrer le remboursement de <strong>${formatCurrency(amount)}</strong> pour <strong>"${title}"</strong> ?`,
        "💵",
        () => {
            const dayStr = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
            const newRefund = {
                id: Date.now().toString(),
                title,
                amount: -amount,
                date: dayStr
            };
            state.expenses.push(newRefund);
            saveState();
            expensesCollapsed = false; // Auto-expand
            updateUI();

            // Clear inputs
            titleInput.value = "";
            amountInput.value = "";
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

        // Clear Inputs
        titleInput.value = "";
        amountInput.value = "";
    }
}

function deleteFixedCharge(id) {
    const charge = state.fixedCharges.find(c => c.id === id);
    if (!charge) return;
    showGenericConfirm(
        "Supprimer le frais fixe ?",
        `Voulez-vous vraiment supprimer le frais fixe <strong>"${charge.title}"</strong> de <strong>${charge.amount.toFixed(2)} €</strong> ?`,
        "🗑️",
        () => {
            state.fixedCharges = state.fixedCharges.filter(c => c.id !== id);
            saveState();
            updateUI();
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

        // Clear Inputs
        titleInput.value = "";
        amountInput.value = "";
    }
}

function deleteRevenue(id) {
    const revenue = state.revenues.find(r => r.id === id);
    if (!revenue) return;
    showGenericConfirm(
        "Supprimer le revenu ?",
        `Voulez-vous vraiment supprimer le revenu <strong>"${revenue.title}"</strong> de <strong>${revenue.amount.toFixed(2)} €</strong> ?`,
        "🗑️",
        () => {
            state.revenues = state.revenues.filter(r => r.id !== id);
            saveState();
            updateUI();
        }
    );
}

// --- RENEW MONTHLY BUDGET ---
function confirmReset() {
    const modal = document.getElementById("confirm_modal");
    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.querySelector(".glass-card").classList.remove("scale-95");
    }, 10);
}

function closeConfirmModal() {
    const modal = document.getElementById("confirm_modal");
    modal.classList.add("opacity-0");
    modal.querySelector(".glass-card").classList.add("scale-95");
    setTimeout(() => {
        modal.classList.add("hidden");
    }, 300);
}

function resetBudget() {
    state.expenses = [];
    saveState();
    updateUI();
    closeConfirmModal();
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
            btnMasculin.classList.add("bg-stone-50/50", "border-stone-200", "text-stone-400", "hover:bg-stone-100", "dark:bg-stone-900/50", "dark:border-stone-800", "dark:text-stone-500", "dark:hover:bg-stone-850");
        } else {
            btnMasculin.classList.add("bg-indigo-50", "border-indigo-200", "text-indigo-600", "hover:bg-indigo-100/70", "dark:bg-indigo-950/30", "dark:border-indigo-900/50", "dark:text-indigo-400", "dark:hover:bg-indigo-950/50");
            btnFeminin.classList.add("bg-stone-50/50", "border-stone-200", "text-stone-400", "hover:bg-stone-100", "dark:bg-stone-900/50", "dark:border-stone-800", "dark:text-stone-500", "dark:hover:bg-stone-850");
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

function showGenericConfirm(title, message, icon, confirmCallback) {
    document.getElementById("generic_confirm_title").innerText = title;
    document.getElementById("generic_confirm_message").innerHTML = message;
    document.getElementById("generic_confirm_icon").innerText = icon;
    
    activeConfirmCallback = confirmCallback;

    const modal = document.getElementById("generic_confirm_modal");
    modal.classList.remove("hidden");
    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.querySelector(".glass-card").classList.remove("scale-95");
    }, 10);
}

function closeGenericConfirmModal() {
    const modal = document.getElementById("generic_confirm_modal");
    modal.classList.add("opacity-0");
    modal.querySelector(".glass-card").classList.add("scale-95");
    setTimeout(() => {
        modal.classList.add("hidden");
        activeConfirmCallback = null;
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

// --- EDIT MODAL CONTROL ---
let currentEditingItem = null;

function openEditItem(type, id) {
    let item = null;
    let modalTitle = "";

    if (type === "expense") {
        item = state.expenses.find(e => e.id === id);
        if (item) {
            modalTitle = item.amount < 0 ? "Modifier le remboursement" : "Modifier la dépense";
        }
    } else if (type === "fixedCharge") {
        item = state.fixedCharges.find(c => c.id === id);
        modalTitle = "Modifier le frais fixe";
    } else if (type === "revenue") {
        item = state.revenues.find(r => r.id === id);
        modalTitle = "Modifier le revenu";
    }

    if (!item) return;

    currentEditingItem = { type, id };

    document.getElementById("edit_modal_title").innerText = modalTitle;
    document.getElementById("edit_title").value = item.title;
    
    const absAmount = Math.abs(item.amount);
    document.getElementById("edit_amount").value = absAmount.toFixed(2).replace(".", ",");

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

    const { type, id } = currentEditingItem;
    const titleInput = document.getElementById("edit_title");
    const amountInput = document.getElementById("edit_amount");

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

    saveState();
    closeEditModal();
    updateUI();
}



// --- SETTINGS MODAL CONTROL ---
function openSettingsModal() {
    // Populate username input
    document.getElementById("settings_username").value = state.settings.username || "";
    
    // Apply theme selection styling to settings buttons
    applyVisualTheme();

    const modal = document.getElementById("settings_modal");
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
        title: 'BUDGETHMR — Mon Budget Simplifié',
        text: 'Découvre BUDGETHMR, l\'application web PWA ultra-simple et gratuite pour suivre ton budget mensuel et ton reste à vivre en temps réel !',
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
    saveState();
    updateUI();
}

async function exportJSONData() {
    const jsonString = JSON.stringify(state, null, 2);
    const defaultFileName = `budget_hmr_backup_${new Date().toISOString().substring(0, 10)}.json`;

    // Try using File System Access API (showSaveFilePicker)
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
    }
}

function importJSONData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if ((typeof imported.baseBudget === 'number' || Array.isArray(imported.revenues)) && Array.isArray(imported.fixedCharges) && Array.isArray(imported.expenses)) {
                if (Array.isArray(imported.revenues)) {
                    state.revenues = imported.revenues;
                } else {
                    state.revenues = [{ id: "r1", title: "Revenu Principal", amount: imported.baseBudget }];
                }
                state.fixedCharges = imported.fixedCharges;
                state.expenses = imported.expenses;
                if (typeof imported.darkMode === 'boolean') state.darkMode = imported.darkMode;
                if (imported.settings) state.settings = { ...state.settings, ...imported.settings };

                saveState();
                initUI();
                closeSettingsModal();
                showGenericAlert("Import réussi", "Vos données de budget ont été importées avec succès !", "📥");
            } else {
                showGenericAlert("Format invalide", "Le format du fichier JSON n'est pas valide pour BUDGETHMR.", "⚠️");
            }
        } catch (err) {
            showGenericAlert("Erreur de lecture", "Erreur lors de la lecture du fichier : " + err.message, "❌");
        }
    };
    reader.readAsText(file);
}

function clearDatabase() {
    showGenericConfirm(
        "Réinitialiser l'application ?",
        "Voulez-vous vraiment supprimer TOUTES les données ? Vos dépenses, vos frais fixes et vos réglages seront effacés.",
        "🗑️",
        () => {
            localStorage.removeItem("budget_hmr_simple");
            state.revenues = [{ id: "r1", title: "Salaire", amount: 2000 }];
            state.fixedCharges = [];
            state.expenses = [];
            state.darkMode = true;
            state.settings = { username: "", genderTheme: "masculin" };
            
            saveState();
            initUI();
            closeSettingsModal();
        }
    );
}


// --- INTERACTIVE TOUR LOGIC ---
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
        elementId: "expense_form",
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
        message: "Accédez à ce menu pour changer votre prénom, faire des sauvegardes JSON manuelles, charger des données de test ou relancer ce guide !",
        placement: "left"
    }
];

function startTour() {
    closeSettingsModal();
    currentTourStep = 0;
    
    // Auto expand all collapsible sections to make sure highlights work and items are visible
    revenuesCollapsed = false;
    expensesCollapsed = false;
    fixedChargesCollapsed = false;
    updateUI();

    const overlay = document.getElementById("tour_overlay");
    const tooltip = document.getElementById("tour_tooltip");
    
    if (overlay && tooltip) {
        overlay.classList.remove("hidden");
        tooltip.classList.remove("hidden");
        tooltip.classList.add("z-[70]"); // ensure it is above overlay
        
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
        el.classList.remove("tour-highlight", "ring-4", "ring-brand-500", "dark:ring-brand-400", "animate-pulse", "z-[60]", "relative");
    });

    const isVisible = target && (target.offsetWidth > 0 || target.offsetHeight > 0);

    if (target && isVisible) {
        // Scroll target into view
        target.scrollIntoView({ behavior: "smooth", block: "center" });

        // Highlight target
        target.classList.add("tour-highlight", "ring-4", "ring-brand-500", "dark:ring-brand-400", "animate-pulse", "z-[60]", "relative");

        // Position tooltip
        setTimeout(() => {
            const rect = target.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            let top = 0;
            let left = 0;

            if (step.placement === "bottom") {
                top = rect.bottom + 12;
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            } else if (step.placement === "top") {
                top = rect.top - tooltipRect.height - 12;
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            } else if (step.placement === "left") {
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                left = rect.left - tooltipRect.width - 12;
            } else if (step.placement === "right") {
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                left = rect.right + 12;
            }

            // Adjust bounds (keep on screen)
            const margin = 16;
            left = Math.max(margin, Math.min(left, window.innerWidth - tooltipRect.width - margin));
            top = Math.max(margin, Math.min(top, window.innerHeight - tooltipRect.height - margin));

            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
            tooltip.style.transform = ""; // clear center transform fallback if any
            
            tooltip.classList.remove("opacity-0", "scale-95");
        }, 400);
    } else {
        // Fallback: center of screen
        tooltip.style.top = "50%";
        tooltip.style.left = "50%";
        tooltip.style.transform = "translate(-50%, -50%) scale(1)";
        tooltip.classList.remove("opacity-0", "scale-95");
    }
}

function nextTourStep() {
    currentTourStep++;
    showTourStep();
}

function endTour() {
    const overlay = document.getElementById("tour_overlay");
    const tooltip = document.getElementById("tour_tooltip");

    if (overlay) overlay.classList.add("hidden");
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
        el.classList.remove("tour-highlight", "ring-4", "ring-brand-500", "dark:ring-brand-400", "animate-pulse", "z-[60]", "relative");
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
    
    if (persisted === null) {
        badge.innerText = "Non supporté";
        badge.className = "text-[10px] font-black px-2 py-0.5 rounded-full bg-stone-150 dark:bg-stone-800 text-stone-550 dark:text-stone-400 border border-stone-200 dark:border-stone-750";
        desc.innerHTML = "Votre navigateur actuel ne supporte pas la protection du stockage. Vos données risquent d'être effacées automatiquement par l'OS en cas d'espace faible. Pensez à exporter régulièrement vos données au format JSON.";
        btn.classList.add("hidden");
    } else if (persisted) {
        badge.innerText = "🛡️ Protégé";
        badge.className = "text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30";
        desc.innerHTML = "<strong>Statut persistant activé !</strong> Le navigateur a accepté de sécuriser le stockage local. Vos données ne seront pas supprimées automatiquement, même en cas de stockage faible.";
        btn.classList.add("hidden");
    } else {
        badge.innerText = "⚠️ Temporaire";
        badge.className = "text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-605 dark:text-amber-450 border border-amber-250/50 dark:border-amber-900/30";
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
    const btn = document.getElementById("btn_quick_save");
    if (!btn) return;

    if (!('showSaveFilePicker' in window)) {
        btn.classList.add("hidden");
        return;
    }

    btn.classList.remove("hidden");

    if (hasUnsavedChanges) {
        btn.classList.add("animate-unsaved");
        btn.setAttribute("title", "Sauvegarde rapide disponible (Modifications non sauvegardées dans le fichier JSON)");
    } else {
        btn.classList.remove("animate-unsaved");
        btn.setAttribute("title", "Sauvegarde rapide (À jour)");
    }
}


