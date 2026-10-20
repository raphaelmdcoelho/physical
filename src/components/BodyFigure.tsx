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

// Front view: the person's right side is on the viewer's left. Positions are % of the figure box.
const FEMALE_SPOTS: Spot[] = [
  { key: 'rArm', x: 34, y: 33, side: 'left' },
  { key: 'waist', x: 43, y: 39, side: 'left' },
  { key: 'rForearm', x: 26, y: 45, side: 'left' },
  { key: 'hips', x: 40, y: 47, side: 'left' },
  { key: 'rThigh', x: 41, y: 62, side: 'left' },
  { key: 'rCalf', x: 40, y: 77, side: 'left' },
  { key: 'chest', x: 59, y: 30, side: 'right' },
  { key: 'lArm', x: 66, y: 33, side: 'right' },
  { key: 'lForearm', x: 74, y: 45, side: 'right' },
  { key: 'lThigh', x: 59, y: 62, side: 'right' },
  { key: 'lCalf', x: 60, y: 77, side: 'right' },
];

const MALE_SPOTS: Spot[] = [
  { key: 'rArm', x: 26, y: 36, side: 'left' },
  { key: 'waist', x: 49, y: 39, side: 'left' },
  { key: 'rForearm', x: 22, y: 45, side: 'left' },
  { key: 'hips', x: 47, y: 49, side: 'left' },
  { key: 'rThigh', x: 39, y: 62, side: 'left' },
  { key: 'rCalf', x: 38, y: 77, side: 'left' },
  { key: 'chest', x: 58, y: 29, side: 'right' },
  { key: 'lArm', x: 74, y: 36, side: 'right' },
  { key: 'lForearm', x: 79, y: 45, side: 'right' },
  { key: 'lThigh', x: 61, y: 62, side: 'right' },
  { key: 'lCalf', x: 62, y: 77, side: 'right' },
];

// The figure box follows each artwork's aspect ratio so the dots stay on the body.
const LAYOUT = {
  male: { spots: MALE_SPOTS, left: 24, width: 52, aspect: '100 / 78' },
  female: { spots: FEMALE_SPOTS, left: 24, width: 52, aspect: '100 / 78' },
} as const;

const base = import.meta.env.BASE_URL;

interface Props {
  gender: Gender;
  entry?: MonthEntry;
  onEdit: () => void;
}

export default function BodyFigure({ gender, entry, onEdit }: Props) {
  const { spots, left, width, aspect } = LAYOUT[gender];
  const columns: Record<Side, Spot[]> = {
    left: spots.filter((s) => s.side === 'left'),
    right: spots.filter((s) => s.side === 'right'),
  };
  const slotY = (i: number, n: number) => 6 + (i * 88) / (n - 1);

  return (
    <div className="figure-wrap">
      <div className="stage" style={{ aspectRatio: aspect }}>
        <div className="figure" style={{ left: `${left}%`, width: `${width}%` }}>
          <img className="figure-img" src={`${base}body/${gender}-body.png`} alt={`${gender === 'male' ? 'Male' : 'Female'} muscle map`} />
          {spots.map((s) => (
            <span key={s.key} className={`dot ${entry?.measures[s.key] ? 'has' : ''}`} style={{ left: `${s.x}%`, top: `${s.y}%` }} />
          ))}
        </div>

        <svg className="leaders" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {(['left', 'right'] as const).flatMap((side) =>
            columns[side].map((s, i) => {
              const ly = slotY(i, columns[side].length);
              const figX = left + (s.x / 100) * width;
              const edge = side === 'left' ? left : left + width;
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
