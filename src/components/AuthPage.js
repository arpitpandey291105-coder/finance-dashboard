import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, provider } from '../firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { LayoutDashboard, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError('Google login failed. Try again!');
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill all fields!');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters!');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      if (err.code === 'auth/user-not-found') setError('No account found with this email!');
      else if (err.code === 'auth/wrong-password') setError('Wrong password!');
      else if (err.code === 'auth/email-already-in-use') setError('Email already registered!');
      else if (err.code === 'auth/invalid-email') setError('Invalid email address!');
      else setError('Something went wrong. Try again!');
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    setError('');
    setSuccess('');
    if (!email) {
      setError('Please enter your email first!');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError('Failed to send reset email. Check your email address!');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px 12px 44px',
    background: '#1e1e2e',
    border: '1px solid #2a2a3a',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      backgroundColor: '#0f0f13',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#13131a',
          border: '1px solid #2a2a3a',
          borderRadius: '20px',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '420px',
        }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '14px',
            padding: '10px',
            display: 'inline-flex',
            marginBottom: '0.75rem',
          }}>
            <LayoutDashboard size={28} color="#fff" />
          </div>
          <h1 style={{ color: '#fff', margin: '0 0 4px', fontSize: '1.5rem', fontWeight: '700' }}>
            Finance<span style={{ color: '#6366f1' }}>Pro</span>
          </h1>
          <p style={{ color: '#6b6b80', margin: 0, fontSize: '0.85rem' }}>
            {showForgot ? 'Reset your password' : isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {/* Toggle Login/Signup */}
        {!showForgot && (
          <div style={{
            display: 'flex',
            background: '#1e1e2e',
            borderRadius: '10px',
            padding: '4px',
            marginBottom: '1.5rem',
          }}>
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              style={{
                flex: 1,
                padding: '8px',
                background: isLogin ? '#6366f1' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: isLogin ? '#fff' : '#6b6b80',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem',
                transition: 'all 0.3s',
              }}>
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              style={{
                flex: 1,
                padding: '8px',
                background: !isLogin ? '#6366f1' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: !isLogin ? '#fff' : '#6b6b80',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem',
                transition: 'all 0.3s',
              }}>
              Sign Up
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: '#2d1a1a',
              border: '1px solid #ef4444',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#ef4444',
              fontSize: '0.85rem',
            }}>
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: '#1a2d1a',
              border: '1px solid #22c55e',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '1rem',
              color: '#22c55e',
              fontSize: '0.85rem',
            }}>
            {success}
          </motion.div>
        )}

        {/* Email Field */}
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <Mail size={16} color="#6b6b80" style={{
            position: 'absolute', left: '14px', top: '50%',
            transform: 'translateY(-50%)', pointerEvents: 'none'
          }} />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Password Field */}
        {!showForgot && (
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Lock size={16} color="#6b6b80" style={{
              position: 'absolute', left: '14px', top: '50%',
              transform: 'translateY(-50%)', pointerEvents: 'none'
            }} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: '44px' }}
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: '14px', top: '50%',
                transform: 'translateY(-50%)', cursor: 'pointer'
              }}>
              {showPassword
                ? <EyeOff size={16} color="#6b6b80" />
                : <Eye size={16} color="#6b6b80" />
              }
            </div>
          </div>
        )}

        {/* Confirm Password — Sign Up only */}
        {!isLogin && !showForgot && (
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Lock size={16} color="#6b6b80" style={{
              position: 'absolute', left: '14px', top: '50%',
              transform: 'translateY(-50%)', pointerEvents: 'none'
            }} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={inputStyle}
            />
          </div>
        )}

        {/* Forgot Password Link */}
        {isLogin && !showForgot && (
          <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
            <span
              onClick={() => { setShowForgot(true); setError(''); }}
              style={{ color: '#6366f1', fontSize: '0.85rem', cursor: 'pointer' }}>
              Forgot password?
            </span>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={showForgot ? handleForgotPassword : handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '1rem',
            opacity: loading ? 0.7 : 1,
          }}>
          {loading ? 'Please wait...' :
            showForgot ? 'Send Reset Email' :
            isLogin ? 'Login' : 'Create Account'}
        </button>

        {/* Back to Login */}
        {showForgot && (
          <p style={{ textAlign: 'center', color: '#6b6b80', fontSize: '0.85rem' }}>
            <span
              onClick={() => { setShowForgot(false); setError(''); setSuccess(''); }}
              style={{ color: '#6366f1', cursor: 'pointer' }}>
              ← Back to Login
            </span>
          </p>
        )}

        {/* Divider */}
        {!showForgot && (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '1rem',
            }}>
              <div style={{ flex: 1, height: '1px', background: '#2a2a3a' }} />
              <span style={{ color: '#6b6b80', fontSize: '0.8rem' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: '#2a2a3a' }} />
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogle}
              style={{
                width: '100%',
                padding: '12px',
                background: '#1e1e2e',
                border: '1px solid #2a2a3a',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '0.95rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}>
              <img
                src="https://www.google.com/favicon.ico"
                alt="google"
                style={{ width: '18px', height: '18px' }}
              />
              Continue with Google
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default AuthPage;