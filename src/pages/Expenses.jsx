import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { EXPENSE_CATEGORIES, getLocalDateString, formatDate } from '../utils/financeUtils';

const Expenses = () => {
    const { filteredMetrics, formatCurrency, addTransaction, deleteTransaction } = useAppContext();

    const [desc, setDesc] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
    const [date, setDate] = useState(getLocalDateString());

    const handleAddExpense = (e) => {
        e.preventDefault();
        
        const success = addTransaction('expense', amount, category, date, desc);

        if (success) {
            setDesc('');
            setAmount('');
            setCategory(EXPENSE_CATEGORIES[0]);
            setDate(getLocalDateString());
        }
    };

    // Filter transactions to only show expenses for the current month
    const expensesList = filteredMetrics.transactions.filter(t => t.type === 'expense');

    return (
        <div className="fade-in">
            <header className="page-header">
                <h1 className="page-title">Expenses</h1>
                <p className="page-subtitle">Track and manage every transaction for the selected month.</p>
            </header>

            <div className="dashboard-grid">
                <div className="col-4 fade-in-up delay-1">
                    <div className="card" style={{ height: 'auto' }}>
                        <div style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Log Expense</div>
                        <form onSubmit={handleAddExpense}>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="e.g., Groceries" 
                                    required
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Amount (₹)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    placeholder="e.g., 500" 
                                    min="1"
                                    required
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select 
                                    className="form-control" 
                                    required
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {EXPENSE_CATEGORIES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Add Transaction</button>
                        </form>
                    </div>
                </div>

                <div className="col-8 fade-in-up delay-2">
                    <div className="card" style={{ height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ fontWeight: 600 }}>Activity</div>
                        </div>

                        <div className="data-table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Detail</th>
                                        <th>Category</th>
                                        <th className="align-right">Amount</th>
                                        <th className="align-right">Balance</th>
                                        <th className="align-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expensesList.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem 0' }}>No expenses found for this month.</td>
                                        </tr>
                                    ) : expensesList.map(t => (
                                        <tr key={t.id}>
                                            <td style={{ color: 'var(--text-secondary)' }}>{formatDate(t.date)}</td>
                                            <td style={{ fontWeight: 500 }}>{t.desc}</td>
                                            <td>
                                                <span style={{ 
                                                    background: 'var(--bg-base)', 
                                                    padding: '2px 8px', 
                                                    borderRadius: '4px', 
                                                    fontSize: '0.75rem', 
                                                    border: '1px solid var(--border-color)',
                                                    color: 'var(--text-secondary)'
                                                }}>
                                                    {t.category}
                                                </span>
                                            </td>
                                            <td className="align-right text-primary" style={{ fontWeight: 500 }}>-₹{t.amount}</td>
                                            <td className="align-right" style={{ fontWeight: 600 }}>{formatCurrency(t.runningBalance)}</td>
                                            <td className="align-right">
                                                <button 
                                                    className="btn btn-outline" 
                                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                    onClick={() => deleteTransaction(t.id)}
                                                    title="Delete"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div style={{ marginTop: '1.5rem', textAlign: 'right', fontWeight: 500, paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Total Tracked Exps:</span> <span className="text-primary">{formatCurrency(filteredMetrics.expenses)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Expenses;
