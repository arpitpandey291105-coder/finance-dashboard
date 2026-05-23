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

const DEFAULT_BUDGETS = {
  Food: 5000,
  Rent: 15000,
  Transport: 3000,
  Utilities: 4000,
  Shopping: 5000,
};

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('budgets');
    return saved ? JSON.parse(saved) : DEFAULT_BUDGETS;
  });

  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const handleAdd = (transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleSaveBudgets = (newBudgets) => {
    setBudgets(newBudgets);
  };

  const handleImport = (importedTransactions) => {
    setTransactions(prev => [...prev, ...importedTransactions]);
  };

  const filteredTransactions = selectedCategory === 'All'
    ? transactions
    : transactions.filter(t => t.category === selectedCategory);

  return (
    <div style={{ backgroundColor: '#0f0f13', minHeight: '100vh' }}>
      <Navbar />
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