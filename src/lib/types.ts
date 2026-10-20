export type Gender = 'male' | 'female';

export interface User {
  id: string;
  name: string;
  email: string;
  gender: Gender;
  birthdate: string; // YYYY-MM-DD
}

export const MEASURES = [
  'chest',
  'waist',
  'hips',
  'rArm',
  'lArm',
  'rForearm',
  'lForearm',
  'rThigh',
  'lThigh',
  'rCalf',
  'lCalf',
] as const;
export type MeasureKey = (typeof MEASURES)[number];

export const MEASURE_LABELS: Record<MeasureKey, string> = {
  chest: 'Chest',
  waist: 'Waist',
  hips: 'Hips',
  rArm: 'R arm',
  lArm: 'L arm',
  rForearm: 'R forearm',
  lForearm: 'L forearm',
  rThigh: 'R thigh',
  lThigh: 'L thigh',
  rCalf: 'R calf',
  lCalf: 'L calf',
};

/** Body info for one month. Measures are in cm, weight in kg, height in cm. */
export interface MonthEntry {
  weight?: number;
  height?: number;
  bodyFat?: number;
  measures: Partial<Record<MeasureKey, number>>;
}

export interface PressureReading {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  systolic: number;
  diastolic: number;
  pulse?: number;
}

export interface UserData {
  /** keyed by YYYY-MM */
  months: Record<string, MonthEntry>;
  pressure: PressureReading[];
}
