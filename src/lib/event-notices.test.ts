import { test, expect } from "bun:test";
import {
  feeNotice, formatEventDate, refundNotice, statusNotice,
  type NoticeBooking, type NoticeEvent,
} from "./event-notices";

const ev: NoticeEvent = { title: "Afro House Night", event_date: "2026-11-14", event_time: "20:00" };
const b: NoticeBooking = {
  id: "b1", name: "Maria Muster", email: "maria@example.com", phone: "+41 79 000 00 00",
  persons: 2, notes: null, selections: [{ label: "Dinner + Eintritt", kind: "ticket" }],
};

const row = (n: { rows: { label: string; value: string }[] }, label: string) =>
  n.rows.find((r) => r.label === label)?.value;

test("cancelling a booking notifies the restaurant with the booking details", () => {
  const n = statusNotice(b, ev, "cancelled");
  expect(n.kind).toBe("Storno");
  expect(n.heading).toBe("Storno: Maria Muster, 2 Pers. – Afro House Night");
  expect(n.idempotencyKey).toBe("owner-status-b1-cancelled");
  expect(row(n, "Datum")).toBe("14. November 2026, 20:00 Uhr");
  expect(row(n, "Auswahl")).toBe("Dinner + Eintritt");
  expect(row(n, "Status")).toBe("Storniert");
  expect(row(n, "E-Mail")).toBe("maria@example.com");
});

test("no-show is reported as its own kind", () => {
  const n = statusNotice(b, ev, "no_show");
  expect(n.kind).toBe("No-Show");
  expect(n.heading).toContain("No-Show: Maria Muster");
  expect(n.idempotencyKey).toBe("owner-status-b1-no_show");
});

test("date-only events never show a clock time", () => {
  expect(formatEventDate("2026-11-14", null)).toBe("14. November 2026");
  expect(row(statusNotice(b, { ...ev, event_time: null }, "cancelled"), "Datum")).not.toContain("01:00");
});

test("refund notice states the refunded amount and is keyed by the refund", () => {
  const n = refundNotice(b, ev, 120, "re_1Qxyz");
  expect(n.kind).toBe("Storno");
  expect(n.heading).toBe("Storno & Erstattung: Maria Muster, 2 Pers. – Afro House Night");
  expect(row(n, "Erstattet")).toBe("CHF 120.00");
  expect(n.idempotencyKey).toBe("owner-cancel-re_1Qxyz");
});

test("charged cancellation fee is reported with its amount", () => {
  const n = feeNotice(b, ev, 50, "cancelled", "pi_1Qabc");
  expect(n.kind).toBe("Stornogebühr");
  expect(n.heading).toBe("Stornogebühr belastet: Maria Muster, 2 Pers. – Afro House Night");
  expect(row(n, "Belastet")).toBe("CHF 50.00");
  expect(n.idempotencyKey).toBe("owner-fee-pi_1Qabc");
});
