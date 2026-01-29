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
    const doneToday = habits.filter((h) => (h.doneDates || []).includes(todayKey)).length;
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
    setHabits(habits.map((h) => (h.id === id ? toggleDoneForToday(h) : h)));
  }

  function remove(id) {
    setHabits(habits.filter((h) => h.id !== id));
  }

  return (
    <div className="space-y-4">
      {/* header row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Habits</h1>
          <p className="mt-1 text-sm text-muted">Streak tracker • offline-first</p>
        </div>

        <form onSubmit={addHabit} className="flex w-full sm:w-auto gap-2">
          <div className="flex w-full sm:w-[420px] items-center gap-2 rounded-2xl border border-[rgb(var(--border)/0.75)] bg-[rgb(var(--bg)/0.35)] px-3 py-2">
            <span className="text-[rgb(var(--muted))]">＋</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Yeni alışkanlık ekle…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[rgb(var(--muted))]"
            />
          </div>

          <button className="btn-primary rounded-2xl px-4 py-2 text-sm font-semibold shadow hover:opacity-90">
            Ekle
          </button>
        </form>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Toplam", value: summary.total },
          { label: "Bugün", value: summary.doneToday },
          { label: "En iyi seri", value: `${summary.bestStreak}g` }
        ].map((x) => (
          <div key={x.label} className="card rounded-2xl p-4">
            <div className="text-xs text-muted">{x.label}</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight">{x.value}</div>
          </div>
        ))}
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {habits.map((h) => {
          const streak = calcStreak(h.doneDates);
          const doneToday = (h.doneDates || []).includes(todayKey);

          return (
            <div
              key={h.id}
              className="card rounded-2xl p-4 transition hover:border-[rgb(var(--accent)/0.35)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold truncate">{h.name}</div>
                  <div className="mt-1 text-sm text-muted">
                    Seri:{" "}
                    <b className="text-[rgb(var(--text))]">{streak} gün</b>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className={
                      "rounded-xl px-3 py-2 text-sm font-medium transition ring-1 " +
                      (doneToday
                        ? "bg-[rgb(var(--accent)/0.14)] text-white ring-[rgb(var(--accent)/0.35)]"
                        : "bg-[rgb(var(--bg)/0.35)] text-[rgb(var(--text))] ring-[rgb(var(--border)/0.75)] hover:bg-[rgb(var(--accent)/0.08)]")
                    }
                    onClick={() => toggle(h.id)}
                  >
                    {doneToday ? "Done ✓" : "Bugün yaptım"}
                  </button>

                  <button
                    className="rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-[rgb(var(--accent)/0.08)] hover:text-[rgb(var(--text))]"
                    onClick={() => remove(h.id)}
                    title="Sil"
                  >
                    Sil
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
                      className={
                        "h-2.5 w-2.5 rounded-full ring-1 ring-[rgb(var(--border)/0.75)] " +
                        (ok ? "bg-[rgb(var(--accent))]" : "bg-[rgb(var(--border)/0.6)]")
                      }
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {habits.length === 0 && (
          <div className="card rounded-2xl p-6 border-dashed">
            <h2 className="text-xl font-semibold tracking-tight">Start simple.</h2>
            <p className="mt-2 text-sm text-muted">
              Bir alışkanlık ekle ve bugün tamamla. Seri şimdi başlıyor 👀
            </p>
          </div>
        )}
      </div>

      <p className="text-sm text-muted">
        İpucu: Mobilde “Add to Home Screen” ile uygulama gibi kurabilirsin.
      </p>
    </div>
  );
}
