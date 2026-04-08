import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { EXPENSE_CATEGORIES } from '../utils/financeUtils';

const icons = {
  'Food': 'fa-utensils',
  'Rent': 'fa-home',
  'Transport': 'fa-car',
  'Entertainment': 'fa-film',
  'Bills': 'fa-bolt',
  'Others': 'fa-box'
};

const Budget = () => {
    const { data, setData, formatCurrency, filteredMetrics } = useAppContext();
    
    // Add new limit state
    const [catName, setCatName] = useState(EXPENSE_CATEGORIES[0]);
    const [catLimit, setCatLimit] = useState('');

    // Read limits from state, actual spent from isolated monthly computations
    let totalLimit = 0;
    let totalSpent = 0;

    const categories = Object.keys(data.budget || {});
    categories.forEach(cat => {
        totalLimit += (data.budget[cat] || 0);
    });

    // totalSpent for this month is purely computed from transactions
    totalSpent = filteredMetrics.expenses;
    const remainingIncome = filteredMetrics.income - totalSpent;

    const handleAddOrUpdateCategory = (e) => {
        e.preventDefault();
        const limitNum = Number(catLimit);
        
        if (limitNum > 0) {
            setData(prev => ({
                ...prev,
                budget: {
                    ...(prev.budget || {}),
                    [catName]: limitNum
                }
            }));
            setCatLimit('');
        }
    };

    const handleRemoveCategory = (cat) => {
        if (window.confirm(`Delete budget limit for ${cat}?`)) {
            setData(prev => {
                const newBudget = { ...prev.budget };
                delete newBudget[cat];
                return { ...prev, budget: newBudget };
            });
        }
    };

    return (
        <div className="fade-in">
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Budget Setup</h1>
                    <p className="page-subtitle">Allocate your income and manage limits for the active month.</p>
                </div>
                {/* Edit Income removed per instructions as it's a structural anti-pattern. Use Dashboard > Add Paycheck */}
            </header>

            <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
                <div className="col-4 fade-in-up delay-1">
                    <div className="card" style={{ backgroundColor: 'var(--primary)', color: 'var(--bg-base)' }}>
                        <div style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '0.25rem' }}>Remaining to spend</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.04em' }}>{formatCurrency(remainingIncome)}</div>
                    </div>
                </div>
                <div className="col-4 fade-in-up delay-2">
                    <div className="card">
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Total Monthly Income</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--success)' }}>{formatCurrency(filteredMetrics.income)}</div>
                    </div>
                </div>
                <div className="col-4 fade-in-up delay-3">
                    <div className="card">
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Allocated Limit</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.04em' }}>{formatCurrency(totalLimit)}</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="col-8 fade-in-up delay-2">
                    <div className="card" style={{ height: '100%' }}>
                        <div style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Category Breakdown (This Month)</div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {categories.length === 0 ? (
                                <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem 0' }}>No budget limits configured.</div>
                            ) : categories.map(cat => {
                                const limit = data.budget[cat] || 0;
                                const spent = filteredMetrics.categorySpend[cat] || 0;
                                
                                const percent = Math.min((spent / Math.max(limit, 1)) * 100, 100);
                                let statusClass = '';
                                if (percent > 90) statusClass = 'danger';
                                else if (percent > 75) statusClass = 'warning';

                                return (
                                    <div key={cat} style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', position: 'relative' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                                                <i className={`fas ${icons[cat] || 'fa-tag'} text-secondary`}></i> {cat}
                                                <button 
                                                    onClick={() => handleRemoveCategory(cat)}
                                                    style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', marginLeft: '0.5rem' }}
                                                    title="Remove Budget"
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </div>
                                            <div style={{ fontSize: '0.875rem' }}>
                                                <span style={{ fontWeight: 600 }}>{formatCurrency(spent)}</span> 
                                                <span style={{ color: 'var(--text-tertiary)' }}> / {formatCurrency(limit)}</span>
                                            </div>
                                        </div>
                                        <div className="progress-container">
                                            <div className={`progress-fill ${statusClass}`} style={{ width: `${percent}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="col-4 fade-in-up delay-3">
                    <div className="card" style={{ height: 'auto' }}>
                        <div style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Assign Limits</div>
                        <form onSubmit={handleAddOrUpdateCategory}>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select 
                                    className="form-control" 
                                    required 
                                    value={catName}
                                    onChange={(e) => setCatName(e.target.value)}
                                >
                                    {EXPENSE_CATEGORIES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Monthly Limit (₹)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    placeholder="e.g., 5000" 
                                    min="1"
                                    required 
                                    value={catLimit}
                                    onChange={(e) => setCatLimit(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                                Save or Update Limit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Budget;
