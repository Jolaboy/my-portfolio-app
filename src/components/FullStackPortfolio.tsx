'use client';

import { useState } from 'react';
import { 
  Server, 
  Boxes, 
  Terminal, 
  Cloud, 
  Code, 
  Mail, 
  X, 
  Loader2 
} from 'lucide-react';

// Custom inline brand SVG components to bypass lucide brand logo deprecation
const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

type TabType = 'ai' | 'gitops' | 'analytics' | 'edge';

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactStatus = null | { loading?: boolean; ok?: boolean; error?: string };

type ContactFormProps = {
  apiUrl?: string;
};

export default function FullStackPortfolio({ apiUrl }: ContactFormProps) {
  const [activeTab, setActiveTab] = useState<TabType>('ai');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [form, setForm] = useState<ContactFormData>({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<ContactStatus>(null);

  const base = apiUrl ?? process.env.NEXT_PUBLIC_API_URL ?? '';
  const endpoint = base ? `${base.replace(/\/$/, '')}/api/contact` : '/api/contact';

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ loading: true });

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const parsed = await res
        .clone()
        .json()
        .then((json) => ({ kind: 'json' as const, json }))
        .catch(async () => ({ kind: 'text' as const, text: await res.text().catch(() => '') }));

      if (!res.ok) {
        const maybeError =
          parsed.kind === 'json' && parsed.json && typeof parsed.json === 'object'
            ? (parsed.json as { error?: string }).error
            : undefined;

        const maybeDetails =
          parsed.kind === 'json' && parsed.json && typeof parsed.json === 'object'
            ? (parsed.json as { details?: string }).details
            : parsed.kind === 'text'
              ? parsed.text
              : undefined;

        const details = typeof maybeDetails === 'string' ? maybeDetails.trim().slice(0, 200) : '';
        throw new Error(`${maybeError || `HTTP_${res.status}`}${details ? `: ${details}` : ''}`);
      }

      setStatus({ ok: true });
      setForm({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => {
        setIsContactOpen(false);
        setStatus(null);
      }, 2500);

    } catch (err) {
      setStatus({ ok: false, error: err instanceof Error ? err.message : String(err) });
    }
  };

  const blueprints = {
    ai: {
      title: "Multi-Agent AI Orchestration Engine Infrastructure (LLMOps)",
      desc: "Secured, microsegmented environment hosting multi-agent AI logic engines executing on AWS ECS Fargate, restricting access channels directly to Amazon Bedrock models via L7 AWS VPC Lattice boundaries.",
      tags: ["AWS Bedrock", "VPC Lattice", "ECS Fargate", "Terraform"],
      metricTitle: "Security Guardrails",
      metrics: ["• Auth Type: AWS_IAM", "• Target: Claude 3.5 Sonnet", "• Injections Blocked: Native"],
      url: "https://github.com/Jolaboy/-edge-global-gateway"
    },
    gitops: {
      title: "Zero-Trust Multi-Cluster GitOps Platform Engine",
      desc: "Continuous reconciliation loop managing complex Kubernetes infrastructure deployments automatically through ArgoCD synchronization models combined with Crossplane cloud provisioning.",
      tags: ["Amazon EKS v1.31", "ArgoCD", "Crossplane", "Kyverno"],
      metricTitle: "Platform Metrics",
      metrics: ["• Topology: App-of-Apps", "• Infrastructure: Declarative", "• State Drift Sync: Automatic"],
      url: "https://github.com/Jolaboy/gitops-platform-engine"
    },
    analytics: {
      title: "Serverless Real-Time Data Streaming & Analytics Ledger",
      desc: "Infinite-scale streaming data architecture capturing event matrices via AWS Kinesis Streams, routing processing routines through Python 3.12 Lambda, and saving payloads into structured Apache Iceberg tables.",
      tags: ["AWS Kinesis", "AWS Lambda 3.12", "Apache Iceberg", "AWS SAM"],
      metricTitle: "Data Operations",
      metrics: ["• Type: Storage Optimization", "• Engine: Amazon Athena v3", "• Format: Compacted Parquet"],
      url: "https://github.com/Jolaboy/serverless-analytics-ledger"
    },
    edge: {
      title: "Edge-Optimized Multi-Region Global API Gateway",
      desc: "Sub-10ms entry layer deploying lightweight edge computing workers (V8 Engine) paired with horizontally replicated, active-active cross-region Amazon DynamoDB storage nodes.",
      tags: ["Cloudflare Workers", "V8 Isolation Engine", "DynamoDB Global Tables", "TypeScript"],
      metricTitle: "Performance Metrics",
      metrics: ["• Ingress Latency: <10ms", "• Topology: Active-Active", "• Sync Layer: Dynamo Streams"],
      url: "https://github.com/Jolaboy/-edge-global-gateway"
    }
  };

  return (
    <div className="bg-[#0f172a] text-slate-100 min-h-screen flex flex-col selection:bg-sky-500/30">
      
      {/* Top Navigation Bar */}
      <nav className="border-b border-slate-800 bg-[#1e293b]/50 backdrop-blur sticky top-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Server className="text-sky-400 w-6 h-6 animate-pulse" />
            <span className="font-mono font-bold text-lg tracking-wider text-white">CLOUD_ARCHITECT_CORE</span>
          </div>
          <div className="flex items-center space-x-6 text-sm font-medium text-slate-400">
            <a href="#metrics" className="hover:text-sky-400 transition hidden sm:inline">Metrics</a>
            <a href="#projects" className="hover:text-sky-400 transition hidden sm:inline">Production Blueprints</a>
            <button 
              onClick={() => setIsContactOpen(!isContactOpen)} 
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition ${
                isContactOpen 
                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' 
                  : 'border-slate-700 text-slate-300 hover:border-slate-500 bg-[#1e293b]/30'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Contact Console</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Dropdown Form Drawer */}
      <div 
        className={`border-b border-slate-800 bg-[#1e293b]/40 backdrop-blur-md overflow-hidden transition-all duration-300 ease-in-out ${
          isContactOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-3xl mx-auto px-6 py-8 relative">
          <button 
            onClick={() => setIsContactOpen(false)} 
            className="absolute top-6 right-6 text-slate-500 hover:text-white transition"
            aria-label="Close form drawer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="mb-6">
            <h4 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Terminal className="w-4 h-4 text-sky-400" /> secure_mailer_daemon.sh
            </h4>
            <p className="text-xs text-slate-400 mt-1">Submit parameters to dispatch a message payload straight to my communications endpoint.</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Sender Name</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g. Alex Cloudman"
                  className="w-full rounded-lg border border-slate-800 bg-[#0f172a]/70 p-2.5 text-slate-100 placeholder:text-slate-600 outline-none focus:border-sky-400 transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Return Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleFormChange}
                  required
                  placeholder="name@enterprise.com"
                  className="w-full rounded-lg border border-slate-800 bg-[#0f172a]/70 p-2.5 text-slate-100 placeholder:text-slate-600 outline-none focus:border-sky-400 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Subject Metric</label>
              <input
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleFormChange}
                placeholder="Infrastructure Request Alignment"
                className="w-full rounded-lg border border-slate-800 bg-[#0f172a]/70 p-2.5 text-slate-100 placeholder:text-slate-600 outline-none focus:border-sky-400 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Message Body</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleFormChange}
                required
                rows={4}
                placeholder="Write infrastructure deployment details here..."
                className="w-full rounded-lg border border-slate-800 bg-[#0f172a]/70 p-2.5 text-slate-100 placeholder:text-slate-600 outline-none focus:border-sky-400 transition resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button 
                type="submit" 
                disabled={status?.loading}
                className="bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 text-[#0f172a] disabled:text-slate-500 font-bold px-5 py-2.5 rounded-lg transition flex items-center space-x-2"
              >
                {status?.loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{status?.loading ? 'Dispatching Payload...' : 'Execute Send'}</span>
              </button>

              {status?.ok && (
                <div className="text-emerald-400 font-mono text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Payload transmitted successfully.
                </div>
              )}
              {status && status.ok === false && (
                <div className="text-rose-400 font-mono text-xs max-w-[70%] text-right truncate">
                  Error: {status.error}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Hero Header Body */}
      <header className="max-w-6xl w-full mx-auto px-6 pt-12 pb-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-2 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-sky-400 inline-block"></span>
            <span>Available for Opportunities</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Hi, I&apos;m a <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">Cloud & DevOps Platform Engineer</span>
          </h1>
          <p className="text-slate-400 max-w-xl leading-relaxed text-sm">
            Specializing in zero-trust multi-cluster operations, serverless real-time data streaming architectures, and multi-agent AI framework deployment boundaries. 
          </p>
        </div>
        
        <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-4 shadow-2xl font-mono text-xs text-slate-300 relative overflow-hidden">
          <div className="flex space-x-2 mb-3 border-b border-slate-800 pb-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-slate-500 ml-2">session::bash</span>
          </div>
          <p className="text-emerald-400">$ curl -s https://api.portfolio.dev/status</p>
          <p className="text-slate-400 mt-1">{"{"}</p>
          <p className="pl-4 text-slate-400">&quot;status&quot;: <span className="text-amber-300">&quot;RECONCILED&quot;</span>,</p>
          <p className="pl-4 text-slate-400">&quot;iac_tools&quot;: [<span className="text-sky-300">&quot;Terraform&quot;, &quot;CDK&quot;</span>],</p>
          <p className="pl-4 text-slate-400">&quot;kubernetes&quot;: <span className="text-sky-300">&quot;ArgoCD/Crossplane&quot;</span></p>
          <p className="text-slate-400">{"}"}</p>
        </div>
      </header>

      {/* Metrics Grid */}
      <section id="metrics" className="max-w-6xl w-full mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { val: "4", lbl: "Production Blueprints" },
          { val: "< 10ms", lbl: "Edge Target Latency", color: "text-emerald-400" },
          { val: "100%", lbl: "Declarative GitOps Loop", color: "text-sky-400" },
          { val: "Zero", lbl: "Trust Blast Radius", color: "text-purple-400" }
        ].map((m, idx) => (
          <div key={idx} className="bg-[#1e293b]/30 border border-slate-800/80 p-5 rounded-xl text-center">
            <div className={`text-3xl font-extrabold ${m.color || 'text-white'}`}>{m.val}</div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">{m.lbl}</div>
          </div>
        ))}
      </section>

      {/* Blueprints Grid Tabs */}
      <main id="projects" className="max-w-6xl w-full mx-auto px-6 py-12 flex-grow">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
          <Boxes className="text-sky-400 w-6 h-6" />
          <span>Evaluated Cloud Architectures</span>
        </h2>

        <div className="flex flex-wrap border-b border-slate-800 gap-2 mb-8">
          {(Object.keys(blueprints) as TabType[]).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition duration-200 capitalize ${
                activeTab === tabKey
                  ? 'border-sky-400 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tabKey === 'ai' ? 'AI Agent Infrastructure' : tabKey === 'gitops' ? 'Zero-Trust GitOps' : tabKey === 'analytics' ? 'Serverless Iceberg' : 'Edge Global Gateway'}
            </button>
          ))}
        </div>

        <div className="bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-white">{blueprints[activeTab].title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{blueprints[activeTab].desc}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {blueprints[activeTab].tags.map((t, i) => (
                <span key={i} className="bg-slate-800 text-slate-300 text-xs font-mono px-2.5 py-1 rounded">{t}</span>
              ))}
            </div>
          </div>
          
          <div className="bg-[#0f172a]/60 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
            <div className="text-xs text-slate-400 font-mono space-y-1">
              <div className="text-sky-400 font-bold uppercase mb-2">{blueprints[activeTab].metricTitle}</div>
              {blueprints[activeTab].metrics.map((m, i) => <div key={i}>{m}</div>)}
            </div>
            <a
              href={blueprints[activeTab].url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center justify-center bg-[#1e293b] hover:bg-slate-700 text-white font-medium text-xs py-2 px-4 rounded-lg border border-slate-700 transition space-x-2"
            >
              <GithubIcon className="w-4 h-4" />
              <span>View Repository</span>
            </a>
          </div>
        </div>
      </main>

      {/* Technical Skill Matrix */}
      <section id="skills" className="bg-[#1e293b]/20 border-t border-slate-800 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Core Technical Infrastructure Matrix</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="p-5 bg-[#1e293b] rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-white text-sm flex items-center"><Cloud className="text-sky-400 w-4 h-4 mr-2" /> Cloud Administration</div>
              <p className="text-xs text-slate-400">VPC Topology, IAM Policies, EC2 Fleet Isolation, RDS Multi-AZ Tuning, AWS CloudWatch Analytics Logs.</p>
            </div>
            <div className="p-5 bg-[#1e293b] rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-white text-sm flex items-center"><Code className="text-emerald-400 w-4 h-4 mr-2" /> Infrastructure as Code</div>
              <p className="text-xs text-slate-400">Declarative Multi-Account HCL Terraform Enterprise State Backend Locking, AWS CDK Scripting Templates.</p>
            </div>
            <div className="p-5 bg-[#1e293b] rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-white text-sm flex items-center"><Terminal className="text-amber-400 w-4 h-4 mr-2" /> System Automation</div>
              <p className="text-xs text-slate-400">High-yield Python Boto3 API pagination processing handlers, Linux administrative utility shell workflows (Bash).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Element Matrix */}
      <footer className="border-t border-slate-800 bg-[#0f172a] px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 Enterprise Cloud Operations Portfolio. Live Production Cluster Mode.
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/Jolaboy" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 bg-[#1e293b]/40 hover:bg-[#1e293b] rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition flex items-center space-x-1.5"
              title="External GitHub Platform Hook"
            >
              <GithubIcon className="w-4 h-4" />
              <span className="font-mono">GitHub</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/amadou-jarju/" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 bg-[#1e293b]/40 hover:bg-[#1e293b] rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-sky-400 transition flex items-center space-x-1.5"
              title="External LinkedIn Protocol Anchor"
            >
              <LinkedinIcon className="w-4 h-4" />
              <span className="font-mono">LinkedIn</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}