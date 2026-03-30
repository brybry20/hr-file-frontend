import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

/* ─── file type helpers ─── */
const isImg = (t, u) => t?.includes('image') || /\.(jpg|jpeg|png|gif|webp)$/i.test(u || '');
const isPdf = (t, u) => t?.includes('pdf') || /\.pdf$/i.test(u || '');
const isDoc = (t) => t?.includes('word') || t?.includes('document') || t?.includes('msword') || t?.includes('openxmlformats-officedocument.wordprocessingml');
const isXls = (t) => t?.includes('sheet') || t?.includes('excel') || t?.includes('spreadsheetml') || t?.includes('ms-excel');

const fileTypeLabel = (t) => {
  if (!t) return 'FILE';
  if (t.includes('pdf')) return 'PDF';
  if (t.includes('word') || t.includes('document')) return 'DOC';
  if (t.includes('sheet') || t.includes('excel')) return 'XLS';
  if (t.includes('image')) return 'IMG';
  return 'FILE';
};

const fmtSize = (b) => {
  if (!b) return '—';
  const s = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(b) / Math.log(1024));
  return `${(b / Math.pow(1024, i)).toFixed(1)} ${s[i]}`;
};

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
};

/* ─── SVG icons ─── */
const Icon = ({ name, size = 16, color = 'currentColor' }) => {
  const icons = {
    folder: <><path d="M3 7a2 2 0 012-2h3.17a2 2 0 011.41.59l.83.82H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/></>,
    file: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="none" stroke={color} strokeWidth="1.5"/><path d="M14 2v6h6" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/></>,
    pdf: <><rect x="3" y="2" width="18" height="20" rx="2" fill="none" stroke={color} strokeWidth="1.5"/><path d="M7 12h4m-4 4h10M7 8h10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><text x="7" y="19" fontSize="5" fill={color} fontWeight="700">PDF</text></>,
    doc: <><rect x="3" y="2" width="18" height="20" rx="2" fill="none" stroke={color} strokeWidth="1.5"/><path d="M7 8h10M7 12h10M7 16h6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    xls: <><rect x="3" y="2" width="18" height="20" rx="2" fill="none" stroke={color} strokeWidth="1.5"/><path d="M8 8l8 8M16 8l-8 8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke={color} strokeWidth="1.5"/><circle cx="8.5" cy="8.5" r="1.5" fill={color}/><path d="M21 15l-5-5L5 21" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/></>,
    upload: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    download: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    plus: <><path d="M12 5v14M5 12h14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    pencil: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    move: <><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    check: <><path d="M20 6L9 17l-5-5" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
    close: <><path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    external: <><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    chevronR: <><path d="M9 18l6-6-6-6" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" fill="none" stroke={color} strokeWidth="1.5"/><path d="M9 22V12h6v10" fill="none" stroke={color} strokeWidth="1.5"/></>,
    eye: <><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" fill="none" stroke={color} strokeWidth="1.5"/><circle cx="12" cy="12" r="3" fill="none" stroke={color} strokeWidth="1.5"/></>,
    'zoom-in': (<><circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="1.5"/><path d="M12 8v8M8 12h8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>),
    'zoom-out': (<><circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="1.5"/><path d="M8 12h8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>),
    refresh: (<><path d="M20 12a8 8 0 11-8-8 8 8 0 018 8z" fill="none" stroke={color} strokeWidth="1.5"/><path d="M12 8v4l3 3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      {icons[name]}
    </svg>
  );
};

const FileTypeIcon = ({ fileType, size = 32 }) => {
  const colors = { img: '#6eb5c8', pdf: '#e07a7a', doc: '#7ab4e0', xls: '#7ae0a0', file: '#9a96a0' };
  let name = 'file', color = colors.file;
  if (isImg(fileType)) { name = 'image'; color = colors.img; }
  else if (isPdf(fileType)) { name = 'pdf'; color = colors.pdf; }
  else if (isDoc(fileType)) { name = 'doc'; color = colors.doc; }
  else if (isXls(fileType)) { name = 'xls'; color = colors.xls; }
  return <Icon name={name} size={size} color={color} />;
};

/* ─── styles ─── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Syne:wght@400;500;600;700;800&display=swap');

  .ef { font-family:'Syne',sans-serif; background:#13151c; border-radius:16px; color:#d4d0c8; padding:20px; }

  .ef-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:10px; }
  .ef-title { font-family:'DM Serif Display',serif; font-size:17px; color:#e8e4dc; display:flex; align-items:center; gap:10px; }
  .ef-count { background:rgba(110,181,200,0.15); color:#6eb5c8; padding:2px 10px; border-radius:20px; font-size:11px; font-weight:700; }

  .ef-bc { display:flex; align-items:center; gap:4px; font-size:12px; margin-bottom:14px; flex-wrap:wrap; min-height:20px; }
  .ef-bc-btn { display:flex; align-items:center; gap:4px; color:#6eb5c8; cursor:pointer; background:none; border:none; font-family:'Syne',sans-serif; font-size:12px; padding:2px 6px; border-radius:6px; transition:background 0.15s; }
  .ef-bc-btn:hover { background:rgba(110,181,200,0.1); }
  .ef-bc-sep { color:#2e3040; }
  .ef-bc-cur { color:#6a6a7a; font-size:12px; padding:2px 4px; }

  .ef-bar { display:flex; gap:8px; align-items:center; flex-wrap:wrap; padding-bottom:14px; margin-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.05); }
  .ef-btn { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:8px; border:none; font-size:12px; font-family:'Syne',sans-serif; font-weight:600; cursor:pointer; transition:all 0.17s; white-space:nowrap; }
  .ef-btn:disabled { opacity:.4; cursor:not-allowed; }
  .ef-btn-primary { background:#6eb5c8; color:#0b0d12; }
  .ef-btn-primary:hover:not(:disabled) { background:#82c8db; transform:translateY(-1px); }
  .ef-btn-ghost { background:rgba(255,255,255,0.05); color:#9a96a0; border:1px solid rgba(255,255,255,0.08); }
  .ef-btn-ghost:hover:not(:disabled) { background:rgba(110,181,200,0.12); color:#6eb5c8; border-color:rgba(110,181,200,0.25); transform:translateY(-1px); }
  .ef-btn-danger { background:rgba(224,90,90,0.1); color:#e07a7a; border:1px solid rgba(224,90,90,0.15); }
  .ef-btn-danger:hover:not(:disabled) { background:rgba(224,90,90,0.2); transform:translateY(-1px); }
  .ef-upload-lbl { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:8px; background:rgba(110,181,200,0.08); border:1px solid rgba(110,181,200,0.18); color:#6eb5c8; font-size:12px; font-family:'Syne',sans-serif; font-weight:600; cursor:pointer; transition:all 0.17s; white-space:nowrap; }
  .ef-upload-lbl:hover { background:rgba(110,181,200,0.16); transform:translateY(-1px); }
  .ef-ready-badge { background:rgba(110,181,200,0.15); color:#6eb5c8; padding:2px 10px; border-radius:20px; font-size:11px; font-weight:700; }
  .ef-sel-info { font-size:12px; color:#6eb5c8; margin-left:auto; }

  .ef-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(158px,1fr)); gap:12px; max-height:520px; overflow-y:auto; padding:2px; }
  .ef-grid::-webkit-scrollbar { width:3px; }
  .ef-grid::-webkit-scrollbar-thumb { background:rgba(110,181,200,0.2); border-radius:3px; }

  .ef-card { background:#1a1d27; border:1.5px solid rgba(255,255,255,0.06); border-radius:12px; overflow:hidden; cursor:pointer; transition:all 0.18s; position:relative; user-select:none; }
  .ef-card:hover { border-color:rgba(110,181,200,0.35); transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.3); }
  .ef-card.sel { border-color:#6eb5c8; box-shadow:0 0 0 2px rgba(110,181,200,0.2); }
  .ef-card.drag-over { border-color:#6eb5c8 !important; background:rgba(110,181,200,0.07) !important; }

  .ef-chk { position:absolute; top:8px; left:8px; z-index:3; width:18px; height:18px; border-radius:5px; background:#6eb5c8; display:flex; align-items:center; justify-content:center; }

  .ef-fold-thumb { width:100%; height:100px; background:linear-gradient(140deg,#1d2133 0%,#161924 100%); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; }
  .ef-fold-cnt { font-size:10px; color:#6eb5c8; background:rgba(110,181,200,0.1); padding:2px 10px; border-radius:20px; font-family:'DM Mono',monospace; }

  .ef-file-thumb { width:100%; height:100px; background:#0f1117; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; overflow:hidden; position:relative; }
  .ef-file-thumb img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
  .ef-type-tag { font-size:9px; color:#6eb5c8; background:rgba(110,181,200,0.1); padding:2px 8px; border-radius:20px; font-family:'DM Mono',monospace; }

  .ef-card-body { padding:9px 10px; border-top:1px solid rgba(255,255,255,0.05); }
  .ef-card-name { font-size:11px; font-weight:600; color:#dedad2; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:3px; }
  .ef-card-meta { display:flex; justify-content:space-between; font-size:10px; color:#454555; font-family:'DM Mono',monospace; margin-bottom:8px; }
  .ef-card-acts { display:flex; gap:4px; padding-top:7px; border-top:1px solid rgba(255,255,255,0.04); }
  .ef-act { flex:1; background:rgba(255,255,255,0.04); border:none; border-radius:6px; padding:5px 4px; cursor:pointer; color:#585868; transition:all 0.16s; display:flex; align-items:center; justify-content:center; }
  .ef-act:hover { background:rgba(110,181,200,0.13); color:#6eb5c8; }
  .ef-act.danger:hover { background:rgba(224,90,90,0.13); color:#e07a7a; }

  .ef-move-wrap { position:relative; flex:1; }
  .ef-move-drop { position:absolute; bottom:calc(100% + 6px); left:0; min-width:160px; background:#1a1d2b; border:1px solid rgba(110,181,200,0.18); border-radius:10px; padding:4px; z-index:300; box-shadow:0 12px 32px rgba(0,0,0,0.5); }
  .ef-move-opt { padding:6px 10px; font-size:11px; color:#9a96a0; border-radius:6px; cursor:pointer; transition:all 0.14s; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:flex; align-items:center; gap:6px; }
  .ef-move-opt:hover { background:rgba(110,181,200,0.13); color:#6eb5c8; }
  .ef-move-opt.to-root { color:#e0b07a; }
  .ef-move-opt.empty { color:#383848; cursor:default; }

  .ef-hint { font-size:11px; color:#2e3040; margin-bottom:10px; display:flex; align-items:center; gap:5px; }

  .ef-empty { text-align:center; padding:52px 20px; display:flex; flex-direction:column; align-items:center; gap:10px; }
  .ef-empty-icon { color:#252838; }
  .ef-empty-text { font-size:13px; color:#4a4a5a; }
  .ef-empty-sub { font-size:11px; color:#2e3040; }

  .ef-load { display:flex; justify-content:center; align-items:center; padding:56px; gap:10px; color:#4a4a5a; font-size:12px; }
  .ef-spin { width:22px; height:22px; border:2px solid rgba(255,255,255,0.06); border-top-color:#6eb5c8; border-radius:50%; animation:spin .7s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }

  .ef-dlg-bg { position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:10000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); }
  .ef-dlg { background:#1a1d27; border:1px solid rgba(110,181,200,0.16); border-radius:16px; padding:26px; width:340px; }
  .ef-dlg-title { font-family:'DM Serif Display',serif; font-size:17px; color:#e8e4dc; margin-bottom:14px; }
  .ef-dlg-inp { width:100%; background:#0f1117; border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:9px 12px; color:#e8e4dc; font-size:13px; font-family:'Syne',sans-serif; outline:none; box-sizing:border-box; }
  .ef-dlg-inp:focus { border-color:rgba(110,181,200,0.4); }
  .ef-dlg-acts { display:flex; gap:8px; margin-top:14px; justify-content:flex-end; }

  .ef-pv-bg { position:fixed; inset:0; background:rgba(0,0,0,0.93); z-index:10000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(6px); }
  .ef-pv { display:flex; flex-direction:column; width:92vw; height:90vh; max-width:1100px; background:#13151c; border-radius:16px; overflow:hidden; border:1px solid rgba(255,255,255,0.07); }

  .ef-pv-top { display:flex; align-items:center; gap:12px; padding:12px 16px; background:#0f1117; border-bottom:1px solid rgba(255,255,255,0.06); flex-shrink:0; }
  .ef-pv-icon { width:36px; height:36px; border-radius:8px; background:rgba(110,181,200,0.1); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .ef-pv-info { flex:1; min-width:0; }
  .ef-pv-name { font-size:13px; font-weight:600; color:#e8e4dc; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .ef-pv-meta { font-size:10px; color:#4a4a5a; font-family:'DM Mono',monospace; margin-top:2px; }
  .ef-pv-zoom-controls { display:flex; align-items:center; gap:6px; background:rgba(255,255,255,0.05); padding:4px 8px; border-radius:8px; }
  .ef-pv-zoom-btn { width:28px; height:28px; border-radius:6px; background:rgba(110,181,200,0.1); border:1px solid rgba(110,181,200,0.2); color:#6eb5c8; cursor:pointer; display:flex; align-items:center; justify-content:center; }
  .ef-pv-zoom-btn:hover { background:rgba(110,181,200,0.2); }
  .ef-pv-zoom-level { font-size:11px; font-family:'DM Mono',monospace; color:#9a96a0; min-width:45px; text-align:center; }
  .ef-pv-acts { display:flex; gap:6px; flex-shrink:0; }
  .ef-pv-close { width:32px; height:32px; border-radius:8px; background:rgba(255,255,255,0.05); border:none; color:#9a96a0; cursor:pointer; display:flex; align-items:center; justify-content:center; }
  .ef-pv-close:hover { background:rgba(224,90,90,0.2); color:#e07a7a; }

  .ef-pv-body { flex:1; overflow:hidden; display:flex; align-items:center; justify-content:center; background:#0c0e14; position:relative; cursor:grab; }
  .ef-pv-body:active { cursor:grabbing; }
  .ef-pv-body img { max-width:100%; max-height:100%; object-fit:contain; transition:transform 0.2s ease; transform-origin:center; }
  .ef-pv-body iframe { width:100%; height:100%; border:none; }

  .ef-pv-nopreview { display:flex; flex-direction:column; align-items:center; gap:16px; }
  .ef-pv-nopreview-icon { width:80px; height:80px; border-radius:20px; background:rgba(255,255,255,0.04); display:flex; align-items:center; justify-content:center; }
  .ef-pv-nopreview h3 { font-family:'DM Serif Display',serif; font-size:18px; color:#e8e4dc; margin:0; }
  .ef-pv-nopreview p { font-size:12px; color:#4a4a5a; margin:0; }

  .ef-pv-bot { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 16px; background:#0f1117; border-top:1px solid rgba(255,255,255,0.06); flex-shrink:0; }
  .ef-pv-path { font-size:10px; color:#383848; font-family:'DM Mono',monospace; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1; }
  .ef-pv-dl-btn { display:inline-flex; align-items:center; gap:6px; padding:7px 16px; border-radius:8px; background:#6eb5c8; color:#0b0d12; font-size:12px; font-family:'Syne',sans-serif; font-weight:700; text-decoration:none; }
  .ef-pv-dl-btn:hover { background:#82c8db; transform:translateY(-1px); }
  .ef-pv-open-btn { display:inline-flex; align-items:center; gap:6px; padding:7px 16px; border-radius:8px; background:rgba(110,181,200,0.1); border:1px solid rgba(110,181,200,0.2); color:#6eb5c8; font-size:12px; font-family:'Syne',sans-serif; font-weight:700; text-decoration:none; }
  .ef-pv-open-btn:hover { background:rgba(110,181,200,0.18); transform:translateY(-1px); }
`;

function Dialog({ title, defaultValue = '', placeholder = '', onConfirm, onCancel }) {
  const [val, setVal] = useState(defaultValue);
  const ref = useRef();
  useEffect(() => { ref.current?.focus(); ref.current?.select(); }, []);
  return (
    <div className="ef-dlg-bg" onClick={onCancel}>
      <div className="ef-dlg" onClick={e => e.stopPropagation()}>
        <div className="ef-dlg-title">{title}</div>
        <input
          ref={ref} className="ef-dlg-inp" value={val} placeholder={placeholder}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && val.trim()) onConfirm(val.trim()); if (e.key === 'Escape') onCancel(); }}
        />
        <div className="ef-dlg-acts">
          <button className="ef-btn ef-btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="ef-btn ef-btn-primary" disabled={!val.trim()} onClick={() => onConfirm(val.trim())}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

function Preview({ file, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const label = fileTypeLabel(file.file_type);
  const img = isImg(file.file_type, file.cloudinary_url);
  const pdf = isPdf(file.file_type, file.cloudinary_url);
  const doc = isDoc(file.file_type);
  const xls = isXls(file.file_type);

  const dlUrl = file.cloudinary_url
    ? file.cloudinary_url.replace('/upload/', '/upload/fl_attachment/')
    : file.cloudinary_url;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => { setZoom(1); setPosition({ x: 0, y: 0 }); };

  const handleMouseDown = (e) => {
    if (zoom > 1 && img) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1 && img) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e) => {
    if (img) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 3));
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container && img) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [img]);

  const getOfficeViewerUrl = () => {
    if (doc || xls) {
      return `https://docs.google.com/gview?url=${encodeURIComponent(file.cloudinary_url)}&embedded=true`;
    }
    return null;
  };

  return (
    <div className="ef-pv-bg" onClick={onClose}>
      <div className="ef-pv" onClick={e => e.stopPropagation()}>
        <div className="ef-pv-top">
          <div className="ef-pv-icon">
            <FileTypeIcon fileType={file.file_type} size={20} />
          </div>
          <div className="ef-pv-info">
            <div className="ef-pv-name" title={file.file_name}>{file.file_name}</div>
            <div className="ef-pv-meta">{label} · {fmtSize(file.file_size)} · {fmtDate(file.uploaded_at)}</div>
          </div>
          {img && (
            <div className="ef-pv-zoom-controls">
              <button className="ef-pv-zoom-btn" onClick={handleZoomOut}><Icon name="zoom-out" size={16} /></button>
              <span className="ef-pv-zoom-level">{Math.round(zoom * 100)}%</span>
              <button className="ef-pv-zoom-btn" onClick={handleZoomIn}><Icon name="zoom-in" size={16} /></button>
              <button className="ef-pv-zoom-btn" onClick={handleResetZoom}><Icon name="refresh" size={14} /></button>
            </div>
          )}
          <div className="ef-pv-acts">
            <a className="ef-pv-open-btn" href={file.cloudinary_url} target="_blank" rel="noopener noreferrer">
              <Icon name="external" size={13} /> Open
            </a>
            <a className="ef-pv-dl-btn" href={dlUrl} download={file.file_name}>
              <Icon name="download" size={13} /> Download
            </a>
          </div>
          <button className="ef-pv-close" onClick={onClose}><Icon name="close" size={16} /></button>
        </div>

        <div
          ref={containerRef}
          className="ef-pv-body"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ cursor: zoom > 1 && img ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          {img ? (
            <img
              src={file.cloudinary_url}
              alt={file.file_name}
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease'
              }}
              draggable={false}
            />
          ) : pdf ? (
            <iframe src={`${file.cloudinary_url}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`} title={file.file_name} />
          ) : (doc || xls) ? (
            <iframe src={getOfficeViewerUrl()} title={file.file_name} style={{ width: '100%', height: '100%', border: 'none' }} />
          ) : (
            <div className="ef-pv-nopreview">
              <div className="ef-pv-nopreview-icon"><FileTypeIcon fileType={file.file_type} size={40} /></div>
              <h3>{file.file_name}</h3>
              <p>Preview not available for {label} files</p>
              <a className="ef-pv-dl-btn" href={dlUrl} download={file.file_name}><Icon name="download" size={14} /> Download to view</a>
            </div>
          )}
        </div>

        <div className="ef-pv-bot">
          <span className="ef-pv-path">{file.cloudinary_url}</span>
          <a className="ef-pv-dl-btn" href={dlUrl} download={file.file_name}><Icon name="download" size={13} /> Download</a>
        </div>
      </div>
    </div>
  );
}

export default function EmployeeFiles({ employeeId, employeeName, onNotify }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [folders, setFolders] = useState([]);
  const [current, setCurrent] = useState(null);
  const [bc, setBc] = useState([]);
  const [selIds, setSelIds] = useState(new Set());
  const [dialog, setDialog] = useState(null);
  const [moveMenu, setMoveMenu] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [currentFolderFiles, setCurrentFolderFiles] = useState([]);
  const fileRef = useRef();

  // Fetch all files
  const fetchFiles = useCallback(async () => {
    try {
      const r = await axios.get(`/api/employees/${employeeId}/files`, { withCredentials: true });
      setFiles(r.data);
    } catch (err) {
      console.error('Fetch error:', err);
      onNotify('error', 'Failed to load files');
    }
  }, [employeeId, onNotify]);

  // Fetch folders
  const fetchFolders = useCallback(async () => {
    try {
      const r = await axios.get(`/api/employees/${employeeId}/folders`, { withCredentials: true });
      setFolders(r.data);
    } catch (err) {
      console.error('Fetch folders error:', err);
    }
  }, [employeeId]);

  // Fetch files for current folder
  const fetchCurrentFolderFiles = useCallback(async () => {
    try {
      const response = await axios.get(`/api/employees/${employeeId}/folder-files`, {
        params: { folderId: current },
        withCredentials: true
      });
      setCurrentFolderFiles(response.data);
    } catch (err) {
      console.error('Error fetching folder files:', err);
    }
  }, [employeeId, current]);

  useEffect(() => {
    if (!employeeId) return;
    setLoading(true);
    Promise.all([fetchFiles(), fetchFolders()]).finally(() => setLoading(false));
  }, [employeeId, fetchFiles, fetchFolders]);

  useEffect(() => {
    if (employeeId) {
      fetchCurrentFolderFiles();
    }
  }, [employeeId, current, fetchCurrentFolderFiles]);

  // Navigation
  const openFolder = (f) => {
    setCurrent(f.id);
    setBc(p => [...p, { id: f.id, name: f.name }]);
    setSelIds(new Set());
    setMoveMenu(null);
  };

  const navTo = (i) => {
    if (i === -1) {
      setCurrent(null);
      setBc([]);
    } else {
      const c = bc[i];
      setCurrent(c.id);
      setBc(p => p.slice(0, i + 1));
    }
    setSelIds(new Set());
    setMoveMenu(null);
  };

  // Get visible items
  const visFolders = current === null
    ? folders.filter(f => !f.parentId)
    : folders.filter(f => f.parentId === current);
  
  const visFiles = currentFolderFiles;

  // Upload files
  const handleUpload = async () => {
    if (!pending.length) return;
    setUploading(true);
    const fd = new FormData();
    pending.forEach(f => fd.append('files', f));
    try {
      const uploadResponse = await axios.post(`/api/employees/${employeeId}/files`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      
      const newFiles = uploadResponse.data.files;
      
      // If we're in a folder, add these files to that folder
      if (current && newFiles.length > 0) {
        for (const file of newFiles) {
          await axios.post(`/api/folders/${current}/move-file`, { fileId: file.id }, { withCredentials: true });
        }
      }
      
      await fetchFiles();
      await fetchFolders();
      await fetchCurrentFolderFiles();
      onNotify('success', `Uploaded ${pending.length} file(s)`);
      setPending([]);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      console.error('Upload error:', err);
      onNotify('error', 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Create folder
  const createFolder = async (name) => {
    setDialog(null);
    try {
      await axios.post(`/api/employees/${employeeId}/folders`, {
        name,
        parentId: current || null
      }, { withCredentials: true });
      await fetchFolders();
      onNotify('success', `Folder "${name}" created`);
    } catch (err) {
      console.error('Create folder error:', err);
      onNotify('error', 'Failed to create folder');
    }
  };

  // Rename folder
  const renameFolder = async (name) => {
    const f = dialog?.item;
    setDialog(null);
    try {
      await axios.put(`/api/folders/${f.id}`, { name }, { withCredentials: true });
      await fetchFolders();
      onNotify('success', 'Folder renamed');
    } catch (err) {
      console.error('Rename folder error:', err);
      onNotify('error', 'Failed to rename folder');
    }
  };

  // Delete folder
  const deleteFolder = async (f) => {
    if (!window.confirm(`Delete folder "${f.name}"? Files inside will return to root.`)) return;
    try {
      await axios.delete(`/api/folders/${f.id}`, { withCredentials: true });
      await fetchFolders();
      await fetchCurrentFolderFiles();
      onNotify('success', 'Folder deleted');
    } catch (err) {
      console.error('Delete folder error:', err);
      onNotify('error', 'Failed to delete folder');
    }
  };

  // Rename file
  const renameFile = async (name) => {
    const f = dialog?.item;
    setDialog(null);
    try {
      await axios.put(`/api/files/${f.id}/rename`, { newName: name }, { withCredentials: true });
      await fetchFiles();
      await fetchCurrentFolderFiles();
      onNotify('success', 'File renamed');
    } catch (err) {
      console.error('Rename file error:', err);
      onNotify('error', 'Failed to rename file');
    }
  };

  // Delete file
  const deleteFile = async (f) => {
    if (!window.confirm(`Delete "${f.file_name}"?`)) return;
    try {
      await axios.delete(`/api/files/${f.id}`, { withCredentials: true });
      await fetchFiles();
      await fetchFolders();
      await fetchCurrentFolderFiles();
      onNotify('success', 'File deleted');
    } catch (err) {
      console.error('Delete file error:', err);
      onNotify('error', 'Failed to delete file');
    }
  };

  // Move file to folder
  const moveFile = async (fileId, targetId) => {
    setMoveMenu(null);
    try {
      await axios.post(`/api/folders/${targetId || 'root'}/move-file`, { fileId }, { withCredentials: true });
      await fetchFolders();
      await fetchCurrentFolderFiles();
      onNotify('success', targetId ? 'Moved to folder' : 'Moved to root');
    } catch (err) {
      console.error('Move file error:', err);
      onNotify('error', 'Failed to move file');
    }
  };

  // Drag & drop
  const onDragStart = (e, fileId) => { e.dataTransfer.setData('fileId', String(fileId)); };
  const onDragOver = (e, fId) => { e.preventDefault(); setDragOver(fId); };
  const onDragLeave = () => setDragOver(null);
  const onDrop = (e, fId) => {
    e.preventDefault();
    setDragOver(null);
    const id = parseInt(e.dataTransfer.getData('fileId'), 10);
    if (id) moveFile(id, fId);
  };

  // Selection
  const toggleSel = (uid, e) => {
    e.stopPropagation();
    setSelIds(p => {
      const n = new Set(p);
      n.has(uid) ? n.delete(uid) : n.add(uid);
      return n;
    });
  };

  // Batch delete
  const batchDelete = async () => {
    if (!selIds.size || !window.confirm(`Delete ${selIds.size} item(s)?`)) return;
    const fUids = [...selIds].filter(u => u.startsWith('file-'));
    const foUids = [...selIds].filter(u => u.startsWith('folder-'));

    for (const u of fUids) {
      try {
        await axios.delete(`/api/files/${u.replace('file-', '')}`, { withCredentials: true });
      } catch (err) {
        console.error('Delete error:', err);
      }
    }

    for (const u of foUids) {
      try {
        await axios.delete(`/api/folders/${u.replace('folder-', '')}`, { withCredentials: true });
      } catch (err) {
        console.error('Delete folder error:', err);
      }
    }

    await fetchFiles();
    await fetchFolders();
    await fetchCurrentFolderFiles();
    setSelIds(new Set());
    onNotify('success', 'Deleted selected items');
  };

  const moveOpts = (fileId) => {
    const inF = folders.find(f => f.fileIds?.includes(fileId));
    return {
      inFolder: inF,
      opts: folders.filter(f => f.id !== inF?.id)
    };
  };

  const total = visFolders.length + visFiles.length;

  return (
    <>
      <style>{STYLES}</style>
      <div className="ef">
        <div className="ef-head">
          <div className="ef-title">
            Documents - {employeeName}
            {total > 0 && <span className="ef-count">{total}</span>}
          </div>
        </div>

        <div className="ef-bc">
          <button className="ef-bc-btn" onClick={() => navTo(-1)}>
            <Icon name="home" size={13} /> All Files
          </button>
          {bc.map((c, i) => (
            <React.Fragment key={c.id}>
              <span className="ef-bc-sep"><Icon name="chevronR" size={12} /></span>
              {i < bc.length - 1
                ? <button className="ef-bc-btn" onClick={() => navTo(i)}>{c.name}</button>
                : <span className="ef-bc-cur">{c.name}</span>}
            </React.Fragment>
          ))}
        </div>

        <div className="ef-bar">
          <button className="ef-btn ef-btn-ghost" onClick={() => setDialog({ type: 'newFolder' })}>
            <Icon name="plus" size={13} /> New Folder
          </button>
          <input
            type="file"
            multiple
            ref={fileRef}
            accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx"
            style={{ display: 'none' }}
            id={`ef-inp-${employeeId}`}
            onChange={e => setPending(Array.from(e.target.files))}
          />
          <label htmlFor={`ef-inp-${employeeId}`} className="ef-upload-lbl">
            <Icon name="upload" size={13} /> Choose Files
          </label>
          {pending.length > 0 && <>
            <span className="ef-ready-badge">{pending.length} ready</span>
            <button className="ef-btn ef-btn-primary" onClick={handleUpload} disabled={uploading}>
              <Icon name="upload" size={13} color="#0b0d12" />
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </>}
          {selIds.size > 0 && <>
            <span className="ef-sel-info">{selIds.size} selected</span>
            <button className="ef-btn ef-btn-danger" onClick={batchDelete}>
              <Icon name="trash" size={13} color="#e07a7a" /> Delete Selected
            </button>
          </>}
        </div>

        {visFiles.length > 0 && visFolders.length > 0 && (
          <div className="ef-hint">
            <Icon name="move" size={11} color="#2e3040" />
            Drag a file onto a folder to move it
          </div>
        )}

        {loading ? (
          <div className="ef-load"><div className="ef-spin" /> Loading files…</div>
        ) : total === 0 ? (
          <div className="ef-empty">
            <div className="ef-empty-icon"><Icon name="folder" size={52} color="#1e2133" /></div>
            <div className="ef-empty-text">{current ? 'This folder is empty' : 'No documents yet'}</div>
            <div className="ef-empty-sub">{current ? 'Upload files here or drag from root' : 'Create folders to organize, or upload files directly'}</div>
          </div>
        ) : (
          <div className="ef-grid" onClick={() => setMoveMenu(null)}>
            {visFolders.map(folder => {
              const k = `folder-${folder.id}`;
              return (
                <div
                  key={k}
                  className={`ef-card${selIds.has(k) ? ' sel' : ''}${dragOver === folder.id ? ' drag-over' : ''}`}
                  onClick={() => openFolder(folder)}
                  onDragOver={e => onDragOver(e, folder.id)}
                  onDragLeave={onDragLeave}
                  onDrop={e => onDrop(e, folder.id)}
                >
                  {selIds.has(k) && <div className="ef-chk"><Icon name="check" size={11} color="#0b0d12" /></div>}
                  <div className="ef-fold-thumb">
                    <Icon name="folder" size={36} color="#6eb5c8" />
                    <div className="ef-fold-cnt">{folder.fileIds?.length || 0} {folder.fileIds?.length === 1 ? 'file' : 'files'}</div>
                  </div>
                  <div className="ef-card-body">
                    <div className="ef-card-name" title={folder.name}>{folder.name}</div>
                    <div className="ef-card-meta"><span>Folder</span><span>virtual</span></div>
                    <div className="ef-card-acts">
                      <button className="ef-act" title="Rename" onClick={e => { e.stopPropagation(); setDialog({ type: 'renameFolder', item: folder }); }}>
                        <Icon name="pencil" size={13} />
                      </button>
                      <button className="ef-act" title="Select" onClick={e => { e.stopPropagation(); toggleSel(k, e); }}>
                        <Icon name="check" size={13} />
                      </button>
                      <button className="ef-act danger" title="Delete" onClick={e => { e.stopPropagation(); deleteFolder(folder); }}>
                        <Icon name="trash" size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {visFiles.map(file => {
              const k = `file-${file.id}`;
              const { inFolder, opts } = moveOpts(file.id);
              return (
                <div
                  key={k}
                  className={`ef-card${selIds.has(k) ? ' sel' : ''}`}
                  onClick={() => { setMoveMenu(null); setPreview(file); }}
                  draggable
                  onDragStart={e => onDragStart(e, file.id)}
                >
                  {selIds.has(k) && <div className="ef-chk"><Icon name="check" size={11} color="#0b0d12" /></div>}
                  <div className="ef-file-thumb">
                    {isImg(file.file_type, file.cloudinary_url)
                      ? <img src={file.cloudinary_url} alt={file.file_name} onError={e => { e.target.style.display = 'none'; }} />
                      : <>
                        <FileTypeIcon fileType={file.file_type} size={30} />
                        <div className="ef-type-tag">{fileTypeLabel(file.file_type)}</div>
                      </>
                    }
                  </div>
                  <div className="ef-card-body">
                    <div className="ef-card-name" title={file.file_name}>{file.file_name}</div>
                    <div className="ef-card-meta">
                      <span>{fmtSize(file.file_size)}</span>
                      <span>{fmtDate(file.uploaded_at)}</span>
                    </div>
                    <div className="ef-card-acts">
                      <button className="ef-act" title="Preview" onClick={e => { e.stopPropagation(); setPreview(file); }}>
                        <Icon name="eye" size={13} />
                      </button>
                      <button className="ef-act" title="Rename" onClick={e => { e.stopPropagation(); setDialog({ type: 'renameFile', item: file }); }}>
                        <Icon name="pencil" size={13} />
                      </button>
                      <div className="ef-move-wrap" onClick={e => e.stopPropagation()}>
                        <button className="ef-act" title="Move to folder" onClick={e => { e.stopPropagation(); setMoveMenu(moveMenu === file.id ? null : file.id); }}>
                          <Icon name="folder" size={13} />
                        </button>
                        {moveMenu === file.id && (
                          <div className="ef-move-drop">
                            {inFolder && (
                              <div className="ef-move-opt to-root" onClick={() => moveFile(file.id, null)}>
                                <Icon name="home" size={11} color="#e0b07a" /> Remove from folder
                              </div>
                            )}
                            {opts.length === 0 && !inFolder
                              ? <div className="ef-move-opt empty">No folders yet</div>
                              : opts.map(f => (
                                <div key={f.id} className="ef-move-opt" onClick={() => moveFile(file.id, f.id)}>
                                  <Icon name="folder" size={11} color="#6eb5c8" /> {f.name}
                                </div>
                              ))
                            }
                          </div>
                        )}
                      </div>
                      <button className="ef-act" title="Select" onClick={e => { e.stopPropagation(); toggleSel(k, e); }}>
                        <Icon name="check" size={13} />
                      </button>
                      <button className="ef-act danger" title="Delete" onClick={e => { e.stopPropagation(); deleteFile(file); }}>
                        <Icon name="trash" size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {dialog?.type === 'newFolder' && <Dialog title="New Folder" placeholder="Folder name…" onConfirm={createFolder} onCancel={() => setDialog(null)} />}
      {dialog?.type === 'renameFolder' && <Dialog title="Rename Folder" defaultValue={dialog.item.name} onConfirm={renameFolder} onCancel={() => setDialog(null)} />}
      {dialog?.type === 'renameFile' && <Dialog title="Rename File" defaultValue={dialog.item.file_name} onConfirm={renameFile} onCancel={() => setDialog(null)} />}
      {preview && <Preview file={preview} onClose={() => setPreview(null)} />}
    </>
  );
}