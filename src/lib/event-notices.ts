// Pure builders for the restaurant's owner notifications (no I/O).
import { parseTicketOptions } from "@/lib/event-pricing";
// The recipient is always the restaurant address; nothing here takes a recipient
// or a template name from the browser.

export type OwnerRow = { label: string; value: string };

export interface NoticeEvent {
  title: string;
  event_date: string | null;
  event_time: string | null;
  ticket_options?: unknown;
}

export interface NoticeBooking {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  persons: number;
  notes?: string | null;
  selections?: unknown;
}

export interface OwnerNotice {
  kind: string;
  heading: string;
  rows: OwnerRow[];
  idempotencyKey: string;
}

// event_date is date-only (midnight UTC) — never render a clock time from it,
// otherwise Zurich formatting shows "01:00". The real start time lives in event_time.
export function formatEventDate(date: string | null, time: string | null): string | null {
  if (!date) return null;
  const d = new Date(date).toLocaleDateString("de-CH", { timeZone: "UTC", dateStyle: "long" });
  return time ? `${d}, ${time} Uhr` : d;
}

// The time a booking actually starts: a chosen ticket category may carry its
// own start time (e.g. "Late-Dinner" at 20:45 while the event opens at 18:30).
export function bookingTime(b: NoticeBooking, ev: NoticeEvent | null): string | null {
  if (ev) {
    const options = parseTicketOptions(ev.ticket_options);
    const selected = Array.isArray(b.selections) ? (b.selections as { id?: string; kind?: string }[]) : [];
    for (const s of selected) {
      const opt = options.find((o) => o.id === s?.id && o.kind === "ticket");
      if (opt?.time) return opt.time;
    }
  }
  return ev?.event_time ?? null;
}

export function ownerRows(b: NoticeBooking, ev: NoticeEvent | null, extra: OwnerRow[]): OwnerRow[] {
  const picks = Array.isArray(b.selections)
    ? (b.selections as { label?: string }[]).map((x) => x?.label).filter(Boolean).join(", ")
    : "";
  return [
    { label: "Event", value: ev?.title ?? "–" },
    { label: "Datum", value: formatEventDate(ev?.event_date ?? null, bookingTime(b, ev)) ?? "–" },
    { label: "Personen", value: String(b.persons) },
    ...(picks ? [{ label: "Auswahl", value: picks }] : []),
    ...extra,
    { label: "Name", value: b.name },
    { label: "E-Mail", value: b.email },
    { label: "Telefon", value: b.phone ?? "–" },
    ...(b.notes ? [{ label: "Bemerkung", value: b.notes }] : []),
  ];
}

const STATUS_KIND: Record<string, string> = { cancelled: "Storno", no_show: "No-Show" };

export function statusNotice(
  b: NoticeBooking,
  ev: NoticeEvent | null,
  status: "attended" | "cancelled" | "no_show",
): OwnerNotice {
  const kind = STATUS_KIND[status] ?? "Status";
  return {
    kind,
    heading: `${kind}: ${b.name}, ${b.persons} Pers. – ${ev?.title ?? "Event"}`,
    rows: ownerRows(b, ev, [{ label: "Status", value: status === "no_show" ? "No-Show" : "Storniert" }]),
    idempotencyKey: `owner-status-${b.id}-${status}`,
  };
}

export function refundNotice(
  b: NoticeBooking,
  ev: NoticeEvent | null,
  refundedChf: number,
  refundId: string,
): OwnerNotice {
  return {
    kind: "Storno",
    heading: `Storno & Erstattung: ${b.name}, ${b.persons} Pers. – ${ev?.title ?? "Event"}`,
    rows: ownerRows(b, ev, [
      { label: "Erstattet", value: `CHF ${refundedChf.toFixed(2)}` },
      { label: "Zahlung", value: "Erstattet" },
    ]),
    idempotencyKey: `owner-cancel-${refundId}`,
  };
}

export function feeNotice(
  b: NoticeBooking,
  ev: NoticeEvent | null,
  amountChf: number,
  reason: "cancelled" | "no_show",
  paymentIntentId: string,
): OwnerNotice {
  const kind = reason === "no_show" ? "No-Show" : "Stornogebühr";
  return {
    kind,
    heading: `${kind} belastet: ${b.name}, ${b.persons} Pers. – ${ev?.title ?? "Event"}`,
    rows: ownerRows(b, ev, [{ label: "Belastet", value: `CHF ${amountChf.toFixed(2)}` }]),
    idempotencyKey: `owner-fee-${paymentIntentId}`,
  };
}
