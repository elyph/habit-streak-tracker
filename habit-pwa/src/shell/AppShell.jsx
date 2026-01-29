import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../lib/auth";

function Item({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition " +
        (isActive
          ? "bg-[rgb(var(--accent)/0.14)] text-white ring-1 ring-[rgb(var(--accent)/0.35)]"
          : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--accent)/0.08)] hover:text-[rgb(var(--text))]")
      }
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

export default function AppShell() {
  const nav = useNavigate();
  const user = getCurrentUser();

  function onLogout() {
    logout();
    nav("/login", { replace: true });
  }

  return (
    <div className="min-h-screen">
      {/* theme gradient / glow */}
      <div className="pointer-events-none fixed inset-0 app-glow" />

      <div className="relative mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="md:sticky md:top-6 md:h-[calc(100vh-48px)]">
            <div className="panel rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold tracking-tight">Habits</div>
                  <div className="mt-1 text-xs text-muted">
                    {user?.name || "User"}
                  </div>
                </div>

                <div className="rounded-xl border border-[rgb(var(--border)/0.75)] bg-[rgb(var(--bg)/0.35)] px-2 py-1 text-[11px] text-muted">
                  PWA
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <Item to="/" icon="✅" label="Dashboard" />
              </div>

              <button
                onClick={onLogout}
                className="mt-4 w-full rounded-xl border border-[rgb(var(--border)/0.75)] bg-[rgb(var(--bg)/0.35)] px-3 py-2 text-left text-sm text-[rgb(var(--muted))] transition hover:bg-[rgb(var(--accent)/0.08)] hover:text-[rgb(var(--text))]"
              >
                🚪 Çıkış yap
              </button>

              <div className="mt-4 border-t border-[rgb(var(--border)/0.75)] pt-4 text-xs text-muted">
                {user?.email}
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="space-y-4">
            {/* Topbar */}
            <div className="panel rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-muted">Dashboard</div>
                  <div className="text-lg font-semibold tracking-tight">
                    Günlük takibin
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="btn-primary rounded-2xl px-3.5 py-2 text-sm font-semibold shadow hover:opacity-90"
                >
                  Çıkış
                </button>
              </div>
            </div>

            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
