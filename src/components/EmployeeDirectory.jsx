import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDate, safeString, formatCurrency } from '../utils/dateHelpers';
import TableCell from '../components/TableCell';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .ed-wrap * { box-sizing: border-box; }
  .ed-wrap { font-family: 'DM Sans', sans-serif; color: #e8e4dc; }

  /* HEADER */
  .ed-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
  .ed-title-group { display:flex; align-items:center; gap:14px; }
  .ed-title-icon { width:40px; height:40px; background:rgba(110,181,200,0.12); border:1px solid rgba(110,181,200,0.25); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; }
  .ed-title { font-family:'DM Serif Display',serif; font-size:24px; color:#e8e4dc; letter-spacing:-0.5px; }
  .ed-count { font-size:11px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:#6eb5c8; background:rgba(110,181,200,0.1); border:1px solid rgba(110,181,200,0.2); padding:3px 10px; border-radius:20px; }
  .ed-add-btn { display:flex; align-items:center; gap:7px; padding:10px 20px; background:#6eb5c8; color:#0b0d12; border:none; border-radius:9px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; position:relative; overflow:hidden; transition:background 0.2s, box-shadow 0.2s, transform 0.1s; }
  .ed-add-btn::before { content:''; position:absolute; inset:0; background:linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%); transform:translateX(-100%); transition:transform 0.4s; }
  .ed-add-btn:hover::before { transform:translateX(100%); }
  .ed-add-btn:hover { background:#7ec5d8; box-shadow:0 4px 16px rgba(110,181,200,0.35); }
  .ed-add-btn:active { transform:scale(0.97); }

  /* SEARCH */
  .ed-search-wrap { position:relative; margin-bottom:10px; }
  .ed-search-wrap svg { position:absolute; left:14px; top:50%; transform:translateY(-50%); width:15px; height:15px; stroke:#5a5a6a; fill:none; stroke-width:1.8; pointer-events:none; transition:stroke 0.2s; }
  .ed-search-wrap:focus-within svg { stroke:#6eb5c8; }
  .ed-search { width:100%; background:#1c1f28; border:1px solid rgba(255,255,255,0.07); border-radius:10px; padding:12px 44px 12px 42px; font-family:'DM Sans',sans-serif; font-size:14px; color:#e8e4dc; outline:none; transition:border-color 0.2s, box-shadow 0.2s; caret-color:#6eb5c8; }
  .ed-search::placeholder { color:#5a5a6a; }
  .ed-search:focus { border-color:rgba(110,181,200,0.4); box-shadow:0 0 0 3px rgba(110,181,200,0.1); }
  .ed-search-clear { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:#2a2d38; border:none; width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#9a96a0; font-size:14px; cursor:pointer; transition:background 0.2s, color 0.2s; }
  .ed-search-clear:hover { background:#3a3d4a; color:#e8e4dc; }
  .ed-result-info { font-size:12px; color:#5a5a6a; margin-bottom:14px; padding-left:2px; }
  .ed-result-info span { color:#6eb5c8; font-weight:600; }

  /* TABLE */
  .ed-table-container { background:#161920; border:1px solid rgba(255,255,255,0.07); border-radius:14px; overflow-x:auto; }
  .ed-table { width:100%; border-collapse:collapse; min-width:1200px; }
  .ed-table thead tr { background:#1c1f28; border-bottom:1px solid rgba(255,255,255,0.07); }
  .ed-table th { padding:12px 14px; font-size:10.5px; font-weight:700; letter-spacing:1.3px; text-transform:uppercase; color:#5a5a6a; text-align:left; white-space:nowrap; }
  .ed-table tbody tr { border-bottom:1px solid rgba(255,255,255,0.04); transition:background 0.15s; animation:edFadeUp 0.3s ease both; }
  .ed-table tbody tr:last-child { border-bottom:none; }
  .ed-table tbody tr:hover { background:rgba(255,255,255,0.025); }
  .ed-table td { padding:12px 14px; font-size:13px; color:#e8e4dc; vertical-align:middle; white-space:nowrap; max-width:200px; overflow:hidden; text-overflow:ellipsis; }
  .ed-table th:last-child { position:sticky; right:0; width:210px; min-width:210px; background:#1c1f28 !important; box-shadow:-6px 0 12px rgba(0,0,0,0.6); overflow:visible !important; z-index:3; }
  .ed-table td:last-child { position:sticky; right:0; width:210px; min-width:210px; max-width:none !important; overflow:visible !important; background:#161920 !important; box-shadow:-6px 0 12px rgba(0,0,0,0.6); z-index:2; }
  .ed-table tbody tr:hover td:last-child { background:#1e2230 !important; }

  @keyframes edFadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

  /* cells */
  .ed-name-cell { display:flex; align-items:center; gap:10px; }
  .ed-avatar { width:30px; height:30px; border-radius:7px; background:rgba(110,181,200,0.12); border:1px solid rgba(110,181,200,0.2); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:#6eb5c8; flex-shrink:0; }
  .ed-status-chip { display:inline-block; padding:2px 9px; border-radius:4px; font-size:11px; font-weight:600; }
  .ed-status-Regular      { background:rgba(90,206,168,0.12); border:1px solid rgba(90,206,168,0.2); color:#5acea8; }
  .ed-status-Probationary { background:rgba(200,169,110,0.12); border:1px solid rgba(200,169,110,0.2); color:#c8a96e; }
  .ed-status-Contractual  { background:rgba(169,110,200,0.12); border:1px solid rgba(169,110,200,0.2); color:#a96ec8; }
  .ed-status-Part-time    { background:rgba(110,181,200,0.12); border:1px solid rgba(110,181,200,0.2); color:#6eb5c8; }
  .ed-muted { color:#5a5a6a; font-size:12px; }
  .ed-salary { color:#c8a96e; font-weight:600; font-size:12.5px; }

  /* actions */
  .ed-actions { display:flex; gap:4px; align-items:center; flex-wrap:nowrap; }
  .ed-btn-view, .ed-btn-edit, .ed-btn-resign, .ed-btn-delete {
    display:flex; align-items:center; justify-content:center; gap:4px;
    padding:6px 9px; border-radius:6px;
    font-family:'DM Sans',sans-serif; font-size:11px; font-weight:600;
    cursor:pointer; border:1px solid; transition:all 0.2s; white-space:nowrap;
  }
  .ed-btn-view   { background:rgba(110,181,200,0.1); border-color:rgba(110,181,200,0.2); color:#6eb5c8; }
  .ed-btn-view:hover { background:rgba(110,181,200,0.2); border-color:rgba(110,181,200,0.4); }
  .ed-btn-edit   { background:rgba(200,169,110,0.1); border-color:rgba(200,169,110,0.2); color:#c8a96e; }
  .ed-btn-edit:hover { background:rgba(200,169,110,0.2); border-color:rgba(200,169,110,0.4); }
  .ed-btn-resign { background:rgba(237,137,54,0.1); border-color:rgba(237,137,54,0.2); color:#ed8936; }
  .ed-btn-resign:hover { background:rgba(237,137,54,0.2); border-color:rgba(237,137,54,0.4); }
  .ed-btn-delete { background:rgba(224,90,90,0.1); border-color:rgba(224,90,90,0.2); color:#e05a5a; }
  .ed-btn-delete:hover { background:rgba(224,90,90,0.2); border-color:rgba(224,90,90,0.4); }

  .ed-empty { padding:60px 20px; display:flex; flex-direction:column; align-items:center; gap:12px; text-align:center; }
  .ed-empty-icon { font-size:38px; opacity:0.35; }
  .ed-empty-title { font-size:16px; color:#9a96a0; }
  .ed-empty-sub   { font-size:13px; color:#5a5a6a; }

  /* OVERLAY */
  .ed-overlay { position:fixed; inset:0; z-index:300; background:rgba(5,6,10,0.78); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; padding:20px; animation:edFadeIn 0.2s ease; }
  @keyframes edFadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes edScaleIn { from { opacity:0; transform:scale(0.94) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }

  /* VIEW CARD */
  .ed-view-card { background:#161920; border:1px solid rgba(255,255,255,0.08); border-radius:20px; width:100%; max-width:600px; max-height:88vh; overflow-y:auto; box-shadow:0 40px 100px rgba(0,0,0,0.7); animation:edScaleIn 0.25s cubic-bezier(0.16,1,0.3,1); }
  .ed-view-card::-webkit-scrollbar { width:4px; }
  .ed-view-card::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }
  .ed-card-top { padding:24px 24px 20px; background:linear-gradient(135deg, rgba(110,181,200,0.08) 0%, transparent 60%); border-bottom:1px solid rgba(255,255,255,0.06); position:relative; }
  .ed-card-close { position:absolute; top:16px; right:16px; width:30px; height:30px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08); border-radius:7px; display:flex; align-items:center; justify-content:center; color:#9a96a0; font-size:16px; cursor:pointer; transition:background 0.2s, color 0.2s; }
  .ed-card-close:hover { background:rgba(255,255,255,0.1); color:#e8e4dc; }
  .ed-card-avatar-lg { width:52px; height:52px; border-radius:12px; background:rgba(110,181,200,0.15); border:1px solid rgba(110,181,200,0.3); display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:700; color:#6eb5c8; margin-bottom:12px; }
  .ed-card-name { font-family:'DM Serif Display',serif; font-size:22px; color:#e8e4dc; margin-bottom:4px; }
  .ed-card-sub  { font-size:13px; color:#6eb5c8; font-weight:500; display:flex; align-items:center; gap:8px; flex-wrap:wrap; }

  .ed-card-section { padding:14px 24px 0; }
  .ed-card-section-title { font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#5a5a6a; margin-bottom:8px; padding-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.05); }
  .ed-card-fields { display:grid; grid-template-columns:1fr 1fr; gap:0; margin-bottom:14px; }
  .ed-card-field { padding:9px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
  .ed-card-field:nth-child(odd)  { padding-right:16px; }
  .ed-card-field:nth-child(even) { padding-left:16px; border-left:1px solid rgba(255,255,255,0.04); }
  .ed-card-field.full { grid-column:span 2; padding-right:0; }
  .ed-card-field-label { font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#5a5a6a; margin-bottom:3px; }
  .ed-card-field-val { font-size:13px; font-weight:500; color:#e8e4dc; word-break:break-word; white-space:normal; }
  .ed-card-field-val.accent { color:#6eb5c8; }
  .ed-card-field-val.gold { color:#c8a96e; }
  .ed-card-field-val.mono { font-family:monospace; font-size:12px; color:#9a96a0; }

  .ed-card-actions { padding:14px 24px 22px; display:flex; gap:8px; flex-wrap:wrap; }

  /* FORM MODAL */
  .ed-form-modal { background:#161920; border:1px solid rgba(255,255,255,0.08); border-radius:20px; width:100%; max-width:720px; max-height:90vh; overflow-y:auto; box-shadow:0 40px 100px rgba(0,0,0,0.7); animation:edScaleIn 0.25s cubic-bezier(0.16,1,0.3,1); }
  .ed-form-modal::-webkit-scrollbar { width:4px; }
  .ed-form-modal::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }
  .ed-form-head { padding:20px 24px; border-bottom:1px solid rgba(255,255,255,0.07); display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; background:#161920; z-index:1; }
  .ed-form-title { font-family:'DM Serif Display',serif; font-size:20px; color:#e8e4dc; display:flex; align-items:center; gap:8px; }
  .ed-form-section { padding:18px 24px 0; }
  .ed-form-section-label { font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#5a5a6a; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.05); }
  .ed-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:18px; }
  .ed-form-grid.cols3 { grid-template-columns:1fr 1fr 1fr; }
  .ed-form-grid.single { grid-template-columns:1fr; }
  .ed-field-label { display:block; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#5a5a6a; margin-bottom:7px; }
  .ed-field-req { color:#6eb5c8; }
  .ed-field-input, .ed-field-select { width:100%; background:#1c1f28; border:1px solid rgba(255,255,255,0.07); border-radius:9px; padding:10px 14px; font-family:'DM Sans',sans-serif; font-size:14px; color:#e8e4dc; outline:none; transition:border-color 0.2s, box-shadow 0.2s; caret-color:#6eb5c8; }
  .ed-field-input::placeholder { color:#5a5a6a; }
  .ed-field-input:focus, .ed-field-select:focus { border-color:rgba(110,181,200,0.4); box-shadow:0 0 0 3px rgba(110,181,200,0.1); }
  .ed-field-select { appearance:none; cursor:pointer; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235a5a6a' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:32px; }
  .ed-field-input[type="date"]::-webkit-calendar-picker-indicator { filter:invert(0.5); cursor:pointer; }
  .ed-form-foot { padding:16px 24px; border-top:1px solid rgba(255,255,255,0.07); display:flex; gap:8px; justify-content:flex-end; position:sticky; bottom:0; background:#161920; }
  .ed-foot-save { padding:10px 22px; background:#6eb5c8; color:#0b0d12; border:none; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:background 0.2s, box-shadow 0.2s; }
  .ed-foot-save:hover { background:#7ec5d8; box-shadow:0 4px 12px rgba(110,181,200,0.3); }
  .ed-foot-save:disabled { opacity:0.6; pointer-events:none; }
  .ed-foot-cancel { padding:10px 18px; background:transparent; border:1px solid rgba(255,255,255,0.08); border-radius:8px; color:#9a96a0; font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; transition:all 0.2s; }
  .ed-foot-cancel:hover { border-color:rgba(255,255,255,0.15); color:#e8e4dc; background:rgba(255,255,255,0.04); }

  /* RESIGN MODAL */
  .ed-resign-modal { background:#161920; border:1px solid rgba(237,137,54,0.2); border-radius:18px; width:100%; max-width:440px; box-shadow:0 40px 80px rgba(0,0,0,0.7); animation:edScaleIn 0.2s cubic-bezier(0.16,1,0.3,1); overflow:hidden; }
  .ed-resign-head { padding:22px 24px; border-bottom:1px solid rgba(255,255,255,0.07); display:flex; align-items:center; justify-content:space-between; }
  .ed-resign-title { font-family:'DM Serif Display',serif; font-size:20px; color:#e8e4dc; display:flex; align-items:center; gap:8px; }
  .ed-resign-body { padding:22px 24px; }
  .ed-resign-who { display:flex; align-items:center; gap:10px; padding:12px 14px; background:rgba(237,137,54,0.06); border:1px solid rgba(237,137,54,0.15); border-radius:10px; margin-bottom:20px; }
  .ed-resign-who-avatar { width:36px; height:36px; border-radius:8px; background:rgba(237,137,54,0.15); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:#ed8936; flex-shrink:0; }
  .ed-resign-who-name { font-size:14px; font-weight:600; color:#e8e4dc; }
  .ed-resign-who-pos  { font-size:12px; color:#9a96a0; }
  .ed-resign-foot { padding:16px 24px; border-top:1px solid rgba(255,255,255,0.07); display:flex; gap:8px; justify-content:flex-end; }
  .ed-resign-confirm { padding:10px 22px; background:#ed8936; color:#0b0d12; border:none; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:background 0.2s, box-shadow 0.2s; }
  .ed-resign-confirm:hover { background:#f59546; box-shadow:0 4px 12px rgba(237,137,54,0.3); }

  /* CONFIRM DELETE */
  .ed-confirm-modal { background:#161920; border:1px solid rgba(224,90,90,0.2); border-radius:16px; width:100%; max-width:360px; padding:28px; box-shadow:0 40px 80px rgba(0,0,0,0.7); animation:edScaleIn 0.2s cubic-bezier(0.16,1,0.3,1); text-align:center; }
  .ed-confirm-icon  { width:52px; height:52px; border-radius:14px; background:rgba(224,90,90,0.12); border:1px solid rgba(224,90,90,0.25); display:flex; align-items:center; justify-content:center; font-size:22px; margin:0 auto 16px; }
  .ed-confirm-title { font-family:'DM Serif Display',serif; font-size:20px; color:#e8e4dc; margin-bottom:8px; }
  .ed-confirm-sub   { font-size:13px; color:#9a96a0; margin-bottom:24px; line-height:1.6; }
  .ed-confirm-btns  { display:flex; gap:8px; }
  .ed-confirm-del { flex:1; padding:11px; background:#e05a5a; color:white; border:none; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:background 0.2s; }
  .ed-confirm-del:hover { background:#ea6a6a; }
  .ed-confirm-no  { flex:1; padding:11px; background:transparent; border:1px solid rgba(255,255,255,0.08); border-radius:8px; color:#9a96a0; font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; transition:all 0.2s; }
  .ed-confirm-no:hover { border-color:rgba(255,255,255,0.15); color:#e8e4dc; background:rgba(255,255,255,0.04); }
`;

const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';

// Helper function para safe display
const safeDisplay = (value) => {
  if (value === undefined || value === null) return '—';
  if (value === 'undefined') return '—';
  if (value === 'null') return '—';
  if (typeof value === 'string' && value.trim() === '') return '—';
  return value;
};

const EMPTY_FORM = {
  name:'', position:'', diploma:'', date_started:'', date_regularized:'',
  employment_status:'Regular', salary:'', sss:'', philhealth:'', pagibig:'',
  tin:'', cp_viber:'', official_email:'', home_address:''
};

export default function EmployeeDirectory() {
  const [employees, setEmployees]               = useState([]);
  const [search, setSearch]                     = useState('');
  const [showModal, setShowModal]               = useState(false);
  const [showResignModal, setShowResignModal]   = useState(false);
  const [editingEmployee, setEditingEmployee]   = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewEmployee, setViewEmployee]         = useState(null);
  const [deleteTarget, setDeleteTarget]         = useState(null);
  const [saving, setSaving]                     = useState(false);
  const [formData, setFormData]                 = useState(EMPTY_FORM);
  const [resignData, setResignData]             = useState({ resignation_date:'', reason:'' });

  useEffect(() => { fetchEmployees(); }, []);

  const fetchEmployees = async () => {
    try { const res = await axios.get('/api/employees'); setEmployees(res.data); }
    catch (err) { console.error(err); }
  };

  const filtered = employees.filter(e =>
    `${e.name} ${e.position} ${e.employment_status} ${e.official_email}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => { setEditingEmployee(null); setFormData(EMPTY_FORM); setShowModal(true); };
  const openEditModal = (emp) => { setEditingEmployee(emp); setFormData({ ...EMPTY_FORM, ...emp }); setViewEmployee(null); setShowModal(true); };
  const openResignModal = (emp) => {
    setSelectedEmployee(emp);
    setResignData({ resignation_date: new Date().toISOString().split('T')[0], reason:'' });
    setViewEmployee(null);
    setShowResignModal(true);
  };
  const field = (k, v) => setFormData(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;
    setSaving(true);
    try {
      if (editingEmployee) await axios.put(`/api/employees/${editingEmployee.id}`, formData);
      else                 await axios.post('/api/employees', formData);
      await fetchEmployees(); setShowModal(false);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleResign = async () => {
    setSaving(true);
    try {
      await axios.post(`/api/employees/${selectedEmployee.id}/resign`, resignData);
      await fetchEmployees(); setShowResignModal(false); setSelectedEmployee(null);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    try { await axios.delete(`/api/employees/${deleteTarget.id}`); await fetchEmployees(); setDeleteTarget(null); }
    catch (err) { console.error(err); }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="ed-wrap">

        {/* HEADER */}
        <div className="ed-header">
          <div className="ed-title-group">
            <div className="ed-title-icon">👥</div>
            <div className="ed-title">Active Employees</div>
            <span className="ed-count">{employees.length} records</span>
          </div>
          <button className="ed-add-btn" onClick={openAddModal}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Employee
          </button>
        </div>

        {/* SEARCH */}
        <div className="ed-search-wrap">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input className="ed-search" type="text" placeholder="Search by name, position, status, or email…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="ed-search-clear" onClick={() => setSearch('')}>×</button>}
        </div>
        {search && <div className="ed-result-info">Showing <span>{filtered.length}</span> of {employees.length} employees</div>}

        {/* TABLE */}
        <div className="ed-table-container">
          <table className="ed-table">
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((emp, i) => (
                <tr key={emp.id} style={{ animationDelay:`${i*30}ms` }}>
                  <td>
                    <div className="ed-name-cell">
                      <div className="ed-avatar">{getInitials(emp.name)}</div>
                      <span style={{ fontWeight:600 }}>{safeDisplay(emp.name)}</span>
                    </div>
                  </td>
                  <td style={{ color:'#9a96a0' }}>{safeDisplay(emp.position)}</td>
                  <td><span className={`ed-status-chip ed-status-${emp.employment_status}`}>{safeDisplay(emp.employment_status)}</span></td>
                  <td><span className="ed-muted">{formatDate(emp.date_started)}</span></td>
                  <td><span className="ed-salary">{formatCurrency(emp.salary)}</span></td>
                  <td><span className="ed-muted" style={{ fontFamily:'monospace', fontSize:11 }}>{safeDisplay(emp.sss)}</span></td>
                  <td><span className="ed-muted" style={{ fontFamily:'monospace', fontSize:11 }}>{safeDisplay(emp.philhealth)}</span></td>
                  <td><span className="ed-muted" style={{ fontFamily:'monospace', fontSize:11 }}>{safeDisplay(emp.pagibig)}</span></td>
                  <td><span className="ed-muted" style={{ fontFamily:'monospace', fontSize:11 }}>{safeDisplay(emp.tin)}</span></td>
                  <td><span className="ed-muted">{safeDisplay(emp.cp_viber)}</span></td>
                  <td style={{ fontSize:12, color:'#9a96a0' }}>{safeDisplay(emp.official_email)}</td>
                  <td>
                    <div className="ed-actions">
                      <button className="ed-btn-view" title="View" onClick={() => setViewEmployee(emp)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        View
                      </button>
                      <button className="ed-btn-edit" title="Edit" onClick={() => openEditModal(emp)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit
                      </button>
                      <button className="ed-btn-resign" title="Resign" onClick={() => openResignModal(emp)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Resign
                      </button>
                      <button className="ed-btn-delete" title="Delete" onClick={() => setDeleteTarget(emp)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={12} style={{padding:0}}>
                  <div className="ed-empty">
                    <div className="ed-empty-icon">👥</div>
                    <div className="ed-empty-title">{search ? `No results for "${search}"` : 'No employees yet'}</div>
                    <div className="ed-empty-sub">{search ? 'Try a different keyword' : 'Click "Add Employee" to get started'}</div>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW CARD */}
      {viewEmployee && (
        <div className="ed-overlay" onClick={() => setViewEmployee(null)}>
          <div className="ed-view-card" onClick={e => e.stopPropagation()}>
            <div className="ed-card-top">
              <button className="ed-card-close" onClick={() => setViewEmployee(null)}>×</button>
              <div className="ed-card-avatar-lg">{getInitials(viewEmployee.name)}</div>
              <div className="ed-card-name">{safeDisplay(viewEmployee.name)}</div>
              <div className="ed-card-sub">
                {safeDisplay(viewEmployee.position)}
                <span className={`ed-status-chip ed-status-${viewEmployee.employment_status}`}>{safeDisplay(viewEmployee.employment_status)}</span>
              </div>
            </div>

            <div className="ed-card-section">
              <div className="ed-card-section-title">Employment</div>
              <div className="ed-card-fields">
                {[
                  { label:'Date Started',    val: formatDate(viewEmployee.date_started),    cls:'gold' },
                  { label:'Date Regularized',val: formatDate(viewEmployee.date_regularized) },
                  { label:'Diploma',         val: safeDisplay(viewEmployee.diploma) },
                  { label:'Salary',          val: formatCurrency(viewEmployee.salary), cls:'gold' },
                ].map(f => (
                  <div className="ed-card-field" key={f.label}>
                    <div className="ed-card-field-label">{f.label}</div>
                    <div className={`ed-card-field-val${f.cls ? ` ${f.cls}` : ''}`}>{f.val || '—'}</div>
                  </div>
                ))}
              </div>

              <div className="ed-card-section-title">Government IDs</div>
              <div className="ed-card-fields">
                {[
                  { label:'SSS',      val: safeDisplay(viewEmployee.sss),       cls:'mono' },
                  { label:'PhilHealth',val: safeDisplay(viewEmployee.philhealth),cls:'mono' },
                  { label:'Pag-IBIG', val: safeDisplay(viewEmployee.pagibig),   cls:'mono' },
                  { label:'TIN',      val: safeDisplay(viewEmployee.tin),       cls:'mono' },
                ].map(f => (
                  <div className="ed-card-field" key={f.label}>
                    <div className="ed-card-field-label">{f.label}</div>
                    <div className={`ed-card-field-val${f.cls ? ` ${f.cls}` : ''}`}>{f.val || '—'}</div>
                  </div>
                ))}
              </div>

              <div className="ed-card-section-title">Contact</div>
              <div className="ed-card-fields" style={{ marginBottom:14 }}>
                <div className="ed-card-field">
                  <div className="ed-card-field-label">CP / Viber</div>
                  <div className="ed-card-field-val accent">{safeDisplay(viewEmployee.cp_viber)}</div>
                </div>
                <div className="ed-card-field">
                  <div className="ed-card-field-label">Email</div>
                  <div className="ed-card-field-val" style={{ fontSize:12 }}>{safeDisplay(viewEmployee.official_email)}</div>
                </div>
                <div className="ed-card-field full">
                  <div className="ed-card-field-label">Home Address</div>
                  <div className="ed-card-field-val" style={{ whiteSpace:'normal' }}>{safeDisplay(viewEmployee.home_address)}</div>
                </div>
              </div>
            </div>

            <div className="ed-card-actions">
              <button className="ed-btn-edit" style={{flex:1,justifyContent:'center',padding:'10px'}} onClick={() => openEditModal(viewEmployee)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit
              </button>
              <button className="ed-btn-resign" style={{flex:1,justifyContent:'center',padding:'10px'}} onClick={() => openResignModal(viewEmployee)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Resign
              </button>
              <button className="ed-btn-delete" style={{flex:1,justifyContent:'center',padding:'10px'}} onClick={() => { setViewEmployee(null); setDeleteTarget(viewEmployee); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT FORM */}
      {showModal && (
        <div className="ed-overlay" onClick={() => setShowModal(false)}>
          <div className="ed-form-modal" onClick={e => e.stopPropagation()}>
            <div className="ed-form-head">
              <div className="ed-form-title">{editingEmployee ? '✏️ Edit Employee' : '👤 New Employee'}</div>
              <button className="ed-card-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="ed-form-section">
              <div className="ed-form-section-label">Basic Info</div>
              <div className="ed-form-grid">
                <div>
                  <label className="ed-field-label">Full Name <span className="ed-field-req">*</span></label>
                  <input className="ed-field-input" type="text" placeholder="e.g. Juan dela Cruz" value={formData.name} onChange={e => field('name', e.target.value)} />
                </div>
                <div>
                  <label className="ed-field-label">Position</label>
                  <input className="ed-field-input" type="text" placeholder="e.g. Software Engineer" value={formData.position} onChange={e => field('position', e.target.value)} />
                </div>
                <div>
                  <label className="ed-field-label">Diploma / Degree</label>
                  <input className="ed-field-input" type="text" placeholder="e.g. BS Computer Science" value={formData.diploma} onChange={e => field('diploma', e.target.value)} />
                </div>
                <div>
                  <label className="ed-field-label">Employment Status</label>
                  <select className="ed-field-select" value={formData.employment_status} onChange={e => field('employment_status', e.target.value)}>
                    {['Regular','Probationary','Contractual','Part-time'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="ed-field-label">Date Started</label>
                  <input className="ed-field-input" type="date" value={formData.date_started} onChange={e => field('date_started', e.target.value)} />
                </div>
                <div>
                  <label className="ed-field-label">Date Regularized</label>
                  <input className="ed-field-input" type="date" value={formData.date_regularized} onChange={e => field('date_regularized', e.target.value)} />
                </div>
                <div>
                  <label className="ed-field-label">Salary (₱)</label>
                  <input className="ed-field-input" type="number" placeholder="0.00" value={formData.salary} onChange={e => field('salary', e.target.value)} />
                </div>
              </div>

              <div className="ed-form-section-label">Government IDs</div>
              <div className="ed-form-grid cols3">
                {[
                  { key:'sss',       label:'SSS',       ph:'XX-XXXXXXX-X' },
                  { key:'philhealth',label:'PhilHealth', ph:'XX-XXXXXXXXX-X' },
                  { key:'pagibig',   label:'Pag-IBIG',  ph:'XXXX-XXXX-XXXX' },
                  { key:'tin',       label:'TIN',       ph:'XXX-XXX-XXX' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="ed-field-label">{f.label}</label>
                    <input className="ed-field-input" type="text" placeholder={f.ph} value={formData[f.key]} onChange={e => field(f.key, e.target.value)} />
                  </div>
                ))}
              </div>

              <div className="ed-form-section-label">Contact Info</div>
              <div className="ed-form-grid">
                <div>
                  <label className="ed-field-label">CP / Viber No.</label>
                  <input className="ed-field-input" type="text" placeholder="09XX-XXX-XXXX" value={formData.cp_viber} onChange={e => field('cp_viber', e.target.value)} />
                </div>
                <div>
                  <label className="ed-field-label">Official Email</label>
                  <input className="ed-field-input" type="email" placeholder="email@company.com" value={formData.official_email} onChange={e => field('official_email', e.target.value)} />
                </div>
              </div>
              <div className="ed-form-grid single" style={{ marginBottom:8 }}>
                <div>
                  <label className="ed-field-label">Home Address</label>
                  <input className="ed-field-input" type="text" placeholder="Full home address" value={formData.home_address} onChange={e => field('home_address', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="ed-form-foot">
              <button className="ed-foot-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="ed-foot-save" onClick={handleSubmit} disabled={saving}>{saving ? 'Saving…' : editingEmployee ? 'Save Changes' : 'Add Employee'}</button>
            </div>
          </div>
        </div>
      )}

      {/* RESIGN MODAL */}
      {showResignModal && selectedEmployee && (
        <div className="ed-overlay" onClick={() => setShowResignModal(false)}>
          <div className="ed-resign-modal" onClick={e => e.stopPropagation()}>
            <div className="ed-resign-head">
              <div className="ed-resign-title">📋 Process Resignation</div>
              <button className="ed-card-close" onClick={() => setShowResignModal(false)}>×</button>
            </div>
            <div className="ed-resign-body">
              <div className="ed-resign-who">
                <div className="ed-resign-who-avatar">{getInitials(selectedEmployee.name)}</div>
                <div>
                  <div className="ed-resign-who-name">{safeDisplay(selectedEmployee.name)}</div>
                  <div className="ed-resign-who-pos">{safeDisplay(selectedEmployee.position)}</div>
                </div>
              </div>
              <div style={{ marginBottom:16 }}>
                <label className="ed-field-label">Resignation Date</label>
                <input className="ed-field-input" type="date" value={resignData.resignation_date} onChange={e => setResignData(p => ({ ...p, resignation_date: e.target.value }))} />
              </div>
              <div>
                <label className="ed-field-label">Reason <span style={{ color:'#5a5a6a', fontSize:10 }}>Optional</span></label>
                <input className="ed-field-input" type="text" placeholder="Reason for resignation" value={resignData.reason} onChange={e => setResignData(p => ({ ...p, reason: e.target.value }))} />
              </div>
            </div>
            <div className="ed-resign-foot">
              <button className="ed-foot-cancel" onClick={() => setShowResignModal(false)}>Cancel</button>
              <button className="ed-resign-confirm" onClick={handleResign} disabled={saving}>{saving ? 'Processing…' : 'Confirm Resignation'}</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteTarget && (
        <div className="ed-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="ed-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="ed-confirm-icon">🗑️</div>
            <div className="ed-confirm-title">Delete Employee?</div>
            <div className="ed-confirm-sub">You're about to permanently delete <strong style={{color:'#e8e4dc'}}>{safeDisplay(deleteTarget.name)}</strong>.<br/>This cannot be undone.</div>
            <div className="ed-confirm-btns">
              <button className="ed-confirm-no" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="ed-confirm-del" onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}