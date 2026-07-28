import React from 'react';
import { Zap, RefreshCw, Play, BookOpen, AlertCircle } from 'lucide-react';
import { useStream } from '@/hooks/useStream';

export const Section2Module: React.FC = () => {
  const {
    sec2Query,
    setSec2Query,
    sec2StreamText,
    sec2SourcesJson,
    isStreamingSec2,
    streamError,
    handleTestSection2Stream,
  } = useStream();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Zap className="h-6 w-6 text-amber-400" />
          <span>Section 2 — Streaming RAG Endpoint Benchmarking</span>
        </h2>
        <p className="text-xs text-slate-400">
          Tests the standalone FastAPI endpoint (<code>POST /research/query</code>) yielding token-by-token SSE streaming, inline citations <code>[doc_01]</code>, and zero-result fallback.
        </p>
      </div>

      {streamError && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-400" />
          <span>{streamError}</span>
        </div>
      )}

      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="space-y-2">
          <label htmlFor="sec2-query-input" className="block text-xs font-semibold text-slate-300">Natural-Language Query for Section 2 Endpoint</label>
          <div className="flex gap-2">
            <input
              id="sec2-query-input"
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
            onClick={() => setSec2Query("What is the punishment for cheque bounce under Section 138 NI Act?")}
            className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[11px] hover:bg-slate-700"
          >
            Valid Sec 138 Query
          </button>
          <button
            onClick={() => setSec2Query("xyz random unrelated sentence 12345")}
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
  );
};
