// ================================
// DOM ELEMENTS
// ================================
const AddInc = document.getElementById("add-income");
const AddExp = document.getElementById("add-expense");
const IncInput = document.getElementById("income-input");
const ExpInput = document.getElementById("expense-input");
const ExpDesc = document.getElementById("expense-description");
const IncDesc = document.getElementById("income-description");
const IncList = document.getElementById("income-list");
const ExpList = document.getElementById("expense-list");
const ExpCategory = document.getElementById("expense-category");
const BalanceAmount = document.getElementById("balance-amount");
const GetTotal = document.getElementById("get-total");
const CatTotal = document.getElementById("category-total");

// ================================
// STATE
// ================================
let IncomeList = [];
let ExpenseList = [];
let EditExp = null;
let EditInc = null;

// ================================
// HELPER FUNCTIONS
// ================================

/**
 * Get icon for expense category
 */
function getCategoryIcon(category) {
    const icons = {
        "Food": "🍔",
        "Transportation": "🚗",
        "Utilities": "💡",
        "Entertainment": "🎮",
        "Other": "📦"
    };
    return icons[category] || "📦";
}

/**
 * Get CSS class for category badge
 */
function getCategoryClass(category) {
    const classMap = {
        "Food": "food",
        "Transportation": "transportation",
        "Utilities": "utilities",
        "Entertainment": "entertainment",
        "Other": "other"
    };
    return classMap[category] || "other";
}

/**
 * Update balance display with animation
 */
function updateBalanceDisplay() {
    const totalIncome = IncomeList.reduce((total, income) => total + income.amount, 0);
    const totalExpense = ExpenseList.reduce((total, expense) => total + expense.amount, 0);
    const balance = totalIncome - totalExpense;

    // Animate balance with pop effect
    BalanceAmount.classList.remove("positive", "negative");

    // Trigger animation
    BalanceAmount.style.animation = "none";
    setTimeout(() => {
        BalanceAmount.style.animation = "";
    }, 10);

    // Add color class
    if (balance > 0) {
        BalanceAmount.classList.add("positive");
    } else if (balance < 0) {
        BalanceAmount.classList.add("negative");
    }

    BalanceAmount.textContent = `$${Math.abs(balance).toFixed(2)}`;
}


/**
 * Render income list
 */
function renderIncomeList() {
    IncList.innerHTML = "";
    IncomeList.forEach((income) => {
        const row = document.createElement("tr");

        const descCell = document.createElement("td");
        descCell.textContent = income.description;

        const amountCell = document.createElement("td");
        amountCell.textContent = `$${income.amount.toFixed(2)}`;

        const editCell = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
            EditInc = income;
            IncInput.value = income.amount;
            IncDesc.value = income.description;
            AddInc.textContent = "Update Income";
        });
        editCell.appendChild(editButton);

        const deleteCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            IncomeList = IncomeList.filter((item) => item.id !== income.id);
            renderIncomeList();
            calculateTotalIncome();
            updateBalanceDisplay();
        });
        deleteCell.appendChild(deleteButton);

        row.appendChild(descCell);
        row.appendChild(amountCell);
        row.appendChild(editCell);
        row.appendChild(deleteCell);
        IncList.appendChild(row);
    });

    calculateTotalIncome();
}

/**
 * Calculate and display total income
 */
function calculateTotalIncome() {
    const totalIncome = IncomeList.reduce((total, income) => total + income.amount, 0);
    document.getElementById("total-income").textContent = `$${totalIncome.toFixed(2)}`;
}

/**
 * Render expense list
 */
