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
  ? 'https://hr-file-backend.onrender.com'  // i-check na tama ang URL
  : 'http://localhost:3001';
axios.defaults.withCredentials = true;
axios.defaults.withCredentials = true;

/* ─────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────── */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:           #0b0d12;
    --surface:      #111318;
    --panel:        #161920;
    --card:         #1c1f28;
    --border:       rgba(255,255,255,0.07);
    --border-hover: rgba(255,255,255,0.13);
    --accent:       #c8a96e;
    --accent-glow:  rgba(200,169,110,0.22);
    --accent-dim:   rgba(200,169,110,0.10);
    --text:         #e8e4dc;
    --text-sub:     #9a96a0;
    --text-muted:   #5a5a6a;
    --error:        #e05a5a;
    --success:      #5acea8;

    --tab-active:   #c8a96e;
    --tab-bg:       #1c1f28;

    /* per-section accent colors */
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

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(200,169,110,0.35); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    from { background-position: -200% center; }
    to   { background-position:  200% center; }
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }

  /* Loading screen */
  .hr-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    gap: 20px;
    animation: fadeIn 0.5s ease;
  }
  .hr-loading-logo {
    font-family: 'DM Serif Display', serif;
    font-size: 36px;
    color: var(--accent);
    letter-spacing: -1px;
  }
  .hr-loading-spinner {
    width: 32px; height: 32px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  /* ── DASHBOARD SHELL ── */
  .hr-shell {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    animation: fadeIn 0.4s ease;
  }

  /* Ambient bg */
  .hr-shell::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 55% 40% at 10% 10%, rgba(200,169,110,0.05) 0%, transparent 60%),
      radial-gradient(ellipse 50% 50% at 90% 80%, rgba(110,181,200,0.04) 0%, transparent 60%);
  }

  /* Grid */
  .hr-shell::after {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* ── HEADER ── */
  .hr-header {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px;
    height: 64px;
    background: rgba(11,13,18,0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
  }

  .hr-header-left {
    display: flex; align-items: center; gap: 14px;
  }

  .hr-logo-icon {
    width: 36px; height: 36px;
    background: var(--accent-dim);
    border: 1px solid rgba(200,169,110,0.3);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
  }
  .hr-logo-icon svg { width: 18px; height: 18px; stroke: var(--accent); fill: none; stroke-width: 1.5; }

  .hr-logo-text {
    font-family: 'DM Serif Display', serif;
    font-size: 20px; color: var(--text);
    letter-spacing: -0.5px;
  }
  .hr-logo-badge {
    font-size: 10px; font-weight: 600;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--accent);
    background: var(--accent-dim);
    border: 1px solid rgba(200,169,110,0.2);
    padding: 2px 8px; border-radius: 4px;
  }

  .hr-header-right { display: flex; align-items: center; gap: 10px; }

  .hr-btn-search {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 16px;
    background: var(--accent-dim);
    border: 1px solid rgba(200,169,110,0.25);
    border-radius: 8px;
    color: var(--accent);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
  }
  .hr-btn-search:hover {
    background: rgba(200,169,110,0.18);
    border-color: rgba(200,169,110,0.4);
    box-shadow: 0 0 14px var(--accent-glow);
  }

  .hr-btn-logout {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 16px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-sub);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .hr-btn-logout:hover {
    border-color: rgba(224,90,90,0.35);
    color: var(--error);
    background: rgba(224,90,90,0.06);
  }

  /* ── TAB NAV ── */
  .hr-nav {
    position: relative; z-index: 1;
    display: flex; align-items: center; gap: 2px;
    padding: 12px 32px 0;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    overflow-x: auto;
  }
  .hr-nav::-webkit-scrollbar { display: none; }

  .hr-tab {
    display: flex; align-items: center; gap: 7px;
    padding: 10px 18px;
    border: none; border-radius: 8px 8px 0 0;
    background: transparent;
    color: var(--text-muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    cursor: pointer; white-space: nowrap;
    position: relative; bottom: -1px;
    border-bottom: 2px solid transparent;
    transition: color 0.2s, background 0.2s, border-color 0.2s;
  }
  .hr-tab:hover { color: var(--text-sub); background: var(--card); }
  .hr-tab.active {
    color: var(--text);
    background: var(--card);
    border-bottom-color: var(--accent);
  }
  .hr-tab.active .hr-tab-icon { opacity: 1; }
  .hr-tab-icon { opacity: 0.5; transition: opacity 0.2s; font-size: 14px; }

  /* ── CONTENT AREA ── */
  .hr-content {
    position: relative; z-index: 1;
    flex: 1;
    padding: 28px 32px;
    animation: fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both;
  }

  /* ── MODAL OVERLAY ── */
  .hr-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(5,6,10,0.75);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.2s ease;
    padding: 20px;
  }

  .hr-modal {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 16px;
    width: 100%; max-width: 900px;
    max-height: 85vh;
    display: flex; flex-direction: column;
    box-shadow: 0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03);
    animation: scaleIn 0.25s cubic-bezier(0.16,1,0.3,1);
    overflow: hidden;
  }

  .hr-modal-sm { max-width: 680px; }

  .hr-modal-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 22px 28px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .hr-modal-title {
    font-family: 'DM Serif Display', serif;
    font-size: 22px; color: var(--text);
    display: flex; align-items: center; gap: 10px;
  }

  .hr-modal-close {
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-muted);
    font-size: 18px; line-height: 1;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .hr-modal-close:hover { color: var(--text); border-color: var(--border-hover); background: var(--surface); }

  .hr-modal-body {
    padding: 24px 28px;
    overflow-y: auto; flex: 1;
  }

  .hr-modal-foot {
    padding: 16px 28px;
    border-top: 1px solid var(--border);
    display: flex; justify-content: flex-end; gap: 10px;
    flex-shrink: 0;
  }

  /* ── SEARCH ── */
  .hr-search-row {
    display: flex; gap: 10px;
    margin-bottom: 24px;
    align-items: stretch;
  }

  .hr-search-input-wrap {
    flex: 1; position: relative; min-width: 0;
  }
  .hr-search-input-wrap svg {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%);
    width: 16px; height: 16px;
    stroke: #9a96a0; fill: none; stroke-width: 1.5;
    pointer-events: none; z-index: 1;
  }

  .hr-search-input {
    display: block;
    width: 100%;
    background: #1c1f28 !important;
    border: 1px solid rgba(255,255,255,0.15) !important;
    border-radius: 10px;
    padding: 13px 16px 13px 42px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px !important;
    line-height: 1.5;
    color: #e8e4dc !important;
    -webkit-text-fill-color: #e8e4dc !important;
    outline: none !important;
    box-shadow: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    caret-color: #c8a96e;
    appearance: none;
    -webkit-appearance: none;
    min-height: 48px;
    box-sizing: border-box;
  }
  .hr-search-input::placeholder { color: #5a5a6a !important; opacity: 1; }
  .hr-search-input:focus {
    border-color: rgba(200,169,110,0.6) !important;
    box-shadow: 0 0 0 3px rgba(200,169,110,0.15) !important;
  }

  .hr-search-go {
    flex-shrink: 0;
    width: auto;
    padding: 0 28px;
    min-height: 48px;
    background: #c8a96e;
    color: #0b0d12;
    border: none; border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
    position: relative; overflow: hidden;
  }
  .hr-search-go::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%);
    transform: translateX(-100%); transition: transform 0.4s;
  }
  .hr-search-go:hover::before { transform: translateX(100%); }
  .hr-search-go:hover { background: #d4b87a; box-shadow: 0 4px 16px rgba(200,169,110,0.3); }
  .hr-search-go:active { transform: scale(0.97); }
  .hr-search-go:disabled { opacity: 0.6; pointer-events: none; }

  /* Search summary pill */
  .hr-results-pill {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 16px;
    background: var(--accent-dim);
    border: 1px solid rgba(200,169,110,0.2);
    border-radius: 20px;
    font-size: 13px; color: var(--text-sub);
    margin-bottom: 24px;
  }
  .hr-results-pill strong { color: var(--accent); font-size: 15px; }

  /* ── SECTION GROUP ── */
  .hr-section { margin-bottom: 32px; animation: fadeUp 0.3s ease both; }

  .hr-section-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 14px;
  }

  .hr-section-title {
    display: flex; align-items: center; gap: 10px;
    font-family: 'DM Serif Display', serif;
    font-size: 18px; color: var(--text);
  }

  .hr-section-badge {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 600;
    padding: 2px 8px; border-radius: 20px;
    background: var(--card);
    border: 1px solid var(--border);
    color: var(--text-sub);
  }

  .hr-section-line {
    height: 2px; width: 32px; border-radius: 2px;
    display: inline-block; margin-left: 4px;
  }

  .hr-goto-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 7px 14px;
    border: 1px solid var(--border);
    border-radius: 7px;
    background: transparent;
    color: var(--text-sub);
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  .hr-goto-btn:hover {
    border-color: var(--border-hover);
    color: var(--text);
    background: var(--card);
  }

  /* ── RESULT CARDS GRID ── */
  .hr-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 12px;
  }

  .hr-result-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 18px;
    cursor: pointer;
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
    position: relative; overflow: hidden;
  }
  .hr-result-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--card-accent, transparent);
    opacity: 0; transition: opacity 0.2s;
  }
  .hr-result-card:hover {
    border-color: var(--border-hover);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }
  .hr-result-card:hover::before { opacity: 1; }

  .hr-card-name {
    font-size: 15px; font-weight: 600; color: var(--text);
    margin-bottom: 10px;
  }

  .hr-card-field {
    display: flex; gap: 6px;
    font-size: 12.5px; color: var(--text-sub);
    margin-bottom: 5px; align-items: baseline;
  }
  .hr-card-label { font-weight: 600; flex-shrink: 0; }
  .hr-card-hint {
    font-size: 11px; color: var(--text-muted);
    margin-top: 10px;
    display: flex; align-items: center; gap: 4px;
  }

  /* ── DETAIL MODAL FIELDS ── */
  .hr-detail-grid {
    display: grid; gap: 2px;
  }

  .hr-detail-row {
    display: flex; align-items: baseline; gap: 12px;
    padding: 11px 14px;
    border-radius: 8px;
    transition: background 0.15s;
  }
  .hr-detail-row:hover { background: var(--card); }
  .hr-detail-key {
    width: 180px; flex-shrink: 0;
    font-size: 11px; font-weight: 600;
    letter-spacing: 1px; text-transform: uppercase;
    color: var(--text-muted);
  }
  .hr-detail-val {
    flex: 1; font-size: 14px; font-weight: 500; color: var(--text);
    word-break: break-word;
  }
  .hr-detail-empty { color: var(--text-muted); font-style: italic; }

  /* ── EMPTY STATE ── */
  .hr-empty {
    display: flex; flex-direction: column; align-items: center;
    padding: 60px 20px; gap: 12px; text-align: center;
  }
  .hr-empty-icon { font-size: 40px; opacity: 0.4; }
  .hr-empty-title { font-size: 18px; color: var(--text-sub); }
  .hr-empty-sub { font-size: 13px; color: var(--text-muted); }

  /* ── SPINNER ── */
  .hr-spinner-wrap {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 60px; gap: 16px;
  }
  .hr-spinner {
    width: 36px; height: 36px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  .hr-spinner-text { font-size: 13px; color: var(--text-muted); }

  /* ── ACTION BUTTONS ── */
  .hr-action-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 18px;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .hr-action-btn.primary {
    background: var(--accent);
    color: #0b0d12;
    border: none;
  }
  .hr-action-btn.primary:hover {
    background: #d4b87a;
    box-shadow: 0 4px 14px var(--accent-glow);
  }
  .hr-action-btn.ghost {
    background: transparent;
    color: var(--text-sub);
    border: 1px solid var(--border);
  }
  .hr-action-btn.ghost:hover {
    border-color: var(--border-hover);
    color: var(--text);
    background: var(--card);
  }

  @media (max-width: 640px) {
    .hr-header { padding: 0 16px; }
    .hr-nav    { padding: 10px 16px 0; }
    .hr-content { padding: 20px 16px; }
    .hr-logo-badge { display: none; }
    .hr-modal-body { padding: 18px; }
    .hr-modal-head { padding: 18px; }
    .hr-detail-key { width: 130px; }
  }
`;

/* ─────────────────────────────────────────
   TAB CONFIG
───────────────────────────────────────── */
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
  { key: 'employees', label: 'Active Employees',  icon: '👥', color: '#6eb5c8', tab: 'active',
    renderCard: (emp) => ({ name: emp.name, fields: [{ label: 'Position', val: emp.position }, { label: 'Status', val: emp.employment_status }] }) },
  { key: 'resigned',  label: 'Resigned Employees',icon: '📋', color: '#c86e6e', tab: 'resigned',
    renderCard: (emp) => ({ name: emp.name, fields: [{ label: 'Position', val: emp.position }, { label: 'Resigned', val: emp.resignation_date }] }) },
  { key: 'bankAccounts', label: 'Bank Accounts',  icon: '🏦', color: '#6ec88a', tab: 'bank',
    renderCard: (b)   => ({ name: b.name, fields: [{ label: 'Account', val: b.account_number }] }) },
  { key: 'hardware',  label: 'Hardware',           icon: '💻', color: '#c8a96e', tab: 'hardware',
    renderCard: (hw)  => ({ name: `${hw.hardware_type} — ${hw.brand}`, fields: [{ label: 'Hostname', val: hw.windows_hostname }, { label: 'User', val: hw.user_fullname }] }) },
  { key: 'phones',    label: 'Phones',             icon: '📱', color: '#a96ec8', tab: 'phones',
    renderCard: (p)   => ({ name: p.name, fields: [{ label: 'Unit', val: p.unit }, { label: 'Number', val: p.cellphone_number }] }) },
  { key: 'cars',      label: 'Cars',               icon: '🚗', color: '#c8706e', tab: 'cars',
    renderCard: (c)   => ({ name: c.assigned_to, fields: [{ label: 'Car', val: c.type_of_car }, { label: 'Plate', val: c.plate_number }] }) },
  { key: 'birthdays', label: 'Birthdays',          icon: '🎂', color: '#c86ea9', tab: 'birthdays',
    renderCard: (b)   => ({ name: b.name, fields: [{ label: 'Position', val: b.position }, { label: 'Birthday', val: b.date_of_birth }] }) },
];

/* ─────────────────────────────────────────
   DETAIL TYPE LABELS
───────────────────────────────────────── */
const DETAIL_LABEL = {
  employee: '👤 Employee Details',
  resigned: '📋 Resigned Employee',
  bank:     '🏦 Bank Account',
  hardware: '💻 Hardware',
  phone:    '📱 Phone',
  car:      '🚗 Car',
  birthday: '🎂 Birthday',
};
const DETAIL_TAB = {
  employee: 'active', resigned: 'resigned', bank: 'bank',
  hardware: 'hardware', phone: 'phones', car: 'cars', birthday: 'birthdays',
};

/* ─────────────────────────────────────────
   APP COMPONENT
───────────────────────────────────────── */
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading]                 = useState(true);
  const [activeTab, setActiveTab]             = useState('active');

  // Search
  const [showSearch, setShowSearch]   = useState(false);
  const [searchTerm, setSearchTerm]   = useState('');
  const [searchResults, setSearchResults] = useState({
    employees: [], resigned: [], bankAccounts: [],
    hardware: [], phones: [], cars: [], birthdays: []
  });
  const [isSearching, setIsSearching] = useState(false);

  // Detail
  const [showDetail, setShowDetail]   = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState('');

  const searchInputRef = useRef(null);

  useEffect(() => {
    checkAuth();
    const style = document.createElement('style');
    style.innerHTML = GLOBAL_STYLES;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  // Keyboard shortcut: Cmd/Ctrl+K to open search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowDetail(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get('/api/auth/check-auth');
      setIsAuthenticated(res.data.authenticated);
    } catch { /* noop */ }
    finally { setLoading(false); }
  };

  const handleLogin  = () => setIsAuthenticated(true);
  const handleLogout = async () => {
    try { await axios.post('/api/auth/logout'); } catch { /* noop */ }
    setIsAuthenticated(false);
  };

  const searchDebounceRef = useRef(null);

  const openSearch = () => {
    setSearchTerm('');
    setSearchResults({ employees: [], resigned: [], bankAccounts: [], hardware: [], phones: [], cars: [], birthdays: [] });
    setShowSearch(true);
    setTimeout(() => searchInputRef.current?.focus(), 80);
  };

  const runSearch = async (val) => {
    if (!val.trim()) {
      setSearchResults({ employees: [], resigned: [], bankAccounts: [], hardware: [], phones: [], cars: [], birthdays: [] });
      return;
    }
    setIsSearching(true);
    try {
      const [eRes, rRes, bRes, hwRes, phRes, cRes, bdRes] = await Promise.all([
        axios.get('/api/employees'),
        axios.get('/api/resigned-employees'),
        axios.get('/api/bank-accounts'),
        axios.get('/api/hardware'),
        axios.get('/api/phones'),
        axios.get('/api/cars'),
        axios.get('/api/birthdays'),
      ]);
      const term = val.toLowerCase();
      const f = (arr) => arr.filter(i => JSON.stringify(i).toLowerCase().includes(term));
      setSearchResults({
        employees:    f(eRes.data),
        resigned:     f(rRes.data),
        bankAccounts: f(bRes.data),
        hardware:     f(hwRes.data),
        phones:       f(phRes.data),
        cars:         f(cRes.data),
        birthdays:    f(bdRes.data),
      });
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInput = (val) => {
    setSearchTerm(val);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => runSearch(val), 400);
  };

  const handleSearch = () => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    runSearch(searchTerm);
  };

  const openDetail = (item, type) => {
    setSelectedItem(item);
    setSelectedType(type);
    setShowDetail(true);
  };

  const goToTab = (tab) => {
    setActiveTab(tab);
    setShowSearch(false);
    setShowDetail(false);
  };

  const totalResults = () => Object.values(searchResults).reduce((s, a) => s + a.length, 0);
  const hasSearched  = searchTerm && !isSearching;

  if (loading) {
    return (
      <div className="hr-loading">
        <div className="hr-loading-logo">HR-FILE</div>
        <div className="hr-loading-spinner" />
      </div>
    );
  }

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  return (
    <div className="hr-shell">

      {/* ── HEADER ── */}
      <header className="hr-header">
        <div className="hr-header-left">
          <div className="hr-logo-icon">
            <svg viewBox="0 0 24 24">
              <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
              <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
            </svg>
          </div>
          <span className="hr-logo-text">HR-FILE</span>
          <span className="hr-logo-badge">System</span>
        </div>

        <div className="hr-header-right">
          <button className="hr-btn-search" onClick={openSearch}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            Search
            <span style={{ fontSize: '11px', opacity: 0.6, marginLeft: 2 }}>⌘K</span>
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

      {/* ── TAB NAV ── */}
      <nav className="hr-nav">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`hr-tab${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={activeTab === tab.id ? { '--tw-border-color': tab.color, borderBottomColor: tab.color } : {}}
          >
            <span className="hr-tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ── CONTENT ── */}
      <main className="hr-content" key={activeTab}>
        {activeTab === 'active'    && <EmployeeDirectory />}
        {activeTab === 'resigned'  && <ResignedDirectory />}
        {activeTab === 'bank'      && <BankAccounts />}
        {activeTab === 'hardware'  && <HardwareInventory />}
        {activeTab === 'phones'    && <PhoneInventory />}
        {activeTab === 'cars'      && <CarsInventory />}
        {activeTab === 'birthdays' && <Birthdays />}
      </main>

      {/* ── SEARCH MODAL ── */}
      {showSearch && (
        <div className="hr-overlay" onClick={() => setShowSearch(false)}>
          <div className="hr-modal" style={{ maxWidth: 960 }} onClick={e => e.stopPropagation()}>

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
              {/* Input */}
              <div style={{ display:'flex', gap:'10px', marginBottom:'24px', alignItems:'stretch' }}>
                <div style={{ flex:1, position:'relative', minWidth:0 }}>
                  <svg viewBox="0 0 24 24" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', width:16, height:16, stroke:'#9a96a0', fill:'none', strokeWidth:1.5, pointerEvents:'none' }}>
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search anything — name, position, serial number, plate, account…"
                    value={searchTerm}
                    onChange={e => handleSearchInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    style={{
                      display:'block', width:'100%', boxSizing:'border-box',
                      background:'#1c1f28', border:'1px solid rgba(255,255,255,0.15)',
                      borderRadius:10, padding:'13px 16px 13px 42px',
                      fontFamily:'DM Sans, sans-serif', fontSize:14,
                      color:'#e8e4dc', outline:'none', minHeight:48,
                      caretColor:'#c8a96e',
                    }}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  style={{
                    flexShrink:0, width:'auto', padding:'0 28px', minHeight:48,
                    background:'#c8a96e', color:'#0b0d12', border:'none',
                    borderRadius:10, fontFamily:'DM Sans, sans-serif',
                    fontSize:14, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap',
                    opacity: isSearching ? 0.6 : 1,
                  }}
                >
                  {isSearching ? 'Searching…' : 'Search'}
                </button>
              </div>

              {/* Spinner */}
              {isSearching && (
                <div className="hr-spinner-wrap">
                  <div className="hr-spinner" />
                  <span className="hr-spinner-text">Searching all records…</span>
                </div>
              )}

              {/* Summary pill */}
              {hasSearched && !isSearching && (
                <div className="hr-results-pill">
                  <strong>{totalResults()}</strong>
                  {totalResults() === 1 ? 'result' : 'results'} for "{searchTerm}"
                </div>
              )}

              {/* Sections */}
              {!isSearching && SECTION_MAP.map(section => {
                const items = searchResults[section.key];
                if (!items || items.length === 0) return null;
                return (
                  <div className="hr-section" key={section.key}>
                    <div className="hr-section-head">
                      <div className="hr-section-title">
                        {section.icon}
                        {section.label}
                        <span className="hr-section-badge">{items.length}</span>
                        <span className="hr-section-line" style={{ background: section.color }} />
                      </div>
                      <button className="hr-goto-btn" onClick={() => goToTab(section.tab)}>
                        Go to {section.label}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
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
                            style={{ '--card-accent': section.color }}
                            onClick={() => openDetail(item, typeKey)}
                          >
                            <div className="hr-card-name">{card.name}</div>
                            {card.fields.map(f => (
                              <div className="hr-card-field" key={f.label}>
                                <span className="hr-card-label" style={{ color: section.color }}>{f.label}:</span>
                                <span>{f.val || '—'}</span>
                              </div>
                            ))}
                            <div className="hr-card-hint">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
                              </svg>
                              Click to view all details
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* No results */}
              {hasSearched && !isSearching && totalResults() === 0 && (
                <div className="hr-empty">
                  <div className="hr-empty-icon">🔍</div>
                  <div className="hr-empty-title">No results for "{searchTerm}"</div>
                  <div className="hr-empty-sub">Try a different keyword or check the spelling</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── DETAIL MODAL ── */}
      {showDetail && selectedItem && (
        <div className="hr-overlay" onClick={() => setShowDetail(false)}>
          <div className="hr-modal hr-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="hr-modal-head">
              <div className="hr-modal-title">
                {DETAIL_LABEL[selectedType] || 'Details'}
              </div>
              <button className="hr-modal-close" onClick={() => setShowDetail(false)}>×</button>
            </div>

            <div className="hr-modal-body">
              <div className="hr-detail-grid">
                {Object.entries(selectedItem)
                  .filter(([k]) => !['id','created_at','updated_at'].includes(k))
                  .map(([key, val]) => (
                    <div className="hr-detail-row" key={key}>
                      <div className="hr-detail-key">{key.replace(/_/g, ' ')}</div>
                      <div className={`hr-detail-val${!val ? ' hr-detail-empty' : ''}`}>
                        {val || 'Not set'}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            <div className="hr-modal-foot">
              <button className="hr-action-btn ghost" onClick={() => setShowDetail(false)}>
                Close
              </button>
              <button
                className="hr-action-btn primary"
                onClick={() => goToTab(DETAIL_TAB[selectedType] || 'active')}
              >
                Open in tab
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}