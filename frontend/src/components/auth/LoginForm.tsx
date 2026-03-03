'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/useAuth';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes fadeRight {
      from { opacity: 0; transform: translateX(-20px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeLeft {
      from { opacity: 0; transform: translateX(20px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse-ring {
      0%   { transform: scale(1);   opacity: .5; }
      100% { transform: scale(1.6); opacity: 0; }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    html, body { height: 100%; overflow: hidden; }

    .login-root {
      display: flex;
      height: 100vh;
      width: 100vw;
      font-family: 'Sora', sans-serif;
      overflow: hidden;
    }

    /* ── LEFT PANEL ── */
    .left-panel {
      flex: 0 0 58%;
      background: #0f1117;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: clamp(28px, 3.5vh, 52px) clamp(32px, 4vw, 72px);
      overflow: hidden;
    }
    .left-panel::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(circle at 20% 30%, rgba(99,102,241,0.12) 0%, transparent 55%),
        radial-gradient(circle at 80% 80%, rgba(16,185,129,0.08) 0%, transparent 45%);
      pointer-events: none;
    }
    .dot-grid {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
      background-size: 28px 28px;
      pointer-events: none;
    }
    .deco-lines {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      overflow: hidden;
    }
    .deco-lines svg { width: 100%; height: 100%; }

    .left-top {
      position: relative;
      z-index: 1;
      animation: fadeRight .7s cubic-bezier(.22,1,.36,1) both;
    }
    .logo-mark {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-icon {
      width: clamp(30px, 2.4vw, 40px); height: clamp(30px, 2.4vw, 40px);
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
    }
    .logo-name {
      font-size: clamp(14px, 1.1vw, 18px);
      font-weight: 600;
      color: #fff;
      letter-spacing: -.2px;
    }
    .logo-badge {
      background: rgba(99,102,241,0.2);
      border: 1px solid rgba(99,102,241,0.4);
      border-radius: 100px;
      padding: 2px 8px;
      font-size: 10px;
      font-weight: 500;
      color: #a5b4fc;
      letter-spacing: .5px;
      text-transform: uppercase;
      margin-left: 4px;
    }

    .left-center {
      position: relative;
      z-index: 1;
      animation: fadeRight .7s .15s cubic-bezier(.22,1,.36,1) both;
    }
    .hero-eyebrow {
      font-size: clamp(10px, 0.75vw, 12px);
      font-weight: 500;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #6366f1;
      margin-bottom: clamp(12px, 1.5vh, 22px);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .hero-eyebrow::before {
      content: '';
      display: block;
      width: 28px; height: 1px;
      background: #6366f1;
    }
    .hero-heading {
      font-family: 'Lora', serif;
      font-size: clamp(28px, 3.2vw, 52px);
      font-weight: 600;
      color: #fff;
      line-height: 1.15;
      letter-spacing: -.5px;
      margin-bottom: clamp(12px, 1.5vh, 22px);
    }
    .hero-heading em {
      font-style: italic;
      background: linear-gradient(135deg, #6366f1, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-desc {
      font-size: clamp(12px, 0.95vw, 15px);
      font-weight: 300;
      color: rgba(255,255,255,0.45);
      line-height: 1.7;
      max-width: 90%;
      margin-bottom: clamp(20px, 3vh, 42px);
    }
    .stats-row {
      display: flex;
      gap: clamp(20px, 2.5vw, 40px);
    }
    .stat-item { display: flex; flex-direction: column; gap: 4px; }
    .stat-value { font-size: clamp(18px, 1.8vw, 28px); font-weight: 700; color: #fff; letter-spacing: -1px; }
    .stat-label { font-size: clamp(10px, 0.75vw, 13px); color: rgba(255,255,255,0.35); font-weight: 300; }
    .stat-divider { width: 1px; background: rgba(255,255,255,0.08); align-self: stretch; }

    .left-bottom {
      position: relative;
      z-index: 1;
      animation: fadeRight .7s .3s cubic-bezier(.22,1,.36,1) both;
    }
    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: clamp(12px, 1.5vh, 20px);
    }
    .status-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #10b981;
      position: relative;
    }
    .status-dot::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: #10b981;
      animation: pulse-ring 1.5s ease-out infinite;
    }
    .status-text { font-size: 12px; color: rgba(255,255,255,0.4); }

    .testimonial-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: clamp(16px, 1.8vh, 26px) clamp(18px, 1.8vw, 30px);
      position: relative;
    }
    .testimonial-card::before {
      content: '"';
      position: absolute;
      top: 8px; left: 20px;
      font-family: 'Lora', serif;
      font-size: clamp(40px, 4vw, 64px);
      line-height: 1;
      color: rgba(99,102,241,0.25);
    }
    .testimonial-text {
      font-size: clamp(12px, 0.85vw, 14px);
      font-weight: 300;
      color: rgba(255,255,255,0.6);
      line-height: 1.7;
      margin-bottom: clamp(10px, 1.2vh, 18px);
      padding-top: clamp(14px, 1.5vh, 22px);
    }
    .testimonial-author { display: flex; align-items: center; gap: 12px; }
    .author-avatar {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #10b981);
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 600; color: #fff;
    }
    .author-info { display: flex; flex-direction: column; gap: 2px; }
    .author-name { font-size: 13px; font-weight: 500; color: #fff; }
    .author-role { font-size: 11px; color: rgba(255,255,255,0.35); }

    /* ── RIGHT PANEL ── */
    .right-panel {
      flex: 0 0 42%;
      background: #fafafa;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: clamp(28px, 3.5vh, 60px) clamp(28px, 4vw, 64px);
      position: relative;
      animation: fadeLeft .7s cubic-bezier(.22,1,.36,1) both;
      overflow-y: auto;
    }
    .right-panel::before {
      content: '';
      position: absolute;
      top: 0; left: clamp(28px, 4vw, 64px); right: clamp(28px, 4vw, 64px);
      height: 3px;
      background: linear-gradient(90deg, #6366f1, #a78bfa, #10b981);
      border-radius: 0 0 4px 4px;
    }

    .form-header {
      margin-bottom: clamp(20px, 2.8vh, 38px);
      animation: fadeUp .5s .2s cubic-bezier(.22,1,.36,1) both;
    }
    .form-eyebrow {
      font-size: clamp(10px, 0.7vw, 12px);
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #6366f1;
      margin-bottom: 10px;
    }
    .form-title {
      font-family: 'Lora', serif;
      font-size: clamp(20px, 1.8vw, 30px);
      font-weight: 600;
      color: #111827;
      letter-spacing: -.3px;
      margin-bottom: 6px;
    }
    .form-subtitle { font-size: clamp(12px, 0.85vw, 15px); color: #6b7280; font-weight: 300; }

    .tab-switcher {
      display: flex;
      background: #f0f0f2;
      border-radius: 10px;
      padding: 4px;
      margin-bottom: clamp(18px, 2.5vh, 34px);
      animation: fadeUp .5s .25s cubic-bezier(.22,1,.36,1) both;
    }
    .tab-btn {
      flex: 1;
      padding: clamp(7px, 0.8vh, 10px);
      border: none;
      background: transparent;
      border-radius: 7px;
      font-family: 'Sora', sans-serif;
      font-size: clamp(11px, 0.8vw, 14px);
      font-weight: 500;
      color: #9ca3af;
      cursor: pointer;
      transition: background .2s, color .2s, box-shadow .2s;
    }
    .tab-btn.active {
      background: #fff;
      color: #111827;
      box-shadow: 0 1px 6px rgba(0,0,0,0.1);
    }

    .fields-stack {
      display: flex;
      flex-direction: column;
      gap: clamp(12px, 1.6vh, 20px);
      margin-bottom: clamp(10px, 1.4vh, 20px);
      animation: fadeUp .5s .3s cubic-bezier(.22,1,.36,1) both;
    }
    .field-block { display: flex; flex-direction: column; gap: 5px; }
    .field-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: clamp(11px, 0.8vw, 14px);
      font-weight: 500;
      color: #374151;
    }
    .field-hint {
      font-size: 12px;
      font-weight: 400;
      color: #6366f1;
      cursor: pointer;
      text-decoration: none;
    }
    .field-hint:hover { text-decoration: underline; }

    .field-wrap { position: relative; }
    .field-prefix {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
      pointer-events: none;
      display: flex;
      transition: color .2s;
    }
    .field-wrap:focus-within .field-prefix { color: #6366f1; }
    .field-input {
      width: 100%;
      padding: clamp(10px, 1.1vh, 14px) 14px clamp(10px, 1.1vh, 14px) 42px;
      border: 1.5px solid #e5e7eb;
      border-radius: 10px;
      background: #fff;
      font-family: 'Sora', sans-serif;
      font-size: clamp(12px, 0.85vw, 15px);
      color: #111827;
      outline: none;
      transition: border-color .2s, box-shadow .2s;
    }
    .field-input::placeholder { color: #d1d5db; }
    .field-input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
    }
    .field-input.has-error { border-color: #ef4444; }
    .field-input.has-error:focus { box-shadow: 0 0 0 4px rgba(239,68,68,0.1); }
    .field-input.no-icon { padding-left: 14px; }
    .field-suffix {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: #9ca3af;
      display: flex;
      transition: color .2s;
      padding: 2px;
    }
    .field-suffix:hover { color: #6366f1; }
    .error-msg {
      font-size: 12px;
      color: #ef4444;
      display: flex;
      align-items: center;
      gap: 5px;
      animation: slideIn .2s ease both;
    }

    .options-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: clamp(16px, 2vh, 30px);
      animation: fadeUp .5s .35s cubic-bezier(.22,1,.36,1) both;
    }
    .checkbox-row {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      user-select: none;
    }
    .custom-checkbox {
      width: 17px; height: 17px;
      border: 1.5px solid #d1d5db;
      border-radius: 5px;
      background: #fff;
      display: flex; align-items: center; justify-content: center;
      transition: background .15s, border-color .15s;
      flex-shrink: 0;
    }
    .custom-checkbox.checked { background: #6366f1; border-color: #6366f1; }
    .checkbox-text { font-size: 13px; color: #6b7280; }

    .cta-area { animation: fadeUp .5s .4s cubic-bezier(.22,1,.36,1) both; }
    .submit-btn {
      width: 100%;
      padding: clamp(11px, 1.3vh, 15px);
      border: none;
      border-radius: 10px;
      background: #111827;
      color: #fff;
      font-family: 'Sora', sans-serif;
      font-size: clamp(12px, 0.85vw, 15px);
      font-weight: 500;
      letter-spacing: .2px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: background .2s, transform .15s, box-shadow .2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .submit-btn::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
      background-size: 200% auto;
      opacity: 0;
      transition: opacity .3s;
    }
    .submit-btn:hover { background: #1f2937; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(0,0,0,0.18); }
    .submit-btn:hover::after { opacity: 1; animation: shimmer 1.4s linear infinite; }
    .submit-btn:active { transform: translateY(0); }
    .submit-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }
    .btn-arrow { transition: transform .2s; }
    .submit-btn:hover .btn-arrow { transform: translateX(4px); }

    .spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.25);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin .7s linear infinite;
    }

    .divider { display: flex; align-items: center; gap: 14px; margin: clamp(14px, 1.8vh, 26px) 0; }
    .divider-line { flex: 1; height: 1px; background: #e5e7eb; }
    .divider-text { font-size: 12px; color: #9ca3af; white-space: nowrap; }

    .social-row { display: flex; gap: 10px; }
    .social-btn {
      flex: 1;
      padding: clamp(8px, 1vh, 12px);
      border: 1.5px solid #e5e7eb;
      border-radius: 10px;
      background: #fff;
      font-family: 'Sora', sans-serif;
      font-size: clamp(11px, 0.8vw, 14px);
      color: #374151;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: border-color .2s, background .2s;
    }
    .social-btn:hover { border-color: #d1d5db; background: #f9f9f9; }

    .form-footer {
      text-align: center;
      margin-top: clamp(16px, 2vh, 26px);
      font-size: clamp(11px, 0.8vw, 14px);
      color: #9ca3af;
      animation: fadeUp .5s .5s cubic-bezier(.22,1,.36,1) both;
    }
    .footer-link { color: #6366f1; text-decoration: none; font-weight: 500; }
    .footer-link:hover { text-decoration: underline; }

    .sso-area { animation: fadeUp .3s ease both; }

    @media (max-width: 1024px) {
      .left-panel { flex: 0 0 50%; }
      .right-panel { flex: 0 0 50%; }
    }
    @media (max-width: 768px) {
      .login-root { overflow-y: auto; height: auto; }
      .left-panel { display: none; }
      .right-panel { flex: 1; height: 100vh; }
    }
  `}</style>
);

// ── Icons ──────────────────────────────────────────────────────────────────
const EmailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const EyeIcon = ({ open }: { open: boolean }) => open ? (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
);
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);
const MsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#f25022" d="M1 1h10v10H1z"/>
    <path fill="#7fba00" d="M13 1h10v10H13z"/>
    <path fill="#00a4ef" d="M1 13h10v10H1z"/>
    <path fill="#ffb900" d="M13 13h10v10H13z"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ArrowIcon = () => (
  <svg className="btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const LogoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
    <path d="M16 2L28 9v14L16 30 4 23V9L16 2z" fill="white" opacity=".9"/>
    <path d="M16 8L24 12.5v9L16 26 8 21.5v-9L16 8z" fill="white" opacity=".4"/>
  </svg>
);

// ── Component ──────────────────────────────────────────────────────────────
export function LoginForm() {
  const { loginMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'sso'>('login');
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        router.push('/dashboard');  // ← redirection après login réussi
      },
    });
  };

  const isPending = isSubmitting || loginMutation?.isPending;

  return (
    <>
      <GlobalStyles />
      <div className="login-root">

        {/* LEFT */}
        <div className="left-panel">
          <div className="dot-grid" />
          <div className="deco-lines">
            <svg viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" fill="none">
              <circle cx="120" cy="200" r="180" stroke="rgba(99,102,241,0.08)" strokeWidth="1"/>
              <circle cx="120" cy="200" r="280" stroke="rgba(99,102,241,0.05)" strokeWidth="1"/>
              <circle cx="480" cy="600" r="160" stroke="rgba(16,185,129,0.07)" strokeWidth="1"/>
              <path d="M 0 500 Q 300 400 600 500" stroke="rgba(99,102,241,0.06)" strokeWidth="1"/>
            </svg>
          </div>

          <div className="left-top">
            <div className="logo-mark">
              <div className="logo-icon"><LogoIcon /></div>
              <span className="logo-name">Votre Application</span>
              <span className="logo-badge">Pro</span>
            </div>
          </div>

          <div className="left-center">
            <p className="hero-eyebrow">Tableau de bord unifié</p>
            <h1 className="hero-heading">
              Gérez tout,<br />
              <em>sans effort</em>.
            </h1>
            <p className="hero-desc">
              Centralisez vos projets, équipes et données dans un seul espace de travail collaboratif. Conçu pour les équipes qui veulent aller plus vite.
            </p>
            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-value">12k+</span>
                <span className="stat-label">Utilisateurs actifs</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-value">99.9%</span>
                <span className="stat-label">Disponibilité</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-value">4.9★</span>
                <span className="stat-label">Note moyenne</span>
              </div>
            </div>
          </div>

          <div className="left-bottom">
            <div className="status-indicator">
              <div className="status-dot" />
              <span className="status-text">247 équipes connectées en ce moment</span>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">
                « Cette plateforme a transformé notre façon de collaborer. On a gagné 30% de productivité dès le premier mois. »
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">SM</div>
                <div className="author-info">
                  <span className="author-name">Sophie Martin</span>
                  <span className="author-role">Directrice Produit · TechCorp</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right-panel">
          <div className="form-header">
            <p className="form-eyebrow">Bienvenue</p>
            <h2 className="form-title">Connectez-vous à votre espace</h2>
            <p className="form-subtitle">Entrez vos identifiants pour continuer</p>
          </div>

          <div className="tab-switcher">
            <button className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')} type="button">
              Email & mot de passe
            </button>
            <button className={`tab-btn ${activeTab === 'sso' ? 'active' : ''}`} onClick={() => setActiveTab('sso')} type="button">
              SSO Entreprise
            </button>
          </div>

          {activeTab === 'login' ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="fields-stack">
                <div className="field-block">
                  <label className="field-label">Adresse e-mail</label>
                  <div className="field-wrap">
                    <span className="field-prefix"><EmailIcon /></span>
                    <input
                      {...register('email')}
                      className={`field-input ${errors.email ? 'has-error' : ''}`}
                      placeholder="vous@entreprise.com"
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && <p className="error-msg">⚠ {errors.email.message}</p>}
                </div>

                <div className="field-block">
                  <label className="field-label">
                    Mot de passe
                    <a href="#" className="field-hint">Mot de passe oublié ?</a>
                  </label>
                  <div className="field-wrap">
                    <span className="field-prefix"><LockIcon /></span>
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className={`field-input ${errors.password ? 'has-error' : ''}`}
                      placeholder="••••••••••"
                      autoComplete="current-password"
                    />
                    <button type="button" className="field-suffix" onClick={() => setShowPassword(!showPassword)} aria-label="Afficher/masquer">
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                  {errors.password && <p className="error-msg">⚠ {errors.password.message}</p>}
                </div>
              </div>

              <div className="options-row">
                <div className="checkbox-row" onClick={() => setRememberMe(!rememberMe)}>
                  <div className={`custom-checkbox ${rememberMe ? 'checked' : ''}`}>
                    {rememberMe && <CheckIcon />}
                  </div>
                  <span className="checkbox-text">Rester connecté</span>
                </div>
              </div>

              <div className="cta-area">
                <button type="submit" className="submit-btn" disabled={isPending}>
                  {isPending ? <><span className="spinner" /> Connexion en cours…</> : <>Se connecter <ArrowIcon /></>}
                </button>
                <div className="divider">
                  <div className="divider-line" />
                  <span className="divider-text">ou continuer avec</span>
                  <div className="divider-line" />
                </div>
                <div className="social-row">
                  <button type="button" className="social-btn"><GoogleIcon /> Google</button>
                  <button type="button" className="social-btn"><MsIcon /> Microsoft</button>
                </div>
              </div>
            </form>
          ) : (
            <div className="sso-area">
              <div className="fields-stack">
                <div className="field-block">
                  <label className="field-label">Domaine de l'entreprise</label>
                  <div className="field-wrap">
                    <input className="field-input no-icon" placeholder="votreentreprise.com" />
                  </div>
                </div>
              </div>
              <button type="button" className="submit-btn" style={{ marginTop: 8 }}>
                Continuer avec SSO <ArrowIcon />
              </button>
            </div>
          )}

          <p className="form-footer">
            Pas encore de compte ?{' '}
            <Link href="/auth/register" className="footer-link">Créer un compte gratuit</Link>
          </p>
        </div>

      </div>
    </>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}