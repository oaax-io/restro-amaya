// Pure pricing / cancellation rules for paid events (no I/O).

export type PaymentMode = "direct" | "guarantee";

export type EventPricing = {
  price_chf: number | null;
  payment_mode: PaymentMode;
  cancel_allowed: boolean;
  cancel_days: number;
  late_fee_chf: number;
  noshow_fee_chf: number | null;
};

export const MAX_PERSONS = 10;

export function totalFor(price: number | null, persons: number): number {
  const p = Math.max(0, Number(price ?? 0));
  return Math.round(p * persons * 100) / 100;
}

/** Whole days between today and the event date (both local dates). */
export function daysUntil(eventDate: string, now: Date = new Date()): number {
  const [y, m, d] = eventDate.split("-").map(Number);
  const ev = Date.UTC(y, m - 1, d);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((ev - today) / 86_400_000);
}

/** Fee owed per booking if the guest cancels now. */
export function cancellationFee(
  ev: EventPricing,
  persons: number,
  eventDate: string | null,
  now: Date = new Date(),
): number {
  const full = totalFor(ev.noshow_fee_chf ?? ev.price_chf, persons);
  if (!ev.cancel_allowed) return totalFor(ev.price_chf, persons);
  if (!eventDate) return 0;
  const days = daysUntil(eventDate, now);
  if (days >= ev.cancel_days) return 0;
  if (days >= 1) return totalFor(ev.late_fee_chf, persons);
  return full;
}

/** Fee owed for a no-show. */
export function noShowFee(ev: EventPricing, persons: number): number {
  return totalFor(ev.noshow_fee_chf ?? ev.price_chf, persons);
}

export function formatChf(n: number): string {
  return `CHF ${n.toFixed(2).replace(/\.00$/, ".–")}`;
}

export function conditionsText(ev: EventPricing): string[] {
  const out: string[] = [];
  if (ev.payment_mode === "guarantee") {
    out.push("Es wird nichts sofort abgebucht – deine Karte dient nur als Garantie.");
  } else {
    out.push("Der Ticketpreis wird bei der Buchung direkt bezahlt.");
  }
  if (!ev.cancel_allowed) {
    out.push("Eine Stornierung ist nicht möglich.");
  } else {
    out.push(`Kostenlose Stornierung bis ${ev.cancel_days} Tage vor dem Event.`);
    out.push(`Danach ${formatChf(ev.late_fee_chf)} pro Person.`);
    out.push(
      ev.noshow_fee_chf != null
        ? `Storno am Event-Tag oder No-Show: ${formatChf(ev.noshow_fee_chf)} pro Person.`
        : "Storno am Event-Tag oder No-Show: voller Eventbetrag pro Person.",
    );
  }
  return out;
}

// ---- Ticket categories & add-ons (admin-defined per event) ----
export type TicketOption = { id: string; label: string; price_chf: number; kind: "ticket" | "addon" };
export type QuoteLine = { id: string; label: string; kind: "ticket" | "addon" | "base"; unit_chf: number; quantity: number };

export function parseTicketOptions(raw: unknown): TicketOption[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((o) => {
    if (!o || typeof o !== "object") return [];
    const r = o as Record<string, unknown>;
    const id = String(r.id ?? "").slice(0, 40);
    const label = String(r.label ?? "").trim().slice(0, 80);
    const price = Number(r.price_chf);
    if (!id || !label || !Number.isFinite(price) || price < 0) return [];
    return [{ id, label, price_chf: Math.round(price * 100) / 100, kind: r.kind === "addon" ? "addon" : "ticket" } as TicketOption];
  });
}

/** Server-authoritative price quote. Throws on invalid selections. */
export function quoteBooking(
  basePrice: number | null, options: TicketOption[], persons: number, ticketId: string | null, addonIds: string[],
): { lines: QuoteLine[]; unit: number; total: number } {
  const tickets = options.filter((o) => o.kind === "ticket");
  const addons = options.filter((o) => o.kind === "addon");
  const lines: QuoteLine[] = [];
  if (tickets.length) {
    const t = tickets.find((x) => x.id === ticketId);
    if (!t) throw new Error("Bitte eine Ticket-Kategorie wählen.");
    lines.push({ id: t.id, label: t.label, kind: "ticket", unit_chf: t.price_chf, quantity: persons });
  } else {
    lines.push({ id: "base", label: "Eintritt", kind: "base", unit_chf: Math.max(0, Number(basePrice ?? 0)), quantity: persons });
  }
  for (const id of new Set(addonIds)) {
    const a = addons.find((x) => x.id === id);
    if (!a) throw new Error("Ungültige Zusatzoption.");
    lines.push({ id: a.id, label: a.label, kind: "addon", unit_chf: a.price_chf, quantity: persons });
  }
  const unit = Math.round(lines.reduce((s, l) => s + l.unit_chf, 0) * 100) / 100;
  return { lines, unit, total: totalFor(unit, persons) };
}

/** True when the event can be booked online (has a positive price somewhere). */
export function hasBookablePrice(basePrice: number | null, options: TicketOption[]): boolean {
  const tickets = options.filter((o) => o.kind === "ticket");
  return tickets.length ? tickets.some((t) => t.price_chf > 0) : Number(basePrice ?? 0) > 0;
}
