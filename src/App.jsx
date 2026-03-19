import React, { useState, useEffect, useRef } from 'react';
import Login from './components/Login';
import EmployeeDirectory from './components/EmployeeDirectory';
import ResignedDirectory from './components/ResignedDirectory';
import BankAccounts from './components/BankAccounts';
import HardwareInventory from './components/HardwareInventory';
import PhoneInventory from './components/PhoneInventory';
import CarsInventory from './components/CarsInventory';
import Birthdays from './components/Birthdays';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.PROD 
  ? 'https://hr-file-backend.onrender.com'
  : 'http://localhost:3001';
axios.defaults.withCredentials = true;

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d0f14;
    --surface: #13161e;
    --panel: #1a1e2a;
    --card: #1c1f28;
    --border: rgba(255,255,255,0.07);
    --border-hover: rgba(255,255,255,0.13);
    --accent: #c8a96e;
    --accent-glow: rgba(200,169,110,0.25);
    --accent-dim: rgba(200,169,110,0.12);
    --text: #e8e4dc;
    --text-sub: #9a96a0;
    --text-muted: #5a5a6a;
    --error: #e05a5a;
    --success: #5acea8;
    --c-active:   #6eb5c8;
    --c-resigned: #c86e6e;
    --c-bank:     #6ec88a;
    --c-hardware: #c8a96e;
    --c-phones:   #a96ec8;
    --c-cars:     #c8706e;
    --c-birthday: #c86ea9;
  }

  html, body, #root {
    height: 100%;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    overflow-x: hidden;
  }

  .hr-shell { position: relative; min-height: 100vh; animation: fadeIn 0.4s ease; }

  .hr-shell::before {
    content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: 
      radial-gradient(ellipse 70% 50% at 10% 20%, rgba(200,169,110,0.05) 0%, transparent 60%),
      radial-gradient(ellipse 60% 60% at 90% 80%, rgba(110,181,200,0.04) 0%, transparent 60%);
  }

  .hr-shell::after {
    content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: 
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .hr-orb {
    position: fixed; border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(200,169,110,0.12), transparent 70%);
    filter: blur(40px); pointer-events: none; z-index: 0;
    animation: floatOrb 20s ease-in-out infinite;
  }
  .hr-orb-1 { width:400px; height:400px; top:5%; left:-100px; }
  .hr-orb-2 { width:350px; height:350px; bottom:5%; right:-50px; animation-delay:5s;
    background: radial-gradient(circle at 70% 70%, rgba(110,181,200,0.1), transparent 70%); }
  .hr-orb-3 { width:300px; height:300px; top:40%; left:60%; animation-delay:10s;
    background: radial-gradient(circle, rgba(200,169,110,0.08), transparent 80%); }

  @keyframes floatOrb {
    0%   { transform: translate(0,0) scale(1); }
    33%  { transform: translate(30px,-20px) scale(1.1); }
    66%  { transform: translate(-20px,30px) scale(0.9); }
    100% { transform: translate(0,0) scale(1); }
  }

  .hr-loading {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    height: 100vh; gap: 20px; animation: fadeIn 0.5s ease; position: relative; z-index: 10;
  }
  .hr-loading-logo { font-family: 'DM Serif Display', serif; font-size: 36px; color: var(--accent); letter-spacing: -1px; animation: pulseText 2s ease-in-out infinite; }
  .hr-loading-spinner { width:32px; height:32px; border:2px solid var(--border); border-top-color:var(--accent); border-radius:50%; animation:spin 0.8s linear infinite; }

  @keyframes pulseText { 0%{text-shadow:0 0 5px rgba(200,169,110,0.2)} 50%{text-shadow:0 0 30px rgba(200,169,110,0.6)} 100%{text-shadow:0 0 5px rgba(200,169,110,0.2)} }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes slideDown{ from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scaleIn  { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
  @keyframes shake    { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }

  /* ── NOTIFICATION ── */
  .hr-notification {
    position: fixed; top:24px; right:24px; z-index:99999;
    min-width:320px; max-width:400px;
    background: var(--panel); border:1px solid var(--border);
    border-radius:12px; padding:16px 20px;
    display:flex; align-items:flex-start; gap:14px;
    box-shadow:0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03);
    animation:notificationSlide 0.3s cubic-bezier(0.16,1,0.3,1);
    cursor:pointer; backdrop-filter:blur(8px);
  }
  .hr-notification.success { border-left:4px solid var(--success); }
  .hr-notification.error   { border-left:4px solid var(--error); }
  .hr-notification.info    { border-left:4px solid var(--accent); }

  @keyframes notificationSlide {
    from { opacity:0; transform:translateX(30px) translateY(-10px); }
    to   { opacity:1; transform:translateX(0) translateY(0); }
  }

  .hr-notification-icon {
    width:28px; height:28px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-size:14px; font-weight:700; flex-shrink:0;
  }
  .hr-notification.success .hr-notification-icon { background:rgba(90,206,168,0.15); color:var(--success); border:1px solid rgba(90,206,168,0.3); }
  .hr-notification.error   .hr-notification-icon { background:rgba(224,90,90,0.15);  color:var(--error);   border:1px solid rgba(224,90,90,0.3); }
  .hr-notification.info    .hr-notification-icon { background:rgba(200,169,110,0.15); color:var(--accent);  border:1px solid rgba(200,169,110,0.3); }

  .hr-notification-content { flex:1; }
  .hr-notification-title { font-weight:600; font-size:14px; margin-bottom:4px; }
  .hr-notification.success .hr-notification-title { color:var(--success); }
  .hr-notification.error   .hr-notification-title { color:var(--error); }
  .hr-notification.info    .hr-notification-title { color:var(--accent); }
  .hr-notification-message { font-size:13px; color:var(--text-sub); line-height:1.5; }

  .hr-notification-close {
    background:none; border:none; color:var(--text-muted); font-size:20px;
    cursor:pointer; padding:0; width:24px; height:24px;
    display:flex; align-items:center; justify-content:center;
    border-radius:6px; transition:all 0.2s; flex-shrink:0;
  }
  .hr-notification-close:hover { background:var(--card); color:var(--text); }

  /* ── HEADER ── */
  .hr-header {
    position:sticky; top:0; z-index:100;
    display:flex; align-items:center; justify-content:space-between;
    padding:0 32px; height:72px;
    background:rgba(13,15,20,0.85); backdrop-filter:blur(16px);
    border-bottom:1px solid var(--border); margin-bottom:20px;
    box-shadow:0 4px 20px rgba(0,0,0,0.3);
  }
  .hr-header-left { display:flex; align-items:center; gap:12px; }
  .hr-logo-image {
    width:42px; height:42px; border-radius:8px; overflow:hidden;
    display:flex; align-items:center; justify-content:center;
    background:var(--accent-dim); border:1px solid rgba(200,169,110,0.3);
    animation:logoGlow 3s ease-in-out infinite;
  }
  .hr-logo-image img { width:100%; height:100%; object-fit:contain; }
  @keyframes logoGlow {
    0%  { box-shadow:0 0 0 0 rgba(200,169,110,0.3); }
    50% { box-shadow:0 0 20px 5px rgba(200,169,110,0.5); }
    100%{ box-shadow:0 0 0 0 rgba(200,169,110,0.3); }
  }
  .hr-logo-text  { font-family:'DM Serif Display',serif; font-size:22px; color:var(--text); letter-spacing:-0.5px; }
  .hr-logo-badge { font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:var(--accent); background:var(--accent-dim); border:1px solid rgba(200,169,110,0.2); padding:3px 10px; border-radius:20px; }
  .hr-header-right { display:flex; align-items:center; gap:12px; }
  .hr-btn-search {
    display:flex; align-items:center; gap:8px; padding:8px 20px;
    background:var(--accent-dim); border:1px solid rgba(200,169,110,0.25);
    border-radius:8px; color:var(--accent);
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600;
    cursor:pointer; transition:all 0.2s; position:relative; overflow:hidden;
  }
  .hr-btn-search::before {
    content:''; position:absolute; inset:0;
    background:linear-gradient(120deg,transparent 30%,rgba(255,255,255,0.1) 50%,transparent 70%);
    transform:translateX(-100%); transition:transform 0.5s;
  }
  .hr-btn-search:hover::before { transform:translateX(100%); }
  .hr-btn-search:hover { background:rgba(200,169,110,0.2); border-color:rgba(200,169,110,0.4); box-shadow:0 0 20px var(--accent-glow); }
  .hr-btn-logout {
    display:flex; align-items:center; gap:8px; padding:8px 20px;
    background:transparent; border:1px solid var(--border); border-radius:8px;
    color:var(--text-sub); font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
    cursor:pointer; transition:all 0.2s;
  }
  .hr-btn-logout:hover { border-color:rgba(224,90,90,0.35); color:var(--error); background:rgba(224,90,90,0.06); }

  /* ── NAV ── */
  .hr-nav {
    position:relative; z-index:10;
    display:flex; align-items:center; gap:4px;
    padding:0 32px 12px; border-bottom:1px solid var(--border);
    overflow-x:auto; flex-wrap:nowrap;
  }
  .hr-nav::-webkit-scrollbar { display:none; }
  .hr-tab {
    display:flex; align-items:center; gap:8px; padding:10px 20px;
    border:none; border-radius:10px 10px 0 0; background:transparent;
    color:var(--text-muted); font-family:'DM Sans',sans-serif;
    font-size:13px; font-weight:500; cursor:pointer; white-space:nowrap;
    transition:all 0.2s; border-bottom:2px solid transparent;
  }
  .hr-tab:hover { color:var(--text-sub); background:var(--card); }
  .hr-tab.active { color:var(--text); background:var(--card); font-weight:600; }
  .hr-tab-icon { opacity:0.6; transition:opacity 0.2s; font-size:14px; }
  .hr-tab.active .hr-tab-icon { opacity:1; }

  /* ── CONTENT ── */
  .hr-content { position:relative; z-index:10; flex:1; padding:24px 32px; animation:fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both; }

  /* ── MODAL ── */
  .hr-overlay {
    position:fixed; inset:0; z-index:1000;
    background:rgba(5,6,10,0.85); backdrop-filter:blur(8px);
    display:flex; align-items:center; justify-content:center;
    animation:fadeIn 0.2s ease; padding:20px;
  }
  .hr-modal {
    background:var(--panel); border:1px solid var(--border); border-radius:20px;
    width:100%; max-width:1000px; max-height:85vh;
    display:flex; flex-direction:column;
    box-shadow:0 40px 100px rgba(0,0,0,0.7),0 0 0 1px rgba(255,255,255,0.03);
    animation:scaleIn 0.25s cubic-bezier(0.16,1,0.3,1); overflow:hidden;
  }
  .hr-modal-sm { max-width:600px; }
  .hr-modal-head {
    display:flex; align-items:center; justify-content:space-between;
    padding:22px 28px; border-bottom:1px solid var(--border); flex-shrink:0;
    background:linear-gradient(135deg,rgba(200,169,110,0.08) 0%,transparent 60%);
  }
  .hr-modal-title { font-family:'DM Serif Display',serif; font-size:22px; color:var(--text); display:flex; align-items:center; gap:10px; }
  .hr-modal-title svg { stroke:var(--accent); }
  .hr-modal-close {
    width:34px; height:34px; display:flex; align-items:center; justify-content:center;
    background:var(--card); border:1px solid var(--border); border-radius:8px;
    color:var(--text-muted); font-size:20px; cursor:pointer; transition:all 0.2s;
  }
  .hr-modal-close:hover { color:var(--text); border-color:var(--border-hover); background:var(--surface); transform:rotate(90deg); }
  .hr-modal-body { padding:24px 28px; overflow-y:auto; flex:1; }
  .hr-modal-foot {
    padding:18px 28px; border-top:1px solid var(--border);
    display:flex; justify-content:flex-end; gap:12px; flex-shrink:0; background:rgba(0,0,0,0.2);
  }

  /* search, results, cards etc */
  .hr-results-pill {
    display:inline-flex; align-items:center; gap:10px; padding:10px 20px;
    background:var(--accent-dim); border:1px solid rgba(200,169,110,0.25);
    border-radius:30px; font-size:13px; color:var(--text-sub); margin-bottom:28px; animation:slideDown 0.3s ease;
  }
  .hr-results-pill strong { color:var(--accent); font-size:15px; }
  .hr-section { margin-bottom:35px; animation:fadeUp 0.3s ease both; }
  .hr-section-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; padding-bottom:8px; border-bottom:1px solid var(--border); }
  .hr-section-title { display:flex; align-items:center; gap:10px; font-family:'DM Serif Display',serif; font-size:20px; color:var(--text); }
  .hr-section-badge { font-family:'DM Sans',sans-serif; font-size:11px; font-weight:600; padding:3px 10px; border-radius:20px; background:var(--card); border:1px solid var(--border); color:var(--text-sub); }
  .hr-section-line  { height:2px; width:40px; border-radius:2px; display:inline-block; margin-left:8px; }
  .hr-goto-btn {
    display:flex; align-items:center; gap:6px; padding:8px 16px;
    border:1px solid var(--border); border-radius:8px; background:transparent;
    color:var(--text-sub); font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500;
    cursor:pointer; transition:all 0.2s;
  }
  .hr-goto-btn:hover { border-color:var(--border-hover); color:var(--text); background:var(--card); transform:translateX(3px); }
  .hr-cards-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; }
  .hr-result-card {
    background:var(--card); border:1px solid var(--border); border-radius:14px;
    padding:18px 20px; cursor:pointer; transition:all 0.2s; position:relative; overflow:hidden;
    box-shadow:0 4px 12px rgba(0,0,0,0.2);
  }
  .hr-result-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:var(--card-accent,var(--accent)); opacity:0; transition:opacity 0.2s; }
  .hr-result-card:hover { border-color:var(--border-hover); transform:translateY(-4px); box-shadow:0 12px 28px rgba(0,0,0,0.4),0 0 0 1px var(--card-accent); }
  .hr-result-card:hover::before { opacity:1; }
  .hr-card-name { font-size:16px; font-weight:600; color:var(--text); margin-bottom:12px; padding-bottom:8px; border-bottom:1px dashed var(--border); }
  .hr-card-field { display:flex; gap:8px; font-size:13px; color:var(--text-sub); margin-bottom:6px; align-items:baseline; }
  .hr-card-label { font-weight:600; flex-shrink:0; min-width:70px; color:var(--accent); }
  .hr-card-hint { font-size:11px; color:var(--text-muted); margin-top:12px; display:flex; align-items:center; gap:5px; border-top:1px solid var(--border); padding-top:8px; }
  .hr-detail-grid { display:grid; gap:2px; }
  .hr-detail-row { display:flex; align-items:baseline; gap:16px; padding:12px 16px; border-radius:10px; transition:background 0.15s; border-bottom:1px solid var(--border); }
  .hr-detail-row:hover { background:var(--card); }
  .hr-detail-key { width:200px; flex-shrink:0; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--accent); }
  .hr-detail-val { flex:1; font-size:14px; font-weight:500; color:var(--text); word-break:break-word; }
  .hr-detail-empty { color:var(--text-muted); font-style:italic; }
  .hr-empty { display:flex; flex-direction:column; align-items:center; padding:70px 20px; gap:16px; text-align:center; background:var(--card); border-radius:20px; border:1px solid var(--border); animation:fadeUp 0.3s ease; }
  .hr-empty-icon { font-size:48px; opacity:0.5; animation:pulseText 2s ease-in-out infinite; }
  .hr-empty-title { font-size:20px; color:var(--text-sub); }
  .hr-empty-sub   { font-size:14px; color:var(--text-muted); }
  .hr-spinner-wrap { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:70px; gap:20px; }
  .hr-spinner { width:40px; height:40px; border:3px solid var(--border); border-top-color:var(--accent); border-radius:50%; animation:spin 0.7s linear infinite; }
  .hr-spinner-text { font-size:14px; color:var(--text-muted); }
  .hr-action-btn { display:inline-flex; align-items:center; gap:8px; padding:10px 22px; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.2s; border:none; }
  .hr-action-btn.primary { background:var(--accent); color:#0b0d12; }
  .hr-action-btn.primary:hover { background:#d4b87a; box-shadow:0 6px 18px var(--accent-glow); transform:translateY(-2px); }
  .hr-action-btn.ghost { background:transparent; color:var(--text-sub); border:1px solid var(--border); }
  .hr-action-btn.ghost:hover { border-color:var(--border-hover); color:var(--text); background:var(--card); }

  @media (max-width: 768px) {
    .hr-header { padding:0 16px; }
    .hr-nav { padding:0 16px 12px; }
    .hr-content { padding:16px; }
    .hr-logo-badge { display:none; }
    .hr-modal-body { padding:18px; }
    .hr-modal-head { padding:18px; }
    .hr-detail-key { width:130px; }
    .hr-notification { top:16px; right:16px; left:16px; max-width:none; }
  }
`;

const TABS = [
  { id: 'active',    label: 'Active Employees',  icon: '👥', color: 'var(--c-active)'   },
  { id: 'resigned',  label: 'Resigned',           icon: '📋', color: 'var(--c-resigned)' },
  { id: 'bank',      label: 'Bank Accounts',      icon: '🏦', color: 'var(--c-bank)'     },
  { id: 'hardware',  label: 'Hardware',           icon: '💻', color: 'var(--c-hardware)' },
  { id: 'phones',    label: 'Phones',             icon: '📱', color: 'var(--c-phones)'   },
  { id: 'cars',      label: 'Cars',               icon: '🚗', color: 'var(--c-cars)'     },
  { id: 'birthdays', label: 'Birthdays',          icon: '🎂', color: 'var(--c-birthday)' },
];

const SECTION_MAP = [
  { key: 'employees',   label: 'Active Employees',   icon: '👥', color: '#6eb5c8', tab: 'active',
    renderCard: (emp) => ({ name: emp.name, fields: [{ label: 'Position', val: emp.position }, { label: 'Status', val: emp.employment_status }] }) },
  { key: 'resigned',    label: 'Resigned Employees', icon: '📋', color: '#c86e6e', tab: 'resigned',
    renderCard: (emp) => ({ name: emp.name, fields: [{ label: 'Position', val: emp.position }, { label: 'Resigned', val: emp.resignation_date }] }) },
  { key: 'bankAccounts',label: 'Bank Accounts',      icon: '🏦', color: '#6ec88a', tab: 'bank',
    renderCard: (b)   => ({ name: b.name, fields: [{ label: 'Account', val: b.account_number }] }) },
  { key: 'hardware',    label: 'Hardware',           icon: '💻', color: '#c8a96e', tab: 'hardware',
    renderCard: (hw)  => ({ name: `${hw.hardware_type} — ${hw.brand}`, fields: [{ label: 'Hostname', val: hw.windows_hostname }, { label: 'User', val: hw.user_fullname }] }) },
  { key: 'phones',      label: 'Phones',             icon: '📱', color: '#a96ec8', tab: 'phones',
    renderCard: (p)   => ({ name: p.name, fields: [{ label: 'Unit', val: p.unit }, { label: 'Number', val: p.cellphone_number }] }) },
  { key: 'cars',        label: 'Cars',               icon: '🚗', color: '#c8706e', tab: 'cars',
    renderCard: (c)   => ({ name: c.assigned_to, fields: [{ label: 'Car', val: c.type_of_car }, { label: 'Plate', val: c.plate_number }] }) },
  { key: 'birthdays',   label: 'Birthdays',          icon: '🎂', color: '#c86ea9', tab: 'birthdays',
    renderCard: (b)   => ({ name: b.name, fields: [{ label: 'Position', val: b.position }, { label: 'Birthday', val: b.date_of_birth }] }) },
];

const DETAIL_LABEL = {
  employee: '👤 Employee Details', resigned: '📋 Resigned Employee',
  bank: '🏦 Bank Account', hardware: '💻 Hardware',
  phone: '📱 Phone', car: '🚗 Car', birthday: '🎂 Birthday',
};
const DETAIL_TAB = {
  employee: 'active', resigned: 'resigned', bank: 'bank',
  hardware: 'hardware', phone: 'phones', car: 'cars', birthday: 'birthdays',
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading]                 = useState(true);
  const [activeTab, setActiveTab]             = useState('active');
  const [showSearch, setShowSearch]           = useState(false);
  const [searchTerm, setSearchTerm]           = useState('');
  const [searchResults, setSearchResults]     = useState({ employees:[], resigned:[], bankAccounts:[], hardware:[], phones:[], cars:[], birthdays:[] });
  const [isSearching, setIsSearching]         = useState(false);
  const [showDetail, setShowDetail]           = useState(false);
  const [selectedItem, setSelectedItem]       = useState(null);
  const [selectedType, setSelectedType]       = useState('');
  const [notification, setNotification]       = useState(null);
  const notificationTimer                     = useRef(null);
  const searchInputRef                        = useRef(null);
  const searchDebounceRef                     = useRef(null);

  // ── Central notification handler — passed as onNotify to all child components ──
  const showNotification = (type, message, duration = 3000) => {
    if (notificationTimer.current) clearTimeout(notificationTimer.current);
    setNotification({ type, message });
    notificationTimer.current = setTimeout(() => setNotification(null), duration);
  };

  useEffect(() => {
    checkAuth();
    const style = document.createElement('style');
    style.innerHTML = GLOBAL_STYLES;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
      if (e.key === 'Escape') { setShowSearch(false); setShowDetail(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get('/api/auth/check-auth');
      setIsAuthenticated(res.data.authenticated);
      if (res.data.authenticated) showNotification('success', 'Welcome back! You are now logged in.');
    } catch {}
    finally { setLoading(false); }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    showNotification('success', 'Login successful! Welcome to HR-FILE.');
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      showNotification('info', 'You have been logged out successfully.');
      setTimeout(() => setIsAuthenticated(false), 500);
    } catch {
      showNotification('error', 'Logout failed. Please try again.');
      setIsAuthenticated(false);
    }
  };

  const openSearch = () => {
    setSearchTerm('');
    setSearchResults({ employees:[], resigned:[], bankAccounts:[], hardware:[], phones:[], cars:[], birthdays:[] });
    setShowSearch(true);
    setTimeout(() => searchInputRef.current?.focus(), 80);
  };

  const runSearch = async (val) => {
    if (!val.trim()) { setSearchResults({ employees:[], resigned:[], bankAccounts:[], hardware:[], phones:[], cars:[], birthdays:[] }); return; }
    setIsSearching(true);
    try {
      const [eRes, rRes, bRes, hwRes, phRes, cRes, bdRes] = await Promise.all([
        axios.get('/api/employees'), axios.get('/api/resigned-employees'),
        axios.get('/api/bank-accounts'), axios.get('/api/hardware'),
        axios.get('/api/phones'), axios.get('/api/cars'), axios.get('/api/birthdays'),
      ]);
      const term = val.toLowerCase();
      const f = (arr) => arr.filter(i => JSON.stringify(i).toLowerCase().includes(term));
      const results = { employees: f(eRes.data), resigned: f(rRes.data), bankAccounts: f(bRes.data), hardware: f(hwRes.data), phones: f(phRes.data), cars: f(cRes.data), birthdays: f(bdRes.data) };
      setSearchResults(results);
      const total = Object.values(results).reduce((s, a) => s + a.length, 0);
      showNotification(total === 0 ? 'info' : 'success', total === 0 ? `No results found for "${val}"` : `Found ${total} result${total > 1 ? 's' : ''} for "${val}"`);
    } catch {
      showNotification('error', 'Search failed. Please try again.');
    } finally { setIsSearching(false); }
  };

  const handleSearchInput = (val) => {
    setSearchTerm(val);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => runSearch(val), 400);
  };

  const handleSearch = () => { if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current); runSearch(searchTerm); };

  const openDetail = (item, type) => { setSelectedItem(item); setSelectedType(type); setShowDetail(true); };

  const goToTab = (tab) => {
    setActiveTab(tab);
    setShowSearch(false);
    setShowDetail(false);
    showNotification('info', `Switched to ${TABS.find(t => t.id === tab)?.label || tab} tab`);
  };

  const totalResults = () => Object.values(searchResults).reduce((s, a) => s + a.length, 0);
  const hasSearched  = searchTerm && !isSearching;

  if (loading) return (
    <div className="hr-loading">
      <div className="hr-loading-logo">HR-FILE</div>
      <div className="hr-loading-spinner" />
    </div>
  );

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  return (
    <div className="hr-shell">
      <div className="hr-orb hr-orb-1" />
      <div className="hr-orb hr-orb-2" />
      <div className="hr-orb hr-orb-3" />

      <header className="hr-header">
        <div className="hr-header-left">
          <div className="hr-logo-image"><img src="/deltaplus2.png" alt="DeltaPlus Logo" /></div>
          <span className="hr-logo-text">HR-FILE</span>
          <span className="hr-logo-badge">System</span>
        </div>
        <div className="hr-header-right">
          <button className="hr-btn-search" onClick={openSearch}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            Search
            <span style={{ fontSize:'11px', opacity:0.6, marginLeft:2 }}>⌘K</span>
          </button>
          <button className="hr-btn-logout" onClick={handleLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      <nav className="hr-nav">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`hr-tab${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={activeTab === tab.id ? { borderBottomColor: tab.color } : {}}
          >
            <span className="hr-tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="hr-content" key={activeTab}>
        {activeTab === 'active'    && <EmployeeDirectory onNotify={showNotification} />}
        {activeTab === 'resigned'  && <ResignedDirectory onNotify={showNotification} />}
        {activeTab === 'bank'      && <BankAccounts      onNotify={showNotification} />}
        {activeTab === 'hardware'  && <HardwareInventory onNotify={showNotification} />}
        {activeTab === 'phones'    && <PhoneInventory    onNotify={showNotification} />}
        {activeTab === 'cars'      && <CarsInventory     onNotify={showNotification} />}
        {activeTab === 'birthdays' && <Birthdays         onNotify={showNotification} />}
      </main>

      {/* ── SEARCH MODAL - SIMPLE AT TAMA NA ── */}
      {showSearch && (
        <div className="hr-overlay" onClick={() => setShowSearch(false)}>
          <div className="hr-modal" style={{ maxWidth: 800 }} onClick={e => e.stopPropagation()}>
            <div className="hr-modal-head">
              <div className="hr-modal-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                Global Search
              </div>
              <button className="hr-modal-close" onClick={() => setShowSearch(false)}>×</button>
            </div>
            
            <div className="hr-modal-body">
              {/* SIMPLE SEARCH - no fancy styles */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search anything..."
                  value={searchTerm}
                  onChange={e => handleSearchInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: '#1c1f28',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    color: '#e8e4dc',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  style={{
                    padding: '12px 24px',
                    background: '#c8a96e',
                    color: '#0b0d12',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    minWidth: '100px'
                  }}
                >
                  {isSearching ? '...' : 'Search'}
                </button>
              </div>

              {isSearching && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div className="hr-spinner" />
                  <p style={{ marginTop: '16px', color: '#9a96a0' }}>Searching...</p>
                </div>
              )}

              {hasSearched && !isSearching && (
                <div className="hr-results-pill">
                  <strong>{totalResults()}</strong> results for "{searchTerm}"
                </div>
              )}

              {!isSearching && SECTION_MAP.map(section => {
                const items = searchResults[section.key];
                if (!items || items.length === 0) return null;
                return (
                  <div className="hr-section" key={section.key}>
                    <div className="hr-section-head">
                      <div className="hr-section-title">
                        {section.icon} {section.label} ({items.length})
                      </div>
                      <button className="hr-goto-btn" onClick={() => goToTab(section.tab)}>
                        Go to {section.label} →
                      </button>
                    </div>
                    <div className="hr-cards-grid">
                      {items.map((item, idx) => {
                        const card = section.renderCard(item);
                        const typeKey = section.key === 'bankAccounts' ? 'bank'
                          : section.key === 'phones' ? 'phone'
                          : section.key === 'cars' ? 'car'
                          : section.key === 'birthdays' ? 'birthday'
                          : section.key === 'resigned' ? 'resigned'
                          : section.key === 'hardware' ? 'hardware'
                          : 'employee';
                        return (
                          <div
                            key={item.id ?? idx}
                            className="hr-result-card"
                            onClick={() => openDetail(item, typeKey)}
                          >
                            <div className="hr-card-name">{card.name}</div>
                            {card.fields.map(f => (
                              <div className="hr-card-field" key={f.label}>
                                <span className="hr-card-label">{f.label}:</span>
                                <span>{f.val || '—'}</span>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {hasSearched && !isSearching && totalResults() === 0 && (
                <div className="hr-empty">
                  <div className="hr-empty-icon">🔍</div>
                  <div className="hr-empty-title">No results for "{searchTerm}"</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* DETAIL MODAL */}
      {showDetail && selectedItem && (
        <div className="hr-overlay" onClick={() => setShowDetail(false)}>
          <div className="hr-modal hr-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="hr-modal-head">
              <div className="hr-modal-title">{DETAIL_LABEL[selectedType]||'Details'}</div>
              <button className="hr-modal-close" onClick={() => setShowDetail(false)}>×</button>
            </div>
            <div className="hr-modal-body">
              <div className="hr-detail-grid">
                {Object.entries(selectedItem).filter(([k]) => !['id','created_at','updated_at'].includes(k)).map(([key,val]) => (
                  <div className="hr-detail-row" key={key}>
                    <div className="hr-detail-key">{key.replace(/_/g,' ')}</div>
                    <div className={`hr-detail-val${!val?' hr-detail-empty':''}`}>{val||'Not set'}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hr-modal-foot">
              <button className="hr-action-btn ghost" onClick={() => setShowDetail(false)}>Close</button>
              <button className="hr-action-btn primary" onClick={() => goToTab(DETAIL_TAB[selectedType]||'active')}>
                Open in tab
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SINGLE NOTIFICATION SYSTEM for the entire app ── */}
      {notification && (
        <div className={`hr-notification ${notification.type}`} onClick={() => setNotification(null)}>
          <div className="hr-notification-icon">
            {notification.type === 'success' && '✓'}
            {notification.type === 'error'   && '✕'}
            {notification.type === 'info'    && 'ℹ'}
          </div>
          <div className="hr-notification-content">
            <div className="hr-notification-title">
              {notification.type === 'success' && 'Success'}
              {notification.type === 'error'   && 'Error'}
              {notification.type === 'info'    && 'Information'}
            </div>
            <div className="hr-notification-message">{notification.message}</div>
          </div>
          <button className="hr-notification-close" onClick={e => { e.stopPropagation(); setNotification(null); }}>×</button>
        </div>
      )}
    </div>
  );
}