import React, { useState, useEffect } from 'react';
import { initialTransactions } from './data';
import Navbar from './components/Navbar';
import SummaryCards from './components/SummaryCards';
import ExpenseChart from './components/ExpenseChart';
import AddTransaction from './components/AddTransaction';
import TransactionList from './components/TransactionList';
import MonthlyChart from './components/MonthlyChart';
import CategoryFilter from './components/Filter';
import BudgetAlert from './components/BudgetAlert';
import BudgetSettings from './components/BudgetSettings';
import ExportCSV from './components/ExportCSV';
import ImportCSV from './components/ImportCSV';

import { auth, provider, db } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import {
  collection, doc, setDoc, deleteDoc,
  onSnapshot, query, where
} from 'firebase/firestore';

const DEFAULT_BUDGETS = {
  Food: 5000,
  Rent: 15000,
  Transport: 3000,
  Utilities: 4000,
  Shopping: 5000,
};

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState(DEFAULT_BUDGETS);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // 🔐 Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 🔥 Load transactions from Firestore in real-time
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'transactions'),
      where('uid', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(data);
    });

    return () => unsubscribe();
  }, [user]);

  // 🔥 Load budgets from Firestore in real-time
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'budgets', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setBudgets(docSnap.data());
      } else {
        setBudgets(DEFAULT_BUDGETS);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setTransactions([]);
    setBudgets(DEFAULT_BUDGETS);
  };

  // ➕ Add transaction to Firestore
  const handleAdd = async (transaction) => {
    const newDoc = doc(collection(db, 'transactions'));
    await setDoc(newDoc, { ...transaction, uid: user.uid, id: newDoc.id });
  };

  // 🗑️ Delete transaction from Firestore
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'transactions', id));
  };

  // 💾 Save budgets to Firestore
  const handleSaveBudgets = async (newBudgets) => {
    await setDoc(doc(db, 'budgets', user.uid), newBudgets);
  };

  // 📥 Import CSV — bulk add to Firestore
  const handleImport = async (importedTransactions) => {
    for (const t of importedTransactions) {
      const newDoc = doc(collection(db, 'transactions'));
      await setDoc(newDoc, { ...t, uid: user.uid, id: newDoc.id });
    }
  };

  const filteredTransactions = selectedCategory === 'All'
    ? transactions
    : transactions.filter(t => t.category === selectedCategory);

  // ⏳ Loading state
  if (authLoading) {
    return (
      <div style={{
        backgroundColor: '#0f0f13',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  // 🔐 Login screen
  if (!user) {
    return (
      <div style={{
        backgroundColor: '#0f0f13',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
      }}>
        <h1 style={{ color: '#fff', fontSize: '2rem', margin: 0 }}>💰 FinancePro</h1>
        <p style={{ color: '#aaa', margin: 0 }}>Sign in to sync your finances across devices</p>
        <button
          onClick={handleLogin}
          style={{
            padding: '12px 28px',
            backgroundColor: '#4285F4',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  // ✅ Main Dashboard
  return (
    <div style={{ backgroundColor: '#0f0f13', minHeight: '100vh' }}>
      <Navbar user={user} onLogout={handleLogout} />
      <SummaryCards transactions={transactions} />
      <BudgetAlert transactions={transactions} budgets={budgets} />
      <AddTransaction onAdd={handleAdd} />
      <MonthlyChart transactions={transactions} />
      <CategoryFilter
        transactions={transactions}
        selectedCategory={selectedCategory}
        onFilter={setSelectedCategory}
      />
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr',
        gap: '1.5rem',
        padding: '0 2.5rem 2.5rem',
      }}>
        <ExpenseChart transactions={filteredTransactions} />
        <TransactionList
          transactions={filteredTransactions}
          onDelete={handleDelete}
        />
      </div>
      <div style={{
        display: 'flex',
        gap: '12px',
        padding: '0 2.5rem 2.5rem',
        alignItems: 'center',
      }}>
        <BudgetSettings budgets={budgets} onSave={handleSaveBudgets} />
        <ExportCSV transactions={transactions} />
        <ImportCSV onImport={handleImport} />
      </div>
    </div>
  );
}

export default App;