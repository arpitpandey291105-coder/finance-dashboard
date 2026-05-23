import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Bell, LogOut } from 'lucide-react';

function Navbar({ user, onLogout }) {
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
        background: '#13131a',
        borderBottom: '1px solid #2a2a3a',
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
        <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>
          Finance<span style={{ color: '#6366f1' }}>Pro</span>
        </span>
      </div>

      {/* Date */}
      <span style={{ fontSize: '0.85rem', color: '#6b6b80' }}>{today}</span>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

        {/* Bell */}
        <div style={{
          background: '#1e1e2e',
          border: '1px solid #2a2a3a',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                color: '#fff',
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
                background: '#1e1e2e',
                border: '1px solid #2a2a3a',
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