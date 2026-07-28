import React from 'react';
import { NDADraftInput } from '@/lib/drafter';

interface NdaFormProps {
  form: NDADraftInput;
  onChange: (form: NDADraftInput) => void;
}

export const NdaForm: React.FC<NdaFormProps> = ({ form, onChange }) => {
  return (
    <div className="space-y-3 text-xs">
      <div>
        <label htmlFor="nda-disclosing" className="block text-slate-400 font-medium mb-1">Disclosing Party (Entity/Individual)</label>
        <input
          id="nda-disclosing"
          type="text"
          value={form.disclosingParty}
          onChange={e => onChange({ ...form, disclosingParty: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
        />
      </div>
      <div>
        <label htmlFor="nda-receiving" className="block text-slate-400 font-medium mb-1">Receiving Party</label>
        <input
          id="nda-receiving"
          type="text"
          value={form.receivingParty}
          onChange={e => onChange({ ...form, receivingParty: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="nda-date" className="block text-slate-400 font-medium mb-1">Effective Date</label>
          <input
            id="nda-date"
            type="date"
            value={form.effectiveDate}
            onChange={e => onChange({ ...form, effectiveDate: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="nda-duration" className="block text-slate-400 font-medium mb-1">Term Duration (Years)</label>
          <input
            id="nda-duration"
            type="number"
            value={form.durationYears}
            onChange={e => onChange({ ...form, durationYears: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>
      <div>
        <label htmlFor="nda-tone" className="block text-slate-400 font-medium mb-1">Legal Tone Intensity</label>
        <select
          id="nda-tone"
          value={form.tone || 'Formal'}
          onChange={e => onChange({ ...form, tone: e.target.value as any })}
          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
        >
          <option value="Formal">Formal Standard</option>
          <option value="Assertive">Assertive / Strict Remedies</option>
          <option value="Conciliatory">Conciliatory / Amicable Consultation</option>
        </select>
      </div>
      <div>
        <label htmlFor="nda-jurisdiction" className="block text-slate-400 font-medium mb-1">Jurisdiction / Seat of Court</label>
        <input
          id="nda-jurisdiction"
          type="text"
          value={form.jurisdiction}
          onChange={e => onChange({ ...form, jurisdiction: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
        />
      </div>
      <div>
        <label htmlFor="nda-purpose" className="block text-slate-400 font-medium mb-1">Purpose of Disclosure</label>
        <textarea
          id="nda-purpose"
          rows={2}
          value={form.purpose}
          onChange={e => onChange({ ...form, purpose: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
        />
      </div>
      <div>
        <label htmlFor="nda-scope" className="block text-slate-400 font-medium mb-1">Confidential Information Scope</label>
        <textarea
          id="nda-scope"
          rows={2}
          value={form.confidentialScope}
          onChange={e => onChange({ ...form, confidentialScope: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
        />
      </div>
    </div>
  );
};
