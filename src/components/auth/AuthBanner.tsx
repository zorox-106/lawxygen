import React from 'react';
import { Shield } from 'lucide-react';

interface AuthBannerProps {
  onQuickLogin: () => void;
}

export const AuthBanner: React.FC<AuthBannerProps> = ({ onQuickLogin }) => {
  return (
    <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center space-x-3">
        <Shield className="h-5 w-5 text-amber-400 flex-shrink-0" />
        <p className="text-xs sm:text-sm">
          <strong>Lawxygen Reviewer Note:</strong> Authentication is active with stateful JWT session cookies. Click <strong>Authenticate Now</strong> to log in as Senior Advocate.
        </p>
      </div>
      <button
        onClick={onQuickLogin}
        className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all flex-shrink-0"
      >
        Authenticate Now
      </button>
    </div>
  );
};
