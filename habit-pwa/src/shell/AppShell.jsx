import { Link, Outlet, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../lib/auth";

export default function AppShell() {
  const nav = useNavigate();
  const user = getCurrentUser();

  function onLogout() {
    logout();
    nav("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
              <div className="text-lg font-bold">Habits</div>
              <div className="mt-1 text-sm text-slate-400">
                {user?.name || "User"}
              </div>

              <nav className="mt-6 space-y-2">
                <Link
                  to="/"
                  className="block rounded-xl px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/40"
                >
                  ✅ Habits
                </Link>
                <button
                  onClick={onLogout}
                  className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800/40"
                >
                  🚪 Çıkış yap
                </button>
              </nav>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1">
            {/* Topbar */}
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
              <div>
                <div className="text-sm text-slate-400">Dashboard</div>
                <div className="text-lg font-semibold">Günlük takibin</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-300 hidden sm:block">
                  {user?.email}
                </div>
                <button
                  onClick={onLogout}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm hover:bg-slate-900"
                >
                  Çıkış
                </button>
              </div>
            </div>

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
