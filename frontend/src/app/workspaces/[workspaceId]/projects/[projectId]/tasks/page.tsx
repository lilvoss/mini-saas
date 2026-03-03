'use client';

import { useAuth } from '@/lib/useAuth';
import { useTasks, Task, TaskStatus, TaskPriority, WorkspaceMember } from '@/lib/useTasks';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/* ── CSS ────────────────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
    @keyframes fadeDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes spin     { to{transform:rotate(360deg)} }
    @keyframes shimmer  { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
    @keyframes slideIn  { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }

    html,body { height:100%; background:#0c0d12; }
    .page-root { min-height:100vh; background:#0c0d12; font-family:'Sora',sans-serif; color:#fff; display:flex; flex-direction:column; }

    /* ── TOPBAR ── */
    .topbar {
      display:flex; align-items:center; justify-content:space-between;
      padding:14px 28px; border-bottom:1px solid rgba(255,255,255,0.06);
      background:rgba(12,13,18,0.95); backdrop-filter:blur(14px);
      position:sticky; top:0; z-index:30; flex-shrink:0;
    }
    .topbar-left  { display:flex; align-items:center; gap:10px; }
    .topbar-right { display:flex; align-items:center; gap:10px; }
    .back-btn {
      display:flex; align-items:center; gap:5px; padding:6px 11px;
      border:1px solid rgba(255,255,255,0.09); border-radius:7px;
      background:none; color:rgba(255,255,255,0.45); font-family:'Sora',sans-serif;
      font-size:11.5px; cursor:pointer; transition:all .15s;
    }
    .back-btn:hover { background:rgba(255,255,255,0.06); color:#fff; }
    .breadcrumb { font-size:12px; color:rgba(255,255,255,0.25); }
    .breadcrumb-active { color:#fff; font-weight:500; }
    .sep { color:rgba(255,255,255,0.15); margin:0 4px; }
    .btn-primary {
      display:flex; align-items:center; gap:7px; padding:8px 16px;
      border:none; border-radius:9px;
      background:linear-gradient(135deg,#6366f1,#8b5cf6);
      color:#fff; font-family:'Sora',sans-serif; font-size:12.5px; font-weight:500;
      cursor:pointer; transition:opacity .2s,transform .15s,box-shadow .2s; white-space:nowrap;
    }
    .btn-primary:hover { opacity:.88; transform:translateY(-1px); box-shadow:0 5px 16px rgba(99,102,241,.35); }
    .btn-primary:disabled { opacity:.4; cursor:not-allowed; transform:none; }
    .role-chip {
      padding:3px 9px; border-radius:100px; font-size:10px; font-weight:600;
    }
    .role-ADMIN  { background:rgba(99,102,241,0.15); color:#a5b4fc; border:1px solid rgba(99,102,241,0.2); }
    .role-MEMBER { background:rgba(16,185,129,0.12); color:#34d399; border:1px solid rgba(16,185,129,0.2); }
    .role-VIEWER { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.35); border:1px solid rgba(255,255,255,0.1); }

    /* ── KANBAN BOARD ── */
    .board { display:flex; gap:16px; padding:24px 28px; flex:1; overflow-x:auto; align-items:flex-start; }
    .column {
      flex:0 0 320px; display:flex; flex-direction:column; gap:0;
      border-radius:14px; overflow:hidden;
      border:1px solid rgba(255,255,255,0.06);
      background:rgba(255,255,255,0.02);
      transition:border-color .2s;
    }
    .column.drag-over {
      border-color:rgba(99,102,241,0.4);
      background:rgba(99,102,241,0.04);
    }
    .col-header {
      display:flex; align-items:center; justify-content:space-between;
      padding:14px 16px; border-bottom:1px solid rgba(255,255,255,0.05);
    }
    .col-title-row { display:flex; align-items:center; gap:8px; }
    .col-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
    .col-title { font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:.8px; }
    .col-count {
      font-size:11px; font-weight:600; padding:2px 8px;
      border-radius:100px; background:rgba(255,255,255,0.07); color:rgba(255,255,255,0.4);
    }
    .col-body { padding:10px; display:flex; flex-direction:column; gap:8px; min-height:200px; }

    /* ── TASK CARD ── */
    .task-card {
      background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);
      border-radius:11px; padding:14px; cursor:grab; user-select:none;
      transition:border-color .15s,background .15s,box-shadow .15s,transform .15s;
      animation:fadeUp .3s cubic-bezier(.22,1,.36,1) both;
      position:relative;
    }
    .task-card:hover { border-color:rgba(99,102,241,0.3); background:rgba(99,102,241,0.04); box-shadow:0 4px 16px rgba(0,0,0,.25); }
    .task-card.dragging { opacity:.45; transform:scale(.97); cursor:grabbing; }
    .task-card.drag-placeholder {
      border:2px dashed rgba(99,102,241,0.35); background:rgba(99,102,241,0.04);
      min-height:80px; border-radius:11px;
    }
    .task-card-top { display:flex; align-items:flex-start; justify-content:space-between; gap:8px; margin-bottom:8px; }
    .task-title { font-size:13px; font-weight:500; color:#fff; line-height:1.45; flex:1; }
    .priority-badge {
      flex-shrink:0; padding:2px 7px; border-radius:100px; font-size:10px; font-weight:600;
    }
    .p-LOW    { background:rgba(99,102,241,0.12); color:#a5b4fc; }
    .p-MEDIUM { background:rgba(251,191,36,0.12); color:#fbbf24; }
    .p-HIGH   { background:rgba(249,115,22,0.12); color:#fb923c; }
    .p-URGENT { background:rgba(239,68,68,0.15);  color:#f87171; }
    .task-desc { font-size:11.5px; color:rgba(255,255,255,0.35); line-height:1.5; margin-bottom:10px; }
    .task-footer { display:flex; align-items:center; justify-content:space-between; gap:8px; }
    .task-due { font-size:10.5px; color:rgba(255,255,255,0.25); display:flex; align-items:center; gap:4px; }
    .task-due.overdue { color:#f87171; }
    .assignee-chip {
      display:flex; align-items:center; gap:5px;
    }
    .assignee-avatar {
      width:22px; height:22px; border-radius:50%; flex-shrink:0;
      display:flex; align-items:center; justify-content:center;
      font-size:8px; font-weight:700; color:#fff;
    }
    .assignee-name { font-size:10.5px; color:rgba(255,255,255,0.4); }
    .unassigned { font-size:10.5px; color:rgba(255,255,255,0.2); display:flex; align-items:center; gap:4px; }

    /* ── SIDE PANEL (task detail) ── */
    .overlay { position:fixed; inset:0; background:rgba(0,0,0,0.55); backdrop-filter:blur(6px); z-index:40; animation:fadeIn .2s ease both; }
    .side-panel {
      position:fixed; top:0; right:0; bottom:0; width:480px; max-width:95vw;
      background:#13141d; border-left:1px solid rgba(255,255,255,0.09);
      z-index:41; display:flex; flex-direction:column; overflow:hidden;
      animation:slideIn .25s cubic-bezier(.22,1,.36,1) both;
    }
    .panel-header {
      display:flex; align-items:center; justify-content:space-between;
      padding:20px 24px; border-bottom:1px solid rgba(255,255,255,0.07); flex-shrink:0;
    }
    .panel-title-area { flex:1; min-width:0; }
    .panel-title { font-family:'Lora',serif; font-size:18px; font-weight:600; color:#fff; line-height:1.35; }
    .panel-project { font-size:11px; color:rgba(255,255,255,0.3); margin-top:3px; }
    .close-btn {
      width:32px; height:32px; border-radius:8px; border:1px solid rgba(255,255,255,0.09);
      background:none; color:rgba(255,255,255,0.4); cursor:pointer; font-size:18px;
      display:flex; align-items:center; justify-content:center; flex-shrink:0;
      transition:background .15s,color .15s;
    }
    .close-btn:hover { background:rgba(255,255,255,0.07); color:#fff; }
    .panel-body { flex:1; overflow-y:auto; padding:22px 24px; display:flex; flex-direction:column; gap:20px; }
    .panel-section-label {
      font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:1px;
      color:rgba(255,255,255,0.25); margin-bottom:8px;
    }
    .panel-row { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
    .panel-select {
      padding:8px 12px; border:1.5px solid rgba(255,255,255,0.09); border-radius:9px;
      background:#1c1e2a; color:#fff; font-family:'Sora',sans-serif; font-size:12.5px;
      outline:none; cursor:pointer; transition:border-color .2s;
    }
    .panel-select:focus { border-color:rgba(99,102,241,0.5); }
    .panel-desc {
      font-size:13px; color:rgba(255,255,255,0.55); line-height:1.7;
      background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
      border-radius:9px; padding:12px; white-space:pre-wrap;
    }
    .panel-no-desc { font-size:13px; color:rgba(255,255,255,0.2); font-style:italic; }
    .panel-footer {
      padding:16px 24px; border-top:1px solid rgba(255,255,255,0.07); flex-shrink:0;
      display:flex; gap:10px;
    }
    .btn-save {
      flex:1; padding:10px; border:none; border-radius:9px;
      background:linear-gradient(135deg,#6366f1,#8b5cf6);
      color:#fff; font-family:'Sora',sans-serif; font-size:13px; font-weight:500;
      cursor:pointer; transition:opacity .2s; display:flex; align-items:center; justify-content:center; gap:7px;
    }
    .btn-save:hover { opacity:.88; }
    .btn-save:disabled { opacity:.4; cursor:not-allowed; }
    .btn-del-task {
      padding:10px 16px; border:1px solid rgba(239,68,68,0.2); border-radius:9px;
      background:rgba(239,68,68,0.06); color:#f87171;
      font-family:'Sora',sans-serif; font-size:12.5px; cursor:pointer;
      transition:background .15s,border-color .15s; display:flex; align-items:center; gap:6px;
    }
    .btn-del-task:hover { background:rgba(239,68,68,0.12); border-color:rgba(239,68,68,0.35); }
    .btn-del-task:disabled { opacity:.4; cursor:not-allowed; }

    /* ── MODAL ── */
    .modal-overlay {
      position:fixed; inset:0; background:rgba(0,0,0,0.72); backdrop-filter:blur(10px);
      display:flex; align-items:center; justify-content:center; z-index:60;
      animation:fadeIn .2s ease both;
    }
    .modal {
      background:#14151e; border:1px solid rgba(255,255,255,0.1); border-radius:16px;
      padding:28px 30px; width:100%; max-width:460px;
      animation:fadeUp .28s cubic-bezier(.22,1,.36,1) both;
    }
    .modal-title { font-family:'Lora',serif; font-size:19px; font-weight:600; color:#fff; margin-bottom:5px; }
    .modal-sub   { font-size:13px; color:rgba(255,255,255,0.38); margin-bottom:22px; }
    .field { display:flex; flex-direction:column; gap:6px; margin-bottom:16px; }
    .field-label { font-size:11px; font-weight:500; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:.5px; }
    .field-input {
      padding:10px 13px; border:1.5px solid rgba(255,255,255,0.09); border-radius:9px;
      background:rgba(255,255,255,0.04); color:#fff;
      font-family:'Sora',sans-serif; font-size:13px; outline:none;
      transition:border-color .2s,box-shadow .2s;
    }
    .field-input::placeholder { color:rgba(255,255,255,0.2); }
    .field-input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.12); }
    .field-textarea { min-height:90px; resize:vertical; }
    .field-select {
      padding:10px 13px; border:1.5px solid rgba(255,255,255,0.09); border-radius:9px;
      background:#1c1e2a; color:#fff; font-family:'Sora',sans-serif; font-size:13px;
      outline:none; cursor:pointer; transition:border-color .2s;
    }
    .field-select:focus { border-color:#6366f1; }
    .modal-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    .modal-footer { display:flex; gap:10px; justify-content:flex-end; margin-top:6px; }
    .btn-cancel {
      padding:9px 18px; border:1px solid rgba(255,255,255,0.1); border-radius:9px;
      background:none; color:rgba(255,255,255,0.5); font-family:'Sora',sans-serif;
      font-size:12.5px; cursor:pointer; transition:background .15s,color .15s;
    }
    .btn-cancel:hover { background:rgba(255,255,255,0.06); color:#fff; }

    /* ── MEMBER PICKER ── */
    .member-list { display:flex; flex-direction:column; gap:6px; max-height:240px; overflow-y:auto; }
    .member-item {
      display:flex; align-items:center; gap:10px; padding:9px 12px;
      border-radius:9px; cursor:pointer; border:1px solid transparent;
      transition:background .12s,border-color .12s;
    }
    .member-item:hover { background:rgba(99,102,241,0.08); border-color:rgba(99,102,241,0.2); }
    .member-item.selected { background:rgba(99,102,241,0.12); border-color:rgba(99,102,241,0.3); }
    .member-avatar {
      width:30px; height:30px; border-radius:50%; flex-shrink:0;
      display:flex; align-items:center; justify-content:center;
      font-size:10px; font-weight:700; color:#fff;
    }
    .member-name  { font-size:13px; font-weight:500; color:#fff; }
    .member-email { font-size:11px; color:rgba(255,255,255,0.35); }
    .member-role  { margin-left:auto; }

    /* ── EMPTY ── */
    .col-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:28px 16px; gap:8px; opacity:.5; }
    .col-empty-icon { font-size:22px; }
    .col-empty-text { font-size:11.5px; color:rgba(255,255,255,0.3); text-align:center; }

    /* ── SPINNERS ── */
    .spinner    { width:13px; height:13px; border:2px solid rgba(255,255,255,0.2); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; display:inline-block; }
    .spinner-lg { width:32px; height:32px; border:2px solid rgba(99,102,241,0.2); border-top-color:#6366f1; border-radius:50%; animation:spin .8s linear infinite; }
    .loading-screen { position:fixed; inset:0; background:#0c0d12; display:flex; align-items:center; justify-content:center; z-index:100; }

    /* ── SCROLLBAR ── */
    ::-webkit-scrollbar { width:5px; height:5px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:10px; }
    ::-webkit-scrollbar-thumb:hover { background:rgba(255,255,255,0.2); }

    @media (max-width:768px) {
      .board { flex-direction:column; padding:16px; }
      .column { flex:none; width:100%; }
      .side-panel { width:100%; }
    }
  `}</style>
);

/* ── Icons ──────────────────────────────────────────────────────────────── */
const BackIcon   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const PlusIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TrashIcon  = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const CalIcon    = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const UserIcon   = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const SaveIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function avatarColor(name: string) {
  const hue = (name.charCodeAt(0) * 37 + (name.charCodeAt(1) || 0) * 17) % 360;
  return `linear-gradient(135deg,hsl(${hue},60%,52%),hsl(${(hue+50)%360},60%,42%))`;
}
function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}
function isOverdue(iso?: string) {
  if (!iso) return false;
  return new Date(iso) < new Date();
}

const PRIORITY_ORDER: Record<TaskPriority, number> = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

function sortTasks(tasks: Task[]) {
  return [...tasks].sort((a, b) => {
    const pd = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (pd !== 0) return pd;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

/* ── Column config ───────────────────────────────────────────────────────── */
const COLUMNS: { id: TaskStatus; label: string; color: string; dot: string }[] = [
  { id: 'TODO',  label: 'À faire',   color: 'rgba(99,102,241,0.7)',  dot: '#6366f1' },
  { id: 'DOING', label: 'En cours',  color: 'rgba(251,191,36,0.7)',  dot: '#fbbf24' },
  { id: 'DONE',  label: 'Terminé',   color: 'rgba(16,185,129,0.7)',  dot: '#10b981' },
];

/* ── Create Task Modal ───────────────────────────────────────────────────── */
function CreateTaskModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (body: { title: string; description?: string; priority: string; dueDate?: string }) => Promise<void>;
}) {
  const [title, setTitle]   = useState('');
  const [desc, setDesc]     = useState('');
  const [priority, setPrio] = useState<TaskPriority>('MEDIUM');
  const [due, setDue]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) { setError('Le titre est requis.'); return; }
    setLoading(true); setError('');
    try {
      await onCreate({ title: title.trim(), description: desc.trim() || undefined, priority, dueDate: due || undefined });
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors de la création.');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">Nouvelle tâche</div>
        <div className="modal-sub">Ajoutez une tâche à ce projet</div>
        {error && <p style={{ color: '#f87171', fontSize: 12, marginBottom: 14 }}>⚠ {error}</p>}
        <div className="field">
          <span className="field-label">Titre *</span>
          <input className="field-input" autoFocus placeholder="Ex : Créer la page d'accueil…" value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>
        <div className="field">
          <span className="field-label">Description</span>
          <textarea className="field-input field-textarea" placeholder="Détails optionnels…" value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <div className="modal-row">
          <div className="field">
            <span className="field-label">Priorité</span>
            <select className="field-select" value={priority} onChange={e => setPrio(e.target.value as TaskPriority)}>
              <option value="LOW">🔵 Faible</option>
              <option value="MEDIUM">🟡 Moyenne</option>
              <option value="HIGH">🟠 Haute</option>
              <option value="URGENT">🔴 Urgente</option>
            </select>
          </div>
          <div className="field">
            <span className="field-label">Échéance</span>
            <input type="date" className="field-input" value={due} onChange={e => setDue(e.target.value)} style={{ colorScheme: 'dark' }} />
          </div>
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

/* ── Task Detail Side Panel ──────────────────────────────────────────────── */
function TaskPanel({ task, members, userRole, onClose, onUpdate, onDelete, onAssign }: {
  task: Task;
  members: WorkspaceMember[];
  userRole: string;
  onClose: () => void;
  onUpdate: (taskId: string, body: any) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onAssign: (taskId: string, memberUserId: string) => Promise<void>;
}) {
  const isAdmin = userRole === 'ADMIN';
  const isMember = userRole === 'MEMBER' || isAdmin;

  const [status,   setStatus]   = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [due,      setDue]      = useState(task.dueDate ? task.dueDate.slice(0, 10) : '');
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [assigning,  setAssigning]  = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try { await onUpdate(task.id, { status, priority, dueDate: due || undefined }); onClose(); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm(`Supprimer "${task.title}" ?`)) return;
    setDeleting(true);
    try { await onDelete(task.id); onClose(); }
    finally { setDeleting(false); }
  };

  const handleAssign = async (memberUserId: string) => {
    setAssigning(true);
    try { await onAssign(task.id, memberUserId); setShowAssign(false); }
    finally { setAssigning(false); }
  };

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="side-panel">
        <div className="panel-header">
          <div className="panel-title-area">
            <div className="panel-title">{task.title}</div>
            <div className="panel-project" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <span className={`priority-badge p-${task.priority}`}>{task.priority}</span>
              <span>·</span>
              <span>Créée le {formatDate(task.createdAt)}</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="panel-body">

          {/* Description */}
          <div>
            <div className="panel-section-label">Description</div>
            {task.description
              ? <div className="panel-desc">{task.description}</div>
              : <div className="panel-no-desc">Aucune description</div>}
          </div>

          {/* Statut + Priorité */}
          {isMember && (
            <div>
              <div className="panel-section-label">Statut & Priorité</div>
              <div className="panel-row">
                <select className="panel-select" value={status} onChange={e => setStatus(e.target.value as TaskStatus)}>
                  <option value="TODO">📋 À faire</option>
                  <option value="DOING">⚡ En cours</option>
                  <option value="DONE">✅ Terminé</option>
                </select>
                <select className="panel-select" value={priority} onChange={e => setPriority(e.target.value as TaskPriority)}>
                  <option value="LOW">🔵 Faible</option>
                  <option value="MEDIUM">🟡 Moyenne</option>
                  <option value="HIGH">🟠 Haute</option>
                  <option value="URGENT">🔴 Urgente</option>
                </select>
              </div>
            </div>
          )}

          {/* Échéance */}
          {isMember && (
            <div>
              <div className="panel-section-label">Échéance</div>
              <input type="date" className="panel-select" value={due} onChange={e => setDue(e.target.value)} style={{ colorScheme: 'dark', width: '100%' }} />
            </div>
          )}

          {/* Assignation */}
          <div>
            <div className="panel-section-label">Assigné à</div>
            {task.assignee ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="assignee-avatar" style={{ width: 32, height: 32, fontSize: 11, background: avatarColor(task.assignee.fullName) }}>
                  {initials(task.assignee.fullName)}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{task.assignee.fullName}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{task.assignee.email}</div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => setShowAssign(true)}
                    style={{ marginLeft: 'auto', padding: '5px 10px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, background: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 11.5, cursor: 'pointer' }}
                  >
                    Changer
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>Non assigné</span>
                {isAdmin && (
                  <button
                    onClick={() => setShowAssign(true)}
                    style={{ padding: '5px 12px', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 7, background: 'rgba(99,102,241,0.08)', color: '#a5b4fc', fontSize: 11.5, cursor: 'pointer' }}
                  >
                    + Assigner
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Member picker */}
          {showAssign && (
            <div>
              <div className="panel-section-label">Choisir un membre</div>
              {assigning ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}><span className="spinner" /></div>
              ) : (
                <div className="member-list">
                  {members.map(m => (
                    <div
                      key={m.userId}
                      className={`member-item ${task.assignee?.id === m.user.id ? 'selected' : ''}`}
                      onClick={() => handleAssign(m.user.id)}
                    >
                      <div className="member-avatar" style={{ background: avatarColor(m.user.fullName) }}>
                        {initials(m.user.fullName)}
                      </div>
                      <div>
                        <div className="member-name">{m.user.fullName}</div>
                        <div className="member-email">{m.user.email}</div>
                      </div>
                      <span className={`role-chip role-${m.role} member-role`}>{m.role}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        <div className="panel-footer">
          {isMember && (
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? <span className="spinner" /> : <SaveIcon />} Sauvegarder
            </button>
          )}
          {isAdmin && (
            <button className="btn-del-task" onClick={handleDelete} disabled={deleting}>
              {deleting ? <span className="spinner" /> : <TrashIcon />} Supprimer
            </button>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Task Card ───────────────────────────────────────────────────────────── */
function TaskCard({ task, onDragStart, onClick }: {
  task: Task;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onClick: (task: Task) => void;
}) {
  const overdue = isOverdue(task.dueDate) && task.status !== 'DONE';
  return (
    <div
      className="task-card"
      draggable
      onDragStart={e => onDragStart(e, task)}
      onClick={() => onClick(task)}
    >
      <div className="task-card-top">
        <div className="task-title">{task.title}</div>
        <span className={`priority-badge p-${task.priority}`}>{task.priority}</span>
      </div>
      {task.description && (
        <div className="task-desc" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {task.description}
        </div>
      )}
      <div className="task-footer">
        {task.dueDate ? (
          <span className={`task-due ${overdue ? 'overdue' : ''}`}>
            <CalIcon /> {formatDate(task.dueDate)}{overdue ? ' ⚠' : ''}
          </span>
        ) : <span />}
        {task.assignee ? (
          <div className="assignee-chip">
            <div className="assignee-avatar" style={{ background: avatarColor(task.assignee.fullName) }}>
              {initials(task.assignee.fullName)}
            </div>
            <span className="assignee-name">{task.assignee.fullName.split(' ')[0]}</span>
          </div>
        ) : (
          <span className="unassigned"><UserIcon /> Non assigné</span>
        )}
      </div>
    </div>
  );
}

/* ── Kanban Column ───────────────────────────────────────────────────────── */
function KanbanColumn({ col, tasks, onDragStart, onDrop, onDragOver, onDragLeave, isDragOver, onCardClick }: {
  col: typeof COLUMNS[0];
  tasks: Task[];
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  onDragOver: (e: React.DragEvent, status: TaskStatus) => void;
  onDragLeave: () => void;
  isDragOver: boolean;
  onCardClick: (task: Task) => void;
}) {
  const sorted = sortTasks(tasks);
  return (
    <div
      className={`column ${isDragOver ? 'drag-over' : ''}`}
      onDrop={e => onDrop(e, col.id)}
      onDragOver={e => onDragOver(e, col.id)}
      onDragLeave={onDragLeave}
    >
      <div className="col-header">
        <div className="col-title-row">
          <div className="col-dot" style={{ background: col.dot }} />
          <span className="col-title" style={{ color: col.color }}>{col.label}</span>
        </div>
        <span className="col-count">{tasks.length}</span>
      </div>
      <div className="col-body">
        {sorted.length === 0 ? (
          <div className="col-empty">
            <span className="col-empty-icon">○</span>
            <span className="col-empty-text">Glissez une tâche ici</span>
          </div>
        ) : (
          sorted.map(task => (
            <TaskCard key={task.id} task={task} onDragStart={onDragStart} onClick={onCardClick} />
          ))
        )}
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────────── */
export default function TasksPage() {
  const { token, profileQuery } = useAuth();
  const router       = useRouter();
  const params       = useParams();
  const searchParams = useSearchParams();

  const workspaceId   = params?.workspaceId as string;
  const projectId     = params?.projectId   as string;
  const projectName   = searchParams.get('project') ?? 'Projet';
  const workspaceName = searchParams.get('workspace') ?? 'Workspace';

  const [userRole, setUserRole] = useState<string>('MEMBER');

  const { tasksQuery, membersQuery, createMutation, updateMutation, deleteMutation, assignMutation } =
    useTasks(workspaceId, projectId);

  const [showCreate,   setShowCreate]   = useState(false);
  const [activeTask,   setActiveTask]   = useState<Task | null>(null);
  const [dragOverCol,  setDragOverCol]  = useState<TaskStatus | null>(null);
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!token) router.replace('/auth/login');
    const role = sessionStorage.getItem(`ws_role_${workspaceId}`);
    if (role) setUserRole(role);
  }, [token, router, workspaceId]);

  // Sync activeTask with latest data after any mutation (assign, update, etc.)
  useEffect(() => {
    if (activeTask && tasksQuery.data) {
      const fresh = tasksQuery.data.find(t => t.id === activeTask.id);
      if (fresh) setActiveTask(fresh);
    }
  }, [tasksQuery.data]);

  if (!token) return <div className="loading-screen"><span className="spinner-lg" /></div>;

  const userName = profileQuery.data?.name ?? 'Utilisateur';
  const isAdmin  = userRole === 'ADMIN';
  const isMember = userRole === 'MEMBER' || isAdmin;
  const tasks: Task[] = tasksQuery.data ?? [];
  const members: WorkspaceMember[] = membersQuery.data ?? [];

  // Group tasks by status
  const byStatus = (status: TaskStatus) => tasks.filter(t => t.status === status);

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggingTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCol(status);
  };
  const handleDragLeave = () => setDragOverCol(null);
  const handleDrop = async (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    if (!draggingTask || draggingTask.status === newStatus) { setDraggingTask(null); return; }
    try {
      await updateMutation.mutateAsync({ taskId: draggingTask.id, status: newStatus });
    } finally { setDraggingTask(null); }
  };

  const handleUpdate = (taskId: string, body: any) => updateMutation.mutateAsync({ taskId, ...body });
  const handleDelete = (taskId: string) => deleteMutation.mutateAsync(taskId);
  const handleAssign = async (taskId: string, memberUserId: string) => {
    await assignMutation.mutateAsync({ taskId, memberUserId });
    // Sync activeTask with fresh data after assignation
    if (activeTask?.id === taskId) {
      const fresh = tasksQuery.data?.find(t => t.id === taskId);
      if (fresh) setActiveTask(fresh);
    }
  };

  return (
    <>
      <GlobalStyles />

      {showCreate && (
        <CreateTaskModal
          onClose={() => setShowCreate(false)}
          onCreate={body => createMutation.mutateAsync(body)}
        />
      )}

      {activeTask && (
        <TaskPanel
          task={activeTask}
          members={members}
          userRole={userRole}
          onClose={() => setActiveTask(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onAssign={handleAssign}
        />
      )}

      <div className="page-root">

        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="back-btn" onClick={() => router.push(`/workspaces/${workspaceId}/projects?name=${encodeURIComponent(workspaceName)}`)}>
              <BackIcon /> Retour
            </button>
            <span className="breadcrumb">
              <span>{workspaceName}</span>
              <span className="sep">›</span>
              <span>{projectName}</span>
              <span className="sep">›</span>
              <span className="breadcrumb-active">Tâches</span>
            </span>
            <span className={`role-chip role-${userRole}`}>{userRole}</span>
          </div>
          <div className="topbar-right">
            {isMember && (
              <button className="btn-primary" onClick={() => setShowCreate(true)} disabled={tasksQuery.isLoading}>
                <PlusIcon /> Nouvelle tâche
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>
                {initials(userName)}
              </div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{userName.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        {/* KANBAN BOARD */}
        {tasksQuery.isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <span className="spinner-lg" />
          </div>
        ) : (
          <div className="board">
            {COLUMNS.map(col => (
              <KanbanColumn
                key={col.id}
                col={col}
                tasks={byStatus(col.id)}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                isDragOver={dragOverCol === col.id}
                onCardClick={setActiveTask}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}