// src/components/ExpenseList.jsx
import React from 'react';

export default function ExpenseList({ expenses = [] }) {
  return (
    <div style={{ marginTop: 12 }}>
      <style>
        {`
          @media (max-width: 768px) {
            .transaction-table { display: none; }
            .transaction-card { display: block; }
          }

          @media (min-width: 769px) {
            .transaction-card { display: none; }
          }

          .transaction-card {
            margin-bottom: 12px;
            padding: 12px;
            border-radius: 8px;
            background: #f9f9f9;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }

          .row {
            margin: 4px 0;
            font-size: 14px;
          }

          .label {
            font-weight: bold;
            color: #444;
          }
        `}
      </style>
      <h3>Transactions</h3>
      <table className="transaction-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Paid By</th>
            <th>Split</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp.id} style={{ borderTop: '1px solid #ddd' }}>
              <td>{exp.date}</td>
              <td>{exp.description}</td>
              <td>{exp.category}</td>
              <td>{exp.amount.toFixed(2)}</td>
              <td>{exp.paidBy || 'Common'}</td>
              <td>
                <div style={{ fontSize: '0.85em' }}>
                  {Object.entries(exp.split || {}).map(([k, v]) => (
                    <div key={k}>{k}: ${v.toFixed(2)}</div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card View */}
      <div>
        {expenses.map(exp => (
          <div className="transaction-card" key={exp.id}>
            <div className="row">
              <span className="label">Date: </span>{exp.date}
            </div>

            <div className="row">
              <span className="label">Description: </span>{exp.description}
            </div>

            <div className="row">
              <span className="label">Category: </span>{exp.category}
            </div>

            <div className="row">
              <span className="label">Amount: </span>${exp.amount.toFixed(2)}
            </div>

            <div className="row">
              <span className="label">Paid By: </span>{exp.paidBy || 'Common'}
            </div>

            <div className="row">
              <span className="label">Split:</span>
              <div style={{ marginLeft: 10 }}>
                {Object.entries(exp.split || {}).map(([k, v]) => (
                  <div key={k}>{k}: ${v.toFixed(2)}</div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
