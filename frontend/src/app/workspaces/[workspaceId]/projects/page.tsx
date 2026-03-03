'use client';

import { useAuth } from '@/lib/useAuth';
import { useProjects, Project } from '@/lib/useProjects';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
    @keyframes fadeDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes spin     { to{transform:rotate(360deg)} }
    @keyframes shimmer  { 0%{background-position:-400px 0} 100%{background-position:400px 0} }

    html,body { height:100%; background:#0f1117; }
    .page-root { min-height:100vh; background:#0f1117; font-family:'Sora',sans-serif; color:#fff; }

    /* ── TOPBAR ── */
    .topbar {
      display:flex; align-items:center; justify-content:space-between;
      padding:18px 36px; border-bottom:1px solid rgba(255,255,255,0.06);
      background:rgba(15,17,23,0.9); backdrop-filter:blur(14px);
      position:sticky; top:0; z-index:20; animation:fadeIn .3s ease both;
    }
    .topbar-left { display:flex; align-items:center; gap:12px; }
    .back-btn {
      display:flex; align-items:center; gap:6px;
      padding:7px 12px; border:1px solid rgba(255,255,255,0.1); border-radius:8px;
      background:rgba(255,255,255,0.03); color:rgba(255,255,255,0.5);
      font-family:'Sora',sans-serif; font-size:12px; cursor:pointer;
      transition:background .15s,color .15s,border-color .15s;
    }
    .back-btn:hover { background:rgba(255,255,255,0.07); color:#fff; border-color:rgba(255,255,255,0.2); }
    .topbar-divider { width:1px; height:20px; background:rgba(255,255,255,0.08); }
    .topbar-ws-name { font-size:13px; color:rgba(255,255,255,0.35); font-weight:400; }
    .topbar-arrow   { font-size:11px; color:rgba(255,255,255,0.2); }
    .topbar-section { font-size:14px; font-weight:600; color:#fff; }
    .topbar-right { display:flex; align-items:center; gap:10px; }
    .user-chip {
      display:flex; align-items:center; gap:8px;
      padding:6px 10px; border-radius:8px;
      background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);
    }
    .user-avatar-sm {
      width:26px; height:26px; border-radius:50%;
      background:linear-gradient(135deg,#6366f1,#10b981);
      display:flex; align-items:center; justify-content:center;
      font-size:10px; font-weight:600; color:#fff; flex-shrink:0;
    }
    .user-name-sm { font-size:12px; color:rgba(255,255,255,0.6); }

    /* ── CONTENT ── */
    .content { padding:36px; max-width:1100px; margin:0 auto; }

    /* ── PAGE HEADER ── */
    .page-header {
      display:flex; align-items:flex-end; justify-content:space-between;
      margin-bottom:32px; animation:fadeUp .4s cubic-bezier(.22,1,.36,1) both;
    }
    .page-title { font-family:'Lora',serif; font-size:28px; font-weight:600; color:#fff; letter-spacing:-.4px; }
    .page-sub   { font-size:13px; color:rgba(255,255,255,0.35); margin-top:5px; }

    /* ── ROLE BADGE ── */
    .role-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:100px; font-size:10px; font-weight:600; margin-left:10px; vertical-align:middle; }
    .role-ADMIN  { background:rgba(99,102,241,0.15); color:#a5b4fc; border:1px solid rgba(99,102,241,0.2); }
    .role-MEMBER { background:rgba(16,185,129,0.12); color:#34d399; border:1px solid rgba(16,185,129,0.2); }
    .role-VIEWER { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.4); border:1px solid rgba(255,255,255,0.1); }

    /* ── BUTTONS ── */
    .btn-primary {
      display:flex; align-items:center; gap:8px;
      padding:10px 20px; border:none; border-radius:10px;
      background:linear-gradient(135deg,#6366f1,#8b5cf6);
      color:#fff; font-family:'Sora',sans-serif; font-size:13px; font-weight:500;
      cursor:pointer; transition:opacity .2s,transform .15s,box-shadow .2s; white-space:nowrap;
    }
    .btn-primary:hover  { opacity:.88; transform:translateY(-1px); box-shadow:0 6px 20px rgba(99,102,241,0.35); }
    .btn-primary:active { transform:translateY(0); }
    .btn-primary:disabled { opacity:.4; cursor:not-allowed; transform:none; }

    /* ── PROJECT GRID ── */
    .project-grid {
      display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
      gap:18px;
    }

    /* ── PROJECT CARD ── */
    .project-card {
      background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.07);
      border-radius:14px; padding:22px; position:relative; overflow:hidden;
      transition:border-color .2s,background .2s,transform .15s,box-shadow .2s;
      animation:fadeUp .5s cubic-bezier(.22,1,.36,1) both;
      display:flex; flex-direction:column; gap:14px;
    }
    .project-card::before {
      content:''; position:absolute; top:0; left:0; right:0; height:2px;
      background:linear-gradient(90deg,#6366f1,#8b5cf6,#10b981);
      border-radius:14px 14px 0 0; opacity:.7;
    }
    .project-card:hover {
      border-color:rgba(99,102,241,0.3); background:rgba(99,102,241,0.04);
      transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,0,0,0.25);
    }
    .project-card-top { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; }
    .project-icon {
      width:40px; height:40px; border-radius:10px; flex-shrink:0;
      background:linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1));
      border:1px solid rgba(99,102,241,0.2);
      display:flex; align-items:center; justify-content:center; font-size:17px;
    }
    .project-name {
      font-size:15px; font-weight:600; color:#fff; letter-spacing:-.2px;
      line-height:1.3; flex:1;
    }
    .project-meta {
      display:flex; align-items:center; gap:8px; flex-wrap:wrap;
    }
    .project-creator {
      display:flex; align-items:center; gap:6px;
    }
    .creator-avatar {
      width:20px; height:20px; border-radius:50%; flex-shrink:0;
      display:flex; align-items:center; justify-content:center;
      font-size:8px; font-weight:600; color:#fff;
    }
    .creator-name { font-size:11px; color:rgba(255,255,255,0.4); }
    .project-date { font-size:11px; color:rgba(255,255,255,0.2); }
    .project-card-footer {
      display:flex; align-items:center; justify-content:space-between;
      padding-top:12px; border-top:1px solid rgba(255,255,255,0.05);
      margin-top:auto;
    }
    .project-id { font-size:10px; color:rgba(255,255,255,0.18); font-family:monospace; }

    /* ── DELETE BUTTON ── */
    .delete-btn {
      display:flex; align-items:center; gap:5px;
      padding:5px 10px; border:1px solid rgba(239,68,68,0.15); border-radius:7px;
      background:rgba(239,68,68,0.06); color:rgba(239,68,68,0.6);
      font-family:'Sora',sans-serif; font-size:11px; cursor:pointer;
      transition:background .15s,color .15s,border-color .15s;
    }
    .delete-btn:hover { background:rgba(239,68,68,0.12); color:#ef4444; border-color:rgba(239,68,68,0.3); }
    .delete-btn:disabled { opacity:.4; cursor:not-allowed; }

    /* ── EMPTY STATE ── */
    .empty-state {
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      padding:100px 20px; text-align:center;
      animation:fadeUp .5s cubic-bezier(.22,1,.36,1) both;
    }
    .empty-icon {
      width:64px; height:64px; border-radius:16px;
      background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.18);
      display:flex; align-items:center; justify-content:center;
      margin-bottom:20px; color:#6366f1; font-size:26px;
    }
    .empty-title { font-size:18px; font-weight:600; color:#fff; margin-bottom:8px; }
    .empty-sub   { font-size:13px; color:rgba(255,255,255,0.35); margin-bottom:24px; max-width:300px; line-height:1.7; }

    /* ── MODAL ── */
    .modal-overlay {
      position:fixed; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(10px);
      display:flex; align-items:center; justify-content:center; z-index:50;
      animation:fadeIn .2s ease both;
    }
    .modal {
      background:#161820; border:1px solid rgba(255,255,255,0.1); border-radius:16px;
      padding:30px 32px; width:100%; max-width:440px;
      animation:fadeUp .3s cubic-bezier(.22,1,.36,1) both;
    }
    .modal-title { font-family:'Lora',serif; font-size:20px; font-weight:600; color:#fff; margin-bottom:6px; }
    .modal-sub   { font-size:13px; color:rgba(255,255,255,0.4); margin-bottom:24px; }
    .modal-field { display:flex; flex-direction:column; gap:6px; margin-bottom:20px; }
    .modal-label { font-size:12px; font-weight:500; color:rgba(255,255,255,0.45); }
    .modal-input {
      padding:12px 14px; border:1.5px solid rgba(255,255,255,0.1); border-radius:10px;
      background:rgba(255,255,255,0.05); color:#fff;
      font-family:'Sora',sans-serif; font-size:14px; outline:none;
      transition:border-color .2s,box-shadow .2s;
    }
    .modal-input::placeholder { color:rgba(255,255,255,0.2); }
    .modal-input:focus { border-color:#6366f1; box-shadow:0 0 0 4px rgba(99,102,241,0.12); }
    .modal-footer { display:flex; gap:10px; justify-content:flex-end; }
    .btn-cancel {
      padding:10px 18px; border:1px solid rgba(255,255,255,0.1); border-radius:9px;
      background:none; color:rgba(255,255,255,0.5); font-family:'Sora',sans-serif;
      font-size:13px; cursor:pointer; transition:background .15s,color .15s;
    }
    .btn-cancel:hover { background:rgba(255,255,255,0.06); color:#fff; }

    /* ── CONFIRM MODAL ── */
    .confirm-body { font-size:13px; color:rgba(255,255,255,0.55); line-height:1.7; margin-bottom:22px; }
    .confirm-name { color:#fff; font-weight:600; }
    .btn-danger {
      display:flex; align-items:center; gap:7px;
      padding:10px 18px; border:none; border-radius:9px;
      background:linear-gradient(135deg,#ef4444,#dc2626);
      color:#fff; font-family:'Sora',sans-serif; font-size:13px; font-weight:500;
      cursor:pointer; transition:opacity .2s,transform .15s;
    }
    .btn-danger:hover { opacity:.88; transform:translateY(-1px); }
    .btn-danger:disabled { opacity:.4; cursor:not-allowed; transform:none; }

    /* ── ERROR BANNER ── */
    .error-banner {
      display:flex; align-items:center; gap:10px;
      padding:12px 16px; background:rgba(239,68,68,0.08);
      border:1px solid rgba(239,68,68,0.2); border-radius:10px;
      margin-bottom:20px; animation:fadeDown .2s ease both;
      font-size:13px; color:#f87171;
    }

    /* ── SPINNERS ── */
    .spinner    { width:14px; height:14px; border:2px solid rgba(255,255,255,0.2); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; display:inline-block; }
    .spinner-lg { width:32px; height:32px; border:2px solid rgba(99,102,241,0.2); border-top-color:#6366f1; border-radius:50%; animation:spin .8s linear infinite; }
    .loading-screen { position:fixed; inset:0; background:#0f1117; display:flex; align-items:center; justify-content:center; z-index:100; }

    /* ── SKELETON ── */
    .skeleton {
      background:linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%);
      background-size:400px 100%; animation:shimmer 1.4s infinite linear;
      border-radius:8px;
    }

    /* ── VIEWER NOTICE ── */
    .viewer-notice {
      display:flex; align-items:center; gap:10px;
      padding:12px 16px; background:rgba(251,191,36,0.07);
      border:1px solid rgba(251,191,36,0.2); border-radius:10px;
      margin-bottom:24px; font-size:12px; color:#fbbf24;
      animation:fadeDown .3s ease both;
    }

    @media (max-width:768px) {
      .content { padding:20px 16px; }
      .project-grid { grid-template-columns:1fr; }
      .topbar { padding:14px 16px; }
    }
  `}</style>
);

/* ── Icons ─────────────────────────────────────────────────────────────── */
const BackIcon    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const PlusIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TrashIcon   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const FolderIcon  = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
const WarnIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const LockIcon    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function avatarColor(name: string) {
  const hue = (name.charCodeAt(0) * 37 + (name.charCodeAt(1) || 0) * 17) % 360;
  return `linear-gradient(135deg,hsl(${hue},60%,52%),hsl(${(hue+50)%360},60%,42%))`;
}
function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}
const PROJECT_EMOJIS = ['📁','🚀','💡','🎯','⚡','🌿','🔮','🛠️','📊','🎨','🔬','📐'];
function projectEmoji(id: string) {
  return PROJECT_EMOJIS[id.charCodeAt(0) % PROJECT_EMOJIS.length];
}

/* ── Create Project Modal ───────────────────────────────────────────────── */
function CreateProjectModal({ onClose, onCreate }: {
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
    catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de la création.');
    }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">Nouveau projet</div>
        <div className="modal-sub">Créez un projet dans ce workspace</div>
        {error && <div className="error-banner">⚠ {error}</div>}
        <div className="modal-field">
          <label className="modal-label">Nom du projet</label>
          <input
            className="modal-input" autoFocus
            placeholder="Ex : Site web, App mobile, API…"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
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

/* ── Confirm Delete Modal ───────────────────────────────────────────────── */
function ConfirmDeleteModal({ project, onClose, onConfirm }: {
  project: Project;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try { await onConfirm(); onClose(); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">Supprimer le projet</div>
        <p className="confirm-body">
          Êtes-vous sûr de vouloir supprimer <span className="confirm-name">&quot;{project.name}&quot;</span> ?
          Cette action est <strong style={{ color: '#ef4444' }}>irréversible</strong> et supprimera toutes les données associées.
        </p>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Annuler</button>
          <button className="btn-danger" onClick={handleConfirm} disabled={loading}>
            {loading ? <span className="spinner" /> : <TrashIcon />} Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton Cards ─────────────────────────────────────────────────────── */
function SkeletonCard({ delay }: { delay: number }) {
  return (
    <div className="project-card" style={{ animationDelay: `${delay}ms`, gap: 14 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="skeleton" style={{ height: 14, width: '70%' }} />
          <div className="skeleton" style={{ height: 11, width: '45%' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <div className="skeleton" style={{ height: 11, width: 80 }} />
        <div className="skeleton" style={{ height: 11, width: 60 }} />
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
        <div className="skeleton" style={{ height: 10, width: 90 }} />
        <div className="skeleton" style={{ height: 26, width: 70, borderRadius: 7 }} />
      </div>
    </div>
  );
}

/* ── Project Card ───────────────────────────────────────────────────────── */
function ProjectCard({ project, userRole, workspaceName, router, onDelete, deleteLoading }: {
  project: Project;
  userRole: string;
  workspaceName: string;
  router: any;
  onDelete: (p: Project) => void;
  deleteLoading: boolean;
}) {
  const isAdmin = userRole === 'ADMIN';
  return (
    <div className="project-card" onClick={() => {
        sessionStorage.setItem(`ws_role_${project.workspaceId}`, userRole);
        router.push(`/workspaces/${project.workspaceId}/projects/${project.id}/tasks?project=${encodeURIComponent(project.name)}&workspace=${encodeURIComponent(workspaceName)}`);
      }} style={{ cursor: 'pointer' }}>
      <div className="project-card-top">
        <div className="project-icon">{projectEmoji(project.id)}</div>
        <div className="project-name">{project.name}</div>
      </div>

      {/* Créé par */}
      {project.createdBy && (
        <div className="project-creator">
          <div
            className="creator-avatar"
            style={{ background: avatarColor(project.createdBy.fullName) }}
          >
            {initials(project.createdBy.fullName)}
          </div>
          <span className="creator-name">
            Créé par <strong style={{ color: 'rgba(255,255,255,0.65)' }}>{project.createdBy.fullName}</strong>
          </span>
        </div>
      )}

      <div className="project-card-footer">
        <span className="project-date">
          {project.createdAt ? formatDate(project.createdAt) : '—'}
        </span>
        {isAdmin ? (
          <button
            className="delete-btn"
            onClick={() => onDelete(project)}
            disabled={deleteLoading}
          >
            <TrashIcon /> Supprimer
          </button>
        ) : (
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <LockIcon /> Lecture seule
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────────── */
export default function ProjectsPage() {
  const { token, profileQuery } = useAuth();
  const router  = useRouter();
  const params  = useParams();

  const workspaceId   = params?.workspaceId as string;
  const searchParams  = useSearchParams();
  const workspaceName = searchParams.get('name') ?? 'Workspace';

  // Récupérer le rôle depuis les params ou le state (passé depuis le dashboard)
  const [userRole, setUserRole] = useState<string>('MEMBER');

  const { projectsQuery, createMutation, deleteMutation } = useProjects(workspaceId);

  const [showCreate,   setShowCreate]   = useState(false);
  const [toDelete,     setToDelete]     = useState<Project | null>(null);
  const [deletingId,   setDeletingId]   = useState<string | null>(null);

  useEffect(() => {
    if (!token) router.replace('/auth/login');
    // Récupérer le rôle depuis sessionStorage (mis par le dashboard au clic)
    const role = sessionStorage.getItem(`ws_role_${workspaceId}`);
    if (role) setUserRole(role);
  }, [token, router, workspaceId]);

  if (!token) return <div className="loading-screen"><span className="spinner-lg" /></div>;

  const userName     = profileQuery.data?.name ?? 'Utilisateur';
  const userInitials = initials(userName);
  const projects: Project[] = projectsQuery.data ?? [];
  const isAdmin = userRole === 'ADMIN';

  const handleCreate = (name: string) => createMutation.mutateAsync(name);

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    setDeletingId(toDelete.id);
    try {
      await deleteMutation.mutateAsync(toDelete.id);
    } finally {
      setDeletingId(null);
      setToDelete(null);
    }
  };

  return (
    <>
      <GlobalStyles />

      {showCreate && (
        <CreateProjectModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
      {toDelete && (
        <ConfirmDeleteModal
          project={toDelete}
          onClose={() => setToDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      <div className="page-root">

        {/* ── TOPBAR ── */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="back-btn" onClick={() => router.push('/dashboard')}>
              <BackIcon /> Retour
            </button>
            <div className="topbar-divider" />
            <span className="topbar-ws-name">
              {workspaceName ?? 'Workspace'}
            </span>
            <span className="topbar-arrow">›</span>
            <span className="topbar-section">Projets</span>
            <span className={`role-badge role-${userRole}`}>{userRole}</span>
          </div>
          <div className="topbar-right">
            <div className="user-chip">
              <div className="user-avatar-sm">{userInitials}</div>
              <span className="user-name-sm">{userName.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <div className="content">

          {/* PAGE HEADER */}
          <div className="page-header">
            <div>
              <h1 className="page-title">
                Projets
              </h1>
              <p className="page-sub">
                {projectsQuery.isLoading
                  ? 'Chargement…'
                  : `${projects.length} projet${projects.length !== 1 ? 's' : ''} dans ce workspace`}
              </p>
            </div>
            {isAdmin && (
              <button className="btn-primary" onClick={() => setShowCreate(true)}>
                <PlusIcon /> Nouveau projet
              </button>
            )}
          </div>

          {/* VIEWER NOTICE */}
          {userRole === 'VIEWER' && (
            <div className="viewer-notice">
              <WarnIcon />
              Vous êtes en lecture seule — seuls les admins et membres peuvent créer ou modifier des projets.
            </div>
          )}

          {/* PROJECTS */}
          {projectsQuery.isLoading ? (
            <div className="project-grid">
              {[0, 1, 2, 3].map(i => <SkeletonCard key={i} delay={i * 80} />)}
            </div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><FolderIcon /></div>
              <div className="empty-title">Aucun projet</div>
              <div className="empty-sub">
                {isAdmin
                  ? 'Créez votre premier projet pour commencer à organiser le travail de votre équipe.'
                  : 'Aucun projet n\'a encore été créé dans ce workspace.'}
              </div>
              {isAdmin && (
                <button className="btn-primary" onClick={() => setShowCreate(true)}>
                  <PlusIcon /> Créer le premier projet
                </button>
              )}
            </div>
          ) : (
            <div className="project-grid">
              {projects.map((p, i) => (
                <div key={p.id} style={{ animationDelay: `${i * 60}ms` }}>
                  <ProjectCard
                    project={p}
                    userRole={userRole}
                    workspaceName={workspaceName}
                    router={router}
                    onDelete={setToDelete}
                    deleteLoading={deletingId === p.id}
                  />
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}