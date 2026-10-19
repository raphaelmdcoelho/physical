import { useMemo, useState, type FormEvent } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { classifyPressure } from '../lib/calc';
import { nowTime, todayISO } from '../lib/dates';
import type { PressureReading } from '../lib/types';

interface Props {
  readings: PressureReading[];
  onAdd: (r: PressureReading) => void;
  onRemove: (id: string) => void;
}

const fmtDay = (iso: string) => new Date(`${iso}T00:00`).toLocaleDateString(undefined, { day: '2-digit', month: 'short' });

export default function PressureTab({ readings, onAdd, onRemove }: Props) {
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState(nowTime());
  const [sys, setSys] = useState('');
  const [dia, setDia] = useState('');
  const [pulse, setPulse] = useState('');
  const [error, setError] = useState('');

  const sorted = useMemo(() => [...readings].sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`)), [readings]);

  // One point per day: the average of that day's readings.
  const daily = useMemo(() => {
    const byDay = new Map<string, PressureReading[]>();
    for (const r of readings) byDay.set(r.date, [...(byDay.get(r.date) ?? []), r]);
    const avg = (xs: number[]) => Math.round(xs.reduce((a, b) => a + b, 0) / xs.length);
    return [...byDay.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-30)
      .map(([day, rs]) => ({ day: fmtDay(day), systolic: avg(rs.map((r) => r.systolic)), diastolic: avg(rs.map((r) => r.diastolic)) }));
  }, [readings]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const systolic = Number(sys);
    const diastolic = Number(dia);
    if (!(systolic >= 50 && systolic <= 260) || !(diastolic >= 30 && diastolic <= 160) || diastolic >= systolic) {
      setError('Enter valid values, e.g. 120 / 80 (systolic must be higher than diastolic).');
      return;
    }
    setError('');
    onAdd({ id: crypto.randomUUID(), date, time, systolic, diastolic, pulse: pulse ? Number(pulse) : undefined });
    setSys('');
    setDia('');
    setPulse('');
    setTime(nowTime());
  };

  return (
    <section>
      <h2 className="title">Blood pressure by day</h2>

      <form className="card press-form" onSubmit={submit}>
        <label className="field">
          <span>Date</span>
          <input type="date" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label className="field">
          <span>Time</span>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </label>
        <label className="field">
          <span>Systolic</span>
          <div className="input-unit">
            <input inputMode="numeric" value={sys} onChange={(e) => setSys(e.target.value)} placeholder="120" required />
            <em>mmHg</em>
          </div>
        </label>
        <label className="field">
          <span>Diastolic</span>
          <div className="input-unit">
            <input inputMode="numeric" value={dia} onChange={(e) => setDia(e.target.value)} placeholder="80" required />
            <em>mmHg</em>
          </div>
        </label>
        <label className="field">
          <span>Pulse (optional)</span>
          <div className="input-unit">
            <input inputMode="numeric" value={pulse} onChange={(e) => setPulse(e.target.value)} placeholder="70" />
            <em>bpm</em>
          </div>
        </label>
        <button className="btn primary">Add reading</button>
        {error && <p className="error full">{error}</p>}
      </form>

      <div className="card chart">
        <h3>Daily average · last 30 days</h3>
        {daily.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={daily} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
              <ReferenceArea y1={90} y2={120} fill="#2dd4bf" fillOpacity={0.07} />
              <CartesianGrid stroke="var(--line)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--muted)" tickLine={false} />
              <YAxis stroke="var(--muted)" tickLine={false} axisLine={false} domain={[50, 'auto']} />
              <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 12 }} />
              <Legend />
              <Line type="monotone" dataKey="systolic" name="Systolic" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="diastolic" name="Diastolic" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="muted center">No readings yet.</p>
        )}
      </div>

      {sorted.length > 0 && (
        <div className="card">
          <h3>History</h3>
          <ul className="history">
            {sorted.map((r) => {
              const c = classifyPressure(r.systolic, r.diastolic);
              return (
                <li key={r.id}>
                  <div>
                    <strong>
                      {r.systolic}/{r.diastolic}
                    </strong>
                    <small className="muted">
                      {' '}
                      mmHg{r.pulse ? ` · ${r.pulse} bpm` : ''}
                    </small>
                    <div className="muted small">
                      {fmtDay(r.date)} · {r.time}
                    </div>
                  </div>
                  <span className={`pill ${c.tone}`}>{c.label}</span>
                  <button className="icon-btn" onClick={() => onRemove(r.id)} aria-label="Delete reading">
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
