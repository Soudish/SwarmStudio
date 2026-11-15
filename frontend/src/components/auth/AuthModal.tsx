import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';
import { api } from '../../services/api';
import { User } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'register') {
        const res = await api.register(name, email, password);
        onSuccess(res.user);
        onClose();
      } else {
        const res = await api.login(email, password);
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.login('creator@swarmstudio.ai', 'creative2026');
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const modalBg = isDark ? 'bg-[#0F1626]' : 'bg-white';
  const inputBg = isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const dividerBg = isDark ? 'bg-[#0F1626]' : 'bg-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full max-w-md border rounded-3xl shadow-2xl shadow-purple-950/60 p-6 sm:p-8 overflow-hidden ${modalBg} ${isDark ? 'border-purple-500/30 text-slate-100' : 'border-purple-200 text-slate-900'}`}>
        {/* Glow backdrop */}
        <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-purple-600/20' : 'bg-purple-200/30'}`} />
        <div className={`absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-indigo-600/20' : 'bg-indigo-200/30'}`} />

        {/* Close Button */}
        <button onClick={onClose} className={`absolute top-5 right-5 p-2 rounded-xl transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-lg shadow-purple-600/30 border border-purple-400/30">
            <img src="/logo.jpg" alt="SwarmStudio" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className={`text-xl font-extrabold tracking-tight ${textPrimary}`}>
              {mode === 'login' ? 'Welcome Back' : 'Join SwarmStudio'}
            </h2>
            <p className={`text-xs ${textMuted}`}>
              {mode === 'login'
                ? 'Sign in to access your previous projects and works'
                : 'Create an account to store and manage your creative swarm projects'}
            </p>
          </div>
        </div>

        {/* Quick Demo Login */}
        <div className="mb-5">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 p-3 rounded-2xl border transition-all text-xs font-semibold shadow-inner ${isDark ? 'bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-purple-900/40 border-purple-500/40 text-purple-200 hover:text-white hover:border-purple-400' : 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 text-purple-600 hover:text-purple-800 hover:border-purple-300'}`}
          >
            <Zap className="w-4 h-4 text-purple-400 fill-purple-400" />
            <span>One-Click Demo Sign In (Alex Vance)</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center my-4">
          <div className={`border-t w-full ${isDark ? 'border-slate-800' : 'border-slate-200'}`} />
          <span className={`${dividerBg} px-3 text-[11px] font-semibold uppercase tracking-wider ${textMuted}`}>
            or continue with email
          </span>
          <div className={`border-t w-full ${isDark ? 'border-slate-800' : 'border-slate-200'}`} />
        </div>

        {/* Mode Switcher Tabs */}
        <div className={`flex p-1 mb-5 rounded-xl border text-xs font-semibold ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 rounded-lg transition-all ${mode === 'login' ? 'bg-purple-600 text-white shadow-md' : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2 rounded-lg transition-all ${mode === 'register' ? 'bg-purple-600 text-white shadow-md' : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Create Account
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">{error}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Full Name</label>
              <div className="relative">
                <UserIcon className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${textMuted}`} />
                <input type="text" required placeholder="e.g. Maya Lin" value={name} onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-purple-500 ${inputBg}`} />
              </div>
            </div>
          )}
          <div>
            <label className={`text-xs font-semibold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Email Address</label>
            <div className="relative">
              <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${textMuted}`} />
              <input type="email" required placeholder="you@domain.com" value={email} onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-purple-500 ${inputBg}`} />
            </div>
          </div>
          <div>
            <label className={`text-xs font-semibold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Password</label>
            <div className="relative">
              <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${textMuted}`} />
              <input type={showPassword ? 'text' : 'password'} required placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-purple-500 ${inputBg}`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${textMuted} hover:text-slate-300`}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/40 border border-purple-400/30 transition-all disabled:opacity-50">
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to Workspace' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className={`mt-5 text-center text-xs ${textMuted}`}>
          {mode === 'login' ? (
            <span>Don't have an account?{' '}
              <button onClick={() => { setMode('register'); setError(null); }} className="text-purple-400 hover:text-purple-300 font-semibold underline">Sign up</button>
            </span>
          ) : (
            <span>Already have an account?{' '}
              <button onClick={() => { setMode('login'); setError(null); }} className="text-purple-400 hover:text-purple-300 font-semibold underline">Sign in</button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
