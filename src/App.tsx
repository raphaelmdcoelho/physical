import { useState } from 'react';
import AuthScreen from './components/AuthScreen';
import Logo from './components/Logo';
import * as storage from './lib/storage';
import { useUserData } from './lib/useUserData';
import type { Gender, User } from './lib/types';
import BodyTab from './tabs/BodyTab';
import EvolutionTab from './tabs/EvolutionTab';
import PressureTab from './tabs/PressureTab';

const TABS = [
  { id: 'body', label: 'Body', icon: '🏋️' },
  { id: 'evolution', label: 'Evolution', icon: '📈' },
  { id: 'pressure', label: 'Pressure', icon: '❤️' },
] as const;
type TabId = (typeof TABS)[number]['id'];

function Shell({ user, onUser, onLogout }: { user: User; onUser: (u: User) => void; onLogout: () => void }) {
  const [tab, setTab] = useState<TabId>('body');
  const { data, setMonth, addReading, removeReading } = useUserData(user.id);
  const year = new Date().getFullYear();

  const changeGender = (gender: Gender) => onUser(storage.updateUser(user.id, { gender }));

  return (
    <div className="app">
      <header className="topbar">
        <Logo />
        <nav className="tabs" aria-label="Sections">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? 'on' : ''} aria-current={tab === t.id ? 'page' : undefined} onClick={() => setTab(t.id)}>
              <span aria-hidden="true">{t.icon}</span> {t.label}
            </button>
          ))}
        </nav>
        <div className="user">
          <select value={user.gender} onChange={(e) => changeGender(e.target.value as Gender)} aria-label="Body frame gender" title="Body frame">
            <option value="male">♂ Male</option>
            <option value="female">♀ Female</option>
          </select>
          <button className="btn ghost" onClick={onLogout} title={user.email}>
            Log out
          </button>
        </div>
      </header>

      <main className="content">
        {tab === 'body' && <BodyTab user={user} year={year} months={data.months} onSave={setMonth} />}
        {tab === 'evolution' && <EvolutionTab year={year} months={data.months} />}
        {tab === 'pressure' && <PressureTab readings={data.pressure} onAdd={addReading} onRemove={removeReading} />}
      </main>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | undefined>(() => storage.currentUser());

  if (!user) return <AuthScreen onAuth={setUser} />;
  return (
    <Shell
      key={user.id}
      user={user}
      onUser={setUser}
      onLogout={() => {
        storage.logout();
        setUser(undefined);
      }}
    />
  );
}
