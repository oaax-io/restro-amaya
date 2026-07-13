import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/admin" });
  },
  head: () => ({ meta: [{ title: "Admin Login — Amaya" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.add("bg-[#07150C]");
    return () => document.body.classList.remove("bg-[#07150C]");
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    navigate({ to: "/admin" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#07150C" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="mono-label text-[#E9A580]">Amaya · Intern</p>
          <h1 className="font-display text-4xl mt-3 text-[#F3E7D7]">Admin Login</h1>
        </div>
        <form onSubmit={onSubmit} className="bg-[#0D2517] border border-[#E9A580]/20 rounded-lg p-8 space-y-5 shadow-2xl">
          <div>
            <label className="block text-xs tracking-[0.25em] uppercase text-[#F3E7D7]/70 mb-2">E-Mail</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#07150C] border border-[#E9A580]/20 rounded px-4 py-3 text-[#F3E7D7] focus:outline-none focus:border-[#E9A580]" />
          </div>
          <div>
            <label className="block text-xs tracking-[0.25em] uppercase text-[#F3E7D7]/70 mb-2">Passwort</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#07150C] border border-[#E9A580]/20 rounded px-4 py-3 text-[#F3E7D7] focus:outline-none focus:border-[#E9A580]" />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded bg-[#E9A580] text-[#0D2517] font-semibold tracking-[0.2em] uppercase text-sm hover:bg-[#F4C9B0] transition disabled:opacity-60">
            {loading ? "..." : "Anmelden"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-[#F3E7D7]/50">
          Nur für autorisierte Personen. Keine öffentliche Registrierung.
        </p>
      </div>
    </div>
  );
}
