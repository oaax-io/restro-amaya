import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import jungleTex from "@/assets/jungle-texture.jpg";
import flyer1 from "@/assets/LUPSTUDIOS-19.jpg.asset.json";
import flyer2 from "@/assets/LuzPalokaj_Photography--21.jpg.asset.json";
import flyer3 from "@/assets/LuzPalokaj_Photography-07561.jpg.asset.json";
import flyer4 from "@/assets/LuzPalokaj_Photography--20.jpg.asset.json";

type EventItem = {
  id: string;
  flyer: string;
  kicker: string;
  title: string;
  date: string;
  time: string;
  location: string;
  capacity: string;
  description: string;
  cta: string;
  ctaHref: string;
};

const EVENTS: EventItem[] = [
  {
    id: "jungle-nights",
    flyer: flyer1.url,
    kicker: "DJ Night",
    title: "Jungle Nights vol. IV",
    date: "Fr. 15. August 2026",
    time: "22:00 – 04:00",
    location: "Amaya Bar · Rothenburg LU",
    capacity: "Limitiert auf 120 Gäste",
    description:
      "Deep House, Afro Beats und tropische Cocktails. Unser Signature-Event verwandelt die Bar in einen pulsierenden Dschungel — mit Live-Percussion und einem Special-Guest-DJ aus Zürich.",
    cta: "Jetzt teilnehmen",
    ctaHref: "/reservation",
  },
  {
    id: "cigar-tasting",
    flyer: flyer2.url,
    kicker: "Tasting",
    title: "Cigar & Rum Pairing",
    date: "Sa. 30. August 2026",
    time: "19:30 – 23:00",
    location: "Cigar Lounge",
    capacity: "Max. 24 Plätze",
    description:
      "Ein geführter Abend durch drei Premium-Zigarren aus der Karibik, kombiniert mit gereiften Rums. Inklusive 3-Gang-Menü und Espresso.",
    cta: "Platz sichern",
    ctaHref: "/reservation",
  },
  {
    id: "private-birthday",
    flyer: flyer3.url,
    kicker: "Private Event",
    title: "Deine Geburtstagsnacht",
    date: "Termin nach Wahl",
    time: "ab 18:00",
    location: "Ganzer Raum oder Lounge",
    capacity: "20 – 150 Gäste",
    description:
      "Feiere deinen Geburtstag im Dschungel. Wir stellen Menü, DJ und Deko individuell zusammen — vom intimen Dinner bis zur ausgelassenen Party.",
    cta: "Anfrage senden",
    ctaHref: "mailto:events@amaya-restaurant.ch?subject=Geburtstags-Anfrage",
  },
  {
    id: "brunch-sundays",
    flyer: flyer4.url,
    kicker: "Weekly",
    title: "Wild Brunch Sundays",
    date: "Jeden Sonntag",
    time: "10:00 – 14:00",
    location: "Restaurant",
    capacity: "Reservation empfohlen",
    description:
      "Ausgedehnter Brunch mit Live-Cooking-Station, tropischen Früchten, Sushi-Bar und Bottomless Prosecco. Perfekt für den langsamen Sonntag.",
    cta: "Tisch reservieren",
    ctaHref: "/reservation",
  },
];

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Amaya Restaurant & Bar" },
      {
        name: "description",
        content:
          "DJ Nights, Cigar Tastings, private Feiern und Sunday Brunch im Amaya Rothenburg. Sichere dir deinen Platz.",
      },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  const { t } = useTranslation();
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative pt-40 pb-20 lg:pb-28 overflow-hidden">
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{ backgroundImage: `url(${jungleTex})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <p className="text-xs tracking-[0.4em] uppercase text-accent">— {t("hero.slides.events.tag")}</p>
          <h1 className="font-display text-6xl lg:text-8xl mt-6 leading-[0.95] uppercase font-bold text-gradient-gold">
            Events.
          </h1>
          <p className="mt-8 max-w-2xl text-muted-foreground leading-relaxed text-lg">
            {t("hero.slides.events.sub")} — von DJ Nights über Cigar Tastings bis zu deiner
            privaten Feier.
          </p>
        </div>
      </section>

      {/* Events */}
      <section className="pb-24 lg:pb-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 space-y-24 lg:space-y-32">
          {EVENTS.map((ev, idx) => {
            const reverse = idx % 2 === 1;
            const tilt = reverse ? "lg:rotate-2" : "lg:-rotate-2";
            const isExternal = ev.ctaHref.startsWith("mailto:") || ev.ctaHref.startsWith("http");
            return (
              <article
                key={ev.id}
                className={[
                  "grid gap-10 lg:gap-16 items-center",
                  "lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]",
                  reverse ? "lg:[&>div:first-child]:order-2" : "",
                ].join(" ")}
              >
                {/* Floating flyer */}
                <div className="group relative mx-auto w-full max-w-sm lg:max-w-none">
                  {/* soft glow */}
                  <div
                    aria-hidden
                    className="absolute -inset-6 rounded-3xl bg-accent/20 blur-3xl opacity-60 group-hover:opacity-90 transition-opacity duration-700"
                  />
                  <div
                    className={[
                      "relative overflow-hidden rounded-2xl border border-accent/20 shadow-2xl shadow-black/60",
                      "aspect-[3/4] bg-card",
                      "transition-transform duration-700 ease-out",
                      "animate-[floaty_7s_ease-in-out_infinite]",
                      tilt,
                      "hover:rotate-0 hover:-translate-y-2 hover:scale-[1.02]",
                    ].join(" ")}
                  >
                    <img
                      src={ev.flyer}
                      alt={`Flyer ${ev.title}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="rounded-full bg-accent text-[#0D2517] text-[10px] tracking-[0.25em] uppercase font-semibold px-3 py-1">
                        {ev.kicker}
                      </span>
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <div className="text-[11px] tracking-[0.3em] uppercase text-white/75">{ev.date}</div>
                      <div className="font-display text-2xl leading-tight mt-1">{ev.title}</div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-xs tracking-[0.4em] uppercase text-accent">— {ev.kicker}</p>
                  <h2 className="font-display text-4xl lg:text-5xl uppercase font-bold mt-4 text-gradient-gold leading-[0.95]">
                    {ev.title}
                  </h2>
                  <p className="mt-6 text-muted-foreground leading-relaxed text-base lg:text-lg">
                    {ev.description}
                  </p>

                  <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <Meta icon={<Calendar size={16} />} label="Datum" value={ev.date} />
                    <Meta icon={<Clock size={16} />} label="Zeit" value={ev.time} />
                    <Meta icon={<MapPin size={16} />} label="Ort" value={ev.location} />
                    <Meta icon={<Users size={16} />} label="Kapazität" value={ev.capacity} />
                  </dl>

                  <div className="mt-10">
                    {isExternal ? (
                      <a
                        href={ev.ctaHref}
                        className="inline-flex items-center gap-2 rounded-full bg-accent text-[#0D2517] px-7 py-3.5 text-sm uppercase tracking-[0.25em] font-semibold hover:bg-accent/90 transition-colors"
                      >
                        {ev.cta}
                        <ArrowRight size={16} />
                      </a>
                    ) : (
                      <Link
                        to={ev.ctaHref}
                        className="inline-flex items-center gap-2 rounded-full bg-accent text-[#0D2517] px-7 py-3.5 text-sm uppercase tracking-[0.25em] font-semibold hover:bg-accent/90 transition-colors"
                      >
                        {ev.cta}
                        <ArrowRight size={16} />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* CTA: eigenes Event */}
      <section className="pb-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-[#0D2517]/70 backdrop-blur-xl p-10 lg:p-14 text-center">
            <div
              aria-hidden
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ backgroundImage: `url(${jungleTex})`, backgroundSize: "cover" }}
            />
            <div className="relative">
              <p className="text-xs tracking-[0.4em] uppercase text-accent">— Dein Event</p>
              <h3 className="font-display text-3xl lg:text-5xl uppercase font-bold mt-4 text-gradient-gold">
                Plane deine eigene Nacht.
              </h3>
              <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
                Firmenanlass, Hochzeit, Release-Party — wir kuratieren Menü, Musik und Atmosphäre
                nach deinen Vorstellungen.
              </p>
              <a
                href="mailto:events@amaya-restaurant.ch?subject=Event-Anfrage"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent text-[#0D2517] px-8 py-3.5 text-sm uppercase tracking-[0.25em] font-semibold hover:bg-accent/90 transition-colors"
              >
                Anfrage senden
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes floaty {
          0%, 100% { transform: translateY(0) }
          50% { transform: translateY(-10px) }
        }
      `}</style>
    </SiteLayout>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-accent/15 bg-[#0D2517]/40 px-4 py-3">
      <span className="mt-0.5 text-accent">{icon}</span>
      <div>
        <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{label}</div>
        <div className="text-sm text-foreground mt-0.5">{value}</div>
      </div>
    </div>
  );
}
