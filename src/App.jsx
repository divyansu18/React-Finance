import React, { useState } from "react";
import AddExpense from "./components/AddExpense";
import ExpenseList from "./components/ExpenseList";
import GroupManager from "./components/GroupManager";
import MonthlySummary from "./components/MonthlySummary";

// Local storage helpers
const STORAGE_KEY = 'finance_app_v1';
function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse localStorage data', e);
    return null;
  }
}

function saveLocal(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Failed to save data', e);
    return false;
  }
}

export default function App() {
  const [data, setData] = useState(() => {
    const stored = localStorage.getItem('finance_app_v1');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored data', e);
      }
    }
    return { expenses: [], groups: [], categories: [], ui: { groupManagerView: 'groups' } };
  });

  const handleAddExpense = (exp) => {
    const next = { ...data, expenses: [exp, ...(data.expenses || [])] };
    setData(next);
    saveLocal(next);
  };

  const handleAddGroup = (group) => {
    const next = { ...data, groups: [group, ...(data.groups || [])] };
    setData(next);
    saveLocal(next);
  };

  const handleRemoveGroup = (groupId) => {
    const next = { ...data, groups: (data.groups || []).filter(g => g.id !== groupId) };
    setData(next);
    saveLocal(next);
  };

  const handleAddCategory = (category) => {
    const next = { ...data, categories: [category, ...(data.categories || [])] };
    setData(next);
    saveLocal(next);
  };

  const handleToggleCategory = (catId) => {
    const next = { ...data, categories: (data.categories || []).map(c => c.id === catId ? { ...c, active: !c.active } : c) };
    setData(next);
    saveLocal(next);
  };

  const handleRemoveCategory = (catId) => {
    const next = { ...data, categories: (data.categories || []).filter(c => c.id !== catId) };
    setData(next);
    saveLocal(next);
  };

  const setGroupManagerView = (view) => {
    const next = { ...data, ui: { ...(data.ui || {}), groupManagerView: view } };
    setData(next);
    saveLocal(next);
  };
  return (
    <div className="container">
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h2>Personal Finance Tracker</h2>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-title">Add Expense</div>
          <AddExpense groups={data.groups} categories={data.categories} onAdd={handleAddExpense} />
        </div>

        <div className="card">
          <div className="section-title">Groups | Categories</div>
          <GroupManager
            groups={data.groups}
            categories={data.categories}
            activeView={(data.ui && data.ui.groupManagerView) || 'groups'}
            onChangeView={setGroupManagerView}
            onAddGroup={handleAddGroup}
            onRemoveGroup={handleRemoveGroup}
            onAddCategory={handleAddCategory}
            onRemoveCategory={handleRemoveCategory}
          />
        </div>
      </div>

      <div className="card">
        <div className="section-title">Monthly Summary</div>
        <MonthlySummary expenses={data.expenses} groups={data.groups} />
      </div>

      <div className="card">
        <div className="section-title">All Expenses</div>
        <ExpenseList expenses={data.expenses} />
      </div>
    </div>
  );
}
