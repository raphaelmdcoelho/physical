import type { Gender, MonthEntry } from './types';

export interface Classification {
  label: string;
  tone: 'good' | 'warn' | 'bad' | 'info';
}

export function bmi(weightKg?: number, heightCm?: number): number | undefined {
  if (!weightKg || !heightCm) return undefined;
  const m = heightCm / 100;
  return weightKg / (m * m);
}

export function classifyBmi(value: number): Classification {
  if (value < 18.5) return { label: 'Underweight', tone: 'info' };
  if (value < 25) return { label: 'Healthy weight', tone: 'good' };
  if (value < 30) return { label: 'Overweight', tone: 'warn' };
  return { label: 'Obesity', tone: 'bad' };
}

/** Healthy weight range (BMI 18.5 – 24.9) for a height, in kg. */
export function healthyWeightRange(heightCm?: number): [number, number] | undefined {
  if (!heightCm) return undefined;
  const m2 = (heightCm / 100) ** 2;
  return [18.5 * m2, 24.9 * m2];
}

export function ageFrom(birthdate: string, today = new Date()): number | undefined {
  const b = new Date(birthdate);
  if (Number.isNaN(b.getTime())) return undefined;
  let age = today.getFullYear() - b.getFullYear();
  const beforeBirthday =
    today.getMonth() < b.getMonth() ||
    (today.getMonth() === b.getMonth() && today.getDate() < b.getDate());
  if (beforeBirthday) age--;
  return age;
}

/** Basal metabolic rate, Mifflin-St Jeor equation (kcal/day). */
export function bmr(gender: Gender, weightKg?: number, heightCm?: number, age?: number) {
  if (!weightKg || !heightCm || age === undefined) return undefined;
  return 10 * weightKg + 6.25 * heightCm - 5 * age + (gender === 'male' ? 5 : -161);
}

export function ratio(a?: number, b?: number): number | undefined {
  return a && b ? a / b : undefined;
}

export function classifyWaistHip(value: number, gender: Gender): Classification {
  const [ok, high] = gender === 'male' ? [0.9, 1.0] : [0.8, 0.85];
  if (value < ok) return { label: 'Low risk', tone: 'good' };
  if (value <= high) return { label: 'Moderate risk', tone: 'warn' };
  return { label: 'High risk', tone: 'bad' };
}

export function classifyWaistHeight(value: number): Classification {
  if (value < 0.4) return { label: 'Very lean', tone: 'info' };
  if (value < 0.5) return { label: 'Healthy', tone: 'good' };
  if (value < 0.6) return { label: 'Elevated', tone: 'warn' };
  return { label: 'High', tone: 'bad' };
}

/** Lean mass estimate from weight and body fat %. */
export function leanMass(weightKg?: number, bodyFat?: number): number | undefined {
  if (!weightKg || bodyFat === undefined) return undefined;
  return weightKg * (1 - bodyFat / 100);
}

export function classifyPressure(systolic: number, diastolic: number): Classification {
  if (systolic >= 140 || diastolic >= 90) return { label: 'High (stage 2)', tone: 'bad' };
  if (systolic >= 130 || diastolic >= 80) return { label: 'High (stage 1)', tone: 'warn' };
  if (systolic >= 120) return { label: 'Elevated', tone: 'warn' };
  if (systolic < 90 || diastolic < 60) return { label: 'Low', tone: 'info' };
  return { label: 'Normal', tone: 'good' };
}

/** Left/right pairs and their absolute difference in cm. */
export function symmetry(m: MonthEntry['measures']) {
  const pairs = [
    ['Arm', m.rArm, m.lArm],
    ['Forearm', m.rForearm, m.lForearm],
    ['Thigh', m.rThigh, m.lThigh],
    ['Calf', m.rCalf, m.lCalf],
  ] as const;
  return pairs.flatMap(([label, r, l]) =>
    r && l ? [{ label, diff: Math.abs(r - l), larger: r === l ? '' : r > l ? 'R' : 'L' }] : [],
  );
}
