import React, { useState, useEffect } from 'react';
import axios from 'axios';

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .bd-wrap * { box-sizing: border-box; }
  .bd-wrap { font-family: 'DM Sans', sans-serif; color: #e8e4dc; }

  /* ── HEADER ── */
  .bd-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px; flex-wrap: wrap; gap: 12px;
  }
  .bd-title-group { display: flex; align-items: center; gap: 14px; }
  .bd-title-icon {
    width: 40px; height: 40px;
    background: rgba(200,110,169,0.12);
    border: 1px solid rgba(200,110,169,0.25);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .bd-title {
    font-family: 'DM Serif Display', serif;
    font-size: 24px; color: #e8e4dc; letter-spacing: -0.5px;
  }
  .bd-count {
    font-size: 11px; font-weight: 600;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: #c86ea9;
    background: rgba(200,110,169,0.1);
    border: 1px solid rgba(200,110,169,0.2);
    padding: 3px 10px; border-radius: 20px;
  }
  .bd-add-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 10px 20px;
    background: #c86ea9; color: #0b0d12;
    border: none; border-radius: 9px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 700;
    cursor: pointer; position: relative; overflow: hidden;
    transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  }
  .bd-add-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%);
    transform: translateX(-100%); transition: transform 0.4s;
  }
  .bd-add-btn:hover::before { transform: translateX(100%); }
  .bd-add-btn:hover { background: #d47eba; box-shadow: 0 4px 16px rgba(200,110,169,0.35); }
  .bd-add-btn:active { transform: scale(0.97); }

  /* ── SEARCH ── */
  .bd-search-wrap { position: relative; margin-bottom: 10px; }
  .bd-search-wrap svg {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    width: 15px; height: 15px;
    stroke: #5a5a6a; fill: none; stroke-width: 1.8; pointer-events: none;
    transition: stroke 0.2s;
  }
  .bd-search-wrap:focus-within svg { stroke: #c86ea9; }
  .bd-search {
    width: 100%;
    background: #1c1f28; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px; padding: 12px 44px 12px 42px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: #e8e4dc;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    caret-color: #c86ea9;
  }
  .bd-search::placeholder { color: #5a5a6a; }
  .bd-search:focus { border-color: rgba(200,110,169,0.4); box-shadow: 0 0 0 3px rgba(200,110,169,0.1); }
  .bd-search-clear {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: #2a2d38; border: none; width: 22px; height: 22px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #9a96a0; font-size: 14px; cursor: pointer; transition: background 0.2s, color 0.2s;
  }
  .bd-search-clear:hover { background: #3a3d4a; color: #e8e4dc; }
  .bd-result-info { font-size: 12px; color: #5a5a6a; margin-bottom: 14px; padding-left: 2px; }
  .bd-result-info span { color: #c86ea9; font-weight: 600; }

  /* ── TABLE ── */
  .bd-table-container {
    background: #161920; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px; overflow: hidden;
  }
  .bd-table { width: 100%; border-collapse: collapse; }
  .bd-table thead tr {
    background: #1c1f28; border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .bd-table th {
    padding: 13px 18px;
    font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase; color: #5a5a6a; text-align: left; white-space: nowrap;
  }
  .bd-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s;
    animation: bdFadeUp 0.3s ease both;
  }
  .bd-table tbody tr:last-child { border-bottom: none; }
  .bd-table tbody tr:hover { background: rgba(255,255,255,0.025); }
  @keyframes bdFadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .bd-table td { padding: 13px 18px; font-size: 14px; color: #e8e4dc; vertical-align: middle; }

  /* name cell */
  .bd-name-cell { display: flex; align-items: center; gap: 12px; }
  .bd-avatar {
    width: 34px; height: 34px; border-radius: 8px;
    background: rgba(200,110,169,0.12); border: 1px solid rgba(200,110,169,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #c86ea9; flex-shrink: 0;
  }
  .bd-name-text { font-weight: 500; }

  /* position chip */
  .bd-pos-chip {
    display: inline-block; padding: 3px 10px;
    background: rgba(200,110,169,0.08); border: 1px solid rgba(200,110,169,0.15);
    border-radius: 5px; font-size: 12px; color: #c86ea9; white-space: nowrap;
  }

  /* date cell */
  .bd-date { font-size: 13px; color: #9a96a0; white-space: nowrap; }
  .bd-date.highlight { color: #c8a96e; font-weight: 600; }

  /* birthday badge */
  .bd-bday-cell { display: flex; align-items: center; gap: 8px; }
  .bd-bday-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px;
    background: rgba(200,110,169,0.1); border: 1px solid rgba(200,110,169,0.2);
    border-radius: 6px; font-size: 12.5px; color: #c86ea9; white-space: nowrap;
  }
  .bd-upcoming-tag {
    font-size: 10px; font-weight: 700; letter-spacing: 0.5px;
    padding: 2px 6px; border-radius: 4px;
    background: rgba(200,169,110,0.15); color: #c8a96e;
    border: 1px solid rgba(200,169,110,0.25);
    animation: bdPulse 2s ease infinite;
  }
  @keyframes bdPulse {
    0%, 100% { opacity: 1; } 50% { opacity: 0.55; }
  }

  /* actions */
  .bd-actions { display: flex; gap: 5px; align-items: center; flex-wrap: nowrap; }

  .bd-btn-view, .bd-btn-edit, .bd-btn-delete {
    display: flex; align-items: center; justify-content: center; gap: 5px;
    padding: 7px 12px; border-radius: 7px;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
    cursor: pointer; border: 1px solid; transition: all 0.2s; white-space: nowrap;
  }
  .bd-btn-view   { background: rgba(200,110,169,0.1); border-color: rgba(200,110,169,0.2); color: #c86ea9; }
  .bd-btn-view:hover { background: rgba(200,110,169,0.2); border-color: rgba(200,110,169,0.4); }
  .bd-btn-edit   { background: rgba(200,169,110,0.1); border-color: rgba(200,169,110,0.2); color: #c8a96e; }
  .bd-btn-edit:hover { background: rgba(200,169,110,0.2); border-color: rgba(200,169,110,0.4); }
  .bd-btn-delete { background: rgba(224,90,90,0.1); border-color: rgba(224,90,90,0.2); color: #e05a5a; }
  .bd-btn-delete:hover { background: rgba(224,90,90,0.2); border-color: rgba(224,90,90,0.4); }

  /* hide button text on smaller tables, show icon only */
  .bd-btn-label { display: inline; }

  /* table scroll */
  .bd-table-container { overflow-x: auto; }
  .bd-table { min-width: 780px; }

  /* compact columns */
  .bd-table th:last-child,
  .bd-table td:last-child { width: 160px; }

  /* empty */
  .bd-empty { padding: 60px 20px; display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }
  .bd-empty-icon { font-size: 38px; opacity: 0.35; }
  .bd-empty-title { font-size: 16px; color: #9a96a0; }
  .bd-empty-sub   { font-size: 13px; color: #5a5a6a; }

  /* ── OVERLAY ── */
  .bd-overlay {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(5,6,10,0.78); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px; animation: bdFadeIn 0.2s ease;
  }
  @keyframes bdFadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes bdScaleIn {
    from { opacity: 0; transform: scale(0.94) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  /* ── VIEW CARD ── */
  .bd-view-card {
    background: #161920; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; width: 100%; max-width: 460px;
    box-shadow: 0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03);
    animation: bdScaleIn 0.25s cubic-bezier(0.16,1,0.3,1); overflow: hidden;
  }
  .bd-card-top {
    padding: 28px 28px 22px;
    background: linear-gradient(135deg, rgba(200,110,169,0.08) 0%, transparent 60%);
    border-bottom: 1px solid rgba(255,255,255,0.06); position: relative;
  }
  .bd-card-close {
    position: absolute; top: 18px; right: 18px;
    width: 30px; height: 30px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 7px; display: flex; align-items: center; justify-content: center;
    color: #9a96a0; font-size: 16px; cursor: pointer; transition: background 0.2s, color 0.2s;
  }
  .bd-card-close:hover { background: rgba(255,255,255,0.1); color: #e8e4dc; }
  .bd-card-avatar-lg {
    width: 58px; height: 58px; border-radius: 14px;
    background: rgba(200,110,169,0.15); border: 1px solid rgba(200,110,169,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; font-weight: 700; color: #c86ea9; margin-bottom: 14px;
  }
  .bd-card-name { font-family: 'DM Serif Display', serif; font-size: 22px; color: #e8e4dc; margin-bottom: 6px; }
  .bd-card-sub  { font-size: 13px; color: #c86ea9; font-weight: 500; }

  .bd-card-body { padding: 18px 28px 4px; }
  .bd-card-field { padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 4px; }
  .bd-card-field:last-child { border-bottom: none; }
  .bd-card-field-label { font-size: 10.5px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #5a5a6a; }
  .bd-card-field-val   { font-size: 14px; font-weight: 500; color: #e8e4dc; }
  .bd-card-field-val.accent { color: #c86ea9; }
  .bd-card-field-val.gold   { color: #c8a96e; }

  .bd-card-actions { padding: 16px 28px 24px; display: flex; gap: 8px; }

  /* ── FORM MODAL ── */
  .bd-form-modal {
    background: #161920; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; width: 100%; max-width: 480px;
    max-height: 90vh; overflow-y: auto;
    box-shadow: 0 40px 100px rgba(0,0,0,0.7);
    animation: bdScaleIn 0.25s cubic-bezier(0.16,1,0.3,1);
  }
  .bd-form-modal::-webkit-scrollbar { width: 4px; }
  .bd-form-modal::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

  .bd-form-head {
    padding: 22px 24px; border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; background: #161920; z-index: 1;
  }
  .bd-form-title { font-family: 'DM Serif Display', serif; font-size: 20px; color: #e8e4dc; display: flex; align-items: center; gap: 8px; }
  .bd-form-body  { padding: 22px 24px; display: flex; flex-direction: column; gap: 16px; }

  .bd-field-group {}
  .bd-field-label {
    display: block; font-size: 11px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: #5a5a6a; margin-bottom: 8px;
  }
  .bd-field-required { color: #c86ea9; margin-left: 2px; }
  .bd-field-input {
    width: 100%; background: #1c1f28;
    border: 1px solid rgba(255,255,255,0.07); border-radius: 9px;
    padding: 11px 14px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: #e8e4dc;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    caret-color: #c86ea9;
  }
  .bd-field-input::placeholder { color: #5a5a6a; }
  .bd-field-input:focus { border-color: rgba(200,110,169,0.4); box-shadow: 0 0 0 3px rgba(200,110,169,0.1); }
  /* date input styling */
  .bd-field-input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }

  .bd-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  .bd-form-foot {
    padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.07);
    display: flex; gap: 8px; justify-content: flex-end;
    position: sticky; bottom: 0; background: #161920;
  }
  .bd-foot-save {
    padding: 10px 22px; background: #c86ea9; color: #0b0d12;
    border: none; border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; transition: background 0.2s, box-shadow 0.2s;
  }
  .bd-foot-save:hover { background: #d47eba; box-shadow: 0 4px 12px rgba(200,110,169,0.3); }
  .bd-foot-save:disabled { opacity: 0.6; pointer-events: none; }
  .bd-foot-cancel {
    padding: 10px 18px; background: transparent;
    border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;
    color: #9a96a0; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
  }
  .bd-foot-cancel:hover { border-color: rgba(255,255,255,0.15); color: #e8e4dc; background: rgba(255,255,255,0.04); }

  /* ── CONFIRM MODAL ── */
  .bd-confirm-modal {
    background: #161920; border: 1px solid rgba(224,90,90,0.2);
    border-radius: 16px; width: 100%; max-width: 360px; padding: 28px;
    box-shadow: 0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(224,90,90,0.1);
    animation: bdScaleIn 0.2s cubic-bezier(0.16,1,0.3,1); text-align: center;
  }
  .bd-confirm-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(224,90,90,0.12); border: 1px solid rgba(224,90,90,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; margin: 0 auto 16px;
  }
  .bd-confirm-title { font-family: 'DM Serif Display', serif; font-size: 20px; color: #e8e4dc; margin-bottom: 8px; }
  .bd-confirm-sub   { font-size: 13px; color: #9a96a0; margin-bottom: 24px; line-height: 1.6; }
  .bd-confirm-btns  { display: flex; gap: 8px; }
  .bd-confirm-del {
    flex: 1; padding: 11px; background: #e05a5a; color: white;
    border: none; border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; transition: background 0.2s, box-shadow 0.2s;
  }
  .bd-confirm-del:hover { background: #ea6a6a; box-shadow: 0 4px 12px rgba(224,90,90,0.3); }
  .bd-confirm-no {
    flex: 1; padding: 11px; background: transparent;
    border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;
    color: #9a96a0; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
  }
  .bd-confirm-no:hover { border-color: rgba(255,255,255,0.15); color: #e8e4dc; }
`;

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';

const formatDate = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  if (isNaN(date)) return d;
  return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getBirthdayMonth = (d) => {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('en-PH', { month: 'long', day: 'numeric' });
};

const isUpcoming = (dob) => {
  if (!dob) return false;
  const today = new Date();
  const bday  = new Date(dob);
  const next  = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  const diff  = (next - today) / (1000 * 60 * 60 * 24);
  return diff <= 30;
};

const EMPTY_FORM = { name: '', position: '', date_started: '', regularized: '', date_of_birth: '' };

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
export default function Birthdays() {
  const [birthdays, setBirthdays]         = useState([]);
  const [search, setSearch]               = useState('');
  const [showModal, setShowModal]         = useState(false);
  const [editingBirthday, setEditingBirthday] = useState(null);
  const [viewItem, setViewItem]           = useState(null);
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [saving, setSaving]               = useState(false);
  const [formData, setFormData]           = useState(EMPTY_FORM);

  useEffect(() => { fetchBirthdays(); }, []);

  const fetchBirthdays = async () => {
    try {
      const res = await axios.get('/api/birthdays');
      setBirthdays(res.data);
    } catch (err) { console.error(err); }
  };

  const sorted = [...birthdays].sort((a, b) => {
    const da = new Date(a.date_of_birth), db = new Date(b.date_of_birth);
    return da.getMonth() !== db.getMonth()
      ? da.getMonth() - db.getMonth()
      : da.getDate() - db.getDate();
  });

  const filtered = sorted.filter(b =>
    `${b.name} ${b.position} ${b.date_of_birth}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingBirthday(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingBirthday(item);
    setFormData({ ...EMPTY_FORM, ...item });
    setViewItem(null);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;
    setSaving(true);
    try {
      if (editingBirthday) {
        await axios.put(`/api/birthdays/${editingBirthday.id}`, formData);
      } else {
        await axios.post('/api/birthdays', formData);
      }
      await fetchBirthdays();
      setShowModal(false);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/api/birthdays/${deleteTarget.id}`);
      await fetchBirthdays();
      setDeleteTarget(null);
    } catch (err) { console.error(err); }
  };

  const field = (key, val) =>
    setFormData(prev => ({ ...prev, [key]: val }));

  return (
    <>
      <style>{STYLES}</style>
      <div className="bd-wrap">

        {/* HEADER */}
        <div className="bd-header">
          <div className="bd-title-group">
            <div className="bd-title-icon">🎂</div>
            <div className="bd-title">Birthdays</div>
            <span className="bd-count">{birthdays.length} records</span>
          </div>
          <button className="bd-add-btn" onClick={openAddModal}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Birthday
          </button>
        </div>

        {/* SEARCH */}
        <div className="bd-search-wrap">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input
            className="bd-search"
            type="text"
            placeholder="Search by name, position, or birthday…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="bd-search-clear" onClick={() => setSearch('')}>×</button>}
        </div>
        {search && (
          <div className="bd-result-info">
            Showing <span>{filtered.length}</span> of {birthdays.length} records
          </div>
        )}

        {/* TABLE */}
        <div className="bd-table-container">
          <table className="bd-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Date Started</th>
                <th>Regularized</th>
                <th>Birthday</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((item, i) => (
                <tr key={item.id} style={{ animationDelay: `${i * 35}ms` }}>
                  <td>
                    <div className="bd-name-cell">
                      <div className="bd-avatar">{getInitials(item.name)}</div>
                      <span className="bd-name-text">{item.name}</span>
                    </div>
                  </td>
                  <td><span className="bd-pos-chip">{item.position}</span></td>
                  <td><span className="bd-date">{formatDate(item.date_started)}</span></td>
                  <td><span className="bd-date">{item.regularized ? formatDate(item.regularized) : '—'}</span></td>
                  <td>
                    <div className="bd-bday-cell">
                      <span className="bd-bday-pill">
                        🎂 {getBirthdayMonth(item.date_of_birth)}
                      </span>
                      {isUpcoming(item.date_of_birth) && (
                        <span className="bd-upcoming-tag">Soon</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="bd-actions">
                      <button className="bd-btn-view" title="View" onClick={() => setViewItem(item)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        <span className="bd-btn-label">View</span>
                      </button>
                      <button className="bd-btn-edit" title="Edit" onClick={() => openEditModal(item)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        <span className="bd-btn-label">Edit</span>
                      </button>
                      <button className="bd-btn-delete" title="Delete" onClick={() => setDeleteTarget(item)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                        </svg>
                        <span className="bd-btn-label">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} style={{ padding: 0 }}>
                    <div className="bd-empty">
                      <div className="bd-empty-icon">🎂</div>
                      <div className="bd-empty-title">
                        {search ? `No results for "${search}"` : 'No birthday records yet'}
                      </div>
                      <div className="bd-empty-sub">
                        {search ? 'Try a different keyword' : 'Click "Add Birthday" to get started'}
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
      {viewItem && (
        <div className="bd-overlay" onClick={() => setViewItem(null)}>
          <div className="bd-view-card" onClick={e => e.stopPropagation()}>
            <div className="bd-card-top">
              <button className="bd-card-close" onClick={() => setViewItem(null)}>×</button>
              <div className="bd-card-avatar-lg">{getInitials(viewItem.name)}</div>
              <div className="bd-card-name">{viewItem.name}</div>
              <div className="bd-card-sub">
                {viewItem.position}
                {isUpcoming(viewItem.date_of_birth) && (
                  <span className="bd-upcoming-tag" style={{ marginLeft: 8 }}>🎉 Birthday soon!</span>
                )}
              </div>
            </div>

            <div className="bd-card-body">
              {[
                { label: 'Birthday',      val: getBirthdayMonth(viewItem.date_of_birth), cls: 'accent' },
                { label: 'Date of Birth', val: formatDate(viewItem.date_of_birth) },
                { label: 'Date Started',  val: formatDate(viewItem.date_started), cls: 'gold' },
                { label: 'Regularized',   val: viewItem.regularized ? formatDate(viewItem.regularized) : 'Not yet regularized' },
                { label: 'Position',      val: viewItem.position },
              ].map(f => (
                <div className="bd-card-field" key={f.label}>
                  <div className="bd-card-field-label">{f.label}</div>
                  <div className={`bd-card-field-val${f.cls ? ` ${f.cls}` : ''}`}>{f.val}</div>
                </div>
              ))}
            </div>

            <div className="bd-card-actions">
              <button
                className="bd-btn-edit"
                style={{ flex: 1, justifyContent: 'center', padding: '10px' }}
                onClick={() => openEditModal(viewItem)}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit
              </button>
              <button
                className="bd-btn-delete"
                style={{ flex: 1, justifyContent: 'center', padding: '10px' }}
                onClick={() => { setViewItem(null); setDeleteTarget(viewItem); }}
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
        <div className="bd-overlay" onClick={() => setShowModal(false)}>
          <div className="bd-form-modal" onClick={e => e.stopPropagation()}>
            <div className="bd-form-head">
              <div className="bd-form-title">
                {editingBirthday ? '✏️' : '🎂'}
                {editingBirthday ? 'Edit Record' : 'New Birthday'}
              </div>
              <button className="bd-card-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="bd-form-body">
              <div className="bd-field-group">
                <label className="bd-field-label">Full Name <span className="bd-field-required">*</span></label>
                <input className="bd-field-input" type="text" placeholder="e.g. Juan dela Cruz"
                  value={formData.name} onChange={e => field('name', e.target.value)} />
              </div>

              <div className="bd-field-group">
                <label className="bd-field-label">Position <span className="bd-field-required">*</span></label>
                <input className="bd-field-input" type="text" placeholder="e.g. Software Engineer"
                  value={formData.position} onChange={e => field('position', e.target.value)} />
              </div>

              <div className="bd-form-row">
                <div className="bd-field-group">
                  <label className="bd-field-label">Date Started <span className="bd-field-required">*</span></label>
                  <input className="bd-field-input" type="date"
                    value={formData.date_started} onChange={e => field('date_started', e.target.value)} />
                </div>
                <div className="bd-field-group">
                  <label className="bd-field-label">Regularized</label>
                  <input className="bd-field-input" type="date"
                    value={formData.regularized} onChange={e => field('regularized', e.target.value)} />
                </div>
              </div>

              <div className="bd-field-group">
                <label className="bd-field-label">Date of Birth <span className="bd-field-required">*</span></label>
                <input className="bd-field-input" type="date"
                  value={formData.date_of_birth} onChange={e => field('date_of_birth', e.target.value)} />
              </div>
            </div>

            <div className="bd-form-foot">
              <button className="bd-foot-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="bd-foot-save" onClick={handleSubmit} disabled={saving}>
                {saving ? 'Saving…' : editingBirthday ? 'Save Changes' : 'Add Record'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteTarget && (
        <div className="bd-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="bd-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="bd-confirm-icon">🗑️</div>
            <div className="bd-confirm-title">Delete Record?</div>
            <div className="bd-confirm-sub">
              You're about to delete <strong style={{ color: '#e8e4dc' }}>{deleteTarget.name}</strong>'s birthday record.<br />
              This cannot be undone.
            </div>
            <div className="bd-confirm-btns">
              <button className="bd-confirm-no" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="bd-confirm-del" onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}