import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

function ExportCSV({ transactions }) {
  const handleExport = () => {
    const headers = ['Date', 'Type', 'Category', 'Note', 'Amount'];

    const rows = transactions.map(t => [
      t.date,
      t.type,
      t.category,
      t.note,
      t.amount,
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleExport}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        borderRadius: '10px',
        border: '1px solid rgba(99,102,241,0.3)',
        background: 'rgba(99,102,241,0.1)',
        color: '#818cf8',
        fontSize: '0.85rem',
        fontWeight: '500',
        cursor: 'pointer',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
      }}>
      <Download size={15} />
      Export CSV
    </motion.button>
  );
}

export default ExportCSV;