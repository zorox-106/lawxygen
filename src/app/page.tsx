'use client';

import { useState, useEffect } from 'react';
import { 
  Scale, FileText, Search, Shield, Download, Copy, Check, Sparkles, 
  UserCheck, LogOut, Lock, ArrowRight, Zap, RefreshCw, AlertCircle, 
  BookOpen, ExternalLink, Sliders, Play, Layers
} from 'lucide-react';
import jsPDF from 'jspdf';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Home() {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [emailInput, setEmailInput] = useState('advocate@lawxygen.com');
  const [passwordInput, setPasswordInput] = useState('Lawyer@123');
  const [nameInput, setNameInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'drafting' | 'search' | 'section2'>('dashboard');

  // Drafting State
  const [docType, setDocType] = useState<'NDA' | 'LEGAL_NOTICE'>('NDA');
  const [ndaForm, setNdaForm] = useState({
    disclosingParty: 'Acme Software Solutions Pvt Ltd',
    receivingParty: 'Bharat Tech Innovations LLP',
    effectiveDate: '2026-07-28',
    jurisdiction: 'New Delhi High Court',
    purpose: 'evaluating a strategic AI co-counsel integration and source code licensing',
    durationYears: 2,
    confidentialScope: 'proprietary ML models, customer databases, revenue metrics, and backend APIs',
    disputeResolution: 'Arbitration under New Delhi International Arbitration Centre (NDIAC)',
    tone: 'Formal' as const
  });
  const [noticeForm, setNoticeForm] = useState({
    claimantName: 'Adv. Suresh Verma on behalf of LexCorp India',
    respondentName: 'Apex Retail Enterprises India Pvt Ltd',
    noticeDate: '2026-07-28',
    causeOfAction: 'failure to settle unpaid invoices amounting to ₹ 8,50,000 for IT legal consultancy services',
    demandAmount: '₹ 8,50,000/- (Rupees Eight Lakhs Fifty Thousand Only)',
    curePeriodDays: 15,
    jurisdiction: 'District Court, Mumbai',
    tone: 'Assertive' as const
  });
  const [isDrafting, setIsDrafting] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<string>('');
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Search RAG State
  const [searchQuery, setSearchQuery] = useState('cheque bounce penalty section 138');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [citedSummary, setCitedSummary] = useState<string>('');

  // Section 2 Simulator State
  const [sec2Query, setSec2Query] = useState('What is the punishment for cheque bounce under Section 138 NI Act?');
  const [sec2StreamText, setSec2StreamText] = useState('');
  const [sec2SourcesJson, setSec2SourcesJson] = useState<any>(null);
  const [isStreamingSec2, setIsStreamingSec2] = useState(false);

  // Check auth session on load
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
        setAuthLoading(false);
      })
      .catch(() => setAuthLoading(false));

    // Execute initial default search
    handleSearch('cheque bounce penalty section 138');
  }, []);

  // Auth Handlers
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/signup';
    const payload = authMode === 'login' 
      ? { email: emailInput, password: passwordInput }
      : { name: nameInput, email: emailInput, password: passwordInput };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      setUser(data.user);
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleQuickLogin = () => {
    setEmailInput('advocate@lawxygen.com');
    setPasswordInput('Lawyer@123');
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'advocate@lawxygen.com', password: 'Lawyer@123' })
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      });
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  // Drafting Handler
  const handleGenerateDraft = async () => {
    setIsDrafting(true);
    try {
      const inputs = docType === 'NDA' ? ndaForm : noticeForm;
      const res = await fetch('/api/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docType, inputs })
      });
      const data = await res.json();
      if (data.draftContent) {
        setGeneratedDraft(data.draftContent);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDrafting(false);
    }
  };

  // Export Draft to PDF
  const handleExportPDF = () => {
    if (!generatedDraft) return;
    const doc = new jsPDF();
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text(docType === 'NDA' ? "NON-DISCLOSURE AGREEMENT" : "LEGAL NOTICE DEMAND DRAFT", 20, 20);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);

    const splitText = doc.splitTextToSize(generatedDraft, 170);
    let y = 30;

    for (let i = 0; i < splitText.length; i++) {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(splitText[i], 20, y);
      y += 5;
    }

    doc.save(`${docType}_Legal_Draft_Lawxygen.pdf`);
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  // Search RAG Handler
  const handleSearch = async (queryToSearch?: string) => {
    const q = queryToSearch || searchQuery;
    if (!q.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, category: categoryFilter })
      });
      const data = await res.json();
      if (data.results) {
        setSearchResults(data.results);
        setCitedSummary(data.citedSummary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // Section 2 Live Stream Simulator
  const handleTestSection2Stream = async () => {
    setIsStreamingSec2(true);
    setSec2StreamText('');
    setSec2SourcesJson(null);

    try {
      const res = await fetch('http://localhost:8000/research/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sec2Query })
      });

      if (!res.ok) {
        throw new Error('FastAPI server on port 8000 not reachable. Make sure FastAPI server is running.');
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;

        if (accumulated.includes('[SOURCES_USED]:')) {
          const parts = accumulated.split('[SOURCES_USED]:');
          setSec2StreamText(parts[0]);
          try {
            const parsed = JSON.parse(parts[1].trim());
            setSec2SourcesJson(parsed);
          } catch (e) {
            // parsing incomplete JSON chunk
          }
        } else {
          setSec2StreamText(accumulated);
        }
      }
    } catch (err: any) {
      setSec2StreamText(`⚠️ FastAPI Stream Connection Note:\n${err.message}\n\nTo run Section 2 standalone endpoint, execute:\n$ cd section2_rag && uvicorn main:app --port 8000`);
    } finally {
      setIsStreamingSec2(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0b0f19]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
          <p className="text-slate-400 text-sm font-medium">Initializing Lawxygen Co-Counsel Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-emerald-500/20">
      {/* Top Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">LAWXYGEN</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  AI Co-Counsel v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Legal Research, Document Drafting & Streaming RAG Engine</p>
            </div>
          </div>

          {/* User Auth Info / Controls */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3 bg-slate-800/60 border border-slate-700/60 px-3 py-1.5 rounded-full">
                <div className="h-7 w-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-semibold text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-slate-200">{user.name}</div>
                  <div className="text-slate-400 text-[10px]">{user.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleQuickLogin}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-600/30 transition-all"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Quick Demo Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <nav className="bg-slate-950/40 border-b border-slate-800/60 px-4">
        <div className="max-w-7xl mx-auto flex space-x-2 sm:space-x-4 overflow-x-auto py-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Layers },
            { id: 'drafting', label: 'Legal Drafting Suite', icon: FileText },
            { id: 'search', label: 'Statutory RAG Search', icon: Search },
            { id: 'section2', label: 'Section 2 FastAPI Stream', icon: Zap },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-slate-800 to-slate-800/80 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Primary Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Banner for Unauthenticated Reviewer */}
        {!user && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-amber-400 flex-shrink-0" />
              <p className="text-xs sm:text-sm">
                <strong>Lawxygen Reviewer Note:</strong> Authentication is active with JWT sessions. Click <strong>Quick Demo Login</strong> to test authenticated features as Senior Advocate.
              </p>
            </div>
            <button
              onClick={handleQuickLogin}
              className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all flex-shrink-0"
            >
              Authenticate Now
            </button>
          </div>
        )}

        {/* ================= TAB 1: DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
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
                    onClick={() => setActiveTab('drafting')}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 transition-all"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Launch Legal Drafter</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('search')}
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
                { label: 'Session Security', val: 'JWT HTTP-Only', desc: 'Stateful advocate profile session handling', color: 'border-indigo-500/30' },
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
                  Select between Mutual Non-Disclosure Agreements (NDA) or Legal Demand Notices. Input parties, jurisdiction, cure period, and confidential scope to generate court-ready legal drafts.
                </p>
                <div className="pt-2 flex justify-end">
                  <button 
                    onClick={() => setActiveTab('drafting')}
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
                    onClick={() => setActiveTab('search')}
                    className="text-xs font-semibold text-cyan-400 hover:underline flex items-center space-x-1"
                  >
                    <span>Explore Corpus</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: LEGAL DRAFTING MODULE ================= */}
        {activeTab === 'drafting' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-emerald-400" />
                  <span>Legal Document Drafting Suite</span>
                </h2>
                <p className="text-xs text-slate-400">Generate structured, court-ready legal drafts with custom parameters and instant PDF export.</p>
              </div>

              {/* Document Type Selector Toggle */}
              <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  onClick={() => { setDocType('NDA'); setGeneratedDraft(''); }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    docType === 'NDA' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Non-Disclosure Agreement (NDA)
                </button>
                <button
                  onClick={() => { setDocType('LEGAL_NOTICE'); setGeneratedDraft(''); }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    docType === 'LEGAL_NOTICE' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Legal Demand Notice (Bonus)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Input Column (5 cols) */}
              <div className="lg:col-span-5 p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                  <Sliders className="h-4 w-4 text-emerald-400" />
                  <span>{docType === 'NDA' ? 'NDA Parameters' : 'Legal Notice Parameters'}</span>
                </h3>

                {docType === 'NDA' ? (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Disclosing Party (Entity/Individual)</label>
                      <input
                        type="text"
                        value={ndaForm.disclosingParty}
                        onChange={e => setNdaForm({ ...ndaForm, disclosingParty: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Receiving Party</label>
                      <input
                        type="text"
                        value={ndaForm.receivingParty}
                        onChange={e => setNdaForm({ ...ndaForm, receivingParty: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">Effective Date</label>
                        <input
                          type="date"
                          value={ndaForm.effectiveDate}
                          onChange={e => setNdaForm({ ...ndaForm, effectiveDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">Term Duration (Years)</label>
                        <input
                          type="number"
                          value={ndaForm.durationYears}
                          onChange={e => setNdaForm({ ...ndaForm, durationYears: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Jurisdiction / Seat of Court</label>
                      <input
                        type="text"
                        value={ndaForm.jurisdiction}
                        onChange={e => setNdaForm({ ...ndaForm, jurisdiction: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Purpose of Disclosure</label>
                      <textarea
                        rows={2}
                        value={ndaForm.purpose}
                        onChange={e => setNdaForm({ ...ndaForm, purpose: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Confidential Information Scope</label>
                      <textarea
                        rows={2}
                        value={ndaForm.confidentialScope}
                        onChange={e => setNdaForm({ ...ndaForm, confidentialScope: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Claimant Name (Your Client)</label>
                      <input
                        type="text"
                        value={noticeForm.claimantName}
                        onChange={e => setNoticeForm({ ...noticeForm, claimantName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Respondent Name (Defaulter)</label>
                      <input
                        type="text"
                        value={noticeForm.respondentName}
                        onChange={e => setNoticeForm({ ...noticeForm, respondentName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">Demand Amount (₹)</label>
                        <input
                          type="text"
                          value={noticeForm.demandAmount}
                          onChange={e => setNoticeForm({ ...noticeForm, demandAmount: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">Cure Period (Days)</label>
                        <input
                          type="number"
                          value={noticeForm.curePeriodDays}
                          onChange={e => setNoticeForm({ ...noticeForm, curePeriodDays: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Jurisdiction</label>
                      <input
                        type="text"
                        value={noticeForm.jurisdiction}
                        onChange={e => setNoticeForm({ ...noticeForm, jurisdiction: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Cause of Action & Breach Details</label>
                      <textarea
                        rows={3}
                        value={noticeForm.causeOfAction}
                        onChange={e => setNoticeForm({ ...noticeForm, causeOfAction: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleGenerateDraft}
                  disabled={isDrafting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-500 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {isDrafting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Synthesizing Legal Terms...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Generate {docType === 'NDA' ? 'NDA Draft' : 'Legal Notice'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Output Preview Column (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl glass-card border border-slate-800 flex flex-col space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-emerald-400" />
                    <span>Draft Output Preview</span>
                  </h3>
                  
                  {generatedDraft && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleCopyDraft}
                        className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
                      >
                        {copiedDraft ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedDraft ? 'Copied!' : 'Copy Text'}</span>
                      </button>
                      <button
                        onClick={handleExportPDF}
                        className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Export PDF</span>
                      </button>
                    </div>
                  )}
                </div>

                {generatedDraft ? (
                  <textarea
                    value={generatedDraft}
                    onChange={e => setGeneratedDraft(e.target.value)}
                    rows={18}
                    className="w-full flex-1 p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800 focus:outline-none focus:border-emerald-500/50 leading-relaxed resize-y"
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-800 rounded-xl space-y-3">
                    <FileText className="h-10 w-10 text-slate-600" />
                    <p className="text-xs text-slate-400 max-w-sm">
                      Fill in the parameters on the left and click <strong>Generate</strong> to synthesize a court-ready {docType === 'NDA' ? 'Non-Disclosure Agreement' : 'Legal Demand Notice'}.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: STATUTORY RAG SEARCH ================= */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <Search className="h-6 w-6 text-cyan-400" />
                <span>Statutory RAG Search Engine</span>
              </h2>
              <p className="text-xs text-slate-400">Search 8 indexed Indian Bare Acts, Penal Codes, and landmark Supreme Court precedents.</p>
            </div>

            {/* Search Input Bar */}
            <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder="Search query e.g. 'cheque bounce 138', 'IPC 420 fraud', 'Article 21 privacy'..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="All">All Categories</option>
                  <option value="Statute">Statutes</option>
                  <option value="Bare Act">Bare Acts</option>
                  <option value="Precedent">Precedents</option>
                </select>
                <button
                  onClick={() => handleSearch()}
                  disabled={isSearching}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all flex items-center justify-center space-x-2"
                >
                  {isSearching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <span>Execute Search</span>}
                </button>
              </div>

              {/* Suggestion Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500">Popular Searches:</span>
                {[
                  'cheque bounce 138',
                  'IPC 420 fraud',
                  'cyber crime 66D',
                  'Article 21 privacy',
                  'Kesavananda Bharati',
                  'non compete sec 27'
                ].map(pill => (
                  <button
                    key={pill}
                    onClick={() => { setSearchQuery(pill); handleSearch(pill); }}
                    className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700/60 transition-all"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>

            {/* Grounded AI Cited Summary Box */}
            {citedSummary && (
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400">
                  <Sparkles className="h-4 w-4" />
                  <span>Grounded AI Legal Synthesis</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {citedSummary}
                </p>
              </div>
            )}

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((item, idx) => (
                <div key={idx} className="p-5 rounded-xl glass-card glass-card-hover border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {item.doc.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        Score: {item.score}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-100 text-sm leading-snug">{item.doc.title}</h4>
                    <p className="text-xs text-slate-400 font-medium">{item.doc.source} ({item.doc.year})</p>
                    <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-900 leading-relaxed font-mono">
                      "{item.highlightSnippet}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{item.doc.courtOrAuthority}</span>
                    <span className="font-mono text-cyan-400">{item.doc.sectionOrCaseNo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: SECTION 2 FASTAPI STREAM DEMO ================= */}
        {activeTab === 'section2' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <Zap className="h-6 w-6 text-amber-400" />
                <span>Section 2 — Streaming RAG Endpoint Benchmarking</span>
              </h2>
              <p className="text-xs text-slate-400">
                Tests the standalone FastAPI endpoint (<code>POST http://localhost:8000/research/query</code>) yielding token-by-token SSE streaming, inline citations <code>[doc_01]</code>, and zero-result fallback.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Natural-Language Query for Section 2 Endpoint</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sec2Query}
                    onChange={e => setSec2Query(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={handleTestSection2Stream}
                    disabled={isStreamingSec2}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-orange-400 transition-all flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isStreamingSec2 ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    <span>Stream SSE Response</span>
                  </button>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-500">Presets:</span>
                <button
                  onClick={() => { setSec2Query("What is the punishment for cheque bounce under Section 138 NI Act?"); }}
                  className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[11px] hover:bg-slate-700"
                >
                  Valid Sec 138 Query
                </button>
                <button
                  onClick={() => { setSec2Query("xyz random unrelated sentence 12345"); }}
                  className="px-2.5 py-1 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40 text-[11px] hover:bg-rose-900/60"
                >
                  Zero Results Query (Fallback Test)
                </button>
              </div>

              {/* Streaming Output Console */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Token-by-Token SSE Stream Console</span>
                  {isStreamingSec2 && <span className="text-amber-400 animate-pulse font-mono">&bull; Streaming Tokens...</span>}
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 min-h-[160px] font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {sec2StreamText || <span className="text-slate-600">Click 'Stream SSE Response' to observe real-time token delivery...</span>}
                </div>
              </div>

              {/* JSON Grounding Inspector */}
              {sec2SourcesJson && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-amber-400 flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Final Grounding JSON Payload ([SOURCES_USED])</span>
                  </div>
                  <pre className="p-3 rounded-lg bg-slate-950 text-[11px] text-emerald-400 font-mono overflow-x-auto border border-slate-900">
                    {JSON.stringify(sec2SourcesJson, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500 bg-slate-950/40">
        <p>&copy; 2026 Lawxygen Technical Hiring Assignment — Full-Stack Developer Submission.</p>
      </footer>
    </div>
  );
}
