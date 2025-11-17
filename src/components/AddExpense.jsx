// src/components/AddExpense.jsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';


export default function AddExpense({ groups = [], categories = [], onAdd }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const defaultCat = (categories.find(c => c.active) || {}).name || 'Misc';
  const [category, setCategory] = useState(defaultCat);
  const [setCustomCategory] = useState('');
  const [groupId, setGroupId] = useState('');
  const [paidBy, setPaidBy] = useState('common');

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || !description) { alert('Enter amount and description'); return; }

    const group = groups.find(g => g.id === groupId);
    if (!group) { alert('Select a group'); return; }
    
    // Equal split among group members
    let split = {};
    const members = group.members;
    const per = Math.round((amt / members.length) * 100) / 100;
    members.forEach(m => split[m] = per);
    
    // Adjust rounding error to first member
    const total = Object.values(split).reduce((s,v)=>s+v,0);
    const diff = Math.round((amt - total) * 100) / 100;
    if (Math.abs(diff) > 0) split[members[0]] += diff;

    const finalCategory = category || 'Misc';

    const expense = {
      id: 'R_' + uuidv4(),
      date,
      amount: amt,
      description,
      category: finalCategory,
      type: 'group',
      paidBy,
      groupId,
      split
    };
    onAdd(expense);
    // reset
    setAmount(''); setDescription(''); setCategory(defaultCat); setPaidBy('common'); setGroupId('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12 }}>
      <h3>Add Expense</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <label>
          Date
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        </label>
        <label>
          Amount
          <input type="number" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} />
        </label>
        <label style={{ gridColumn: 'span 2' }}>
          Description
          <input value={description} onChange={e=>setDescription(e.target.value)} />
        </label>
        <label>
          Category
          
            <select value={category} onChange={e=>setCategory(e.target.value)}>
              <option value="">-- select --</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
        </label>
        <label>
          Select Group
          <select value={groupId} onChange={e=>setGroupId(e.target.value)}>
            <option value="">-- select --</option>
            {groups.map(g=> <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </label>
        <label>
          Paid By
          <select value={paidBy} onChange={e=>setPaidBy(e.target.value)}>
            <option value="common">Common</option>
            {groups.find(g=>g.id===groupId)?.members?.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginTop: 8 }}>
        <button type="submit">Add</button>
      </div>
    </form>
  );
}
