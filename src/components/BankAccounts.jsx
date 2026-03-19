import React, { useState, useEffect } from 'react';
import axios from 'axios';

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .ba-wrap * { box-sizing: border-box; }

  .ba-wrap {
    font-family: 'DM Sans', sans-serif;
    color: #e8e4dc;
  }

  /* ── PAGE HEADER ── */
  .ba-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px; flex-wrap: wrap; gap: 12px;
  }

  .ba-title-group { display: flex; align-items: center; gap: 14px; }

  .ba-title-icon {
    width: 40px; height: 40px;
    background: rgba(110,200,138,0.12);
    border: 1px solid rgba(110,200,138,0.25);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }

  .ba-title {
    font-family: 'DM Serif Display', serif;
    font-size: 24px; color: #e8e4dc;
    letter-spacing: -0.5px;
  }

  .ba-count {
    font-size: 11px; font-weight: 600;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: #6ec88a;
    background: rgba(110,200,138,0.1);
    border: 1px solid rgba(110,200,138,0.2);
    padding: 3px 10px; border-radius: 20px;
  }

  .ba-add-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 10px 20px;
    background: #6ec88a;
    color: #0b0d12;
    border: none; border-radius: 9px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 700;
    cursor: pointer; position: relative; overflow: hidden;
    transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  }
  .ba-add-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%);
    transform: translateX(-100%); transition: transform 0.4s;
  }
  .ba-add-btn:hover::before { transform: translateX(100%); }
  .ba-add-btn:hover { background: #7dd49a; box-shadow: 0 4px 16px rgba(110,200,138,0.3); }
  .ba-add-btn:active { transform: scale(0.97); }

  /* ── SEARCH BAR ── */
  .ba-search-wrap {
    position: relative; margin-bottom: 20px;
  }
  .ba-search-wrap svg {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%);
    width: 15px; height: 15px;
    stroke: #5a5a6a; fill: none; stroke-width: 1.8;
    pointer-events: none; transition: stroke 0.2s;
  }
  .ba-search-wrap:focus-within svg { stroke: #6ec88a; }

  .ba-search {
    width: 100%;
    background: #1c1f28;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    padding: 12px 16px 12px 42px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #e8e4dc;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    caret-color: #6ec88a;
  }
  .ba-search::placeholder { color: #5a5a6a; }
  .ba-search:focus {
    border-color: rgba(110,200,138,0.4);
    box-shadow: 0 0 0 3px rgba(110,200,138,0.1);
  }

  .ba-search-clear {
    position: absolute; right: 12px; top: 50%;
    transform: translateY(-50%);
    background: #2a2d38; border: none;
    width: 22px; height: 22px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #9a96a0; font-size: 14px; cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .ba-search-clear:hover { background: #3a3d4a; color: #e8e4dc; }

  /* ── TABLE ── */
  .ba-table-container {
    background: #161920;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    overflow: hidden;
  }

  .ba-table {
    width: 100%; border-collapse: collapse;
  }

  .ba-table thead tr {
    background: #1c1f28;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .ba-table th {
    padding: 13px 20px;
    font-size: 11px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: #5a5a6a; text-align: left;
  }

  .ba-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s;
    animation: baFadeUp 0.3s ease both;
  }
  .ba-table tbody tr:last-child { border-bottom: none; }
  .ba-table tbody tr:hover { background: rgba(255,255,255,0.025); }

  @keyframes baFadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ba-table td {
    padding: 14px 20px;
    font-size: 14px; color: #e8e4dc;
    vertical-align: middle;
  }

  .ba-name-cell { display: flex; align-items: center; gap: 12px; }

  .ba-avatar {
    width: 34px; height: 34px; border-radius: 8px;
    background: rgba(110,200,138,0.12);
    border: 1px solid rgba(110,200,138,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: #6ec88a;
    flex-shrink: 0;
  }

  .ba-name-text { font-weight: 500; }

  .ba-account-chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 12px;
    background: rgba(110,200,138,0.08);
    border: 1px solid rgba(110,200,138,0.15);
    border-radius: 6px;
    font-size: 13px; font-weight: 500;
    color: #6ec88a; font-family: monospace;
    letter-spacing: 0.5px;
  }

  .ba-actions { display: flex; gap: 5px; align-items: center; flex-wrap: nowrap; }

  .ba-btn-view, .ba-btn-edit, .ba-btn-delete {
    display: flex; align-items: center; justify-content: center; gap: 5px;
    padding: 7px 12px;
    border-radius: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 600;
    cursor: pointer; border: 1px solid;
    transition: all 0.2s; white-space: nowrap;
  }

  .ba-btn-view {
    background: rgba(110,200,138,0.1);
    border-color: rgba(110,200,138,0.2);
    color: #6ec88a;
  }
  .ba-btn-view:hover { background: rgba(110,200,138,0.2); border-color: rgba(110,200,138,0.4); }

  .ba-btn-edit {
    background: rgba(200,169,110,0.1);
    border-color: rgba(200,169,110,0.2);
    color: #c8a96e;
  }
  .ba-btn-edit:hover { background: rgba(200,169,110,0.2); border-color: rgba(200,169,110,0.4); }

  .ba-btn-delete {
    background: rgba(224,90,90,0.1);
    border-color: rgba(224,90,90,0.2);
    color: #e05a5a;
  }
  .ba-btn-delete:hover { background: rgba(224,90,90,0.2); border-color: rgba(224,90,90,0.4); }

  /* table scroll */
  .ba-table-container { overflow-x: auto; }
  .ba-table { min-width: 560px; }
  .ba-table th:last-child,
  .ba-table td:last-child { width: 160px; }

  /* ── EMPTY STATE ── */
  .ba-empty {
    padding: 60px 20px;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    text-align: center;
  }
  .ba-empty-icon { font-size: 38px; opacity: 0.35; }
  .ba-empty-title { font-size: 16px; color: #9a96a0; }
  .ba-empty-sub   { font-size: 13px; color: #5a5a6a; }

  /* ── OVERLAY ── */
  .ba-overlay {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(5,6,10,0.78);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: baFadeIn 0.2s ease;
  }
  @keyframes baFadeIn { from { opacity: 0; } to { opacity: 1; } }

  /* ── VIEW CARD MODAL ── */
  .ba-view-card {
    background: #161920;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    width: 100%; max-width: 440px;
    box-shadow: 0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03);
    animation: baScaleIn 0.25s cubic-bezier(0.16,1,0.3,1);
    overflow: hidden;
  }
  @keyframes baScaleIn {
    from { opacity: 0; transform: scale(0.94) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .ba-card-top {
    padding: 28px 28px 24px;
    background: linear-gradient(135deg, rgba(110,200,138,0.08) 0%, transparent 60%);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    position: relative;
  }

  .ba-card-close {
    position: absolute; top: 18px; right: 18px;
    width: 30px; height: 30px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 7px; display: flex; align-items: center; justify-content: center;
    color: #9a96a0; font-size: 16px; cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .ba-card-close:hover { background: rgba(255,255,255,0.1); color: #e8e4dc; }

  .ba-card-avatar-lg {
    width: 56px; height: 56px; border-radius: 14px;
    background: rgba(110,200,138,0.15);
    border: 1px solid rgba(110,200,138,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; font-weight: 700; color: #6ec88a;
    margin-bottom: 14px;
  }

  .ba-card-name {
    font-family: 'DM Serif Display', serif;
    font-size: 22px; color: #e8e4dc;
    margin-bottom: 6px;
  }

  .ba-card-label {
    font-size: 11px; font-weight: 600;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: #6ec88a;
  }

  .ba-card-body { padding: 20px 28px 24px; }

  .ba-card-field {
    padding: 13px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex; flex-direction: column; gap: 5px;
  }
  .ba-card-field:last-child { border-bottom: none; }

  .ba-card-field-label {
    font-size: 11px; font-weight: 600;
    letter-spacing: 1.2px; text-transform: uppercase;
    color: #5a5a6a;
  }
  .ba-card-field-val {
    font-size: 15px; font-weight: 500; color: #e8e4dc;
  }
  .ba-card-field-val.mono {
    font-family: monospace; font-size: 16px;
    color: #6ec88a; letter-spacing: 1px;
  }

  .ba-card-actions {
    padding: 0 28px 24px;
    display: flex; gap: 8px;
  }

  /* ── FORM MODAL ── */
  .ba-form-modal {
    background: #161920;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    width: 100%; max-width: 420px;
    box-shadow: 0 40px 100px rgba(0,0,0,0.7);
    animation: baScaleIn 0.25s cubic-bezier(0.16,1,0.3,1);
    overflow: hidden;
  }

  .ba-form-head {
    padding: 22px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: space-between;
  }
  .ba-form-title {
    font-family: 'DM Serif Display', serif;
    font-size: 20px; color: #e8e4dc;
    display: flex; align-items: center; gap: 8px;
  }

  .ba-form-body { padding: 22px 24px; }

  .ba-field-group { margin-bottom: 18px; }
  .ba-field-label {
    display: block;
    font-size: 11px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: #5a5a6a; margin-bottom: 8px;
  }
  .ba-field-input {
    width: 100%;
    background: #1c1f28;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 9px;
    padding: 12px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #e8e4dc;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    caret-color: #6ec88a;
  }
  .ba-field-input::placeholder { color: #5a5a6a; }
  .ba-field-input:focus {
    border-color: rgba(110,200,138,0.4);
    box-shadow: 0 0 0 3px rgba(110,200,138,0.1);
  }

  .ba-form-foot {
    padding: 16px 24px;
    border-top: 1px solid rgba(255,255,255,0.07);
    display: flex; gap: 8px; justify-content: flex-end;
  }

  .ba-foot-save {
    padding: 10px 22px;
    background: #6ec88a; color: #0b0d12;
    border: none; border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 700;
    cursor: pointer; transition: background 0.2s, box-shadow 0.2s;
  }
  .ba-foot-save:hover { background: #7dd49a; box-shadow: 0 4px 12px rgba(110,200,138,0.25); }

  .ba-foot-cancel {
    padding: 10px 18px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px; color: #9a96a0;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
  }
  .ba-foot-cancel:hover { border-color: rgba(255,255,255,0.15); color: #e8e4dc; background: rgba(255,255,255,0.04); }

  /* ── CONFIRM MODAL ── */
  .ba-confirm-modal {
    background: #161920;
    border: 1px solid rgba(224,90,90,0.2);
    border-radius: 16px;
    width: 100%; max-width: 360px;
    padding: 28px;
    box-shadow: 0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(224,90,90,0.1);
    animation: baScaleIn 0.2s cubic-bezier(0.16,1,0.3,1);
    text-align: center;
  }
  .ba-confirm-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(224,90,90,0.12);
    border: 1px solid rgba(224,90,90,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; margin: 0 auto 16px;
  }
  .ba-confirm-title { font-family: 'DM Serif Display', serif; font-size: 20px; color: #e8e4dc; margin-bottom: 8px; }
  .ba-confirm-sub   { font-size: 13px; color: #9a96a0; margin-bottom: 24px; line-height: 1.6; }
  .ba-confirm-btns  { display: flex; gap: 8px; }
  .ba-confirm-del {
    flex: 1; padding: 11px;
    background: #e05a5a; color: white;
    border: none; border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 700; cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
  }
  .ba-confirm-del:hover { background: #ea6a6a; box-shadow: 0 4px 12px rgba(224,90,90,0.3); }
  .ba-confirm-no {
    flex: 1; padding: 11px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px; color: #9a96a0;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500; cursor: pointer;
    transition: all 0.2s;
  }
  .ba-confirm-no:hover { border-color: rgba(255,255,255,0.15); color: #e8e4dc; }

  /* result count */
  .ba-result-info {
    font-size: 12px; color: #5a5a6a;
    margin-bottom: 12px; padding-left: 2px;
  }
  .ba-result-info span { color: #6ec88a; font-weight: 600; }
`;

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
export default function BankAccounts() {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [search, setSearch]             = useState('');
  const [showModal, setShowModal]       = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [viewAccount, setViewAccount]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving]             = useState(false);

  const [formData, setFormData] = useState({ name: '', account_number: '' });

  useEffect(() => { fetchBankAccounts(); }, []);

  const fetchBankAccounts = async () => {
    try {
      const res = await axios.get('/api/bank-accounts');
      setBankAccounts(res.data);
    } catch (err) { console.error(err); }
  };

  const filtered = bankAccounts.filter(a =>
    `${a.name} ${a.account_number}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingAccount(null);
    setFormData({ name: '', account_number: '' });
    setShowModal(true);
  };

  const openEditModal = (acc) => {
    setEditingAccount(acc);
    setFormData({ name: acc.name, account_number: acc.account_number });
    setViewAccount(null);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.account_number.trim()) return;
    setSaving(true);
    try {
      if (editingAccount) {
        await axios.put(`/api/bank-accounts/${editingAccount.id}`, formData);
      } else {
        await axios.post('/api/bank-accounts', formData);
      }
      await fetchBankAccounts();
      setShowModal(false);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/api/bank-accounts/${deleteTarget.id}`);
      await fetchBankAccounts();
      setDeleteTarget(null);
    } catch (err) { console.error(err); }
  };

  return (
    <>
      <style>{STYLES}</style>

      <div className="ba-wrap">

        {/* HEADER */}
        <div className="ba-header">
          <div className="ba-title-group">
            <div className="ba-title-icon">🏦</div>
            <div>
              <div className="ba-title">Bank Accounts</div>
            </div>
            <span className="ba-count">{bankAccounts.length} records</span>
          </div>
          <button className="ba-add-btn" onClick={openAddModal}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Account
          </button>
        </div>

        {/* SEARCH */}
        <div className="ba-search-wrap">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input
            className="ba-search"
            type="text"
            placeholder="Search by name or account number…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="ba-search-clear" onClick={() => setSearch('')}>×</button>
          )}
        </div>

        {/* RESULT COUNT */}
        {search && (
          <div className="ba-result-info">
            Showing <span>{filtered.length}</span> of {bankAccounts.length} accounts
          </div>
        )}

        {/* TABLE */}
        <div className="ba-table-container">
          <table className="ba-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Account Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((acc, i) => (
                <tr key={acc.id} style={{ animationDelay: `${i * 40}ms` }}>
                  <td>
                    <div className="ba-name-cell">
                      <div className="ba-avatar">{getInitials(acc.name)}</div>
                      <span className="ba-name-text">{acc.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="ba-account-chip">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="5" width="20" height="14" rx="2"/>
                        <line x1="2" y1="10" x2="22" y2="10"/>
                      </svg>
                      {acc.account_number}
                    </span>
                  </td>
                  <td>
                    <div className="ba-actions">
                      <button className="ba-btn-view" title="View" onClick={() => setViewAccount(acc)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        View
                      </button>
                      <button className="ba-btn-edit" title="Edit" onClick={() => openEditModal(acc)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Edit
                      </button>
                      <button className="ba-btn-delete" title="Delete" onClick={() => setDeleteTarget(acc)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} style={{ padding: 0 }}>
                    <div className="ba-empty">
                      <div className="ba-empty-icon">🏦</div>
                      <div className="ba-empty-title">
                        {search ? `No results for "${search}"` : 'No bank accounts yet'}
                      </div>
                      <div className="ba-empty-sub">
                        {search ? 'Try a different keyword' : 'Click "Add Account" to get started'}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── VIEW CARD MODAL ── */}
      {viewAccount && (
        <div className="ba-overlay" onClick={() => setViewAccount(null)}>
          <div className="ba-view-card" onClick={e => e.stopPropagation()}>
            <div className="ba-card-top">
              <button className="ba-card-close" onClick={() => setViewAccount(null)}>×</button>
              <div className="ba-card-avatar-lg">{getInitials(viewAccount.name)}</div>
              <div className="ba-card-name">{viewAccount.name}</div>
              <div className="ba-card-label">🏦 Bank Account</div>
            </div>

            <div className="ba-card-body">
              <div className="ba-card-field">
                <div className="ba-card-field-label">Full Name</div>
                <div className="ba-card-field-val">{viewAccount.name}</div>
              </div>
              <div className="ba-card-field">
                <div className="ba-card-field-label">Account Number</div>
                <div className="ba-card-field-val mono">{viewAccount.account_number}</div>
              </div>
              {viewAccount.bank_name && (
                <div className="ba-card-field">
                  <div className="ba-card-field-label">Bank</div>
                  <div className="ba-card-field-val">{viewAccount.bank_name}</div>
                </div>
              )}
            </div>

            <div className="ba-card-actions">
              <button
                className="ba-btn-edit"
                style={{ flex: 1, justifyContent: 'center', padding: '10px' }}
                onClick={() => openEditModal(viewAccount)}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit
              </button>
              <button
                className="ba-btn-delete"
                style={{ flex: 1, justifyContent: 'center', padding: '10px' }}
                onClick={() => { setViewAccount(null); setDeleteTarget(viewAccount); }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD / EDIT FORM MODAL ── */}
      {showModal && (
        <div className="ba-overlay" onClick={() => setShowModal(false)}>
          <div className="ba-form-modal" onClick={e => e.stopPropagation()}>
            <div className="ba-form-head">
              <div className="ba-form-title">
                {editingAccount ? '✏️' : '🏦'}
                {editingAccount ? 'Edit Account' : 'New Account'}
              </div>
              <button className="ba-card-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="ba-form-body">
              <div className="ba-field-group">
                <label className="ba-field-label">Full Name</label>
                <input
                  className="ba-field-input"
                  type="text"
                  placeholder="e.g. Juan dela Cruz"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              <div className="ba-field-group">
                <label className="ba-field-label">Account Number</label>
                <input
                  className="ba-field-input"
                  type="text"
                  placeholder="e.g. 1234-5678-9012"
                  value={formData.account_number}
                  onChange={e => setFormData({ ...formData, account_number: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
              </div>
            </div>

            <div className="ba-form-foot">
              <button className="ba-foot-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="ba-foot-save" onClick={handleSubmit} disabled={saving}>
                {saving ? 'Saving…' : editingAccount ? 'Save Changes' : 'Add Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteTarget && (
        <div className="ba-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="ba-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="ba-confirm-icon">🗑️</div>
            <div className="ba-confirm-title">Delete Account?</div>
            <div className="ba-confirm-sub">
              You're about to delete <strong style={{ color: '#e8e4dc' }}>{deleteTarget.name}</strong>'s account.<br/>
              This action cannot be undone.
            </div>
            <div className="ba-confirm-btns">
              <button className="ba-confirm-no" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="ba-confirm-del" onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}