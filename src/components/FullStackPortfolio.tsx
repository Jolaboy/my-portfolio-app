'use client';

import { useMemo, useState } from 'react';

import AdminPanel from './AdminPanel';
import CompatibilityNotice from './CompatibilityNotice';
import ContactForm from './ContactForm';

/**
 * Single-page portfolio UI.
 *
 * Notes for maintainers:
 * - This component is intentionally self-contained (markup + a small CSS-in-JSX block)
 *   to keep the project simple to deploy.
 * - Theme is implemented via a `data-theme` attribute + CSS variables.
 */

/** UI theme modes supported by the portfolio container. */
type Theme = 'light' | 'dark';

/** Map of section heading -> list of skill "chips". */
type SkillsMap = Record<string, string[]>;

/** Project metadata rendered in the "Projects" section. */
type Project = {
  title: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
};

/** Public props for customizing the portfolio (all optional, with sensible defaults). */
type FullStackPortfolioProps = {
  name?: string;
  title?: string;
  location?: string;
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  projects?: Project[];
};

/**
 * Main portfolio component.
 *
 * Defaults are filled so the app renders out-of-the-box without any data fetching.
 */
export default function FullStackPortfolio({
  name = 'Amadou Jarju',
  title = 'Cloud|Software\u00A0Engineer',
  location = 'London, United Kingdom',
  email = 'amsjarju99@gmail.com',
  githubUrl = 'https://github.com/Jolaboy',
  linkedinUrl = 'https://www.linkedin.com/in/amadou-jarju/',
  resumeUrl = '#',
  projects,
}: FullStackPortfolioProps) {
  // Theme is controlled entirely by a `data-theme` attribute and CSS variables.
  const [theme, setTheme] = useState<Theme>('light');

  // Optional "Admin" panel shows live contact submissions when Socket.IO is supported.
  const [showAdmin, setShowAdmin] = useState(false);

  // Skills are memoized to avoid recreating arrays on every render.
  const skills = useMemo<SkillsMap>(
    () => ({
      'Cloud Engineering': ['AWS (EC2, Lambda, S3, RDS, VPC)', 'Azure (App Service, Functions, Storage)', 'GCP (Cloud Run, Cloud Storage)'],
      Frontend: ['JavaScript/TypeScript', 'React/Next.js', 'Tailwind/Bootstrap'],
      Backend: ['Databases(SQL & NoSQL)', 'Python  (FastAPI)', 'C# & .NET Core', 'Node/Express.js', 'APIs (REST, GraphQL, gRPC)'],
      'System Design & UI/UX': ['Requirements Gathering', 'Design Use Cases & User Stories', 'Wireframing', 'Prototyping', 'Responsive Design'],
      'Database Management': ['Schema Design', 'Migrations & Seeding', 'Performance Tuning', 'Backup & Recovery'],
      'Version Control & Project Management': ['Git', 'GitHub', 'Branching & Pull Requests','Agile / Scrum', 'Azure DevOps', 'Stakeholder Comms'],
    }),
    []
  );

  // Default project list used when no `projects` prop is provided.
  const defaultProjects = useMemo<Project[]>(
    () => [
      {
        title: 'Holiday Destination App - TravelWise',
        description:
          'A modern, responsive travel destination search application built with React. TravelWise helps users discover new places by providing real-time weather data, stunning photography, and smart search capabilities.',
        tech: ['React 19(vite)', 'Bootstrap 5', 'APIs'],
        github: 'https://github.com/Jolaboy/Holiday_Destination_App-TravelWise',
        live: 'https://destinationtravelwise.netlify.app/',
      },
      {
        title: 'Library Management System',
        description: 'This repository contains a collection of data science projects showcasing various analysis, machine learning, and visualization techniques.',
        tech: ['C#', '.NET Core', 'SQL Server', 'Entity Framework', 'Bootstrap'],
        github: 'https://github.com/Jolaboy/C-Sharp-.NET-Projects/tree/master/LibraryManagementApp',
        live: '',
      },
      {
        title: 'Student API',
        description: 'This project showcases backend development and provides a robust API for managing student data with secure endpoints and efficient data handling.',
        tech: ['C#', '.NET Core', 'Postgres', 'Entity Framework', 'Swagger UI'],
        github: 'https://github.com/Jolaboy/C-Sharp-.NET-Projects/tree/main/StudentApi',
        live: '',
      },
      {
        title: 'PremierLeagueStats',
        description: 'This App tracks fantasy league statistics, manages teams, and calculates points using seeded data.',
        tech: ['C#', '.NET Core ', 'SQLite', 'Entity Framework'],
        github: 'https://github.com/Jolaboy/Basic-C-Sharp-Projects/tree/master/PremierLeagueFantasyApp/PremierLeagueFantasyApp',
        live: '',
      },
      {
        title: 'Weather App',
        description: 'This app provides real-time weather information for any location using a clean and responsive interface.',
        tech: ['HTML', 'CSS', 'JavaScript', 'RESTful API', 'Bootstrap'],
        github: 'https://github.com/Jolaboy/JavaScript-Projects/tree/main/Weather-App',
        live: 'https://ggweather.netlify.app/',
      },
      {
        title: 'SQL and Database Management',
        description: 'A curated SQL Server portfolio with practical database projects for operations, ticketing, inventory, and business reporting.',
        tech: ['T-SQL Scripting', 'Data Modelling', 'Stored Procedures', 'Database Design'],
        github: 'https://github.com/Jolaboy/sql-and-database-projects',
        live: '',
      },
    ],
    []
  );

  // Render either external projects passed in, or the local defaults.
  const items: Project[] = projects && projects.length ? projects : defaultProjects;

  // Used in the footer for an always-current copyright.
  const year = new Date().getFullYear();

  return (
    // `data-theme` drives the CSS variable set used by the inline styles.
    <div className="portfolio" data-theme={theme}>
      {/*
        CSS-in-JSX keeps the portfolio styles colocated with the component.
        The design is implemented using CSS variables so light/dark theme toggling is fast.
      */}
      <style>{`
                :root {}
                .portfolio {
                    --bg: #0b0c10;
                    --text: #0b0c10;
                    --muted: #57606a;
                    --primary: #2563eb;
                    --accent: #14b8a6;
                    --cardBg: #ffffff;
                    --border: #e5e7eb;
                    background: var(--pageBg);
                  color: var(--text);
                }
                .portfolio[data-theme="light"] {
                    --pageBg: #f6f8fa;
                    --elev: #ffffff;
                    --text: #0b1220;
                    --muted: #5b6773;
                    --primary: #2563eb;
                    --accent: #0ea5e9;
                    --cardBg: #ffffff;
                    --border: #e5e7eb;
                    --chip: #eef2ff;
                  --chipBorder: #d0d7de;
                }
                .portfolio[data-theme="dark"] {
                    --pageBg: #0b1220;
                    --elev: #0f172a;
                    --text: #e6edf3;
                    --muted: #93a1b3;
                    --primary: #60a5fa;
                    --accent: #22d3ee;
                    --cardBg: #0b1220;
                    --border: #1f2a44;
                  --chip: #0b1a33;
                  --chipBorder: #2a3b5e;
                }

                * { box-sizing: border-box; }
                html, body, #root { height: 100%; }
                body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, "Apple Color Emoji","Segoe UI Emoji"; }

                a { color: inherit; text-decoration: none; }
                img { max-width: 100%; display: block; }

                .container {
                    width: 100%;
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 0 1.25rem;
                }

                .nav {
                    position: sticky; top: 0; z-index: 20;
                    background: var(--elev);
                    border-bottom: 1px solid var(--border);
                    backdrop-filter: blur(8px);
                }
                .nav-inner {
                    display: flex; align-items: center; justify-content: space-between;
                    height: 64px;
                }
                .brand {
                    display: flex; gap: .75rem; align-items: center; font-weight: 700; color: var(--text);
                }
                .brand .muted { white-space: nowrap; }
                .brand-badge {
                    width: 36px; height: 36px; border-radius: 10px;
                    background: linear-gradient(135deg, var(--primary), var(--accent));
                    display: grid; place-items: center; color: white; font-weight: 800;
                }
                .nav-links { display: flex; gap: 1rem; }
                .nav-links a {
                    color: var(--muted); font-weight: 600; padding: .5rem .75rem; border-radius: .5rem;
                }
                .nav-links a:hover { color: var(--text); background: rgba(127,127,127,.08); }
                .theme-toggle {
                    border: 1px solid var(--border);
                    background: transparent; color: var(--text);
                    border-radius: .6rem; padding: .45rem .7rem; cursor: pointer;
                }

                .hero {
                    background: linear-gradient(180deg, rgba(37,99,235,.08), transparent 50%),
                                            linear-gradient(180deg, rgba(34,211,238,.08), transparent 30%);
                    padding: 3.5rem 0 2rem;
                }
                .hero-grid {
                    display: grid; grid-template-columns: 1.3fr .7fr; gap: 2rem; align-items: center;
                }
                .hero h1 { margin: 0 0 .5rem; font-size: clamp(1.5rem, 4.2vw, 3rem); color: var(--text); white-space: nowrap; }
                .hero .lead { margin: .25rem 0 1.25rem; color: var(--muted); font-size: 1.05rem; }
                .hero .lead p { margin: 0 0 .75rem; }
                .hero .lead p:last-child { margin-bottom: 0; }
                .badge-row { display: flex; flex-wrap: wrap; gap: .5rem; margin: 1rem 0 1.25rem; }
                .badge {
                    background: var(--chip);
                    color: var(--text);
                  border: 1px solid var(--chipBorder);
                    padding: .35rem .6rem; border-radius: .5rem; font-size: .85rem; font-weight: 600;
                }
                .cta-row { display: flex; gap: .75rem; flex-wrap: wrap; }
                .btn {
                    display: inline-flex; gap: .5rem; align-items: center; justify-content: center;
                    padding: .6rem .9rem; font-weight: 700; border-radius: .65rem; border: 1px solid var(--border);
                    color: var(--text); background: var(--elev);
                }
                .btn-primary {
                    background: linear-gradient(135deg, var(--primary), var(--accent));
                    color: white; border: none;
                }
                .btn-outline:hover { background: rgba(127,127,127,.08); }
                .avatar {
                    width: 160px; height: 160px; border-radius: 24px; background: var(--elev);
                    border: 1px solid var(--border); display: grid; place-items: center; font-size: 3rem; font-weight: 800;
                    color: var(--primary);
                    box-shadow: 0 10px 30px rgba(0,0,0,.08);
                }
                .hero-aside {
                    display: grid; place-items: center;
                }

                section { padding: 2rem 0; }
                .section-head { margin-bottom: 1rem; }
                .section-head h2 { margin: 0; font-size: 1.6rem; color: var(--text); }
                .section-head p { margin: .25rem 0 0; color: var(--muted); }

                .skills-grid {
                    display: grid; gap: 1rem; grid-template-columns: repeat(2, minmax(0,1fr));
                }
                .card {
                    background: var(--cardBg); border: 1px solid var(--border);
                    border-radius: .9rem; padding: 1rem;
                }
                .card h3 { margin: 0 0 .75rem; font-size: 1rem; color: var(--text); }
                .chips { display: flex; flex-wrap: wrap; gap: .5rem; }
                .chip {
                    background: var(--chip);
                  border: 1px solid var(--chipBorder);
                    color: var(--text); padding: .35rem .55rem; border-radius: .5rem; font-weight: 600; font-size: .85rem;
                }

                .projects {
                    display: grid; gap: 1rem; grid-template-columns: repeat(3, minmax(0,1fr));
                }
                .project h3 { margin: 0 0 .5rem; }
                .project p { margin: 0 0 .7rem; color: var(--muted); min-height: 42px; }
                .techline { display: flex; flex-wrap: wrap; gap: .4rem; margin: .6rem 0 .9rem; }
                .techline span { font-size: .78rem; padding: .28rem .5rem; border-radius: .4rem; background: var(--chip); border: 1px solid var(--chipBorder); font-weight: 600; color: var(--text); }
                .links { display: flex; gap: .6rem; }

                .timeline { border-left: 2px solid var(--border); padding-left: 1rem; display: grid; gap: 1rem; }
                .tl-item { position: relative; }
                .tl-item::before {
                    content: ""; position: absolute; left: -1.05rem; top: .3rem;
                    width: .7rem; height: .7rem; background: var(--primary); border-radius: 50%;
                    box-shadow: 0 0 0 4px var(--elev);
                }
                .tl-title { display: flex; align-items: baseline; justify-content: space-between; gap: .5rem; }
                .tl-title strong { color: var(--text); }
                .tl-title span { color: var(--muted); font-size: .9rem; }
                .tl-body { color: var(--muted); margin-top: .3rem; }

                .contact-card { display: grid; gap: .75rem; }
                .contact-row { display: flex; gap: .75rem; flex-wrap: wrap; }
                .muted { color: var(--muted); }

                footer {
                    border-top: 1px solid var(--border); padding: 1.2rem 0; color: var(--muted); font-size: .95rem; margin-top: 1rem;
                }

                .social { display: inline-flex; gap: .5rem; align-items: center; }
                .icon { width: 18px; height: 18px; display: inline-block; }

                @media (max-width: 980px) {
                    .projects { grid-template-columns: repeat(2, minmax(0,1fr)); }
                    .hero-grid { grid-template-columns: 1fr; }
                }
                @media (max-width: 640px) {
                    .skills-grid, .projects { grid-template-columns: 1fr; }
                    .nav-links { display: none; }
                    .avatar { width: 120px; height: 120px; font-size: 2.2rem; }
                }
            `}</style>

      <nav className="nav" aria-label="Primary">
        <div className="container nav-inner">
          <div className="brand">
            <div className="brand-badge" aria-hidden>
              {initials(name)}
            </div>
            <div>
              <div className="text-base leading-none">{name}</div>
              <div className="muted text-sm">
                {title}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="nav-links">
              <a href="#about">About</a>
              <a href="#skills">Skills</a>
              <a href="#projects">Projects</a>
              <a href="#experience">Experience</a>
              <a href="#contact">Contact</a>
            </div>
            <button
              className="theme-toggle"
              // Toggle between light/dark CSS variable palettes.
              onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>
      </nav>

      <CompatibilityNotice />

      <header className="hero" id="about">
        <div className="container hero-grid">
          <div>
            <h1>{title}</h1>
            <div className="lead">
              <p>
                I’m a multi‑disciplinary engineer working at the intersection of cloud infrastructure, full‑stack development, and data science. My focus is building scalable, secure, and high‑performing systems that solve real business problems.
              </p>
              <p>
                I specialise in AWS cloud engineering, designing and deploying cloud‑native architectures using services like EC2, Lambda, S3, RDS, VPC, and IaC tooling. Alongside this, I build end‑to‑end applications using modern full‑stack technologies and apply data‑driven approaches to optimise performance, automate workflows, and uncover insights.
              </p>
              <p>
                What drives me is the ability to turn complex challenges into elegant, reliable solutions — whether that’s deploying a distributed system, engineering a seamless user experience, or building models that transform raw data into actionable intelligence.
              </p>
              <p>
                I’m always open to collaborating on cloud projects, scalable app development, and data‑centric solutions that push technology forward.
              </p>
            </div>
            <div className="cta-row">
              <a className="btn btn-primary" href={githubUrl} target="_blank" rel="noreferrer">
                <GitHubIcon /> GitHub
              </a>
              <a className="btn btn-outline btn" href={linkedinUrl} target="_blank" rel="noreferrer">
                <LinkedInIcon /> LinkedIn
              </a>
              {email && (
                <a className="btn btn-outline btn" href={`mailto:${email}`}>
                  Email
                </a>
              )}
              {resumeUrl && resumeUrl !== '#' && (
                <a className="btn btn-outline btn" href={resumeUrl} target="_blank" rel="noreferrer">
                  Download CV
                </a>
              )}
            </div>
          </div>
          <div className="hero-aside">
            <div className="avatar" aria-label={`${name} avatar`}>
              {initials(name)}
            </div>
            <div className="muted mt-2.5">
              {location}
            </div>
          </div>
        </div>
      </header>

      <main>
        <section id="skills">
          <div className="container">
            <div className="section-head">
              <h2>Skills</h2>
              <p className="muted">Core technologies and tools I use to deliver value.</p>
            </div>
            <div className="skills-grid">
              {Object.entries(skills).map(([group, items]) => (
                <div className="card" key={group}>
                  <h3>{group}</h3>
                  <div className="chips">
                    {items.map((s) => (
                      <span className="chip" key={s}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects">
          <div className="container">
            <div className="section-head">
              <h2>Projects</h2>
              <p className="muted">Selected work highlighting full stack capabilities.</p>
            </div>
            <div className="projects">
              {items.map((p) => (
                <article className="card project" key={p.title}>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <div className="techline">
                    {p.tech.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <div className="links">
                    <a className="btn" href={p.github} target="_blank" rel="noreferrer">
                      <GitHubIcon /> Code
                    </a>
                    {p.live && p.live.startsWith('http') ? (
                      <a className="btn" href={p.live} target="_blank" rel="noreferrer">
                        Live Demo
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="experience">
          <div className="container">
            <div className="section-head">
              <h2>Experience</h2>
              <p className="muted">Professional background and hands-on experience.</p>
            </div>
            <div className="card">
              <div className="timeline">
                <div className="tl-item">
                  <div className="tl-title">
                    <strong>Cloud Engineering (AWS, Azure, GCP)</strong>
                    <span>2025 — Present</span>
                  </div>
                  <div className="tl-body">
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      <li>AWS Cloud Engineering across EC2, Lambda, S3, RDS, and VPC networking (security groups, subnets, routing).</li>
                      <li>Infrastructure as Code (IaC) to provision repeatable environments and reduce manual drift (Terraform / CloudFormation).</li>
                      <li>Azure experience building and operating cloud workloads (App Service, Functions, Storage, Key Vault) and deployments (Bicep/ARM).</li>
                      <li>GCP experience delivering containerized and serverless workloads (Cloud Run, Cloud Storage, IAM, VPC) with least-privilege access.</li>
                    </ul>
                  </div>
                </div>
                <div className="tl-item">
                  <div className="tl-title">
                    <strong>Frontend & Client-Side Development Skills</strong>
                    <span>2024 — Present</span>
                  </div>
                  <div className="tl-body">
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      <li>Designed and implemented responsive user interfaces using HTML5 and CSS3, with a mobile-first approach.</li>
                      <li>Built dynamic client-side functionality in JavaScript (ES6+) for form validation, DOM manipulation, and async data fetching.</li>
                      <li>Used modern CSS frameworks (Tailwind CSS / Bootstrap) to accelerate styling and keep visual consistency.</li>
                      <li>Built reusable React components and managed state with hooks for a smooth user experience.</li>
                      <li>Integrated third-party APIs and services to enhance product capabilities.</li>
                      <li>Used Git/GitHub workflows (branching, PRs, reviews) for feature development.</li>
                    </ul>
                  </div>
                </div>
                <div className="tl-item">
                  <div className="tl-title">
                    <strong>Backend & Core Logic (C# and .NET)</strong>
                    <span>2024 — Present</span>
                  </div>
                  <div className="tl-body">
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      <li>Built RESTful APIs with C# and ASP.NET Core to support CRUD operations and serve data to the frontend.</li>
                      <li>Applied OOP principles to structure business logic with clear separation of concerns and maintainable services.</li>
                      <li>Worked with routing, dependency injection, and service layers in .NET to keep code modular and testable.</li>
                      <li>Implemented basic security measures like validation and safe configuration handling for sensitive data.</li>
                      <li>Used Entity Framework Core for database access, migrations, and model-driven development.</li>
                    </ul>
                  </div>
                </div>
                <div className="tl-item">
                  <div className="tl-title">
                    <strong>Data Management & Project Execution</strong>
                    <span>2024 — Present</span>
                  </div>
                  <div className="tl-body">
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      <li>Developed and optimised SQL queries (joins, aggregations, subqueries, stored procedures) for efficient data access.</li>
                      <li>Designed relational schemas in SQL Server/MySQL with normalization to maintain integrity and consistency.</li>
                      <li>Performed data migration and seeding for reliable local and test environments.</li>
                      <li>Worked through the SDLC with daily stand-ups, sprint reviews, and retrospectives.</li>
                      <li>Applied Agile (Scrum) to prioritize work and track progress using tools like Trello or Azure DevOps.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact">
          <div className="container">
            <div className="section-head">
              <h2>Contact</h2>
              <p className="muted">Open to full-time roles, freelance, and collaborations.</p>
            </div>
            <div className="card contact-card">
              <div>
                <ContactForm />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <a className="btn" href={githubUrl} target="_blank" rel="noreferrer">
                  <GitHubIcon /> GitHub
                </a>
                <a className="btn" href={linkedinUrl} target="_blank" rel="noreferrer">
                  <LinkedInIcon /> LinkedIn
                </a>
                <button className="btn ml-auto" onClick={() => setShowAdmin((s) => !s)}>
                  {showAdmin ? 'Hide' : 'Show'} Admin
                </button>
              </div>
              {/* Admin panel is hidden by default because it connects to Socket.IO when enabled. */}
              {showAdmin && <AdminPanel />}
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container flex justify-between gap-4 flex-wrap">
          <div>© {year} {name}. All rights reserved.</div>
          <div className="social">
            <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub">
              <GitHubIcon />
            </a>
            <a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** Derives initials for avatar/badge from a full name (fallback is "AJ"). */
function initials(fullName: string): string {
  const parts = String(fullName || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '');
  return parts.join('') || 'AJ';
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5A11.5 11.5 0 0 0 .6 12.3c0 5.24 3.4 9.68 8.12 11.26.6.1.82-.26.82-.58l-.02-2.05c-3.3.73-4-1.6-4-1.6-.56-1.44-1.37-1.83-1.37-1.83-1.12-.77.09-.76.09-.76 1.24.09 1.9 1.28 1.9 1.28 1.1 1.91 2.88 1.36 3.58 1.04.11-.82.43-1.36.78-1.67-2.64-.31-5.41-1.36-5.41-6.06 0-1.34.47-2.44 1.25-3.3-.13-.31-.54-1.57.12-3.28 0 0 1.01-.33 3.31 1.26a11.5 11.5 0 0 1 6.02 0c2.29-1.6 3.3-1.26 3.3-1.26.67 1.71.26 2.97.13 3.28.79.86 1.25 1.96 1.25 3.3 0 4.72-2.78 5.74-5.43 6.05.44.38.84 1.1.84 2.22l-.01 3.29c0 .32.22.69.83.58A11.5 11.5 0 0 0 23.4 12.3 11.5 11.5 0 0 0 12 .5z" />
    </svg>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 4.99 2.5 2.5 0 0 0 0-4.99zM3 9h4v12H3zM14.5 9c-2.21 0-3.5 1.2-3.5 3.08V21h-4V9h4v1.76S11.86 9 14.7 9c3.03 0 5.3 1.97 5.3 6.2V21h-4v-5.2c0-2.4-.86-3.8-2.7-3.8z" />
    </svg>
  );
}
