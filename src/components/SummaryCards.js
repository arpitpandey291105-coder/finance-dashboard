import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, PiggyBank, Percent } from 'lucide-react';

function SummaryCards({ transactions }) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const savings = income - expenses;
  const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : 0;

  const cards = [
    {
      label: 'Total Income',
      value: `₹${income.toLocaleString()}`,
      icon: <TrendingUp size={22} color="#4ade80" />,
      color: '#4ade80',
      bg: 'rgba(74, 222, 128, 0.08)',
      border: 'rgba(74, 222, 128, 0.2)',
      sub: null,
    },
    {
      label: 'Total Expenses',
      value: `₹${expenses.toLocaleString()}`,
      icon: <TrendingDown size={22} color="#f87171" />,
      color: '#f87171',
      bg: 'rgba(248, 113, 113, 0.08)',
      border: 'rgba(248, 113, 113, 0.2)',
      sub: income > 0 ? `${((expenses / income) * 100).toFixed(1)}% of income` : null,
    },
    {
      label: 'Net Savings',
      value: `₹${savings.toLocaleString()}`,
      icon: <PiggyBank size={22} color="#818cf8" />,
      color: savings >= 0 ? '#818cf8' : '#f87171',
      bg: 'rgba(129, 140, 248, 0.08)',
      border: 'rgba(129, 140, 248, 0.2)',
      sub: null,
    },
    {
      label: 'Savings Rate',
      value: `${savingsRate}%`,
      icon: <Percent size={22} color="#fbbf24" />,
      color: savingsRate >= 20 ? '#4ade80' : savingsRate >= 10 ? '#fbbf24' : '#f87171',
      bg: 'rgba(251, 191, 36, 0.08)',
      border: 'rgba(251, 191, 36, 0.2)',
      sub: savingsRate >= 20 ? '🎯 Great saving!' : savingsRate >= 10 ? '⚠️ Can improve' : '❗ Low savings',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1.2rem',
      padding: '2rem 2.5rem 0',
    }}>
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          whileHover={{ scale: 1.02 }}
          style={{
            background: '#13131a',
            borderRadius: '16px',
            padding: '1.5rem',
            border: `1px solid ${card.border}`,
            backgroundColor: card.bg,
          }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1rem',
          }}>
            <p style={{ fontSize: '0.85rem', color: '#6b6b80', fontWeight: '500' }}>
              {card.label}
            </p>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '10px',
              padding: '8px',
              display: 'flex',
            }}>
              {card.icon}
            </div>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: card.color }}>
            {card.value}
          </p>
          {card.sub && (
            <p style={{ fontSize: '0.78rem', color: '#6b6b80', marginTop: '6px' }}>
              {card.sub}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default SummaryCards;