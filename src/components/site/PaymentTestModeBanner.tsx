const token = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN;

export function PaymentTestModeBanner() {
  if (token?.startsWith("pk_live_")) return null;
  return <div role="status" className="w-full border-b border-accent/30 bg-background px-4 py-2 text-center text-sm text-accent">
    {token?.startsWith("pk_test_")
      ? "Alle Zahlungen in dieser Vorschau sind im Testmodus. Es wird kein echtes Geld abgebucht."
      : "Echte Zahlungen sind noch nicht eingerichtet. Bitte den Live-Start im Zahlungsbereich abschliessen."}
  </div>;
}