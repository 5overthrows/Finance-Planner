import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { computeRunningBalance, calculateMetrics, standardizeCategory, getLocalDateString } from '../utils/financeUtils';

// Create the context
const AppContext = createContext();

// Create a custom hook for easier context usage
export const useAppContext = () => useContext(AppContext);

// Initial default data containing ONLY the single source of truth structure
const CURRENT_VERSION = 4; // Incremented to force demo data load
const defaultData = {
  version: CURRENT_VERSION,
  debts: [
    { id: 101, name: 'Student Loan', balance: 500000, rate: 8.5, payment: 10000 },
    { id: 102, name: 'Car Loan', balance: 350000, rate: 9.0, payment: 8000 }
  ],
  budget: {
    'Food & Dining': 12000,
    'Rent & Housing': 15000,
    'Transport': 4000,
    'Entertainment': 3000,
    'Bills & Utilities': 5000,
    'Others': 2000
  },
  goals: [
    { id: 201, name: 'Emergency Fund', icon: 'fa-shield-alt', target: 200000, deadline: '2026-12-31' },
    { id: 202, name: 'Vacation', icon: 'fa-plane', target: 50000, deadline: '2026-06-30' }
  ],
  transactions: [
    // --- JAN 2026 ---
    { id: 1001, type: 'income', amount: 45000, category: 'Salary / Wages', date: '2026-01-01', desc: 'TechCorp Salary', refId: null },
    { id: 1002, type: 'expense', amount: 15000, category: 'Rent & Housing', date: '2026-01-02', desc: 'Monthly Rent', refId: null },
    { id: 1003, type: 'expense', amount: 3500, category: 'Transport', date: '2026-01-05', desc: 'Fuel & Transit', refId: null },
    { id: 1004, type: 'expense', amount: 11000, category: 'Food & Dining', date: '2026-01-15', desc: 'Groceries & Dining', refId: null },
    { id: 1005, type: 'expense', amount: 2500, category: 'Entertainment', date: '2026-01-20', desc: 'Movies & Subs', refId: null },
    { id: 1006, type: 'saving', amount: 5000, category: 'Savings Transfer', date: '2026-01-25', desc: 'Emergency Fund Deposit', refId: 201 },
    { id: 1007, type: 'debt', amount: 8000, category: 'Debt Payment', date: '2026-01-28', desc: 'Car Loan EMI', refId: 102 },
    // --- FEB 2026 ---
    { id: 1008, type: 'income', amount: 48000, category: 'Salary / Wages', date: '2026-02-01', desc: 'TechCorp Salary (+Bonus)', refId: null },
    { id: 1009, type: 'expense', amount: 15000, category: 'Rent & Housing', date: '2026-02-02', desc: 'Monthly Rent', refId: null },
    { id: 1010, type: 'expense', amount: 4200, category: 'Bills & Utilities', date: '2026-02-06', desc: 'Electricity & Internet', refId: null },
    { id: 1011, type: 'expense', amount: 10500, category: 'Food & Dining', date: '2026-02-14', desc: 'Groceries & Valentine Dinner', refId: null },
    { id: 1012, type: 'expense', amount: 3800, category: 'Entertainment', date: '2026-02-18', desc: 'Concert Tickets', refId: null },
    { id: 1013, type: 'expense', amount: 3000, category: 'Transport', date: '2026-02-22', desc: 'Fuel', refId: null },
    { id: 1014, type: 'debt', amount: 10000, category: 'Debt Payment', date: '2026-02-26', desc: 'Student Loan EMI', refId: 101 },
    // --- MAR 2026 ---
    { id: 1015, type: 'income', amount: 45000, category: 'Salary / Wages', date: '2026-03-01', desc: 'TechCorp Salary', refId: null },
    { id: 1016, type: 'income', amount: 12000, category: 'Freelance / Gig', date: '2026-03-05', desc: 'UI Design Project', refId: null },
    { id: 1017, type: 'expense', amount: 15000, category: 'Rent & Housing', date: '2026-03-03', desc: 'Monthly Rent', refId: null },
    { id: 1018, type: 'expense', amount: 4800, category: 'Bills & Utilities', date: '2026-03-07', desc: 'Utilities & Subscriptions', refId: null },
    { id: 1019, type: 'expense', amount: 13000, category: 'Food & Dining', date: '2026-03-15', desc: 'Groceries & Parties', refId: null },
    { id: 1020, type: 'expense', amount: 4500, category: 'Transport', date: '2026-03-18', desc: 'Car Servicing & Fuel', refId: null },
    { id: 1021, type: 'expense', amount: 2000, category: 'Entertainment', date: '2026-03-22', desc: 'Weekend Hangout', refId: null },
    { id: 1022, type: 'saving', amount: 10000, category: 'Savings Transfer', date: '2026-03-25', desc: 'Vacation Fund', refId: 202 },
    { id: 1023, type: 'debt', amount: 8000, category: 'Debt Payment', date: '2026-03-28', desc: 'Car Loan EMI', refId: 102 },
    // --- APR 2026 (Current) ---
    { id: 1024, type: 'income', amount: 45000, category: 'Salary / Wages', date: '2026-04-01', desc: 'TechCorp Salary', refId: null },
    { id: 1025, type: 'expense', amount: 15000, category: 'Rent & Housing', date: '2026-04-01', desc: 'Monthly Rent', refId: null },
    { id: 1026, type: 'expense', amount: 1500, category: 'Food & Dining', date: '2026-04-02', desc: 'Supermarket Run', refId: null },
    { id: 1027, type: 'expense', amount: 500, category: 'Transport', date: '2026-04-02', desc: 'Uber Ride', refId: null }
  ].sort((a, b) => new Date(b.date) - new Date(a.date)) // Newest first
};

