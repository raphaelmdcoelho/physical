import { useState, type FormEvent } from 'react';
import { MEASURES, MEASURE_LABELS, type MonthEntry } from '../lib/types';
import { MONTH_NAMES } from '../lib/dates';

interface Props {
  year: number;
  month: number;
  entry?: MonthEntry;
  onSave: (entry: MonthEntry) => void;
  onClose: () => void;
}

const toNum = (v: string) => (v.trim() === '' ? undefined : Number(v.replace(',', '.')));

export default function MeasureForm({ year, month, entry, onSave, onClose }: Props) {
  const [vals, setVals] = useState<Record<string, string>>(() => ({
    weight: entry?.weight?.toString() ?? '',
    height: entry?.height?.toString() ?? '',
    bodyFat: entry?.bodyFat?.toString() ?? '',
    ...Object.fromEntries(MEASURES.map((k) => [k, entry?.measures[k]?.toString() ?? ''])),
  }));
  const set = (k: string) => (e: { target: { value: string } }) => setVals((v) => ({ ...v, [k]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const measures: MonthEntry['measures'] = {};
    for (const k of MEASURES) {
      const n = toNum(vals[k]);
      if (n && n > 0) measures[k] = n;
    }
    const pos = (v: string) => {
      const n = toNum(v);
      return n && n > 0 ? n : undefined;
    };
    onSave({ weight: pos(vals.weight), height: pos(vals.height), bodyFat: pos(vals.bodyFat), measures });
    onClose();
  };

  const field = (k: string, label: string, unit: string) => (
    <label className="field" key={k}>
      <span>{label}</span>
      <div className="input-unit">
        <input inputMode="decimal" pattern="[0-9]*[.,]?[0-9]*" value={vals[k]} onChange={set(k)} placeholder="—" />
        <em>{unit}</em>
      </div>
    </label>
  );

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit} role="dialog" aria-modal="true" aria-label="Update body info">
        <header>
          <h2>
            {MONTH_NAMES[month]} {year}
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>
        <h3>Body</h3>
        <div className="grid">
          {field('weight', 'Weight', 'kg')}
          {field('height', 'Height', 'cm')}
          {field('bodyFat', 'Body fat', '%')}
        </div>
        <h3>Muscle measures</h3>
        <div className="grid">{MEASURES.map((k) => field(k, MEASURE_LABELS[k], 'cm'))}</div>
        <footer>
          <button type="button" className="btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary">Save</button>
        </footer>
      </form>
    </div>
  );
}
