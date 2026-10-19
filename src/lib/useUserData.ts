import { useCallback, useState } from 'react';
import { loadData, saveData } from './storage';
import type { MonthEntry, PressureReading, UserData } from './types';

export function useUserData(userId: string) {
  const [data, setData] = useState<UserData>(() => loadData(userId));

  const update = useCallback(
    (fn: (d: UserData) => UserData) =>
      setData((prev) => {
        const next = fn(prev);
        saveData(userId, next);
        return next;
      }),
    [userId],
  );

  return {
    data,
    setMonth: (key: string, entry: MonthEntry) =>
      update((d) => ({ ...d, months: { ...d.months, [key]: entry } })),
    addReading: (r: PressureReading) => update((d) => ({ ...d, pressure: [...d.pressure, r] })),
    removeReading: (id: string) => update((d) => ({ ...d, pressure: d.pressure.filter((p) => p.id !== id) })),
  };
}
