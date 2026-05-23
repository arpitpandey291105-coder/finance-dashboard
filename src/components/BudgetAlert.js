import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

function BudgetAlert({ transactions, budgets }) {
  const [dismissed, setDismissed] = useState([]);

  const expenses = transactions.filter(t => t.type === 'expense');

  const alerts = Object.entries(budgets).map(([category, limit]) => {
    const spent = expenses
      .filter(t => t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
    const percentage = Math.round((spent / limit) * 100);
    return { category, limit, spent, percentage };
  }).filter(a => a.percentage >= 70 && !dismissed.includes(a.category));

  if (alerts.length === 0) return null;

  return (
    <div style={{ padding: '0 2.5rem', marginBottom: '1rem' }}>
      <AnimatePresence>
        {alerts.map(alert => (
          <motion.div
            key={alert.category}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '8px',
              background: alert.percentage >= 100
                ? 'rgba(248, 113, 113, 0.1)'
                : 'rgba(251, 191, 36, 0.1)',
              border: `1px solid ${alert.percentage >= 100
                ? 'rgba(248, 113, 113, 0.3)'
                : 'rgba(251, 191, 36, 0.3)'}`,
            }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {alert.percentage >= 100
                ? <AlertTriangle size={18} color="#f87171" />
                : <CheckCircle size={18} color="#fbbf24" />
              }
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#fff' }}>
                  {alert.category} — {alert.percentage}% of budget used
                </p>
                <p style={{ fontSize: '0.78rem', color: '#6b6b80' }}>
                  ₹{alert.spent.toLocaleString()} spent of ₹{alert.limit.toLocaleString()} limit
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '100px',
                height: '6px',
                background: '#2a2a3a',
                borderRadius: '10px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${Math.min(alert.percentage, 100)}%`,
                  height: '100%',
                  background: alert.percentage >= 100 ? '#f87171' : '#fbbf24',
                  borderRadius: '10px',
                  transition: 'width 0.5s ease',
                }} />
              </div>
              <button
                onClick={() => setDismissed([...dismissed, alert.category])}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b6b80',
                  display: 'flex',
                  padding: '4px',
                }}>
                <X size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default BudgetAlert;