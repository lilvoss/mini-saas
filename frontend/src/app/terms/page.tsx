'use client';

import Link from 'next/link';

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes fadeUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulse-ring { 0% { transform:scale(1); opacity:.5; } 100% { transform:scale(1.6); opacity:0; } }

    html { scroll-behavior: smooth; }

    .tos-root {
      min-height: 100vh;
      background: #0c0e16;
      font-family: 'Sora', sans-serif;
      color: #e5e7eb;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow-x: hidden;
    }

    .tos-bg {
      position: fixed; inset: 0; pointer-events: none; z-index: 0;
    }
    .tos-bg::before {
      content:'';
      position:absolute; inset:0;
      background-image:
        radial-gradient(circle at 20% 15%, rgba(99,102,241,0.13) 0%, transparent 45%),
        radial-gradient(circle at 85% 75%, rgba(16,185,129,0.08) 0%, transparent 45%);
    }
    .tos-dot-grid {
      position:absolute; inset:0;
      background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
      background-size: 28px 28px;
    }

    /* ── NAV ── */
    .tos-nav {
      position: sticky; top: 0; z-index: 100;
      background: rgba(12,14,22,0.85);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(255,255,255,0.07);
      padding: 0 clamp(20px,5vw,80px);
      height: 64px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .tos-nav-logo {
      display: flex; align-items: center; gap: 10px;
      text-decoration: none;
    }
    .tos-nav-icon {
      width: 34px; height: 34px;
      background: linear-gradient(135deg,#6366f1,#8b5cf6);
      border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
    }
    .tos-nav-name {
      font-size: 15px; font-weight: 600; color: #fff; letter-spacing: -.2px;
    }
    .tos-nav-badge {
      background: rgba(99,102,241,0.2);
      border: 1px solid rgba(99,102,241,0.4);
      border-radius: 100px; padding: 2px 8px;
      font-size: 10px; font-weight: 500; color: #a5b4fc;
      letter-spacing: .5px; text-transform: uppercase;
    }
    .tos-back-btn {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 13px; color: #9ca3af;
      text-decoration: none;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px; padding: 6px 14px;
      transition: all .2s;
    }
    .tos-back-btn:hover { color: #fff; background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.14); }

    /* ── HERO ── */
    .tos-hero {
      position: relative; z-index: 1;
      padding: clamp(48px,8vh,96px) clamp(20px,5vw,80px) clamp(32px,5vh,64px);
      max-width: 900px; margin: 0 auto; width: 100%;
      animation: fadeUp .6s cubic-bezier(.22,1,.36,1) both;
    }
    .tos-hero-eyebrow {
      font-size: 11px; font-weight: 600; letter-spacing: 2.5px;
      text-transform: uppercase; color: #6366f1;
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 18px;
    }
    .tos-hero-eyebrow::before { content:''; width:24px; height:1px; background:#6366f1; }
    .tos-hero-title {
      font-family: 'Lora', serif;
      font-size: clamp(32px, 5vw, 58px);
      font-weight: 600; color: #fff;
      line-height: 1.12; letter-spacing: -.5px;
      margin-bottom: 18px;
    }
    .tos-hero-title em {
      font-style: italic;
      background: linear-gradient(135deg,#6366f1,#a78bfa);
      -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    }
    .tos-hero-meta {
      display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
    }
    .tos-hero-date { font-size: 13px; color: rgba(255,255,255,0.35); }
    .tos-status {
      display: flex; align-items: center; gap: 7px;
    }
    .tos-status-dot {
      width: 7px; height: 7px; border-radius: 50%; background: #6366f1; position: relative;
    }
    .tos-status-dot::after {
      content:''; position:absolute; inset:0; border-radius:50%; background:#6366f1;
      animation: pulse-ring 1.5s ease-out infinite;
    }
    .tos-status-text { font-size: 12px; color: rgba(255,255,255,0.4); }

    /* ── LAYOUT ── */
    .tos-layout {
      position: relative; z-index: 1;
      max-width: 900px; margin: 0 auto; width: 100%;
      padding: 0 clamp(20px,5vw,80px) clamp(60px,8vh,100px);
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 48px;
      align-items: start;
    }

    /* ── TOC ── */
    .tos-toc {
      position: sticky; top: 80px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 14px; padding: 20px;
      animation: fadeUp .6s .1s cubic-bezier(.22,1,.36,1) both;
    }
    .tos-toc-title {
      font-size: 11px; font-weight: 600; letter-spacing: 2px;
      text-transform: uppercase; color: rgba(255,255,255,0.3);
      margin-bottom: 14px;
    }
    .tos-toc-list { list-style: none; display: flex; flex-direction: column; gap: 4px; }
    .tos-toc-item a {
      font-size: 12.5px; color: rgba(255,255,255,0.45);
      text-decoration: none; padding: 5px 8px; border-radius: 6px;
      display: block; transition: all .15s;
      border-left: 2px solid transparent;
    }
    .tos-toc-item a:hover {
      color: #a78bfa; background: rgba(99,102,241,0.07);
      border-left-color: #6366f1;
    }

    /* ── CONTENT ── */
    .tos-content {
      animation: fadeUp .6s .15s cubic-bezier(.22,1,.36,1) both;
    }
    .tos-section { margin-bottom: clamp(32px,5vh,52px); }
    .tos-section-header {
      display: flex; align-items: center; gap: 12px;
      margin-bottom: 18px;
    }
    .tos-section-num {
      width: 28px; height: 28px; border-radius: 8px;
      background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,139,250,0.2));
      border: 1px solid rgba(99,102,241,0.25);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700; color: #a78bfa; flex-shrink: 0;
    }
    .tos-section-title {
      font-family: 'Lora', serif;
      font-size: clamp(16px,1.4vw,22px);
      font-weight: 600; color: #fff;
    }
    .tos-section p {
      font-size: clamp(13px,0.95vw,15px);
      color: rgba(255,255,255,0.55);
      line-height: 1.8; font-weight: 300;
      margin-bottom: 14px;
    }
    .tos-section p:last-child { margin-bottom: 0; }
    .tos-section ul {
      list-style: none; display: flex; flex-direction: column; gap: 8px;
      margin: 10px 0 14px 0;
    }
    .tos-section ul li {
      font-size: clamp(13px,0.9vw,14px);
      color: rgba(255,255,255,0.5);
      line-height: 1.7; font-weight: 300;
      padding-left: 18px; position: relative;
    }
    .tos-section ul li::before {
      content:''; position:absolute; left:0; top:9px;
      width:6px; height:6px; border-radius:50%;
      background: linear-gradient(135deg,#6366f1,#a78bfa);
    }

    .tos-highlight {
      background: rgba(99,102,241,0.07);
      border: 1px solid rgba(99,102,241,0.2);
      border-radius: 12px; padding: 18px 22px;
      margin: 16px 0;
    }
    .tos-highlight p {
      color: rgba(255,255,255,0.65) !important;
      font-size: 14px !important;
    }

    .tos-warn {
      background: rgba(245,158,11,0.07);
      border: 1px solid rgba(245,158,11,0.2);
      border-radius: 12px; padding: 16px 20px;
      margin: 16px 0;
      display: flex; gap: 12px; align-items: flex-start;
    }
    .tos-warn-icon { font-size: 16px; flex-shrink: 0; margin-top: 2px; }
    .tos-warn p { color: rgba(255,255,255,0.6) !important; font-size: 13px !important; margin: 0 !important; }

    .tos-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 0 0 clamp(32px,5vh,52px) 0; }

    .tos-contact-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 14px; padding: 24px 28px;
      display: flex; align-items: center; gap: 20px;
    }
    .tos-contact-icon {
      width: 44px; height: 44px; border-radius: 12px;
      background: linear-gradient(135deg,#6366f1,#8b5cf6);
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; flex-shrink: 0;
    }
    .tos-contact-text h4 { font-size: 14px; font-weight: 500; color: #fff; margin-bottom: 4px; }
    .tos-contact-text p  { font-size: 13px; color: rgba(255,255,255,0.4) !important; margin: 0 !important; }
    .tos-contact-text a  { color: #a78bfa; text-decoration: none; }
    .tos-contact-text a:hover { text-decoration: underline; }

    @media (max-width: 768px) {
      .tos-layout { grid-template-columns: 1fr; }
      .tos-toc { display: none; }
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
  { id: 'acceptation', num: '01', title: 'Acceptation des CGU' },
  { id: 'compte', num: '02', title: 'Votre compte' },
  { id: 'utilisation', num: '03', title: 'Utilisation du service' },
  { id: 'interdit', num: '04', title: 'Usages interdits' },
  { id: 'propriete', num: '05', title: 'Propriété intellectuelle' },
  { id: 'abonnement', num: '06', title: 'Abonnement et facturation' },
  { id: 'resiliation', num: '07', title: 'Résiliation' },
  { id: 'limitation', num: '08', title: 'Limitation de responsabilité' },
  { id: 'modifications', num: '09', title: 'Modifications des CGU' },
  { id: 'contact', num: '10', title: 'Contact' },
];

export default function TermsPage() {
  return (
    <>
      <GlobalStyles />
      <div className="tos-root">
        <div className="tos-bg"><div className="tos-dot-grid" /></div>

        {/* NAV */}
        <nav className="tos-nav">
          <Link href="/" className="tos-nav-logo">
            <div className="tos-nav-icon"><LogoIcon /></div>
            <span className="tos-nav-name">Orbit</span>
            <span className="tos-nav-badge">Pro</span>
          </Link>
          <Link href="/auth/register" className="tos-back-btn">
            <BackIcon /> Retour à l'inscription
          </Link>
        </nav>

        {/* HERO */}
        <div className="tos-hero">
          <p className="tos-hero-eyebrow">Légal</p>
          <h1 className="tos-hero-title">Conditions <em>d'utilisation</em></h1>
          <div className="tos-hero-meta">
            <span className="tos-hero-date">Dernière mise à jour : 1er mars 2026</span>
            <div className="tos-status">
              <div className="tos-status-dot" />
              <span className="tos-status-text">Document en vigueur</span>
            </div>
          </div>
        </div>

        {/* LAYOUT */}
        <div className="tos-layout">

          {/* TOC */}
          <aside className="tos-toc">
            <p className="tos-toc-title">Sommaire</p>
            <ul className="tos-toc-list">
              {sections.map(s => (
                <li key={s.id} className="tos-toc-item">
                  <a href={`#${s.id}`}>{s.num} — {s.title}</a>
                </li>
              ))}
            </ul>
          </aside>

          {/* CONTENT */}
          <main className="tos-content">

            <div className="tos-section">
              <p>Bienvenue sur Orbit. En accédant à notre service ou en créant un compte, vous acceptez d'être lié par les présentes Conditions Générales d'Utilisation. Veuillez les lire attentivement.</p>
            </div>

            <div className="tos-divider" />

            {/* 01 */}
            <div className="tos-section" id="acceptation">
              <div className="tos-section-header">
                <div className="tos-section-num">01</div>
                <h2 className="tos-section-title">Acceptation des CGU</h2>
              </div>
              <p>En utilisant notre service, vous confirmez avoir au minimum 16 ans et avoir la capacité juridique de conclure un contrat. Si vous utilisez le service pour le compte d'une organisation, vous garantissez être autorisé à l'engager.</p>
              <div className="tos-highlight">
                <p>L'utilisation du service vaut acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, vous devez cesser d'utiliser le service.</p>
              </div>
            </div>

            <div className="tos-divider" />

            {/* 02 */}
            <div className="tos-section" id="compte">
              <div className="tos-section-header">
                <div className="tos-section-num">02</div>
                <h2 className="tos-section-title">Votre compte</h2>
              </div>
              <p>Lors de la création de votre compte, vous vous engagez à :</p>
              <ul>
                <li>Fournir des informations exactes, complètes et à jour</li>
                <li>Maintenir la confidentialité de vos identifiants de connexion</li>
                <li>Notifier immédiatement tout accès non autorisé à votre compte</li>
                <li>Être responsable de toutes les activités effectuées depuis votre compte</li>
              </ul>
              <p>Nous nous réservons le droit de suspendre ou supprimer tout compte en cas de violation des présentes conditions.</p>
            </div>

            <div className="tos-divider" />

            {/* 03 */}
            <div className="tos-section" id="utilisation">
              <div className="tos-section-header">
                <div className="tos-section-num">03</div>
                <h2 className="tos-section-title">Utilisation du service</h2>
              </div>
              <p>Notre service vous est fourni sous licence personnelle, non exclusive, non transférable et révocable. Vous pouvez utiliser le service uniquement dans le cadre prévu et conformément aux présentes CGU.</p>
              <p>Vous êtes responsable de vous assurer que votre utilisation du service est conforme à la législation applicable dans votre pays de résidence.</p>
            </div>

            <div className="tos-divider" />

            {/* 04 */}
            <div className="tos-section" id="interdit">
              <div className="tos-section-header">
                <div className="tos-section-num">04</div>
                <h2 className="tos-section-title">Usages interdits</h2>
              </div>
              <p>Il vous est strictement interdit d'utiliser notre service pour :</p>
              <ul>
                <li>Violer des lois ou réglementations applicables</li>
                <li>Transmettre du contenu illégal, frauduleux ou diffamatoire</li>
                <li>Tenter d'accéder sans autorisation à nos systèmes ou données</li>
                <li>Perturber ou interférer avec la sécurité du service</li>
                <li>Collecter des données d'autres utilisateurs sans leur consentement</li>
                <li>Revendre ou sous-licencier l'accès au service sans autorisation</li>
              </ul>
              <div className="tos-warn">
                <span className="tos-warn-icon">⚠️</span>
                <p>Tout manquement à ces règles peut entraîner la suspension immédiate de votre compte et des poursuites légales si nécessaire.</p>
              </div>
            </div>

            <div className="tos-divider" />

            {/* 05 */}
            <div className="tos-section" id="propriete">
              <div className="tos-section-header">
                <div className="tos-section-num">05</div>
                <h2 className="tos-section-title">Propriété intellectuelle</h2>
              </div>
              <p>Le service, incluant son code source, ses interfaces, sa documentation et ses marques, est la propriété exclusive de Orbit SAS et est protégé par les lois sur la propriété intellectuelle.</p>
              <p>Vous conservez l'entière propriété du contenu que vous créez via le service. En utilisant le service, vous nous accordez une licence limitée pour héberger et afficher votre contenu dans le seul but de vous fournir le service.</p>
            </div>

            <div className="tos-divider" />

            {/* 06 */}
            <div className="tos-section" id="abonnement">
              <div className="tos-section-header">
                <div className="tos-section-num">06</div>
                <h2 className="tos-section-title">Abonnement et facturation</h2>
              </div>
              <p>Certaines fonctionnalités du service nécessitent un abonnement payant. En souscrivant à un abonnement :</p>
              <ul>
                <li>Vous autorisez la facturation selon la périodicité choisie</li>
                <li>L'abonnement se renouvelle automatiquement sauf résiliation préalable</li>
                <li>Les tarifs peuvent évoluer avec un préavis de 30 jours</li>
                <li>Aucun remboursement n'est accordé pour les périodes entamées</li>
              </ul>
              <p>L'essai gratuit de 14 jours ne nécessite pas de carte bancaire. À l'issue de l'essai, le service passe automatiquement en version gratuite limitée.</p>
            </div>

            <div className="tos-divider" />

            {/* 07 */}
            <div className="tos-section" id="resiliation">
              <div className="tos-section-header">
                <div className="tos-section-num">07</div>
                <h2 className="tos-section-title">Résiliation</h2>
              </div>
              <p>Vous pouvez résilier votre compte à tout moment depuis les paramètres de votre profil. La résiliation prend effet à la fin de la période de facturation en cours.</p>
              <p>Nous pouvons résilier ou suspendre votre accès avec ou sans préavis en cas de violation des présentes CGU, d'activité frauduleuse, ou de cessation du service.</p>
            </div>

            <div className="tos-divider" />

            {/* 08 */}
            <div className="tos-section" id="limitation">
              <div className="tos-section-header">
                <div className="tos-section-num">08</div>
                <h2 className="tos-section-title">Limitation de responsabilité</h2>
              </div>
              <p>Dans toute la mesure permise par la loi applicable, Orbit SAS ne pourra être tenue responsable des dommages indirects, accessoires, spéciaux ou consécutifs découlant de l'utilisation ou de l'impossibilité d'utiliser le service.</p>
              <p>Notre responsabilité totale pour tout sinistre ne pourra excéder le montant payé par vous pour le service au cours des 12 derniers mois.</p>
            </div>

            <div className="tos-divider" />

            {/* 09 */}
            <div className="tos-section" id="modifications">
              <div className="tos-section-header">
                <div className="tos-section-num">09</div>
                <h2 className="tos-section-title">Modifications des CGU</h2>
              </div>
              <p>Nous nous réservons le droit de modifier les présentes CGU à tout moment. En cas de modification substantielle, vous serez notifié par e-mail ou via une notification dans l'application au moins 15 jours avant l'entrée en vigueur des nouvelles conditions.</p>
              <p>La poursuite de l'utilisation du service après la date d'entrée en vigueur des nouvelles conditions vaut acceptation de celles-ci.</p>
            </div>

            <div className="tos-divider" />

            {/* 10 */}
            <div className="tos-section" id="contact">
              <div className="tos-section-header">
                <div className="tos-section-num">10</div>
                <h2 className="tos-section-title">Contact</h2>
              </div>
              <p>Pour toute question concernant les présentes Conditions Générales d'Utilisation :</p>
              <div className="tos-contact-card">
                <div className="tos-contact-icon">⚖️</div>
                <div className="tos-contact-text">
                  <h4>Service juridique</h4>
                  <p>Orbit SAS — 12 rue de l'Innovation, 75001 Paris<br />
                  E-mail : <a href="mailto:legal@votreapp.com">legal@votreapp.com</a><br />
                  Les présentes CGU sont régies par le droit français.</p>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>
    </>
  );
}