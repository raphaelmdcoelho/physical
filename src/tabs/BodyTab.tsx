import { useState } from 'react';
import BodyFigure from '../components/BodyFigure';
import MeasureForm from '../components/MeasureForm';
import Stats from '../components/Stats';
import { MONTH_NAMES, monthKey } from '../lib/dates';
import type { MonthEntry, User } from '../lib/types';

interface Props {
  user: User;
  year: number;
  months: Record<string, MonthEntry>;
  onSave: (key: string, entry: MonthEntry) => void;
}

export default function BodyTab({ user, year, months, onSave }: Props) {
  const [month, setMonth] = useState(new Date().getMonth());
  const [editing, setEditing] = useState(false);
  const key = monthKey(year, month);
  const entry = months[key];

  return (
    <section>
      <div className="toolbar">
        <div className="select">
          <select className="select-control" value={month} onChange={(e) => setMonth(Number(e.target.value))} aria-label="Month">
            {MONTH_NAMES.map((name, i) => (
              <option key={name} value={i}>
                {name} {year}
              </option>
            ))}
          </select>
        </div>
        <button className="gr-button" data-variant="secondary" onClick={() => setEditing(true)} aria-label="Update muscle values" title="Update muscle values">
          ✎
        </button>
      </div>

      <div className="gr-card">
        <div className="gr-card__body">
          <BodyFigure gender={user.gender} entry={entry} onEdit={() => setEditing(true)} />
        </div>
      </div>

      <div className="gr-card">
        <div className="gr-card__body">
          <Stats user={user} entry={entry} />
        </div>
      </div>

      {editing && (
        <MeasureForm key={key} year={year} month={month} entry={entry} onSave={(e) => onSave(key, e)} onClose={() => setEditing(false)} />
      )}
    </section>
  );
}
