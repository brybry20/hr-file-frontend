import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  .hw-wrap * { box-sizing: border-box; }
  .hw-wrap { font-family: 'DM Sans', sans-serif; color: #e8e4dc; }
  .hw-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
  .hw-title-group { display:flex; align-items:center; gap:14px; }
  .hw-title-icon { width:40px; height:40px; background:rgba(200,169,110,0.12); border:1px solid rgba(200,169,110,0.25); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; }
  .hw-title { font-family:'DM Serif Display',serif; font-size:24px; color:#e8e4dc; letter-spacing:-0.5px; }
  .hw-count { font-size:11px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:#c8a96e; background:rgba(200,169,110,0.1); border:1px solid rgba(200,169,110,0.2); padding:3px 10px; border-radius:20px; }
  .hw-add-btn { display:flex; align-items:center; gap:7px; padding:10px 20px; background:#c8a96e; color:#0b0d12; border:none; border-radius:9px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; position:relative; overflow:hidden; transition:background 0.2s, box-shadow 0.2s, transform 0.1s; }
  .hw-add-btn::before { content:''; position:absolute; inset:0; background:linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%); transform:translateX(-100%); transition:transform 0.4s; }
  .hw-add-btn:hover::before { transform:translateX(100%); }
  .hw-add-btn:hover { background:#d4b87a; box-shadow:0 4px 16px rgba(200,169,110,0.35); }
  .hw-add-btn:active { transform:scale(0.97); }
  .hw-search-wrap { position:relative; margin-bottom:10px; }
  .hw-search-wrap svg { position:absolute; left:14px; top:50%; transform:translateY(-50%); width:15px; height:15px; stroke:#5a5a6a; fill:none; stroke-width:1.8; pointer-events:none; transition:stroke 0.2s; }
  .hw-search-wrap:focus-within svg { stroke:#c8a96e; }
  .hw-search { width:100%; background:#1c1f28; border:1px solid rgba(255,255,255,0.07); border-radius:10px; padding:12px 44px 12px 42px; font-family:'DM Sans',sans-serif; font-size:14px; color:#e8e4dc; outline:none; transition:border-color 0.2s, box-shadow 0.2s; caret-color:#c8a96e; }
  .hw-search::placeholder { color:#5a5a6a; }
  .hw-search:focus { border-color:rgba(200,169,110,0.4); box-shadow:0 0 0 3px rgba(200,169,110,0.1); }
  .hw-search-clear { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:#2a2d38; border:none; width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#9a96a0; font-size:14px; cursor:pointer; transition:background 0.2s, color 0.2s; }
  .hw-search-clear:hover { background:#3a3d4a; color:#e8e4dc; }
  .hw-result-info { font-size:12px; color:#5a5a6a; margin-bottom:14px; padding-left:2px; }
  .hw-result-info span { color:#c8a96e; font-weight:600; }
  .hw-table-container { background:#161920; border:1px solid rgba(255,255,255,0.07); border-radius:14px; overflow-x:auto; }
  .hw-table { width:100%; border-collapse:collapse; min-width:1100px; }
  .hw-table thead tr { background:#1c1f28; border-bottom:1px solid rgba(255,255,255,0.07); }
  .hw-table th { padding:12px 14px; font-size:10.5px; font-weight:700; letter-spacing:1.3px; text-transform:uppercase; color:#5a5a6a; text-align:left; white-space:nowrap; }
  .hw-table tbody tr { border-bottom:1px solid rgba(255,255,255,0.04); transition:background 0.15s; animation:hwFadeUp 0.3s ease both; }
  .hw-table tbody tr:last-child { border-bottom:none; }
  .hw-table tbody tr:hover { background:rgba(255,255,255,0.025); }
  .hw-table td { padding:12px 14px; font-size:13px; color:#e8e4dc; vertical-align:middle; white-space:nowrap; }
  .hw-table th:last-child { position:sticky; right:0; width:160px; background:#1c1f28 !important; box-shadow:-4px 0 10px rgba(0,0,0,0.5); white-space:nowrap; overflow:visible; z-index:2; }
  .hw-table td:last-child { position:sticky; right:0; width:160px; background:#161920 !important; box-shadow:-4px 0 10px rgba(0,0,0,0.5); white-space:nowrap; overflow:visible; z-index:1; }
  .hw-table tbody tr:hover td:last-child { background:#1e2230 !important; }
  @keyframes hwFadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .hw-type-chip { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; background:rgba(200,169,110,0.08); border:1px solid rgba(200,169,110,0.15); border-radius:5px; font-size:12px; color:#c8a96e; }
  .hw-bool-true  { display:inline-block; padding:2px 8px; background:rgba(90,206,168,0.12); border:1px solid rgba(90,206,168,0.2); border-radius:4px; font-size:11px; font-weight:600; color:#5acea8; }
  .hw-bool-false { display:inline-block; padding:2px 8px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); border-radius:4px; font-size:11px; color:#5a5a6a; }
  .hw-muted { color:#5a5a6a; font-size:12px; }
  .hw-hostname { font-family:monospace; font-size:12.5px; color:#9a96a0; letter-spacing:0.5px; }
  .hw-user-cell { display:flex; align-items:center; gap:8px; }
  .hw-avatar { width:28px; height:28px; border-radius:6px; background:rgba(200,169,110,0.12); border:1px solid rgba(200,169,110,0.2); display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; color:#c8a96e; flex-shrink:0; }
  .hw-actions { display:flex; gap:5px; align-items:center; flex-wrap:nowrap; }
  .hw-btn-view, .hw-btn-edit, .hw-btn-delete { display:flex; align-items:center; justify-content:center; gap:4px; padding:6px 10px; border-radius:7px; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600; cursor:pointer; border:1px solid; transition:all 0.2s; white-space:nowrap; }
  .hw-btn-view   { background:rgba(200,169,110,0.1); border-color:rgba(200,169,110,0.2); color:#c8a96e; }
  .hw-btn-view:hover   { background:rgba(200,169,110,0.2); border-color:rgba(200,169,110,0.4); }
  .hw-btn-edit   { background:rgba(110,181,200,0.1); border-color:rgba(110,181,200,0.2); color:#6eb5c8; }
  .hw-btn-edit:hover   { background:rgba(110,181,200,0.2); border-color:rgba(110,181,200,0.4); }
  .hw-btn-delete { background:rgba(224,90,90,0.1); border-color:rgba(224,90,90,0.2); color:#e05a5a; }
  .hw-btn-delete:hover { background:rgba(224,90,90,0.2); border-color:rgba(224,90,90,0.4); }
  .hw-empty { padding:60px 20px; display:flex; flex-direction:column; align-items:center; gap:12px; text-align:center; }
  .hw-empty-icon { font-size:38px; opacity:0.35; }
  .hw-empty-title { font-size:16px; color:#9a96a0; }
  .hw-empty-sub   { font-size:13px; color:#5a5a6a; }
  .hw-overlay { position:fixed; top:0; left:0; right:0; bottom:0; z-index:9999; background:rgba(5,6,10,0.78); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; padding:20px; animation:hwFadeIn 0.2s ease; }
  @keyframes hwFadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes hwScaleIn { from { opacity:0; transform:scale(0.94) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
  .hw-view-card { background:#161920; border:1px solid rgba(255,255,255,0.08); border-radius:20px; width:100%; max-width:560px; max-height:88vh; overflow-y:auto; box-shadow:0 40px 100px rgba(0,0,0,0.7); animation:hwScaleIn 0.25s cubic-bezier(0.16,1,0.3,1); }
  .hw-view-card::-webkit-scrollbar { width:4px; }
  .hw-view-card::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }
  .hw-card-top { padding:24px 24px 20px; background:linear-gradient(135deg, rgba(200,169,110,0.08) 0%, transparent 60%); border-bottom:1px solid rgba(255,255,255,0.06); position:relative; }
  .hw-card-close { position:absolute; top:16px; right:16px; width:30px; height:30px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08); border-radius:7px; display:flex; align-items:center; justify-content:center; color:#9a96a0; font-size:16px; cursor:pointer; transition:background 0.2s, color 0.2s; }
  .hw-card-close:hover { background:rgba(255,255,255,0.1); color:#e8e4dc; }
  .hw-card-avatar-lg { width:52px; height:52px; border-radius:12px; background:rgba(200,169,110,0.15); border:1px solid rgba(200,169,110,0.3); display:flex; align-items:center; justify-content:center; font-size:22px; margin-bottom:12px; }
  .hw-card-name { font-family:'DM Serif Display',serif; font-size:20px; color:#e8e4dc; margin-bottom:4px; }
  .hw-card-sub  { font-size:13px; color:#c8a96e; font-weight:500; }
  .hw-card-section { padding:16px 24px 0; }
  .hw-card-section-title { font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#5a5a6a; margin-bottom:8px; padding-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.05); }
  .hw-card-fields { display:grid; grid-template-columns:1fr 1fr; gap:0; margin-bottom:16px; }
  .hw-card-field { padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
  .hw-card-field:nth-child(odd)  { padding-right:16px; }
  .hw-card-field:nth-child(even) { padding-left:16px; border-left:1px solid rgba(255,255,255,0.04); }
  .hw-card-field-label { font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#5a5a6a; margin-bottom:3px; }
  .hw-card-field-val   { font-size:13px; font-weight:500; color:#e8e4dc; word-break:break-word; white-space:normal; }
  .hw-card-field-val.accent { color:#c8a96e; }
  .hw-card-field-val.mono   { font-family:monospace; font-size:12px; color:#9a96a0; }
  .hw-card-actions { padding:16px 24px 24px; display:flex; gap:8px; }
  .hw-form-modal { background:#161920; border:1px solid rgba(255,255,255,0.08); border-radius:20px; width:100%; max-width:680px; max-height:90vh; overflow-y:auto; box-shadow:0 40px 100px rgba(0,0,0,0.7); animation:hwScaleIn 0.25s cubic-bezier(0.16,1,0.3,1); }
  .hw-form-modal::-webkit-scrollbar { width:4px; }
  .hw-form-modal::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }
  .hw-form-head { padding:20px 24px; border-bottom:1px solid rgba(255,255,255,0.07); display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; background:#161920; z-index:1; }
  .hw-form-title { font-family:'DM Serif Display',serif; font-size:20px; color:#e8e4dc; display:flex; align-items:center; gap:8px; }
  .hw-form-section { padding:20px 24px 0; }
  .hw-form-section-label { font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#5a5a6a; margin-bottom:14px; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.05); }
  .hw-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:20px; }
  .hw-form-grid.single { grid-template-columns:1fr; }
  .hw-field-label { display:block; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#5a5a6a; margin-bottom:7px; }
  .hw-field-input, .hw-field-select { width:100%; background:#1c1f28; border:1px solid rgba(255,255,255,0.07); border-radius:9px; padding:10px 14px; font-family:'DM Sans',sans-serif; font-size:14px; color:#e8e4dc; outline:none; transition:border-color 0.2s, box-shadow 0.2s; caret-color:#c8a96e; }
  .hw-field-input::placeholder { color:#5a5a6a; }
  .hw-field-input:focus, .hw-field-select:focus { border-color:rgba(200,169,110,0.4); box-shadow:0 0 0 3px rgba(200,169,110,0.1); }
  .hw-field-select { appearance:none; cursor:pointer; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235a5a6a' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:32px; }
  .hw-form-foot { padding:16px 24px; border-top:1px solid rgba(255,255,255,0.07); display:flex; gap:8px; justify-content:flex-end; position:sticky; bottom:0; background:#161920; }
  .hw-foot-save { padding:10px 22px; background:#c8a96e; color:#0b0d12; border:none; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:background 0.2s, box-shadow 0.2s; }
  .hw-foot-save:hover { background:#d4b87a; box-shadow:0 4px 12px rgba(200,169,110,0.3); }
  .hw-foot-save:disabled { opacity:0.6; pointer-events:none; }
  .hw-foot-cancel { padding:10px 18px; background:transparent; border:1px solid rgba(255,255,255,0.08); border-radius:8px; color:#9a96a0; font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; transition:all 0.2s; }
  .hw-foot-cancel:hover { border-color:rgba(255,255,255,0.15); color:#e8e4dc; background:rgba(255,255,255,0.04); }
  .hw-confirm-modal { background:#161920; border:1px solid rgba(224,90,90,0.2); border-radius:16px; width:100%; max-width:360px; padding:28px; box-shadow:0 40px 80px rgba(0,0,0,0.7); animation:hwScaleIn 0.2s cubic-bezier(0.16,1,0.3,1); text-align:center; }
  .hw-confirm-icon  { width:52px; height:52px; border-radius:14px; background:rgba(224,90,90,0.12); border:1px solid rgba(224,90,90,0.25); display:flex; align-items:center; justify-content:center; font-size:22px; margin:0 auto 16px; }
  .hw-confirm-title { font-family:'DM Serif Display',serif; font-size:20px; color:#e8e4dc; margin-bottom:8px; }
  .hw-confirm-sub   { font-size:13px; color:#9a96a0; margin-bottom:24px; line-height:1.6; }
  .hw-confirm-btns  { display:flex; gap:8px; }
  .hw-confirm-del { flex:1; padding:11px; background:#e05a5a; color:white; border:none; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:background 0.2s; }
  .hw-confirm-del:hover { background:#ea6a6a; }
  .hw-confirm-no  { flex:1; padding:11px; background:transparent; border:1px solid rgba(255,255,255,0.08); border-radius:8px; color:#9a96a0; font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; transition:all 0.2s; }
  .hw-confirm-no:hover { border-color:rgba(255,255,255,0.15); color:#e8e4dc; }
`;

const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';

const boolBadge = (val) =>
  val === 'TRUE'
    ? <span className="hw-bool-true">✓ Yes</span>
    : <span className="hw-bool-false">No</span>;

const EMPTY = {
  hardware_type:'', windows_hostname:'', brand:'', serial_number:'',
  windows_version:'', windows_language:'', keyboard_type:'', year_of_purchase:'',
  clarilog_installed:'FALSE', comment:'', computer_at_office:'FALSE',
  location_at_office:'', never_at_office:'FALSE', home_office_plus:'FALSE',
  multiple_users:'FALSE', single_user:'FALSE', user_fullname:''
};

const BOOL_OPTS = ['TRUE','FALSE'];
const HW_TYPES  = ['Laptop','Desktop','Tablet','Monitor'];

export default function HardwareInventory({ onNotify }) {
  const [hardware, setHardware]           = useState([]);
  const [search, setSearch]               = useState('');
  const [showModal, setShowModal]         = useState(false);
  const [editingHardware, setEditingHardware] = useState(null);
  const [viewItem, setViewItem]           = useState(null);
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [saving, setSaving]               = useState(false);
  const [formData, setFormData]           = useState(EMPTY);

  const notify = (type, msg) => { if (onNotify) onNotify(type, msg); };

  useEffect(() => {
    const open = !!(viewItem || showModal || deleteTarget);
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [viewItem, showModal, deleteTarget]);

  useEffect(() => { fetchHardware(); }, []);

  const fetchHardware = async () => {
    try { const res = await axios.get('/api/hardware'); setHardware(res.data); }
    catch { notify('error', 'Failed to load hardware records'); }
  };

  const filtered = hardware.filter(h =>
    `${h.hardware_type} ${h.brand} ${h.windows_hostname} ${h.serial_number} ${h.user_fullname}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal  = () => { setEditingHardware(null); setFormData(EMPTY); setShowModal(true); };
  const openEditModal = (item) => { setEditingHardware(item); setFormData({ ...EMPTY, ...item }); setViewItem(null); setShowModal(true); };
  const field = (k, v) => setFormData(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!formData.hardware_type) return notify('error', 'Hardware type is required');
    setSaving(true);
    try {
      if (editingHardware) { await axios.put(`/api/hardware/${editingHardware.id}`, formData); notify('success', 'Hardware record updated'); }
      else                 { await axios.post('/api/hardware', formData); notify('success', 'Hardware record added'); }
      await fetchHardware(); setShowModal(false);
    } catch { notify('error', 'Failed to save hardware record'); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/hardware/${deleteTarget.id}`);
      await fetchHardware(); setDeleteTarget(null);
      notify('success', 'Hardware record deleted');
    } catch { notify('error', 'Failed to delete hardware record'); }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="hw-wrap">
        <div className="hw-header">
          <div className="hw-title-group">
            <div className="hw-title-icon">💻</div>
            <div className="hw-title">Hardware Inventory</div>
            <span className="hw-count">{hardware.length} records</span>
          </div>
          <button className="hw-add-btn" onClick={openAddModal}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Hardware
          </button>
        </div>
        <div className="hw-search-wrap">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input className="hw-search" type="text" placeholder="Search by type, brand, hostname, serial, or user…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="hw-search-clear" onClick={() => setSearch('')}>×</button>}
        </div>
        {search && <div className="hw-result-info">Showing <span>{filtered.length}</span> of {hardware.length} records</div>}
        <div className="hw-table-container">
          <table className="hw-table">
            <thead>
              <tr>
                <th>Type</th><th>Brand</th><th>Hostname</th><th>Serial No.</th>
                <th>Win Version</th><th>User</th><th>Year</th><th>At Office</th><th>Clarilog</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((item, i) => (
                <tr key={item.id} style={{ animationDelay:`${i*30}ms` }}>
                  <td><span className="hw-type-chip">💻 {item.hardware_type}</span></td>
                  <td style={{fontWeight:500}}>{item.brand}</td>
                  <td><span className="hw-hostname">{item.windows_hostname || <span className="hw-muted">—</span>}</span></td>
                  <td><span className="hw-hostname">{item.serial_number || <span className="hw-muted">—</span>}</span></td>
                  <td><span style={{fontSize:12,color:'#9a96a0'}}>{item.windows_version || <span className="hw-muted">—</span>}</span></td>
                  <td>{item.user_fullname ? <div className="hw-user-cell"><div className="hw-avatar">{getInitials(item.user_fullname)}</div><span style={{fontSize:12}}>{item.user_fullname}</span></div> : <span className="hw-muted">—</span>}</td>
                  <td><span style={{color:'#9a96a0',fontSize:12}}>{item.year_of_purchase || '—'}</span></td>
                  <td>{boolBadge(item.computer_at_office)}</td>
                  <td>{boolBadge(item.clarilog_installed)}</td>
                  <td>
                    <div className="hw-actions">
                      <button className="hw-btn-view" onClick={() => setViewItem(item)}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>View</button>
                      <button className="hw-btn-edit" onClick={() => openEditModal(item)}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</button>
                      <button className="hw-btn-delete" onClick={() => setDeleteTarget(item)}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>Delete</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={10} style={{padding:0}}><div className="hw-empty"><div className="hw-empty-icon">💻</div><div className="hw-empty-title">{search ? `No results for "${search}"` : 'No hardware records yet'}</div><div className="hw-empty-sub">{search ? 'Try a different keyword' : 'Click "Add Hardware" to get started'}</div></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {createPortal(
        <>
          {viewItem && (
            <div className="hw-overlay" onClick={() => setViewItem(null)}>
              <div className="hw-view-card" onClick={e => e.stopPropagation()}>
                <div className="hw-card-top">
                  <button className="hw-card-close" onClick={() => setViewItem(null)}>×</button>
                  <div className="hw-card-avatar-lg">💻</div>
                  <div className="hw-card-name">{viewItem.hardware_type} — {viewItem.brand}</div>
                  <div className="hw-card-sub">{viewItem.user_fullname || 'No assigned user'}</div>
                </div>
                <div className="hw-card-section">
                  <div className="hw-card-section-title">Device Info</div>
                  <div className="hw-card-fields">
                    {[
                      { label:'Type', val: viewItem.hardware_type, cls:'accent' },
                      { label:'Brand', val: viewItem.brand },
                      { label:'Hostname', val: viewItem.windows_hostname, cls:'mono' },
                      { label:'Serial No.', val: viewItem.serial_number, cls:'mono' },
                      { label:'Win Version', val: viewItem.windows_version },
                      { label:'Win Language', val: viewItem.windows_language },
                      { label:'Keyboard', val: viewItem.keyboard_type },
                      { label:'Year', val: viewItem.year_of_purchase },
                    ].map(f => (
                      <div className="hw-card-field" key={f.label}>
                        <div className="hw-card-field-label">{f.label}</div>
                        <div className={`hw-card-field-val${f.cls ? ` ${f.cls}` : ''}`}>{f.val || '—'}</div>
                      </div>
                    ))}
                  </div>
                  <div className="hw-card-section-title">Location & Usage</div>
                  <div className="hw-card-fields">
                    {[
                      { label:'At Office', val: viewItem.computer_at_office },
                      { label:'Clarilog', val: viewItem.clarilog_installed },
                      { label:'Never at Office', val: viewItem.never_at_office },
                      { label:'Home+Office', val: viewItem.home_office_plus },
                      { label:'Multiple Users', val: viewItem.multiple_users },
                      { label:'Single User', val: viewItem.single_user },
                    ].map(f => (
                      <div className="hw-card-field" key={f.label}>
                        <div className="hw-card-field-label">{f.label}</div>
                        <div className="hw-card-field-val">{boolBadge(f.val)}</div>
                      </div>
                    ))}
                  </div>
                  {(viewItem.user_fullname || viewItem.location_at_office || viewItem.comment) && (
                    <>
                      <div className="hw-card-section-title">Additional</div>
                      <div className="hw-card-fields" style={{marginBottom:20}}>
                        {viewItem.user_fullname && <div className="hw-card-field"><div className="hw-card-field-label">Assigned User</div><div className="hw-card-field-val accent">{viewItem.user_fullname}</div></div>}
                        {viewItem.location_at_office && <div className="hw-card-field"><div className="hw-card-field-label">Location at Office</div><div className="hw-card-field-val">{viewItem.location_at_office}</div></div>}
                        {viewItem.comment && <div className="hw-card-field" style={{gridColumn:'span 2'}}><div className="hw-card-field-label">Comment</div><div className="hw-card-field-val" style={{whiteSpace:'normal'}}>{viewItem.comment}</div></div>}
                      </div>
                    </>
                  )}
                </div>
                <div className="hw-card-actions">
                  <button className="hw-btn-edit" style={{flex:1,justifyContent:'center',padding:'10px'}} onClick={() => openEditModal(viewItem)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</button>
                  <button className="hw-btn-delete" style={{flex:1,justifyContent:'center',padding:'10px'}} onClick={() => { setViewItem(null); setDeleteTarget(viewItem); }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>Delete</button>
                </div>
              </div>
            </div>
          )}

          {showModal && (
            <div className="hw-overlay" onClick={() => setShowModal(false)}>
              <div className="hw-form-modal" onClick={e => e.stopPropagation()}>
                <div className="hw-form-head">
                  <div className="hw-form-title">{editingHardware ? '✏️ Edit Hardware' : '💻 New Hardware'}</div>
                  <button className="hw-card-close" onClick={() => setShowModal(false)}>×</button>
                </div>
                <div className="hw-form-section">
                  <div className="hw-form-section-label">Device Info</div>
                  <div className="hw-form-grid">
                    <div><label className="hw-field-label">Hardware Type *</label><select className="hw-field-select" value={formData.hardware_type} onChange={e => field('hardware_type', e.target.value)}><option value="">Select type</option>{HW_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                    <div><label className="hw-field-label">Brand</label><input className="hw-field-input" type="text" placeholder="e.g. Dell, Lenovo" value={formData.brand} onChange={e => field('brand', e.target.value)} /></div>
                    <div><label className="hw-field-label">Windows Hostname</label><input className="hw-field-input" type="text" placeholder="e.g. PC-JUAN01" value={formData.windows_hostname} onChange={e => field('windows_hostname', e.target.value)} /></div>
                    <div><label className="hw-field-label">Serial Number</label><input className="hw-field-input" type="text" placeholder="Serial / Dell Service Tag" value={formData.serial_number} onChange={e => field('serial_number', e.target.value)} /></div>
                    <div><label className="hw-field-label">Windows Version</label><input className="hw-field-input" type="text" placeholder="e.g. Windows 11 Pro" value={formData.windows_version} onChange={e => field('windows_version', e.target.value)} /></div>
                    <div><label className="hw-field-label">Windows Language</label><input className="hw-field-input" type="text" placeholder="e.g. English" value={formData.windows_language} onChange={e => field('windows_language', e.target.value)} /></div>
                    <div><label className="hw-field-label">Keyboard Type</label><input className="hw-field-input" type="text" placeholder="e.g. US Layout" value={formData.keyboard_type} onChange={e => field('keyboard_type', e.target.value)} /></div>
                    <div><label className="hw-field-label">Year of Purchase</label><input className="hw-field-input" type="text" placeholder="e.g. 2022" value={formData.year_of_purchase} onChange={e => field('year_of_purchase', e.target.value)} /></div>
                  </div>
                  <div className="hw-form-section-label">Location & Usage</div>
                  <div className="hw-form-grid">
                    {[
                      { key:'clarilog_installed', label:'Clarilog Installed' },
                      { key:'computer_at_office', label:'Computer at Office' },
                      { key:'never_at_office',    label:'Never at Office' },
                      { key:'home_office_plus',   label:'Home Office + Office' },
                      { key:'multiple_users',     label:'Multiple Users' },
                      { key:'single_user',        label:'Single User' },
                    ].map(f => (
                      <div key={f.key}><label className="hw-field-label">{f.label}</label><select className="hw-field-select" value={formData[f.key]} onChange={e => field(f.key, e.target.value)}>{BOOL_OPTS.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
                    ))}
                    <div><label className="hw-field-label">Location at Office</label><input className="hw-field-input" type="text" placeholder="e.g. IT Room, Floor 2" value={formData.location_at_office} onChange={e => field('location_at_office', e.target.value)} /></div>
                    <div><label className="hw-field-label">Assigned User</label><input className="hw-field-input" type="text" placeholder="e.g. Juan DELA CRUZ" value={formData.user_fullname} onChange={e => field('user_fullname', e.target.value)} /></div>
                  </div>
                  <div className="hw-form-section-label">Notes</div>
                  <div className="hw-form-grid single" style={{marginBottom:8}}>
                    <div><label className="hw-field-label">Comment</label><input className="hw-field-input" type="text" placeholder="Optional notes" value={formData.comment} onChange={e => field('comment', e.target.value)} /></div>
                  </div>
                </div>
                <div className="hw-form-foot">
                  <button className="hw-foot-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="hw-foot-save" onClick={handleSubmit} disabled={saving}>{saving ? 'Saving…' : editingHardware ? 'Save Changes' : 'Add Hardware'}</button>
                </div>
              </div>
            </div>
          )}

          {deleteTarget && (
            <div className="hw-overlay" onClick={() => setDeleteTarget(null)}>
              <div className="hw-confirm-modal" onClick={e => e.stopPropagation()}>
                <div className="hw-confirm-icon">🗑️</div>
                <div className="hw-confirm-title">Delete Hardware?</div>
                <div className="hw-confirm-sub">You're about to delete <strong style={{color:'#e8e4dc'}}>{deleteTarget.hardware_type} — {deleteTarget.brand}</strong>.<br/>This cannot be undone.</div>
                <div className="hw-confirm-btns">
                  <button className="hw-confirm-no" onClick={() => setDeleteTarget(null)}>Cancel</button>
                  <button className="hw-confirm-del" onClick={confirmDelete}>Yes, Delete</button>
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