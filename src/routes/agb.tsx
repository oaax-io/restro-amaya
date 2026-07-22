import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, LegalSection } from "@/components/layout/LegalLayout";

export const Route = createFileRoute("/agb")({
  head: () => ({
    meta: [
      { title: "AGB — Amaya Restaurant" },
      { name: "description", content: "Allgemeine Geschäftsbedingungen der Amaya Restaurant / Gastroverse AG." },
      { property: "og:title", content: "AGB — Amaya Restaurant" },
      { property: "og:description", content: "Allgemeine Geschäftsbedingungen der Amaya Restaurant / Gastroverse AG." },
    ],
  }),
  component: AgbPage,
});

function AgbPage() {
  return (
    <LegalLayout title="Allgemeine Geschäftsbedingungen">
      <LegalSection title="Geltungsbereich">
        Diese Allgemeinen Geschäftsbedingungen (AGB) regeln das Vertragsverhältnis zwischen der Gastroverse AG (nachfolgend "Amaya Restaurant") und ihren Gästen sowie Kundinnen und Kunden. Mit der Nutzung unserer Leistungen (Reservation, Konsumation, Events, Mitgliedschaft) gelten diese Bedingungen als anerkannt.
      </LegalSection>

      <LegalSection title="Reservationen">
        Reservationen sind für beide Seiten verbindlich. Bitte informieren Sie uns rechtzeitig, falls Sie Ihre Reservation ändern oder stornieren möchten. Bei Nichterscheinen behalten wir uns vor, eine Ausfallentschädigung in Rechnung zu stellen.
      </LegalSection>

      <LegalSection title="Preise & Zahlung">
        Alle Preise verstehen sich in Schweizer Franken (CHF) inklusive der gesetzlichen Mehrwertsteuer. Die Zahlung erfolgt unmittelbar nach Konsumation oder gemäss individueller Vereinbarung.
      </LegalSection>

      <LegalSection title="Events & Veranstaltungen">
        Für Events und private Veranstaltungen gelten zusätzliche Bedingungen, die individuell vereinbart werden. Anzahlungen sind grundsätzlich nicht rückerstattbar, sofern nicht ausdrücklich anders vereinbart.
      </LegalSection>

      <LegalSection title="Mitgliedschaften">
        Mitgliedschaften der Cigar Lounge werden jährlich abgerechnet und sind nicht übertragbar. Eine Kündigung ist unter Einhaltung der bei Vertragsabschluss vereinbarten Frist möglich. Bereits bezahlte Jahresbeiträge werden nicht anteilig zurückerstattet.
      </LegalSection>

      <LegalSection title="Haftung">
        Für Garderobe und mitgebrachte Gegenstände wird keine Haftung übernommen. Wir haften nicht für leichte Fahrlässigkeit sowie für indirekte Schäden und Folgeschäden.
      </LegalSection>

      <LegalSection title="Gerichtsstand & anwendbares Recht">
        Es gilt ausschliesslich schweizerisches Recht. Gerichtsstand ist Luzern, Schweiz.
      </LegalSection>

      <p className="pt-6 text-sm text-muted-foreground">Rothenburg, 01.06.2024</p>
    </LegalLayout>
  );
}