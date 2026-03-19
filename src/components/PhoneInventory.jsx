import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  .ph-wrap * { box-sizing: border-box; }
  .ph-wrap { font-family: 'DM Sans', sans-serif; color: #e8e4dc; }
  .ph-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
  .ph-title-group { display:flex; align-items:center; gap:14px; }
  .ph-title-icon { width:40px; height:40px; background:rgba(169,110,200,0.12); border:1px solid rgba(169,110,200,0.25); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; }
  .ph-title { font-family:'DM Serif Display',serif; font-size:24px; color:#e8e4dc; letter-spacing:-0.5px; }
  .ph-count { font-size:11px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:#a96ec8; background:rgba(169,110,200,0.1); border:1px solid rgba(169,110,200,0.2); padding:3px 10px; border-radius:20px; }
  .ph-add-btn { display:flex; align-items:center; gap:7px; padding:10px 20px; background:#a96ec8; color:#0b0d12; border:none; border-radius:9px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; position:relative; overflow:hidden; transition:background 0.2s, box-shadow 0.2s, transform 0.1s; }
  .ph-add-btn::before { content:''; position:absolute; inset:0; background:linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%); transform:translateX(-100%); transition:transform 0.4s; }
  .ph-add-btn:hover::before { transform:translateX(100%); }
  .ph-add-btn:hover { background:#b97ed8; box-shadow:0 4px 16px rgba(169,110,200,0.35); }
  .ph-add-btn:active { transform:scale(0.97); }
  .ph-search-wrap { position:relative; margin-bottom:10px; }
  .ph-search-wrap svg { position:absolute; left:14px; top:50%; transform:translateY(-50%); width:15px; height:15px; stroke:#5a5a6a; fill:none; stroke-width:1.8; pointer-events:none; transition:stroke 0.2s; }
  .ph-search-wrap:focus-within svg { stroke:#a96ec8; }
  .ph-search { width:100%; background:#1c1f28; border:1px solid rgba(255,255,255,0.07); border-radius:10px; padding:12px 44px 12px 42px; font-family:'DM Sans',sans-serif; font-size:14px; color:#e8e4dc; outline:none; transition:border-color 0.2s, box-shadow 0.2s; caret-color:#a96ec8; }
  .ph-search::placeholder { color:#5a5a6a; }
  .ph-search:focus { border-color:rgba(169,110,200,0.4); box-shadow:0 0 0 3px rgba(169,110,200,0.1); }
  .ph-search-clear { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:#2a2d38; border:none; width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#9a96a0; font-size:14px; cursor:pointer; transition:background 0.2s, color 0.2s; }
  .ph-search-clear:hover { background:#3a3d4a; color:#e8e4dc; }
  .ph-result-info { font-size:12px; color:#5a5a6a; margin-bottom:14px; padding-left:2px; }
  .ph-result-info span { color:#a96ec8; font-weight:600; }
  .ph-table-container { background:#161920; border:1px solid rgba(255,255,255,0.07); border-radius:14px; overflow-x:auto; }
  .ph-table { width:100%; border-collapse:collapse; min-width:620px; }
  .ph-table thead tr { background:#1c1f28; border-bottom:1px solid rgba(255,255,255,0.07); }
  .ph-table th { padding:13px 18px; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#5a5a6a; text-align:left; white-space:nowrap; }
  .ph-table tbody tr { border-bottom:1px solid rgba(255,255,255,0.04); transition:background 0.15s; animation:phFadeUp 0.3s ease both; }
  .ph-table tbody tr:last-child { border-bottom:none; }
  .ph-table tbody tr:hover { background:rgba(255,255,255,0.025); }
  .ph-table td { padding:13px 18px; font-size:14px; color:#e8e4dc; vertical-align:middle; }
  .ph-table th:last-child, .ph-table td:last-child { width:160px; }
  @keyframes phFadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .ph-name-cell { display:flex; align-items:center; gap:12px; }
  .ph-avatar { width:34px; height:34px; border-radius:8px; background:rgba(169,110,200,0.12); border:1px solid rgba(169,110,200,0.25); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#a96ec8; flex-shrink:0; }
  .ph-unit-chip { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; background:rgba(169,110,200,0.08); border:1px solid rgba(169,110,200,0.15); border-radius:5px; font-size:12.5px; color:#a96ec8; }
  .ph-serial-chip { font-family:monospace; font-size:12.5px; color:#9a96a0; letter-spacing:0.5px; }
  .ph-number-chip { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; background:rgba(200,169,110,0.08); border:1px solid rgba(200,169,110,0.15); border-radius:5px; font-size:12.5px; color:#c8a96e; }
  .ph-actions { display:flex; gap:5px; align-items:center; flex-wrap:nowrap; }
  .ph-btn-view, .ph-btn-edit, .ph-btn-delete { display:flex; align-items:center; justify-content:center; gap:5px; padding:7px 12px; border-radius:7px; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600; cursor:pointer; border:1px solid; transition:all 0.2s; white-space:nowrap; }
  .ph-btn-view   { background:rgba(169,110,200,0.1); border-color:rgba(169,110,200,0.2); color:#a96ec8; }
  .ph-btn-view:hover   { background:rgba(169,110,200,0.2); border-color:rgba(169,110,200,0.4); }
  .ph-btn-edit   { background:rgba(200,169,110,0.1); border-color:rgba(200,169,110,0.2); color:#c8a96e; }
  .ph-btn-edit:hover   { background:rgba(200,169,110,0.2); border-color:rgba(200,169,110,0.4); }
  .ph-btn-delete { background:rgba(224,90,90,0.1); border-color:rgba(224,90,90,0.2); color:#e05a5a; }
  .ph-btn-delete:hover { background:rgba(224,90,90,0.2); border-color:rgba(224,90,90,0.4); }
  .ph-empty { padding:60px 20px; display:flex; flex-direction:column; align-items:center; gap:12px; text-align:center; }
  .ph-empty-icon { font-size:38px; opacity:0.35; }
  .ph-empty-title { font-size:16px; color:#9a96a0; }
  .ph-empty-sub   { font-size:13px; color:#5a5a6a; }
  .ph-overlay { position:fixed; top:0; left:0; right:0; bottom:0; z-index:9999; background:rgba(5,6,10,0.78); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; padding:20px; animation:phFadeIn 0.2s ease; }
  @keyframes phFadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes phScaleIn { from { opacity:0; transform:scale(0.94) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
  .ph-view-card { background:#161920; border:1px solid rgba(255,255,255,0.08); border-radius:20px; width:100%; max-width:440px; box-shadow:0 40px 100px rgba(0,0,0,0.7); animation:phScaleIn 0.25s cubic-bezier(0.16,1,0.3,1); overflow:hidden; }
  .ph-card-top { padding:28px 28px 22px; background:linear-gradient(135deg, rgba(169,110,200,0.08) 0%, transparent 60%); border-bottom:1px solid rgba(255,255,255,0.06); position:relative; }
  .ph-card-close { position:absolute; top:18px; right:18px; width:30px; height:30px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08); border-radius:7px; display:flex; align-items:center; justify-content:center; color:#9a96a0; font-size:16px; cursor:pointer; transition:background 0.2s, color 0.2s; }
  .ph-card-close:hover { background:rgba(255,255,255,0.1); color:#e8e4dc; }
  .ph-card-avatar-lg { width:56px; height:56px; border-radius:14px; background:rgba(169,110,200,0.15); border:1px solid rgba(169,110,200,0.3); display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:700; color:#a96ec8; margin-bottom:14px; }
  .ph-card-name { font-family:'DM Serif Display',serif; font-size:22px; color:#e8e4dc; margin-bottom:4px; }
  .ph-card-sub  { font-size:13px; color:#a96ec8; font-weight:500; }
  .ph-card-body { padding:18px 28px 4px; }
  .ph-card-field { padding:11px 0; border-bottom:1px solid rgba(255,255,255,0.05); display:flex; flex-direction:column; gap:4px; }
  .ph-card-field:last-child { border-bottom:none; }
  .ph-card-field-label { font-size:10.5px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:#5a5a6a; }
  .ph-card-field-val   { font-size:14px; font-weight:500; color:#e8e4dc; }
  .ph-card-field-val.accent { color:#a96ec8; }
  .ph-card-field-val.gold   { color:#c8a96e; }
  .ph-card-field-val.mono   { font-family:monospace; letter-spacing:0.5px; font-size:13px; color:#9a96a0; }
  .ph-card-actions { padding:16px 28px 24px; display:flex; gap:8px; }
  .ph-form-modal { background:#161920; border:1px solid rgba(255,255,255,0.08); border-radius:20px; width:100%; max-width:440px; box-shadow:0 40px 100px rgba(0,0,0,0.7); animation:phScaleIn 0.25s cubic-bezier(0.16,1,0.3,1); overflow:hidden; }
  .ph-form-head { padding:22px 24px; border-bottom:1px solid rgba(255,255,255,0.07); display:flex; align-items:center; justify-content:space-between; }
  .ph-form-title { font-family:'DM Serif Display',serif; font-size:20px; color:#e8e4dc; display:flex; align-items:center; gap:8px; }
  .ph-form-body  { padding:22px 24px; display:flex; flex-direction:column; gap:16px; }
  .ph-field-label { display:block; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#5a5a6a; margin-bottom:8px; }
  .ph-field-req   { color:#a96ec8; }
  .ph-field-input { width:100%; background:#1c1f28; border:1px solid rgba(255,255,255,0.07); border-radius:9px; padding:11px 14px; font-family:'DM Sans',sans-serif; font-size:14px; color:#e8e4dc; outline:none; transition:border-color 0.2s, box-shadow 0.2s; caret-color:#a96ec8; }
  .ph-field-input::placeholder { color:#5a5a6a; }
  .ph-field-input:focus { border-color:rgba(169,110,200,0.4); box-shadow:0 0 0 3px rgba(169,110,200,0.1); }
  .ph-form-foot { padding:16px 24px; border-top:1px solid rgba(255,255,255,0.07); display:flex; gap:8px; justify-content:flex-end; }
  .ph-foot-save { padding:10px 22px; background:#a96ec8; color:#0b0d12; border:none; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:background 0.2s, box-shadow 0.2s; }
  .ph-foot-save:hover { background:#b97ed8; box-shadow:0 4px 12px rgba(169,110,200,0.3); }
  .ph-foot-save:disabled { opacity:0.6; pointer-events:none; }
  .ph-foot-cancel { padding:10px 18px; background:transparent; border:1px solid rgba(255,255,255,0.08); border-radius:8px; color:#9a96a0; font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; transition:all 0.2s; }
  .ph-foot-cancel:hover { border-color:rgba(255,255,255,0.15); color:#e8e4dc; background:rgba(255,255,255,0.04); }
  .ph-confirm-modal { background:#161920; border:1px solid rgba(224,90,90,0.2); border-radius:16px; width:100%; max-width:360px; padding:28px; box-shadow:0 40px 80px rgba(0,0,0,0.7); animation:phScaleIn 0.2s cubic-bezier(0.16,1,0.3,1); text-align:center; }
  .ph-confirm-icon  { width:52px; height:52px; border-radius:14px; background:rgba(224,90,90,0.12); border:1px solid rgba(224,90,90,0.25); display:flex; align-items:center; justify-content:center; font-size:22px; margin:0 auto 16px; }
  .ph-confirm-title { font-family:'DM Serif Display',serif; font-size:20px; color:#e8e4dc; margin-bottom:8px; }
  .ph-confirm-sub   { font-size:13px; color:#9a96a0; margin-bottom:24px; line-height:1.6; }
  .ph-confirm-btns  { display:flex; gap:8px; }
  .ph-confirm-del { flex:1; padding:11px; background:#e05a5a; color:white; border:none; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:background 0.2s, box-shadow 0.2s; }
  .ph-confirm-del:hover { background:#ea6a6a; box-shadow:0 4px 12px rgba(224,90,90,0.3); }
  .ph-confirm-no  { flex:1; padding:11px; background:transparent; border:1px solid rgba(255,255,255,0.08); border-radius:8px; color:#9a96a0; font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; transition:all 0.2s; }
  .ph-confirm-no:hover { border-color:rgba(255,255,255,0.15); color:#e8e4dc; }
`;

const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';

const EMPTY = { name:'', unit:'', serial_number:'', cellphone_number:'' };

export default function PhoneInventory({ onNotify }) {
  const [phones, setPhones]             = useState([]);
  const [search, setSearch]             = useState('');
  const [showModal, setShowModal]       = useState(false);
  const [editingPhone, setEditingPhone] = useState(null);
  const [viewPhone, setViewPhone]       = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving]             = useState(false);
  const [formData, setFormData]         = useState(EMPTY);

  const notify = (type, msg) => { if (onNotify) onNotify(type, msg); };

  useEffect(() => { fetchPhones(); }, []);

  useEffect(() => {
    const open = !!(viewPhone || showModal || deleteTarget);
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [viewPhone, showModal, deleteTarget]);

  const fetchPhones = async () => {
    try { const res = await axios.get('/api/phones'); setPhones(res.data); }
    catch { notify('error', 'Failed to load phone records'); }
  };

  const filtered = phones.filter(p =>
    `${p.name} ${p.unit} ${p.serial_number} ${p.cellphone_number}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal  = () => { setEditingPhone(null); setFormData(EMPTY); setShowModal(true); };
  const openEditModal = (p)  => { setEditingPhone(p); setFormData({ ...EMPTY, ...p }); setViewPhone(null); setShowModal(true); };
  const field = (k, v) => setFormData(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    if (!formData.name.trim()) return notify('error', 'Name is required');
    setSaving(true);
    try {
      if (editingPhone) { await axios.put(`/api/phones/${editingPhone.id}`, formData); notify('success', 'Phone record updated'); }
      else              { await axios.post('/api/phones', formData); notify('success', 'Phone record added'); }
      await fetchPhones(); setShowModal(false);
    } catch { notify('error', 'Failed to save phone record'); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/phones/${deleteTarget.id}`);
      await fetchPhones(); setDeleteTarget(null);
      notify('success', 'Phone record deleted');
    } catch { notify('error', 'Failed to delete phone record'); }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="ph-wrap">
        <div className="ph-header">
          <div className="ph-title-group">
            <div className="ph-title-icon">📱</div>
            <div className="ph-title">Phone Inventory</div>
            <span className="ph-count">{phones.length} records</span>
          </div>
          <button className="ph-add-btn" onClick={openAddModal}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Phone
          </button>
        </div>
        <div className="ph-search-wrap">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input className="ph-search" type="text" placeholder="Search by name, unit, serial, or number…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="ph-search-clear" onClick={() => setSearch('')}>×</button>}
        </div>
        {search && <div className="ph-result-info">Showing <span>{filtered.length}</span> of {phones.length} records</div>}
        <div className="ph-table-container">
          <table className="ph-table">
            <thead><tr><th>Name</th><th>Unit / Model</th><th>Serial Number</th><th>Cellphone No.</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((phone, i) => (
                <tr key={phone.id} style={{ animationDelay:`${i*35}ms` }}>
                  <td><div className="ph-name-cell"><div className="ph-avatar">{getInitials(phone.name)}</div><span style={{fontWeight:500}}>{phone.name}</span></div></td>
                  <td><span className="ph-unit-chip">📱 {phone.unit}</span></td>
                  <td><span className="ph-serial-chip">{phone.serial_number}</span></td>
                  <td><span className="ph-number-chip">📞 {phone.cellphone_number}</span></td>
                  <td>
                    <div className="ph-actions">
                      <button className="ph-btn-view" onClick={() => setViewPhone(phone)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>View</button>
                      <button className="ph-btn-edit" onClick={() => openEditModal(phone)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</button>
                      <button className="ph-btn-delete" onClick={() => setDeleteTarget(phone)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>Delete</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} style={{padding:0}}><div className="ph-empty"><div className="ph-empty-icon">📱</div><div className="ph-empty-title">{search ? `No results for "${search}"` : 'No phone records yet'}</div><div className="ph-empty-sub">{search ? 'Try a different keyword' : 'Click "Add Phone" to get started'}</div></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {createPortal(
        <>
          {viewPhone && (
            <div className="ph-overlay" onClick={() => setViewPhone(null)}>
              <div className="ph-view-card" onClick={e => e.stopPropagation()}>
                <div className="ph-card-top">
                  <button className="ph-card-close" onClick={() => setViewPhone(null)}>×</button>
                  <div className="ph-card-avatar-lg">{getInitials(viewPhone.name)}</div>
                  <div className="ph-card-name">{viewPhone.name}</div>
                  <div className="ph-card-sub">📱 {viewPhone.unit}</div>
                </div>
                <div className="ph-card-body">
                  {[
                    { label:'Name',             val: viewPhone.name,             cls:'accent' },
                    { label:'Unit / Model',     val: viewPhone.unit },
                    { label:'Serial Number',    val: viewPhone.serial_number,    cls:'mono' },
                    { label:'Cellphone Number', val: viewPhone.cellphone_number, cls:'gold' },
                  ].map(f => (
                    <div className="ph-card-field" key={f.label}>
                      <div className="ph-card-field-label">{f.label}</div>
                      <div className={`ph-card-field-val${f.cls ? ` ${f.cls}` : ''}`}>{f.val || '—'}</div>
                    </div>
                  ))}
                </div>
                <div className="ph-card-actions">
                  <button className="ph-btn-edit" style={{flex:1,justifyContent:'center',padding:'10px'}} onClick={() => openEditModal(viewPhone)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</button>
                  <button className="ph-btn-delete" style={{flex:1,justifyContent:'center',padding:'10px'}} onClick={() => { setViewPhone(null); setDeleteTarget(viewPhone); }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>Delete</button>
                </div>
              </div>
            </div>
          )}
          {showModal && (
            <div className="ph-overlay" onClick={() => setShowModal(false)}>
              <div className="ph-form-modal" onClick={e => e.stopPropagation()}>
                <div className="ph-form-head">
                  <div className="ph-form-title">{editingPhone ? '✏️ Edit Phone' : '📱 New Phone'}</div>
                  <button className="ph-card-close" onClick={() => setShowModal(false)}>×</button>
                </div>
                <div className="ph-form-body">
                  {[
                    { key:'name',             label:'Name',             req:true, ph:'e.g. Juan dela Cruz' },
                    { key:'unit',             label:'Unit / Model',     req:true, ph:'e.g. iPhone 14 Pro' },
                    { key:'serial_number',    label:'Serial Number',    req:true, ph:'e.g. SN123456789' },
                    { key:'cellphone_number', label:'Cellphone Number', req:true, ph:'e.g. 09XX-XXX-XXXX' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="ph-field-label">{f.label} {f.req && <span className="ph-field-req">*</span>}</label>
                      <input className="ph-field-input" type="text" placeholder={f.ph} value={formData[f.key]} onChange={e => field(f.key, e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
                    </div>
                  ))}
                </div>
                <div className="ph-form-foot">
                  <button className="ph-foot-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="ph-foot-save" onClick={handleSubmit} disabled={saving}>{saving ? 'Saving…' : editingPhone ? 'Save Changes' : 'Add Phone'}</button>
                </div>
              </div>
            </div>
          )}
          {deleteTarget && (
            <div className="ph-overlay" onClick={() => setDeleteTarget(null)}>
              <div className="ph-confirm-modal" onClick={e => e.stopPropagation()}>
                <div className="ph-confirm-icon">🗑️</div>
                <div className="ph-confirm-title">Delete Phone Record?</div>
                <div className="ph-confirm-sub">You're about to delete <strong style={{color:'#e8e4dc'}}>{deleteTarget.name}</strong>'s phone record.<br/>This cannot be undone.</div>
                <div className="ph-confirm-btns">
                  <button className="ph-confirm-no" onClick={() => setDeleteTarget(null)}>Cancel</button>
                  <button className="ph-confirm-del" onClick={confirmDelete}>Yes, Delete</button>
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