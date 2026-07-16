import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, CalendarCheck, Image as ImageIcon, UtensilsCrossed, Clock, Briefcase, Mail, LogOut, Menu, X, PartyPopper, Inbox, Crown, Cigarette, Settings } from "lucide-react";
import { useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/reservations", label: "Reservierungen", icon: CalendarCheck },
  { to: "/admin/events", label: "Events", icon: PartyPopper },
  { to: "/admin/gallery", label: "Galerie", icon: ImageIcon },
  { to: "/admin/lounge", label: "Lounge Bilder", icon: Cigarette },
  { to: "/admin/members", label: "Members", icon: Crown },
  { to: "/admin/menu", label: "Speisekarte", icon: UtensilsCrossed },
  { to: "/admin/hours", label: "Öffnungszeiten", icon: Clock },
  { to: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { to: "/admin/applications", label: "Bewerbungen", icon: Inbox },
  { to: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { to: "/admin/settings", label: "Einstellungen", icon: Settings },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const isActive = (to: string, exact?: boolean) => exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen flex" style={{ background: "#F6F1EA" }}>
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0" style={{ background: "#0D2517", color: "#F3E7D7" }}>
        <SidebarBody signOut={signOut} isActive={isActive} onNavigate={() => {}} />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between px-4 h-14 border-b" style={{ background: "#0D2517", color: "#F3E7D7", borderColor: "rgba(233,165,128,0.2)" }}>
        <span className="font-display text-lg">Amaya Admin</span>
        <button onClick={() => setMobileOpen(true)} aria-label="Menü" className="p-2"><Menu size={20} /></button>
      </div>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 flex flex-col" style={{ background: "#0D2517", color: "#F3E7D7" }}>
            <button onClick={() => setMobileOpen(false)} className="absolute top-3 right-3 p-2" aria-label="Schließen"><X size={20} /></button>
            <SidebarBody signOut={signOut} isActive={isActive} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-h-screen text-[#1a1815]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarBody({ signOut, isActive, onNavigate }: {
  signOut: () => void; isActive: (to: string, exact?: boolean) => boolean; onNavigate: () => void;
}) {
  return (
    <>
      <div className="px-6 py-6 border-b" style={{ borderColor: "rgba(233,165,128,0.15)" }}>
        <p className="text-xs tracking-[0.3em] uppercase" style={{ color: "#E9A580" }}>Amaya</p>
        <h2 className="font-display text-2xl mt-1">Admin</h2>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = isActive(item.to, item.exact);
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to} onClick={onNavigate}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition"
              style={{
                background: active ? "#E9A580" : "transparent",
                color: active ? "#0D2517" : "#F3E7D7",
                fontWeight: active ? 600 : 400,
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t" style={{ borderColor: "rgba(233,165,128,0.15)" }}>
        <button onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm hover:bg-[#143020] transition"
          style={{ color: "#F3E7D7" }}>
          <LogOut size={18} /> Abmelden
        </button>
      </div>
    </>
  );
}
