'use client';

import { useAuth } from '@/lib/useAuth';
import { useWorkspaces, Workspace } from '@/lib/useWorkspaces';
import { getProjects } from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Project } from '@/lib/useProjects';

/* ── CSS ── */
const SidebarStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

    .app-shell { display:flex; min-height:100vh; background:#0c0d12; }

    /* ── SIDEBAR ── */
    .sidebar {
      width:240px; flex-shrink:0;
      background:rgba(255,255,255,0.02);
      border-right:1px solid rgba(255,255,255,0.06);
      display:flex; flex-direction:column;
      padding:20px 12px 16px;
      position:fixed; top:0; left:0; bottom:0; z-index:20;
      font-family:'Sora',sans-serif;
    }

    .sidebar-logo {
      display:flex; align-items:center; gap:9px;
      padding:0 6px; margin-bottom:24px; cursor:pointer;
    }
    .sidebar-logo-icon {
      width:30px; height:30px; border-radius:8px; flex-shrink:0;
      background:linear-gradient(135deg,#6366f1,#8b5cf6);
      display:flex; align-items:center; justify-content:center;
    }
    .sidebar-logo-name { font-size:14px; font-weight:600; color:#fff; letter-spacing:-.2px; }
    .sidebar-logo-badge {
      background:rgba(99,102,241,0.2); border:1px solid rgba(99,102,241,0.35);
      border-radius:100px; padding:1px 6px; font-size:8.5px; font-weight:600;
      color:#a5b4fc; letter-spacing:.4px; text-transform:uppercase;
    }

    .sidebar-section-label {
      font-size:9.5px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase;
      color:rgba(255,255,255,0.2); padding:0 6px; margin-bottom:4px; margin-top:16px;
    }

    /* ── TREE ── */
    .sidebar-tree { flex:1; overflow-y:auto; overflow-x:hidden; }
    .sidebar-tree::-webkit-scrollbar { width:3px; }
    .sidebar-tree::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:3px; }

    .ws-row {
      display:flex; align-items:center; gap:6px;
      padding:6px 6px; border-radius:8px; cursor:pointer;
      width:100%; background:none; border:none; text-align:left;
      color:rgba(255,255,255,0.65); font-family:'Sora',sans-serif; font-size:12.5px; font-weight:500;
      transition:background .12s,color .12s;
    }
    .ws-row:hover { background:rgba(255,255,255,0.05); color:#fff; }
    .ws-row.active { background:rgba(99,102,241,0.12); color:#c4b5fd; }

    .ws-chevron {
      transition:transform .2s; color:rgba(255,255,255,0.2); flex-shrink:0; display:flex;
    }
    .ws-chevron.open { transform:rotate(90deg); }

    .ws-emoji {
      width:20px; height:20px; border-radius:5px; flex-shrink:0; font-size:11px;
      display:flex; align-items:center; justify-content:center;
      background:rgba(99,102,241,0.15);
    }
    .ws-name { flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0; }
    .ws-role-dot {
      width:5px; height:5px; border-radius:50%; flex-shrink:0;
    }

    /* Projects list */
    .proj-list {
      padding-left:26px; margin:2px 0 4px;
      border-left:1px solid rgba(255,255,255,0.05);
      margin-left:15px;
    }
    .proj-row {
      display:flex; align-items:center; gap:6px;
      padding:5px 8px; border-radius:7px; cursor:pointer;
      width:100%; background:none; border:none; text-align:left;
      color:rgba(255,255,255,0.38); font-family:'Sora',sans-serif; font-size:11.5px;
      transition:background .12s,color .12s;
    }
    .proj-row:hover { background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.75); }
    .proj-row.active { background:rgba(99,102,241,0.1); color:#a5b4fc; }
    .proj-dot { width:4px; height:4px; border-radius:50%; background:rgba(255,255,255,0.18); flex-shrink:0; }
    .proj-row.active .proj-dot { background:#6366f1; }
    .proj-name { flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

    .proj-loading { padding:5px 8px; font-size:11px; color:rgba(255,255,255,0.2); display:flex; align-items:center; gap:5px; }
    .proj-all-link {
      padding:5px 8px; border-radius:7px; cursor:pointer;
      width:100%; background:none; border:none; text-align:left;
      color:rgba(99,102,241,0.5); font-family:'Sora',sans-serif; font-size:11px;
      transition:color .12s; display:flex; align-items:center; gap:5px;
    }
    .proj-all-link:hover { color:#6366f1; }

    /* New workspace btn */
    .sidebar-new-ws {
      display:flex; align-items:center; gap:6px;
      padding:6px 8px; border-radius:8px; cursor:pointer;
      width:100%; background:none; border:1px dashed rgba(99,102,241,0.2);
      color:rgba(99,102,241,0.5); font-family:'Sora',sans-serif; font-size:12px;
      transition:border-color .15s,color .15s,background .15s; margin-top:8px;
    }
    .sidebar-new-ws:hover { border-color:rgba(99,102,241,0.5); color:#a5b4fc; background:rgba(99,102,241,0.06); }

    /* ── SIDEBAR BOTTOM ── */
    .sidebar-bottom {
      margin-top:8px; border-top:1px solid rgba(255,255,255,0.06); padding-top:12px;
    }
    .user-row {
      display:flex; align-items:center; gap:8px; padding:7px 6px; border-radius:9px;
      cursor:pointer; transition:background .12s;
    }
    .user-row:hover { background:rgba(255,255,255,0.04); }
    .user-avatar {
      width:28px; height:28px; border-radius:50%; flex-shrink:0;
      background:linear-gradient(135deg,#6366f1,#10b981);
      display:flex; align-items:center; justify-content:center;
      font-size:10px; font-weight:700; color:#fff;
    }
    .user-info { flex:1; min-width:0; }
    .user-name  { font-size:12px; font-weight:500; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .user-email { font-size:10.5px; color:rgba(255,255,255,0.3); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .logout-btn {
      background:none; border:none; cursor:pointer;
      color:rgba(255,255,255,0.2); padding:4px; border-radius:6px;
      transition:color .15s,background .15s; display:flex; flex-shrink:0;
    }
    .logout-btn:hover { color:#ef4444; background:rgba(239,68,68,0.1); }

    /* ── MAIN CONTENT ── */
    .app-main { flex:1; margin-left:240px; min-height:100vh; display:flex; flex-direction:column; }

    /* Spinner */
    @keyframes spin { to{transform:rotate(360deg)} }
    .spinner-sm { width:11px; height:11px; border:1.5px solid rgba(99,102,241,0.3); border-top-color:#6366f1; border-radius:50%; animation:spin .7s linear infinite; display:inline-block; }

    @media (max-width:768px) {
      .sidebar  { transform:translateX(-100%); }
      .app-main { margin-left:0; }
    }
  `}</style>
);

/* ── Helpers ── */
function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
}
const WS_EMOJIS = ['🏢','🚀','💡','🎯','⚡','🌿','🔮','🛠️'];

/* ── WorkspaceTreeItem ── */
function WorkspaceTreeItem({ ws, pathname, router, onNewWorkspace }: {
  ws: Workspace;
  pathname: string;
  router: any;
  onNewWorkspace: () => void;
}) {
  const isWsActive = pathname.includes(`/workspaces/${ws.workspaceId}`);
  const [open,     setOpen]     = useState(isWsActive);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [loaded,   setLoaded]   = useState(false);

  const emoji = WS_EMOJIS[ws.workspaceId.charCodeAt(0) % WS_EMOJIS.length];
  const roleDotColor = ws.role === 'ADMIN' ? '#a5b4fc' : ws.role === 'MEMBER' ? '#34d399' : 'rgba(255,255,255,0.2)';

  // Auto-load if active
  useEffect(() => {
    if (isWsActive && !loaded) loadProjects();
  }, [isWsActive]);

  const loadProjects = async () => {
    if (loaded || loading) return;
    setLoading(true);
    try {
      const data = await getProjects(ws.workspaceId);
      setProjects(data);
      setLoaded(true);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) loadProjects();
  };

  const goProject = (p: Project) => {
    sessionStorage.setItem(`ws_role_${ws.workspaceId}`, ws.role);
    router.push(
      `/workspaces/${ws.workspaceId}/projects/${p.id}/tasks` +
      `?project=${encodeURIComponent(p.name)}&workspace=${encodeURIComponent(ws.name)}`
    );
  };

  const goAllProjects = (e: React.MouseEvent) => {
    e.stopPropagation();
    sessionStorage.setItem(`ws_role_${ws.workspaceId}`, ws.role);
    router.push(`/workspaces/${ws.workspaceId}/projects?name=${encodeURIComponent(ws.name)}`);
  };

  return (
    <div>
      {/* Workspace row */}
      <button className={`ws-row ${isWsActive ? 'active' : ''}`} onClick={toggle}>
        <span className={`ws-chevron ${open ? 'open' : ''}`}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </span>
        <span className="ws-emoji">{emoji}</span>
        <span className="ws-name" title={ws.name}>{ws.name}</span>
        <span className="ws-role-dot" style={{ background: roleDotColor }} title={ws.role} />
      </button>

      {/* Projects */}
      {open && (
        <div className="proj-list">
          {loading ? (
            <div className="proj-loading"><span className="spinner-sm" /> chargement…</div>
          ) : projects.length === 0 ? (
            <button className="proj-all-link" onClick={goAllProjects}>⊞ Voir les projets</button>
          ) : (
            <>
              {projects.map(p => {
                const isActive = pathname.includes(`/projects/${p.id}`);
                return (
                  <button key={p.id} className={`proj-row ${isActive ? 'active' : ''}`} onClick={() => goProject(p)}>
                    <span className="proj-dot" />
                    <span className="proj-name" title={p.name}>{p.name}</span>
                  </button>
                );
              })}
              <button className="proj-all-link" onClick={goAllProjects}>⊞ Tous les projets</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Sidebar Component ── */
export function AppSidebar({ onNewWorkspace }: { onNewWorkspace?: () => void }) {
  const { logout, profileQuery, token } = useAuth();
  const { workspacesQuery } = useWorkspaces();
  const router   = useRouter();
  const pathname = usePathname() ?? '';

  const userName  = profileQuery.data?.name  ?? '';
  const userEmail = profileQuery.data?.email ?? '';
  const workspaces: Workspace[] = workspacesQuery.data ?? [];

  const handleLogout = () => { logout(); router.replace('/auth/login'); };

  if (!token) return null;

  return (
    <>
      <SidebarStyles />
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo" onClick={() => router.push('/dashboard')}>
          <div className="sidebar-logo-icon">
            <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L28 9v14L16 30 4 23V9L16 2z" fill="white" opacity=".9"/>
              <path d="M16 8L24 12.5v9L16 26 8 21.5v-9L16 8z" fill="white" opacity=".4"/>
            </svg>
          </div>
          <span className="sidebar-logo-name">Votre App</span>
          <span className="sidebar-logo-badge">Pro</span>
        </div>

        {/* Workspaces tree */}
        <span className="sidebar-section-label">Workspaces</span>
        <div className="sidebar-tree">
          {workspacesQuery.isLoading ? (
            <div className="proj-loading" style={{ padding: '12px 6px' }}>
              <span className="spinner-sm" /> Chargement…
            </div>
          ) : workspaces.length === 0 ? (
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.2)', padding: '8px 6px', lineHeight: 1.7 }}>
              Aucun workspace.
            </div>
          ) : (
            workspaces.map(ws => (
              <WorkspaceTreeItem
                key={ws.workspaceId}
                ws={ws}
                pathname={pathname}
                router={router}
                onNewWorkspace={onNewWorkspace ?? (() => {})}
              />
            ))
          )}

          <button className="sidebar-new-ws" onClick={onNewWorkspace ?? (() => router.push('/dashboard'))}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nouveau workspace
          </button>
        </div>

        {/* User */}
        <div className="sidebar-bottom">
          <div className="user-row">
            <div className="user-avatar">{initials(userName) || '?'}</div>
            <div className="user-info">
              <div className="user-name">{userName}</div>
              <div className="user-email">{userEmail}</div>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Se déconnecter">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ── Layout wrapper ── */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="app-shell">
      <AppSidebar onNewWorkspace={() => setShowCreateModal(true)} />
      <main className="app-main">
        {children}
      </main>

      {/* Create workspace modal - importé dans dashboard.tsx si nécessaire */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99,
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              background: '#161820', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16,
              padding: '28px 30px', width: '100%', maxWidth: 420, fontFamily: 'Sora,sans-serif',
            }}
            onClick={e => e.stopPropagation()}
          >
            <CreateWsInline onClose={() => setShowCreateModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Inline create workspace form ── */
function CreateWsInline({ onClose }: { onClose: () => void }) {
  const { createMutation } = useWorkspaces();
  const [name, setName]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Le nom est requis.'); return; }
    setLoading(true);
    try { await createMutation.mutateAsync(name.trim()); onClose(); }
    catch { setError('Erreur lors de la création.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div style={{ fontFamily: 'Lora,serif', fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 5 }}>Nouveau workspace</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Créez un espace de travail pour votre équipe</div>
      {error && <p style={{ color: '#f87171', fontSize: 12, marginBottom: 12 }}>⚠ {error}</p>}
      <input
        autoFocus
        style={{
          width: '100%', padding: '11px 14px', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 10,
          background: 'rgba(255,255,255,0.05)', color: '#fff', fontFamily: 'Sora,sans-serif',
          fontSize: 14, outline: 'none', marginBottom: 16,
        }}
        placeholder="Ex : Équipe Produit, Projet Alpha…"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
      />
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
          style={{ padding: '9px 18px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, background: 'none', color: 'rgba(255,255,255,0.5)', fontFamily: 'Sora,sans-serif', fontSize: 13, cursor: 'pointer' }}
        >Annuler</button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', border: 'none', borderRadius: 9, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontFamily: 'Sora,sans-serif', fontSize: 13, cursor: 'pointer', opacity: loading ? 0.5 : 1 }}
        >
          {loading ? <span style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} /> : '+'}
          Créer
        </button>
      </div>
    </>
  );
}