import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .ca-wrap * { box-sizing: border-box; }
  .ca-wrap { font-family: 'DM Sans', sans-serif; color: #e8e4dc; position: relative; z-index: 10; }

  /* Background Effects */
  .ca-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
  }
  .ca-bg::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 40% at 10% 20%, rgba(200,112,110,0.03) 0%, transparent 60%),
                radial-gradient(ellipse 50% 50% at 90% 80%, rgba(200,169,110,0.02) 0%, transparent 60%);
    animation: caBgPulse 8s ease-in-out infinite;
  }
  .ca-bg::after {
    content: ''; position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  @keyframes caBgPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }

  /* Floating Orbs */
  .ca-orb {
    position: fixed; border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(200,112,110,0.08), transparent 70%);
    filter: blur(40px); pointer-events: none; z-index: 0;
    animation: caFloatOrb 20s ease-in-out infinite;
  }
  .ca-orb-1 { width:300px; height:300px; top:10%; right:-50px; }
  .ca-orb-2 { width:250px; height:250px; bottom:5%; left:-30px; animation-delay:5s;
    background: radial-gradient(circle at 70% 70%, rgba(200,169,110,0.08), transparent 70%); }
  @keyframes caFloatOrb {
    0%   { transform: translate(0,0) scale(1); }
    33%  { transform: translate(20px,-20px) scale(1.1); }
    66%  { transform: translate(-20px,20px) scale(0.9); }
    100% { transform: translate(0,0) scale(1); }
  }

  /* Header */
  .ca-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 28px; flex-wrap: wrap; gap: 16px;
    animation: caFadeDown 0.5s ease;
  }
  @keyframes caFadeDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }

  .ca-title-group { display: flex; align-items: center; gap: 16px; }
  .ca-title-icon {
    width: 48px; height: 48px;
    background: rgba(200,112,110,0.12); border: 1px solid rgba(200,112,110,0.3);
    border-radius: 12px; display: flex; align-items: center; justify-content: center;
    font-size: 22px; animation: caIconPulse 3s ease-in-out infinite;
  }
  @keyframes caIconPulse {
    0%  { box-shadow: 0 0 0 0 rgba(200,112,110,0.3); }
    50% { box-shadow: 0 0 20px 5px rgba(200,112,110,0.5); }
    100%{ box-shadow: 0 0 0 0 rgba(200,112,110,0.3); }
  }
  .ca-title { font-family:'DM Serif Display',serif; font-size:28px; color:#e8e4dc; letter-spacing:-0.5px; }
  .ca-count {
    font-size:11px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase;
    color:#c8706e; background:rgba(200,112,110,0.1); border:1px solid rgba(200,112,110,0.2);
    padding:4px 12px; border-radius:20px;
  }

  .ca-add-btn {
    display:flex; align-items:center; gap:8px;
    padding:12px 24px; background:#c8706e; color:#0b0d12;
    border:none; border-radius:10px;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700;
    cursor:pointer; position:relative; overflow:hidden; transition:all 0.2s;
  }
  .ca-add-btn::before {
    content:''; position:absolute; inset:0;
    background:linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%);
    transform:translateX(-100%); transition:transform 0.5s;
  }
  .ca-add-btn:hover::before { transform:translateX(100%); }
  .ca-add-btn:hover { background:#d4807e; box-shadow:0 6px 20px rgba(200,112,110,0.4); transform:translateY(-2px); }
  .ca-add-btn:active { transform:translateY(0); }

  /* Search */
  .ca-search-wrap {
    position: relative; margin-bottom: 24px;
  }
  .ca-search-wrap svg {
    position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
    width: 18px; height: 18px; stroke: #5a5a6a; fill: none; stroke-width: 1.8;
    pointer-events: none; transition: stroke 0.2s; z-index: 1;
  }
  .ca-search-wrap:focus-within svg { stroke: #c8706e; }

  .ca-search {
    width: 100%; background: #1c1f28; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px; padding: 14px 18px 14px 46px;
    font-family: 'DM Sans', sans-serif; font-size: 15px; color: #e8e4dc;
    outline: none; transition: all 0.2s; caret-color: #c8706e;
  }
  .ca-search::placeholder { color: #5a5a6a; }
  .ca-search:focus { border-color: rgba(200,112,110,0.5); box-shadow: 0 0 0 3px rgba(200,112,110,0.15); transform:translateY(-2px); }

  .ca-search-clear {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: #2a2d38; border: none; width: 26px; height: 26px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #9a96a0; font-size: 16px; cursor: pointer; transition: all 0.2s; z-index: 1;
  }
  .ca-search-clear:hover { background: #3a3d4a; color: #e8e4dc; transform: translateY(-50%) scale(1.1); }

  .ca-result-info { font-size: 13px; color: #5a5a6a; margin-bottom: 16px; padding-left: 4px; }
  .ca-result-info span { color: #c8706e; font-weight: 600; }

  /* Table */
  .ca-table-container {
    background: #161920; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    animation: caSlideUp 0.5s ease 0.3s both;
  }
  @keyframes caSlideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }

  .ca-table { width:100%; border-collapse:collapse; min-width:820px; }
  .ca-table thead tr { background:#1c1f28; border-bottom:1px solid rgba(255,255,255,0.07); }
  .ca-table th {
    padding:16px 20px; font-size:11px; font-weight:700; letter-spacing:1.5px;
    text-transform:uppercase; color:#5a5a6a; text-align:left;
  }
  .ca-table tbody tr {
    border-bottom:1px solid rgba(255,255,255,0.04); transition:all 0.2s;
  }
  .ca-table tbody tr:last-child { border-bottom:none; }
  .ca-table tbody tr:hover { background:rgba(200,112,110,0.05); }
  .ca-table td { padding:16px 20px; font-size:14px; color:#e8e4dc; vertical-align:middle; }

  .ca-name-cell { display:flex; align-items:center; gap:14px; }
  .ca-avatar {
    width:38px; height:38px; border-radius:10px;
    background:rgba(200,112,110,0.12); border:1px solid rgba(200,112,110,0.2);
    display:flex; align-items:center; justify-content:center;
    font-size:14px; font-weight:700; color:#c8706e; flex-shrink:0; transition:all 0.2s;
  }
  .ca-table tbody tr:hover .ca-avatar { background:rgba(200,112,110,0.2); transform:scale(1.05); }
  .ca-name-text { font-weight:500; transition:color 0.2s; }
  .ca-table tbody tr:hover .ca-name-text { color:#c8706e; }

  .ca-car-chip {
    display:inline-flex; align-items:center; gap:8px;
    padding:6px 14px; background:rgba(200,112,110,0.08);
    border:1px solid rgba(200,112,110,0.15); border-radius:8px;
    font-size:13px; font-weight:500; color:#c8706e;
  }
  .ca-plate-chip {
    display:inline-flex; align-items:center; gap:8px;
    padding:6px 14px; background:rgba(200,169,110,0.08);
    border:1px solid rgba(200,169,110,0.15); border-radius:8px;
    font-size:13px; font-weight:500; color:#c8a96e; font-family:monospace; letter-spacing:0.5px;
  }
  .ca-muted { color:#5a5a6a; font-size:13px; }

  .ca-actions { display:flex; gap:6px; align-items:center; }
  .ca-btn-view, .ca-btn-edit, .ca-btn-delete {
    display:flex; align-items:center; justify-content:center; gap:5px;
    padding:8px 14px; border-radius:8px;
    font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600;
    cursor:pointer; border:1px solid; transition:all 0.2s; white-space:nowrap;
  }
  .ca-btn-view   { background:rgba(200,112,110,0.1); border-color:rgba(200,112,110,0.2); color:#c8706e; }
  .ca-btn-view:hover   { background:rgba(200,112,110,0.2); border-color:rgba(200,112,110,0.4); transform:translateY(-2px); }
  .ca-btn-edit   { background:rgba(200,169,110,0.1); border-color:rgba(200,169,110,0.2); color:#c8a96e; }
  .ca-btn-edit:hover   { background:rgba(200,169,110,0.2); border-color:rgba(200,169,110,0.4); transform:translateY(-2px); }
  .ca-btn-delete { background:rgba(224,90,90,0.1); border-color:rgba(224,90,90,0.2); color:#e05a5a; }
  .ca-btn-delete:hover { background:rgba(224,90,90,0.2); border-color:rgba(224,90,90,0.4); transform:translateY(-2px); }

  /* Empty State */
  .ca-empty {
    padding:70px 20px; display:flex; flex-direction:column;
    align-items:center; gap:16px; text-align:center;
    background:#1c1f28; border-radius:16px; border:1px solid rgba(255,255,255,0.07);
    animation:caFadeScale 0.3s ease;
  }
  @keyframes caFadeScale { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
  .ca-empty-icon { font-size:48px; opacity:0.5; animation:caFloat 3s ease-in-out infinite; }
  @keyframes caFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  .ca-empty-title { font-size:18px; color:#9a96a0; }
  .ca-empty-sub   { font-size:14px; color:#5a5a6a; }

  /* Overlay */
  .ca-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    z-index: 9999; background: rgba(5,6,10,0.85); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px; animation: caFadeIn 0.2s ease;
  }
  @keyframes caFadeIn { from{opacity:0} to{opacity:1} }
  @keyframes caScaleIn { from{opacity:0;transform:scale(0.94) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }

  /* View Card */
  .ca-view-card {
    background: #1a1e2a; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; width: 100%; max-width: 480px;
    box-shadow: 0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(200,112,110,0.1);
    animation: caScaleIn 0.25s cubic-bezier(0.16,1,0.3,1); overflow: hidden;
    margin: 0 20px;
  }
  .ca-card-top {
    padding: 32px 28px 24px;
    background: linear-gradient(135deg, rgba(200,112,110,0.08) 0%, transparent 60%);
    border-bottom: 1px solid rgba(255,255,255,0.06); position: relative;
  }
  .ca-card-close {
    position: absolute; top: 18px; right: 18px;
    width: 32px; height: 32px; background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: #9a96a0; font-size: 18px; cursor: pointer; transition: all 0.2s;
  }
  .ca-card-close:hover { background: rgba(255,255,255,0.1); color: #e8e4dc; transform: rotate(90deg); }
  .ca-card-avatar-lg {
    width: 64px; height: 64px; border-radius: 16px;
    background: rgba(200,112,110,0.15); border: 1px solid rgba(200,112,110,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; font-weight: 700; color: #c8706e; margin-bottom: 16px;
    animation: caGlow 3s ease-in-out infinite;
  }
  @keyframes caGlow {
    0%,100%{ box-shadow:0 0 10px rgba(200,112,110,0.3); }
    50%    { box-shadow:0 0 25px rgba(200,112,110,0.6); }
  }
  .ca-card-name { font-family:'DM Serif Display',serif; font-size:24px; color:#e8e4dc; margin-bottom:8px; }
  .ca-card-sub  { font-size:13px; color:#c8706e; font-weight:500; }
  .ca-card-body { padding:24px 28px; }
  .ca-card-field {
    padding:16px 0; border-bottom:1px solid rgba(255,255,255,0.05);
    display:flex; flex-direction:column; gap:6px;
  }
  .ca-card-field:last-child { border-bottom:none; }
  .ca-card-field-label { font-size:11px; font-weight:600; letter-spacing:1.2px; text-transform:uppercase; color:#5a5a6a; }
  .ca-card-field-val { font-size:16px; font-weight:500; color:#e8e4dc; }
  .ca-card-field-val.accent { color:#c8706e; }
  .ca-card-field-val.gold   { color:#c8a96e; font-family:monospace; letter-spacing:1px; }
  .ca-card-field-val.mono   { font-family:monospace; letter-spacing:0.5px; font-size:13px; color:#9a96a0; }
  .ca-card-actions { padding:0 28px 28px; display:flex; gap:10px; }

  /* Form Modal */
  .ca-form-modal {
    background: #1a1e2a; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; width: 100%; max-width: 560px;
    box-shadow: 0 40px 100px rgba(0,0,0,0.7);
    animation: caScaleIn 0.25s cubic-bezier(0.16,1,0.3,1); overflow: hidden;
    margin: 0 20px; max-height: 90vh; overflow-y: auto;
  }
  .ca-form-modal::-webkit-scrollbar { width:4px; }
  .ca-form-modal::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }
  .ca-form-head {
    padding: 24px 28px; border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: space-between;
    background: linear-gradient(135deg, rgba(200,112,110,0.05) 0%, transparent 60%);
    position: sticky; top: 0; background: #1a1e2a; z-index: 1;
  }
  .ca-form-title { font-family:'DM Serif Display',serif; font-size:22px; color:#e8e4dc; display:flex; align-items:center; gap:10px; }
  .ca-form-body  { padding: 28px; display: flex; flex-direction: column; gap: 16px; }
  .ca-form-row   { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .ca-field-label {
    display: block; font-size: 11px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: #5a5a6a; margin-bottom: 8px;
  }
  .ca-field-opt { color: #3a3d4a; font-size: 10px; margin-left: 4px; }
  .ca-field-input {
    width: 100%; background: #1c1f28; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px; padding: 12px 16px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: #e8e4dc;
    outline: none; transition: all 0.2s; caret-color: #c8706e;
  }
  .ca-field-input::placeholder { color: #5a5a6a; }
  .ca-field-input:focus { border-color: rgba(200,112,110,0.5); box-shadow: 0 0 0 3px rgba(200,112,110,0.15); transform:translateY(-2px); }
  .ca-form-foot {
    padding: 20px 28px; border-top: 1px solid rgba(255,255,255,0.07);
    display: flex; gap: 12px; justify-content: flex-end;
    background: rgba(0,0,0,0.2); position: sticky; bottom: 0; background: #1a1e2a;
  }
  .ca-foot-save {
    padding: 12px 28px; background: #c8706e; color: #0b0d12; border: none; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
  }
  .ca-foot-save::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%);
    transform: translateX(-100%); transition: transform 0.5s;
  }
  .ca-foot-save:hover::before { transform: translateX(100%); }
  .ca-foot-save:hover { background: #d4807e; box-shadow: 0 6px 20px rgba(200,112,110,0.4); transform: translateY(-2px); }
  .ca-foot-save:active { transform: translateY(0); }
  .ca-foot-save:disabled { opacity: 0.6; pointer-events: none; }

  .ca-foot-cancel {
    padding: 12px 24px; background: transparent; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px; color: #9a96a0;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s;
  }
  .ca-foot-cancel:hover { border-color: rgba(255,255,255,0.15); color: #e8e4dc; background: rgba(255,255,255,0.04); transform:translateY(-2px); }

  /* Confirm Modal */
  .ca-confirm-modal {
    background: #1a1e2a; border: 1px solid rgba(224,90,90,0.2);
    border-radius: 18px; width: 100%; max-width: 380px; padding: 32px;
    box-shadow: 0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(224,90,90,0.1);
    animation: caScaleIn 0.2s cubic-bezier(0.16,1,0.3,1); text-align: center;
    margin: 0 20px;
  }
  .ca-confirm-icon {
    width: 60px; height: 60px; border-radius: 16px;
    background: rgba(224,90,90,0.12); border: 1px solid rgba(224,90,90,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; margin: 0 auto 20px; animation: caShake 0.3s ease;
  }
  @keyframes caShake {
    0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)}
  }
  .ca-confirm-title { font-family:'DM Serif Display',serif; font-size:22px; color:#e8e4dc; margin-bottom:10px; }
  .ca-confirm-sub   { font-size:14px; color:#9a96a0; margin-bottom:28px; line-height:1.6; }
  .ca-confirm-btns  { display:flex; gap:12px; }
  .ca-confirm-del {
    flex:1; padding:12px; background:#e05a5a; color:white; border:none; border-radius:10px;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700; cursor:pointer; transition:all 0.2s;
  }
  .ca-confirm-del::before {
    content:''; position:absolute; inset:0;
    background:linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%);
    transform:translateX(-100%); transition:transform 0.5s;
  }
  .ca-confirm-del:hover::before { transform:translateX(100%); }
  .ca-confirm-del:hover { background:#ea6a6a; box-shadow:0 6px 20px rgba(224,90,90,0.4); transform:translateY(-2px); }
  .ca-confirm-no {
    flex:1; padding:12px; background:transparent; border:1px solid rgba(255,255,255,0.08);
    border-radius:10px; color:#9a96a0;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; cursor:pointer; transition:all 0.2s;
  }
  .ca-confirm-no:hover { border-color:rgba(255,255,255,0.15); color:#e8e4dc; background:rgba(255,255,255,0.04); transform:translateY(-2px); }
`;

const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';

const EMPTY = { assigned_to:'', type_of_car:'', plate_number:'', autosweep_acct:'', card_no:'', easytrip_acct:'' };

export default function CarsInventory({ onNotify }) {
  const [cars, setCars]               = useState([]);
  const [search, setSearch]           = useState('');
  const [showModal, setShowModal]     = useState(false);
  const [editingCar, setEditingCar]   = useState(null);
  const [viewCar, setViewCar]         = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving]           = useState(false);
  const [formData, setFormData]       = useState(EMPTY);

  const notify = (type, msg) => { if (onNotify) onNotify(type, msg); };

  useEffect(() => { fetchCars(); }, []);

  useEffect(() => {
    const open = !!(viewCar || showModal || deleteTarget);
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [viewCar, showModal, deleteTarget]);

  const fetchCars = async () => {
    try {
      const res = await axios.get('/api/cars');
      setCars(res.data);
      notify('info', `Loaded ${res.data.length} car records`);
    } catch {
      notify('error', 'Failed to load car records');
    }
  };

  const filtered = cars.filter(c =>
    `${c.assigned_to} ${c.type_of_car} ${c.plate_number}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => { setEditingCar(null); setFormData(EMPTY); setShowModal(true); };
  const openEditModal = (car) => { setEditingCar(car); setFormData({ ...EMPTY, ...car }); setViewCar(null); setShowModal(true); };
  const field = (k, v) => setFormData(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!formData.assigned_to.trim()) return notify('error', 'Assigned To is required');
    if (!formData.type_of_car.trim()) return notify('error', 'Type of Car is required');
    if (!formData.plate_number.trim()) return notify('error', 'Plate Number is required');
    setSaving(true);
    try {
      if (editingCar) {
        await axios.put(`/api/cars/${editingCar.id}`, formData);
        notify('success', 'Car record updated successfully');
      } else {
        await axios.post('/api/cars', formData);
        notify('success', 'Car record added successfully');
      }
      await fetchCars();
      setShowModal(false);
    } catch {
      notify('error', 'Failed to save car record');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/cars/${deleteTarget.id}`);
      await fetchCars();
      setDeleteTarget(null);
      notify('success', 'Car record deleted successfully');
    } catch {
      notify('error', 'Failed to delete car record');
    }
  };

  return (
    <>
      <style>{STYLES}</style>

      {/* Background elements */}
      <div className="ca-bg" />
      <div className="ca-orb ca-orb-1" />
      <div className="ca-orb ca-orb-2" />

      {/* Main Content */}
      <div className="ca-wrap">
        <div className="ca-header">
          <div className="ca-title-group">
            <div className="ca-title-icon">🚗</div>
            <div>
              <div className="ca-title">Cars Inventory</div>
            </div>
            <span className="ca-count">{cars.length} records</span>
          </div>
          <button className="ca-add-btn" onClick={openAddModal}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Car
          </button>
        </div>

        <div className="ca-search-wrap">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input
            className="ca-search"
            type="text"
            placeholder="Search by name, car type, or plate number…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="ca-search-clear" onClick={() => setSearch('')}>×</button>}
        </div>

        {search && (
          <div className="ca-result-info">
            Showing <span>{filtered.length}</span> of {cars.length} records
          </div>
        )}

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
                <tr key={car.id} style={{ animationDelay: `${i * 35}ms` }}>
                  <td>
                    <div className="ca-name-cell">
                      <div className="ca-avatar">{getInitials(car.assigned_to)}</div>
                      <span className="ca-name-text">{car.assigned_to}</span>
                    </div>
                  </td>
                  <td><span className="ca-car-chip">🚗 {car.type_of_car}</span></td>
                  <td><span className="ca-plate-chip">{car.plate_number}</span></td>
                  <td><span className={car.autosweep_acct ? '' : 'ca-muted'}>{car.autosweep_acct || '—'}</span></td>
                  <td><span className={car.card_no ? '' : 'ca-muted'}>{car.card_no || '—'}</span></td>
                  <td><span className={car.easytrip_acct ? '' : 'ca-muted'}>{car.easytrip_acct || '—'}</span></td>
                  <td>
                    <div className="ca-actions">
                      <button className="ca-btn-view" onClick={() => setViewCar(car)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                        View
                      </button>
                      <button className="ca-btn-edit" onClick={() => openEditModal(car)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Edit
                      </button>
                      <button className="ca-btn-delete" onClick={() => setDeleteTarget(car)}>
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
                  <td colSpan={7} style={{ padding: 0 }}>
                    <div className="ca-empty">
                      <div className="ca-empty-icon">🚗</div>
                      <div className="ca-empty-title">
                        {search ? `No results for "${search}"` : 'No car records yet'}
                      </div>
                      <div className="ca-empty-sub">
                        {search ? 'Try a different keyword' : 'Click "Add Car" to get started'}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals Portal */}
      {createPortal(
        <>
          {/* View Modal */}
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
                  <button
                    className="ca-btn-edit"
                    style={{ flex: 1, justifyContent: 'center', padding: '10px' }}
                    onClick={() => openEditModal(viewCar)}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                  </button>
                  <button
                    className="ca-btn-delete"
                    style={{ flex: 1, justifyContent: 'center', padding: '10px' }}
                    onClick={() => { setViewCar(null); setDeleteTarget(viewCar); }}
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

          {/* Add/Edit Modal */}
          {showModal && (
            <div className="ca-overlay" onClick={() => setShowModal(false)}>
              <div className="ca-form-modal" onClick={e => e.stopPropagation()}>
                <div className="ca-form-head">
                  <div className="ca-form-title">
                    {editingCar ? '✏️' : '🚗'}
                    {editingCar ? 'Edit Car Record' : 'New Car Record'}
                  </div>
                  <button className="ca-card-close" onClick={() => setShowModal(false)}>×</button>
                </div>
                <div className="ca-form-body">
                  <div>
                    <label className="ca-field-label">Assigned To *</label>
                    <input
                      className="ca-field-input"
                      type="text"
                      placeholder="e.g. Juan dela Cruz"
                      value={formData.assigned_to}
                      onChange={e => field('assigned_to', e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="ca-form-row">
                    <div>
                      <label className="ca-field-label">Type of Car *</label>
                      <input
                        className="ca-field-input"
                        type="text"
                        placeholder="e.g. Toyota Vios"
                        value={formData.type_of_car}
                        onChange={e => field('type_of_car', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="ca-field-label">Plate Number *</label>
                      <input
                        className="ca-field-input"
                        type="text"
                        placeholder="e.g. ABC 1234"
                        value={formData.plate_number}
                        onChange={e => field('plate_number', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="ca-form-row">
                    <div>
                      <label className="ca-field-label">
                        Autosweep Acct. <span className="ca-field-opt">Optional</span>
                      </label>
                      <input
                        className="ca-field-input"
                        type="text"
                        placeholder="Account number"
                        value={formData.autosweep_acct}
                        onChange={e => field('autosweep_acct', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="ca-field-label">
                        Card No. <span className="ca-field-opt">Optional</span>
                      </label>
                      <input
                        className="ca-field-input"
                        type="text"
                        placeholder="Card number"
                        value={formData.card_no}
                        onChange={e => field('card_no', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="ca-field-label">
                      Easytrip Acct. <span className="ca-field-opt">Optional</span>
                    </label>
                    <input
                      className="ca-field-input"
                      type="text"
                      placeholder="Account number"
                      value={formData.easytrip_acct}
                      onChange={e => field('easytrip_acct', e.target.value)}
                    />
                  </div>
                </div>
                <div className="ca-form-foot">
                  <button className="ca-foot-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="ca-foot-save" onClick={handleSubmit} disabled={saving}>
                    {saving ? 'Saving…' : editingCar ? 'Save Changes' : 'Add Car'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteTarget && (
            <div className="ca-overlay" onClick={() => setDeleteTarget(null)}>
              <div className="ca-confirm-modal" onClick={e => e.stopPropagation()}>
                <div className="ca-confirm-icon">🗑️</div>
                <div className="ca-confirm-title">Delete Car Record?</div>
                <div className="ca-confirm-sub">
                  You're about to delete <strong style={{ color: '#e8e4dc' }}>{deleteTarget.assigned_to}</strong>'s car record.<br />
                  This action cannot be undone.
                </div>
                <div className="ca-confirm-btns">
                  <button className="ca-confirm-no" onClick={() => setDeleteTarget(null)}>Cancel</button>
                  <button className="ca-confirm-del" onClick={confirmDelete}>Yes, Delete</button>
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