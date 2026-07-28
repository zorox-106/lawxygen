import React from 'react';
import { FileText, Sliders, RefreshCw, Sparkles, AlertCircle, CheckCircle, RotateCcw, Cpu } from 'lucide-react';
import { NdaForm } from './NdaForm';
import { NoticeForm } from './NoticeForm';
import { DraftPreview } from './DraftPreview';
import { useDraft } from '@/hooks/useDraft';
import { User } from '@/hooks/useAuth';

interface DraftingModuleProps {
  user: User | null;
  onQuickLogin: () => void;
}

export const DraftingModule: React.FC<DraftingModuleProps> = ({ user, onQuickLogin }) => {
  const {
    docType,
    setDocType,
    ndaForm,
    setNdaForm,
    noticeForm,
    setNoticeForm,
    isDrafting,
    generatedDraft,
    setGeneratedDraft,
    copiedDraft,
    draftError,
    metadata,
    toastMessage,
    handleGenerateDraft,
    handleExportPDF,
    handleCopyDraft,
  } = useDraft();

  const handleGenerate = () => {
    if (!user) {
      onQuickLogin();
      return;
    }
    handleGenerateDraft();
  };

  return (
    <div className="space-y-6 relative">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <FileText className="h-6 w-6 text-emerald-400" />
              <span>Legal Document Drafting Suite</span>
            </h2>
            {metadata && (
              <span className={`inline-flex items-center space-x-1 text-[10px] px-2.5 py-1 rounded-full font-mono font-semibold border ${
                metadata.provider === 'openai' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                <Cpu className="h-3 w-3" />
                <span>
                  {metadata.provider === 'openai' ? `OpenAI (${metadata.model})` : `Template Engine (${metadata.model})`}
                </span>
                <span className="text-[9px] opacity-75">
                  &bull; {metadata.grounded ? 'Grounded' : 'Unbounded'}
                </span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">Generate structured, court-ready legal drafts with OpenAI models and custom parameters.</p>
        </div>

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

      {draftError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-400" />
            <span>{draftError}</span>
          </div>
          <button
            onClick={handleGenerate}
            className="flex items-center space-x-1 px-3 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 transition-all text-xs font-semibold"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Retry</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
            <Sliders className="h-4 w-4 text-emerald-400" />
            <span>{docType === 'NDA' ? 'NDA Parameters' : 'Legal Notice Parameters'}</span>
          </h3>

          {docType === 'NDA' ? (
            <NdaForm form={ndaForm} onChange={setNdaForm} />
          ) : (
            <NoticeForm form={noticeForm} onChange={setNoticeForm} />
          )}

          <button
            onClick={handleGenerate}
            disabled={isDrafting}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-500 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {isDrafting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Synthesizing Legal Terms via AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate {docType === 'NDA' ? 'NDA Draft' : 'Legal Notice'}</span>
              </>
            )}
          </button>
        </div>

        <DraftPreview
          docType={docType}
          generatedDraft={generatedDraft}
          copiedDraft={copiedDraft}
          onTextChange={setGeneratedDraft}
          onCopy={handleCopyDraft}
          onExportPDF={handleExportPDF}
        />
      </div>
    </div>
  );
};
