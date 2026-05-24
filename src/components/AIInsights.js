import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, X, RefreshCw } from 'lucide-react';

function AIInsights({ transactions, budgets }) {
  const { isDark } = useTheme();
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const getInsights = async () => {
    setLoading(true);
    setShow(true);
    setInsights('');

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryWise = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const prompt = `
You are a personal finance advisor. Analyze this user's financial data and give 5 practical insights in simple English. Be specific with numbers.

Financial Summary:
- Total Income: ₹${totalIncome.toLocaleString()}
- Total Expenses: ₹${totalExpense.toLocaleString()}
- Savings: ₹${(totalIncome - totalExpense).toLocaleString()}
- Savings Rate: ${totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0}%

Category-wise Expenses:
${Object.entries(categoryWise).map(([cat, amt]) => `- ${cat}: ₹${amt.toLocaleString()}`).join('\n')}

Budget Limits:
${Object.entries(budgets).map(([cat, limit]) => `- ${cat}: ₹${limit.toLocaleString()}`).join('\n')}

Give exactly 5 insights with emojis. Each insight on a new line. Be encouraging but honest. Focus on actionable advice. IMPORTANT: Write everything in English only. Do not use any Hindi or other language.
    `;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const text = data.choices[0].message.content;
      setInsights(text);
    } catch (err) {
      setInsights('❌ Failed to get insights. Please try again!');
    }

    setLoading(false);
  };

  return (
    <>
      {/* AI Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={getInsights}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none',
          borderRadius: '12px',
          color: '#fff',
          fontSize: '0.95rem',
          fontWeight: '600',
          cursor: 'pointer',
          margin: '0 2.5rem 2.5rem',
        }}>
        <Sparkles size={18} />
        Get AI Insights
      </motion.button>

      {/* Insights Modal */}
      <AnimatePresence>
        {show && (
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
              padding: '1rem',
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
                maxWidth: '550px',
                maxHeight: '80vh',
                overflowY: 'auto',
                position: 'relative',
              }}>

              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={22} color="#6366f1" />
                  <h2 style={{
                    color: isDark ? '#fff' : '#333',
                    margin: 0,
                    fontSize: '1.2rem',
                  }}>
                    AI Spending Insights
                  </h2>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div
                    onClick={getInsights}
                    title="Refresh"
                    style={{
                      cursor: 'pointer',
                      background: isDark ? '#1e1e2e' : '#f0f0f0',
                      borderRadius: '8px',
                      padding: '6px',
                      display: 'flex',
                    }}>
                    <RefreshCw size={16} color="#6366f1" />
                  </div>
                  <div
                    onClick={() => setShow(false)}
                    style={{
                      cursor: 'pointer',
                      background: isDark ? '#1e1e2e' : '#f0f0f0',
                      borderRadius: '8px',
                      padding: '6px',
                      display: 'flex',
                    }}>
                    <X size={16} color={isDark ? '#fff' : '#333'} />
                  </div>
                </div>
              </div>

              {/* Loading */}
              {loading && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'inline-block' }}>
                    <Sparkles size={32} color="#6366f1" />
                  </motion.div>
                  <p style={{ color: '#6b6b80', marginTop: '1rem' }}>
                    AI analyse kar raha hai...
                  </p>
                </div>
              )}

              {/* Insights */}
              {!loading && insights && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}>
                  {insights.split('\n').filter(line => line.trim()).map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      style={{
                        background: isDark ? '#1e1e2e' : '#f5f5f5',
                        border: isDark ? '1px solid #2a2a3a' : '1px solid #e0e0e0',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginBottom: '0.75rem',
                        color: isDark ? '#fff' : '#333',
                        fontSize: '0.9rem',
                        lineHeight: '1.6',
                      }}>
                      {line}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIInsights;