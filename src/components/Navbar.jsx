import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
    const { theme, toggleTheme } = useAppContext();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Home', path: '/', icon: 'fa-home' },
        { name: 'Dashboard', path: '/dashboard', icon: 'fa-chart-pie' },
        { name: 'Budget', path: '/budget', icon: 'fa-wallet' },
        { name: 'Expenses', path: '/expenses', icon: 'fa-receipt' },
        { name: 'Savings', path: '/savings', icon: 'fa-piggy-bank' },
        { name: 'Debts', path: '/debts', icon: 'fa-credit-card' },
        { name: 'Settings', path: '/settings', icon: 'fa-cog' }
    ];

    return (
        <nav className="navbar">
            <NavLink to="/" className="nav-brand">
                <i className="fas fa-chart-line text-primary"></i> FinPlan
            </NavLink>
            
            <button 
                className="mobile-menu-btn" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                <i className="fas fa-bars"></i>
            </button>

            <ul className={`nav-links ${isMobileMenuOpen ? 'show' : ''}`}>
                {navItems.map((item) => (
                    <li key={item.name}>
                        <NavLink 
                            to={item.path} 
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <i className={`fas ${item.icon}`}></i> <span className="nav-text">{item.name}</span>
                        </NavLink>
                    </li>
                ))}
                <li>
                    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                        <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
