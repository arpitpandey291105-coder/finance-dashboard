import React from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

function CategoryFilter({ transactions, selectedCategory, onFilter }) {
  const categories = ['All', ...new Set(transactions.map(t => t.category))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '1rem 2.5rem',
        flexWrap: 'wrap',
      }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '6px' }}>
        <Filter size={15} color="#6b6b80" />
        <span style={{ fontSize: '0.85rem', color: '#6b6b80' }}>Filter:</span>
      </div>

      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onFilter(cat)}
          style={{
            padding: '6px 16px',
            borderRadius: '20px',
            border: '1px solid',
            borderColor: selectedCategory === cat ? '#6366f1' : '#2a2a3a',
            background: selectedCategory === cat ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            color: selectedCategory === cat ? '#818cf8' : '#6b6b80',
            fontSize: '0.82rem',
            fontWeight: '500',
            cursor: 'pointer',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            transition: 'all 0.2s',
          }}>
          {cat}
        </button>
      ))}
    </motion.div>
  );
}

export default CategoryFilter;