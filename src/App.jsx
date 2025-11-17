import React, { useState } from "react";
import AddExpense from "./components/AddExpense";
import ExpenseList from "./components/ExpenseList";
import GroupManager from "./components/GroupManager";
import MonthlySummary from "./components/MonthlySummary";
export default function App() {
  // Load from localStorage on first render, never seed from data.json
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
    setData((prev) => ({ ...prev, expenses: [exp, ...prev.expenses] }));
  };

  const handleAddGroup = (group) => {
    setData((prev) => ({ ...prev, groups: [group, ...prev.groups] }));
  };

  const handleRemoveGroup = (groupId) => {
    setData((prev) => ({ ...prev, groups: prev.groups.filter(g => g.id !== groupId) }));
  };

  const handleAddCategory = (category) => {
    setData(prev => ({ ...prev, categories: [category, ...prev.categories] }));
  };

  const handleRemoveCategory = (catId) => {
    setData(prev => ({ ...prev, categories: prev.categories.filter(c => c.id !== catId) }));
  };

  const setGroupManagerView = (view) => {
    setData(prev => ({ ...prev, ui: { ...(prev.ui || {}), groupManagerView: view } }));
  };
  return (
    <div className="container">
      {/* TOP BAR */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2>Personal Finance Tracker</h2>
      </div>

      {/* TOP GRID */}
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

      {/* Monthly Summary */}
      <div className="card">
        <div className="section-title">Monthly Summary</div>
        <MonthlySummary expenses={data.expenses} groups={data.groups} />
      </div>

      {/* Expense List */}
      <div className="card">
        <div className="section-title">All Expenses</div>
        <ExpenseList expenses={data.expenses} />
      </div>
    </div>
  );
}
