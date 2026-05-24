import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Mail, Calendar, X } from 'lucide-react';

function ProfilePage({ user, transactions, onClose }) {
  const { isDark } = useTheme();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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
        style={{
          background: isDark ? '#13131a' : '#ffffff',
          border: isDark ? '1px solid #2a2a3a' : '1px solid #e0e0e0',
          borderRadius: '20px',
          padding: '2rem',
          width: '400px',
          position: 'relative',
        }}>

        {/* Close Button */}
        <div
          onClick={onClose}
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

        {/* Profile Photo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img
            src={user.photoURL}
            alt="profile"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: '3px solid #6366f1',
              marginBottom: '0.75rem',
            }}
          />
          <h2 style={{
            color: isDark ? '#fff' : '#333',
            margin: '0 0 4px',
            fontSize: '1.3rem',
          }}>
            {user.displayName}
          </h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: '#6b6b80',
            fontSize: '0.85rem',
          }}>
            <Mail size={14} />
            {user.email}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
          marginBottom: '1.5rem',
        }}>
          <div style={{
            background: isDark ? '#1e1e2e' : '#f5f5f5',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center',
          }}>
            <p style={{ color: '#6b6b80', fontSize: '0.75rem', margin: '0 0 4px' }}>Transactions</p>
            <p style={{ color: isDark ? '#fff' : '#333', fontWeight: '700', margin: 0 }}>
              {transactions.length}
            </p>
          </div>
          <div style={{
            background: isDark ? '#1e1e2e' : '#f5f5f5',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center',
          }}>
            <p style={{ color: '#6b6b80', fontSize: '0.75rem', margin: '0 0 4px' }}>Income</p>
            <p style={{ color: '#22c55e', fontWeight: '700', margin: 0 }}>
              ₹{totalIncome.toLocaleString()}
            </p>
          </div>
          <div style={{
            background: isDark ? '#1e1e2e' : '#f5f5f5',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center',
          }}>
            <p style={{ color: '#6b6b80', fontSize: '0.75rem', margin: '0 0 4px' }}>Expense</p>
            <p style={{ color: '#ef4444', fontWeight: '700', margin: 0 }}>
              ₹{totalExpense.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Member Since */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#6b6b80',
          fontSize: '0.85rem',
          justifyContent: 'center',
        }}>
          <Calendar size={14} />
          Member since {new Date(user.metadata.creationTime).toLocaleDateString('en-IN', { dateStyle: 'long' })}
        </div>

      </motion.div>
    </motion.div>
  );
}

export default ProfilePage;