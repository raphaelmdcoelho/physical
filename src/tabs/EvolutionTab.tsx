import { useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MONTH_SHORT, monthKey } from '../lib/dates';
import { MEASURES, MEASURE_LABELS, type MeasureKey, type MonthEntry } from '../lib/types';

const COLORS = ['#2dd4bf', '#8b5cf6', '#f59e0b', '#f43f5e', '#38bdf8', '#a3e635', '#fb7185', '#c084fc', '#facc15', '#34d399', '#60a5fa', '#f97316', '#e879f9'];

interface Props {
  year: number;
  months: Record<string, MonthEntry>;
}

export default function EvolutionTab({ year, months }: Props) {
  const [selected, setSelected] = useState<MeasureKey[]>(['chest', 'waist']);
  const toggle = (k: MeasureKey) => setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  const rows: Record<string, string | number | null>[] = MONTH_SHORT.map((name, i) => {
    const m = months[monthKey(year, i)]?.measures ?? {};
    return { name, ...Object.fromEntries(selected.map((k) => [k, m[k] ?? null])) };
  });
  const hasData = rows.some((r) => selected.some((k) => r[k] != null));

  const weightRows = MONTH_SHORT.map((name, i) => ({ name, weight: months[monthKey(year, i)]?.weight ?? null }));
  const hasWeight = weightRows.some((r) => r.weight != null);

  return (
    <section>
      <h2 className="title">Evolution · {year}</h2>
      <div className="chips" role="group" aria-label="Measures">
        {MEASURES.map((k) => (
          <button key={k} className={`chip ${selected.includes(k) ? 'on' : ''}`} aria-pressed={selected.includes(k)} onClick={() => toggle(k)}>
            {MEASURE_LABELS[k]}
          </button>
        ))}
      </div>

      <div className="gr-card pad chart">
        <h3>Muscle growth by month (cm)</h3>
        {hasData ? (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={rows} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="var(--line)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--muted)" tickLine={false} />
              <YAxis stroke="var(--muted)" tickLine={false} axisLine={false} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 12 }} />
              <Legend />
              {selected.map((k) => (
                <Line
                  key={k}
                  type="monotone"
                  dataKey={k}
                  name={MEASURE_LABELS[k]}
                  stroke={COLORS[MEASURES.indexOf(k) % COLORS.length]}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="muted center">Add monthly measures in the Body tab to see your evolution.</p>
        )}
      </div>

      {hasWeight && (
        <div className="gr-card pad chart">
          <h3>Weight (kg)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weightRows} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="var(--line)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--muted)" tickLine={false} />
              <YAxis stroke="var(--muted)" tickLine={false} axisLine={false} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 12 }} />
              <Line type="monotone" dataKey="weight" name="Weight" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 4 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
