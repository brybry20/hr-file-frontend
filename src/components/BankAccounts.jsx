import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .ba-wrap * { box-sizing: border-box; }

  .ba-wrap {
    font-family: 'DM Sans', sans-serif;
    color: #e8e4dc;
    position: relative;
    z-index: 10;
  }

  .ba-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .ba-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 40% at 10% 20%, rgba(110,200,138,0.03) 0%, transparent 60%),
      radial-gradient(ellipse 50% 50% at 90% 80%, rgba(90,120,200,0.02) 0%, transparent 60%);
    animation: baBgPulse 8s ease-in-out infinite;
  }

  .ba-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  @keyframes baBgPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }

  .ba-orb {
    position: fixed; border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(110,200,138,0.08), transparent 70%);
    filter: blur(40px); pointer-events: none; z-index: 0;
    animation: baFloatOrb 20s ease-in-out infinite;
  }
  .ba-orb-1 { width:300px; height:300px; top:10%; right:-50px; }
  .ba-orb-2 { width:250px; height:250px; bottom:5%; left:-30px; animation-delay:5s;
    background: radial-gradient(circle at 70% 70%, rgba(200,169,110,0.08), transparent 70%); }

  @keyframes baFloatOrb {
    0%   { transform: translate(0,0) scale(1); }
    33%  { transform: translate(20px,-20px) scale(1.1); }
    66%  { transform: translate(-20px,20px) scale(0.9); }
    100% { transform: translate(0,0) scale(1); }
  }

  /* HEADER */
  .ba-header {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:28px; flex-wrap:wrap; gap:16px;
    animation:baFadeDown 0.5s ease;
  }
  @keyframes baFadeDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }

  .ba-title-group { display:flex; align-items:center; gap:16px; }

  .ba-title-icon {
    width:48px; height:48px;
    background:rgba(110,200,138,0.12); border:1px solid rgba(110,200,138,0.3);
    border-radius:12px; display:flex; align-items:center; justify-content:center;
    font-size:22px; animation:baIconPulse 3s ease-in-out infinite;
  }
  @keyframes baIconPulse {
    0%  { box-shadow:0 0 0 0 rgba(110,200,138,0.3); }
    50% { box-shadow:0 0 20px 5px rgba(110,200,138,0.5); }
    100%{ box-shadow:0 0 0 0 rgba(110,200,138,0.3); }
  }

  .ba-title { font-family:'DM Serif Display',serif; font-size:28px; color:#e8e4dc; letter-spacing:-0.5px; }

  .ba-count {
    font-size:11px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase;
    color:#6ec88a; background:rgba(110,200,138,0.1); border:1px solid rgba(110,200,138,0.2);
    padding:4px 12px; border-radius:20px;
  }

  .ba-add-btn {
    display:flex; align-items:center; gap:8px;
    padding:12px 24px; background:#6ec88a; color:#0b0d12;
    border:none; border-radius:10px;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700;
    cursor:pointer; position:relative; overflow:hidden; transition:all 0.2s;
  }
  .ba-add-btn:hover { background:#7dd49a; box-shadow:0 6px 20px rgba(110,200,138,0.4); transform:translateY(-2px); }
  .ba-add-btn:active { transform:translateY(0); }

  /* SEARCH */
  .ba-search-wrap { position:relative; margin-bottom:24px; }
  .ba-search-wrap svg {
    position:absolute; left:16px; top:50%; transform:translateY(-50%);
    width:18px; height:18px; stroke:#5a5a6a; fill:none; stroke-width:1.8;
    pointer-events:none; transition:stroke 0.2s; z-index:1;
  }
  .ba-search-wrap:focus-within svg { stroke:#6ec88a; }

  .ba-search {
    width:100%; background:#1c1f28; border:1px solid rgba(255,255,255,0.07);
    border-radius:12px; padding:14px 18px 14px 46px;
    font-family:'DM Sans',sans-serif; font-size:15px; color:#e8e4dc;
    outline:none; transition:all 0.2s; caret-color:#6ec88a;
  }
  .ba-search::placeholder { color:#5a5a6a; }
  .ba-search:focus { border-color:rgba(110,200,138,0.5); box-shadow:0 0 0 3px rgba(110,200,138,0.15); }

  .ba-search-clear {
    position:absolute; right:14px; top:50%; transform:translateY(-50%);
    background:#2a2d38; border:none; width:26px; height:26px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    color:#9a96a0; font-size:16px; cursor:pointer; transition:all 0.2s; z-index:1;
  }
  .ba-search-clear:hover { background:#3a3d4a; color:#e8e4dc; }

  .ba-result-info { font-size:13px; color:#5a5a6a; margin-bottom:16px; padding-left:4px; }
  .ba-result-info span { color:#6ec88a; font-weight:600; }

  /* TABLE */
  .ba-table-container {
    background:#161920; border:1px solid rgba(255,255,255,0.07);
    border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.2);
  }
  .ba-table { width:100%; border-collapse:collapse; min-width:600px; }
  .ba-table thead tr { background:#1c1f28; border-bottom:1px solid rgba(255,255,255,0.07); }
  .ba-table th { padding:16px 20px; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#5a5a6a; text-align:left; }
  .ba-table tbody tr { border-bottom:1px solid rgba(255,255,255,0.04); transition:all 0.2s; }
  .ba-table tbody tr:last-child { border-bottom:none; }
  .ba-table tbody tr:hover { background:rgba(110,200,138,0.05); }
  .ba-table td { padding:16px 20px; font-size:14px; color:#e8e4dc; vertical-align:middle; }

  .ba-name-cell { display:flex; align-items:center; gap:14px; }
  .ba-avatar {
    width:38px; height:38px; border-radius:10px;
    background:rgba(110,200,138,0.12); border:1px solid rgba(110,200,138,0.2);
    display:flex; align-items:center; justify-content:center;
    font-size:14px; font-weight:700; color:#6ec88a; flex-shrink:0; transition:all 0.2s;
  }
  .ba-table tbody tr:hover .ba-avatar { background:rgba(110,200,138,0.2); }
  .ba-name-text { font-weight:500; transition:color 0.2s; }
  .ba-table tbody tr:hover .ba-name-text { color:#6ec88a; }

  .ba-account-chip {
    display:inline-flex; align-items:center; gap:8px;
    padding:6px 14px; background:rgba(110,200,138,0.08);
    border:1px solid rgba(110,200,138,0.15); border-radius:8px;
    font-size:13px; font-weight:500; color:#6ec88a; font-family:monospace; letter-spacing:0.5px;
  }

  .ba-actions { display:flex; gap:6px; align-items:center; }

  .ba-btn-view, .ba-btn-edit, .ba-btn-delete {
    display:flex; align-items:center; justify-content:center; gap:5px;
    padding:8px 14px; border-radius:8px;
    font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600;
    cursor:pointer; border:1px solid; transition:all 0.2s; white-space:nowrap;
  }
  .ba-btn-view   { background:rgba(110,200,138,0.1); border-color:rgba(110,200,138,0.2); color:#6ec88a; }
  .ba-btn-view:hover   { background:rgba(110,200,138,0.2); border-color:rgba(110,200,138,0.4); transform:translateY(-2px); }
  .ba-btn-edit   { background:rgba(200,169,110,0.1); border-color:rgba(200,169,110,0.2); color:#c8a96e; }
  .ba-btn-edit:hover   { background:rgba(200,169,110,0.2); border-color:rgba(200,169,110,0.4); transform:translateY(-2px); }
  .ba-btn-delete { background:rgba(224,90,90,0.1); border-color:rgba(224,90,90,0.2); color:#e05a5a; }
  .ba-btn-delete:hover { background:rgba(224,90,90,0.2); border-color:rgba(224,90,90,0.4); transform:translateY(-2px); }
  .ba-btn-view:active,.ba-btn-edit:active,.ba-btn-delete:active { transform:translateY(0); }

  /* EMPTY */
  .ba-empty {
    padding:70px 20px; display:flex; flex-direction:column;
    align-items:center; gap:16px; text-align:center;
    background:#1c1f28; border-radius:16px; border:1px solid rgba(255,255,255,0.07);
  }
  .ba-empty-icon { font-size:48px; opacity:0.5; animation:baFloat 3s ease-in-out infinite; }
  @keyframes baFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  .ba-empty-title { font-size:18px; color:#9a96a0; }
  .ba-empty-sub   { font-size:14px; color:#5a5a6a; }

  /* ── OVERLAY ──
     position:fixed + inset:0 means it covers the entire viewport always.
     The key: DO NOT put it inside any element that has transform or overflow:hidden.
     We render all modals outside .ba-wrap using React portals pattern (adjacent in JSX). */
  .ba-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 1000;
    background: rgba(5,6,10,0.85);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: baFadeIn 0.2s ease;
  }
  @keyframes baFadeIn { from{opacity:0} to{opacity:1} }

  @keyframes baScaleIn {
    from { opacity:0; transform:scale(0.94) translateY(10px); }
    to   { opacity:1; transform:scale(1) translateY(0); }
  }

  /* VIEW CARD */
  .ba-view-card {
    background:#1a1e2a; border:1px solid rgba(255,255,255,0.08);
    border-radius:20px; width:100%; max-width:460px;
    box-shadow:0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(110,200,138,0.1);
    animation:baScaleIn 0.25s cubic-bezier(0.16,1,0.3,1); overflow:hidden;
  }
  .ba-card-top {
    padding:32px 28px 24px;
    background:linear-gradient(135deg,rgba(110,200,138,0.08) 0%,transparent 60%);
    border-bottom:1px solid rgba(255,255,255,0.06); position:relative;
  }
  .ba-card-close {
    position:absolute; top:18px; right:18px; width:32px; height:32px;
    background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08);
    border-radius:8px; display:flex; align-items:center; justify-content:center;
    color:#9a96a0; font-size:18px; cursor:pointer; transition:all 0.2s;
  }
  .ba-card-close:hover { background:rgba(255,255,255,0.1); color:#e8e4dc; transform:rotate(90deg); }

  .ba-card-avatar-lg {
    width:64px; height:64px; border-radius:16px;
    background:rgba(110,200,138,0.15); border:1px solid rgba(110,200,138,0.3);
    display:flex; align-items:center; justify-content:center;
    font-size:26px; font-weight:700; color:#6ec88a; margin-bottom:16px;
    animation:baGlow 3s ease-in-out infinite;
  }
  @keyframes baGlow {
    0%,100%{ box-shadow:0 0 10px rgba(110,200,138,0.3); }
    50%    { box-shadow:0 0 25px rgba(110,200,138,0.6); }
  }
  .ba-card-name  { font-family:'DM Serif Display',serif; font-size:24px; color:#e8e4dc; margin-bottom:8px; }
  .ba-card-label { font-size:11px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:#6ec88a; }

  .ba-card-body { padding:24px 28px; }
  .ba-card-field {
    padding:16px 0; border-bottom:1px solid rgba(255,255,255,0.05);
    display:flex; flex-direction:column; gap:6px;
  }
  .ba-card-field:last-child { border-bottom:none; }
  .ba-card-field-label { font-size:11px; font-weight:600; letter-spacing:1.2px; text-transform:uppercase; color:#5a5a6a; }
  .ba-card-field-val { font-size:16px; font-weight:500; color:#e8e4dc; }
  .ba-card-field-val.mono { font-family:monospace; font-size:18px; color:#6ec88a; letter-spacing:1px; }

  .ba-card-actions { padding:0 28px 28px; display:flex; gap:10px; }

  /* FORM MODAL */
  .ba-form-modal {
    background:#1a1e2a; border:1px solid rgba(255,255,255,0.08);
    border-radius:20px; width:100%; max-width:440px;
    box-shadow:0 40px 100px rgba(0,0,0,0.7);
    animation:baScaleIn 0.25s cubic-bezier(0.16,1,0.3,1); overflow:hidden;
  }
  .ba-form-head {
    padding:24px 28px; border-bottom:1px solid rgba(255,255,255,0.07);
    display:flex; align-items:center; justify-content:space-between;
    background:linear-gradient(135deg,rgba(110,200,138,0.05) 0%,transparent 60%);
  }
  .ba-form-title { font-family:'DM Serif Display',serif; font-size:22px; color:#e8e4dc; display:flex; align-items:center; gap:10px; }
  .ba-form-body  { padding:28px; }

  .ba-field-group { margin-bottom:22px; }
  .ba-field-label { display:block; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#5a5a6a; margin-bottom:10px; }
  .ba-field-input {
    width:100%; background:#1c1f28; border:1px solid rgba(255,255,255,0.07);
    border-radius:10px; padding:14px 16px;
    font-family:'DM Sans',sans-serif; font-size:15px; color:#e8e4dc;
    outline:none; transition:all 0.2s; caret-color:#6ec88a;
  }
  .ba-field-input::placeholder { color:#5a5a6a; }
  .ba-field-input:focus { border-color:rgba(110,200,138,0.5); box-shadow:0 0 0 3px rgba(110,200,138,0.15); }

  .ba-form-foot {
    padding:20px 28px; border-top:1px solid rgba(255,255,255,0.07);
    display:flex; gap:12px; justify-content:flex-end; background:rgba(0,0,0,0.2);
  }
  .ba-foot-save {
    padding:12px 28px; background:#6ec88a; color:#0b0d12; border:none; border-radius:10px;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700;
    cursor:pointer; transition:all 0.2s;
  }
  .ba-foot-save:hover { background:#7dd49a; box-shadow:0 6px 20px rgba(110,200,138,0.4); transform:translateY(-2px); }
  .ba-foot-save:active { transform:translateY(0); }
  .ba-foot-save:disabled { opacity:0.6; pointer-events:none; }

  .ba-foot-cancel {
    padding:12px 24px; background:transparent; border:1px solid rgba(255,255,255,0.08);
    border-radius:10px; color:#9a96a0;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; cursor:pointer; transition:all 0.2s;
  }
  .ba-foot-cancel:hover { border-color:rgba(255,255,255,0.15); color:#e8e4dc; background:rgba(255,255,255,0.04); }

  /* CONFIRM MODAL */
  .ba-confirm-modal {
    background:#1a1e2a; border:1px solid rgba(224,90,90,0.2);
    border-radius:18px; width:100%; max-width:380px; padding:32px;
    box-shadow:0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(224,90,90,0.1);
    animation:baScaleIn 0.2s cubic-bezier(0.16,1,0.3,1); text-align:center;
  }
  .ba-confirm-icon {
    width:60px; height:60px; border-radius:16px;
    background:rgba(224,90,90,0.12); border:1px solid rgba(224,90,90,0.25);
    display:flex; align-items:center; justify-content:center;
    font-size:26px; margin:0 auto 20px; animation:baShake 0.3s ease;
  }
  @keyframes baShake {
    0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)}
  }
  .ba-confirm-title { font-family:'DM Serif Display',serif; font-size:22px; color:#e8e4dc; margin-bottom:10px; }
  .ba-confirm-sub   { font-size:14px; color:#9a96a0; margin-bottom:28px; line-height:1.6; }
  .ba-confirm-btns  { display:flex; gap:12px; }
  .ba-confirm-del {
    flex:1; padding:12px; background:#e05a5a; color:white; border:none; border-radius:10px;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700; cursor:pointer; transition:all 0.2s;
  }
  .ba-confirm-del:hover { background:#ea6a6a; box-shadow:0 6px 20px rgba(224,90,90,0.4); transform:translateY(-2px); }
  .ba-confirm-del:active { transform:translateY(0); }
  .ba-confirm-no {
    flex:1; padding:12px; background:transparent; border:1px solid rgba(255,255,255,0.08);
    border-radius:10px; color:#9a96a0;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; cursor:pointer; transition:all 0.2s;
  }
  .ba-confirm-no:hover { border-color:rgba(255,255,255,0.15); color:#e8e4dc; background:rgba(255,255,255,0.04); }
`;

const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';

export default function BankAccounts({ onNotify }) {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [search, setSearch]             = useState('');
  const [showModal, setShowModal]       = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [viewAccount, setViewAccount]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving]             = useState(false);
  const [formData, setFormData]         = useState({ name: '', account_number: '' });

  const showNotification = (type, message) => {
    if (onNotify) onNotify(type, message);
  };

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  // Prevent body scroll whenever any modal is open
  useEffect(() => {
    const open = !!(viewAccount || showModal || deleteTarget);
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [viewAccount, showModal, deleteTarget]);

  const fetchBankAccounts = async () => {
    try {
      const res = await axios.get('/api/bank-accounts');
      setBankAccounts(res.data);
      showNotification('info', `Loaded ${res.data.length} bank accounts`);
    } catch {
      showNotification('error', 'Failed to load bank accounts');
    }
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
    if (!formData.name.trim())           return showNotification('error', 'Please enter a name');
    if (!formData.account_number.trim()) return showNotification('error', 'Please enter an account number');
    setSaving(true);
    try {
      if (editingAccount) {
        await axios.put(`/api/bank-accounts/${editingAccount.id}`, formData);
        showNotification('success', 'Account updated successfully');
      } else {
        await axios.post('/api/bank-accounts', formData);
        showNotification('success', 'Account added successfully');
      }
      await fetchBankAccounts();
      setShowModal(false);
    } catch {
      showNotification('error', 'Failed to save account');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/api/bank-accounts/${deleteTarget.id}`);
      await fetchBankAccounts();
      setDeleteTarget(null);
      showNotification('success', 'Account deleted successfully');
    } catch {
      showNotification('error', 'Failed to delete account');
    }
  };

  return (
    <>
      <style>{STYLES}</style>

      {/* ── MAIN CONTENT ── */}
      <div className="ba-wrap">
        <div className="ba-bg" />
        <div className="ba-orb ba-orb-1" />
        <div className="ba-orb ba-orb-2" />

        <div className="ba-header">
          <div className="ba-title-group">
            <div className="ba-title-icon">🏦</div>
            <div><div className="ba-title">Bank Accounts</div></div>
            <span className="ba-count">{bankAccounts.length} records</span>
          </div>
          <button className="ba-add-btn" onClick={openAddModal}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Account
          </button>
        </div>

        <div className="ba-search-wrap">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input
            className="ba-search" type="text"
            placeholder="Search by name or account number…"
            value={search} onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="ba-search-clear" onClick={() => setSearch('')}>×</button>}
        </div>

        {search && (
          <div className="ba-result-info">
            Showing <span>{filtered.length}</span> of {bankAccounts.length} accounts
          </div>
        )}

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
                        <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                      </svg>
                      {acc.account_number}
                    </span>
                  </td>
                  <td>
                    <div className="ba-actions">
                      <button className="ba-btn-view" onClick={() => setViewAccount(acc)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                        View
                      </button>
                      <button className="ba-btn-edit" onClick={() => openEditModal(acc)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Edit
                      </button>
                      <button className="ba-btn-delete" onClick={() => setDeleteTarget(acc)}>
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
                      <div className="ba-empty-title">{search ? `No results for "${search}"` : 'No bank accounts yet'}</div>
                      <div className="ba-empty-sub">{search ? 'Try a different keyword' : 'Click "Add Account" to get started'}</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* All modals teleported directly to document.body via portal */}
      {createPortal(
        <>
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
                  <button className="ba-btn-edit" style={{ flex:1, justifyContent:'center', padding:'10px' }} onClick={() => openEditModal(viewAccount)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                  </button>
                  <button className="ba-btn-delete" style={{ flex:1, justifyContent:'center', padding:'10px' }} onClick={() => { setViewAccount(null); setDeleteTarget(viewAccount); }}>
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
                      className="ba-field-input" type="text"
                      placeholder="e.g. Juan dela Cruz"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                      autoFocus
                    />
                  </div>
                  <div className="ba-field-group">
                    <label className="ba-field-label">Account Number</label>
                    <input
                      className="ba-field-input" type="text"
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

          {deleteTarget && (
            <div className="ba-overlay" onClick={() => setDeleteTarget(null)}>
              <div className="ba-confirm-modal" onClick={e => e.stopPropagation()}>
                <div className="ba-confirm-icon">🗑️</div>
                <div className="ba-confirm-title">Delete Account?</div>
                <div className="ba-confirm-sub">
                  You're about to delete <strong style={{ color:'#e8e4dc' }}>{deleteTarget.name}</strong>'s account.<br/>
                  This action cannot be undone.
                </div>
                <div className="ba-confirm-btns">
                  <button className="ba-confirm-no" onClick={() => setDeleteTarget(null)}>Cancel</button>
                  <button className="ba-confirm-del" onClick={confirmDelete}>Yes, Delete</button>
                </div>
              </div>
            </div>
          )}

        </>,
        document.body
      )}
    </>
  );
}