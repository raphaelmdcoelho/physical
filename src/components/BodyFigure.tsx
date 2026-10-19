import { useState } from 'react';
import { MEASURE_LABELS, type Gender, type MeasureKey, type MonthEntry } from '../lib/types';

type Side = 'left' | 'right';
interface Spot {
  key: MeasureKey;
  /** dot position as % of the figure box */
  x: number;
  y: number;
  /** which label column it belongs to (viewer's perspective) */
  side: Side;
}

// Front view: the person's right side is on the viewer's left.
const FRONT: Spot[] = [
  { key: 'neck', x: 49, y: 15, side: 'left' },
  { key: 'rShoulder', x: 27, y: 18, side: 'left' },
  { key: 'rArm', x: 22, y: 27, side: 'left' },
  { key: 'waist', x: 46, y: 36, side: 'left' },
  { key: 'rForearm', x: 14, y: 43, side: 'left' },
  { key: 'hips', x: 42, y: 47, side: 'left' },
  { key: 'rThigh', x: 33, y: 62, side: 'left' },
  { key: 'rCalf', x: 38, y: 80, side: 'left' },
  { key: 'lShoulder', x: 74, y: 18, side: 'right' },
  { key: 'chest', x: 62, y: 23, side: 'right' },
  { key: 'lArm', x: 79, y: 27, side: 'right' },
  { key: 'lForearm', x: 86, y: 43, side: 'right' },
  { key: 'lThigh', x: 63, y: 62, side: 'right' },
  { key: 'lCalf', x: 60, y: 80, side: 'right' },
];

// Back view mirrors left/right; only measures visible from behind get a dot.
const BACK: Spot[] = [
  { key: 'neck', x: 50, y: 14, side: 'left' },
  { key: 'lShoulder', x: 30, y: 18, side: 'left' },
  { key: 'lArm', x: 21, y: 26, side: 'left' },
  { key: 'waist', x: 50, y: 37, side: 'left' },
  { key: 'lForearm', x: 14, y: 43, side: 'left' },
  { key: 'lThigh', x: 33, y: 62, side: 'left' },
  { key: 'lCalf', x: 34, y: 80, side: 'left' },
  { key: 'rShoulder', x: 70, y: 18, side: 'right' },
  { key: 'rArm', x: 79, y: 26, side: 'right' },
  { key: 'rForearm', x: 86, y: 43, side: 'right' },
  { key: 'hips', x: 52, y: 46, side: 'right' },
  { key: 'rThigh', x: 66, y: 62, side: 'right' },
  { key: 'rCalf', x: 66, y: 80, side: 'right' },
];

const base = import.meta.env.BASE_URL;

function FemaleFrame() {
  return (
    <svg className="figure-img figure-simple" viewBox="0 0 288 701" role="img" aria-label="Female body frame">
      <defs>
        <linearGradient id="fem" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0a39a" />
          <stop offset="1" stopColor="#d9736a" />
        </linearGradient>
      </defs>
      <g fill="url(#fem)" opacity="0.92">
        <ellipse cx="144" cy="52" rx="30" ry="38" />
        <rect x="132" y="86" width="24" height="30" rx="8" />
        {/* torso: shoulders -> waist -> hips */}
        <path d="M144 108c-30 0-66 10-80 30-8 14-10 40-10 70l24 4c4 40 2 60-6 80-6 14-2 34 10 46l34 6h56l34-6c12-12 16-32 10-46-8-20-10-40-6-80l24-4c0-30-2-56-10-70-14-20-50-30-80-30z" />
        {/* arms */}
        <path d="M64 138c-14 10-24 40-28 80s-8 70-14 100l22 6c10-30 22-60 28-100 4-30 2-60-8-86z" />
        <path d="M224 138c14 10 24 40 28 80s8 70 14 100l-22 6c-10-30-22-60-28-100-4-30-2-60 8-86z" />
        {/* pelvis + legs */}
        <path d="M86 290h116l12 100H76z" />
        <path d="M96 370c-12 70-22 130-20 190 2 50 6 90 8 130h28c2-40 0-80 2-130 2-70 10-130 12-190z" />
        <path d="M192 370c12 70 22 130 20 190-2 50-6 90-8 130h-28c-2-40 0-80-2-130-2-70-10-130-12-190z" />
      </g>
    </svg>
  );
}

interface Props {
  gender: Gender;
  entry?: MonthEntry;
  onEdit: () => void;
}

export default function BodyFigure({ gender, entry, onEdit }: Props) {
  const [view, setView] = useState<'front' | 'back'>('front');
  const spots = view === 'front' ? FRONT : BACK;
  const columns: Record<Side, Spot[]> = {
    left: spots.filter((s) => s.side === 'left'),
    right: spots.filter((s) => s.side === 'right'),
  };
  const slotY = (i: number, n: number) => 6 + (i * 88) / (n - 1);

  return (
    <div className="figure-wrap">
      <div className="seg" role="tablist" aria-label="Body view">
        {(['front', 'back'] as const).map((v) => (
          <button key={v} role="tab" aria-selected={view === v} className={view === v ? 'on' : ''} onClick={() => setView(v)}>
            {v === 'front' ? 'Front' : 'Back'}
          </button>
        ))}
      </div>

      <div className="stage">
        <div className="figure">
          {gender === 'male' ? (
            <img className="figure-img" src={`${base}body/male-${view}.png`} alt={`Male muscle map, ${view}`} />
          ) : (
            <FemaleFrame />
          )}
          {spots.map((s) => (
            <span key={s.key} className={`dot ${entry?.measures[s.key] ? 'has' : ''}`} style={{ left: `${s.x}%`, top: `${s.y}%` }} />
          ))}
        </div>

        <svg className="leaders" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {(['left', 'right'] as const).flatMap((side) =>
            columns[side].map((s, i) => {
              const ly = slotY(i, columns[side].length);
              const figX = 28 + (s.x / 100) * 44; // figure occupies the middle 44% of the stage
              const edge = side === 'left' ? 24 : 76;
              return (
                <polyline
                  key={s.key}
                  points={`${edge},${ly} ${edge + (side === 'left' ? 2 : -2)},${ly} ${figX},${s.y}`}
                  vectorEffect="non-scaling-stroke"
                />
              );
            }),
          )}
        </svg>

        {(['left', 'right'] as const).map((side) => (
          <div key={side} className={`labels ${side}`}>
            {columns[side].map((s, i) => {
              const v = entry?.measures[s.key];
              return (
                <button key={s.key} className="label" style={{ top: `${slotY(i, columns[side].length)}%` }} onClick={onEdit}>
                  <span className="label-name">{MEASURE_LABELS[s.key]}</span>
                  <span className={`label-val ${v ? '' : 'empty'}`}>{v ? `${v} cm` : '—'}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
