import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { confirmEventBooking } from "@/lib/events.functions";
import { getStripeEnvironment } from "@/lib/stripe";
import { formatChf } from "@/lib/event-pricing";

export const Route = createFileRoute("/event-booking")({
  validateSearch: (s: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof s.session_id === "string" ? s.session_id : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Buchungsbestätigung — Amaya Events" },
      { name: "description", content: "Deine Event-Buchung im Amaya Rothenburg." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Buchungsbestätigung — Amaya Events" },
      { property: "og:description", content: "Deine Event-Buchung im Amaya Rothenburg." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BookingReturn,
});

type Info = { status: string; paymentStatus: string; mode: string; persons: number; amount: number; title: string; eventDate: string | null };

function BookingReturn() {
  const { session_id } = Route.useSearch();
  const [info, setInfo] = useState<Info | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!session_id) { setErr("Keine Buchung gefunden."); return; }
    confirmEventBooking({ data: { sessionId: session_id, environment: getStripeEnvironment() } })
      .then((r) => ("error" in r ? setErr(r.error) : setInfo(r)))
      .catch((e) => setErr(String(e?.message ?? e)));
  }, [session_id]);

  const ok = info && info.status !== "pending";

  return (
    <SiteLayout>
      <section className="pt-40 pb-28">
        <div className="mx-auto max-w-xl px-6 text-center">
          {!info && !err && <Loader2 className="mx-auto animate-spin text-accent" size={40} />}
          {err && (<><AlertCircle className="mx-auto text-accent" size={44} /><p className="mt-4 text-muted-foreground">{err}</p></>)}
          {info && (
            <>
              {ok ? <CheckCircle2 className="mx-auto text-accent" size={52} /> : <Loader2 className="mx-auto animate-spin text-accent" size={40} />}
              <h1 className="font-display text-4xl lg:text-5xl uppercase font-bold mt-6 text-gradient-gold">
                {ok ? "Du bist dabei!" : "Buchung wird verarbeitet"}
              </h1>
              <p className="mt-4 text-lg text-foreground">{info.title}</p>
              {info.eventDate && <p className="text-muted-foreground">{new Date(info.eventDate).toLocaleDateString("de-CH", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</p>}
              <p className="mt-6 text-muted-foreground">
                {info.persons} Person{info.persons > 1 ? "en" : ""} · {formatChf(info.amount)}
                <br />
                {info.mode === "guarantee"
                  ? "Deine Karte ist als Garantie hinterlegt – es wurde nichts abgebucht."
                  : "Dein Ticket ist bezahlt. Eine Quittung erhältst du per E-Mail."}
              </p>
              <Link to="/events" className="mt-10 inline-flex rounded-full bg-accent text-[#0D2517] px-8 py-3.5 text-sm uppercase tracking-[0.25em] font-semibold">
                Zurück zu den Events
              </Link>
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
