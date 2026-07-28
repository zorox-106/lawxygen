import React from 'react';
import { Scale, LogOut, UserCheck } from 'lucide-react';
import { User } from '@/hooks/useAuth';

interface HeaderProps {
  user: User | null;
  onQuickLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onQuickLogin, onLogout }) => {
  return (
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
                onClick={onLogout}
                className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                title="Logout"
                aria-label="Logout user session"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onQuickLogin}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-600/30 transition-all"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Quick Demo Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
