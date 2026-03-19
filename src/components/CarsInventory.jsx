import React, { useState, useEffect } from 'react';
import axios from 'axios';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .ca-wrap * { box-sizing: border-box; }
  .ca-wrap { font-family: 'DM Sans', sans-serif; color: #e8e4dc; }

  /* HEADER */
  .ca-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
  .ca-title-group { display:flex; align-items:center; gap:14px; }
  .ca-title-icon {
    width:40px; height:40px;
    background:rgba(200,112,110,0.12); border:1px solid rgba(200,112,110,0.25);
    border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px;
  }
  .ca-title { font-family:'DM Serif Display',serif; font-size:24px; color:#e8e4dc; letter-spacing:-0.5px; }
  .ca-count {
    font-size:11px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase;
    color:#c8706e; background:rgba(200,112,110,0.1); border:1px solid rgba(200,112,110,0.2);
    padding:3px 10px; border-radius:20px;
  }
  .ca-add-btn {
    display:flex; align-items:center; gap:7px; padding:10px 20px;
    background:#c8706e; color:#0b0d12; border:none; border-radius:9px;
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700;
    cursor:pointer; position:relative; overflow:hidden;
    transition:background 0.2s, box-shadow 0.2s, transform 0.1s;
  }
  .ca-add-btn::before {
    content:''; position:absolute; inset:0;
    background:linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%);
    transform:translateX(-100%); transition:transform 0.4s;
  }
  .ca-add-btn:hover::before { transform:translateX(100%); }
  .ca-add-btn:hover { background:#d4807e; box-shadow:0 4px 16px rgba(200,112,110,0.35); }
  .ca-add-btn:active { transform:scale(0.97); }

  /* SEARCH */
  .ca-search-wrap { position:relative; margin-bottom:10px; }
  .ca-search-wrap svg { position:absolute; left:14px; top:50%; transform:translateY(-50%); width:15px; height:15px; stroke:#5a5a6a; fill:none; stroke-width:1.8; pointer-events:none; transition:stroke 0.2s; }
  .ca-search-wrap:focus-within svg { stroke:#c8706e; }
  .ca-search {
    width:100%; background:#1c1f28; border:1px solid rgba(255,255,255,0.07);
    border-radius:10px; padding:12px 44px 12px 42px;
    font-family:'DM Sans',sans-serif; font-size:14px; color:#e8e4dc;
    outline:none; transition:border-color 0.2s, box-shadow 0.2s; caret-color:#c8706e;
  }
  .ca-search::placeholder { color:#5a5a6a; }
  .ca-search:focus { border-color:rgba(200,112,110,0.4); box-shadow:0 0 0 3px rgba(200,112,110,0.1); }
  .ca-search-clear {
    position:absolute; right:12px; top:50%; transform:translateY(-50%);
    background:#2a2d38; border:none; width:22px; height:22px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    color:#9a96a0; font-size:14px; cursor:pointer; transition:background 0.2s, color 0.2s;
  }
  .ca-search-clear:hover { background:#3a3d4a; color:#e8e4dc; }
  .ca-result-info { font-size:12px; color:#5a5a6a; margin-bottom:14px; padding-left:2px; }
  .ca-result-info span { color:#c8706e; font-weight:600; }

  /* TABLE */
  .ca-table-container { background:#161920; border:1px solid rgba(255,255,255,0.07); border-radius:14px; overflow-x:auto; }
  .ca-table { width:100%; border-collapse:collapse; min-width:820px; }
  .ca-table thead tr { background:#1c1f28; border-bottom:1px solid rgba(255,255,255,0.07); }
  .ca-table th { padding:13px 16px; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#5a5a6a; text-align:left; white-space:nowrap; }
  .ca-table tbody tr { border-bottom:1px solid rgba(255,255,255,0.04); transition:background 0.15s; animation:caFadeUp 0.3s ease both; }
  .ca-table tbody tr:last-child { border-bottom:none; }
  .ca-table tbody tr:hover { background:rgba(255,255,255,0.025); }
  .ca-table td { padding:13px 16px; font-size:14px; color:#e8e4dc; vertical-align:middle; }
  .ca-table th:last-child, .ca-table td:last-child { width:160px; }

  @keyframes caFadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

  /* name cell */
  .ca-name-cell { display:flex; align-items:center; gap:12px; }
  .ca-avatar {
    width:34px; height:34px; border-radius:8px;
    background:rgba(200,112,110,0.12); border:1px solid rgba(200,112,110,0.25);
    display:flex; align-items:center; justify-content:center;
    font-size:12px; font-weight:700; color:#c8706e; flex-shrink:0;
  }
  .ca-car-chip {
    display:inline-flex; align-items:center; gap:5px; padding:3px 10px;
    background:rgba(200,112,110,0.08); border:1px solid rgba(200,112,110,0.15);
    border-radius:5px; font-size:12.5px; color:#c8706e;
  }
  .ca-plate-chip {
    display:inline-block; padding:3px 10px;
    background:rgba(200,169,110,0.08); border:1px solid rgba(200,169,110,0.2);
    border-radius:5px; font-size:12.5px; color:#c8a96e;
    font-family:monospace; letter-spacing:1px;
  }
  .ca-muted { color:#5a5a6a; font-size:13px; }

  /* actions */
  .ca-actions { display:flex; gap:5px; align-items:center; flex-wrap:nowrap; }
  .ca-btn-view, .ca-btn-edit, .ca-btn-delete {
    display:flex; align-items:center; justify-content:center; gap:5px;
    padding:7px 12px; border-radius:7px;
    font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600;
    cursor:pointer; border:1px solid; transition:all 0.2s; white-space:nowrap;
  }
  .ca-btn-view   { background:rgba(200,112,110,0.1); border-color:rgba(200,112,110,0.2); color:#c8706e; }
  .ca-btn-view:hover { background:rgba(200,112,110,0.2); border-color:rgba(200,112,110,0.4); }
  .ca-btn-edit   { background:rgba(200,169,110,0.1); border-color:rgba(200,169,110,0.2); color:#c8a96e; }
  .ca-btn-edit:hover { background:rgba(200,169,110,0.2); border-color:rgba(200,169,110,0.4); }
  .ca-btn-delete { background:rgba(224,90,90,0.1); border-color:rgba(224,90,90,0.2); color:#e05a5a; }
  .ca-btn-delete:hover { background:rgba(224,90,90,0.2); border-color:rgba(224,90,90,0.4); }

  /* empty */
  .ca-empty { padding:60px 20px; display:flex; flex-direction:column; align-items:center; gap:12px; text-align:center; }
  .ca-empty-icon { font-size:38px; opacity:0.35; }
  .ca-empty-title { font-size:16px; color:#9a96a0; }
  .ca-empty-sub   { font-size:13px; color:#5a5a6a; }

  /* OVERLAY */
  .ca-overlay {
    position:fixed; inset:0; z-index:300;
    background:rgba(5,6,10,0.78); backdrop-filter:blur(8px);
    display:flex; align-items:center; justify-content:center;
    padding:20px; animation:caFadeIn 0.2s ease;
  }
  @keyframes caFadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes caScaleIn { from { opacity:0; transform:scale(0.94) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }

  /* VIEW CARD */
  .ca-view-card {
    background:#161920; border:1px solid rgba(255,255,255,0.08);
    border-radius:20px; width:100%; max-width:480px;
    box-shadow:0 40px 100px rgba(0,0,0,0.7);
    animation:caScaleIn 0.25s cubic-bezier(0.16,1,0.3,1); overflow:hidden;
  }
  .ca-card-top {
    padding:28px 28px 22px;
    background:linear-gradient(135deg, rgba(200,112,110,0.08) 0%, transparent 60%);
    border-bottom:1px solid rgba(255,255,255,0.06); position:relative;
  }
  .ca-card-close {
    position:absolute; top:18px; right:18px; width:30px; height:30px;
    background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08);
    border-radius:7px; display:flex; align-items:center; justify-content:center;
    color:#9a96a0; font-size:16px; cursor:pointer; transition:background 0.2s, color 0.2s;
  }
  .ca-card-close:hover { background:rgba(255,255,255,0.1); color:#e8e4dc; }
  .ca-card-avatar-lg {
    width:56px; height:56px; border-radius:14px;
    background:rgba(200,112,110,0.15); border:1px solid rgba(200,112,110,0.3);
    display:flex; align-items:center; justify-content:center;
    font-size:24px; margin-bottom:14px;
  }
  .ca-card-name { font-family:'DM Serif Display',serif; font-size:22px; color:#e8e4dc; margin-bottom:4px; }
  .ca-card-sub  { font-size:13px; color:#c8706e; font-weight:500; }
  .ca-card-body { padding:18px 28px 4px; }
  .ca-card-field { padding:11px 0; border-bottom:1px solid rgba(255,255,255,0.05); display:flex; flex-direction:column; gap:4px; }
  .ca-card-field:last-child { border-bottom:none; }
  .ca-card-field-label { font-size:10.5px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:#5a5a6a; }
  .ca-card-field-val { font-size:14px; font-weight:500; color:#e8e4dc; }
  .ca-card-field-val.accent { color:#c8706e; }
  .ca-card-field-val.gold   { color:#c8a96e; font-family:monospace; letter-spacing:1px; }
  .ca-card-field-val.mono   { font-family:monospace; letter-spacing:0.5px; font-size:13px; color:#9a96a0; }
  .ca-card-actions { padding:16px 28px 24px; display:flex; gap:8px; }

  /* FORM MODAL */
  .ca-form-modal {
    background:#161920; border:1px solid rgba(255,255,255,0.08);
    border-radius:20px; width:100%; max-width:560px;
    max-height:90vh; overflow-y:auto;
    box-shadow:0 40px 100px rgba(0,0,0,0.7);
    animation:caScaleIn 0.25s cubic-bezier(0.16,1,0.3,1);
  }
  .ca-form-modal::-webkit-scrollbar { width:4px; }
  .ca-form-modal::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }
  .ca-form-head {
    padding:22px 24px; border-bottom:1px solid rgba(255,255,255,0.07);
    display:flex; align-items:center; justify-content:space-between;
    position:sticky; top:0; background:#161920; z-index:1;
  }
  .ca-form-title { font-family:'DM Serif Display',serif; font-size:20px; color:#e8e4dc; display:flex; align-items:center; gap:8px; }
  .ca-form-body  { padding:22px 24px; display:flex; flex-direction:column; gap:16px; }
  .ca-form-row   { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .ca-field-group {}
  .ca-field-label { display:block; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#5a5a6a; margin-bottom:8px; }
  .ca-field-opt   { color:#3a3d4a; font-size:10px; }
  .ca-field-input, .ca-field-select {
    width:100%; background:#1c1f28; border:1px solid rgba(255,255,255,0.07); border-radius:9px;
    padding:11px 14px; font-family:'DM Sans',sans-serif; font-size:14px; color:#e8e4dc;
    outline:none; transition:border-color 0.2s, box-shadow 0.2s; caret-color:#c8706e;
  }
  .ca-field-input::placeholder { color:#5a5a6a; }
  .ca-field-input:focus, .ca-field-select:focus { border-color:rgba(200,112,110,0.4); box-shadow:0 0 0 3px rgba(200,112,110,0.1); }
  .ca-field-select { appearance:none; cursor:pointer; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235a5a6a' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; padding-right:36px; }
  .ca-form-foot {
    padding:16px 24px; border-top:1px solid rgba(255,255,255,0.07);
    display:flex; gap:8px; justify-content:flex-end;
    position:sticky; bottom:0; background:#161920;
  }
  .ca-foot-save {
    padding:10px 22px; background:#c8706e; color:#0b0d12; border:none; border-radius:8px;
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700;
    cursor:pointer; transition:background 0.2s, box-shadow 0.2s;
  }
  .ca-foot-save:hover { background:#d4807e; box-shadow:0 4px 12px rgba(200,112,110,0.3); }
  .ca-foot-save:disabled { opacity:0.6; pointer-events:none; }
  .ca-foot-cancel {
    padding:10px 18px; background:transparent; border:1px solid rgba(255,255,255,0.08);
    border-radius:8px; color:#9a96a0;
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
    cursor:pointer; transition:all 0.2s;
  }
  .ca-foot-cancel:hover { border-color:rgba(255,255,255,0.15); color:#e8e4dc; background:rgba(255,255,255,0.04); }

  /* CONFIRM */
  .ca-confirm-modal {
    background:#161920; border:1px solid rgba(224,90,90,0.2);
    border-radius:16px; width:100%; max-width:360px; padding:28px;
    box-shadow:0 40px 80px rgba(0,0,0,0.7);
    animation:caScaleIn 0.2s cubic-bezier(0.16,1,0.3,1); text-align:center;
  }
  .ca-confirm-icon { width:52px; height:52px; border-radius:14px; background:rgba(224,90,90,0.12); border:1px solid rgba(224,90,90,0.25); display:flex; align-items:center; justify-content:center; font-size:22px; margin:0 auto 16px; }
  .ca-confirm-title { font-family:'DM Serif Display',serif; font-size:20px; color:#e8e4dc; margin-bottom:8px; }
  .ca-confirm-sub   { font-size:13px; color:#9a96a0; margin-bottom:24px; line-height:1.6; }
  .ca-confirm-btns  { display:flex; gap:8px; }
  .ca-confirm-del { flex:1; padding:11px; background:#e05a5a; color:white; border:none; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:background 0.2s, box-shadow 0.2s; }
  .ca-confirm-del:hover { background:#ea6a6a; box-shadow:0 4px 12px rgba(224,90,90,0.3); }
  .ca-confirm-no  { flex:1; padding:11px; background:transparent; border:1px solid rgba(255,255,255,0.08); border-radius:8px; color:#9a96a0; font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; transition:all 0.2s; }
  .ca-confirm-no:hover { border-color:rgba(255,255,255,0.15); color:#e8e4dc; }
`;

const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';

const EMPTY = { assigned_to:'', type_of_car:'', plate_number:'', autosweep_acct:'', card_no:'', easytrip_acct:'' };

export default function CarsInventory() {
  const [cars, setCars]               = useState([]);
  const [search, setSearch]           = useState('');
  const [showModal, setShowModal]     = useState(false);
  const [editingCar, setEditingCar]   = useState(null);
  const [viewCar, setViewCar]         = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving]           = useState(false);
  const [formData, setFormData]       = useState(EMPTY);

  useEffect(() => { fetchCars(); }, []);

  const fetchCars = async () => {
    try { const res = await axios.get('/api/cars'); setCars(res.data); }
    catch (err) { console.error(err); }
  };

  const filtered = cars.filter(c =>
    `${c.assigned_to} ${c.type_of_car} ${c.plate_number}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => { setEditingCar(null); setFormData(EMPTY); setShowModal(true); };
  const openEditModal = (car) => { setEditingCar(car); setFormData({ ...EMPTY, ...car }); setViewCar(null); setShowModal(true); };
  const field = (k, v) => setFormData(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!formData.assigned_to.trim()) return;
    setSaving(true);
    try {
      if (editingCar) await axios.put(`/api/cars/${editingCar.id}`, formData);
      else            await axios.post('/api/cars', formData);
      await fetchCars(); setShowModal(false);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    try { await axios.delete(`/api/cars/${deleteTarget.id}`); await fetchCars(); setDeleteTarget(null); }
    catch (err) { console.error(err); }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="ca-wrap">

        {/* HEADER */}
        <div className="ca-header">
          <div className="ca-title-group">
            <div className="ca-title-icon">🚗</div>
            <div className="ca-title">Cars Inventory</div>
            <span className="ca-count">{cars.length} records</span>
          </div>
          <button className="ca-add-btn" onClick={openAddModal}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Car
          </button>
        </div>

        {/* SEARCH */}
        <div className="ca-search-wrap">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input className="ca-search" type="text" placeholder="Search by name, car type, or plate number…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="ca-search-clear" onClick={() => setSearch('')}>×</button>}
        </div>
        {search && <div className="ca-result-info">Showing <span>{filtered.length}</span> of {cars.length} records</div>}

        {/* TABLE */}
        <div className="ca-table-container">
          <table className="ca-table">
            <thead>
              <tr>
                <th>Assigned To</th>
                <th>Type of Car</th>
                <th>Plate No.</th>
                <th>Autosweep</th>
                <th>Card No.</th>
                <th>Easytrip</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((car, i) => (
                <tr key={car.id} style={{ animationDelay:`${i*35}ms` }}>
                  <td>
                    <div className="ca-name-cell">
                      <div className="ca-avatar">{getInitials(car.assigned_to)}</div>
                      <span style={{ fontWeight:500 }}>{car.assigned_to}</span>
                    </div>
                  </td>
                  <td><span className="ca-car-chip">🚗 {car.type_of_car}</span></td>
                  <td><span className="ca-plate-chip">{car.plate_number}</span></td>
                  <td><span className={car.autosweep_acct ? '' : 'ca-muted'}>{car.autosweep_acct || '—'}</span></td>
                  <td><span className={car.card_no ? '' : 'ca-muted'}>{car.card_no || '—'}</span></td>
                  <td><span className={car.easytrip_acct ? '' : 'ca-muted'}>{car.easytrip_acct || '—'}</span></td>
                  <td>
                    <div className="ca-actions">
                      <button className="ca-btn-view" title="View" onClick={() => setViewCar(car)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        View
                      </button>
                      <button className="ca-btn-edit" title="Edit" onClick={() => openEditModal(car)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit
                      </button>
                      <button className="ca-btn-delete" title="Delete" onClick={() => setDeleteTarget(car)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} style={{padding:0}}>
                  <div className="ca-empty">
                    <div className="ca-empty-icon">🚗</div>
                    <div className="ca-empty-title">{search ? `No results for "${search}"` : 'No car records yet'}</div>
                    <div className="ca-empty-sub">{search ? 'Try a different keyword' : 'Click "Add Car" to get started'}</div>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW CARD */}
      {viewCar && (
        <div className="ca-overlay" onClick={() => setViewCar(null)}>
          <div className="ca-view-card" onClick={e => e.stopPropagation()}>
            <div className="ca-card-top">
              <button className="ca-card-close" onClick={() => setViewCar(null)}>×</button>
              <div className="ca-card-avatar-lg">🚗</div>
              <div className="ca-card-name">{viewCar.assigned_to}</div>
              <div className="ca-card-sub">{viewCar.type_of_car}</div>
            </div>
            <div className="ca-card-body">
              {[
                { label:'Assigned To',    val: viewCar.assigned_to,    cls:'accent' },
                { label:'Type of Car',    val: viewCar.type_of_car },
                { label:'Plate Number',   val: viewCar.plate_number,   cls:'gold' },
                { label:'Autosweep Acct', val: viewCar.autosweep_acct || '—', cls:'mono' },
                { label:'Card No.',       val: viewCar.card_no || '—',        cls:'mono' },
                { label:'Easytrip Acct',  val: viewCar.easytrip_acct || '—',  cls:'mono' },
              ].map(f => (
                <div className="ca-card-field" key={f.label}>
                  <div className="ca-card-field-label">{f.label}</div>
                  <div className={`ca-card-field-val${f.cls ? ` ${f.cls}` : ''}`}>{f.val}</div>
                </div>
              ))}
            </div>
            <div className="ca-card-actions">
              <button className="ca-btn-edit" style={{flex:1,justifyContent:'center',padding:'10px'}} onClick={() => openEditModal(viewCar)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit
              </button>
              <button className="ca-btn-delete" style={{flex:1,justifyContent:'center',padding:'10px'}} onClick={() => { setViewCar(null); setDeleteTarget(viewCar); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL */}
      {showModal && (
        <div className="ca-overlay" onClick={() => setShowModal(false)}>
          <div className="ca-form-modal" onClick={e => e.stopPropagation()}>
            <div className="ca-form-head">
              <div className="ca-form-title">{editingCar ? '✏️ Edit Car' : '🚗 New Car'}</div>
              <button className="ca-card-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="ca-form-body">
              <div className="ca-field-group">
                <label className="ca-field-label">Assigned To *</label>
                <input className="ca-field-input" type="text" placeholder="e.g. Juan dela Cruz" value={formData.assigned_to} onChange={e => field('assigned_to', e.target.value)} />
              </div>
              <div className="ca-form-row">
                <div className="ca-field-group">
                  <label className="ca-field-label">Type of Car *</label>
                  <input className="ca-field-input" type="text" placeholder="e.g. Toyota Vios" value={formData.type_of_car} onChange={e => field('type_of_car', e.target.value)} />
                </div>
                <div className="ca-field-group">
                  <label className="ca-field-label">Plate Number *</label>
                  <input className="ca-field-input" type="text" placeholder="e.g. ABC 1234" value={formData.plate_number} onChange={e => field('plate_number', e.target.value)} />
                </div>
              </div>
              <div className="ca-form-row">
                <div className="ca-field-group">
                  <label className="ca-field-label">Autosweep Acct. <span className="ca-field-opt">Optional</span></label>
                  <input className="ca-field-input" type="text" placeholder="Account number" value={formData.autosweep_acct} onChange={e => field('autosweep_acct', e.target.value)} />
                </div>
                <div className="ca-field-group">
                  <label className="ca-field-label">Card No. <span className="ca-field-opt">Optional</span></label>
                  <input className="ca-field-input" type="text" placeholder="Card number" value={formData.card_no} onChange={e => field('card_no', e.target.value)} />
                </div>
              </div>
              <div className="ca-field-group">
                <label className="ca-field-label">Easytrip Acct. <span className="ca-field-opt">Optional</span></label>
                <input className="ca-field-input" type="text" placeholder="Account number" value={formData.easytrip_acct} onChange={e => field('easytrip_acct', e.target.value)} />
              </div>
            </div>
            <div className="ca-form-foot">
              <button className="ca-foot-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="ca-foot-save" onClick={handleSubmit} disabled={saving}>{saving ? 'Saving…' : editingCar ? 'Save Changes' : 'Add Car'}</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteTarget && (
        <div className="ca-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="ca-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="ca-confirm-icon">🗑️</div>
            <div className="ca-confirm-title">Delete Car Record?</div>
            <div className="ca-confirm-sub">You're about to delete <strong style={{color:'#e8e4dc'}}>{deleteTarget.assigned_to}</strong>'s car record.<br/>This cannot be undone.</div>
            <div className="ca-confirm-btns">
              <button className="ca-confirm-no" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="ca-confirm-del" onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}