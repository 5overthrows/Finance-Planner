import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="fade-in" style={{ padding: '0 2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Hero Section */}
            <section style={{ 
                minHeight: '75vh', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', 
                textAlign: 'center',
                paddingTop: '4rem'
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '2rem',
                    background: 'var(--surface)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    marginBottom: '2rem',
                    boxShadow: 'var(--shadow-sm)'
                }} className="fade-in-up">
                    <span style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        background: 'var(--success)' 
                    }}></span>
                    FinPlan 2.0 is now live
                </div>

                <h1 className="fade-in-up delay-1" style={{ 
                    fontSize: 'clamp(3rem, 6vw, 5.5rem)', 
                    fontWeight: 700, 
                    letterSpacing: '-0.06em',
                    lineHeight: '1.1',
                    color: 'var(--text-primary)',
                    maxWidth: '900px',
                    marginBottom: '1.5rem'
                }}>
                    The financial operating system for your future.
                </h1>
                
                <p className="fade-in-up delay-2" style={{
                    fontSize: 'clamp(1.125rem, 2vw, 1.35rem)',
                    color: 'var(--text-secondary)',
                    maxWidth: '650px',
                    marginBottom: '3rem',
                    lineHeight: '1.6'
                }}>
                    Track expenses, build accurate budgets, and manage your debts with an elegantly crafted, uncompromisingly fast application.
                </p>

                <div className="fade-in-up delay-3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.875rem 1.5rem', fontSize: '1rem' }}>
                        Open Dashboard <i className="fas fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
                    </Link>
                </div>
            </section>

            {/* Features Showcase */}
            <section style={{ padding: '6rem 0' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="fade-in-up">
                    <h2 style={{ fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.04em', marginBottom: '1rem' }}>Engineered for precision.</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Everything you need to orchestrate your wealth.</p>
                </div>

                <div className="dashboard-grid">
                    <div className="col-4 fade-in-up delay-1">
                        <div className="card" style={{ height: '100%', padding: '2rem' }}>
                            <div style={{ 
                                width: '40px', height: '40px', borderRadius: '8px', 
                                background: 'var(--bg-base)', border: '1px solid var(--border-color)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '1.5rem', fontSize: '1.25rem', color: 'var(--primary)'
                            }}>
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Command Center</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                                A global dashboard that instantly summarizes net worth, monthly cash flow, and financial health scores.
                            </p>
                        </div>
                    </div>
                    <div className="col-4 fade-in-up delay-2">
                        <div className="card" style={{ height: '100%', padding: '2rem' }}>
                            <div style={{ 
                                width: '40px', height: '40px', borderRadius: '8px', 
                                background: 'var(--bg-base)', border: '1px solid var(--border-color)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '1.5rem', fontSize: '1.25rem', color: 'var(--primary)'
                            }}>
                                <i className="fas fa-bullseye"></i>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Zero-Based Budgets</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                                Advanced progress bars and allocation tools ensure every single dollar works for your goals.
                            </p>
                        </div>
                    </div>
                    <div className="col-4 fade-in-up delay-3">
                        <div className="card" style={{ height: '100%', padding: '2rem' }}>
                            <div style={{ 
                                width: '40px', height: '40px', borderRadius: '8px', 
                                background: 'var(--bg-base)', border: '1px solid var(--border-color)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '1.5rem', fontSize: '1.25rem', color: 'var(--primary)'
                            }}>
                                <i className="fas fa-layer-group"></i>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Debt Avalanche</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                                Integrated algorithms parse liability data to recommend the mathematically optimal payoff strategy.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Footer */}
            <footer style={{ borderTop: '1px solid var(--border-color)', padding: '3rem 0', display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <div>© 2026 FinPlan Platform. All rights reserved.</div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <span style={{ cursor: 'pointer' }}>Terms</span>
                    <span style={{ cursor: 'pointer' }}>Privacy</span>
                    <span style={{ cursor: 'pointer' }}>Security</span>
                </div>
            </footer>
        </div>
    );
};

export default Home;
