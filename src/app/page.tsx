'use client';

import { useState } from 'react';
import { Layers, FileText, Search, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { AuthBanner } from '@/components/auth/AuthBanner';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { DraftingModule } from '@/components/drafting/DraftingModule';
import { SearchModule } from '@/components/search/SearchModule';
import { Section2Module } from '@/components/section2/Section2Module';

export default function Home() {
  const { user, authLoading, handleQuickLogin, handleLogout } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'drafting' | 'search' | 'section2'>('dashboard');

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
      <Header user={user} onQuickLogin={handleQuickLogin} onLogout={handleLogout} />

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

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {!user && <AuthBanner onQuickLogin={handleQuickLogin} />}

        {activeTab === 'dashboard' && <Dashboard onNavigate={tab => setActiveTab(tab)} />}
        {activeTab === 'drafting' && <DraftingModule user={user} onQuickLogin={handleQuickLogin} />}
        {activeTab === 'search' && <SearchModule user={user} onQuickLogin={handleQuickLogin} />}
        {activeTab === 'section2' && <Section2Module />}
      </main>

      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500 bg-slate-950/40">
        <p>&copy; 2026 Lawxygen Technical Hiring Assignment — Full-Stack Developer Submission.</p>
      </footer>
    </div>
  );
}
