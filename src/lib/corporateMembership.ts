export type CorporatePlan = {
  plan: string;
  cards: string;
  fee: string;
  credit: string;
  discount: string;
};

export type CorporateMembershipData = {
  title: string;
  lead: string;
  plans: CorporatePlan[];
  benefits: string[];
  terms: string[];
};

export const DEFAULT_CORPORATE_MEMBERSHIP: CorporateMembershipData = {
  title: "AMAYA Corporate Membership",
  lead: "Unsere Corporate Mitgliedschaft ist ideal für Unternehmen, die Mitarbeitende belohnen, Kunden bewirten und das ganze Jahr über von exklusiven Vorteilen profitieren möchten.",
  plans: [
    { plan: "Corporate Duo", cards: "2", fee: "CHF 5'500", credit: "CHF 4'500", discount: "10%" },
    { plan: "Corporate Team", cards: "3", fee: "CHF 7'800", credit: "CHF 6'300", discount: "10%" },
    { plan: "Corporate Business", cards: "5", fee: "CHF 12'000", credit: "CHF 9'500", discount: "10%" },
    { plan: "Corporate Premium", cards: "10", fee: "CHF 22'000", credit: "CHF 17'000", discount: "10%" },
  ],
  benefits: [
    "Gemeinsames jährliches Konsum-Guthaben für alle Mitgliedskarten.",
    "10% Rabatt auf jeden Besuch und Einkauf bei AMAYA.",
    "Ideal, um Kunden zu bewirten, Mitarbeitende zu belohnen oder Geschäftstreffen auszurichten.",
    "Exklusiver Zugang zu Members-only-Angeboten und speziellen Events.",
  ],
  terms: [
    "Das jährliche Konsum-Guthaben wird zwischen allen dem Unternehmen zugeordneten Mitgliedskarten geteilt.",
    "Das Guthaben ist nicht rückerstattbar und kann nicht ins Folgejahr übertragen werden.",
    "Mitgliedskarten werden auf den Namen des Unternehmens und/oder nominierter Mitarbeitender ausgestellt.",
    "Der 10%-Rabatt ist nicht mit anderen Aktionen oder Sonderangeboten kombinierbar.",
    "Zusätzliche Mitgliedskarten können für eine Jahresgebühr von CHF 300–500 pro Karte hinzugefügt werden, ohne zusätzliches Konsum-Guthaben.",
  ],
};
