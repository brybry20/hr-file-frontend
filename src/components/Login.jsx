import React, { useState, useEffect } from 'react';
import axios from 'axios';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d0f14;
    --panel: #13161e;
    --surface: #1a1e2a;
    --border: rgba(255,255,255,0.07);
    --accent: #c8a96e;
    --accent-glow: rgba(200,169,110,0.25);
    --accent-dim: rgba(200,169,110,0.12);
    --text: #e8e4dc;
    --text-muted: #7a7a8a;
    --error: #e05a5a;
  }

  .hr-login-page {
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  /* BIG LOGO BACKGROUND */
  .hr-big-logo-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    height: 800px;
    opacity: 0.08;
    pointer-events: none;
    z-index: 0;
    animation: rotateSlow 30s linear infinite;
  }

  .hr-big-logo-bg svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 30px var(--accent));
  }

  .hr-big-logo-bg path {
    fill: none;
    stroke: var(--accent);
    stroke-width: 1.2;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: drawLogo 8s ease-in-out infinite;
  }

  @keyframes rotateSlow {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }

  @keyframes drawLogo {
    0% { stroke-dashoffset: 1000; opacity: 0.3; }
    50% { stroke-dashoffset: 0; opacity: 1; }
    100% { stroke-dashoffset: 1000; opacity: 0.3; }
  }

  /* FLOATING LOGO CONTAINERS */
  .hr-float-logo {
    position: absolute;
    width: 120px;
    height: 120px;
    opacity: 0.15;
    pointer-events: none;
    z-index: 0;
    animation: float1 15s ease-in-out infinite;
  }

  .hr-float-logo-1 {
    top: 10%;
    left: 5%;
  }

  .hr-float-logo-2 {
    bottom: 15%;
    right: 8%;
    width: 150px;
    height: 150px;
    animation: float2 18s ease-in-out infinite;
  }

  .hr-float-logo-3 {
    top: 20%;
    right: 15%;
    width: 100px;
    height: 100px;
    animation: float3 12s ease-in-out infinite;
  }

  @keyframes float1 {
    0% { transform: translate(0, 0) rotate(0deg) scale(1); }
    33% { transform: translate(30px, 20px) rotate(10deg) scale(1.1); }
    66% { transform: translate(-20px, 40px) rotate(-5deg) scale(0.9); }
    100% { transform: translate(0, 0) rotate(0deg) scale(1); }
  }

  @keyframes float2 {
    0% { transform: translate(0, 0) rotate(0deg) scale(1); }
    25% { transform: translate(-40px, -20px) rotate(-15deg) scale(1.2); }
    50% { transform: translate(20px, -40px) rotate(10deg) scale(0.8); }
    75% { transform: translate(40px, 20px) rotate(5deg) scale(1.1); }
    100% { transform: translate(0, 0) rotate(0deg) scale(1); }
  }

  @keyframes float3 {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(30px, -30px) rotate(180deg); }
    100% { transform: translate(0, 0) rotate(360deg); }
  }

  /* PULSING ORB BACKGROUND */
  .hr-pulse-orb {
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(200,169,110,0.2), transparent 70%);
    animation: pulseOrb 4s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
    filter: blur(40px);
  }

  .hr-orb-1 {
    top: 10%;
    left: 5%;
    animation-delay: 0s;
  }

  .hr-orb-2 {
    bottom: 10%;
    right: 5%;
    width: 350px;
    height: 350px;
    background: radial-gradient(circle at 70% 70%, rgba(200,169,110,0.15), transparent 70%);
    animation-delay: 2s;
  }

  .hr-orb-3 {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(200,169,110,0.1), transparent 80%);
    animation: pulseOrbBig 6s ease-in-out infinite;
    filter: blur(60px);
  }

  @keyframes pulseOrb {
    0% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.2); }
    100% { opacity: 0.3; transform: scale(1); }
  }

  @keyframes pulseOrbBig {
    0% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.3); }
    100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
  }

  /* GLOWING LINES */
  .hr-glow-line {
    position: absolute;
    height: 2px;
    width: 100%;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    animation: glowLine 8s linear infinite;
    pointer-events: none;
    z-index: 0;
  }

  .hr-line-1 {
    top: 20%;
    animation-delay: 0s;
  }

  .hr-line-2 {
    bottom: 30%;
    animation-delay: 4s;
  }

  .hr-line-3 {
    top: 60%;
    width: 70%;
    left: 15%;
    animation-delay: 2s;
  }

  @keyframes glowLine {
    0% { opacity: 0; transform: scaleX(0.3); }
    50% { opacity: 0.5; transform: scaleX(1); }
    100% { opacity: 0; transform: scaleX(0.3); }
  }

  /* PARTICLE EFFECT */
  .hr-particle {
    position: absolute;
    width: 3px;
    height: 3px;
    background: var(--accent);
    border-radius: 50%;
    opacity: 0.3;
    pointer-events: none;
    z-index: 0;
    animation: floatParticle 10s linear infinite;
  }

  @keyframes floatParticle {
    from { transform: translateY(0) translateX(0); opacity: 0.3; }
    to { transform: translateY(-100vh) translateX(100px); opacity: 0; }
  }

  .hr-wrapper {
    display: flex;
    align-items: stretch;
    width: 900px;
    max-width: 96vw;
    min-height: 560px;
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid var(--border);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.03), 0 32px 80px rgba(0,0,0,0.7), 0 0 80px rgba(200,169,110,0.2);
    animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both;
    position: relative;
    z-index: 2;
    backdrop-filter: blur(10px);
  }

  .hr-wrapper::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, transparent 40%, var(--accent) 50%, transparent 60%);
    border-radius: 26px;
    opacity: 0.15;
    animation: borderGlow 3s linear infinite;
    pointer-events: none;
  }

  @keyframes borderGlow {
    0% { opacity: 0.1; }
    50% { opacity: 0.3; }
    100% { opacity: 0.1; }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* LEFT PANEL */
  .hr-left {
    flex: 0 0 350px;
    background: var(--panel);
    padding: 48px 36px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-right: 1px solid var(--border);
    position: relative;
    overflow: hidden;
  }

  .hr-left::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(200,169,110,0.08) 0%, transparent 70%);
    animation: rotateGradient 20s linear infinite;
  }

  @keyframes rotateGradient {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .hr-brand { 
    display: flex; 
    flex-direction: column; 
    gap: 8px; 
    position: relative; 
    z-index: 2;
    animation: slideInLeft 0.8s ease-out;
  }

  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .hr-brand-icon {
    width: 54px;
    height: 54px;
    background: var(--accent-dim);
    border: 2px solid rgba(200,169,110,0.4);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    animation: iconPulse 3s ease-in-out infinite;
  }

  @keyframes iconPulse {
    0% { box-shadow: 0 0 0 0 rgba(200,169,110,0.4); }
    50% { box-shadow: 0 0 30px 10px rgba(200,169,110,0.6); }
    100% { box-shadow: 0 0 0 0 rgba(200,169,110,0.4); }
  }

  .hr-brand-icon svg { 
    width: 28px; 
    height: 28px; 
    stroke: var(--accent); 
    fill: none; 
    stroke-width: 1.8; 
  }

  .hr-brand-name {
    font-family: 'DM Serif Display', serif;
    font-size: 32px;
    color: var(--text);
    letter-spacing: -0.5px;
    line-height: 1.1;
  }

  .hr-brand-sub {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 20px;
    animation: textGlow 3s ease-in-out infinite;
  }

  @keyframes textGlow {
    0% { text-shadow: 0 0 5px rgba(200,169,110,0.3); }
    50% { text-shadow: 0 0 30px rgba(200,169,110,0.8); }
    100% { text-shadow: 0 0 5px rgba(200,169,110,0.3); }
  }

  /* BIG LOGO CONTAINER */
  .hr-big-logo-container {
    margin: 20px 0 30px;
    padding: 28px 24px;
    background: linear-gradient(
      160deg,
      rgba(255,255,255,0.22) 0%,
      rgba(255,255,255,0.12) 40%,
      rgba(255,255,255,0.07) 100%
    );
    border-radius: 18px;
    border: 1px solid rgba(255,255,255,0.28);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.4),
      inset 0 -1px 0 rgba(255,255,255,0.08),
      0 4px 32px rgba(0,0,0,0.18);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 2;
    overflow: hidden;
    backdrop-filter: blur(12px);
  }

  /* White radial glow behind the logo */
  .hr-big-logo-container::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 160px;
    height: 100px;
    background: radial-gradient(ellipse at center,
      rgba(255,255,255,0.55) 0%,
      rgba(255,255,255,0.18) 40%,
      transparent 70%
    );
    border-radius: 50%;
    filter: blur(12px);
    animation: whiteGlow 3s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes whiteGlow {
    0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
    50%       { opacity: 1;   transform: translate(-50%, -50%) scale(1.15); }
  }

  /* ── Logo: full natural colors + floating glow ── */
  .hr-big-logo {
    max-width: 180px;
    max-height: 120px;
    object-fit: contain;
    position: relative;
    z-index: 3;
    animation: logoPulse 3s ease-in-out infinite;
  }

  @keyframes logoPulse {
    0%, 100% {
      filter: brightness(1.1) saturate(1.2)
              drop-shadow(0 0 8px rgba(255, 200, 50, 0.5))
              drop-shadow(0 0 20px rgba(255, 200, 50, 0.2));
    }
    50% {
      filter: brightness(1.3) saturate(1.4)
              drop-shadow(0 0 18px rgba(255, 200, 50, 0.85))
              drop-shadow(0 0 40px rgba(255, 200, 50, 0.4))
              drop-shadow(0 0 60px rgba(50, 100, 200, 0.2));
    }
  }

  .hr-info { 
    display: flex; 
    flex-direction: column; 
    gap: 20px;
    position: relative;
    z-index: 2;
  }

  .hr-info-item {
    display: flex; align-items: flex-start; gap: 12px;
    opacity: 0; animation: slideIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .hr-info-item:nth-child(1) { animation-delay: 0.3s; }
  .hr-info-item:nth-child(2) { animation-delay: 0.45s; }
  .hr-info-item:nth-child(3) { animation-delay: 0.6s; }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .hr-info-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
    margin-top: 6px;
    flex-shrink: 0;
    animation: dotPulse 2s ease-in-out infinite;
  }

  @keyframes dotPulse {
    0% { opacity: 0.5; transform: scale(1); box-shadow: 0 0 0 0 var(--accent); }
    50% { opacity: 1; transform: scale(1.5); box-shadow: 0 0 15px 5px var(--accent); }
    100% { opacity: 0.5; transform: scale(1); box-shadow: 0 0 0 0 var(--accent); }
  }

  .hr-info-text { 
    font-size: 13px; 
    color: var(--text-muted); 
    line-height: 1.7; 
  }
  .hr-info-text strong { 
    color: var(--text); 
    font-weight: 600; 
    display: block; 
    margin-bottom: 3px; 
    font-size: 14px;
  }

  .hr-left-footer { 
    font-size: 11px; 
    color: var(--text-muted); 
    line-height: 1.6;
    position: relative;
    z-index: 2;
    animation: fadeUp 0.5s ease-out 0.8s both;
  }

  /* RIGHT PANEL */
  .hr-right {
    flex: 1;
    background: var(--surface);
    padding: 60px 48px;
    display: flex; flex-direction: column; justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .hr-right::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(200,169,110,0.05) 0%, transparent 70%);
    animation: rotateGradient 15s linear infinite reverse;
  }

  .hr-form-header {
    margin-bottom: 40px;
    opacity: 0;
    animation: fadeUpRight 0.5s cubic-bezier(0.16,1,0.3,1) 0.2s forwards;
    position: relative;
    z-index: 2;
  }

  @keyframes fadeUpRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .hr-form-title {
    font-family: 'DM Serif Display', serif;
    font-size: 36px;
    color: var(--text);
    margin-bottom: 8px;
    letter-spacing: -1px;
  }

  .hr-form-title em { 
    color: var(--accent); 
    font-style: italic;
    animation: textGlow 3s ease-in-out infinite;
  }

  .hr-form-subtitle { 
    font-size: 14px; 
    color: var(--text-muted); 
    font-weight: 300;
    letter-spacing: 0.5px;
  }

  .hr-form-group {
    margin-bottom: 24px;
    opacity: 0; animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
    position: relative;
    z-index: 2;
  }
  .hr-form-group:nth-child(1) { animation-delay: 0.35s; }
  .hr-form-group:nth-child(2) { animation-delay: 0.45s; }

  .hr-label {
    display: block; font-size: 12px; font-weight: 600;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 12px;
  }

  .hr-input-wrap { position: relative; }

  .hr-input-wrap .hr-icon {
    position: absolute; left: 18px; top: 50%;
    transform: translateY(-50%);
    width: 18px; height: 18px;
    stroke: var(--text-muted); fill: none; stroke-width: 1.8;
    pointer-events: none; transition: stroke 0.2s;
  }

  .hr-input {
    width: 100%;
    background: var(--panel);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 16px 18px 16px 48px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: var(--text);
    outline: none;
    transition: all 0.3s;
    caret-color: var(--accent);
  }

  .hr-input::placeholder { color: var(--text-muted); }

  .hr-input:focus {
    border-color: rgba(200,169,110,0.6);
    box-shadow: 0 0 0 4px var(--accent-glow);
    transform: translateY(-2px);
  }

  .hr-eye {
    position: absolute; right: 18px; top: 50%;
    transform: translateY(-50%);
    width: 18px; height: 18px;
    stroke: var(--text-muted); fill: none; stroke-width: 1.8;
    cursor: pointer; transition: all 0.2s; 
    background: none; border: none; padding: 0;
  }
  .hr-eye:hover { 
    stroke: var(--accent);
    transform: translateY(-50%) scale(1.1);
  }

  .hr-btn {
    width: 100%; margin-top: 32px; padding: 16px;
    background: var(--accent); color: #0d0f14;
    border: none; border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 16px; font-weight: 700; letter-spacing: 1px;
    cursor: pointer; position: relative; overflow: hidden;
    transition: all 0.3s;
    opacity: 0; animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.55s forwards;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    z-index: 2;
  }

  .hr-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
    transform: translateX(-100%); transition: transform 0.6s;
  }
  .hr-btn:hover::before { transform: translateX(100%); }
  .hr-btn:hover { 
    box-shadow: 0 10px 30px rgba(200,169,110,0.5); 
    background: #e0c08a;
    transform: translateY(-2px);
    animation: btnPulse 1s ease-in-out infinite;
  }

  @keyframes btnPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }

  .hr-btn:active { transform: scale(0.96); }
  .hr-btn:disabled { opacity: 0.7; pointer-events: none; }

  @keyframes spin { to { transform: rotate(360deg); } }

  .hr-spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(0,0,0,0.3);
    border-top-color: #0d0f14;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  .hr-error {
    margin-top: 20px; padding: 14px 16px;
    background: rgba(224,90,90,0.15);
    border: 1px solid rgba(224,90,90,0.3);
    border-radius: 10px; font-size: 13px; color: var(--error);
    display: flex; align-items: center; gap: 10px;
    animation: shake 0.3s ease both;
    position: relative;
    z-index: 2;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-5px); }
    40%, 80% { transform: translateX(5px); }
  }

  @media (max-width: 640px) {
    .hr-left { display: none; }
    .hr-right { padding: 40px 28px; }
    .hr-wrapper { min-height: auto; }
  }
