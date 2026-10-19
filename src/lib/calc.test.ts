import { describe, expect, it } from 'vitest';
import { ageFrom, bmi, bmr, classifyBmi, classifyPressure, healthyWeightRange, symmetry } from './calc';

describe('calc', () => {
  it('computes BMI', () => {
    expect(bmi(60, 178)).toBeCloseTo(18.94, 2);
    expect(bmi(undefined, 178)).toBeUndefined();
  });

  it('classifies BMI', () => {
    expect(classifyBmi(18).label).toBe('Underweight');
    expect(classifyBmi(22).label).toBe('Healthy weight');
    expect(classifyBmi(27).label).toBe('Overweight');
    expect(classifyBmi(32).label).toBe('Obesity');
  });

  it('gives a healthy weight range', () => {
    const [lo, hi] = healthyWeightRange(180)!;
    expect(lo).toBeCloseTo(59.9, 1);
    expect(hi).toBeCloseTo(80.7, 1);
  });

  it('computes age', () => {
    expect(ageFrom('1990-06-15', new Date('2026-06-14'))).toBe(35);
    expect(ageFrom('1990-06-15', new Date('2026-06-15'))).toBe(36);
  });

  it('computes BMR (Mifflin-St Jeor)', () => {
    expect(bmr('male', 80, 180, 30)).toBe(1780);
    expect(bmr('female', 60, 165, 30)).toBeCloseTo(1320.25, 2);
  });

  it('classifies blood pressure', () => {
    expect(classifyPressure(118, 76).label).toBe('Normal');
    expect(classifyPressure(125, 78).label).toBe('Elevated');
    expect(classifyPressure(135, 85).label).toBe('High (stage 1)');
    expect(classifyPressure(150, 95).label).toBe('High (stage 2)');
    expect(classifyPressure(85, 55).label).toBe('Low');
  });

  it('reports left/right symmetry', () => {
    expect(symmetry({ rArm: 35, lArm: 34 })).toEqual([{ label: 'Arm', diff: 1, larger: 'R' }]);
    expect(symmetry({ rArm: 35 })).toEqual([]);
  });
});