export const AppProvider = ({ children }) => {
  // Safe LocalStorage Load
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('finplan_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Force reload demo data on version mismatch
        if (parsed.version !== CURRENT_VERSION) {
            console.warn("Outdated data version detected. Resetting to version 4 demo data.");
            return defaultData;
        }
        return parsed;
      }
    } catch (e) {
      console.error("Corrupted localStorage data. Falling back to default.", e);
    }
    return defaultData;
  });

  // Track the Selected Month (YYYY-MM format). Default to actual system current month.
  const [currentMonth, setCurrentMonth] = useState(() => {
     const now = new Date();
     return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Save to LocalStorage intelligently
  useEffect(() => {
    localStorage.setItem('finplan_data', JSON.stringify(data));
  }, [data]);

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const clearData = () => {
    localStorage.removeItem('finplan_data');
    setData(defaultData);
  };

  const formatCurrency = (amount) => {
    if (isNaN(amount) || amount === undefined || amount === null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
  };

  // --------------------------------------------------------------------------------
  // CORE EVENT SOURCING CALCULATIONS (Single Source of Truth)
  // --------------------------------------------------------------------------------

  // 0. GLOBALLY COMPUTED RUNNING BALANCES (Oldest to Newest logic -> Returns Newest to Oldest)
  const computedTransactions = useMemo(() => {
      return computeRunningBalance(data.transactions || []);
  }, [data.transactions]);

  // 1. ALL TIME TOTALS
  const globalMetrics = useMemo(() => {
      return calculateMetrics(computedTransactions);
  }, [computedTransactions]);

  // 2. SELECTED MONTH FILTERS & TOTALS
  const filteredMetrics = useMemo(() => {
      const filtered = computedTransactions.filter(t => t.date && t.date.startsWith(currentMonth));
      const metrics = calculateMetrics(filtered);
      return { ...metrics, transactions: filtered };
  }, [computedTransactions, currentMonth]);

  // 3. PREVIOUS MONTH FILTERS & TOTALS (Analytics)
  const previousMetrics = useMemo(() => {
      const [y, m] = currentMonth.split('-').map(Number);
      let pY = y;
      let pM = m - 1;
      if (pM === 0) { pM = 12; pY -= 1; }
      const prevMonthStr = `${pY}-${String(pM).padStart(2, '0')}`;
      
      const prevFiltered = computedTransactions.filter(t => t.date && t.date.startsWith(prevMonthStr));
      return calculateMetrics(prevFiltered);
  }, [computedTransactions, currentMonth]);

  // 4. GOALS COMPUTATION
  const computedGoals = useMemo(() => {
      return (data.goals || []).map(goal => {
          const savedAmt = computedTransactions.reduce((sum, t) => {
              if (t.refId === goal.id) {
                  if (t.type === 'saving') return sum + t.amount;
                  if (t.type === 'transfer') return sum - t.amount; // Withdrawals
              }
              return sum;
          }, 0);
          return { ...goal, current: savedAmt };
      });
  }, [data.goals, computedTransactions]);

  // 5. DEBTS COMPUTATION
  const computedDebts = useMemo(() => {
      return (data.debts || []).map(debt => {
          const totalPaid = computedTransactions
              .filter(t => t.type === 'debt' && t.refId === debt.id)
              .reduce((sum, t) => sum + t.amount, 0);

          return { ...debt, currentBalance: Math.max(0, debt.balance - totalPaid) };
      });
  }, [data.debts, computedTransactions]);


  // Helper to add ANY transaction safely
  const addTransaction = useCallback((type, amount, category, date, desc, refId = null) => {
      const amt = Number(amount);
      if (isNaN(amt) || amt <= 0) {
          alert("Amount must be a positive number.");
          return false;
      }
      
      const safeCat = standardizeCategory(type, category || type);

      const newTx = {
          id: Date.now(),
          type,
          amount: amt,
          category: safeCat,
          date: date || getLocalDateString(),
          desc: desc || `${type} Entry`,
          refId
      };

      setData(prev => ({
          ...prev,
          transactions: [newTx, ...(prev.transactions || [])]
      }));

      return true;
  }, []); // Only depends on setData which is stable

  const deleteTransaction = useCallback((id) => {
      if(window.confirm("Are you sure you want to delete this transaction? This will automatically recalculate your running balance.")) {
          setData(prev => ({
              ...prev,
              transactions: (prev.transactions || []).filter(t => t.id !== id)
          }));
      }
  }, []);

  const contextValue = useMemo(() => ({
      // Raw Data
      data, setData, 
      
      // Settings
      theme, toggleTheme, clearData, formatCurrency,

      // Monthly Navigation State
      currentMonth, setCurrentMonth,

      // Computed State
      globalMetrics,
      filteredMetrics,
      previousMetrics,
      computedGoals,
      computedDebts,
      computedTransactions,

      // Actions
      addTransaction,
      deleteTransaction
  }), [data, theme, currentMonth, globalMetrics, filteredMetrics, previousMetrics, computedGoals, computedDebts, computedTransactions, addTransaction, deleteTransaction]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
