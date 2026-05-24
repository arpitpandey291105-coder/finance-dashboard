import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Bell, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function Navbar({ user, onLogout, onProfileClick }) {
  const { isDark, toggleTheme } = useTheme();
  const today = new Date().toLocaleDateString('en-IN', { dateStyle: 'long' });

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2.5rem',
        background: isDark ? '#13131a' : '#ffffff',
        borderBottom: isDark ? '1px solid #2a2a3a' : '1px solid #e0e0e0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          borderRadius: '10px',
          padding: '6px',
          display: 'flex',
        }}>
          <LayoutDashboard size={20} color="#fff" />
        </div>
        <span style={{ fontSize: '1.2rem', fontWeight: '700', color: isDark ? '#fff' : '#333' }}>
          Finance<span style={{ color: '#6366f1' }}>Pro</span>
        </span>
      </div>

      {/* Date */}
      <span style={{ fontSize: '0.85rem', color: '#6b6b80' }}>{today}</span>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

        {/* Theme Toggle */}
        <div
          onClick={toggleTheme}
          title="Toggle Theme"
          style={{
            background: isDark ? '#1e1e2e' : '#f0f0f0',
            border: isDark ? '1px solid #2a2a3a' : '1px solid #e0e0e0',
            borderRadius: '10px',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
          }}>
          {isDark
            ? <Sun size={18} color="#f59e0b" />
            : <Moon size={18} color="#6366f1" />
          }
        </div>

        {/* Bell */}
        <div style={{
          background: isDark ? '#1e1e2e' : '#f0f0f0',
          border: isDark ? '1px solid #2a2a3a' : '1px solid #e0e0e0',
          borderRadius: '10px',
          padding: '8px',
          cursor: 'pointer',
          display: 'flex',
        }}>
          <Bell size={18} color="#6b6b80" />
        </div>

        {/* User Photo + Name */}
        {user && (
          <>
            <div
              onClick={onProfileClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}>
              <img
                src={user.photoURL}
                alt="avatar"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  border: '2px solid #6366f1',
                }}
              />
              <span style={{
                fontSize: '0.85rem',
                color: isDark ? '#fff' : '#333',
                fontWeight: '500',
              }}>
                {user.displayName?.split(' ')[0]}
              </span>
            </div>

            {/* Logout Button */}
            <div
              onClick={onLogout}
              title="Logout"
              style={{
                background: isDark ? '#1e1e2e' : '#f0f0f0',
                border: isDark ? '1px solid #2a2a3a' : '1px solid #e0e0e0',
                borderRadius: '10px',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
              }}>
              <LogOut size={18} color="#ef4444" />
            </div>
          </>
        )}
      </div>
    </motion.nav>
  );
}

export default Navbar;