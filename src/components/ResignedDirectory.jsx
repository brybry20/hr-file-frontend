import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .rd-wrap * { box-sizing: border-box; }
  .rd-wrap { font-family: 'DM Sans', sans-serif; color: #e8e4dc; position: relative; z-index: 10; }

  /* Background Effects */
  .rd-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
  }
  .rd-bg::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 40% at 10% 20%, rgba(200,110,110,0.03) 0%, transparent 60%),
                radial-gradient(ellipse 50% 50% at 90% 80%, rgba(200,169,110,0.02) 0%, transparent 60%);
    animation: rdBgPulse 8s ease-in-out infinite;
  }
  .rd-bg::after {
    content: ''; position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  @keyframes rdBgPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }

  /* Floating Orbs */
  .rd-orb {
    position: fixed; border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(200,110,110,0.08), transparent 70%);
    filter: blur(40px); pointer-events: none; z-index: 0;
    animation: rdFloatOrb 20s ease-in-out infinite;
  }
  .rd-orb-1 { width:300px; height:300px; top:10%; right:-50px; }
  .rd-orb-2 { width:250px; height:250px; bottom:5%; left:-30px; animation-delay:5s;
    background: radial-gradient(circle at 70% 70%, rgba(200,169,110,0.08), transparent 70%); }
  @keyframes rdFloatOrb {
    0%   { transform: translate(0,0) scale(1); }
    33%  { transform: translate(20px,-20px) scale(1.1); }
    66%  { transform: translate(-20px,20px) scale(0.9); }
    100% { transform: translate(0,0) scale(1); }
  }

  /* Header */
  .rd-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 28px; flex-wrap: wrap; gap: 16px;
    animation: rdFadeDown 0.5s ease;
  }
  @keyframes rdFadeDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }

  .rd-title-group { display: flex; align-items: center; gap: 16px; }
  .rd-title-icon {
    width: 48px; height: 48px;
    background: rgba(200,110,110,0.12); border: 1px solid rgba(200,110,110,0.3);
    border-radius: 12px; display: flex; align-items: center; justify-content: center;
    font-size: 22px; animation: rdIconPulse 3s ease-in-out infinite;
  }
  @keyframes rdIconPulse {
    0%  { box-shadow: 0 0 0 0 rgba(200,110,110,0.3); }
    50% { box-shadow: 0 0 20px 5px rgba(200,110,110,0.5); }
    100%{ box-shadow: 0 0 0 0 rgba(200,110,110,0.3); }
  }
  .rd-title { font-family:'DM Serif Display',serif; font-size:28px; color:#e8e4dc; letter-spacing:-0.5px; }
  .rd-count {
    font-size:11px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase;
    color:#c86e6e; background:rgba(200,110,110,0.1); border:1px solid rgba(200,110,110,0.2);
    padding:4px 12px; border-radius:20px;
  }

  /* Search */
  .rd-search-wrap {
    position: relative; margin-bottom: 24px;
  }
  .rd-search-wrap svg {
    position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
    width: 18px; height: 18px; stroke: #5a5a6a; fill: none; stroke-width: 1.8;
    pointer-events: none; transition: stroke 0.2s; z-index: 1;
  }
  .rd-search-wrap:focus-within svg { stroke: #c86e6e; }

  .rd-search {
    width: 100%; background: #1c1f28; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px; padding: 14px 18px 14px 46px;
    font-family: 'DM Sans', sans-serif; font-size: 15px; color: #e8e4dc;
    outline: none; transition: all 0.2s; caret-color: #c86e6e;
  }
  .rd-search::placeholder { color: #5a5a6a; }
  .rd-search:focus { border-color: rgba(200,110,110,0.5); box-shadow: 0 0 0 3px rgba(200,110,110,0.15); transform:translateY(-2px); }

  .rd-search-clear {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: #2a2d38; border: none; width: 26px; height: 26px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #9a96a0; font-size: 16px; cursor: pointer; transition: all 0.2s; z-index: 1;
  }
  .rd-search-clear:hover { background: #3a3d4a; color: #e8e4dc; transform: translateY(-50%) scale(1.1); }

  .rd-result-info { font-size: 13px; color: #5a5a6a; margin-bottom: 16px; padding-left: 4px; }
  .rd-result-info span { color: #c86e6e; font-weight: 600; }

  /* Table */
  .rd-table-container {
    background: #161920; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    animation: rdSlideUp 0.5s ease 0.3s both;
  }
  @keyframes rdSlideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }

  /* ── Horizontal scroll wrapper ── */
  .rd-table-scroll {
    overflow-x: auto;
    overflow-y: visible;
    /* Custom scrollbar */
    scrollbar-width: thin;
    scrollbar-color: rgba(200,110,110,0.35) rgba(255,255,255,0.04);
  }
  .rd-table-scroll::-webkit-scrollbar {
    height: 6px;
  }
  .rd-table-scroll::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.04);
    border-radius: 0 0 16px 16px;
  }
  .rd-table-scroll::-webkit-scrollbar-thumb {
    background: rgba(200,110,110,0.35);
    border-radius: 3px;
  }
  .rd-table-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(200,110,110,0.6);
  }

  .rd-table { width:100%; border-collapse:collapse; min-width:1100px; }
  .rd-table thead tr { background:#1c1f28; border-bottom:1px solid rgba(255,255,255,0.07); }
  .rd-table th {
    padding:16px 20px; font-size:11px; font-weight:700; letter-spacing:1.5px;
    text-transform:uppercase; color:#5a5a6a; text-align:left;
    /* Sticky header */
    position: sticky; top: 0; z-index: 2; background: #1c1f28;
  }

  /* Sticky Actions column */
  .rd-table th.rd-col-actions,
  .rd-table td.rd-col-actions {
    position: sticky;
    right: 0;
    z-index: 3;
    background: #161920;
  }
  .rd-table th.rd-col-actions {
    background: #1c1f28;
    z-index: 4;
  }
  /* Subtle left border shadow to visually separate from scrolling content */
  .rd-table th.rd-col-actions::before,
  .rd-table td.rd-col-actions::before {
    content: '';
    position: absolute;
    top: 0; left: -18px; bottom: 0;
    width: 18px;
    background: linear-gradient(to right, transparent, rgba(22,25,32,0.85));
    pointer-events: none;
  }
  .rd-table tbody tr:hover td.rd-col-actions {
    background: #1f2230;
  }
  .rd-table tbody tr {
    border-bottom:1px solid rgba(255,255,255,0.04); transition:all 0.2s;
  }
  .rd-table tbody tr:last-child { border-bottom:none; }
  .rd-table tbody tr:hover { background:rgba(200,110,110,0.05); }
  .rd-table td { padding:16px 20px; font-size:14px; color:#e8e4dc; vertical-align:middle; }

  .rd-name-cell { display:flex; align-items:center; gap:14px; }
  .rd-avatar {
    width:38px; height:38px; border-radius:10px;
    background:rgba(200,110,110,0.12); border:1px solid rgba(200,110,110,0.2);
    display:flex; align-items:center; justify-content:center;
    font-size:14px; font-weight:700; color:#c86e6e; flex-shrink:0; transition:all 0.2s;
  }
  .rd-table tbody tr:hover .rd-avatar { background:rgba(200,110,110,0.2); transform:scale(1.05); }
  .rd-name-text { font-weight:500; transition:color 0.2s; }
  .rd-table tbody tr:hover .rd-name-text { color:#c86e6e; }

  .rd-resigned-badge {
    display:inline-flex; align-items:center; gap:6px;
    padding:6px 14px; background:rgba(200,110,110,0.08);
    border:1px solid rgba(200,110,110,0.15); border-radius:8px;
    font-size:12px; font-weight:600; color:#c86e6e;
  }
  .rd-date-chip {
    font-size:13px; color:#9a96a0;
  }
  .rd-date-chip.resign {
    color:#c86e6e; font-weight:600;
  }
  .rd-salary { color:#c8a96e; font-weight:600; font-size:13px; }
  .rd-muted { color:#5a5a6a; font-size:13px; }
  .rd-reason-pill {
    display:inline-block; padding:4px 12px;
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);
    border-radius:6px; font-size:12px; color:#9a96a0;
    max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }

  .rd-actions { display:flex; gap:6px; align-items:center; }
  .rd-btn-view, .rd-btn-delete {
    display:flex; align-items:center; justify-content:center; gap:5px;
    padding:8px 14px; border-radius:8px;
    font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600;
    cursor:pointer; border:1px solid; transition:all 0.2s; white-space:nowrap;
  }
  .rd-btn-view {
    background:rgba(200,110,110,0.1); border-color:rgba(200,110,110,0.2); color:#c86e6e;
  }
  .rd-btn-view:hover {
    background:rgba(200,110,110,0.2); border-color:rgba(200,110,110,0.4); transform:translateY(-2px);
  }
  .rd-btn-delete {
    background:rgba(224,90,90,0.1); border-color:rgba(224,90,90,0.2); color:#e05a5a;
  }
  .rd-btn-delete:hover {
    background:rgba(224,90,90,0.2); border-color:rgba(224,90,90,0.4); transform:translateY(-2px);
  }

  /* Empty State */
  .rd-empty {
    padding:70px 20px; display:flex; flex-direction:column;
    align-items:center; gap:16px; text-align:center;
    background:#1c1f28; border-radius:16px; border:1px solid rgba(255,255,255,0.07);
    animation:rdFadeScale 0.3s ease;
  }
  @keyframes rdFadeScale { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
  .rd-empty-icon { font-size:48px; opacity:0.5; animation:rdFloat 3s ease-in-out infinite; }
  @keyframes rdFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  .rd-empty-title { font-size:18px; color:#9a96a0; }
  .rd-empty-sub   { font-size:14px; color:#5a5a6a; }

  /* Overlay */
  .rd-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    z-index: 9999; background: rgba(5,6,10,0.85); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px; animation: rdFadeIn 0.2s ease;
  }
  @keyframes rdFadeIn { from{opacity:0} to{opacity:1} }
  @keyframes rdScaleIn { from{opacity:0;transform:scale(0.94) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }

  /* View Card */
  .rd-view-card {
    background: #1a1e2a; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; width: 100%; max-width: 600px;
    box-shadow: 0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(200,110,110,0.1);
    animation: rdScaleIn 0.25s cubic-bezier(0.16,1,0.3,1); overflow: hidden;
    margin: 0 20px; max-height: 88vh; overflow-y: auto;
  }
  .rd-view-card::-webkit-scrollbar { width:4px; }
  .rd-view-card::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }

  .rd-card-top {
    padding: 32px 28px 24px;
    background: linear-gradient(135deg, rgba(200,110,110,0.08) 0%, transparent 60%);
    border-bottom: 1px solid rgba(255,255,255,0.06); position: relative;
  }
  .rd-card-close {
    position: absolute; top: 18px; right: 18px;
    width: 32px; height: 32px; background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: #9a96a0; font-size: 18px; cursor: pointer; transition: all 0.2s;
  }
  .rd-card-close:hover { background: rgba(255,255,255,0.1); color: #e8e4dc; transform: rotate(90deg); }
  .rd-card-avatar-lg {
    width: 64px; height: 64px; border-radius: 16px;
    background: rgba(200,110,110,0.15); border: 1px solid rgba(200,110,110,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; font-weight: 700; color: #c86e6e; margin-bottom: 16px;
    animation: rdGlow 3s ease-in-out infinite;
  }
  @keyframes rdGlow {
    0%,100%{ box-shadow:0 0 10px rgba(200,110,110,0.3); }
    50%    { box-shadow:0 0 25px rgba(200,110,110,0.6); }
  }
  .rd-card-name { font-family:'DM Serif Display',serif; font-size:24px; color:#e8e4dc; margin-bottom:8px; }
  .rd-card-sub {
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    font-size:13px; color:#9a96a0; margin-bottom:12px;
  }
  .rd-card-resign-banner {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px; background: rgba(200,110,110,0.08);
    border: 1px solid rgba(200,110,110,0.15); border-radius: 12px;
    margin-top: 8px;
  }
  .rd-card-resign-date {
    font-size:14px; font-weight:600; color:#c86e6e;
  }
  .rd-card-resign-reason {
    font-size:13px; color:#9a96a0; margin-top:4px;
  }

  .rd-card-section { padding:14px 28px 0; }
  .rd-card-section-title {
    font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase;
    color:#5a5a6a; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.05);
  }
  .rd-card-fields { display:grid; grid-template-columns:1fr 1fr; gap:0; margin-bottom:14px; }
  .rd-card-field {
    padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.04);
  }
  .rd-card-field:nth-child(odd)  { padding-right:16px; }
  .rd-card-field:nth-child(even) { padding-left:16px; border-left:1px solid rgba(255,255,255,0.04); }
  .rd-card-field.full { grid-column:span 2; padding-right:0; border-left:none; }
  .rd-card-field-label { font-size:10px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:#5a5a6a; margin-bottom:4px; }
  .rd-card-field-val { font-size:14px; font-weight:500; color:#e8e4dc; word-break:break-word; }
  .rd-card-field-val.accent { color:#c86e6e; }
  .rd-card-field-val.gold   { color:#c8a96e; }
  .rd-card-field-val.mono   { font-family:monospace; font-size:13px; color:#9a96a0; }

  .rd-card-actions {
    padding: 16px 28px 28px;
    display: flex; gap: 10px;
  }

  /* Confirm Modal */
  .rd-confirm-modal {
    background: #1a1e2a; border: 1px solid rgba(224,90,90,0.2);
    border-radius: 18px; width: 100%; max-width: 380px; padding: 32px;
    box-shadow: 0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(224,90,90,0.1);
    animation: rdScaleIn 0.2s cubic-bezier(0.16,1,0.3,1); text-align: center;
    margin: 0 20px;
  }
  .rd-confirm-icon {
    width: 60px; height: 60px; border-radius: 16px;
    background: rgba(224,90,90,0.12); border: 1px solid rgba(224,90,90,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; margin: 0 auto 20px; animation: rdShake 0.3s ease;
  }
  @keyframes rdShake {
    0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)}
  }
  .rd-confirm-title { font-family:'DM Serif Display',serif; font-size:22px; color:#e8e4dc; margin-bottom:10px; }
  .rd-confirm-sub   { font-size:14px; color:#9a96a0; margin-bottom:28px; line-height:1.6; }
  .rd-confirm-btns  { display:flex; gap:12px; }
  .rd-confirm-del {
    flex:1; padding:12px; background:#e05a5a; color:white; border:none; border-radius:10px;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700; cursor:pointer; transition:all 0.2s;
  }
  .rd-confirm-del::before {
    content:''; position:absolute; inset:0;
    background:linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%);
    transform:translateX(-100%); transition:transform 0.5s;
  }
  .rd-confirm-del:hover::before { transform:translateX(100%); }
  .rd-confirm-del:hover { background:#ea6a6a; box-shadow:0 6px 20px rgba(224,90,90,0.4); transform:translateY(-2px); }
  .rd-confirm-no {
    flex:1; padding:12px; background:transparent; border:1px solid rgba(255,255,255,0.08);
    border-radius:10px; color:#9a96a0;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; cursor:pointer; transition:all 0.2s;
  }
  .rd-confirm-no:hover { border-color:rgba(255,255,255,0.15); color:#e8e4dc; background:rgba(255,255,255,0.04); transform:translateY(-2px); }
`;

const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';

const fmt = (d) => {
  if (!d) return '—';
  if (d === 'undefined' || d === 'null') return '—';
  try {
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? d : dt.toLocaleDateString('en-PH', { year:'numeric', month:'short', day:'numeric' });
  } catch {
    return d;
  }
};

const safeDisplay = (value) => {
  if (value === undefined || value === null || value === 'undefined' || value === 'null') return '—';
  if (typeof value === 'string' && value.trim() === '') return '—';
  return value;
};

export default function ResignedDirectory({ onNotify }) {
  const [resignedEmployees, setResignedEmployees] = useState([]);
  const [search, setSearch]                       = useState('');
  const [viewEmp, setViewEmp]                     = useState(null);
  const [deleteTarget, setDeleteTarget]           = useState(null);

  const notify = (type, msg) => { if (onNotify) onNotify(type, msg); };

  useEffect(() => {
    const open = !!(viewEmp || deleteTarget);
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [viewEmp, deleteTarget]);

  useEffect(() => { fetchResignedEmployees(); }, []);

  const fetchResignedEmployees = async () => {
    try {
      const res = await axios.get('/api/resigned-employees');
      setResignedEmployees(res.data);
      notify('info', `Loaded ${res.data.length} resigned records`);
    } catch {
      notify('error', 'Failed to load resigned employees');
    }
  };

  const filtered = resignedEmployees.filter(e =>
    `${e.name} ${e.position} ${e.resignation_date} ${e.reason}`.toLowerCase().includes(search.toLowerCase())
  );

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/resigned-employees/${deleteTarget.id}`);
      await fetchResignedEmployees();
      setDeleteTarget(null);
      notify('success', 'Record deleted successfully');
    } catch {
      notify('error', 'Failed to delete record');
    }
  };

  return (
    <>
      <style>{STYLES}</style>

      {/* Background elements */}
      <div className="rd-bg" />
      <div className="rd-orb rd-orb-1" />
      <div className="rd-orb rd-orb-2" />

      {/* Main Content */}
      <div className="rd-wrap">
        <div className="rd-header">
          <div className="rd-title-group">
            <div className="rd-title-icon">📋</div>
            <div>
              <div className="rd-title">Resigned Employees</div>
            </div>
            <span className="rd-count">{resignedEmployees.length} records</span>
          </div>
        </div>

        <div className="rd-search-wrap">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input
            className="rd-search"
            type="text"
            placeholder="Search by name, position, resignation date, or reason…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="rd-search-clear" onClick={() => setSearch('')}>×</button>}
        </div>

        {search && (
          <div className="rd-result-info">
            Showing <span>{filtered.length}</span> of {resignedEmployees.length} records
          </div>
        )}

        {/* ── Table container keeps the rounded border & shadow ── */}
        <div className="rd-table-container">
          {/* ── Scroll wrapper inside, so border-radius is preserved ── */}
          <div className="rd-table-scroll">
            <table className="rd-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Date Started</th>
                  <th>Salary</th>
                  <th>SSS</th>
                  <th>PhilHealth</th>
                  <th>Pag-IBIG</th>
                  <th>TIN</th>
                  <th>CP / Viber</th>
                  <th>Email</th>
                  <th>Resigned</th>
                  <th>Reason</th>
                  <th className="rd-col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map((emp, i) => (
                  <tr key={emp.id} style={{ animationDelay: `${i * 30}ms` }}>
                    <td>
                      <div className="rd-name-cell">
                        <div className="rd-avatar">{getInitials(emp.name)}</div>
                        <span className="rd-name-text">{safeDisplay(emp.name)}</span>
                      </div>
                    </td>
                    <td><span style={{color:'#9a96a0'}}>{safeDisplay(emp.position)}</span></td>
                    <td><span className="rd-resigned-badge">📋 {safeDisplay(emp.employment_status) || 'Resigned'}</span></td>
                    <td><span className="rd-date-chip">{fmt(emp.date_started)}</span></td>
                    <td><span className="rd-salary">₱{Number(emp.salary || 0).toLocaleString()}</span></td>
                    <td><span className="rd-muted" style={{fontFamily:'monospace',fontSize:12}}>{safeDisplay(emp.sss)}</span></td>
                    <td><span className="rd-muted" style={{fontFamily:'monospace',fontSize:12}}>{safeDisplay(emp.philhealth)}</span></td>
                    <td><span className="rd-muted" style={{fontFamily:'monospace',fontSize:12}}>{safeDisplay(emp.pagibig)}</span></td>
                    <td><span className="rd-muted" style={{fontFamily:'monospace',fontSize:12}}>{safeDisplay(emp.tin)}</span></td>
                    <td><span className="rd-muted">{safeDisplay(emp.cp_viber)}</span></td>
                    <td><span style={{fontSize:13,color:'#9a96a0'}}>{safeDisplay(emp.official_email)}</span></td>
                    <td><span className="rd-date-chip resign">{fmt(emp.resignation_date)}</span></td>
                    <td>
                      {emp.reason ? (
                        <span className="rd-reason-pill" title={emp.reason}>{emp.reason}</span>
                      ) : (
                        <span className="rd-muted">—</span>
                      )}
                    </td>
                    <td className="rd-col-actions">
                      <div className="rd-actions">
                        <button className="rd-btn-view" onClick={() => setViewEmp(emp)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                          </svg>
                          View
                        </button>
                        <button className="rd-btn-delete" onClick={() => setDeleteTarget(emp)}>
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
                    <td colSpan={14} style={{ padding: 0 }}>
                      <div className="rd-empty">
                        <div className="rd-empty-icon">📋</div>
                        <div className="rd-empty-title">
                          {search ? `No results for "${search}"` : 'No resigned employees yet'}
                        </div>
                        <div className="rd-empty-sub">
                          {search ? 'Try a different keyword' : 'Resigned employees will appear here'}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals Portal */}
      {createPortal(
        <>
          {/* View Modal */}
          {viewEmp && (
            <div className="rd-overlay" onClick={() => setViewEmp(null)}>
              <div className="rd-view-card" onClick={e => e.stopPropagation()}>
                <div className="rd-card-top">
                  <button className="rd-card-close" onClick={() => setViewEmp(null)}>×</button>
                  <div className="rd-card-avatar-lg">{getInitials(viewEmp.name)}</div>
                  <div className="rd-card-name">{safeDisplay(viewEmp.name)}</div>
                  <div className="rd-card-sub">
                    <span>{safeDisplay(viewEmp.position)}</span>
                    <span className="rd-resigned-badge">📋 Resigned</span>
                  </div>

                  <div className="rd-card-resign-banner">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c86e6e" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <div>
                      <div className="rd-card-resign-date">Resigned on {fmt(viewEmp.resignation_date)}</div>
                      {viewEmp.reason && <div className="rd-card-resign-reason">Reason: {viewEmp.reason}</div>}
                    </div>
                  </div>
                </div>

                <div className="rd-card-section">
                  <div className="rd-card-section-title">Employment Info</div>
                  <div className="rd-card-fields">
                    {[
                      { label:'Date Started',     val: fmt(viewEmp.date_started),     cls:'gold' },
                      { label:'Date Regularized', val: fmt(viewEmp.date_regularized) },
                      { label:'Employment Status',val: safeDisplay(viewEmp.employment_status) },
                      { label:'Salary',           val: `₱${Number(viewEmp.salary||0).toLocaleString()}`, cls:'gold' },
                      { label:'Diploma',          val: safeDisplay(viewEmp.diploma) },
                      { label:'Resignation Date', val: fmt(viewEmp.resignation_date), cls:'accent' },
                    ].map(f => (
                      <div className="rd-card-field" key={f.label}>
                        <div className="rd-card-field-label">{f.label}</div>
                        <div className={`rd-card-field-val${f.cls ? ` ${f.cls}` : ''}`}>{f.val || '—'}</div>
                      </div>
                    ))}
                  </div>

                  <div className="rd-card-section-title">Government IDs</div>
                  <div className="rd-card-fields">
                    {[
                      { label:'SSS',       val: safeDisplay(viewEmp.sss),        cls:'mono' },
                      { label:'PhilHealth',val: safeDisplay(viewEmp.philhealth), cls:'mono' },
                      { label:'Pag-IBIG',  val: safeDisplay(viewEmp.pagibig),    cls:'mono' },
                      { label:'TIN',       val: safeDisplay(viewEmp.tin),        cls:'mono' },
                    ].map(f => (
                      <div className="rd-card-field" key={f.label}>
                        <div className="rd-card-field-label">{f.label}</div>
                        <div className={`rd-card-field-val${f.cls ? ` ${f.cls}` : ''}`}>{f.val || '—'}</div>
                      </div>
                    ))}
                  </div>

                  <div className="rd-card-section-title">Contact Info</div>
                  <div className="rd-card-fields" style={{marginBottom:14}}>
                    <div className="rd-card-field">
                      <div className="rd-card-field-label">CP / Viber</div>
                      <div className="rd-card-field-val">{safeDisplay(viewEmp.cp_viber)}</div>
                    </div>
                    <div className="rd-card-field">
                      <div className="rd-card-field-label">Official Email</div>
                      <div className="rd-card-field-val" style={{fontSize:13}}>{safeDisplay(viewEmp.official_email)}</div>
                    </div>
                    <div className="rd-card-field full">
                      <div className="rd-card-field-label">Home Address</div>
                      <div className="rd-card-field-val" style={{whiteSpace:'normal'}}>{safeDisplay(viewEmp.home_address)}</div>
                    </div>
                    {viewEmp.reason && (
                      <div className="rd-card-field full">
                        <div className="rd-card-field-label">Reason for Resignation</div>
                        <div className="rd-card-field-val accent" style={{whiteSpace:'normal'}}>{viewEmp.reason}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rd-card-actions">
                  <button
                    className="rd-btn-delete"
                    style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
                    onClick={() => { setViewEmp(null); setDeleteTarget(viewEmp); }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                    </svg>
                    Delete Record
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteTarget && (
            <div className="rd-overlay" onClick={() => setDeleteTarget(null)}>
              <div className="rd-confirm-modal" onClick={e => e.stopPropagation()}>
                <div className="rd-confirm-icon">🗑️</div>
                <div className="rd-confirm-title">Delete Record?</div>
                <div className="rd-confirm-sub">
                  You're about to permanently delete <strong style={{color:'#e8e4dc'}}>{safeDisplay(deleteTarget.name)}</strong>'s record.<br/>
                  This action cannot be undone.
                </div>
                <div className="rd-confirm-btns">
                  <button className="rd-confirm-no" onClick={() => setDeleteTarget(null)}>Cancel</button>
                  <button className="rd-confirm-del" onClick={confirmDelete}>Yes, Delete</button>
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