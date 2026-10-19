import { ageFrom, bmi, bmr, classifyBmi, classifyWaistHeight, classifyWaistHip, healthyWeightRange, leanMass, ratio, symmetry, type Classification } from '../lib/calc';
import type { MonthEntry, User } from '../lib/types';

function Stat({ label, value, note }: { label: string; value: string; note?: Classification | string }) {
  return (
    <div className="stat">
      <span className="stat-label">{label}</span>
      <strong>{value}</strong>
      {typeof note === 'string' ? <small>{note}</small> : note && <small className={`pill ${note.tone}`}>{note.label}</small>}
    </div>
  );
}

export default function Stats({ user, entry }: { user: User; entry?: MonthEntry }) {
  if (!entry) {
    return <p className="muted center">No data for this month yet — tap the pencil to add your measures.</p>;
  }
  const { weight, height, bodyFat, measures: m } = entry;
  const imc = bmi(weight, height);
  const range = healthyWeightRange(height);
  const whr = ratio(m.waist, m.hips);
  const whtr = ratio(m.waist, height);
  const rate = bmr(user.gender, weight, height, ageFrom(user.birthdate));
  const lean = leanMass(weight, bodyFat);
  const sym = symmetry(m);
  const dash = '—';

  return (
    <>
      <div className="stats">
        <Stat label="Weight" value={weight ? `${weight} kg` : dash} />
        <Stat label="Height" value={height ? `${height} cm` : dash} />
        <Stat label="BMI (IMC)" value={imc ? imc.toFixed(1) : dash} note={imc ? classifyBmi(imc) : undefined} />
        <Stat
          label="Healthy weight"
          value={range ? `${range[0].toFixed(1)}–${range[1].toFixed(1)} kg` : dash}
          note={range ? 'BMI 18.5–24.9' : undefined}
        />
        <Stat label="Waist / hip" value={whr ? whr.toFixed(2) : dash} note={whr ? classifyWaistHip(whr, user.gender) : undefined} />
        <Stat label="Waist / height" value={whtr ? whtr.toFixed(2) : dash} note={whtr ? classifyWaistHeight(whtr) : undefined} />
        <Stat label="Basal metabolic rate" value={rate ? `${Math.round(rate)} kcal` : dash} note={rate ? 'Mifflin-St Jeor' : undefined} />
        <Stat label="Body fat" value={bodyFat !== undefined ? `${bodyFat}%` : dash} note={lean ? `Lean mass ${lean.toFixed(1)} kg` : undefined} />
      </div>
      {sym.length > 0 && (
        <div className="sym">
          <h3>Left / right symmetry</h3>
          <ul>
            {sym.map((s) => (
              <li key={s.label}>
                <span>{s.label}</span>
                <strong>{s.diff === 0 ? 'Balanced' : `${s.diff.toFixed(1)} cm · ${s.larger} larger`}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
