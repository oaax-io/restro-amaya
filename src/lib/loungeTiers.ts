export type LoungeTier = {
  tier: string;
  price: string;
  period: string;
  badge?: string;
  perks: string[];
};

export const DEFAULT_TIER_SOLO: LoungeTier = {
  tier: "Solo",
  price: "CHF 1'200",
  period: "pro Jahr",
  perks: [
    "Ganzjähriger Zutritt zur Cigar Lounge",
    "Persönliches Locker im Humidor",
    "10% Rabatt auf Zigarren & Spirituosen",
    "Einladung zu 2 Members Events pro Jahr",
  ],
};

export const DEFAULT_TIER_ELITE: LoungeTier = {
  tier: "Elite",
  price: "CHF 3'000",
  period: "pro Jahr",
  badge: "24/7",
  perks: [
    "Alle Solo-Vorteile",
    "Bevorzugte Reservierung ohne Wartezeit",
    "20% Rabatt auf Zigarren, Spirits & Menu",
    "Private Tastings & exklusive Verkostungen",
    "Begleitperson jederzeit kostenlos",
    "Persönlicher Concierge-Service",
  ],
};