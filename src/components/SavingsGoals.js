import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { db } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { Target, Plus, Trash2, X } from 'lucide-react';

function SavingsGoals({ user, transactions }) {
  const { isDark } = useTheme();
  const [goals, setGoals] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('');
  const [emoji, setEmoji] = useState('🎯');

  const emojis = ['🎯', '🏠', '🚗', '✈️', '💻', '📱', '🎓', '💍', '🏋️', '🌴'];

  // Load goals from Firestore
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, 'goals', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setGoals(docSnap.data().list || []);
      }
    });
    return () => unsubscribe();
  }, [user]);

  // Save goals to Firestore
  const saveGoals = async (updatedGoals) => {
    await setDoc(doc(db, 'goals', user.uid), { list: updatedGoals });
  };

  const handleAdd = async () => {
    if (!name || !targetAmount) return;
    const newGoal = {
      id: Date.now().toString(),
      name,
      emoji,
      targetAmount: Number(targetAmount),
      savedAmount: Number(savedAmount) || 0,
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    await saveGoals(updated);
    setName('');
    setTargetAmount('');
    setSavedAmount('');
    setEmoji('🎯');
    setShowAdd(false);
  };

  const handleDelete = async (id) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    await saveGoals(updated);
  };

  const handleAddSavings = async (id, amount) => {
    const updated = goals.map(g =>
      g.id === id
        ? { ...g, savedAmount: Math.min(g.savedAmount + amount, g.targetAmount) }
        : g
    );
    setGoals(updated);
    await saveGoals(updated);
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    background: isDark ? '#0f0f13' : '#f5f5f5',
    border: isDark ? '1px solid #2a2a3a' : '1px solid #e0e0e0',
    borderRadius: '10px',
    color: isDark ? '#fff' : '#333',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ padding: '0 2.5rem 2.5rem' }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Target size={22} color="#6366f1" />
          <h2 style={{
            color: isDark ? '#fff' : '#333',
            margin: 0,
            fontSize: '1.2rem',
            fontWeight: '700',
          }}>
            Savings Goals
          </h2>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}>
          <Plus size={16} />
          Add Goal
        </button>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: isDark ? '#13131a' : '#ffffff',
          border: isDark ? '1px solid #2a2a3a' : '1px solid #e0e0e0',
          borderRadius: '16px',
          color: '#6b6b80',
        }}>
          <Target size={40} color="#6b6b80" style={{ marginBottom: '1rem' }} />
          <p style={{ margin: 0 }}>No savings goals yet. Add your first goal!</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>
          {goals.map(goal => {
            const percent = Math.round((goal.savedAmount / goal.targetAmount) * 100);
            const remaining = goal.targetAmount - goal.savedAmount;
            const isComplete = percent >= 100;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: isDark ? '#13131a' : '#ffffff',
                  border: isDark ? '1px solid #2a2a3a' : '1px solid #e0e0e0',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  position: 'relative',
                }}>

                {/* Delete Button */}
                <div
                  onClick={() => handleDelete(goal.id)}
                  style={{
                    position: 'absolute',
                    top: '1rem', right: '1rem',
                    cursor: 'pointer',
                    background: isDark ? '#1e1e2e' : '#f0f0f0',
                    borderRadius: '8px',
                    padding: '4px',
                    display: 'flex',
                  }}>
                  <Trash2 size={14} color="#ef4444" />
                </div>

                {/* Goal Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>{goal.emoji}</span>
                  <div>
                    <h3 style={{
                      color: isDark ? '#fff' : '#333',
                      margin: '0 0 4px',
                      fontSize: '1rem',
                      fontWeight: '700',
                    }}>
                      {goal.name}
                    </h3>
                    <p style={{ color: '#6b6b80', margin: 0, fontSize: '0.8rem' }}>
                      ₹{goal.savedAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{
                  background: isDark ? '#1e1e2e' : '#f0f0f0',
                  borderRadius: '999px',
                  height: '10px',
                  marginBottom: '0.75rem',
                  overflow: 'hidden',
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percent, 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      borderRadius: '999px',
                      background: isComplete
                        ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                        : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    }}
                  />
                </div>

                {/* Percent + Remaining */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}>
                  <span style={{
                    color: isComplete ? '#22c55e' : '#6366f1',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                  }}>
                    {isComplete ? '🎉 Completed!' : `${percent}% done`}
                  </span>
                  {!isComplete && (
                    <span style={{ color: '#6b6b80', fontSize: '0.8rem' }}>
                      ₹{remaining.toLocaleString()} remaining
                    </span>
                  )}
                </div>

                {/* Add Money Button */}
                {!isComplete && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[500, 1000, 5000].map(amount => (
                      <button
                        key={amount}
                        onClick={() => handleAddSavings(goal.id, amount)}
                        style={{
                          flex: 1,
                          padding: '6px',
                          background: isDark ? '#1e1e2e' : '#f0f0f0',
                          border: isDark ? '1px solid #2a2a3a' : '1px solid #e0e0e0',
                          borderRadius: '8px',
                          color: isDark ? '#fff' : '#333',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          fontWeight: '500',
                        }}>
                        +₹{amount}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{
                background: isDark ? '#13131a' : '#ffffff',
                border: isDark ? '1px solid #2a2a3a' : '1px solid #e0e0e0',
                borderRadius: '20px',
                padding: '2rem',
                width: '100%',
                maxWidth: '400px',
                position: 'relative',
              }}>

              {/* Close */}
              <div
                onClick={() => setShowAdd(false)}
                style={{
                  position: 'absolute',
                  top: '1rem', right: '1rem',
                  cursor: 'pointer',
                  background: isDark ? '#1e1e2e' : '#f0f0f0',
                  borderRadius: '8px',
                  padding: '4px',
                  display: 'flex',
                }}>
                <X size={18} color={isDark ? '#fff' : '#333'} />
              </div>

              <h3 style={{
                color: isDark ? '#fff' : '#333',
                margin: '0 0 1.5rem',
                fontSize: '1.1rem',
              }}>
                🎯 New Savings Goal
              </h3>

              {/* Emoji Picker */}
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: '#6b6b80', fontSize: '0.8rem', margin: '0 0 8px' }}>Choose Icon</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {emojis.map(e => (
                    <div
                      key={e}
                      onClick={() => setEmoji(e)}
                      style={{
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '8px',
                        background: emoji === e
                          ? (isDark ? '#2a2a3a' : '#e0e0e0')
                          : 'transparent',
                      }}>
                      {e}
                    </div>
                  ))}
                </div>
              </div>

              {/* Goal Name */}
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: '#6b6b80', fontSize: '0.8rem', margin: '0 0 8px' }}>Goal Name</p>
                <input
                  type="text"
                  placeholder="e.g. New Laptop"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* Target Amount */}
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: '#6b6b80', fontSize: '0.8rem', margin: '0 0 8px' }}>Target Amount (₹)</p>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={targetAmount}
                  onChange={e => setTargetAmount(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* Already Saved */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: '#6b6b80', fontSize: '0.8rem', margin: '0 0 8px' }}>Already Saved (₹)</p>
                <input
                  type="number"
                  placeholder="e.g. 10000 (optional)"
                  value={savedAmount}
                  onChange={e => setSavedAmount(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* Add Button */}
              <button
                onClick={handleAdd}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>
                Add Goal 🎯
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SavingsGoals;