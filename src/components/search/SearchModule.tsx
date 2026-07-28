import React from 'react';
import { Search, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { User } from '@/hooks/useAuth';

interface SearchModuleProps {
  user: User | null;
  onQuickLogin: () => void;
}

export const SearchModule: React.FC<SearchModuleProps> = ({ user, onQuickLogin }) => {
  const {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    isSearching,
    searchResults,
    citedSummary,
    searchError,
    handleSearch,
  } = useSearch();

  const onExecuteSearch = (queryOverride?: string) => {
    if (!user) {
      onQuickLogin();
      return;
    }
    handleSearch(queryOverride);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Search className="h-6 w-6 text-cyan-400" />
          <span>Statutory RAG Search Engine</span>
        </h2>
        <p className="text-xs text-slate-400">Search 8 indexed Indian Bare Acts, Penal Codes, and landmark Supreme Court precedents.</p>
      </div>

      {searchError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-400" />
          <span>{searchError}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
            <input
              id="statutory-search-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onExecuteSearch()}
              placeholder="Search query e.g. 'cheque bounce 138', 'IPC 420 fraud', 'Article 21 privacy'..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <select
            aria-label="Filter legal documents by category"
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
            onClick={() => onExecuteSearch()}
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
              onClick={() => { setSearchQuery(pill); onExecuteSearch(pill); }}
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

      {/* Results Grid with stable keys */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {searchResults.map(item => (
          <div key={item.doc.id} className="p-5 rounded-xl glass-card glass-card-hover border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {item.doc.category}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  Score: {item.score}
                </span>
              </div>
              <h3 className="font-bold text-slate-100 text-sm leading-snug">{item.doc.title}</h3>
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
  );
};
