// src/components/AddExpense.jsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function AddExpense({ groups = [], categories = [], onAdd }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const defaultCat = (categories.find(c => c.active) || {}).name || 'Misc';
  const [category, setCategory] = useState(defaultCat);
  const [customCategory, setCustomCategory] = useState('');
  const [type, setType] = useState('personal');
  const [groupId, setGroupId] = useState('');
  const [customSplit, setCustomSplit] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || !description) { alert('Enter amount and description'); return; }

    let split = {};
    if (type === 'personal') {
      split['Me'] = amt;
    } else {
      const group = groups.find(g => g.id === groupId);
      if (!group) { alert('Select a group'); return; }
      // equal split if no custom amounts
      const members = group.members;
      const sumCustom = Object.values(customSplit).reduce((s, v) => s + (parseFloat(v) || 0), 0);
      if (sumCustom > 0) {
        // use custom split but ensure it equals total
        if (Math.abs(sumCustom - amt) > 0.005) {
          alert('Custom split does not add up to total');
          return;
        }
        members.forEach(m => {
          split[m] = parseFloat(customSplit[m]) || 0;
        });
      } else {
        const per = Math.round((amt / members.length) * 100) / 100;
        members.forEach(m => split[m] = per);
        // adjust tiny rounding error to first member
        const total = Object.values(split).reduce((s,v)=>s+v,0);
        const diff = Math.round((amt - total) * 100) / 100;
        if (Math.abs(diff) > 0) split[members[0]] += diff;
      }
    }

    const finalCategory = category === '__other' ? (customCategory || 'Misc') : (category || 'Misc');

    const expense = {
      id: 'R_' + uuidv4(),
      date,
      amount: amt,
      description,
      category: finalCategory,
      type,
      paidBy: '',
      groupId: type === 'group' ? groupId : undefined,
      split
    };
    onAdd(expense);
    // reset
    setAmount(''); setDescription(''); setCustomSplit({}); setCategory(defaultCat); setCustomCategory('');
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
              {/* <option value="__other">Other</option> */}
            </select>
            {/* {category === '__other' && (
              <input placeholder="Custom category" value={customCategory} onChange={e=>setCustomCategory(e.target.value)} />
            )} */}
            
        </label>
        <label>
          Type
          <select value={type} onChange={e=>setType(e.target.value)}>
            <option value="personal">Personal</option>
            <option value="group">Group</option>
          </select>
        </label>

        {type === 'group' && (
          <>
            <label>
              Select Group
              <select value={groupId} onChange={e=>setGroupId(e.target.value)}>
                <option value="">-- select --</option>
                {groups.map(g=> <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </label>

            <div style={{ gridColumn: '1 / -1' }}>
              <h4>Custom Split (optional)</h4>
              {groups.find(g=>g.id===groupId)?.members?.map(m => (
                <div key={m}>
                  <label>{m} owes:
                    <input
                      type="number"
                      step="0.01"
                      value={customSplit[m] || ''}
                      onChange={e => setCustomSplit(prev => ({ ...prev, [m]: e.target.value }))}
                    />
                  </label>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop: 8 }}>
        <button type="submit">Add</button>
      </div>
    </form>
  );
}
