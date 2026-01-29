export function dateKey(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString().slice(0, 10); // YYYY-MM-DD
}

function keyForUser(userId) {
  return `habits_${userId}_v1`;
}

export function loadHabits(userId) {
  try {
    const raw = localStorage.getItem(keyForUser(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHabits(userId, habits) {
  localStorage.setItem(keyForUser(userId), JSON.stringify(habits));
}

export function toggleDoneForToday(habit) {
  const today = dateKey();
  const done = new Set(habit.doneDates || []);
  if (done.has(today)) done.delete(today);
  else done.add(today);
  return { ...habit, doneDates: [...done].sort() };
}

function percentile(arr, p) {
  if (!arr.length) return null;
  const s = [...arr].sort((a, b) => a - b);
  const i = Math.floor((p / 100) * (s.length - 1));
  return s[i];
}

export function calcStreak(doneDates) {
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

export function calcBestStreak(habits) {
  const streaks = habits.map(h => calcStreak(h.doneDates));
  return percentile(streaks, 100) ?? 0;
}
