'use client';

import { Eye, EyeOff, Mail, ArrowLeft, UserPlus, LogIn, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/auth-context';
import { api, ApiError } from '@/lib/api';

export type AuthView = 'options' | 'email' | 'verify' | 'forgot' | 'reset';

type AuthFormProps = {
  planParam?: string | null;
  refParam?: string | null;
  resetToken?: string | null;
  googleError?: string | null;
  initialMode?: 'login' | 'register';
  initialView?: AuthView;
  /** Called after a successful login / verification. */
  onSuccess: () => void;
  /** When provided, legal links close the surrounding surface (modal) before navigating. */
  onClose?: () => void;
};

/**
 * Shared login/register/verify/forgot/reset form. Rendered inside both the
 * full-page /login shell and the LoginModal shell — the visual chrome around
 * it (page split vs floating modal) lives in each shell.
 */
export function AuthForm({
  planParam = null,
  refParam = null,
  resetToken = null,
  googleError = null,
  initialMode = 'login',
  initialView,
  onSuccess,
  onClose,
}: AuthFormProps) {
  const router = useRouter();
  const { login } = useAuth();
  const tCommon = useTranslations('auth.common');
  const tForgot = useTranslations('auth.forgotPassword');
  const tReset = useTranslations('auth.resetPassword');
  const tVerify = useTranslations('auth.verifyEmail');

  const redirectAfterLogin = planParam ? `/checkout?plan=${planParam}` : '/home';

  const [view, setView] = useState<AuthView>(initialView ?? (resetToken ? 'reset' : 'options'));
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(googleError || '');
  const [success, setSuccess] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Reset password
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetShowPassword, setResetShowPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Verify email
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [verifyStatus, setVerifyStatus] = useState<'input' | 'loading' | 'success' | 'error'>('input');
  const [verifyMessage, setVerifyMessage] = useState('');
  const [resendVerifyLoading, setResendVerifyLoading] = useState(false);
  const [resendVerifySuccess, setResendVerifySuccess] = useState('');
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (view === 'verify') setTimeout(() => inputsRef.current[0]?.focus(), 50);
  }, [view]);

  function handleLoginSuccess() {
    onSuccess();
    router.push(redirectAfterLogin);
  }

  function handleDigitChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 6);
      for (let i = 0; i < 6; i++) newDigits[i] = pasted[i] || '';
      setDigits(newDigits);
      inputsRef.current[Math.min(pasted.length, 5)]?.focus();
      if (pasted.length === 6) submitCode(newDigits.join(''));
      return;
    }
    newDigits[index] = value;
    setDigits(newDigits);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
    const code = newDigits.join('');
    if (code.length === 6) submitCode(code);
  }
  function handleDigitKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) inputsRef.current[index - 1]?.focus();
  }
  function handleDigitPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) newDigits[i] = pasted[i] || '';
    setDigits(newDigits);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
    if (pasted.length === 6) submitCode(newDigits.join(''));
  }

  async function submitCode(code: string) {
    setVerifyStatus('loading');
    setVerifyMessage('');
    try {
      await api.auth.verifyEmail(code);
      await login(email, password);
      handleLoginSuccess();
    } catch (err) {
      setVerifyStatus('error');
      setVerifyMessage(err instanceof Error ? err.message : tVerify('invalidCode'));
    }
  }
  function handleVerifyRetry() {
    setDigits(['', '', '', '', '', '']);
    setVerifyStatus('input');
    setVerifyMessage('');
    setResendVerifySuccess('');
    setTimeout(() => inputsRef.current[0]?.focus(), 50);
  }
  async function handleResendVerify() {
    if (!email) return;
    setResendVerifyLoading(true);
    setResendVerifySuccess('');
    try {
      const res = await api.auth.resendVerificationByEmail(email);
      setResendVerifySuccess(res.message || tVerify('resendSuccess'));
    } catch (err) {
      setResendVerifySuccess(err instanceof Error ? err.message : tVerify('resendError'));
    } finally {
      setResendVerifyLoading(false);
    }
  }
  async function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault();
    setForgotError('');
    setForgotLoading(true);
    try {
      await api.auth.forgotPassword(forgotEmail);
      setForgotSent(true);
    } catch (err) {
      setForgotError(err instanceof Error ? err.message : tForgot('error'));
    } finally {
      setForgotLoading(false);
    }
  }
  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResetError('');
    if (resetNewPassword !== resetConfirmPassword) {
      setResetError(tReset('passwordsDontMatch'));
      return;
    }
    if (resetNewPassword.length < 8) {
      setResetError(tReset('passwordTooShort'));
      return;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(resetNewPassword)) {
      setResetError(tReset('passwordWeak'));
      return;
    }
    setResetLoading(true);
    try {
      await api.auth.resetPassword(resetToken || '', resetNewPassword);
      setResetSuccess(true);
    } catch (err) {
      setResetError(err instanceof Error ? err.message : tReset('error'));
    } finally {
      setResetLoading(false);
    }
  }
  async function handleEmailSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setShowResend(false);
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        handleLoginSuccess();
      } else {
        const referralCode = refParam || document.cookie.match(/(?:^|; )theaimodelab-ref=([^;]*)/)?.[1];
        await api.auth.register(email, name, password, referralCode || undefined);
        setView('verify');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : tCommon('genericError');
      setError(message);
      if (err instanceof ApiError && err.code === 'EMAIL_NOT_VERIFIED') setShowResend(true);
    } finally {
      setLoading(false);
    }
  }
  async function handleResendVerification() {
    setResendLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.auth.resendVerificationByEmail(email);
      setSuccess(res.message);
      setShowResend(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : tCommon('genericError'));
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <>
      {/* ── View: Options ── */}
      {view === 'options' && (
        <div className="w-full flex flex-col gap-3">
          <h2 className="text-center text-base font-semibold text-white mb-1">{tCommon('welcomeBack')}</h2>
          <p className="text-center text-xs text-white/35 mb-3">{tCommon('welcomeSubtitle')}</p>

          <button
            onClick={() => {
              setGoogleLoading(true);
              if (planParam) document.cookie = `theaimodelab-plan-redirect=${planParam};path=/;max-age=600;samesite=lax`;
              const ref = refParam || document.cookie.match(/(?:^|; )theaimodelab-ref=([^;]*)/)?.[1];
              if (ref) document.cookie = `theaimodelab-ref=${ref};path=/;max-age=2592000;samesite=lax`;
              window.location.href = '/api/v1/auth/google';
            }}
            disabled={loading || googleLoading}
            className="app-ease flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] text-sm font-medium text-white transition-all hover:bg-white/10 active:scale-[0.98] disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" />
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" />
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" />
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z" />
              </svg>
            )}
            {googleLoading ? tCommon('redirecting') : tCommon('continueWithGoogle')}
          </button>

          {error && (
            <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-400">{error}</p>
          )}

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-[10px] text-white/20">{tCommon('or')}</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <button
            onClick={() => setView('email')}
            className="app-ease flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] text-sm font-medium text-white transition-all hover:bg-white/10 active:scale-[0.98]"
          >
            <Mail className="h-4 w-4 opacity-60" />
            {tCommon('continueWithEmail')}
          </button>

          <p className="mt-3 text-center text-[11px] text-white/18 leading-relaxed">
            {tCommon.rich('legal', {
              terms: (chunks) => (
                <Link href="/termos-de-uso" onClick={onClose} className="text-[#e11d2a]/50 hover:text-[#e11d2a]/80 transition-colors">{chunks}</Link>
              ),
              privacy: (chunks) => (
                <Link href="/politica-de-privacidade" onClick={onClose} className="text-[#e11d2a]/50 hover:text-[#e11d2a]/80 transition-colors">{chunks}</Link>
              ),
            })}
          </p>
        </div>
      )}

      {/* ── View: Forgot password ── */}
      {view === 'forgot' && (
        <div className="w-full">
          <button onClick={() => { setView('email'); setForgotEmail(''); setForgotError(''); setForgotSent(false); }} className="mb-5 flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> {tCommon('back')}
          </button>
          {forgotSent ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e11d2a]/15">
                <CheckCircle className="h-7 w-7 text-[#e11d2a]" />
              </div>
              <h2 className="text-lg font-bold text-white">{tForgot('sentTitle')}</h2>
              <p className="text-sm text-white/50">
                {tForgot.rich('sentBody', {
                  email: forgotEmail,
                  strong: (chunks) => <span className="text-white/70">{chunks}</span>,
                })}
              </p>
              <p className="text-xs text-white/30">{tForgot('checkSpam')}</p>
              <button onClick={() => { setView('email'); setForgotEmail(''); setForgotSent(false); }} className="mt-1 flex items-center gap-1.5 text-xs text-[#e11d2a]/60 hover:text-[#e11d2a]/90 transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> {tCommon('backToLogin')}
              </button>
            </div>
          ) : (
            <>
              <h2 className="mb-1 text-lg font-bold text-white">{tForgot('title')}</h2>
              <p className="mb-5 text-xs text-white/40">{tForgot('description')}</p>
              <form onSubmit={handleForgotSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-[0.12em] text-white/40">{tCommon('labels.email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                    <input type="email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder={tCommon('placeholders.email')} className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] pl-10 pr-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors focus:border-[#e11d2a]/40 focus:bg-white/[0.06]" />
                  </div>
                </div>
                {forgotError && <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-400">{forgotError}</p>}
                <button type="submit" disabled={forgotLoading} className="app-btn mt-1 flex h-11 items-center justify-center gap-2 bg-[#e11d2a] font-bold text-[#111113] text-sm disabled:opacity-60">
                  {forgotLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : tForgot('submit')}
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* ── View: Reset password ── */}
      {view === 'reset' && (
        <div className="w-full">
          {resetSuccess ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e11d2a]/15">
                <CheckCircle className="h-7 w-7 text-[#e11d2a]" />
              </div>
              <h2 className="text-lg font-bold text-white">{tReset('successTitle')}</h2>
              <p className="text-sm text-white/50">{tReset('successBodyShort')}</p>
              <button
                onClick={() => { setView('email'); setResetSuccess(false); setResetNewPassword(''); setResetConfirmPassword(''); }}
                className="app-btn mt-1 flex items-center gap-2 bg-[#e11d2a] px-5 py-2.5 text-sm font-bold text-[#111113]"
              >
                <LogIn className="h-4 w-4" />
                {tReset('signIn')}
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => setView('email')} className="mb-5 flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> {tCommon('back')}
              </button>
              <h2 className="mb-1 text-lg font-bold text-white">{tReset('title')}</h2>
              <p className="mb-5 text-xs text-white/40">{tReset('description')}</p>
              <form onSubmit={handleResetSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-[0.12em] text-white/40">{tCommon('labels.newPassword')}</label>
                  <div className="relative">
                    <input type={resetShowPassword ? 'text' : 'password'} required value={resetNewPassword} onChange={(e) => setResetNewPassword(e.target.value)} placeholder="••••••••" className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 pr-10 text-sm text-white placeholder:text-white/20 outline-none transition-colors focus:border-[#e11d2a]/40 focus:bg-white/[0.06]" />
                    <button type="button" onClick={() => setResetShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                      {resetShowPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-[0.12em] text-white/40">{tCommon('labels.confirmPassword')}</label>
                  <input type={resetShowPassword ? 'text' : 'password'} required value={resetConfirmPassword} onChange={(e) => setResetConfirmPassword(e.target.value)} placeholder="••••••••" className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors focus:border-[#e11d2a]/40 focus:bg-white/[0.06]" />
                </div>
                <p className="text-[10px] text-white/25">{tReset('passwordHelper')}</p>
                {resetError && <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-400">{resetError}</p>}
                <button type="submit" disabled={resetLoading} className="app-btn mt-1 flex h-11 items-center justify-center gap-2 bg-[#e11d2a] font-bold text-[#111113] text-sm disabled:opacity-60">
                  {resetLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : tReset('submit')}
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* ── View: Verify email ── */}
      {view === 'verify' && (
        <div className="w-full flex flex-col items-center gap-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-[#f3f0ed]">{tVerify('title')}</h2>
            <p className="mt-2 text-sm text-[#f3f0ed]/50">
              {tVerify.rich('descriptionWithEmail', {
                email,
                strong: (chunks) => <span className="text-[#f3f0ed]/70">{chunks}</span>,
              })}
            </p>
          </div>
          <div className="flex gap-3">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputsRef.current[i] = el; }}
                type="text" inputMode="numeric" maxLength={6} value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleDigitKeyDown(i, e)}
                onPaste={handleDigitPaste}
                disabled={verifyStatus === 'loading'}
                className={`h-14 w-12 rounded-xl border text-center text-xl font-bold outline-none transition-all ${verifyStatus === 'error' ? 'border-red-400/40 bg-red-400/10 text-red-400' : 'border-white/[0.08] bg-white/[0.04] text-white focus:border-[#e11d2a]/50 focus:bg-white/[0.06]'} disabled:opacity-50`}
              />
            ))}
          </div>
          {verifyStatus === 'loading' && (
            <div className="flex items-center gap-2 text-[#f3f0ed]/50"><Loader2 className="h-4 w-4 animate-spin" /><span className="text-sm">{tVerify('verifying')}</span></div>
          )}
          {verifyStatus === 'error' && (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-red-400"><XCircle className="h-4 w-4" /><span className="text-sm">{verifyMessage}</span></div>
              <button onClick={handleVerifyRetry} className="text-xs text-[#e11d2a]/70 hover:text-[#e11d2a] transition-colors">{tVerify('tryAgain')}</button>
            </div>
          )}
          {resendVerifySuccess && <p className="rounded-xl border border-[#e11d2a]/20 bg-[#e11d2a]/10 px-3 py-2 text-xs text-[#e11d2a]">{resendVerifySuccess}</p>}
          <div className="flex flex-col items-center gap-3 pt-1">
            <button onClick={handleResendVerify} disabled={resendVerifyLoading} className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors disabled:opacity-50">
              <RefreshCw className={`h-3.5 w-3.5 ${resendVerifyLoading ? 'animate-spin' : ''}`} />
              {resendVerifyLoading ? tVerify('resending') : tVerify('resend')}
            </button>
            <button onClick={() => { setView('email'); setVerifyStatus('input'); setDigits(['', '', '', '', '', '']); }} className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> {tCommon('back')}
            </button>
          </div>
        </div>
      )}

      {/* ── View: Email form ── */}
      {view === 'email' && (
        <div className="w-full">
          <button onClick={() => { setView('options'); setError(''); }} className="mb-5 flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> {tCommon('back')}
          </button>
          <div className="mb-6 flex rounded-xl border border-white/[0.07] bg-white/[0.03] p-1">
            {(['login', 'register'] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(''); }} className={`flex-1 rounded-lg py-2 text-xs font-medium transition-all ${mode === m ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'}`}>
                {m === 'login' ? tCommon('loginTab') : tCommon('registerTab')}
              </button>
            ))}
          </div>
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
            {mode === 'register' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-[0.12em] text-white/40">{tCommon('labels.name')}</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder={tCommon('placeholders.name')} className="h-11 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors focus:border-[#e11d2a]/40 focus:bg-white/[0.06]" />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-[0.12em] text-white/40">{tCommon('labels.email')}</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={tCommon('placeholders.email')} className="h-11 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors focus:border-[#e11d2a]/40 focus:bg-white/[0.06]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-[0.12em] text-white/40">{tCommon('labels.password')}</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 pr-10 text-sm text-white placeholder:text-white/20 outline-none transition-colors focus:border-[#e11d2a]/40 focus:bg-white/[0.06]" />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {success && <p className="rounded-xl border border-[#e11d2a]/20 bg-[#e11d2a]/10 px-3 py-2 text-xs text-[#e11d2a]">{success}</p>}
            {error && (
              <div className="flex flex-col gap-2">
                <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-400">{error}</p>
                {showResend && (
                  <button type="button" onClick={handleResendVerification} disabled={resendLoading} className="text-xs text-[#e11d2a]/70 hover:text-[#e11d2a] transition-colors disabled:opacity-50">
                    {resendLoading ? tCommon('resending') : tCommon('resendVerification')}
                  </button>
                )}
              </div>
            )}
            {mode === 'login' && (
              <div className="flex justify-end">
                <button type="button" onClick={() => { setForgotEmail(email); setView('forgot'); }} className="text-[11px] text-[#e11d2a]/50 hover:text-[#e11d2a]/80 transition-colors">
                  {tCommon('forgotPasswordLink')}
                </button>
              </div>
            )}
            <button type="submit" disabled={loading} className="app-btn mt-1 flex h-11 items-center justify-center gap-2 bg-[#e11d2a] font-bold text-[#111113] text-sm disabled:opacity-60">
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#111113]/30 border-t-[#111113]" />
              ) : mode === 'register' ? (
                <><UserPlus className="h-4 w-4" />{tCommon('submitRegister')}</>
              ) : (
                <><LogIn className="h-4 w-4" />{tCommon('submitLogin')}</>
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
