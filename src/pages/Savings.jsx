import React from 'react';
import { useAppContext } from '../context/AppContext';

const Savings = () => {
    const { data, setData, formatCurrency, computedGoals, addTransaction } = useAppContext();

    const handleAddFunds = (goal) => {
        const amountStr = prompt(`Enter amount to add to ${goal.name} (₹):`);
        if (!amountStr) return;
        
        const success = addTransaction('saving', amountStr, 'savings', null, `Deposit: ${goal.name}`, goal.id);
        if (success) {
            // Transaction successfully logged. Context will autorun computedGoals via useMemo.
        }
    };

    const handleWithdrawFunds = (goal) => {
        const amountStr = prompt(`Enter amount to withdraw from ${goal.name} (₹):`);
        if (!amountStr) return;
        
        const amt = Number(amountStr);
        if (amt > goal.current) {
            alert(`You cannot withdraw more than your current saved amount of ₹${goal.current}`);
            return;
        }

        const success = addTransaction('transfer', amountStr, 'savings', null, `Withdrawal: ${goal.name}`, goal.id);
        if (success) {
            // Transaction successfully logged.
        }
    };

    const handleNewGoal = () => {
        const name = prompt("Enter goal name (e.g., New Car):");
        if (!name) return;
        
        const targetStr = prompt("Enter target amount (₹):");
        if (!targetStr) return;
        
        const target = Number(targetStr);
        if (isNaN(target) || target <= 0) return;
        
        const newGoalObj = {
            id: Date.now(),
            name,
            icon: 'fa-star',
            target,
            deadline: new Date(Date.now() + 86400000 * 365).toISOString().split('T')[0]
        };

        setData(prev => ({ 
            ...prev, 
            goals: [...(prev.goals || []), newGoalObj] 
        }));
    };

    return (
        <div className="fade-in">
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Savings Goals</h1>
                    <p className="page-subtitle">Track your progress toward key financial targets across all time.</p>
                </div>
                <button className="btn btn-primary" onClick={handleNewGoal}>
                    New Goal
                </button>
            </header>

            <div className="dashboard-grid">
                {computedGoals.length === 0 ? (
                    <div className="col-12 text-center" style={{ padding: '3rem 0', color: 'var(--text-tertiary)' }}>No savings goals created yet.</div>
                ) : (
                    computedGoals.map((goal, index) => {
                        const percent = Math.min((goal.current / goal.target) * 100, 100);
                        
                        const d1 = new Date();
                        const d2 = new Date(goal.deadline);
                        let months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
                        if (months < 0) months = 0;

                        const delayClass = `delay-${(index % 3) + 1}`;

                        return (
                            <div key={goal.id} className={`col-6 fade-in-up ${delayClass}`}>
                                <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                <i className={`fas ${goal.icon}`}></i> {months > 0 ? `${months} months remaining` : 'Deadline reached'}
                                            </div>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{goal.name}</h3>
                                        </div>
                                    </div>
                                    
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                                            <span style={{ color: 'var(--primary)' }}>{percent.toFixed(1)}%</span>
                                            <span>{formatCurrency(goal.target)}</span>
                                        </div>
                                        <div className="progress-container">
                                            <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                            <span>Saved: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{formatCurrency(goal.current)}</span></span>
                                            <span>Remaining: {formatCurrency(Math.max(0, goal.target - goal.current))}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
                                        <button 
                                            className="btn btn-outline" 
                                            style={{ flex: 1 }}
                                            onClick={() => handleAddFunds(goal)}
                                        >
                                            Deposit
                                        </button>
                                        <button 
                                            className="btn btn-outline" 
                                            style={{ flex: 1, borderColor: 'var(--danger)', color: 'var(--danger)' }}
                                            onClick={() => handleWithdrawFunds(goal)}
                                            disabled={goal.current <= 0}
                                        >
                                            Withdraw
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Savings;
