const KEY = "habits_v1";

export function dateKey(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function loadHabits() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHabits(habits) {
  localStorage.setItem(KEY, JSON.stringify(habits));
}

export function toggleDoneForToday(habit) {
  const today = dateKey();
  const done = new Set(habit.doneDates || []);
  if (done.has(today)) done.delete(today);
  else done.add(today);
  return { ...habit, doneDates: [...done].sort() };
}

export function calcStreak(doneDates) {
  // bugün dahil geriye doğru: ardışık gün sayısı
  const done = new Set(doneDates || []);
  let streak = 0;
  let d = new Date();
  d.setHours(0, 0, 0, 0);

  while (done.has(dateKey(d))) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function lastNDays(n = 7) {
  const out = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 0; i < n; i++) {
    out.push(dateKey(d));
    d.setDate(d.getDate() - 1);
  }
  return out.reverse();
}
