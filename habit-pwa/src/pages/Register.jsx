import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../lib/auth";

export default function Register() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await register({ name, email, password });
      nav("/", { replace: true });
    } catch (e2) {
      setErr(e2.message || "Kayıt başarısız.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* theme glow */}
      <div className="pointer-events-none absolute inset-0 app-glow" />

      <div className="relative grid min-h-screen place-items-center p-6">
        <div className="w-full max-w-md">
          {/* small brand */}
          <div className="mb-6 flex items-center justify-center gap-2 text-sm text-muted">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-[rgb(var(--border)/0.75)] bg-[rgb(var(--panel)/0.35)]">
              
            </span>
            <span className="tracking-tight">Habits</span>
          </div>

          {/* card */}
          <div className="card rounded-3xl p-6 shadow-2xl">
            <h1 className="text-2xl font-semibold tracking-tight">Kayıt ol</h1>
            <p className="mt-1 text-sm text-muted">Yeni bir hesap oluştur.</p>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="text-sm text-[rgb(var(--text))]">İsim</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-[rgb(var(--border)/0.75)] bg-[rgb(var(--bg)/0.35)] px-3 py-2 text-sm outline-none placeholder:text-[rgb(var(--muted))] ring-accent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Elif"
                />
              </div>

              <div>
                <label className="text-sm text-[rgb(var(--text))]">E-posta</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-[rgb(var(--border)/0.75)] bg-[rgb(var(--bg)/0.35)] px-3 py-2 text-sm outline-none placeholder:text-[rgb(var(--muted))] ring-accent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@mail.com"
                  type="email"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-[rgb(var(--text))]">Şifre</label>
                  <span className="text-xs text-muted">min 6</span>
                </div>
                <input
                  className="mt-2 w-full rounded-2xl border border-[rgb(var(--border)/0.75)] bg-[rgb(var(--bg)/0.35)] px-3 py-2 text-sm outline-none placeholder:text-[rgb(var(--muted))] ring-accent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  required
                />
              </div>

              {err && (
                <div className="rounded-2xl border border-[rgb(127_29_29/0.7)] bg-[rgb(69_10_10/0.35)] px-3 py-2 text-sm text-[rgb(254_202_202)]">
                  {err}
                </div>
              )}

              <button
                disabled={loading}
                className="btn-primary w-full rounded-2xl px-4 py-2.5 text-sm font-semibold shadow disabled:opacity-60"
              >
                {loading ? "Oluşturuluyor..." : "Hesap oluştur"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-muted">
              Zaten hesabın var mı?{" "}
              <Link
                className="text-[rgb(var(--accent))] underline underline-offset-4 hover:opacity-90"
                to="/login"
              >
                Giriş yap
              </Link>
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-muted">
            PWA • Offline-first • Local storage
          </p>
        </div>
      </div>
    </div>
  );
}
