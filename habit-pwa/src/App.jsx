import { useEffect, useMemo, useState } from "react";
import {
  calcStreak,
  lastNDays,
  loadHabits,
  saveHabits,
  toggleDoneForToday
} from "./lib/habits";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export default function App() {
  const [habits, setHabits] = useState(() => loadHabits());
  const [name, setName] = useState("");

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  const days = useMemo(() => lastNDays(7), []);

  const summary = useMemo(() => {
    const total = habits.length;
    const doneToday = habits.filter(h => (h.doneDates || []).includes(days[6])).length;
    const bestStreak = habits.reduce((m, h) => Math.max(m, calcStreak(h.doneDates)), 0);
    return { total, doneToday, bestStreak };
  }, [habits, days]);

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
    <div className="wrap">
      <header className="header">
        <div>
          <h1>Habits</h1>
          <p className="sub">Streak tracker (PWA • offline)</p>
        </div>

        <form className="add" onSubmit={addHabit}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New habit (e.g. Walk 20 min)"
          />
          <button type="submit">Add</button>
        </form>
      </header>

      <section className="stats">
        <div className="stat">
          <div className="label">Habits</div>
          <div className="value">{summary.total}</div>
        </div>
        <div className="stat">
          <div className="label">Done today</div>
          <div className="value">{summary.doneToday}</div>
        </div>
        <div className="stat">
          <div className="label">Best streak</div>
          <div className="value">{summary.bestStreak}d</div>
        </div>
      </section>

      <section className="grid">
        {habits.map((h) => {
          const streak = calcStreak(h.doneDates);
          const doneToday = (h.doneDates || []).includes(days[6]);

          return (
            <div key={h.id} className="card">
              <div className="row">
                <div className="title">
                  <div className="name">{h.name}</div>
                  <div className="meta">Streak: <b>{streak} day</b></div>
                </div>

                <div className="actions">
                  <button
                    className={"pill " + (doneToday ? "on" : "")}
                    onClick={() => toggle(h.id)}
                    title="Toggle today"
                  >
                    {doneToday ? "Done ✓" : "Mark done"}
                  </button>
                  <button className="ghost" onClick={() => remove(h.id)} title="Delete">
                    ✕
                  </button>
                </div>
              </div>

              <div className="week">
                {days.map((d) => {
                  const ok = (h.doneDates || []).includes(d);
                  return (
                    <div key={d} className={"dot " + (ok ? "ok" : "")} title={d} />
                  );
                })}
              </div>
            </div>
          );
        })}

        {habits.length === 0 && (
          <div className="empty">
            <h2>Start simple.</h2>
            <p>Add a habit and mark it done today. Your streak starts now 👀</p>
          </div>
        )}
      </section>

      <footer className="footer">
        Tip: On mobile, use “Add to Home Screen” to install.
      </footer>
    </div>
  );
}
