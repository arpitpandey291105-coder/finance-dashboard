import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';

function AddTransaction({ onAdd }) {
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    note: '',
    date: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.date) {
      alert('Please fill amount, category and date');
      return;
    }
    onAdd({
      id: Date.now(),
      type: form.type,
      amount: parseFloat(form.amount),
      category: form.category,
      note: form.note,
      date: form.date,
    });
    setForm({ type: 'expense', amount: '', category: '', note: '', date: '' });
  };

  const inputStyle = {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #2a2a3a',
    fontSize: '0.9rem',
    outline: 'none',
    width: '100%',
    background: '#1a1a24',
    color: '#fff',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: '#13131a',
        borderRadius: '16px',
        padding: '1.5rem',
        margin: '1.5rem 2.5rem',
        border: '1px solid #2a2a3a',
      }}>

      <h2 style={{
        fontSize: '1rem',
        fontWeight: '600',
        color: '#fff',
        marginBottom: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <PlusCircle size={18} color="#6366f1" />
        Add Transaction
      </h2>

      <form onSubmit={handleSubmit} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
      }}>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          style={inputStyle}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          type="number"
          name="amount"
          placeholder="Amount (₹)"
          value={form.amount}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="text"
          name="note"
          placeholder="Note (optional)"
          value={form.note}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          style={{
            ...inputStyle,
            colorScheme: 'dark',
          }}
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}>
          + Add
        </motion.button>
      </form>
    </motion.div>
  );
}

export default AddTransaction;