import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { INCOME_CATEGORIES, calculatePercentageChange, exportDataAsJSON, exportDataAsCSV, formatDate } from '../utils/financeUtils';

const Dashboard = () => {
    const { 
        data, 
        formatCurrency, 
        globalMetrics, 
        filteredMetrics,
        previousMetrics,
        computedDebts,
        computedTransactions,
        addTransaction,
        currentMonth
    } = useAppContext();

    // Add Income Form State
    const [incAmount, setIncAmount] = useState('');
    const [incSource, setIncSource] = useState(INCOME_CATEGORIES[0]);

    const handleAddIncome = (e) => {
        e.preventDefault();
        const success = addTransaction('income', incAmount, incSource);
        if (success) {
            setIncAmount('');
            setIncSource(INCOME_CATEGORIES[0]);
        }
    };

    // Derived Health Score
    let calculatedScore = 40; // Base score
    if (filteredMetrics.income > 0) {
        const expRatio = Math.max(0, 1 - (filteredMetrics.expenses / filteredMetrics.income));
        const saveRatio = Math.min((filteredMetrics.savings / filteredMetrics.income), 1);
        calculatedScore += (expRatio * 30) + (saveRatio * 30);
    }
    const score = filteredMetrics.income === 0 && filteredMetrics.expenses === 0 ? '--' : Math.min(Math.round(calculatedScore), 100);

    // Cross-Month Analytics
    const incChange = calculatePercentageChange(filteredMetrics.income, previousMetrics.income);
    const expChange = calculatePercentageChange(filteredMetrics.expenses, previousMetrics.expenses);

    // Savings + Debt Insight
    const totalDebt = computedDebts.reduce((sum, d) => sum + d.currentBalance, 0);
    const totalSavings = globalMetrics.savings - globalMetrics.transfers;
    const payoffCapacity = totalDebt > 0 ? Math.min((totalSavings / totalDebt) * 100, 100).toFixed(1) : 0;


    // Recent activity
    const recentTransactions = computedTransactions.slice(0, 5);

    // Generate dynamic chart data for the trailing 6 months, anchored to the current active month
    const chartData = useMemo(() => {
        const monthsStr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const groupedData = {};
        
        // Group all transactions by strict YYYY-MM numeric combinations to avoid Date timezone shifting
        (data.transactions || []).forEach(t => {
            if (!t.date || isNaN(t.amount)) return;
            const [y, m] = t.date.split('-');
            const monthKey = `${y}-${Number(m) - 1}`; // Match 0-indexed month system
            if (!groupedData[monthKey]) {
                groupedData[monthKey] = { income: 0, expense: 0 };
            }
            if (t.type === 'income') groupedData[monthKey].income += t.amount;
            if (t.type === 'expense') groupedData[monthKey].expense += t.amount;
        });

        const cData = [];
        const [currYStr, currMStr] = (currentMonth || '2026-04').split('-');
        let currY = Number(currYStr);
        let currMid = Number(currMStr) - 1; // 0-indexed current month

        for (let i = 5; i >= 0; i--) {
            let loopY = currY;
            let loopM = currMid - i;
            if (loopM < 0) {
                loopM += 12;
                loopY -= 1;
            }
            const monthKey = `${loopY}-${loopM}`;
            cData.push({
                name: `${monthsStr[loopM]}`,
                Income: groupedData[monthKey]?.income || 0,
                Expenses: groupedData[monthKey]?.expense || 0
            });
        }
        return cData;
    }, [data.transactions, currentMonth]);

    return (
        <div className="fade-in">
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Overview</h1>
                    <p className="page-subtitle">Your unified financial command center.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" onClick={() => exportDataAsJSON(data)} title="Export JSON">
                        <i className="fas fa-file-code"></i> JSON
                    </button>
                    <button className="btn btn-outline" onClick={() => exportDataAsCSV(data.transactions)} title="Export CSV">
                        <i className="fas fa-file-csv"></i> CSV
                    </button>
                </div>
            </header>

            {/* Metrics Row */}
            <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="col-3 fade-in-up delay-1">
                    <div className="metric-card">
                        <span className="metric-label" title="All-time Liquid Balance">Total Balance <i className="fas fa-info-circle text-muted" style={{fontSize:'0.75rem'}}></i></span>
                        <span className="metric-value">{formatCurrency(globalMetrics.balance)}</span>
                    </div>
                </div>
                <div className="col-3 fade-in-up delay-2">
                    <div className="metric-card">
                        <span className="metric-label">Monthly Income</span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                            <span className="metric-value">{formatCurrency(filteredMetrics.income)}</span>
                            {filteredMetrics.income > 0 && previousMetrics.income > 0 && (
                                <span className={incChange >= 0 ? "text-success" : "text-danger"} style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                    {incChange > 0 ? '+' : ''}{incChange.toFixed(1)}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-3 fade-in-up delay-3">
                    <div className="metric-card">
                        <span className="metric-label">Monthly Expenses</span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                            <span className="metric-value">{formatCurrency(filteredMetrics.expenses)}</span>
                            {filteredMetrics.expenses > 0 && previousMetrics.expenses > 0 && (
                                <span className={expChange <= 0 ? "text-success" : "text-danger"} style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                    {expChange > 0 ? '+' : ''}{expChange.toFixed(1)}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-3 fade-in-up delay-1">
                    <div className="metric-card">
                        <span className="metric-label">Monthly Health Score</span>
                        <span className="metric-value">{score}/100</span>
                    </div>
                </div>
            </div>

            {totalDebt > 0 && (
                <div className="fade-in-up delay-2" style={{ marginBottom: '1.5rem', background: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <i className="fas fa-lightbulb text-warning" style={{ marginRight: '0.5rem' }}></i> 
                        <strong>Insight:</strong> You can pay off <strong>{payoffCapacity}%</strong> of your active debt using your current dedicated savings.
                    </div>
                </div>
            )}

            {/* Middle Row (Add Paycheck & Recent Activity) */}
            <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="col-4 fade-in-up delay-1">
                    <div className="card" style={{ height: '100%', borderTop: '4px solid var(--success)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Log Paycheck</h3>
                        </div>
                        <form onSubmit={handleAddIncome}>
                            <div className="form-group">
                                <label className="form-label">Amount (₹)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    placeholder="e.g., 45000" 
                                    min="1"
                                    required
                                    value={incAmount}
                                    onChange={(e) => setIncAmount(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Income Source</label>
                                <select 
                                    className="form-control" 
                                    required 
                                    value={incSource}
                                    onChange={(e) => setIncSource(e.target.value)}
                                >
                                    {INCOME_CATEGORIES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', background: 'var(--success)' }}>
                                <i className="fas fa-plus"></i> Add Income
                            </button>
                        </form>
                    </div>
                </div>

                <div className="col-8 fade-in-up delay-2">
                    <div className="card" style={{ height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Global Historical Activity</h3>
                            <Link to="/expenses" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>View All &rarr;</Link>
                        </div>
                        <div className="data-table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Detail</th>
                                        <th>Type</th>
                                        <th className="align-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem 0' }}>No activity found across any month.</td>
                                        </tr>
                                    ) : (
                                        recentTransactions.map(t => {
                                            const isPos = t.type === 'income';
                                            return (
                                                <tr key={t.id}>
                                                    <td style={{ color: 'var(--text-secondary)' }}>{formatDate(t.date)}</td>
                                                    <td>
                                                        <div style={{ fontWeight: 500 }}>{t.desc}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{t.category}</div>
                                                    </td>
                                                    <td>
                                                        <span style={{ 
                                                            fontSize: '0.7rem', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px',
                                                            background: isPos ? 'var(--success-bg)' : 'var(--danger-bg)',
                                                            color: isPos ? 'var(--success)' : 'var(--danger)'
                                                        }}>{t.type}</span>
                                                    </td>
                                                    <td className={`align-right ${isPos ? 'text-success' : 'text-primary'}`} style={{ fontWeight: 600 }}>
                                                        {isPos ? '+' : '-'}{formatCurrency(t.amount)}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="dashboard-grid fade-in-up delay-3">
                <div className="col-12">
                    <div className="card" style={{ height: '350px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Cash Flow Trend (Trailing 6 Months)</h3>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><div style={{ width: '8px', height: '8px', background: 'var(--text-tertiary)', borderRadius: '2px' }}></div> Income</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '2px' }}></div> Expenses</span>
                            </div>
                        </div>
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                    <XAxis dataKey="name" tick={{fill: 'var(--text-tertiary)', fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis tick={{fill: 'var(--text-tertiary)', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                                    <Tooltip 
                                        cursor={{fill: 'var(--bg-base)'}}
                                        contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', fontSize: '12px', boxShadow: 'var(--shadow-md)' }}
                                        formatter={(value) => [formatCurrency(value), undefined]}
                                    />
                                    <Bar dataKey="Income" fill="var(--text-tertiary)" radius={[2, 2, 0, 0]} maxBarSize={40} />
                                    <Bar dataKey="Expenses" fill="var(--primary)" radius={[2, 2, 0, 0]} maxBarSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
