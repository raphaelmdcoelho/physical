import { useState, type FormEvent } from 'react';
import * as storage from '../lib/storage';
import type { Gender, User } from '../lib/types';
import Logo from './Logo';

export default function AuthScreen({ onAuth }: { onAuth: (u: User) => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [birthdate, setBirthdate] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      onAuth(
        mode === 'login'
          ? await storage.login(email, password)
          : await storage.register({ name, email, password, gender, birthdate }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth">
      <form className="gr-card auth-card" data-variant="elevated" onSubmit={submit}>
        <Logo big />
        <p className="muted center">Track your muscles, body and blood pressure.</p>

        <div className="seg">
          <button type="button" className={mode === 'login' ? 'on' : ''} onClick={() => setMode('login')}>
            Log in
          </button>
          <button type="button" className={mode === 'signup' ? 'on' : ''} onClick={() => setMode('signup')}>
            Sign up
          </button>
        </div>

        {mode === 'signup' && (
          <>
            <div className="gr-field">
              <label className="gr-field__label" htmlFor="auth-name">Name</label>
              <input id="auth-name" className="gr-text-field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
            </div>
            <fieldset className="gr-field-group">
              <legend className="gr-field-group__legend">Gender</legend>
              <div className="gender">
                {(['male', 'female'] as const).map((g) => (
                  <button key={g} type="button" className="gr-button" data-variant={gender === g ? 'primary' : 'secondary'} aria-pressed={gender === g} onClick={() => setGender(g)}>
                    {g === 'male' ? '♂ Male' : '♀ Female'}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="gr-field">
              <label className="gr-field__label" htmlFor="auth-birth">Birth date</label>
              <input id="auth-birth" className="gr-text-field" type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />
            </div>
          </>
        )}
        <div className="gr-field">
          <label className="gr-field__label" htmlFor="auth-email">Email</label>
          <input id="auth-email" className="gr-text-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </div>
        <div className="gr-field">
          <label className="gr-field__label" htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            className="gr-text-field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            minLength={mode === 'signup' ? 6 : undefined}
            required
          />
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="gr-button" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>
        <p className="muted small center">Your data is stored only in this browser.</p>
      </form>
    </main>
  );
}
