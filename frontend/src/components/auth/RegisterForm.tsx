'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/useAuth';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

// ── Password strength ────────────────────────────────────────────────────────
function getStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '#e5e7eb' };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Très faible', color: '#ef4444' };
  if (score === 2) return { score, label: 'Faible',     color: '#f97316' };
  if (score === 3) return { score, label: 'Moyen',      color: '#eab308' };
  if (score === 4) return { score, label: 'Fort',       color: '#22c55e' };
  return               { score, label: 'Très fort',   color: '#6366f1' };
}

// ── Styles ───────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes fadeRight { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
    @keyframes fadeLeft  { from { opacity:0; transform:translateX(20px);  } to { opacity:1; transform:translateX(0); } }
    @keyframes fadeUp    { from { opacity:0; transform:translateY(12px);  } to { opacity:1; transform:translateY(0); } }
    @keyframes pulse-ring { 0% { transform:scale(1); opacity:.5; } 100% { transform:scale(1.6); opacity:0; } }
    @keyframes spin { to { transform:rotate(360deg); } }
    @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
    @keyframes slideIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
    @keyframes barGrow  { from { width: 0; } to { width: 100%; } }

    html, body { height:100%; overflow:hidden; }

    .reg-root {
      display: flex;
      height: 100vh;
      width: 100vw;
      font-family: 'Sora', sans-serif;
      overflow: hidden;
    }

    /* ── LEFT PANEL ── */
    .reg-left {
      flex: 0 0 58%;
      background: #0c0e16;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: clamp(28px,3.5vh,52px) clamp(32px,4vw,72px);
      overflow: hidden;
    }
    .reg-left::before {
      content:'';
      position:absolute; inset:0;
      background-image:
        radial-gradient(circle at 75% 20%, rgba(99,102,241,0.13) 0%, transparent 50%),
        radial-gradient(circle at 15% 85%, rgba(16,185,129,0.09) 0%, transparent 45%);
      pointer-events:none;
    }
    .reg-dot-grid {
      position:absolute; inset:0;
      background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
      background-size: 28px 28px;
      pointer-events:none;
    }
    .reg-deco {
      position:absolute; top:0; left:0; width:100%; height:100%;
      pointer-events:none; overflow:hidden;
    }
    .reg-deco svg { width:100%; height:100%; }

    .reg-left-top {
      position:relative; z-index:1;
      animation: fadeRight .7s cubic-bezier(.22,1,.36,1) both;
    }
    .reg-logo {
      display:flex; align-items:center; gap:12px;
    }
    .reg-logo-icon {
      width: clamp(30px,2.4vw,40px); height: clamp(30px,2.4vw,40px);
      background: linear-gradient(135deg,#6366f1,#8b5cf6);
      border-radius:10px;
      display:flex; align-items:center; justify-content:center;
    }
    .reg-logo-name {
      font-size: clamp(14px,1.1vw,18px);
      font-weight:600; color:#fff; letter-spacing:-.2px;
    }
    .reg-logo-badge {
      background:rgba(99,102,241,0.2);
      border:1px solid rgba(99,102,241,0.4);
      border-radius:100px; padding:2px 8px;
      font-size:10px; font-weight:500; color:#a5b4fc;
      letter-spacing:.5px; text-transform:uppercase; margin-left:4px;
    }

    .reg-left-mid {
      position:relative; z-index:1;
      animation: fadeRight .7s .15s cubic-bezier(.22,1,.36,1) both;
    }
    .reg-eyebrow {
      font-size: clamp(10px,0.75vw,12px);
      font-weight:500; letter-spacing:2px; text-transform:uppercase;
      color:#6366f1; margin-bottom:clamp(12px,1.5vh,22px);
      display:flex; align-items:center; gap:10px;
    }
    .reg-eyebrow::before { content:''; display:block; width:28px; height:1px; background:#6366f1; }

    .reg-heading {
      font-family:'Lora', serif;
      font-size: clamp(28px,3.2vw,50px);
      font-weight:600; color:#fff;
      line-height:1.15; letter-spacing:-.5px;
      margin-bottom:clamp(12px,1.5vh,20px);
    }
    .reg-heading em {
      font-style:italic;
      background:linear-gradient(135deg,#10b981,#6ee7b7);
      -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    }
    .reg-desc {
      font-size: clamp(12px,0.95vw,15px);
      font-weight:300; color:rgba(255,255,255,0.45);
      line-height:1.7; max-width:90%;
      margin-bottom:clamp(20px,3vh,40px);
    }

    /* Features list */
    .reg-features {
      display:flex; flex-direction:column;
      gap: clamp(10px,1.4vh,18px);
    }
    .reg-feature {
      display:flex; align-items:flex-start; gap:14px;
    }
    .reg-feature-icon {
      width: clamp(28px,2vw,36px); height: clamp(28px,2vw,36px);
      border-radius:9px; flex-shrink:0;
      display:flex; align-items:center; justify-content:center;
      font-size:15px;
    }
    .reg-feature-icon.purple { background:rgba(99,102,241,0.15); }
    .reg-feature-icon.green  { background:rgba(16,185,129,0.12); }
    .reg-feature-icon.amber  { background:rgba(245,158,11,0.12); }
    .reg-feature-text { display:flex; flex-direction:column; gap:2px; }
    .reg-feature-title { font-size:clamp(12px,0.9vw,14px); font-weight:500; color:#fff; }
    .reg-feature-desc  { font-size:clamp(11px,0.75vw,13px); color:rgba(255,255,255,0.35); font-weight:300; }

    .reg-left-bot {
      position:relative; z-index:1;
      animation: fadeRight .7s .3s cubic-bezier(.22,1,.36,1) both;
    }
    .reg-status {
      display:flex; align-items:center; gap:8px;
      margin-bottom:clamp(12px,1.5vh,20px);
    }
    .reg-status-dot {
      width:8px; height:8px; border-radius:50%; background:#10b981; position:relative;
    }
    .reg-status-dot::after {
      content:''; position:absolute; inset:0; border-radius:50%; background:#10b981;
      animation: pulse-ring 1.5s ease-out infinite;
    }
    .reg-status-text { font-size:12px; color:rgba(255,255,255,0.4); }

    .reg-trust {
      background:rgba(255,255,255,0.04);
      border:1px solid rgba(255,255,255,0.08);
      border-radius:16px;
      padding: clamp(16px,1.8vh,24px) clamp(18px,1.8vw,28px);
      display:flex; align-items:center; gap:16px;
    }
    .reg-trust-avatars { display:flex; }
    .reg-avatar {
      width:32px; height:32px; border-radius:50%;
      border:2px solid #0c0e16;
      display:flex; align-items:center; justify-content:center;
      font-size:12px; font-weight:600; color:#fff;
      margin-left:-8px;
    }
    .reg-avatar:first-child { margin-left:0; }
    .reg-trust-text { display:flex; flex-direction:column; gap:2px; }
    .reg-trust-main { font-size:clamp(12px,0.85vw,14px); font-weight:500; color:#fff; }
    .reg-trust-sub  { font-size:clamp(10px,0.75vw,12px); color:rgba(255,255,255,0.35); }

    /* ── RIGHT PANEL ── */
    .reg-right {
      flex: 0 0 42%;
      background:#fafafa;
      display:flex; flex-direction:column; justify-content:center;
      padding: clamp(28px,3.5vh,60px) clamp(28px,4vw,64px);
      position:relative;
      animation: fadeLeft .7s cubic-bezier(.22,1,.36,1) both;
      overflow-y:auto;
    }
    .reg-right::before {
      content:'';
      position:absolute;
      top:0; left:clamp(28px,4vw,64px); right:clamp(28px,4vw,64px);
      height:3px;
      background:linear-gradient(90deg,#10b981,#6366f1,#a78bfa);
      border-radius:0 0 4px 4px;
    }

    /* Back link */
    .reg-back {
      display:inline-flex; align-items:center; gap:6px;
      font-size:clamp(11px,0.8vw,13px); color:#9ca3af;
      text-decoration:none; margin-bottom:clamp(16px,2vh,28px);
      transition:color .2s;
      animation: fadeUp .5s .1s both;
    }
    .reg-back:hover { color:#6366f1; }

    .reg-form-header {
      margin-bottom:clamp(18px,2.4vh,32px);
      animation: fadeUp .5s .2s cubic-bezier(.22,1,.36,1) both;
    }
    .reg-form-eyebrow {
      font-size:clamp(10px,0.7vw,12px); font-weight:600;
      letter-spacing:2px; text-transform:uppercase;
      color:#10b981; margin-bottom:10px;
    }
    .reg-form-title {
      font-family:'Lora', serif;
      font-size:clamp(20px,1.8vw,30px);
      font-weight:600; color:#111827;
      letter-spacing:-.3px; margin-bottom:6px;
    }
    .reg-form-subtitle { font-size:clamp(12px,0.85vw,15px); color:#6b7280; font-weight:300; }

    .reg-fields {
      display:flex; flex-direction:column;
      gap:clamp(12px,1.5vh,18px);
      margin-bottom:clamp(10px,1.4vh,18px);
      animation: fadeUp .5s .28s cubic-bezier(.22,1,.36,1) both;
    }
    .reg-row { display:flex; gap:clamp(8px,1vw,14px); }
    .reg-row .reg-field { flex:1; }
    .reg-field { display:flex; flex-direction:column; gap:5px; }
    .reg-label {
      font-size:clamp(11px,0.8vw,14px); font-weight:500; color:#374151;
    }
    .reg-wrap { position:relative; }
    .reg-prefix {
      position:absolute; left:14px; top:50%; transform:translateY(-50%);
      color:#9ca3af; pointer-events:none; display:flex; transition:color .2s;
    }
    .reg-wrap:focus-within .reg-prefix { color:#10b981; }
    .reg-input {
      width:100%;
      padding:clamp(10px,1.1vh,14px) 14px clamp(10px,1.1vh,14px) 42px;
      border:1.5px solid #e5e7eb; border-radius:10px;
      background:#fff; font-family:'Sora', sans-serif;
      font-size:clamp(12px,0.85vw,15px); color:#111827;
      outline:none; transition:border-color .2s, box-shadow .2s;
    }
    .reg-input.no-icon { padding-left:14px; }
    .reg-input::placeholder { color:#d1d5db; }
    .reg-input:focus { border-color:#10b981; box-shadow:0 0 0 4px rgba(16,185,129,0.1); }
    .reg-input.has-error { border-color:#ef4444; }
    .reg-input.has-error:focus { box-shadow:0 0 0 4px rgba(239,68,68,0.1); }
    .reg-suffix {
      position:absolute; right:14px; top:50%; transform:translateY(-50%);
      background:none; border:none; cursor:pointer; color:#9ca3af;
      display:flex; transition:color .2s; padding:2px;
    }
    .reg-suffix:hover { color:#10b981; }

    /* Password strength bar */
    .strength-bar-wrap {
      display:flex; flex-direction:column; gap:5px;
      animation: slideIn .2s ease both;
    }
    .strength-bars {
      display:flex; gap:4px;
    }
    .strength-seg {
      flex:1; height:3px; border-radius:2px;
      background:#e5e7eb;
      transition:background .3s;
    }
    .strength-row {
      display:flex; justify-content:flex-end;
    }
    .strength-label {
      font-size:11px; font-weight:500;
      transition:color .3s;
    }

    .reg-error { font-size:12px; color:#ef4444; display:flex; align-items:center; gap:5px; animation:slideIn .2s ease both; }

    /* Terms */
    .terms-row {
      display:flex; align-items:flex-start; gap:10px;
      margin-bottom:clamp(16px,2vh,26px);
      animation: fadeUp .5s .36s both;
    }
    .reg-checkbox {
      width:17px; height:17px; flex-shrink:0; margin-top:1px;
      border:1.5px solid #d1d5db; border-radius:5px; background:#fff;
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; transition:background .15s, border-color .15s;
    }
    .reg-checkbox.checked { background:#10b981; border-color:#10b981; }
    .terms-text { font-size:clamp(11px,0.78vw,13px); color:#6b7280; line-height:1.5; }
    .terms-link { color:#6366f1; text-decoration:none; font-weight:500; }
    .terms-link:hover { text-decoration:underline; }

    /* CTA */
    .reg-cta { animation: fadeUp .5s .42s both; }
    .reg-btn {
      width:100%;
      padding:clamp(11px,1.3vh,15px);
      border:none; border-radius:10px;
      background:linear-gradient(135deg,#10b981,#059669);
      color:#fff; font-family:'Sora', sans-serif;
      font-size:clamp(12px,0.85vw,15px); font-weight:500;
      letter-spacing:.2px; cursor:pointer;
      position:relative; overflow:hidden;
      transition:transform .15s, box-shadow .2s;
      display:flex; align-items:center; justify-content:center; gap:10px;
    }
    .reg-btn::after {
      content:''; position:absolute; inset:0;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);
      background-size:200% auto; opacity:0; transition:opacity .3s;
    }
    .reg-btn:hover { transform:translateY(-1px); box-shadow:0 6px 24px rgba(16,185,129,0.35); }
    .reg-btn:hover::after { opacity:1; animation:shimmer 1.4s linear infinite; }
    .reg-btn:active { transform:translateY(0); }
    .reg-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; }
    .reg-btn-arrow { transition:transform .2s; }
    .reg-btn:hover .reg-btn-arrow { transform:translateX(4px); }

    .reg-spinner {
      width:16px; height:16px;
      border:2px solid rgba(255,255,255,0.3);
      border-top-color:#fff; border-radius:50%;
      animation:spin .7s linear infinite;
    }

    .reg-divider { display:flex; align-items:center; gap:14px; margin:clamp(14px,1.8vh,24px) 0; }
    .reg-divider-line { flex:1; height:1px; background:#e5e7eb; }
    .reg-divider-text { font-size:12px; color:#9ca3af; white-space:nowrap; }
    .reg-social-row { display:flex; gap:10px; }
    .reg-social-btn {
      flex:1; padding:clamp(8px,1vh,12px);
      border:1.5px solid #e5e7eb; border-radius:10px; background:#fff;
      font-family:'Sora', sans-serif; font-size:clamp(11px,0.8vw,14px); color:#374151;
      cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;
      transition:border-color .2s, background .2s;
    }
    .reg-social-btn:hover { border-color:#d1d5db; background:#f9f9f9; }

    .reg-footer {
      text-align:center; margin-top:clamp(16px,2vh,24px);
      font-size:clamp(11px,0.8vw,14px); color:#9ca3af;
      animation: fadeUp .5s .5s both;
    }
    .reg-footer-link { color:#6366f1; text-decoration:none; font-weight:500; }
    .reg-footer-link:hover { text-decoration:underline; }

    @media (max-width:1024px) { .reg-left { flex:0 0 50%; } .reg-right { flex:0 0 50%; } }
    @media (max-width:768px) {
      .reg-root { overflow-y:auto; height:auto; }
      .reg-left  { display:none; }
      .reg-right { flex:1; height:100vh; }
    }
  `}</style>
);

// ── Icons ────────────────────────────────────────────────────────────────────
const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
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
const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ArrowIcon = () => (
  <svg className="reg-btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const BackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const LogoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
    <path d="M16 2L28 9v14L16 30 4 23V9L16 2z" fill="white" opacity=".9"/>
    <path d="M16 8L24 12.5v9L16 26 8 21.5v-9L16 8z" fill="white" opacity=".4"/>
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

// ── Component ────────────────────────────────────────────────────────────────
export function RegisterForm() {
  const { registerMutation } = useAuth();
  const [showPassword, setShowPassword]  = useState(false);
  const [showConfirm, setShowConfirm]    = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError]       = useState(false);
  const router = useRouter();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch('password', '');
  const strength = getStrength(passwordValue);

  // Dans RegisterForm, remplace onSubmit par cette version async :

const onSubmit = async (data: RegisterFormValues) => {
  console.log('[RegisterForm] onSubmit déclenché', { fullName: data.fullName, email: data.email });

  if (!termsAccepted) {
    console.warn('[RegisterForm] CGU non acceptées');
    setTermsError(true);
    return;
  }

  setTermsError(false);

  try {
    await registerMutation.mutateAsync({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    });

    console.log('[RegisterForm] Inscription réussie !');

    // ✅ Redirection vers login
    router.push('/auth/login');

  } catch (err) {
    console.error('[RegisterForm] Échec de l\'inscription', err);
  }
};

  const isPending = isSubmitting || registerMutation?.isPending;

  return (
    <>
      <GlobalStyles />
      <div className="reg-root">

        {/* ── LEFT PANEL ── */}
        <div className="reg-left">
          <div className="reg-dot-grid" />
          <div className="reg-deco">
            <svg viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" fill="none">
              <circle cx="480" cy="180" r="200" stroke="rgba(16,185,129,0.07)" strokeWidth="1"/>
              <circle cx="480" cy="180" r="320" stroke="rgba(16,185,129,0.04)" strokeWidth="1"/>
              <circle cx="80"  cy="650" r="150" stroke="rgba(99,102,241,0.07)" strokeWidth="1"/>
              <path d="M 0 350 Q 300 280 600 350" stroke="rgba(16,185,129,0.05)" strokeWidth="1"/>
            </svg>
          </div>

          {/* Logo */}
          <div className="reg-left-top">
            <div className="reg-logo">
              <div className="reg-logo-icon"><LogoIcon /></div>
              <span className="reg-logo-name">Orbit</span>
              <span className="reg-logo-badge">Pro</span>
            </div>
          </div>

          {/* Hero */}
          <div className="reg-left-mid">
            <p className="reg-eyebrow">Rejoignez-nous</p>
            <h1 className="reg-heading">
              Commencez<br />
              <em>gratuitement</em>.
            </h1>
            <p className="reg-desc">
              Créez votre compte en 30 secondes et accédez à toutes les fonctionnalités. Aucune carte de crédit requise.
            </p>

            <div className="reg-features">
              <div className="reg-feature">
                <div className="reg-feature-icon purple">🚀</div>
                <div className="reg-feature-text">
                  <span className="reg-feature-title">Déploiement instantané</span>
                  <span className="reg-feature-desc">Votre espace est prêt en quelques secondes</span>
                </div>
              </div>
              <div className="reg-feature">
                <div className="reg-feature-icon green">🔒</div>
                <div className="reg-feature-text">
                  <span className="reg-feature-title">Sécurité de niveau entreprise</span>
                  <span className="reg-feature-desc">Chiffrement de bout en bout, SSO, 2FA inclus</span>
                </div>
              </div>
              <div className="reg-feature">
                <div className="reg-feature-icon amber">⚡</div>
                <div className="reg-feature-text">
                  <span className="reg-feature-title">Essai gratuit 14 jours</span>
                  <span className="reg-feature-desc">Toutes les fonctionnalités Pro sans engagement</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social proof */}
          <div className="reg-left-bot">
            <div className="reg-status">
              <div className="reg-status-dot" />
              <span className="reg-status-text">+120 nouveaux comptes créés aujourd'hui</span>
            </div>
            <div className="reg-trust">
              <div className="reg-trust-avatars">
                {[
                  ['#6366f1','AB'],['#10b981','CD'],['#f59e0b','EF'],['#ec4899','GH'],
                ].map(([bg, label]) => (
                  <div key={label} className="reg-avatar" style={{ background: bg }}>{label}</div>
                ))}
              </div>
              <div className="reg-trust-text">
                <span className="reg-trust-main">Rejoint par 12 000+ professionnels</span>
                <span className="reg-trust-sub">★★★★★ — Noté 4.9/5 sur G2</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="reg-right">

          {/* Back to login */}
          <Link href="/auth/login" className="reg-back">
            <BackIcon /> Retour à la connexion
          </Link>

          <div className="reg-form-header">
            <p className="reg-form-eyebrow">Inscription</p>
            <h2 className="reg-form-title">Créez votre compte</h2>
            <p className="reg-form-subtitle">Remplissez les informations ci-dessous pour commencer</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="reg-fields">

              {/* Full name */}
              <div className="reg-field">
                <label className="reg-label">Nom complet</label>
                <div className="reg-wrap">
                  <span className="reg-prefix"><UserIcon /></span>
                  <input
                    {...register('fullName')}
                    className={`reg-input ${errors.fullName ? 'has-error' : ''}`}
                    placeholder="Sophie Martin"
                    autoComplete="name"
                  />
                </div>
                {errors.fullName && <p className="reg-error">⚠ {errors.fullName.message}</p>}
              </div>

              {/* Email */}
              <div className="reg-field">
                <label className="reg-label">Adresse e-mail professionnelle</label>
                <div className="reg-wrap">
                  <span className="reg-prefix"><EmailIcon /></span>
                  <input
                    {...register('email')}
                    className={`reg-input ${errors.email ? 'has-error' : ''}`}
                    placeholder="vous@entreprise.com"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="reg-error">⚠ {errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="reg-field">
                <label className="reg-label">Mot de passe</label>
                <div className="reg-wrap">
                  <span className="reg-prefix"><LockIcon /></span>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className={`reg-input ${errors.password ? 'has-error' : ''}`}
                    placeholder="8 caractères minimum"
                    autoComplete="new-password"
                  />
                  <button type="button" className="reg-suffix" onClick={() => setShowPassword(!showPassword)}>
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {errors.password && <p className="reg-error">⚠ {errors.password.message}</p>}

                {/* Strength indicator */}
                {passwordValue && (
                  <div className="strength-bar-wrap">
                    <div className="strength-bars">
                      {[1,2,3,4,5].map(i => (
                        <div
                          key={i}
                          className="strength-seg"
                          style={{ background: i <= strength.score ? strength.color : '#e5e7eb' }}
                        />
                      ))}
                    </div>
                    <div className="strength-row">
                      <span className="strength-label" style={{ color: strength.color }}>{strength.label}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="reg-field">
                <label className="reg-label">Confirmer le mot de passe</label>
                <div className="reg-wrap">
                  <span className="reg-prefix"><LockIcon /></span>
                  <input
                    {...register('confirmPassword')}
                    type={showConfirm ? 'text' : 'password'}
                    className={`reg-input ${errors.confirmPassword ? 'has-error' : ''}`}
                    placeholder="Répétez le mot de passe"
                    autoComplete="new-password"
                  />
                  <button type="button" className="reg-suffix" onClick={() => setShowConfirm(!showConfirm)}>
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
                {errors.confirmPassword && <p className="reg-error">⚠ {errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Terms */}
            <div className="terms-row">
              <div
                className={`reg-checkbox ${termsAccepted ? 'checked' : ''}`}
                onClick={() => { setTermsAccepted(!termsAccepted); setTermsError(false); }}
              >
                {termsAccepted && <CheckIcon />}
              </div>
              <span className="terms-text">
                J'accepte les{' '}
                <Link href="/terms" className="terms-link">Conditions d'utilisation</Link>
                {' '}et la{' '}
                <Link href="/privacy" className="terms-link">Politique de confidentialité</Link>
                {termsError && <span style={{ display:'block', color:'#ef4444', marginTop:4, fontSize:12 }}>⚠ Vous devez accepter les conditions</span>}
              </span>
            </div>

            {/* Submit */}
            <div className="reg-cta">
              <button type="submit" className="reg-btn" disabled={isPending}>
                {isPending
                  ? <><span className="reg-spinner" /> Création du compte…</>
                  : <>Créer mon compte <ArrowIcon /></>
                }
              </button>

              <div className="reg-divider">
                <div className="reg-divider-line" />
                <span className="reg-divider-text">ou s'inscrire avec</span>
                <div className="reg-divider-line" />
              </div>

              <div className="reg-social-row">
                <button type="button" className="reg-social-btn"><GoogleIcon /> Google</button>
                <button type="button" className="reg-social-btn"><MsIcon /> Microsoft</button>
              </div>
            </div>
          </form>

          <p className="reg-footer">
            Déjà un compte ?{' '}
            <Link href="/auth/login" className="reg-footer-link">Se connecter</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default function RegisterPage() {
  return <RegisterForm />;
}