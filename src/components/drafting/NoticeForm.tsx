import React from 'react';
import { LegalNoticeDraftInput } from '@/lib/drafter';

interface NoticeFormProps {
  form: LegalNoticeDraftInput;
  onChange: (form: LegalNoticeDraftInput) => void;
}

export const NoticeForm: React.FC<NoticeFormProps> = ({ form, onChange }) => {
  return (
    <div className="space-y-3 text-xs">
      <div>
        <label htmlFor="notice-claimant" className="block text-slate-400 font-medium mb-1">Claimant Name (Your Client)</label>
        <input
          id="notice-claimant"
          type="text"
          value={form.claimantName}
          onChange={e => onChange({ ...form, claimantName: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
        />
      </div>
      <div>
        <label htmlFor="notice-respondent" className="block text-slate-400 font-medium mb-1">Respondent Name (Defaulter)</label>
        <input
          id="notice-respondent"
          type="text"
          value={form.respondentName}
          onChange={e => onChange({ ...form, respondentName: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="notice-amount" className="block text-slate-400 font-medium mb-1">Demand Amount (₹)</label>
          <input
            id="notice-amount"
            type="text"
            value={form.demandAmount}
            onChange={e => onChange({ ...form, demandAmount: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="notice-cure" className="block text-slate-400 font-medium mb-1">Cure Period (Days)</label>
          <input
            id="notice-cure"
            type="number"
            value={form.curePeriodDays}
            onChange={e => onChange({ ...form, curePeriodDays: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>
      <div>
        <label htmlFor="notice-tone" className="block text-slate-400 font-medium mb-1">Legal Tone Pressure</label>
        <select
          id="notice-tone"
          value={form.tone || 'Assertive'}
          onChange={e => onChange({ ...form, tone: e.target.value as any })}
          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
        >
          <option value="Assertive">Assertive / Peremptory Legal Action</option>
          <option value="Formal">Formal Standard</option>
          <option value="Conciliatory">Conciliatory / Amicable Settlement</option>
        </select>
      </div>
      <div>
        <label htmlFor="notice-jurisdiction" className="block text-slate-400 font-medium mb-1">Jurisdiction</label>
        <input
          id="notice-jurisdiction"
          type="text"
          value={form.jurisdiction}
          onChange={e => onChange({ ...form, jurisdiction: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
        />
      </div>
      <div>
        <label htmlFor="notice-cause" className="block text-slate-400 font-medium mb-1">Cause of Action & Breach Details</label>
        <textarea
          id="notice-cause"
          rows={3}
          value={form.causeOfAction}
          onChange={e => onChange({ ...form, causeOfAction: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
        />
      </div>
    </div>
  );
};
