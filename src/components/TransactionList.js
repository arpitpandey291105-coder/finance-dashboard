import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Zap, Car, Home, Briefcase, TrendingUp, Trash2 } from 'lucide-react';

const categoryIcon = (category) => {
  const map = {
    Food: <ShoppingBag size={16} />,
    Utilities: <Zap size={16} />,
    Transport: <Car size={16} />,
    Rent: <Home size={16} />,
    Freelance: <Briefcase size={16} />,
    Salary: <TrendingUp size={16} />,
  };
  return map[category] || <ShoppingBag size={16} />;
};

function TransactionList({ transactions, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: '#13131a',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #2a2a3a',
        maxHeight: '420px',
        overflowY: 'auto',
      }}>
      <h2 style={{
        fontSize: '1rem',
        fontWeight: '600',
        color: '#fff',
        marginBottom: '1.5rem',
      }}>
        Recent Transactions
      </h2>

      {transactions.length === 0 && (
        <p style={{ color: '#6b6b80', fontSize: '0.9rem' }}>No transactions yet.</p>
      )}

      <AnimatePresence>
        {[...transactions].reverse().map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              borderRadius: '12px',
              marginBottom: '8px',
              background: '#1a1a24',
              border: '1px solid #2a2a3a',
            }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: t.type === 'income'
                  ? 'rgba(74, 222, 128, 0.1)'
                  : 'rgba(248, 113, 113, 0.1)',
                borderRadius: '10px',
                padding: '8px',
                color: t.type === 'income' ? '#4ade80' : '#f87171',
                display: 'flex',
              }}>
                {categoryIcon(t.category)}
              </div>
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#fff' }}>
                  {t.category}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#6b6b80' }}>
                  {t.note} · {t.date}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                fontSize: '0.95rem',
                fontWeight: '700',
                color: t.type === 'income' ? '#4ade80' : '#f87171',
              }}>
                {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(t.id)}
                style={{
                  background: 'rgba(248, 113, 113, 0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px',
                  cursor: 'pointer',
                  color: '#f87171',
                  display: 'flex',
                }}>
                <Trash2 size={14} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export default TransactionList;