import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, LegalSection } from "@/components/layout/LegalLayout";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum — Amaya Restaurant" },
      { name: "description", content: "Impressum und Anbieterkennzeichnung der Amaya Restaurant / Gastroverse AG." },
      { property: "og:title", content: "Impressum — Amaya Restaurant" },
      { property: "og:description", content: "Impressum und Anbieterkennzeichnung der Amaya Restaurant / Gastroverse AG." },
    ],
  }),
  component: ImpressumPage,
});

function ImpressumPage() {
  return (
    <LegalLayout title="Impressum">
      <LegalSection title="Betreiber">
        <p className="not-prose">
          <strong>AMAYA RESTAURANT</strong>
          <br />Gastroverse AG
          <br />Stationsstrasse 9
          <br />6023 Rothenburg
          <br />Schweiz
        </p>
      </LegalSection>

      <LegalSection title="Kontakt">
        <p className="not-prose">
          E-Mail: info@amaya-restaurant.ch
          <br />Website:{" "}
          <a
            href="https://www.amaya-restaurant.ch"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-amber-300 transition-colors"
          >
            www.amaya-restaurant.ch
          </a>
        </p>
      </LegalSection>

      <LegalSection title="Webdesign & Entwicklung">
        <p className="not-prose">
          <strong>OAASE Suisse GmbH</strong>
          <br />Kanonenstrasse 4
          <br />6003 Luzern
          <br />
          <br />Website: https://oaase.ch
          <br />E-Mail: info@oaase.ch
        </p>
      </LegalSection>

      <LegalSection title="Haftungsausschluss">
        Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen. Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen. Alle Angebote sind unverbindlich. Der Autor behält es sich ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne besondere Ankündigung zu verändern, zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.
      </LegalSection>

      <LegalSection title="Haftung für Links">
        Verweise und Links auf Webseiten Dritter liegen ausserhalb unseres Verantwortungsbereichs. Es wird jegliche Verantwortung für solche Webseiten abgelehnt. Der Zugriff und die Nutzung solcher Webseiten erfolgt auf eigene Gefahr des jeweiligen Nutzers.
      </LegalSection>

      <LegalSection title="Urheberrechte">
        Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf dieser Website gehören ausschliesslich der Gastroverse AG oder den speziell genannten Rechteinhabern. Für die Reproduktion von sämtlichen Dateien ist die schriftliche Zustimmung des Urheberrechtsträgers im Voraus einzuholen.
      </LegalSection>
    </LegalLayout>
  );
}