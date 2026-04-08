import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Budget from './pages/Budget';
import Expenses from './pages/Expenses';
import Savings from './pages/Savings';
import Settings from './pages/Settings';
import Debts from './pages/Debts';
import History from './pages/History';
import MonthSelector from './components/MonthSelector';
import { useLocation } from 'react-router-dom';

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Drawer
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Desktop Collapse

  const location = useLocation();
  const showMonthSelector = ['/dashboard', '/budget', '/expenses'].includes(location.pathname);

  return (
    <div className="app-layout">
      {/* Mobile Handle */}
      <button 
          className="mobile-menu-btn" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
          <i className="fas fa-bars"></i>
      </button>

      <Sidebar 
          isOpen={isSidebarOpen} 
          toggleSidebar={setIsSidebarOpen} 
          isCollapsed={isSidebarCollapsed}
          toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <main className={`main-content ${isSidebarCollapsed ? 'expanded' : ''}`}>
        {showMonthSelector && <MonthSelector />}
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/history" element={<History />} />
          <Route path="/savings" element={<Savings />} />
          <Route path="/debts" element={<Debts />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <Router>
        <AppLayout />
      </Router>
    </AppProvider>
  );
};

export default App;
