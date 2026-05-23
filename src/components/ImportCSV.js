import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';

function ImportCSV({ onImport }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.trim().split('\n');

      const rows = lines.slice(1);

      const transactions = rows
        .filter(line => line.trim() !== '')
        .map((line, index) => {
          const parts = line.split(',');
          const date     = parts[0]?.trim() || '';
          const type     = parts[1]?.trim() || '';
          const category = parts[2]?.trim() || '';
          const note     = parts[3]?.trim() || '';
          const amount   = parseFloat(parts[4]?.trim()) || 0;

         
          const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);

          return {
            id: `imported-${Date.now()}-${index}`,
            date: isValidDate ? date : new Date().toISOString().split('T')[0],
            type: ['income', 'expense'].includes(type.toLowerCase())
              ? type.toLowerCase()
              : 'expense',
            category: category || 'Other',
            note: note || '',
            amount: amount,
          };
        });

      onImport(transactions);
      e.target.value = ''; 
    };

    reader.readAsText(file);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => fileInputRef.current.click()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          borderRadius: '10px',
          border: '1px solid rgba(99,102,241,0.3)',
          background: 'rgba(99,102,241,0.1)',
          color: '#818cf8',
          fontSize: '0.85rem',
          fontWeight: '500',
          cursor: 'pointer',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
        }}
      >
        <Upload size={15} />
        Import CSV
      </motion.button>
    </>
  );
}

export default ImportCSV;