import React, { useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const COLORS = [
  '#6366f1', '#4ade80', '#f87171',
  '#fbbf24', '#38bdf8', '#a78bfa',
];

function ExpenseChart({ transactions }) {
  const [view, setView] = useState('pie'); // 'pie' ya 'trend'

  const expenses = transactions.filter(t => t.type === 'expense');
  const categories = [...new Set(expenses.map(t => t.category))];
  const amounts = categories.map(cat =>
    expenses.filter(t => t.category === cat).reduce((sum, t) => sum + t.amount, 0)
  );
  const total = amounts.reduce((a, b) => a + b, 0);

  // Category trend — bar chart ke liye
  const trendData = {
    labels: categories,
    datasets: [
      {
        label: 'Spending',
        data: amounts,
        backgroundColor: COLORS,
        borderRadius: 6,
      },
    ],
  };

  const pieData = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: COLORS,
        borderColor: '#13131a',
        borderWidth: 3,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#9ca3af',
          padding: 16,
          font: { size: 12, family: 'Plus Jakarta Sans' },
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: '#1e1e2e',
        titleColor: '#fff',
        bodyColor: '#9ca3af',
        borderColor: '#2a2a3a',
        borderWidth: 1,
        callbacks: {
          label: (context) =>
            ` ₹${context.parsed.toLocaleString()} (${((context.parsed / total) * 100).toFixed(1)}%)`,
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e1e2e',
        titleColor: '#fff',
        bodyColor: '#9ca3af',
        borderColor: '#2a2a3a',
        borderWidth: 1,
        callbacks: {
          label: (context) =>
            ` ₹${context.parsed.y.toLocaleString()} (${((context.parsed.y / total) * 100).toFixed(1)}%)`,
        },
      },
    },
    scales: {
      x: { ticks: { color: '#6b6b80' }, grid: { color: '#1e1e2e' } },
      y: {
        ticks: {
          color: '#6b6b80',
          callback: (val) => '₹' + val.toLocaleString(),
        },
        grid: { color: '#1e1e2e' },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: '#13131a',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #2a2a3a',
      }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#fff' }}>
          Expense Breakdown
        </h2>
        {expenses.length > 0 && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {['pie', 'trend'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(99,102,241,0.3)',
                  background: view === v ? 'rgba(99,102,241,0.3)' : 'transparent',
                  color: view === v ? '#818cf8' : '#6b6b80',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}>
                {v === 'pie' ? 'Pie' : 'Trend'}
              </button>
            ))}
          </div>
        )}
      </div>

      {expenses.length === 0 ? (
        <p style={{ color: '#6b6b80', fontSize: '0.9rem' }}>No expenses yet.</p>
      ) : view === 'pie' ? (
        <Pie data={pieData} options={pieOptions} />
      ) : (
        <div style={{ height: '250px' }}>
          <Bar data={trendData} options={{ ...barOptions, maintainAspectRatio: false }} />
        </div>
      )}
    </motion.div>
  );
}

export default ExpenseChart;