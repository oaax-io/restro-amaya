import { describe, expect, test } from "bun:test";
import { cancellationFee, noShowFee, totalFor, type EventPricing } from "./event-pricing";

const dinner: EventPricing = {
  price_chf: 120, payment_mode: "guarantee", cancel_allowed: true,
  cancel_days: 7, late_fee_chf: 50, noshow_fee_chf: null,
};
const now = new Date(2026, 9, 1); // 1 Oct 2026

describe("event pricing", () => {
  test("total = price × persons", () => {
    expect(totalFor(45, 3)).toBe(135);
  });
  test("free cancellation 7+ days before", () => {
    expect(cancellationFee(dinner, 2, "2026-10-08", now)).toBe(0);
  });
  test("CHF 50 per person within 7 days", () => {
    expect(cancellationFee(dinner, 2, "2026-10-05", now)).toBe(100);
  });
  test("full amount on event day", () => {
    expect(cancellationFee(dinner, 2, "2026-10-01", now)).toBe(240);
  });
  test("no-show = full amount per person", () => {
    expect(noShowFee(dinner, 3)).toBe(360);
  });
  test("no cancellation allowed = full price", () => {
    expect(cancellationFee({ ...dinner, cancel_allowed: false, price_chf: 15 }, 2, "2026-12-01", now)).toBe(30);
  });
});
