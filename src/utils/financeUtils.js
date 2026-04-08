export const INCOME_CATEGORIES = [
    'Salary / Wages',
    'Freelance / Gig',
    'Investment Return',
    'Other Income'
];

export const EXPENSE_CATEGORIES = [
    'Food & Dining',
    'Rent & Housing',
    'Transport',
    'Entertainment',
    'Bills & Utilities',
    'Others'
];

// Returns all categories for validation fallback
export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES, 'Debt Payment', 'Savings Transfer', 'Savings Withdrawal'];

/**
 * Validates and maps a category to the closest predefined enum, or 'Others'/'Other Income'
 */
export const standardizeCategory = (type, category) => {
    if (type === 'income' && !INCOME_CATEGORIES.includes(category)) return 'Other Income';
    if (type === 'expense' && !EXPENSE_CATEGORIES.includes(category)) return 'Others';
    if (type === 'saving' || type === 'transfer') return category || 'Savings Transfer';
    if (type === 'debt') return category || 'Debt Payment';
    return category; // fallback
};

/**
 * Computes running balance across all transactions sequentially from oldest to newest.
 * Mutates/creates a mapped array of transactions with a 'runningBalance' field.
 */
export const computeRunningBalance = (transactions) => {
    // Sort oldest to newest (use ID as secondary chronological tie-breaker)
    const sorted = [...transactions].sort((a, b) => {
        const dateDiff = new Date(a.date) - new Date(b.date);
        return dateDiff !== 0 ? dateDiff : a.id - b.id; 
    });
    
    let currentBalance = 0;
    
    const mapped = sorted.map(t => {
        const amt = Number(t.amount);
        if (!isNaN(amt)) {
            if (t.type === 'income') currentBalance += amt;
            else if (t.type === 'expense') currentBalance -= amt;
            else if (t.type === 'saving') currentBalance -= amt; // taking out of liquid
            else if (t.type === 'transfer') currentBalance += amt; // withdrawing from savings TO liquid
            else if (t.type === 'debt') currentBalance -= amt; // paying debt out of liquid
        }
        return { ...t, runningBalance: currentBalance };
    });
    
    // Sort back to newest first for UI display
    return mapped.sort((a, b) => {
        const dateDiff = new Date(b.date) - new Date(a.date);
        return dateDiff !== 0 ? dateDiff : b.id - a.id;
    });
};

/**
 * Computes metrics given ANY array of transactions (global or filtered).
 */
export const calculateMetrics = (txList) => {
    let income = 0;
    let expenses = 0;
    let savings = 0;
    let debtPayments = 0;
    let transfers = 0; // withdrawals
    const categorySpend = {};

    txList.forEach(t => {
        if (!t || isNaN(t.amount)) return;
        const amt = Number(t.amount);
        
        if (t.type === 'income') {
            income += amt;
        } else if (t.type === 'expense') {
            expenses += amt;
            categorySpend[t.category] = (categorySpend[t.category] || 0) + amt;
        } else if (t.type === 'saving') {
            savings += amt;
        } else if (t.type === 'transfer') {
            transfers += amt; // Withdrawal from savings reduces total global savings, increases liquid
        } else if (t.type === 'debt') {
            debtPayments += amt;
        }
    });

    const balance = (income + transfers) - expenses - savings - debtPayments;

    return { 
        income, 
        expenses, 
        savings, // Total contributions in this window
        transfers, // Total withdrawals in this window
        debtPayments, 
        balance,
        categorySpend
    };
};

/**
 * Calculates percentage change between previous and current metric.
 * Uses user's specified edge case logic for previous === 0.
 */
export const calculatePercentageChange = (current, previous) => {
    if (previous === 0) {
        return current === 0 ? 0 : 100;
    }
    return ((current - previous) / Math.abs(previous)) * 100;
};

/**
 * Export Utility Formatters
 */
export const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric' 
    });
};

export const getLocalDateString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const exportDataAsJSON = (data) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `finance_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};

export const exportDataAsCSV = (transactions) => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Currency'];
    
    const rows = transactions.map(t => {
        return [
            t.date,
            `"${(t.desc || '').replace(/"/g, '""')}"`,
            `"${(t.category || '').replace(/"/g, '""')}"`,
            t.type,
            t.amount,
            'INR'
        ].join(',');
    });
    
    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(',') + '\n'
        + rows.join('\n');
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
};
