import React from 'react';
import { useAppContext } from '../context/AppContext';
import { formatDate } from '../utils/financeUtils';

const History = () => {
    const { computedTransactions, formatCurrency, currentMonth, deleteTransaction } = useAppContext();

    // Filter transactions: show everything that does not belong to the selected currentMonth
    const historyList = computedTransactions.filter(t => !t.date.startsWith(currentMonth));

    return (
        <div className="fade-in">
            <header className="page-header">
                <h1 className="page-title">Transactions History</h1>
                <p className="page-subtitle">A complete log of all your past financial activities.</p>
            </header>

            <div className="card fade-in-up delay-1">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ fontWeight: 600 }}>Past Activity Log</div>
                </div>

                <div className="data-table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Detail</th>
                                <th>Category</th>
                                <th className="align-right">Amount</th>
                                <th className="align-right">Balance</th>
                                <th className="align-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyList.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem 0' }}>No historical transactions found.</td>
                                </tr>
                            ) : historyList.map(t => (
                                <tr key={t.id}>
                                    <td style={{ color: 'var(--text-secondary)' }}>
                                        {formatDate(t.date)}
                                    </td>
                                    <td>
                                        <span style={{ 
                                            background: t.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 
                                                        t.type === 'expense' ? 'rgba(239, 68, 68, 0.1)' :
                                                        'rgba(59, 130, 246, 0.1)', 
                                            color: t.type === 'income' ? 'var(--success)' : 
                                                   t.type === 'expense' ? 'var(--danger)' :
                                                   'var(--primary)',
                                            padding: '2px 8px', 
                                            borderRadius: '4px', 
                                            fontSize: '0.75rem', 
                                            textTransform: 'capitalize',
                                            fontWeight: 500
                                        }}>
                                            {t.type}
                                        </span>
                                    </td>
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
                                    <td className={`align-right ${t.type === 'income' || t.type === 'transfer' ? 'text-success' : t.type === 'expense' || t.type === 'debt' || t.type === 'saving' ? 'text-primary' : ''}`} style={{ fontWeight: 500 }}>
                                        {t.type === 'income' || t.type === 'transfer' ? '+' : '-'}{formatCurrency(t.amount)}
                                    </td>
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
            </div>
        </div>
    );
};

export default History;
