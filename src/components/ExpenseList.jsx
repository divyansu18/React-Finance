// src/components/ExpenseList.jsx
import React from 'react';

export default function ExpenseList({ expenses = [] }) {
  return (
    <div style={{ marginTop: 12 }}>
      <h3>Transactions</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th>Split</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp.id}>
              <td>{exp.date}</td>
              <td>{exp.description}</td>
              <td>{exp.category}</td>
              <td>{exp.amount.toFixed(2)}</td>
              <td>
                {exp.type === 'group' ? (
                  <div>
                    {Object.entries(exp.split || {}).map(([k,v]) => <div key={k}>{k}: {v}</div>)}
                  </div>
                ) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
