import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

const Debts = () => {
    const { data, setData, formatCurrency, computedDebts, addTransaction } = useAppContext();

    const [name, setName] = useState('');
    const [balance, setBalance] = useState('');
    const [rate, setRate] = useState('');
    const [payment, setPayment] = useState('');

    const handleAddDebt = (e) => {
        e.preventDefault();
        
        const newBalance = Number(balance);
        const newRate = Number(rate);
        const newPayment = Number(payment);

        if (newBalance <= 0 || newRate < 0 || newPayment <= 0) {
            alert("Please enter valid positive numbers.");
            return;
        }

        const newDebt = {
            id: Date.now(),
            name,
            balance: newBalance,
            rate: newRate,
            payment: newPayment
        };

        setData(prev => ({
            ...prev,
            debts: [...(prev.debts || []), newDebt]
        }));

        setName('');
        setBalance('');
        setRate('');
        setPayment('');
    };

    const handleDeleteDebt = (id) => {
        // Technically this leaves "orphan" transactions, but for strict UI logic this is standard
        if(window.confirm("Delete this debt record entirely? Transaction history payments will remain.")) {
            setData(prev => ({
                ...prev,
                debts: prev.debts.filter(d => d.id !== id)
            }));
        }
    };

    const handleMakePayment = (d) => {
        const amtStr = prompt(`Enter payment amount for ${d.name} (₹):`, d.payment);
        if(!amtStr) return;
        
        const success = addTransaction('debt', amtStr, 'debtPayment', null, `Payment to ${d.name}`, d.id);
        if (success) {
             // Let Context autorun
        }
    };

    // Use globally computed running balances
    const totalDebt = computedDebts.reduce((sum, d) => sum + d.currentBalance, 0);
    const totalPayments = computedDebts.reduce((sum, d) => sum + d.payment, 0);

    const calculateMetrics = (d) => {
        const r = d.rate / 100 / 12;
        const currentBal = d.currentBalance;
        const monthlyInterest = currentBal * r;
        
        if (currentBal === 0) {
            return { isHighRisk: false, months: 0, totalInterest: 0, payoffDate: 'Paid Off!' };
        }

        if (r === 0) {
            const months = currentBal / d.payment;
            return {
                isHighRisk: false,
                months: Math.ceil(months),
                totalInterest: 0,
                payoffDate: getFutureDate(months)
            };
        }

        if (d.payment <= monthlyInterest) {
            return {
                isHighRisk: true,
                months: Infinity,
                totalInterest: Infinity,
                payoffDate: 'Never (Payment too low)'
            };
        }

        const numerator = Math.log(1 - (currentBal * r) / d.payment);
        const denominator = Math.log(1 + r);
        const months = -numerator / denominator;
        const totalInterest = (months * d.payment) - currentBal;

        return {
            isHighRisk: false,
            months: Math.ceil(months),
            totalInterest: totalInterest > 0 ? totalInterest : 0,
            payoffDate: getFutureDate(months)
        };
    };

    const getFutureDate = (monthsNum) => {
        if (!isFinite(monthsNum)) return 'Never';
        const date = new Date();
        date.setDate(1); // Set to 1st of month to avoid 30/31 truncation bugs
        date.setMonth(date.getMonth() + Math.ceil(monthsNum));
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const highestInterestDebt = useMemo(() => {
        const active = computedDebts.filter(d => d.currentBalance > 0);
        return active.length > 0 ? active.sort((a, b) => b.rate - a.rate)[0] : null;
    }, [computedDebts]);

    return (
        <div className="fade-in">
            <header className="page-header">
                <h1 className="page-title">Debt Tracker</h1>
                <p className="page-subtitle">Manage your liabilities and payoff strategies.</p>
            </header>

            <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
                <div className="col-6 fade-in-up delay-1">
                    <div className="metric-card shadow-sm" style={{ borderLeft: '4px solid var(--danger)' }}>
                        <span className="metric-label">Remaining Debt Principal</span>
                        <span className="metric-value">{formatCurrency(totalDebt)}</span>
                    </div>
                </div>
                <div className="col-6 fade-in-up delay-2">
                    <div className="metric-card shadow-sm" style={{ borderLeft: '4px solid var(--warning)' }}>
                        <span className="metric-label">Monthly Obligations</span>
                        <span className="metric-value">{formatCurrency(totalPayments)}</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="col-4 fade-in-up delay-2">
                    <div className="card" style={{ height: 'auto' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Add Liability</h3>
                        <form onSubmit={handleAddDebt}>
                            <div className="form-group">
                                <label className="form-label">Debt Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="e.g., Student Loan" 
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Starting Principal (₹)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    min="1"
                                    required
                                    value={balance}
                                    onChange={(e) => setBalance(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Interest Rate (% APR)</label>
                                <input 
                                    type="number"
                                    step="0.01" 
                                    className="form-control" 
                                    required
                                    value={rate}
                                    onChange={(e) => setRate(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Monthly Payment (₹)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    min="1"
                                    required
                                    value={payment}
                                    onChange={(e) => setPayment(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Create Record</button>
                        </form>
                    </div>

                    {highestInterestDebt && (
                        <div className="card" style={{ marginTop: '1.5rem', background: 'var(--bg-base)' }}>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}><i className="fas fa-lightbulb text-info"></i> Avalanche Strategy</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                Focus extra payments on <strong>{highestInterestDebt.name}</strong> ({highestInterestDebt.rate}%) to minimize long-term interest cost.
                            </p>
                        </div>
                    )}
                </div>

                <div className="col-8 fade-in-up delay-3">
                    <div className="card" style={{ height: '100%' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Active Liabilities</h3>
                        
                        {computedDebts.length === 0 ? (
                            <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>No debts found. You're completely debt-free.</p>
                        ) : (
                            <div className="data-table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Liability</th>
                                            <th className="align-right">Current Balance</th>
                                            <th className="align-right">Est. Payoff</th>
                                            <th className="align-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {computedDebts.map(d => {
                                            const metrics = calculateMetrics(d);
                                            const isPaid = d.currentBalance === 0;

                                            return (
                                                <tr key={d.id}>
                                                    <td>
                                                        <div style={{ fontWeight: 500, textDecoration: isPaid ? 'line-through' : 'none' }}>{d.name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{d.rate}% APR • {formatCurrency(d.payment)}/mo</div>
                                                    </td>
                                                    <td className={`align-right ${isPaid ? 'text-success' : 'text-danger'}`} style={{ fontWeight: 500 }}>
                                                        {formatCurrency(d.currentBalance)}
                                                    </td>
                                                    <td className="align-right">
                                                        {isPaid ? (
                                                            <span style={{ color: 'var(--success)', fontSize: '0.875rem' }}><i className="fas fa-check-circle"></i> Settled</span>
                                                        ) : metrics.isHighRisk ? (
                                                            <span style={{ color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 500 }}>Payment too low</span>
                                                        ) : (
                                                            <div>
                                                              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block' }}>{metrics.payoffDate}</span>
                                                              <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75em' }}>Int: {formatCurrency(metrics.totalInterest)}</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="align-right">
                                                        {!isPaid && (
                                                            <button 
                                                                className="btn btn-outline" 
                                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', marginRight: '0.5rem' }}
                                                                title="Make Payment"
                                                                onClick={() => handleMakePayment(d)}
                                                            >
                                                                <i className="fas fa-hand-holding-usd"></i>
                                                            </button>
                                                        )}
                                                        <button 
                                                            className="btn btn-outline" 
                                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                            onClick={() => handleDeleteDebt(d.id)}
                                                            title="Delete Record"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Debts;
