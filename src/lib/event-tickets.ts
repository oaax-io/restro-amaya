export function eventPriceKey(eventId: string) {
  return `amaya_event_${eventId.replace(/-/g, "_")}_ticket`;
}

export function ticketToken(input: string): string {
  let value = input.trim();
  if (value.includes("://")) {
    try { value = new URL(value).searchParams.get("ticket") ?? ""; }
    catch { throw new Error("Ungültiger Ticket-Code."); }
  }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
    throw new Error("Ungültiger Ticket-Code.");
  }
  return value;
}

export function ticketIsValid(status: string, paymentStatus: string) {
  return status === "confirmed" && (paymentStatus === "paid" || paymentStatus === "card_saved");
}