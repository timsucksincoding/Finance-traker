// Initialize transactions from localStorage or empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// DOM Elements
const transactionForm = document.getElementById('transactionForm');
const transactionsList = document.getElementById('transactionsList');
const totalBalance = document.getElementById('totalBalance');
const totalIncome = document.getElementById('totalIncome');
const totalExpenses = document.getElementById('totalExpenses');
const monthlyReport = document.getElementById('monthlyReport');

// Add transaction
transactionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const transaction = {
        id: Date.now(),
        amount: parseFloat(document.getElementById('amount').value),
        type: document.getElementById('type').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        date: new Date().toISOString()
    };
    
    transactions.push(transaction);
    updateLocalStorage();
    updateUI();
    this.reset();
});

// Update localStorage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Update UI
function updateUI() {
    updateTransactionsList();
    updateSummary();
    updateMonthlyReport();
}

// Update transactions list
function updateTransactionsList() {
    transactionsList.innerHTML = '';
    
    const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    sortedTransactions.forEach(transaction => {
        const div = document.createElement('div');
        div.className = 'transaction-item';
        
        div.innerHTML = `
            <div>
                <strong>${transaction.description}</strong>
                <div>${transaction.category}</div>
                <small>${new Date(transaction.date).toLocaleDateString()}</small>
            </div>
            <div class="${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'}$${Math.abs(transaction.amount).toFixed(2)}
            </div>
        `;
        
        transactionsList.appendChild(div);
    });
}

// Update summary
function updateSummary() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expenses;
    
    totalBalance.textContent = `$${balance.toFixed(2)}`;
    totalIncome.textContent = `$${income.toFixed(2)}`;
    totalExpenses.textContent = `$${expenses.toFixed(2)}`;
}

// Update monthly report
function updateMonthlyReport() {
    const monthlyData = transactions.reduce((acc, transaction) => {
        const date = new Date(transaction.date);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        if (!acc[monthYear]) {
            acc[monthYear] = { income: 0, expenses: 0 };
        }
        
        if (transaction.type === 'income') {
            acc[monthYear].income += transaction.amount;
        } else {
            acc[monthYear].expenses += transaction.amount;
        }
        
        return acc;
    }, {});

    monthlyReport.innerHTML = '';
    
    Object.entries(monthlyData).forEach(([month, data]) => {
        const div = document.createElement('div');
        div.className = 'month-data';
        
        div.innerHTML = `
            <strong>${month}</strong>
            <div>Income: $${data.income.toFixed(2)}</div>
            <div>Expenses: $${data.expenses.toFixed(2)}</div>
            <div>Balance: $${(data.income - data.expenses).toFixed(2)}</div>
        `;
        
        monthlyReport.appendChild(div);
    });
}

// Initial UI update
updateUI();
