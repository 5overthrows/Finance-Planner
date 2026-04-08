import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Sidebar = ({ isOpen, toggleSidebar, isCollapsed, toggleCollapse }) => {
    const { theme, toggleTheme } = useAppContext();

    const navItems = [
        { name: 'Home', path: '/', icon: 'fa-home' },
        { name: 'Dashboard', path: '/dashboard', icon: 'fa-layer-group' },
        { name: 'Budget', path: '/budget', icon: 'fa-sliders-h' },
        { name: 'Expenses', path: '/expenses', icon: 'fa-receipt' },
        { name: 'History', path: '/history', icon: 'fa-history' },
        { name: 'Savings', path: '/savings', icon: 'fa-vault' },
        { name: 'Debts', path: '/debts', icon: 'fa-credit-card' },
        { name: 'Settings', path: '/settings', icon: 'fa-gear' }
    ];

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header" style={{ position: 'relative', minHeight: '40px' }}>
                <i className="fas fa-cube" style={{ display: isCollapsed ? 'none' : 'block' }}></i> 
                <span>FinPlan</span>
                {/* Desktop Toggle Button */}
                <button 
                    onClick={toggleCollapse} 
                    style={{
                        background: 'none', border: 'none', color: 'var(--text-secondary)',
                        cursor: 'pointer', fontSize: '1.2rem', padding: '0.25rem',
                        position: isCollapsed ? 'static' : 'absolute',
                        right: '0.5rem',
                        top: '-0.25rem'
                    }}
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    <i className="fas fa-bars"></i>
                </button>
            </div>
            
            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink 
                        key={item.name}
                        to={item.path} 
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => toggleSidebar(false)}
                        title={isCollapsed ? item.name : ""}
                    >
                        <i className={`fas ${item.icon} fa-fw`}></i> 
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle Theme">
                    <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
