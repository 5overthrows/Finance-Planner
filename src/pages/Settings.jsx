import React from 'react';
import { useAppContext } from '../context/AppContext';

const Settings = () => {
    const { clearData, toggleTheme } = useAppContext();

    const handleClearData = () => {
        if (window.confirm("Are you ABSOLUTELY sure? This will delete all your local financial data, budgets, and transactions permanently.")) {
            clearData();
            alert("Data erased cleanly!");
        }
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        alert('Profile updated successfully!');
    };

    return (
        <div className="fade-in">
            <header className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Manage account preferences and data security.</p>
            </header>

            <div className="dashboard-grid">
                <div className="col-8 fade-in-up delay-1">
                    <div className="card">
                        <div className="settings-section">
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Profile Information</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Update your personal details below.</p>
                            
                            <form onSubmit={handleProfileSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input type="text" className="form-control" defaultValue="John Doe" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email Address</label>
                                        <input type="email" className="form-control" defaultValue="john.doe@example.com" />
                                    </div>
                                </div>
                                <div className="form-group" style={{ maxWidth: '200px' }}>
                                    <label className="form-label">Base Currency</label>
                                    <select className="form-control" defaultValue="INR">
                                        <option value="INR">INR (₹)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Save Changes</button>
                            </form>
                        </div>

                        <div className="settings-section">
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Appearance</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Customize the interface theme.</p>
                            
                            <button className="btn btn-outline" onClick={toggleTheme}>
                                Toggle Dark/Light Mode
                            </button>
                        </div>

                        <div style={{ paddingBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--danger)', marginBottom: '0.25rem' }}>Danger Zone</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Irreversible actions that affect your account data.</p>
                            
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--danger)' }}>Erase All Financial Data</h4>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--danger)', opacity: 0.8 }}>Permanently delete transactions, budgets, and settings locally.</p>
                                </div>
                                <button 
                                    className="btn btn-primary" 
                                    style={{ backgroundColor: 'var(--danger)', color: '#fff' }} 
                                    onClick={handleClearData}
                                >
                                    Erase Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
