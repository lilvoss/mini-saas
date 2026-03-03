'use client';

import { useAuth } from '@/lib/useAuth';
import { useWorkspaces, WorkspaceRole, Workspace } from '@/lib/useWorkspaces';
import { searchUsers } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
    @keyframes fadeDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes spin     { to{transform:rotate(360deg)} }
    @keyframes pulse-ring {
      0%   { transform:scale(1);   opacity:.5 }
      100% { transform:scale(1.6); opacity:0  }
    }

    html,body { height:100%; background:#0f1117; }

    .dash-root {
      min-height:100vh; background:#0f1117;
      font-family:'Sora',sans-serif; color:#fff;
    }

    /* ── SIDEBAR ── */
    .sidebar {
      width:240px; flex-shrink:0;
      background:rgba(255,255,255,0.02);
      border-right:1px solid rgba(255,255,255,0.06);
      display:flex; flex-direction:column;
      padding:28px 16px;
      position:fixed; top:0; left:0; bottom:0; z-index:10;
    }
    .sidebar-logo { display:flex; align-items:center; gap:10px; padding:0 8px; margin-bottom:36px; }
    .sidebar-logo-icon {
      width:34px; height:34px;
      background:linear-gradient(135deg,#6366f1,#8b5cf6);
      border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0;
    }
    .sidebar-logo-name { font-size:15px; font-weight:600; color:#fff; letter-spacing:-.2px; }
    .sidebar-logo-badge {
      background:rgba(99,102,241,0.2); border:1px solid rgba(99,102,241,0.4);
      border-radius:100px; padding:1px 7px; font-size:9px; font-weight:500;
      color:#a5b4fc; letter-spacing:.5px; text-transform:uppercase;
    }
    .sidebar-section-label {
      font-size:10px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase;
      color:rgba(255,255,255,0.2); padding:0 8px; margin-bottom:6px; margin-top:20px;
    }
    .nav-item {
      display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:9px;
      cursor:pointer; transition:background .15s,color .15s;
      color:rgba(255,255,255,0.4); font-size:13.5px; font-weight:400;
      margin-bottom:2px; border:none; background:none; width:100%; text-align:left;
    }
    .nav-item:hover  { background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.8); }
    .nav-item.active { background:rgba(99,102,241,0.15); color:#a5b4fc; }
    .nav-icon { width:16px; height:16px; flex-shrink:0; }
    .nav-badge {
      margin-left:auto; background:rgba(99,102,241,0.25); color:#a5b4fc;
      border-radius:100px; padding:1px 7px; font-size:10px; font-weight:600;
    }
    .nav-badge.red { background:rgba(239,68,68,0.2); color:#fca5a5; }
    .sidebar-bottom { margin-top:auto; border-top:1px solid rgba(255,255,255,0.06); padding-top:16px; }
    .user-card {
      display:flex; align-items:center; gap:10px; padding:8px 10px;
      border-radius:10px; cursor:pointer; transition:background .15s;
    }
    .user-card:hover { background:rgba(255,255,255,0.05); }
    .user-avatar {
      width:32px; height:32px; border-radius:50%;
      background:linear-gradient(135deg,#6366f1,#10b981);
      display:flex; align-items:center; justify-content:center;
      font-size:12px; font-weight:600; color:#fff; flex-shrink:0;
    }
    .user-info { flex:1; min-width:0; }
    .user-name  { font-size:12.5px; font-weight:500; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .user-email { font-size:11px; color:rgba(255,255,255,0.35); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .logout-btn {
      background:none; border:none; cursor:pointer;
      color:rgba(255,255,255,0.25); padding:4px; border-radius:6px;
      transition:color .15s,background .15s; display:flex;
    }
    .logout-btn:hover { color:#ef4444; background:rgba(239,68,68,0.1); }

    /* ── MAIN ── */
    .main { display:flex; flex-direction:column; min-height:100vh; }

    /* ── TOPBAR ── */
    .topbar {
      display:flex; align-items:center; justify-content:space-between;
      padding:20px 36px; border-bottom:1px solid rgba(255,255,255,0.06);
      background:rgba(15,17,23,0.8); backdrop-filter:blur(12px);
      position:sticky; top:0; z-index:5; animation:fadeIn .4s ease both;
    }
    .topbar-left  { display:flex; flex-direction:column; gap:2px; }
    .topbar-greeting { font-size:11px; color:rgba(255,255,255,0.3); font-weight:300; }
    .topbar-title { font-family:'Lora',serif; font-size:20px; font-weight:600; color:#fff; letter-spacing:-.3px; }
    .topbar-right { display:flex; align-items:center; gap:10px; }
    .topbar-btn {
      width:36px; height:36px; border:1px solid rgba(255,255,255,0.08);
      border-radius:9px; background:rgba(255,255,255,0.03);
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; color:rgba(255,255,255,0.45);
      transition:background .15s,color .15s; position:relative;
    }
    .topbar-btn:hover { background:rgba(255,255,255,0.07); color:#fff; }
    .notif-dot {
      position:absolute; top:7px; right:7px; width:6px; height:6px;
      border-radius:50%; background:#ef4444; border:1.5px solid #0f1117;
    }
    .search-bar {
      display:flex; align-items:center; gap:8px;
      background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
      border-radius:9px; padding:7px 14px; font-size:13px;
      font-family:'Sora',sans-serif; width:200px; cursor:text;
      transition:border-color .2s,background .2s;
    }
    .search-bar:focus-within { border-color:rgba(99,102,241,0.4); background:rgba(99,102,241,0.05); }
    .search-bar input {
      background:none; border:none; outline:none;
      color:#fff; font-size:13px; font-family:'Sora',sans-serif; width:100%;
    }
    .search-bar input::placeholder { color:rgba(255,255,255,0.25); }

    /* ── CONTENT ── */
    .content { padding:32px 36px; flex:1; }

    /* ── PAGE HEADER ── */
    .page-header {
      display:flex; align-items:flex-end; justify-content:space-between;
      margin-bottom:28px; animation:fadeUp .4s cubic-bezier(.22,1,.36,1) both;
    }
    .page-title { font-family:'Lora',serif; font-size:26px; font-weight:600; color:#fff; letter-spacing:-.4px; }
    .page-sub   { font-size:13px; color:rgba(255,255,255,0.35); margin-top:4px; }

    /* ── BUTTONS ── */
    .btn-primary {
      display:flex; align-items:center; gap:8px;
      padding:10px 18px; border:none; border-radius:10px;
      background:linear-gradient(135deg,#6366f1,#8b5cf6);
      color:#fff; font-family:'Sora',sans-serif; font-size:13px; font-weight:500;
      cursor:pointer; transition:opacity .2s,transform .15s,box-shadow .2s;
      white-space:nowrap;
    }
    .btn-primary:hover { opacity:.9; transform:translateY(-1px); box-shadow:0 6px 20px rgba(99,102,241,0.35); }
    .btn-primary:active { transform:translateY(0); }
    .btn-primary:disabled { opacity:.4; cursor:not-allowed; transform:none; }
    .btn-secondary {
      display:flex; align-items:center; gap:6px;
      padding:8px 14px; border:1px solid rgba(255,255,255,0.1); border-radius:9px;
      background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.6);
      font-family:'Sora',sans-serif; font-size:12px; font-weight:400;
      cursor:pointer; transition:background .15s,border-color .15s,color .15s;
    }
    .btn-secondary:hover { background:rgba(255,255,255,0.08); color:#fff; border-color:rgba(255,255,255,0.2); }

    /* ── WORKSPACE GRID ── */
    .ws-grid {
      display:grid; grid-template-columns:repeat(auto-fill,minmax(290px,1fr));
      gap:16px; margin-bottom:28px;
    }
    .ws-card {
      background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
      border-radius:14px; padding:20px 22px; cursor:pointer;
      transition:border-color .2s,background .2s,transform .15s,box-shadow .2s;
      animation:fadeUp .5s cubic-bezier(.22,1,.36,1) both;
      position:relative; overflow:hidden;
    }
    .ws-card::before {
      content:''; position:absolute; top:0; left:0; right:0; height:2px;
      background:linear-gradient(90deg,#6366f1,#8b5cf6); border-radius:14px 14px 0 0;
    }
    .ws-card:hover { border-color:rgba(99,102,241,0.3); background:rgba(99,102,241,0.05); transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,0,0,0.25); }
    .ws-card.selected { border-color:rgba(99,102,241,0.5); background:rgba(99,102,241,0.08); }
    .ws-card-top  { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:14px; }
    .ws-icon {
      width:42px; height:42px; border-radius:10px;
      background:linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.15));
      border:1px solid rgba(99,102,241,0.2);
      display:flex; align-items:center; justify-content:center; font-size:18px;
    }
    .ws-role-badge { padding:3px 9px; border-radius:100px; font-size:10px; font-weight:600; }
    .role-ADMIN  { background:rgba(99,102,241,0.15); color:#a5b4fc; }
    .role-MEMBER { background:rgba(16,185,129,0.15); color:#34d399; }
    .role-VIEWER { background:rgba(255,255,255,0.07); color:rgba(255,255,255,0.4); }
    .ws-name { font-size:15px; font-weight:600; color:#fff; margin-bottom:4px; letter-spacing:-.2px; }
    .ws-id   { font-size:11px; color:rgba(255,255,255,0.2); font-family:monospace; }
    .ws-card-footer {
      display:flex; align-items:center; justify-content:space-between;
      margin-top:16px; padding-top:14px; border-top:1px solid rgba(255,255,255,0.05);
    }
    .ws-footer-action {
      font-size:12px; color:#6366f1; cursor:pointer; background:none; border:none;
      font-family:'Sora',sans-serif; display:flex; align-items:center; gap:5px; padding:0;
      transition:color .15s;
    }
    .ws-footer-action:hover { color:#a5b4fc; }

    /* ── EMPTY STATE ── */
    .empty-state {
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      padding:80px 20px; text-align:center;
      animation:fadeUp .5s cubic-bezier(.22,1,.36,1) both;
    }
    .empty-icon {
      width:60px; height:60px; border-radius:14px;
      background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.2);
      display:flex; align-items:center; justify-content:center; margin-bottom:18px; color:#6366f1;
    }
    .empty-title { font-size:17px; font-weight:600; color:#fff; margin-bottom:7px; }
    .empty-sub   { font-size:13px; color:rgba(255,255,255,0.35); margin-bottom:22px; max-width:280px; line-height:1.7; }

    /* ── WORKSPACE PANEL ── */
    .ws-panel {
      background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07);
      border-radius:16px; overflow:hidden;
      animation:fadeUp .4s .05s cubic-bezier(.22,1,.36,1) both; margin-top:8px;
    }
    .ws-panel-header {
      display:flex; align-items:center; justify-content:space-between;
      padding:20px 24px; border-bottom:1px solid rgba(255,255,255,0.06);
      background:rgba(99,102,241,0.04);
    }
    .ws-panel-title { font-family:'Lora',serif; font-size:17px; font-weight:600; color:#fff; }
    .ws-panel-sub   { font-size:12px; color:rgba(255,255,255,0.35); margin-top:3px; }
    .ws-panel-body  { padding:22px 24px; }

    /* ── ADD MEMBER FORM ── */
    .add-member-form {
      display:flex; gap:10px; flex-wrap:wrap; align-items:flex-end;
      padding:18px 20px; background:rgba(99,102,241,0.05);
      border:1px solid rgba(99,102,241,0.15); border-radius:12px 12px 0 0;
      animation:fadeDown .3s cubic-bezier(.22,1,.36,1) both;
    }
    .add-member-form.no-preview { border-radius:12px; margin-bottom:22px; }
    .form-field { display:flex; flex-direction:column; gap:5px; flex:1; min-width:150px; }
    .form-label { font-size:11px; font-weight:500; color:rgba(255,255,255,0.35); letter-spacing:.5px; text-transform:uppercase; }
    .form-input {
      padding:9px 12px; border:1.5px solid rgba(255,255,255,0.08); border-radius:9px;
      background:rgba(255,255,255,0.04); color:#fff;
      font-family:'Sora',sans-serif; font-size:13px; outline:none;
      transition:border-color .2s,box-shadow .2s;
    }
    .form-input::placeholder { color:rgba(255,255,255,0.2); }
    .form-input:focus { border-color:rgba(99,102,241,0.5); box-shadow:0 0 0 3px rgba(99,102,241,0.1); }
    .form-input.has-selection { border-color:rgba(16,185,129,0.4); }
    .form-select {
      padding:9px 12px; border:1.5px solid rgba(255,255,255,0.08); border-radius:9px;
      background:#1a1c25; color:#fff;
      font-family:'Sora',sans-serif; font-size:13px; outline:none; cursor:pointer;
      transition:border-color .2s;
    }
    .form-select:focus { border-color:rgba(99,102,241,0.5); }

    /* ── SEARCH DROPDOWN ── */
    .search-dropdown {
      position:absolute; top:calc(100% + 6px); left:0; right:0; z-index:30;
      background:#1a1c26; border:1px solid rgba(255,255,255,0.1);
      border-radius:10px; overflow:hidden;
      box-shadow:0 12px 32px rgba(0,0,0,0.45);
      animation:fadeDown .15s ease both;
    }
    .dropdown-item {
      display:flex; align-items:center; gap:10px;
      padding:10px 14px; cursor:pointer;
      border-bottom:1px solid rgba(255,255,255,0.05);
      transition:background .12s;
    }
    .dropdown-item:last-child { border-bottom:none; }
    .dropdown-item:hover { background:rgba(99,102,241,0.12); }
    .dropdown-avatar {
      width:30px; height:30px; border-radius:50%; flex-shrink:0;
      display:flex; align-items:center; justify-content:center;
      font-size:11px; font-weight:600; color:#fff;
    }
    .dropdown-name  { font-size:13px; font-weight:500; color:#fff; }
    .dropdown-email { font-size:11px; color:rgba(255,255,255,0.35); }
    .dropdown-empty {
      padding:16px; text-align:center;
      font-size:12px; color:rgba(255,255,255,0.3);
    }

    /* ── SELECTED USER PREVIEW ── */
    .selected-preview {
      display:flex; align-items:center; gap:10px;
      padding:10px 20px; margin-bottom:22px;
      background:rgba(16,185,129,0.06);
      border:1px solid rgba(16,185,129,0.18);
      border-top:none; border-radius:0 0 12px 12px;
      animation:fadeDown .2s ease both;
    }
    .preview-dot { width:6px; height:6px; border-radius:50%; background:#10b981; flex-shrink:0; }

    /* ── FEEDBACK MSGS ── */
    .error-msg {
      font-size:12px; color:#ef4444; display:flex; align-items:center; gap:5px;
      animation:fadeDown .2s ease both; margin-top:4px; width:100%;
    }
    .success-msg {
      font-size:12px; color:#10b981; display:flex; align-items:center; gap:6px;
      animation:fadeDown .2s ease both; padding:10px 14px;
      background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.2);
      border-radius:9px; margin-bottom:14px;
    }

    /* ── MODAL ── */
    .modal-overlay {
      position:fixed; inset:0; background:rgba(0,0,0,0.65); backdrop-filter:blur(8px);
      display:flex; align-items:center; justify-content:center; z-index:50;
      animation:fadeIn .2s ease both;
    }
    .modal {
      background:#161820; border:1px solid rgba(255,255,255,0.1); border-radius:16px;
      padding:28px 30px; width:100%; max-width:420px;
      animation:fadeUp .3s cubic-bezier(.22,1,.36,1) both;
    }
    .modal-title { font-family:'Lora',serif; font-size:18px; font-weight:600; color:#fff; margin-bottom:5px; }
    .modal-sub   { font-size:13px; color:rgba(255,255,255,0.4); margin-bottom:22px; }
    .modal-field { display:flex; flex-direction:column; gap:6px; margin-bottom:18px; }
    .modal-label { font-size:12px; font-weight:500; color:rgba(255,255,255,0.45); }
    .modal-input {
      padding:11px 14px; border:1.5px solid rgba(255,255,255,0.1); border-radius:10px;
      background:rgba(255,255,255,0.05); color:#fff;
      font-family:'Sora',sans-serif; font-size:14px; outline:none;
      transition:border-color .2s,box-shadow .2s;
    }
    .modal-input::placeholder { color:rgba(255,255,255,0.2); }
    .modal-input:focus { border-color:#6366f1; box-shadow:0 0 0 4px rgba(99,102,241,0.12); }
    .modal-footer { display:flex; gap:10px; justify-content:flex-end; margin-top:8px; }
    .btn-cancel {
      padding:9px 18px; border:1px solid rgba(255,255,255,0.1); border-radius:9px;
      background:none; color:rgba(255,255,255,0.5); font-family:'Sora',sans-serif;
      font-size:13px; cursor:pointer; transition:background .15s,color .15s;
    }
    .btn-cancel:hover { background:rgba(255,255,255,0.06); color:#fff; }

    /* ── SPINNER ── */
    .spinner    { width:14px; height:14px; border:2px solid rgba(255,255,255,0.25); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; display:inline-block; }
    .spinner-sm { width:13px; height:13px; border:2px solid rgba(99,102,241,0.3); border-top-color:#6366f1; border-radius:50%; animation:spin .7s linear infinite; display:inline-block; }
    .spinner-lg { width:28px; height:28px; border:2px solid rgba(99,102,241,0.2); border-top-color:#6366f1; border-radius:50%; animation:spin .8s linear infinite; }
    .loading-screen { position:fixed; inset:0; background:#0f1117; display:flex; align-items:center; justify-content:center; z-index:100; }

    /* ── INFO TILES ── */
    .info-tiles { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
    .info-tile { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:14px 16px; }
    .info-tile-label { font-size:11px; color:rgba(255,255,255,0.3); margin-bottom:6px; text-transform:uppercase; letter-spacing:.5px; }
    .info-tile-value { font-size:14px; font-weight:500; color:#fff; }

    /* ── SIDEBAR TREE ── */
    .ws-tree-item { width:100%; }
    .ws-tree-header {
      display:flex; align-items:center; gap:7px; padding:7px 8px; border-radius:8px;
      cursor:pointer; transition:background .12s; width:100%;
      background:none; border:none; text-align:left; color:rgba(255,255,255,0.75);
      font-family:'Sora',sans-serif; font-size:13px; font-weight:500;
    }
    .ws-tree-header:hover { background:rgba(255,255,255,0.06); }
    .ws-tree-header.active { background:rgba(99,102,241,0.12); color:#a5b4fc; }
    .ws-tree-chevron {
      transition:transform .2s; color:rgba(255,255,255,0.2); flex-shrink:0;
      display:flex; align-items:center;
    }
    .ws-tree-chevron.open { transform:rotate(90deg); }
    .ws-tree-icon {
      width:22px; height:22px; border-radius:6px; flex-shrink:0;
      background:linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.15));
      display:flex; align-items:center; justify-content:center; font-size:11px;
    }
    .ws-tree-name { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .ws-tree-role { font-size:9px; font-weight:600; padding:1px 5px; border-radius:100px; flex-shrink:0; }
    .ws-projects { padding-left:12px; margin-top:2px; border-left:1px solid rgba(255,255,255,0.06); margin-left:18px; }
    .project-link {
      display:flex; align-items:center; gap:7px; padding:6px 8px; border-radius:7px;
      cursor:pointer; transition:background .12s,color .12s; width:100%;
      background:none; border:none; text-align:left;
      color:rgba(255,255,255,0.4); font-family:'Sora',sans-serif; font-size:12px;
    }
    .project-link:hover { background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.75); }
    .project-link.active { background:rgba(99,102,241,0.1); color:#a5b4fc; }
    .project-dot { width:5px; height:5px; border-radius:50%; background:rgba(255,255,255,0.2); flex-shrink:0; }
    .project-link.active .project-dot { background:#6366f1; }
    .proj-loading { padding:6px 8px; font-size:11px; color:rgba(255,255,255,0.2); display:flex; align-items:center; gap:6px; }

    @media (max-width:768px) {
      .sidebar  { transform:translateX(-100%); }
      .main     { margin-left:0; }
      .content  { padding:20px 16px; }
      .ws-grid  { grid-template-columns:1fr; }
      .info-tiles { grid-template-columns:1fr; }
    }
  `}</style>
);

/* ── Icons ─────────────────────────────────────────────────────────────── */
const LogoIcon     = () => <svg width="18" height="18" viewBox="0 0 32 32" fill="none"><path d="M16 2L28 9v14L16 30 4 23V9L16 2z" fill="white" opacity=".9"/><path d="M16 8L24 12.5v9L16 26 8 21.5v-9L16 8z" fill="white" opacity=".4"/></svg>;
const SearchIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const BellIcon     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const LogoutIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const PlusIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const ChevronIcon  = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const UserPlusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>;
const CheckIcon    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const FolderIcon   = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;

const navItems = [
  { label: "Vue d'ensemble", icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10', badge: null, badgeRed: false },
  { label: 'Workspaces',     icon: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z', badge: null, badgeRed: false },
  { label: 'Équipe',         icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75', badge: null, badgeRed: false },
  { label: 'Analytique',     icon: 'M18 20V10M12 20V4M6 20v-6', badge: null, badgeRed: false },
  { label: 'Messages',       icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', badge: '3', badgeRed: true },
  { label: 'Paramètres',     icon: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', badge: null, badgeRed: false },
];

/* ── Types ─────────────────────────────────────────────────────────────── */
type UserResult = { id: string; fullName: string; email: string };

/* ── Helpers ───────────────────────────────────────────────────────────── */
function avatarColor(name: string) {
  const hue = (name.charCodeAt(0) * 37 + name.charCodeAt(1 % name.length) * 17) % 360;
  return `linear-gradient(135deg, hsl(${hue},60%,52%), hsl(${(hue+50)%360},60%,42%))`;
}
function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

/* ── Modal Créer Workspace ─────────────────────────────────────────────── */
function CreateWorkspaceModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}) {
  const [name, setName]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Le nom est requis.'); return; }
    setLoading(true); setError('');
    try { await onCreate(name.trim()); onClose(); }
    catch { setError('Erreur lors de la création. Réessayez.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Nouveau workspace</div>
        <div className="modal-sub">Créez un espace de travail pour votre équipe</div>
        <div className="modal-field">
          <label className="modal-label">Nom du workspace</label>
          <input
            className="modal-input" autoFocus
            placeholder="Ex : Équipe Produit, Projet Alpha…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          {error && <p className="error-msg">⚠ {error}</p>}
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Annuler</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="spinner" /> : <PlusIcon />} Créer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Add Member Form — recherche dynamique ─────────────────────────────── */
function AddMemberForm({ workspaceId, onAdd }: {
  workspaceId: string;
  onAdd: (wsId: string, userId: string, role: WorkspaceRole) => Promise<void>;
}) {
  const [query,     setQuery]     = useState('');
  const [results,   setResults]   = useState<UserResult[]>([]);
  const [selected,  setSelected]  = useState<UserResult | null>(null);
  const [role,      setRole]      = useState<WorkspaceRole>('MEMBER');
  const [searching, setSearching] = useState(false);
  const [open,      setOpen]      = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef     = useRef<HTMLDivElement>(null);

  // Fermer dropdown si clic extérieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Recherche avec debounce 300ms
  const handleQueryChange = (val: string) => {
    setQuery(val);
    setSelected(null);
    setError('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length < 2) { setResults([]); setOpen(false); return; }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchUsers(val.trim());
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  // Sélectionner un utilisateur dans le dropdown
  const pickUser = (u: UserResult) => {
    setSelected(u);
    setQuery(u.fullName);
    setOpen(false);
    setResults([]);
    setError('');
  };

  // Effacer la sélection
  const clearSelection = () => {
    setQuery(''); setSelected(null); setResults([]); setOpen(false); setError('');
  };

  // Soumettre l'ajout
  const handleAdd = async () => {
    if (!selected) { setError('Sélectionnez un utilisateur dans la liste.'); return; }
    setLoading(true); setError(''); setSuccess(false);
    try {
      await onAdd(workspaceId, selected.id, role);
      clearSelection();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: any) {
      // Afficher le message d'erreur du backend s'il existe (409 conflit, 404, etc.)
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Erreur lors de l'ajout. Réessayez.";
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally { setLoading(false); }
  };

  const hasPreview = !!selected;

  return (
    <div style={{ marginBottom: 22 }}>

      {/* Message succès */}
      {success && (
        <div className="success-msg">
          <CheckIcon /> Membre ajouté avec succès !
        </div>
      )}

      {/* Formulaire */}
      <div className={`add-member-form ${hasPreview ? '' : 'no-preview'}`}>

        {/* Champ recherche */}
        <div className="form-field" style={{ position: 'relative', minWidth: 220 }} ref={wrapRef}>
          <span className="form-label">Rechercher un utilisateur</span>
          <div style={{ position: 'relative' }}>
            {/* Icône gauche */}
            <span style={{
              position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
              pointerEvents: 'none', display: 'flex', alignItems: 'center',
              color: selected ? '#10b981' : 'rgba(255,255,255,0.25)',
            }}>
              {searching
                ? <span className="spinner-sm" />
                : selected
                  ? <CheckIcon />
                  : <SearchIcon />}
            </span>

            <input
              className={`form-input ${selected ? 'has-selection' : ''}`}
              style={{ paddingLeft: 34, paddingRight: 30 }}
              placeholder="Tapez un prénom ou nom…"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => results.length > 0 && !selected && setOpen(true)}
              autoComplete="off"
            />

            {/* Bouton effacer */}
            {query && (
              <button onClick={clearSelection} style={{
                position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
                color: 'rgba(255,255,255,0.3)', fontSize: 16, lineHeight: 1,
                transition: 'color .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >×</button>
            )}

            {/* Dropdown résultats */}
            {open && (
              <div className="search-dropdown">
                {results.length > 0 ? results.map((u) => (
                  <div key={u.id} className="dropdown-item" onMouseDown={() => pickUser(u)}>
                    <div
                      className="dropdown-avatar"
                      style={{ background: avatarColor(u.fullName) }}
                    >
                      {initials(u.fullName)}
                    </div>
                    <div>
                      <div className="dropdown-name">{u.fullName}</div>
                      <div className="dropdown-email">{u.email}</div>
                    </div>
                  </div>
                )) : (
                  <div className="dropdown-empty">
                    Aucun résultat pour &quot;{query}&quot;
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sélecteur de rôle */}
        <div className="form-field" style={{ maxWidth: 150 }}>
          <span className="form-label">Rôle</span>
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value as WorkspaceRole)}
          >
            <option value="ADMIN">Admin</option>
            <option value="MEMBER">Member</option>
            <option value="VIEWER">Viewer</option>
          </select>
        </div>

        {/* Bouton ajouter */}
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            className="btn-primary"
            onClick={handleAdd}
            disabled={loading || !selected}
          >
            {loading ? <span className="spinner" /> : <UserPlusIcon />}
            Ajouter
          </button>
        </div>

      </div>

      {/* Banner erreur visible */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '13px 16px',
          background: error.toLowerCase().includes('déjà membre') ? 'rgba(251,191,36,0.08)' : 'rgba(239,68,68,0.08)',
          border: `1px solid ${error.toLowerCase().includes('déjà membre') ? 'rgba(251,191,36,0.25)' : 'rgba(239,68,68,0.25)'}`,
          borderTop: 'none',
          borderRadius: hasPreview ? '0' : '0 0 12px 12px',
          marginBottom: hasPreview ? 0 : 22,
          animation: 'fadeDown .2s ease both',
        }}>
          <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>
            {error.toLowerCase().includes('déjà membre') ? '⚠️' : '✕'}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 13, fontWeight: 600, marginBottom: 3,
              color: error.toLowerCase().includes('déjà membre') ? '#fbbf24' : '#f87171',
            }}>
              {error.toLowerCase().includes('déjà membre') ? 'Déjà membre' : 'Erreur'}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
              {error}
            </div>
          </div>
          <button onClick={() => setError('')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.3)', fontSize: 18, lineHeight: 1, padding: '0 2px', flexShrink: 0,
          }}>×</button>
        </div>
      )}

      {/* Aperçu de l'utilisateur sélectionné */}
      {hasPreview && (
        <div className="selected-preview">
          <div className="preview-dot" />
          <div
            style={{
              width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
              background: avatarColor(selected!.fullName),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 600, color: '#fff',
            }}
          >
            {initials(selected!.fullName)}
          </div>
          <span style={{ fontSize: 12, fontWeight: 500, color: '#fff' }}>
            {selected!.fullName}
          </span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
            · {selected!.email}
          </span>
          <span
            className={`ws-role-badge role-${role}`}
            style={{ marginLeft: 'auto', fontSize: 10 }}
          >
            {role}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Workspace Card ────────────────────────────────────────────────────── */
function WorkspaceCard({ ws, selected, onClick, onNavigate }: {
  ws: Workspace; selected: boolean; onClick: () => void; onNavigate: () => void;
}) {
  const emojis = ['🏢', '🚀', '💡', '🎯', '⚡', '🌿', '🔮', '🛠️'];
  const emoji  = emojis[ws.workspaceId.charCodeAt(0) % emojis.length];
  return (
    <div className={`ws-card ${selected ? 'selected' : ''}`} onClick={onClick}>
      <div className="ws-card-top">
        <div className="ws-icon">{emoji}</div>
        <span className={`ws-role-badge role-${ws.role}`}>{ws.role}</span>
      </div>
      <div className="ws-name">{ws.name}</div>
      <div className="ws-id">{ws.workspaceId}</div>
      <div className="ws-card-footer">
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Workspace</span>
        <button
          className="ws-footer-action"
          onClick={e => { e.stopPropagation(); onNavigate(); }}
        >
          Projets <ChevronIcon />
        </button>
      </div>
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { logout, profileQuery, token } = useAuth();
  const { workspacesQuery, createMutation, addMemberMutation } = useWorkspaces();
  const router  = useRouter();

  const [activeNav,       setActiveNav]       = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWs,      setSelectedWs]      = useState<Workspace | null>(null);
  const [showAddMember,   setShowAddMember]   = useState(false);

  useEffect(() => {
    if (!token) router.replace('/auth/login');
  }, [token, router]);

  if (!token) return <div className="loading-screen"><span className="spinner-lg" /></div>;

  const userName     = profileQuery.data?.name  ?? 'Utilisateur';
  const userEmail    = profileQuery.data?.email ?? '';
  const userInitials = initials(userName) || 'U';
  const greeting     = new Date().getHours() < 12 ? 'Bonjour' : new Date().getHours() < 18 ? 'Bon après-midi' : 'Bonsoir';
  const workspaces: Workspace[] = workspacesQuery.data ?? [];

  const handleCreate    = (name: string) => createMutation.mutateAsync(name);
  const handleAddMember = (wsId: string, userId: string, role: WorkspaceRole) =>
    addMemberMutation.mutateAsync({ workspaceId: wsId, userId, role });
  const handleLogout    = () => { logout(); router.replace('/auth/login'); };

  return (
    <>
      <GlobalStyles />
      {showCreateModal && (
        <CreateWorkspaceModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
        />
      )}

      <div className="dash-root" style={{ marginLeft: 0 }}>



        {/* ── MAIN ── */}
        <div className="main">
          <header className="topbar">
            <div className="topbar-left">
              <span className="topbar-greeting">{greeting}, {userName.split(' ')[0]} 👋</span>
              <h1 className="topbar-title">{navItems[activeNav]?.label ?? 'Dashboard'}</h1>
            </div>
            <div className="topbar-right">
              <div className="search-bar">
                <SearchIcon />
                <input placeholder="Rechercher…" />
              </div>
              <button className="topbar-btn">
                <BellIcon />
                <span className="notif-dot" />
              </button>
              <div className="user-avatar" style={{ width: 34, height: 34, fontSize: 12, cursor: 'pointer' }}>
                {userInitials}
              </div>
            </div>
          </header>

          <div className="content">

            {/* PAGE HEADER */}
            <div className="page-header">
              <div>
                <h2 className="page-title">Mes Workspaces</h2>
                <p className="page-sub">
                  {workspacesQuery.isLoading
                    ? 'Chargement…'
                    : `${workspaces.length} workspace${workspaces.length !== 1 ? 's' : ''} disponible${workspaces.length !== 1 ? 's' : ''}`}
                </p>
              </div>
              <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                <PlusIcon /> Nouveau workspace
              </button>
            </div>

            {/* WORKSPACE CARDS */}
            {workspacesQuery.isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                <span className="spinner-lg" />
              </div>
            ) : workspaces.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><FolderIcon /></div>
                <div className="empty-title">Aucun workspace</div>
                <div className="empty-sub">
                  Créez votre premier espace de travail pour commencer à collaborer avec votre équipe.
                </div>
                <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                  <PlusIcon /> Créer mon premier workspace
                </button>
              </div>
            ) : (
              <div className="ws-grid">
                {workspaces.map((ws) => (
                  <WorkspaceCard
                    key={ws.workspaceId}
                    ws={ws}
                    selected={selectedWs?.workspaceId === ws.workspaceId}
                    onClick={() => { setSelectedWs(ws); setShowAddMember(false); }}
                    onNavigate={() => {
                      sessionStorage.setItem(`ws_role_${ws.workspaceId}`, ws.role);
                      router.push(`/workspaces/${ws.workspaceId}/projects?name=${encodeURIComponent(ws.name)}`);
                    }}
                  />
                ))}
              </div>
            )}

            {/* SELECTED WORKSPACE PANEL */}
            {selectedWs && (
              <div className="ws-panel">
                <div className="ws-panel-header">
                  <div>
                    <div className="ws-panel-title">{selectedWs.name}</div>
                    <div className="ws-panel-sub">
                      ID&nbsp;:&nbsp;
                      <span style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.45)' }}>
                        {selectedWs.workspaceId}
                      </span>
                      &nbsp;·&nbsp;Votre rôle&nbsp;:&nbsp;
                      <span
                        className={`ws-role-badge role-${selectedWs.role}`}
                        style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 2 }}
                      >
                        {selectedWs.role}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {selectedWs.role === 'ADMIN' && (
                      <button
                        className="btn-primary"
                        onClick={() => setShowAddMember(!showAddMember)}
                      >
                        <UserPlusIcon />
                        {showAddMember ? 'Fermer' : 'Ajouter un membre'}
                      </button>
                    )}
                    <button className="btn-secondary" onClick={() => { setSelectedWs(null); setShowAddMember(false); }}>
                      Fermer
                    </button>
                  </div>
                </div>

                <div className="ws-panel-body">
                  {/* ADD MEMBER — visible uniquement pour ADMIN */}
                  {showAddMember && selectedWs.role === 'ADMIN' && (
                    <AddMemberForm
                      workspaceId={selectedWs.workspaceId}
                      onAdd={handleAddMember}
                    />
                  )}

                  {/* INFO TILES */}
                  <div className="info-tiles">
                    {[
                      { label: 'Workspace ID', value: selectedWs.workspaceId.slice(0, 8) + '…', mono: true },
                      { label: 'Votre rôle',   value: selectedWs.role,  mono: false },
                      { label: 'Statut',        value: 'Actif',          mono: false },
                    ].map((t, i) => (
                      <div key={i} className="info-tile">
                        <div className="info-tile-label">{t.label}</div>
                        <div className="info-tile-value" style={{ fontFamily: t.mono ? 'monospace' : undefined }}>
                          {t.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}