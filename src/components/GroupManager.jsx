// src/components/GroupManager.jsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function GroupManager({ groups = [], categories = [], activeView = 'groups', onChangeView, onAddGroup, onRemoveGroup, onReplaceGroups, onAddCategory, onRemoveCategory }) {
  const [name, setName] = useState('');
  const [membersText, setMembersText] = useState('');
  const [catName, setCatName] = useState('');

  const createGroup = (e) => {
    e.preventDefault();
    const members = membersText.split(',').map(s => s.trim()).filter(Boolean);
    if (!name || members.length === 0) { alert('Enter group name and members'); return; }
    const group = { id: 'g_' + uuidv4(), name, members };
    onAddGroup(group);
    setName(''); setMembersText('');
  };

  const handleRemove = (id) => {
    if (typeof onRemoveGroup === 'function') {
      onRemoveGroup(id);
      return;
    }

    // fallback: if onReplaceGroups provided, call with filtered list
    if (typeof onReplaceGroups === 'function') {
      onReplaceGroups(groups.filter(g => g.id !== id));
    }
  };

  const createCategory = (e) => {
    e.preventDefault();
    const name = (catName || '').trim();
    if (!name) { alert('Enter category name'); return; }
    const category = { id: 'cat_' + uuidv4(), name, active: true };
    if (typeof onAddCategory === 'function') {
      onAddCategory(category);
    }
    setCatName('');
  };

  const handleRemoveCategory = (id) => {
    if (typeof onRemoveCategory === 'function') return onRemoveCategory(id);
  };

  return (
    <div style={{ border: '1px solid #eee', padding: 12, marginBottom: 12 }} >
         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3>{activeView === 'groups' ? 'Groups' : 'Categories'}</h3>
        <div>
          <button onClick={() => onChangeView && onChangeView('groups')} style={{ marginRight: 8, background: activeView === 'groups' ? '#007bff' : '#eee', color: activeView === 'groups' ? '#fff' : '#000', border: 'none', padding: '6px 10px', borderRadius: 4, cursor: 'pointer' }}>Groups</button>
          <button onClick={() => onChangeView && onChangeView('categories')} style={{ background: activeView === 'categories' ? '#007bff' : '#eee', color: activeView === 'categories' ? '#fff' : '#000', border: 'none', padding: '6px 10px', borderRadius: 4, cursor: 'pointer' }}>Categories</button>
        </div>
      </div>
      {activeView === 'groups' ? (
      <>
     
      <form onSubmit={createGroup}>
        <div>
          <input placeholder="Group name" value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div>
          <input placeholder="Members (comma separated)" value={membersText} onChange={e=>setMembersText(e.target.value)} />
        </div>
        <button type="submit">Create Group</button>
      </form>

      
        <div style={{ marginTop: 8 }}>
          <strong>Existing groups:</strong>
          <ul>
            {groups.map(g => (
              <li key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0px' }}>
                <span style={{ flex: 1 }}>{g.name} ({g.members.join(', ')})</span>
                <button onClick={() => handleRemove(g.id)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer' }}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
        </>
      ) : (
         <div style={{ marginTop: 16 }}>
        <form onSubmit={createCategory}>
            <div>
          <input placeholder="Category name" value={catName} onChange={e=>setCatName(e.target.value)} />
          </div>
          <button type="submit">Add Category</button>
        </form>

        <div style={{ marginTop: 8 }}>
          <strong>Existing categories:</strong>
          <ul>
            {categories.map(c => (
              <li key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                <span style={{ flex: 1 }}>{c.name}</span>
                <button onClick={() => handleRemoveCategory(c.id)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer' }}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      )}

     
    </div>
  );
}
