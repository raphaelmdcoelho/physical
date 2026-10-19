import { useEffect, useRef, useState, type FormEvent } from 'react';
import { MEASURES, MEASURE_LABELS, type MeasureKey, type MonthEntry } from '../lib/types';
import { MONTH_NAMES } from '../lib/dates';

interface Props {
  year: number;
  month: number;
  entry?: MonthEntry;
  onSave: (entry: MonthEntry) => void;
  onClose: () => void;
}

// Head to toe; paired rows put the right side on the viewer's left, like the figure.
const MEASURE_ROWS: MeasureKey[][] = [
  ['neck'],
  ['rShoulder', 'lShoulder'],
  ['chest'],
  ['rArm', 'lArm'],
  ['waist'],
  ['rForearm', 'lForearm'],
  ['hips'],
  ['rThigh', 'lThigh'],
  ['rCalf', 'lCalf'],
];

const toNum = (v: string) => (v.trim() === '' ? undefined : Number(v.replace(',', '.')));

export default function MeasureForm({ year, month, entry, onSave, onClose }: Props) {
  const [vals, setVals] = useState<Record<string, string>>(() => ({
    weight: entry?.weight?.toString() ?? '',
    height: entry?.height?.toString() ?? '',
    bodyFat: entry?.bodyFat?.toString() ?? '',
    ...Object.fromEntries(MEASURES.map((k) => [k, entry?.measures[k]?.toString() ?? ''])),
  }));
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
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
    <div className="gr-field" key={k}>
      <label className="gr-field__label" htmlFor={`m-${k}`}>{label}</label>
      <div className="input-unit">
        <input id={`m-${k}`} className="gr-text-field" inputMode="decimal" pattern="[0-9]*[.,]?[0-9]*" value={vals[k]} onChange={set(k)} placeholder="—" />
        <em>{unit}</em>
      </div>
    </div>
  );

  return (
    <dialog ref={dialog} className="gr-dialog" data-size="lg" aria-labelledby="measure-title" onClose={onClose}>
      <form onSubmit={submit}>
        <div className="gr-dialog__header">
          <h2 className="gr-dialog__title" id="measure-title">
            {MONTH_NAMES[month]} {year}
          </h2>
        </div>
        <div className="gr-dialog__body">
          <h3>Body</h3>
          <div className="grid">
            {field('weight', 'Weight', 'kg')}
            {field('height', 'Height', 'cm')}
            {field('bodyFat', 'Body fat', '%')}
          </div>
          <h3>Muscle measures · top to bottom</h3>
          <p className="muted small">Right side on the left, left side on the right, as seen in the front view.</p>
          <div className="measure-rows">
            {MEASURE_ROWS.map((row) => (
              <div key={row.join()} className="measure-row" data-single={row.length === 1}>
                {row.map((k) => field(k, MEASURE_LABELS[k], 'cm'))}
              </div>
            ))}
          </div>
        </div>
        <div className="gr-dialog__footer">
          <button type="button" className="gr-button" data-variant="secondary" onClick={() => dialog.current?.close()}>
            Cancel
          </button>
          <button className="gr-button">Save</button>
        </div>
      </form>
    </dialog>
  );
}
