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
      <form className="card auth-card" onSubmit={submit}>
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
            <label className="field">
              <span>Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
            </label>
            <div className="field">
              <span>Gender</span>
              <div className="gender">
                {(['male', 'female'] as const).map((g) => (
                  <button key={g} type="button" className={gender === g ? 'on' : ''} aria-pressed={gender === g} onClick={() => setGender(g)}>
                    {g === 'male' ? '♂ Male' : '♀ Female'}
                  </button>
                ))}
              </div>
            </div>
            <label className="field">
              <span>Birth date</span>
              <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />
            </label>
          </>
        )}
        <label className="field">
          <span>Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            minLength={mode === 'signup' ? 6 : undefined}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn primary" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>
        <p className="muted small center">Your data is stored only in this browser.</p>
      </form>
    </main>
  );
}
