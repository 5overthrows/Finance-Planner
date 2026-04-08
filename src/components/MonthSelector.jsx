import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

const MonthSelector = () => {
    const { currentMonth, setCurrentMonth, data } = useAppContext();

    // Dynamically build a list of all distinct months that have transactions + the current real month
    const availableMonths = useMemo(() => {
        const months = new Set();
        
        // Add actual system month and 6 future months
        const now = new Date();
        for (let i = 0; i <= 6; i++) {
            const temp = new Date(now.getFullYear(), now.getMonth() + i, 1);
            months.add(`${temp.getFullYear()}-${String(temp.getMonth() + 1).padStart(2, '0')}`);
        }

        // Add history months
        (data.transactions || []).forEach(t => {
            if (t.date && t.date.length >= 7) {
                months.add(t.date.substring(0, 7)); // YYYY-MM
            }
        });

        // Convert Set to sorted Array (newest first)
        return Array.from(months).sort((a, b) => b.localeCompare(a));
    }, [data.transactions]);

    const formatMonth = (yyyyMm) => {
        const [year, month] = yyyyMm.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <i className="fas fa-calendar-alt"></i>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Viewing Data For:</span>
            </div>
            
            <select 
                value={currentMonth}
                onChange={(e) => setCurrentMonth(e.target.value)}
                style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-base)',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    outline: 'none',
                    minWidth: '180px'
                }}
            >
                {availableMonths.map(m => (
                    <option key={m} value={m}>{formatMonth(m)}</option>
                ))}
            </select>

            {/* Quick Navigation Helpers */}
            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                <button 
                    onClick={() => {
                        const idx = availableMonths.indexOf(currentMonth);
                        if (idx < availableMonths.length - 1) setCurrentMonth(availableMonths[idx + 1]);
                    }}
                    disabled={availableMonths.indexOf(currentMonth) === availableMonths.length - 1}
                    className="btn btn-outline"
                    title="Previous Month"
                    style={{ padding: '0.5rem', borderRadius: '50%', width: '36px', height: '36px' }}
                >
                    <i className="fas fa-chevron-left"></i>
                </button>
                <button 
                    onClick={() => {
                        const idx = availableMonths.indexOf(currentMonth);
                        if (idx > 0) setCurrentMonth(availableMonths[idx - 1]);
                    }}
                    disabled={availableMonths.indexOf(currentMonth) === 0}
                    className="btn btn-outline"
                    title="Next Month"
                    style={{ padding: '0.5rem', borderRadius: '50%', width: '36px', height: '36px' }}
                >
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    );
};

export default MonthSelector;
