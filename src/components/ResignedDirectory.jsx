import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  .rd-wrap * { box-sizing: border-box; }
  .rd-wrap { font-family: 'DM Sans', sans-serif; color: #e8e4dc; }
  .rd-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
  .rd-title-group { display:flex; align-items:center; gap:14px; }
  .rd-title-icon { width:40px; height:40px; background:rgba(200,110,110,0.12); border:1px solid rgba(200,110,110,0.25); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; }
  .rd-title { font-family:'DM Serif Display',serif; font-size:24px; color:#e8e4dc; letter-spacing:-0.5px; }
  .rd-count { font-size:11px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:#c86e6e; background:rgba(200,110,110,0.1); border:1px solid rgba(200,110,110,0.2); padding:3px 10px; border-radius:20px; }
  .rd-search-wrap { position:relative; margin-bottom:10px; }
  .rd-search-wrap svg { position:absolute; left:14px; top:50%; transform:translateY(-50%); width:15px; height:15px; stroke:#5a5a6a; fill:none; stroke-width:1.8; pointer-events:none; transition:stroke 0.2s; }
  .rd-search-wrap:focus-within svg { stroke:#c86e6e; }
  .rd-search { width:100%; background:#1c1f28; border:1px solid rgba(255,255,255,0.07); border-radius:10px; padding:12px 44px 12px 42px; font-family:'DM Sans',sans-serif; font-size:14px; color:#e8e4dc; outline:none; transition:border-color 0.2s, box-shadow 0.2s; caret-color:#c86e6e; }
  .rd-search::placeholder { color:#5a5a6a; }
  .rd-search:focus { border-color:rgba(200,110,110,0.4); box-shadow:0 0 0 3px rgba(200,110,110,0.1); }
  .rd-search-clear { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:#2a2d38; border:none; width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#9a96a0; font-size:14px; cursor:pointer; }
  .rd-search-clear:hover { background:#3a3d4a; color:#e8e4dc; }
  .rd-result-info { font-size:12px; color:#5a5a6a; margin-bottom:14px; padding-left:2px; }
  .rd-result-info span { color:#c86e6e; font-weight:600; }
  .rd-table-container { background:#161920; border:1px solid rgba(255,255,255,0.07); border-radius:14px; overflow-x:auto; }
  .rd-table { width:100%; border-collapse:collapse; min-width:1100px; }
  .rd-table thead tr { background:#1c1f28; border-bottom:1px solid rgba(255,255,255,0.07); }
  .rd-table th { padding:12px 14px; font-size:10.5px; font-weight:700; letter-spacing:1.3px; text-transform:uppercase; color:#5a5a6a; text-align:left; white-space:nowrap; }
  .rd-table tbody tr { border-bottom:1px solid rgba(255,255,255,0.04); transition:background 0.15s; animation:rdFadeUp 0.3s ease both; }
  .rd-table tbody tr:last-child { border-bottom:none; }
  .rd-table tbody tr:hover { background:rgba(255,255,255,0.025); }
  .rd-table td { padding:12px 14px; font-size:13px; color:#e8e4dc; vertical-align:middle; white-space:nowrap; max-width:180px; overflow:hidden; text-overflow:ellipsis; }
  .rd-table th:last-child { position:sticky; right:0; width:120px; background:#1c1f28 !important; box-shadow:-4px 0 10px rgba(0,0,0,0.5); white-space:nowrap; overflow:visible; z-index:2; }
  .rd-table td:last-child { position:sticky; right:0; width:120px; background:#161920 !important; box-shadow:-4px 0 10px rgba(0,0,0,0.5); white-space:nowrap; overflow:visible; z-index:1; }
  .rd-table tbody tr:hover td:last-child { background:#1e2230 !important; }
  @keyframes rdFadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .rd-name-cell { display:flex; align-items:center; gap:10px; }
  .rd-avatar { width:30px; height:30px; border-radius:7px; background:rgba(200,110,110,0.12); border:1px solid rgba(200,110,110,0.2); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:#c86e6e; flex-shrink:0; }
  .rd-resigned-badge { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:4px; font-size:11px; font-weight:600; background:rgba(200,110,110,0.12); border:1px solid rgba(200,110,110,0.2); color:#c86e6e; }
  .rd-date-chip { font-size:12px; color:#9a96a0; }
  .rd-date-chip.resign { color:#c86e6e; font-weight:600; }
  .rd-salary { color:#c8a96e; font-weight:600; font-size:12.5px; }
  .rd-muted { color:#5a5a6a; font-size:12px; }
  .rd-reason-pill { display:inline-block; padding:2px 9px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); border-radius:4px; font-size:11.5px; color:#9a96a0; max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .rd-actions { display:flex; gap:5px; align-items:center; flex-wrap:nowrap; }
  .rd-btn-view { display:flex; align-items:center; justify-content:center; gap:5px; padding:7px 12px; border-radius:7px; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600; cursor:pointer; border:1px solid; transition:all 0.2s; white-space:nowrap; background:rgba(200,110,110,0.1); border-color:rgba(200,110,110,0.2); color:#c86e6e; }
  .rd-btn-view:hover { background:rgba(200,110,110,0.2); border-color:rgba(200,110,110,0.4); }
  .rd-btn-delete { display:flex; align-items:center; justify-content:center; gap:5px; padding:7px 12px; border-radius:7px; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600; cursor:pointer; border:1px solid; transition:all 0.2s; white-space:nowrap; background:rgba(224,90,90,0.1); border-color:rgba(224,90,90,0.2); color:#e05a5a; }
  .rd-btn-delete:hover { background:rgba(224,90,90,0.2); border-color:rgba(224,90,90,0.4); }
  .rd-empty { padding:60px 20px; display:flex; flex-direction:column; align-items:center; gap:12px; text-align:center; }
  .rd-empty-icon { font-size:38px; opacity:0.35; }
  .rd-empty-title { font-size:16px; color:#9a96a0; }
  .rd-empty-sub   { font-size:13px; color:#5a5a6a; }
  .rd-overlay { position:fixed; top:0; left:0; right:0; bottom:0; z-index:9999; background:rgba(5,6,10,0.78); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; padding:20px; animation:rdFadeIn 0.2s ease; }
  @keyframes rdFadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes rdScaleIn { from { opacity:0; transform:scale(0.94) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
  .rd-view-card { background:#161920; border:1px solid rgba(255,255,255,0.08); border-radius:20px; width:100%; max-width:600px; max-height:88vh; overflow-y:auto; box-shadow:0 40px 100px rgba(0,0,0,0.7); animation:rdScaleIn 0.25s cubic-bezier(0.16,1,0.3,1); }
  .rd-view-card::-webkit-scrollbar { width:4px; }
  .rd-view-card::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }
  .rd-card-top { padding:24px 24px 20px; background:linear-gradient(135deg, rgba(200,110,110,0.08) 0%, transparent 60%); border-bottom:1px solid rgba(255,255,255,0.06); position:relative; }
  .rd-card-close { position:absolute; top:16px; right:16px; width:30px; height:30px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08); border-radius:7px; display:flex; align-items:center; justify-content:center; color:#9a96a0; font-size:16px; cursor:pointer; transition:background 0.2s, color 0.2s; }
  .rd-card-close:hover { background:rgba(255,255,255,0.1); color:#e8e4dc; }
  .rd-card-avatar-lg { width:52px; height:52px; border-radius:12px; background:rgba(200,110,110,0.15); border:1px solid rgba(200,110,110,0.3); display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:700; color:#c86e6e; margin-bottom:12px; }
  .rd-card-name { font-family:'DM Serif Display',serif; font-size:22px; color:#e8e4dc; margin-bottom:6px; }
  .rd-card-sub  { display:flex; align-items:center; gap:8px; flex-wrap:wrap; font-size:13px; color:#9a96a0; }
  .rd-card-resign-banner { margin-top:12px; display:flex; align-items:center; gap:8px; padding:10px 14px; background:rgba(200,110,110,0.08); border:1px solid rgba(200,110,110,0.18); border-radius:9px; font-size:13px; }
  .rd-card-resign-date   { color:#c86e6e; font-weight:600; }
  .rd-card-resign-reason { color:#9a96a0; font-size:12px; }
  .rd-card-section { padding:14px 24px 0; }
  .rd-card-section-title { font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#5a5a6a; margin-bottom:8px; padding-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.05); }
  .rd-card-fields { display:grid; grid-template-columns:1fr 1fr; gap:0; margin-bottom:14px; }
  .rd-card-field { padding:9px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
  .rd-card-field:nth-child(odd)  { padding-right:16px; }
  .rd-card-field:nth-child(even) { padding-left:16px; border-left:1px solid rgba(255,255,255,0.04); }
  .rd-card-field.full { grid-column:span 2; padding-right:0; }
  .rd-card-field-label { font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#5a5a6a; margin-bottom:3px; }
  .rd-card-field-val { font-size:13px; font-weight:500; color:#e8e4dc; word-break:break-word; white-space:normal; }
  .rd-card-field-val.accent { color:#c86e6e; }
  .rd-card-field-val.gold   { color:#c8a96e; }
  .rd-card-field-val.mono   { font-family:monospace; font-size:12px; color:#9a96a0; }
  .rd-card-actions { padding:14px 24px 22px; display:flex; gap:8px; }
  .rd-confirm-modal { background:#161920; border:1px solid rgba(224,90,90,0.2); border-radius:16px; width:100%; max-width:360px; padding:28px; box-shadow:0 40px 80px rgba(0,0,0,0.7); animation:rdScaleIn 0.2s cubic-bezier(0.16,1,0.3,1); text-align:center; }
  .rd-confirm-icon  { width:52px; height:52px; border-radius:14px; background:rgba(224,90,90,0.12); border:1px solid rgba(224,90,90,0.25); display:flex; align-items:center; justify-content:center; font-size:22px; margin:0 auto 16px; }
  .rd-confirm-title { font-family:'DM Serif Display',serif; font-size:20px; color:#e8e4dc; margin-bottom:8px; }
  .rd-confirm-sub   { font-size:13px; color:#9a96a0; margin-bottom:24px; line-height:1.6; }
  .rd-confirm-btns  { display:flex; gap:8px; }
  .rd-confirm-del { flex:1; padding:11px; background:#e05a5a; color:white; border:none; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:background 0.2s; }
  .rd-confirm-del:hover { background:#ea6a6a; }
  .rd-confirm-no  { flex:1; padding:11px; background:transparent; border:1px solid rgba(255,255,255,0.08); border-radius:8px; color:#9a96a0; font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; transition:all 0.2s; }
  .rd-confirm-no:hover { border-color:rgba(255,255,255,0.15); color:#e8e4dc; }
`;

const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';

const fmt = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  return isNaN(dt) ? d : dt.toLocaleDateString('en-PH', { year:'numeric', month:'short', day:'numeric' });
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
    try { const res = await axios.get('/api/resigned-employees'); setResignedEmployees(res.data); }
    catch { notify('error', 'Failed to load resigned employees'); }
  };

  const filtered = resignedEmployees.filter(e =>
    `${e.name} ${e.position} ${e.resignation_date} ${e.reason}`.toLowerCase().includes(search.toLowerCase())
  );

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/resigned-employees/${deleteTarget.id}`);
      await fetchResignedEmployees(); setDeleteTarget(null);
      notify('success', 'Record deleted successfully');
    } catch { notify('error', 'Failed to delete record'); }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="rd-wrap">
        <div className="rd-header">
          <div className="rd-title-group">
            <div className="rd-title-icon">📋</div>
            <div className="rd-title">Resigned Employees</div>
            <span className="rd-count">{resignedEmployees.length} records</span>
          </div>
        </div>
        <div className="rd-search-wrap">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input className="rd-search" type="text" placeholder="Search by name, position, resignation date, or reason…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="rd-search-clear" onClick={() => setSearch('')}>×</button>}
        </div>
        {search && <div className="rd-result-info">Showing <span>{filtered.length}</span> of {resignedEmployees.length} records</div>}
        <div className="rd-table-container">
          <table className="rd-table">
            <thead>
              <tr>
                <th>Name</th><th>Position</th><th>Status</th><th>Date Started</th><th>Salary</th>
                <th>SSS</th><th>PhilHealth</th><th>Pag-IBIG</th><th>TIN</th><th>CP / Viber</th>
                <th>Email</th><th>Resigned</th><th>Reason</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((emp, i) => (
                <tr key={emp.id} style={{ animationDelay:`${i*30}ms` }}>
                  <td><div className="rd-name-cell"><div className="rd-avatar">{getInitials(emp.name)}</div><span style={{fontWeight:600}}>{emp.name}</span></div></td>
                  <td style={{color:'#9a96a0'}}>{emp.position}</td>
                  <td><span className="rd-resigned-badge">📋 {emp.employment_status || 'Resigned'}</span></td>
                  <td><span className="rd-date-chip">{fmt(emp.date_started)}</span></td>
                  <td><span className="rd-salary">₱{Number(emp.salary || 0).toLocaleString()}</span></td>
                  <td><span className="rd-muted" style={{fontFamily:'monospace',fontSize:11}}>{emp.sss || '—'}</span></td>
                  <td><span className="rd-muted" style={{fontFamily:'monospace',fontSize:11}}>{emp.philhealth || '—'}</span></td>
                  <td><span className="rd-muted" style={{fontFamily:'monospace',fontSize:11}}>{emp.pagibig || '—'}</span></td>
                  <td><span className="rd-muted" style={{fontFamily:'monospace',fontSize:11}}>{emp.tin || '—'}</span></td>
                  <td><span className="rd-muted">{emp.cp_viber || '—'}</span></td>
                  <td style={{fontSize:12,color:'#9a96a0'}}>{emp.official_email || '—'}</td>
                  <td><span className="rd-date-chip resign">{fmt(emp.resignation_date)}</span></td>
                  <td>{emp.reason ? <span className="rd-reason-pill" title={emp.reason}>{emp.reason}</span> : <span className="rd-muted">—</span>}</td>
                  <td>
                    <div className="rd-actions">
                      <button className="rd-btn-view" onClick={() => setViewEmp(emp)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>View</button>
                      <button className="rd-btn-delete" onClick={() => setDeleteTarget(emp)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>Delete</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={14} style={{padding:0}}><div className="rd-empty"><div className="rd-empty-icon">📋</div><div className="rd-empty-title">{search ? `No results for "${search}"` : 'No resigned employees yet'}</div><div className="rd-empty-sub">{search ? 'Try a different keyword' : 'Resigned employees will appear here'}</div></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {createPortal(
        <>
          {viewEmp && (
            <div className="rd-overlay" onClick={() => setViewEmp(null)}>
              <div className="rd-view-card" onClick={e => e.stopPropagation()}>
                <div className="rd-card-top">
                  <button className="rd-card-close" onClick={() => setViewEmp(null)}>×</button>
                  <div className="rd-card-avatar-lg">{getInitials(viewEmp.name)}</div>
                  <div className="rd-card-name">{viewEmp.name}</div>
                  <div className="rd-card-sub"><span>{viewEmp.position}</span><span className="rd-resigned-badge">📋 Resigned</span></div>
                  <div className="rd-card-resign-banner">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c86e6e" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
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
                      { label:'Employment Status',val: viewEmp.employment_status },
                      { label:'Salary',           val: `₱${Number(viewEmp.salary||0).toLocaleString()}`, cls:'gold' },
                      { label:'Diploma',          val: viewEmp.diploma },
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
                      { label:'SSS',       val: viewEmp.sss,        cls:'mono' },
                      { label:'PhilHealth',val: viewEmp.philhealth, cls:'mono' },
                      { label:'Pag-IBIG',  val: viewEmp.pagibig,    cls:'mono' },
                      { label:'TIN',       val: viewEmp.tin,        cls:'mono' },
                    ].map(f => (
                      <div className="rd-card-field" key={f.label}>
                        <div className="rd-card-field-label">{f.label}</div>
                        <div className={`rd-card-field-val${f.cls ? ` ${f.cls}` : ''}`}>{f.val || '—'}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rd-card-section-title">Contact Info</div>
                  <div className="rd-card-fields" style={{marginBottom:14}}>
                    <div className="rd-card-field"><div className="rd-card-field-label">CP / Viber</div><div className="rd-card-field-val">{viewEmp.cp_viber || '—'}</div></div>
                    <div className="rd-card-field"><div className="rd-card-field-label">Official Email</div><div className="rd-card-field-val" style={{fontSize:12}}>{viewEmp.official_email || '—'}</div></div>
                    <div className="rd-card-field full"><div className="rd-card-field-label">Home Address</div><div className="rd-card-field-val" style={{whiteSpace:'normal'}}>{viewEmp.home_address || '—'}</div></div>
                    {viewEmp.reason && <div className="rd-card-field full"><div className="rd-card-field-label">Reason for Resignation</div><div className="rd-card-field-val accent" style={{whiteSpace:'normal'}}>{viewEmp.reason}</div></div>}
                  </div>
                </div>
                <div className="rd-card-actions">
                  <button className="rd-btn-delete" style={{flex:1,justifyContent:'center',padding:'10px'}} onClick={() => { setViewEmp(null); setDeleteTarget(viewEmp); }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>Delete Record
                  </button>
                </div>
              </div>
            </div>
          )}

          {deleteTarget && (
            <div className="rd-overlay" onClick={() => setDeleteTarget(null)}>
              <div className="rd-confirm-modal" onClick={e => e.stopPropagation()}>
                <div className="rd-confirm-icon">🗑️</div>
                <div className="rd-confirm-title">Delete Record?</div>
                <div className="rd-confirm-sub">You're about to permanently delete <strong style={{color:'#e8e4dc'}}>{deleteTarget.name}</strong>'s record.<br/>This cannot be undone.</div>
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