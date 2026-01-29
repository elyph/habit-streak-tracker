import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../lib/auth";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login({ email, password });
      nav("/", { replace: true });
    } catch (e2) {
      setErr(e2.message || "Giriş başarısız.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl">
        <h1 className="text-2xl font-bold tracking-tight">Giriş yap</h1>
        <p className="mt-1 text-sm text-slate-400">Habits uygulamana devam et.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm text-slate-300">E-posta</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@mail.com"
              type="email"
              required
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Şifre</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              required
            />
          </div>

          {err && (
            <div className="rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
              {err}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-slate-100 px-4 py-2 font-semibold text-slate-900 hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş yap"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-400">
          Hesabın yok mu?{" "}
          <Link className="text-slate-200 underline" to="/register">
            Kayıt ol
          </Link>
        </p>
      </div>
    </div>
  );
}
