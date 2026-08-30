import React from 'react';
import { createRoot } from 'react-dom/client';
import { formatCurrency } from '@react-rewind/shared-utils';

function App() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white">App Active 🚀</h1>
      <p className="mt-2 text-slate-400">Shared Utility Check: {formatCurrency(100)}</p>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);

