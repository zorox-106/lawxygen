import React from 'react';
import { FileText, Copy, Check, Download } from 'lucide-react';

interface DraftPreviewProps {
  docType: 'NDA' | 'LEGAL_NOTICE';
  generatedDraft: string;
  copiedDraft: boolean;
  onTextChange: (text: string) => void;
  onCopy: () => void;
  onExportPDF: () => void;
}

export const DraftPreview: React.FC<DraftPreviewProps> = ({
  docType,
  generatedDraft,
  copiedDraft,
  onTextChange,
  onCopy,
  onExportPDF,
}) => {
  return (
    <div className="lg:col-span-7 p-6 rounded-2xl glass-card border border-slate-800 flex flex-col space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
          <FileText className="h-4 w-4 text-emerald-400" />
          <span>Draft Output Preview</span>
        </h3>
        
        {generatedDraft && (
          <div className="flex items-center space-x-2">
            <button
              onClick={onCopy}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
            >
              {copiedDraft ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedDraft ? 'Copied!' : 'Copy Text'}</span>
            </button>
            <button
              onClick={onExportPDF}
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
          aria-label="Editable legal draft preview"
          value={generatedDraft}
          onChange={e => onTextChange(e.target.value)}
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
  );
};