`;

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [particles, setParticles] = useState([]);

  const logoPath = '/deltaplus.png';

  useEffect(() => {
    const img = new Image();
    img.src = logoPath;
    img.onload = () => setLogoLoaded(true);

    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        left: Math.random() * 100 + '%',
        animationDelay: Math.random() * 5 + 's',
        animationDuration: 8 + Math.random() * 7 + 's'
      });
    }
    setParticles(newParticles);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async () => {
    setError('');
    if (!username.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      if (response.data.success) {
        onLogin();
      }
    } catch {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="hr-login-page">
        {/* BIG CENTER LOGO BACKGROUND */}
        <div className="hr-big-logo-bg">
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <path d="M20 20 L80 20 L80 80 L20 80 Z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="50" cy="50" r="15" strokeLinecap="round" />
            <path d="M35 35 L65 35 L65 65 L35 65 Z" />
          </svg>
        </div>

        {/* FLOATING LOGOS */}
        <div className="hr-float-logo hr-float-logo-1">
          <svg viewBox="0 0 100 100">
            <path d="M20 20 L80 20 L80 80 L20 80 Z" stroke="var(--accent)" fill="none" strokeWidth="1" />
          </svg>
        </div>
        <div className="hr-float-logo hr-float-logo-2">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="30" stroke="var(--accent)" fill="none" strokeWidth="1" />
          </svg>
        </div>
        <div className="hr-float-logo hr-float-logo-3">
          <svg viewBox="0 0 100 100">
            <path d="M20 20 L80 50 L20 80 Z" stroke="var(--accent)" fill="none" strokeWidth="1" />
          </svg>
        </div>
        
        {/* Pulsing orbs */}
        <div className="hr-pulse-orb hr-orb-1" style={{
          transform: `translate(${(mousePosition.x - 50) * 0.1}px, ${(mousePosition.y - 50) * 0.1}px)`
        }} />
        <div className="hr-pulse-orb hr-orb-2" style={{
          transform: `translate(${(mousePosition.x - 50) * -0.1}px, ${(mousePosition.y - 50) * -0.1}px)`
        }} />
        <div className="hr-pulse-orb hr-orb-3" />
        
        {/* Glowing lines */}
        <div className="hr-glow-line hr-line-1" />
        <div className="hr-glow-line hr-line-2" />
        <div className="hr-glow-line hr-line-3" />

        {/* Particles */}
        {particles.map(p => (
          <div
            key={p.id}
            className="hr-particle"
            style={{
              left: p.left,
              top: '100%',
              animationDelay: p.animationDelay,
              animationDuration: p.animationDuration
            }}
          />
        ))}

        <div className="hr-wrapper">
          {/* LEFT PANEL */}
          <div className="hr-left">
            <div className="hr-brand">
              <div className="hr-brand-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                  <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                  <circle cx="12" cy="13" r="1" fill="#c8a96e" stroke="none"/>
                  <line x1="12" y1="14" x2="12" y2="17"/>
                </svg>
              </div>
              <div className="hr-brand-name">HR-FILE</div>
              <div className="hr-brand-sub">Ceniza, Evangeline Gonzalvo</div>
            </div>

            {/* LOGO — natural colors, pulsing glow */}
            {logoLoaded && (
              <div className="hr-big-logo-container">
                <img
                  src={logoPath}
                  alt="DeltaPlus Logo"
                  className="hr-big-logo"
                />
              </div>
            )}

            <div className="hr-left-footer">
              © DeltaPlus 2026 HR-FILE Systems<br />All rights reserved.
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="hr-right">
            <div className="hr-form-header">
              <div className="hr-form-title">Deltaplus</div>
              <div className="hr-form-subtitle">Sign in to access your HR dashboard</div>
            </div>

            <div className="hr-form-group">
              <label className="hr-label">Username</label>
              <div className="hr-input-wrap">
                <input
                  type="text"
                  className="hr-input"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="username"
                />
                <svg className="hr-icon" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </div>
            </div>

            <div className="hr-form-group">
              <label className="hr-label">Password</label>
              <div className="hr-input-wrap">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="hr-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="current-password"
                  style={{ paddingRight: '50px' }}
                />
                <svg className="hr-icon" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <button className="hr-eye" onClick={() => setShowPass(!showPass)} type="button" aria-label="Toggle password">
                  {showPass ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button className="hr-btn" onClick={handleSubmit} disabled={loading} type="button">
              {loading ? <div className="hr-spinner" /> : 'Sign In'}
            </button>

            {error && (
              <div className="hr-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}