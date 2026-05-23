import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Plus, Trash2 } from 'lucide-react';

function BudgetSettings({ budgets, onSave }) {
  const [open, setOpen] = useState(false);
  const [localBudgets, setLocalBudgets] = useState(budgets);
  const [newCategory, setNewCategory] = useState('');
  const [newLimit, setNewLimit] = useState('');

  const handleChange = (category, value) => {
    setLocalBudgets({ ...localBudgets, [category]: parseFloat(value) || 0 });
  };

  const handleAdd = () => {
    if (!newCategory || !newLimit) return;
    setLocalBudgets({ ...localBudgets, [newCategory]: parseFloat(newLimit) });
    setNewCategory('');
    setNewLimit('');
  };

  const handleDelete = (category) => {
    const updated = { ...localBudgets };
    delete updated[category];
    setLocalBudgets(updated);
  };

  const handleSave = () => {
    onSave(localBudgets);
    setOpen(false);
  };

  const inputStyle = {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #2a2a3a',
    background: '#1a1a24',
    color: '#fff',
    fontSize: '0.85rem',
    outline: 'none',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          borderRadius: '10px',
          border: '1px solid #2a2a3a',
          background: 'transparent',
          color: '#6b6b80',
          fontSize: '0.85rem',
          cursor: 'pointer',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          margin: '0 2.5rem 1rem',
        }}>
        <Settings size={15} />
        Set Budget Limits
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              zIndex: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: '#13131a',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #2a2a3a',
                width: '100%',
                maxWidth: '480px',
                margin: '1rem',
              }}>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}>
                <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#fff' }}>
                  Set Budget Limits
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b6b80',
                    display: 'flex',
                  }}>
                  <X size={18} />
                </button>
              </div>

              {/* Existing budgets */}
              {Object.entries(localBudgets).map(([category, limit]) => (
                <div key={category} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px',
                }}>
                  <span style={{
                    flex: 1,
                    fontSize: '0.9rem',
                    color: '#fff',
                    fontWeight: '500',
                  }}>
                    {category}
                  </span>
                  <input
                    type="number"
                    value={limit}
                    onChange={(e) => handleChange(category, e.target.value)}
                    style={{ ...inputStyle, width: '130px' }}
                  />
                  <button
                    onClick={() => handleDelete(category)}
                    style={{
                      background: 'rgba(248,113,113,0.1)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px',
                      cursor: 'pointer',
                      color: '#f87171',
                      display: 'flex',
                    }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {/* Add new category */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #2a2a3a',
              }}>
                <input
                  type="text"
                  placeholder="Category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <input
                  type="number"
                  placeholder="Limit (₹)"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  style={{ ...inputStyle, width: '120px' }}
                />
                <button
                  onClick={handleAdd}
                  style={{
                    background: 'rgba(99,102,241,0.15)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    borderRadius: '8px',
                    padding: '8px',
                    cursor: 'pointer',
                    color: '#818cf8',
                    display: 'flex',
                  }}>
                  <Plus size={16} />
                </button>
              </div>

              {/* Save button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                style={{
                  width: '100%',
                  marginTop: '1.5rem',
                  padding: '10px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}>
                Save Limits
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default BudgetSettings;