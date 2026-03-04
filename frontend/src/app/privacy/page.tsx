'use client';

import Link from 'next/link';

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes fadeUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulse-ring { 0% { transform:scale(1); opacity:.5; } 100% { transform:scale(1.6); opacity:0; } }

    html { scroll-behavior: smooth; }

    .pp-root {
      min-height: 100vh;
      background: #0c0e16;
      font-family: 'Sora', sans-serif;
      color: #e5e7eb;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow-x: hidden;
    }

    /* background décor */
    .pp-bg {
      position: fixed; inset: 0; pointer-events: none; z-index: 0;
    }
    .pp-bg::before {
      content:'';
      position:absolute; inset:0;
      background-image:
        radial-gradient(circle at 80% 10%, rgba(99,102,241,0.12) 0%, transparent 45%),
        radial-gradient(circle at 10% 80%, rgba(16,185,129,0.08) 0%, transparent 45%);
    }
    .pp-dot-grid {
      position:absolute; inset:0;
      background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
      background-size: 28px 28px;
    }

    /* ── NAV ── */
    .pp-nav {
      position: sticky; top: 0; z-index: 100;
      background: rgba(12,14,22,0.85);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(255,255,255,0.07);
      padding: 0 clamp(20px,5vw,80px);
      height: 64px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .pp-nav-logo {
      display: flex; align-items: center; gap: 10px;
      text-decoration: none;
    }
    .pp-nav-icon {
      width: 34px; height: 34px;
      background: linear-gradient(135deg,#6366f1,#8b5cf6);
      border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
    }
    .pp-nav-name {
      font-size: 15px; font-weight: 600; color: #fff; letter-spacing: -.2px;
    }
    .pp-nav-badge {
      background: rgba(99,102,241,0.2);
      border: 1px solid rgba(99,102,241,0.4);
      border-radius: 100px; padding: 2px 8px;
      font-size: 10px; font-weight: 500; color: #a5b4fc;
      letter-spacing: .5px; text-transform: uppercase;
    }
    .pp-back-btn {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 13px; color: #9ca3af;
      text-decoration: none;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px; padding: 6px 14px;
      transition: all .2s;
    }
    .pp-back-btn:hover { color: #fff; background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.14); }

    /* ── HERO ── */
    .pp-hero {
      position: relative; z-index: 1;
      padding: clamp(48px,8vh,96px) clamp(20px,5vw,80px) clamp(32px,5vh,64px);
      max-width: 900px; margin: 0 auto; width: 100%;
      animation: fadeUp .6s cubic-bezier(.22,1,.36,1) both;
    }
    .pp-hero-eyebrow {
      font-size: 11px; font-weight: 600; letter-spacing: 2.5px;
      text-transform: uppercase; color: #10b981;
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 18px;
    }
    .pp-hero-eyebrow::before { content:''; width:24px; height:1px; background:#10b981; }
    .pp-hero-title {
      font-family: 'Lora', serif;
      font-size: clamp(32px, 5vw, 58px);
      font-weight: 600; color: #fff;
      line-height: 1.12; letter-spacing: -.5px;
      margin-bottom: 18px;
    }
    .pp-hero-title em {
      font-style: italic;
      background: linear-gradient(135deg,#10b981,#6ee7b7);
      -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    }
    .pp-hero-meta {
      display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
    }
    .pp-hero-date {
      font-size: 13px; color: rgba(255,255,255,0.35);
    }
    .pp-status {
      display: flex; align-items: center; gap: 7px;
    }
    .pp-status-dot {
      width: 7px; height: 7px; border-radius: 50%; background: #10b981; position: relative;
    }
    .pp-status-dot::after {
      content:''; position:absolute; inset:0; border-radius:50%; background:#10b981;
      animation: pulse-ring 1.5s ease-out infinite;
    }
    .pp-status-text { font-size: 12px; color: rgba(255,255,255,0.4); }

    /* ── LAYOUT ── */
    .pp-layout {
      position: relative; z-index: 1;
      max-width: 900px; margin: 0 auto; width: 100%;
      padding: 0 clamp(20px,5vw,80px) clamp(60px,8vh,100px);
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 48px;
      align-items: start;
    }

    /* ── TOC ── */
    .pp-toc {
      position: sticky; top: 80px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 14px; padding: 20px;
      animation: fadeUp .6s .1s cubic-bezier(.22,1,.36,1) both;
    }
    .pp-toc-title {
      font-size: 11px; font-weight: 600; letter-spacing: 2px;
      text-transform: uppercase; color: rgba(255,255,255,0.3);
      margin-bottom: 14px;
    }
    .pp-toc-list { list-style: none; display: flex; flex-direction: column; gap: 4px; }
    .pp-toc-item a {
      font-size: 12.5px; color: rgba(255,255,255,0.45);
      text-decoration: none; padding: 5px 8px; border-radius: 6px;
      display: block; transition: all .15s;
      border-left: 2px solid transparent;
    }
    .pp-toc-item a:hover {
      color: #10b981; background: rgba(16,185,129,0.07);
      border-left-color: #10b981;
    }

    /* ── CONTENT ── */
    .pp-content {
      animation: fadeUp .6s .15s cubic-bezier(.22,1,.36,1) both;
    }
    .pp-section {
      margin-bottom: clamp(32px,5vh,52px);
    }
    .pp-section-header {
      display: flex; align-items: center; gap: 12px;
      margin-bottom: 18px;
    }
    .pp-section-num {
      width: 28px; height: 28px; border-radius: 8px;
      background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(99,102,241,0.2));
      border: 1px solid rgba(16,185,129,0.25);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700; color: #10b981; flex-shrink: 0;
    }
    .pp-section-title {
      font-family: 'Lora', serif;
      font-size: clamp(16px,1.4vw,22px);
      font-weight: 600; color: #fff;
    }
    .pp-section p {
      font-size: clamp(13px,0.95vw,15px);
      color: rgba(255,255,255,0.55);
      line-height: 1.8; font-weight: 300;
      margin-bottom: 14px;
    }
    .pp-section p:last-child { margin-bottom: 0; }
    .pp-section ul {
      list-style: none; display: flex; flex-direction: column; gap: 8px;
      margin: 10px 0 14px 0;
    }
    .pp-section ul li {
      font-size: clamp(13px,0.9vw,14px);
      color: rgba(255,255,255,0.5);
      line-height: 1.7; font-weight: 300;
      padding-left: 18px; position: relative;
    }
    .pp-section ul li::before {
      content:''; position:absolute; left:0; top:9px;
      width:6px; height:6px; border-radius:50%;
      background: linear-gradient(135deg,#10b981,#6366f1);
    }

    /* highlight box */
    .pp-highlight {
      background: rgba(16,185,129,0.07);
      border: 1px solid rgba(16,185,129,0.2);
      border-radius: 12px; padding: 18px 22px;
      margin: 16px 0;
    }
    .pp-highlight p {
      color: rgba(255,255,255,0.65) !important;
      font-size: 14px !important;
    }

    /* divider */
    .pp-divider {
      height: 1px; background: rgba(255,255,255,0.06);
      margin: 0 0 clamp(32px,5vh,52px) 0;
    }

    /* contact card */
    .pp-contact-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 14px; padding: 24px 28px;
      display: flex; align-items: center; gap: 20px;
    }
    .pp-contact-icon {
      width: 44px; height: 44px; border-radius: 12px;
      background: linear-gradient(135deg,#6366f1,#8b5cf6);
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; flex-shrink: 0;
    }
    .pp-contact-text h4 { font-size: 14px; font-weight: 500; color: #fff; margin-bottom: 4px; }
    .pp-contact-text p  { font-size: 13px; color: rgba(255,255,255,0.4) !important; margin: 0 !important; }
    .pp-contact-text a  { color: #6366f1; text-decoration: none; }
    .pp-contact-text a:hover { text-decoration: underline; }

    @media (max-width: 768px) {
      .pp-layout { grid-template-columns: 1fr; }
      .pp-toc { display: none; }
    }
  `}</style>
);

const LogoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
    <path d="M16 2L28 9v14L16 30 4 23V9L16 2z" fill="white" opacity=".9"/>
    <path d="M16 8L24 12.5v9L16 26 8 21.5v-9L16 8z" fill="white" opacity=".4"/>
  </svg>
);
const BackIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const sections = [
  { id: 'collecte', num: '01', title: 'Données collectées' },
  { id: 'utilisation', num: '02', title: 'Utilisation des données' },
  { id: 'partage', num: '03', title: 'Partage et divulgation' },
  { id: 'stockage', num: '04', title: 'Stockage et sécurité' },
  { id: 'droits', num: '05', title: 'Vos droits' },
  { id: 'cookies', num: '06', title: 'Cookies' },
  { id: 'mineurs', num: '07', title: 'Mineurs' },
  { id: 'contact', num: '08', title: 'Nous contacter' },
];

export default function PrivacyPage() {
  return (
    <>
      <GlobalStyles />
      <div className="pp-root">
        <div className="pp-bg"><div className="pp-dot-grid" /></div>

        {/* NAV */}
        <nav className="pp-nav">
          <Link href="/" className="pp-nav-logo">
            <div className="pp-nav-icon"><LogoIcon /></div>
            <span className="pp-nav-name">Orbit</span>
            <span className="pp-nav-badge">Pro</span>
          </Link>
          <Link href="/auth/register" className="pp-back-btn">
            <BackIcon /> Retour à l'inscription
          </Link>
        </nav>

        {/* HERO */}
        <div className="pp-hero">
          <p className="pp-hero-eyebrow">Légal</p>
          <h1 className="pp-hero-title">Politique de <em>confidentialité</em></h1>
          <div className="pp-hero-meta">
            <span className="pp-hero-date">Dernière mise à jour : 1er mars 2026</span>
            <div className="pp-status">
              <div className="pp-status-dot" />
              <span className="pp-status-text">Document en vigueur</span>
            </div>
          </div>
        </div>

        {/* LAYOUT */}
        <div className="pp-layout">

          {/* TOC */}
          <aside className="pp-toc">
            <p className="pp-toc-title">Sommaire</p>
            <ul className="pp-toc-list">
              {sections.map(s => (
                <li key={s.id} className="pp-toc-item">
                  <a href={`#${s.id}`}>{s.num} — {s.title}</a>
                </li>
              ))}
            </ul>
          </aside>

          {/* CONTENT */}
          <main className="pp-content">

            <div className="pp-section">
              <p>Orbit (&quot;nous&quot;, &quot;notre&quot;) s'engage à protéger votre vie privée. Cette politique explique comment nous collectons, utilisons et protégeons vos informations personnelles lorsque vous utilisez notre service.</p>
            </div>

            <div className="pp-divider" />

            {/* 01 */}
            <div className="pp-section" id="collecte">
              <div className="pp-section-header">
                <div className="pp-section-num">01</div>
                <h2 className="pp-section-title">Données collectées</h2>
              </div>
              <p>Nous collectons les informations que vous nous fournissez directement lors de la création de votre compte ou de l'utilisation de nos services :</p>
              <ul>
                <li>Nom complet et adresse e-mail lors de l'inscription</li>
                <li>Informations de profil que vous choisissez d'ajouter</li>
                <li>Données de paiement (traitées par nos partenaires sécurisés)</li>
                <li>Communications que vous nous adressez (support, retours)</li>
              </ul>
              <p>Nous collectons également automatiquement certaines données techniques :</p>
              <ul>
                <li>Adresse IP et données de localisation approximative</li>
                <li>Type de navigateur et système d'exploitation</li>
                <li>Pages visitées et actions réalisées dans l'application</li>
                <li>Journaux d'erreurs et données de performance</li>
              </ul>
            </div>

            <div className="pp-divider" />

            {/* 02 */}
            <div className="pp-section" id="utilisation">
              <div className="pp-section-header">
                <div className="pp-section-num">02</div>
                <h2 className="pp-section-title">Utilisation des données</h2>
              </div>
              <p>Vos données sont utilisées pour les finalités suivantes :</p>
              <ul>
                <li>Fournir, maintenir et améliorer nos services</li>
                <li>Gérer votre compte et vous authentifier</li>
                <li>Vous envoyer des notifications importantes liées au service</li>
                <li>Répondre à vos demandes de support</li>
                <li>Analyser l'utilisation pour améliorer l'expérience utilisateur</li>
                <li>Détecter et prévenir les fraudes et abus</li>
              </ul>
              <div className="pp-highlight">
                <p>Nous ne vendons jamais vos données personnelles à des tiers. Vos informations ne sont utilisées qu'aux fins décrites dans la présente politique.</p>
              </div>
            </div>

            <div className="pp-divider" />

            {/* 03 */}
            <div className="pp-section" id="partage">
              <div className="pp-section-header">
                <div className="pp-section-num">03</div>
                <h2 className="pp-section-title">Partage et divulgation</h2>
              </div>
              <p>Nous pouvons partager vos informations dans les cas suivants :</p>
              <ul>
                <li><strong style={{color:'rgba(255,255,255,0.7)'}}>Prestataires de services</strong> — hébergement, paiement, analytics (sous accord de confidentialité strict)</li>
                <li><strong style={{color:'rgba(255,255,255,0.7)'}}>Obligations légales</strong> — si requis par la loi ou une autorité compétente</li>
                <li><strong style={{color:'rgba(255,255,255,0.7)'}}>Protection des droits</strong> — pour défendre nos droits légaux ou prévenir une fraude</li>
                <li><strong style={{color:'rgba(255,255,255,0.7)'}}>Transfert d'entreprise</strong> — en cas de fusion ou acquisition, avec notification préalable</li>
              </ul>
            </div>

            <div className="pp-divider" />

            {/* 04 */}
            <div className="pp-section" id="stockage">
              <div className="pp-section-header">
                <div className="pp-section-num">04</div>
                <h2 className="pp-section-title">Stockage et sécurité</h2>
              </div>
              <p>Vos données sont stockées sur des serveurs sécurisés situés dans l'Union européenne, conformément au RGPD. Nous mettons en œuvre des mesures techniques et organisationnelles appropriées :</p>
              <ul>
                <li>Chiffrement AES-256 des données au repos</li>
                <li>Chiffrement TLS 1.3 pour les données en transit</li>
                <li>Authentification à deux facteurs pour l'accès aux systèmes internes</li>
                <li>Audits de sécurité réguliers et tests d'intrusion</li>
              </ul>
              <p>Nous conservons vos données aussi longtemps que votre compte est actif ou que nécessaire pour vous fournir le service. Vous pouvez demander la suppression de vos données à tout moment.</p>
            </div>

            <div className="pp-divider" />

            {/* 05 */}
            <div className="pp-section" id="droits">
              <div className="pp-section-header">
                <div className="pp-section-num">05</div>
                <h2 className="pp-section-title">Vos droits (RGPD)</h2>
              </div>
              <p>Conformément au Règlement Général sur la Protection des Données, vous disposez des droits suivants :</p>
              <ul>
                <li><strong style={{color:'rgba(255,255,255,0.7)'}}>Droit d'accès</strong> — obtenir une copie de vos données personnelles</li>
                <li><strong style={{color:'rgba(255,255,255,0.7)'}}>Droit de rectification</strong> — corriger des données inexactes ou incomplètes</li>
                <li><strong style={{color:'rgba(255,255,255,0.7)'}}>Droit à l'effacement</strong> — demander la suppression de vos données</li>
                <li><strong style={{color:'rgba(255,255,255,0.7)'}}>Droit à la portabilité</strong> — recevoir vos données dans un format structuré</li>
                <li><strong style={{color:'rgba(255,255,255,0.7)'}}>Droit d'opposition</strong> — vous opposer au traitement de vos données</li>
                <li><strong style={{color:'rgba(255,255,255,0.7)'}}>Droit de limitation</strong> — restreindre le traitement de vos données</li>
              </ul>
              <p>Pour exercer ces droits, contactez-nous à <a href="mailto:privacy@votreapp.com" style={{color:'#10b981'}}>privacy@votreapp.com</a>. Nous répondrons dans un délai de 30 jours.</p>
            </div>

            <div className="pp-divider" />

            {/* 06 */}
            <div className="pp-section" id="cookies">
              <div className="pp-section-header">
                <div className="pp-section-num">06</div>
                <h2 className="pp-section-title">Cookies</h2>
              </div>
              <p>Nous utilisons des cookies et technologies similaires pour améliorer votre expérience :</p>
              <ul>
                <li><strong style={{color:'rgba(255,255,255,0.7)'}}>Cookies essentiels</strong> — nécessaires au fonctionnement du service (authentification, sécurité)</li>
                <li><strong style={{color:'rgba(255,255,255,0.7)'}}>Cookies analytiques</strong> — mesure d'audience anonymisée (vous pouvez les refuser)</li>
                <li><strong style={{color:'rgba(255,255,255,0.7)'}}>Cookies de préférences</strong> — mémorisation de vos paramètres d'interface</li>
              </ul>
              <p>Vous pouvez gérer vos préférences de cookies depuis les paramètres de votre navigateur ou via notre centre de préférences accessible depuis votre compte.</p>
            </div>

            <div className="pp-divider" />

            {/* 07 */}
            <div className="pp-section" id="mineurs">
              <div className="pp-section-header">
                <div className="pp-section-num">07</div>
                <h2 className="pp-section-title">Mineurs</h2>
              </div>
              <p>Notre service est destiné aux personnes âgées de 16 ans et plus. Nous ne collectons pas sciemment de données personnelles concernant des enfants de moins de 16 ans. Si vous pensez qu'un mineur nous a fourni des informations personnelles, contactez-nous immédiatement et nous supprimerons ces données.</p>
            </div>

            <div className="pp-divider" />

            {/* 08 */}
            <div className="pp-section" id="contact">
              <div className="pp-section-header">
                <div className="pp-section-num">08</div>
                <h2 className="pp-section-title">Nous contacter</h2>
              </div>
              <p>Pour toute question relative à cette politique de confidentialité ou à vos données personnelles :</p>
              <div className="pp-contact-card">
                <div className="pp-contact-icon">🛡️</div>
                <div className="pp-contact-text">
                  <h4>Délégué à la Protection des Données</h4>
                  <p>Orbit SAS — 12 rue de l'Innovation, 75001 Paris<br />
                  E-mail : <a href="mailto:privacy@votreapp.com">privacy@votreapp.com</a><br />
                  Vous pouvez également adresser une réclamation à la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{color:'#10b981'}}>CNIL</a>.</p>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>
    </>
  );
}