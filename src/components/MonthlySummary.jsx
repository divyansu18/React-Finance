// src/components/MonthlySummary.jsx
import React, { useMemo, useState } from 'react';

export default function MonthlySummary({ expenses = [] }) {
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0,7)); // YYYY-MM

  const filtered = useMemo(() => {
    return expenses.filter(e => e.date?.slice(0,7) === month);
  }, [expenses, month]);

  const totalsByCategory = useMemo(() => {
    const m = {};
    filtered.forEach(e => {
      m[e.category] = (m[e.category] || 0) + (e.amount || 0);
    });
    return m;
  }, [filtered]);

  // compute per-user net balance for group expenses
  const balances = useMemo(() => {
    const bal = {};
    filtered.forEach(e => {
      if (e.type !== 'group') return;
      const payer = e.paidBy || 'Me';
      const split = e.split || {};
      Object.entries(split).forEach(([user, owe]) => {
        // user owes "owe"; payer gets owed from others
        bal[user] = (bal[user] || 0) - owe; // user owes -> negative
        bal[payer] = (bal[payer] || 0) + owe; // payer is owed
      });
      // payer should not be owing to self (if included in split), net will reflect that
    });
    return bal;
  }, [filtered]);

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, marginTop: 12 }}>
      <h3>Monthly Summary</h3>
      <label>
        Month
        <input type="month" value={month} onChange={e=>setMonth(e.target.value)} />
      </label>

      <div>
        <h4>Totals by category</h4>
        <ul>
          {Object.entries(totalsByCategory).map(([cat, val]) => <li key={cat}>{cat}: {val.toFixed(2)}</li>)}
        </ul>
      </div>

      <div>
        <h4>Group Balances (net)</h4>
        <ul>
          {Object.entries(balances).map(([u, v]) => <li key={u}>{u}: {v.toFixed(2)}</li>)}
        </ul>
      </div>
    </div>
  );
}
