import React from 'react';
import { Sparkles, FileText, Search, ArrowRight } from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: 'drafting' | 'search') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/30 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Engineered for Indian Legal Practitioners</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Co-Counsel Platform for <span className="emerald-gradient-text">Drafting & Legal Research</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Automate complex legal drafting (NDAs, Demand Notices) and perform grounded RAG statutory search across Indian Bare Acts, IPC/BNS sections, and landmark Supreme Court judgments.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('drafting')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 transition-all"
            >
              <FileText className="h-4 w-4" />
              <span>Launch Legal Drafter</span>
            </button>
            <button
              onClick={() => onNavigate('search')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition-all"
            >
              <Search className="h-4 w-4" />
              <span>Search Statutory Corpus</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Indexed Legal Statutes', val: '8 Core Sources', desc: 'NI Act, IPC, IT Act, Contract Act, SC Cases', color: 'border-emerald-500/30' },
          { label: 'Document Templates', val: 'NDA & Demand Notice', desc: 'Customizable parameters & export to PDF', color: 'border-amber-500/30' },
          { label: 'Section 2 RAG Server', val: 'Token Streaming', desc: 'FastAPI SSE with inline citations [doc_01]', color: 'border-cyan-500/30' },
          { label: 'Session Security', val: 'JWT + Bcrypt', desc: 'Secure advocate profile session handling', color: 'border-indigo-500/30' },
        ].map((m, idx) => (
          <div key={idx} className={`p-5 rounded-xl glass-card border ${m.color} space-y-2`}>
            <div className="text-xs text-slate-400 font-medium">{m.label}</div>
            <div className="text-lg font-extrabold text-white">{m.val}</div>
            <div className="text-xs text-slate-400">{m.desc}</div>
          </div>
        ))}
      </div>

      {/* Feature Benchmark Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-200 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-emerald-400" />
              <span>Legal Drafting Suite (DraftBot Benchmark)</span>
            </h3>
            <span className="text-xs text-emerald-400 font-mono">Form &rarr; Gen &rarr; PDF</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Select between Mutual Non-Disclosure Agreements (NDA) or Legal Demand Notices. Input parties, jurisdiction, tone, and confidential scope to generate court-ready legal drafts.
          </p>
          <div className="pt-2 flex justify-end">
            <button 
              onClick={() => onNavigate('drafting')}
              className="text-xs font-semibold text-emerald-400 hover:underline flex items-center space-x-1"
            >
              <span>Start Drafting</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="p-6 rounded-xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-200 flex items-center space-x-2">
              <Search className="h-5 w-5 text-cyan-400" />
              <span>Grounded Legal RAG & Citations</span>
            </h3>
            <span className="text-xs text-cyan-400 font-mono">Keyword + Scoring</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real-time statutory search indexing Indian Kanoon and Supreme Court precedents. Returns exact section snippets with relevance scoring and cited AI summary synthesis.
          </p>
          <div className="pt-2 flex justify-end">
            <button 
              onClick={() => onNavigate('search')}
              className="text-xs font-semibold text-cyan-400 hover:underline flex items-center space-x-1"
            >
              <span>Explore Corpus</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