function renderExpenseList() {
    ExpList.innerHTML = "";
    ExpenseList.forEach((expense) => {
        const row = document.createElement("tr");

        const descCell = document.createElement("td");
        descCell.textContent = expense.description;

        const categoryCell = document.createElement("td");
        const badge = document.createElement("span");
        badge.className = `badge ${getCategoryClass(expense.category)}`;
        badge.innerHTML = `${getCategoryIcon(expense.category)} ${expense.category}`;
        categoryCell.appendChild(badge);

        const amountCell = document.createElement("td");
        amountCell.textContent = `$${expense.amount.toFixed(2)}`;

        const deleteCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            ExpenseList = ExpenseList.filter((item) => item.id !== expense.id);
            renderExpenseList();
            calculateTotalExpense();
            updateBalanceDisplay();
        });
        deleteCell.appendChild(deleteButton);

        const editCell = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
            EditExp = expense;
            ExpInput.value = expense.amount;
            ExpDesc.value = expense.description;
            ExpCategory.value = expense.category;
            AddExp.textContent = "Update Expenses";
        });
        editCell.appendChild(editButton);

        row.appendChild(descCell);
        row.appendChild(amountCell);
        row.appendChild(categoryCell);
        row.appendChild(deleteCell);
        row.appendChild(editCell);
        ExpList.appendChild(row);
    });

    calculateTotalExpense();
}

/**
 * Calculate and display total expense
 */
function calculateTotalExpense() {
    const totalExpense = ExpenseList.reduce((total, expense) => total + expense.amount, 0);
    document.getElementById("total-expense").textContent = `$${totalExpense.toFixed(2)}`;
}

// ================================
// EVENT LISTENERS
// ================================

/**
 * Add/Update Income
 */
AddInc.addEventListener("click", (e) => {
    e.preventDefault();

    const IncInputValue = parseFloat(IncInput.value);
    const IncDescValue = IncDesc.value.trim();

    if (isNaN(IncInputValue) || IncDescValue === "" || IncInputValue <= 0) {
        alert("Please enter a valid income amount and description.");
        return;
    }

    if (EditInc) {
        // UPDATE EXISTING
        IncomeList = IncomeList.map(item => {
            if (item.id === EditInc.id) {
                return {
                    ...item,
                    description: IncDescValue,
                    amount: IncInputValue
                };
            }
            return item;
        });
        EditInc = null;
        AddInc.textContent = "Add Income";
    } else {
        // ADD NEW
        IncomeList.push({
            id: Date.now(),
            description: IncDescValue,
            amount: IncInputValue
        });
    }

    // Clear inputs
    IncInput.value = "";
    IncDesc.value = "";

    // Update UI
    renderIncomeList();
    updateBalanceDisplay();
});

/**
 * Add/Update Expense
 */
AddExp.addEventListener("click", (e) => {
    e.preventDefault();

    const ExpInputValue = parseFloat(ExpInput.value);
    const ExpDescValue = ExpDesc.value.trim();
    const ExpCategoryValue = ExpCategory.value;

    if (isNaN(ExpInputValue) || ExpDescValue === "" || ExpInputValue <= 0) {
        alert("Please enter a valid expense amount and description.");
        return;
    }

    if (EditExp) {
        // UPDATE EXISTING
        ExpenseList = ExpenseList.map(item => {
            if (item.id === EditExp.id) {
                return {
                    ...item,
                    description: ExpDescValue,
                    amount: ExpInputValue,
                    category: ExpCategoryValue
                };
            }
            return item;
        });
        EditExp = null;
        AddExp.textContent = "Add Expense";
    } else {
        // ADD NEW
        ExpenseList.push({
            id: Date.now(),
            description: ExpDescValue,
            amount: ExpInputValue,
            category: ExpCategoryValue
        });
    }

    // Clear inputs
    ExpInput.value = "";
    ExpDesc.value = "";

    // Update UI
    renderExpenseList();
    updateBalanceDisplay();
});

/**
 * Get category total
 */
GetTotal.addEventListener("click", () => {
    const selectedCategory = CatTotal.value;
    if (selectedCategory === "") {
        alert("Please select a category.");
        return;
    }
    const categoryTotal = ExpenseList
        .filter(expense => expense.category === selectedCategory)
        .reduce((total, expense) => total + expense.amount, 0);
    document.getElementById("category-total-amount").innerHTML = `Total spent on ${selectedCategory}: $${categoryTotal.toFixed(2)}`;
});

// ================================
// INITIALIZE
// ================================
updateBalanceDisplay();