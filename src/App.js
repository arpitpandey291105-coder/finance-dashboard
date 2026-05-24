import React, { useState, useEffect } from 'react';
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
import ProfilePage from './components/ProfilePage';
import AuthPage from './components/AuthPage';
import SavingsGoals from './components/SavingsGoals';
import AIInsights from './components/AIInsights';

import { auth, db } from './firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import {
  collection, doc, setDoc, deleteDoc,
  onSnapshot, query, where
} from 'firebase/firestore';
import { useTheme } from './context/ThemeContext';

const DEFAULT_BUDGETS = {
  Food: 5000,
  Rent: 15000,
  Transport: 3000,
  Utilities: 4000,
  Shopping: 5000,
};

function App() {
  const { isDark } = useTheme();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState(DEFAULT_BUDGETS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

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

  const handleLogout = async () => {
    await signOut(auth);
    setTransactions([]);
    setBudgets(DEFAULT_BUDGETS);
  };

  const handleAdd = async (transaction) => {
    const newDoc = doc(collection(db, 'transactions'));
    await setDoc(newDoc, { ...transaction, uid: user.uid, id: newDoc.id });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'transactions', id));
  };

  const handleSaveBudgets = async (newBudgets) => {
    await setDoc(doc(db, 'budgets', user.uid), newBudgets);
  };

  const handleImport = async (importedTransactions) => {
    for (const t of importedTransactions) {
      const newDoc = doc(collection(db, 'transactions'));
      await setDoc(newDoc, { ...t, uid: user.uid, id: newDoc.id });
    }
  };

  const filteredTransactions = selectedCategory === 'All'
    ? transactions
    : transactions.filter(t => t.category === selectedCategory);

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

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div style={{
      backgroundColor: isDark ? '#0f0f13' : '#f5f5f5',
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    }}>

      <Navbar
        user={user}
        onLogout={handleLogout}
        onProfileClick={() => setShowProfile(true)}
      />

      {showProfile && (
        <ProfilePage
          user={user}
          transactions={transactions}
          onClose={() => setShowProfile(false)}
        />
      )}

      <SummaryCards transactions={transactions} />
      <BudgetAlert transactions={transactions} budgets={budgets} />
      <AddTransaction onAdd={handleAdd} />
      <MonthlyChart transactions={transactions} />
      <SavingsGoals user={user} transactions={transactions} />
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

      <AIInsights transactions={transactions} budgets={budgets} />

    </div>
  );
}

export default App;