// @ts-ignore bun test runner types
import { expect, test } from "bun:test";
import { eventPriceKey, ticketIsValid, ticketToken } from "./event-tickets";

test("catalog keeps the same price key for an event", () => {
  expect(eventPriceKey("47b16ecf-866f-4a86-8ee4-240bac0179b4")).toBe("amaya_event_47b16ecf_866f_4a86_8ee4_240bac0179b4_ticket");
});
test("QR contains a token, not customer details", () => {
  expect(ticketToken("https://www.amaya-restaurant.ch/event-ticket?ticket=47b16ecf-866f-4a86-8ee4-240bac0179b4")).toBe("47b16ecf-866f-4a86-8ee4-240bac0179b4");
  expect(() => ticketToken("invalid")).toThrow();
});
test("paid bookings are valid tickets", () => {
  expect(ticketIsValid("confirmed", "paid")).toBe(true);
  expect(ticketIsValid("pending", "paid")).toBe(false);
});
test("card guarantee does not need an immediate charge", () => {
  expect(ticketIsValid("confirmed", "card_saved")).toBe(true);
  expect(ticketIsValid("confirmed", "pending")).toBe(false);
});
test("used or cancelled tickets cannot enter again", () => {
  expect(ticketIsValid("attended", "paid")).toBe(false);
  expect(ticketIsValid("cancelled", "paid")).toBe(false);
});