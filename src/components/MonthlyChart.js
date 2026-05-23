import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function MonthlyChart({ transactions }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const incomeData  = Array(12).fill(0);
  const expenseData = Array(12).fill(0);
  const savingsData = Array(12).fill(0);

  transactions.forEach(t => {
    const month = new Date(t.date).getMonth();
    if (t.type === 'income') incomeData[month] += t.amount;
    else expenseData[month] += t.amount;
  });

  months.forEach((_, i) => {
    savingsData[i] = incomeData[i] - expenseData[i];
  });

  // Sirf woh months dikhao jisme data hai
  const activeMonths = months.filter((_, i) =>
    incomeData[i] > 0 || expenseData[i] > 0
  );
  const activeIncome   = incomeData.filter((_, i) => incomeData[i] > 0 || expenseData[i] > 0);
  const activeExpense  = expenseData.filter((_, i) => incomeData[i] > 0 || expenseData[i] > 0);
  const activeSavings  = savingsData.filter((_, i) => incomeData[i] > 0 || expenseData[i] > 0);

  const data = {
    labels: activeMonths.length > 0 ? activeMonths : months,
    datasets: [
      {
        label: 'Income',
        data: activeMonths.length > 0 ? activeIncome : incomeData,
        backgroundColor: 'rgba(74, 222, 128, 0.7)',
        borderRadius: 6,
      },
      {
        label: 'Expenses',
        data: activeMonths.length > 0 ? activeExpense : expenseData,
        backgroundColor: 'rgba(248, 113, 113, 0.7)',
        borderRadius: 6,
      },
      {
        label: 'Savings',
        data: activeMonths.length > 0 ? activeSavings : savingsData,
        backgroundColor: 'rgba(129, 140, 248, 0.7)',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#9ca3af',
          font: { size: 12, family: 'Plus Jakarta Sans' },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: '#1e1e2e',
        titleColor: '#fff',
        bodyColor: '#9ca3af',
        borderColor: '#2a2a3a',
        borderWidth: 1,
        callbacks: {
          label: (context) => ` ₹${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#6b6b80' },
        grid: { color: '#1e1e2e' },
      },
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: '#13131a',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #2a2a3a',
        margin: '1.5rem 2.5rem',
      }}>
      <h2 style={{
        fontSize: '1rem',
        fontWeight: '600',
        color: '#fff',
        marginBottom: '1.5rem',
      }}>
        Monthly Income vs Expenses vs Savings
      </h2>
      <div style={{ height: '250px' }}>
        <Bar data={data} options={{ ...options, maintainAspectRatio: false }} />
      </div>
    </motion.div>
  );
}

export default MonthlyChart;