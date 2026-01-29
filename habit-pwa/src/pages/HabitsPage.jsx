import { useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "../lib/auth";
import {
  calcStreak,
  lastNDays,
  loadHabits,
  saveHabits,
  toggleDoneForToday,
  calcBestStreak
} from "../lib/habits";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export default function HabitsPage() {
  const user = getCurrentUser();
  const userId = user?.id || "guest";

  const [habits, setHabits] = useState(() => loadHabits(userId));
  const [name, setName] = useState("");

  useEffect(() => {
    saveHabits(userId, habits);
  }, [habits, userId]);

  const days = useMemo(() => lastNDays(7), []);
  const todayKey = days[6];

  const summary = useMemo(() => {
    const total = habits.length;
    const doneToday = habits.filter(h => (h.doneDates || []).includes(todayKey)).length;
    const bestStreak = calcBestStreak(habits);
    return { total, doneToday, bestStreak };
  }, [habits, todayKey]);

  function addHabit(e) {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    setHabits([{ id: uid(), name: n, doneDates: [] }, ...habits]);
    setName("");
  }

  function toggle(id) {
    setHabits(habits.map(h => (h.id === id ? toggleDoneForToday(h) : h)));
  }

  function remove(id) {
    setHabits(habits.filter(h => h.id !== id));
  }

  return (
    <div className="space-y-4">
      {/* header row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Habits</h1>
          <p className="text-sm text-slate-400">Streak tracker (PWA • offline)</p>
        </div>

        <form onSubmit={addHabit} className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Yeni alışkanlık (örn: 20 dk yürüyüş)"
            className="w-full sm:w-96 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-600"
          />
          <button className="rounded-xl bg-slate-100 px-4 py-2 font-semibold text-slate-900 hover:opacity-90">
            Ekle
          </button>
        </form>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
          <div className="text-xs text-slate-400">Habits</div>
          <div className="mt-2 text-2xl font-bold">{summary.total}</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
          <div className="text-xs text-slate-400">Bugün yapılan</div>
          <div className="mt-2 text-2xl font-bold">{summary.doneToday}</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
          <div className="text-xs text-slate-400">En iyi seri</div>
          <div className="mt-2 text-2xl font-bold">{summary.bestStreak}g</div>
        </div>
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {habits.map((h) => {
          const streak = calcStreak(h.doneDates);
          const doneToday = (h.doneDates || []).includes(todayKey);

          return (
            <div key={h.id} className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{h.name}</div>
                  <div className="mt-1 text-sm text-slate-400">
                    Seri: <b className="text-slate-200">{streak} gün</b>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className={
                      "rounded-full px-3 py-2 text-sm border " +
                      (doneToday
                        ? "border-emerald-700 bg-emerald-950/40 text-emerald-200"
                        : "border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-900")
                    }
                    onClick={() => toggle(h.id)}
                  >
                    {doneToday ? "Done ✓" : "Bugün yaptım"}
                  </button>
                  <button
                    className="rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/40"
                    onClick={() => remove(h.id)}
                    title="Sil"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                {days.map((d) => {
                  const ok = (h.doneDates || []).includes(d);
                  return (
                    <div
                      key={d}
                      title={d}
                      className={"h-2.5 w-2.5 rounded-full " + (ok ? "bg-emerald-400" : "bg-slate-700")}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {habits.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/20 p-6">
            <h2 className="text-xl font-semibold">Start simple.</h2>
            <p className="mt-2 text-sm text-slate-400">
              Bir alışkanlık ekle ve bugün tamamla. Seri şimdi başlıyor 👀
            </p>
          </div>
        )}
      </div>

      <p className="text-sm text-slate-500">
        İpucu: Mobilde “Add to Home Screen” ile uygulama gibi kurabilirsin.
      </p>
    </div>
  );
}
