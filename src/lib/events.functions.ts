import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { type StripeEnv, createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";
import { MAX_PERSONS, parseTicketOptions, quoteBooking, hasBookablePrice } from "@/lib/event-pricing";
import { eventPriceKey, ticketToken, ticketIsValid } from "@/lib/event-tickets";

type Result<T> = T | { error: string };

function validEnv(env: unknown): StripeEnv {
  if (env !== "sandbox" && env !== "live") throw new Error("Invalid environment");
  return env;
}

export const createEventCheckout = createServerFn({ method: "POST" })
  .inputValidator((d: {
    eventId: string; persons: number; name: string; email: string;
    phone?: string; notes?: string; returnUrl: string; environment: StripeEnv;
    ticketId?: string | null; addonIds?: string[];
  }) => {
    if (!/^[0-9a-f-]{36}$/i.test(d.eventId)) throw new Error("Ungültiges Event");
    const persons = Math.floor(Number(d.persons));
    if (!(persons >= 1 && persons <= MAX_PERSONS)) throw new Error("Ungültige Personenanzahl");
    const name = String(d.name ?? "").trim().slice(0, 120);
    const email = String(d.email ?? "").trim().slice(0, 200);
    if (!name) throw new Error("Name fehlt");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Ungültige E-Mail");
    if (!/^https?:\/\//.test(d.returnUrl)) throw new Error("Invalid return URL");
    return {
      eventId: d.eventId, persons, name, email,
      phone: d.phone ? String(d.phone).slice(0, 40) : null,
      notes: d.notes ? String(d.notes).slice(0, 1000) : null,
      returnUrl: d.returnUrl, environment: validEnv(d.environment),
      ticketId: d.ticketId ? String(d.ticketId).slice(0, 40) : null,
      addonIds: Array.isArray(d.addonIds) ? d.addonIds.slice(0, 20).map((x) => String(x).slice(0, 40)) : [],
    };
  })
  .handler(async ({ data }): Promise<Result<{ clientSecret: string }>> => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: ev, error } = await supabaseAdmin.from("events").select("*").eq("id", data.eventId).maybeSingle();
      if (error || !ev || !ev.is_published) return { error: "Event nicht gefunden." };
      const options = parseTicketOptions((ev as { ticket_options?: unknown }).ticket_options);
      if (!ev.is_paid || !hasBookablePrice(ev.price_chf, options)) return { error: "Für dieses Event ist keine Ticketbuchung aktiv." };

      if (ev.max_tickets) {
        const { data: booked } = await supabaseAdmin.rpc("event_booked_count", { _event_id: ev.id });
        if ((booked ?? 0) + data.persons > ev.max_tickets) {
          return { error: `Leider nicht mehr genug Plätze frei (noch ${Math.max(0, ev.max_tickets - (booked ?? 0))}).` };
        }
      }

      let quote;
      try { quote = quoteBooking(ev.price_chf, options, data.persons, data.ticketId, data.addonIds); }
      catch (e) { return { error: e instanceof Error ? e.message : "Ungültige Auswahl" }; }
      const unit = quote.unit;
      const amount = quote.total;
      if (amount <= 0) return { error: "Für diese Auswahl ist keine Online-Buchung möglich." };
      const mode = ev.payment_mode === "guarantee" ? "guarantee" : "direct";

      const { data: booking, error: bErr } = await supabaseAdmin.from("event_bookings").insert({
        event_id: ev.id, name: data.name, email: data.email, phone: data.phone, notes: data.notes,
        persons: data.persons, unit_price_chf: unit, amount_chf: amount, payment_mode: mode,
        environment: data.environment, selections: quote.lines,
      }).select("id").single();
      if (bErr || !booking) return { error: bErr?.message ?? "Buchung fehlgeschlagen" };

      const stripe = createStripeClient(data.environment);
      const existing = await stripe.customers.list({ email: data.email, limit: 1 });
      const customerId = existing.data[0]?.id
        ?? (await stripe.customers.create({ email: data.email, name: data.name, phone: data.phone ?? undefined })).id;

      const description = `${ev.title} – ${data.persons} Person${data.persons > 1 ? "en" : ""} – ${quote.lines.map((l) => l.label).join(" + ")}`;
      const metadata = { booking_id: booking.id, event_id: ev.id, kind: "event_booking" };
      const returnUrl = data.returnUrl.includes("{CHECKOUT_SESSION_ID}")
        ? data.returnUrl
        : `${data.returnUrl}${data.returnUrl.includes("?") ? "&" : "?"}session_id={CHECKOUT_SESSION_ID}`;

      // Base-only events reuse the catalog price when it matches; categories/add-ons use inline prices on the same product.
      const prices = mode === "direct"
        ? await stripe.prices.list({ lookup_keys: [eventPriceKey(ev.id)], active: true, limit: 1 })
        : null;
      const catalogPrice = prices?.data[0];
      const productId = typeof catalogPrice?.product === "string" ? catalogPrice.product : catalogPrice?.product?.id;
      const lineItems = quote.lines.map((l) => {
        const cents = Math.round(l.unit_chf * 100);
        if (l.kind === "base" && catalogPrice?.unit_amount === cents && catalogPrice.currency === "chf") {
          return { quantity: l.quantity, price: catalogPrice.id };
        }
        const name = l.kind === "base" ? `Ticket: ${ev.title}` : `${ev.title} – ${l.label}`;
        return { quantity: l.quantity, price_data: { currency: "chf", unit_amount: cents,
          ...(productId && l.kind === "base" ? { product: productId } : { product_data: { name } }) } };
      }).filter((li) => !("price_data" in li) || (li.price_data?.unit_amount ?? 0) > 0);

      const session = mode === "guarantee"
        ? await stripe.checkout.sessions.create({
            mode: "setup",
            currency: "chf",
            ui_mode: "embedded_page",
            customer: customerId,
            return_url: returnUrl,
            metadata,
            setup_intent_data: { metadata, description: `Kartengarantie: ${description}` },
          })
        : await stripe.checkout.sessions.create({
            mode: "payment",
            ui_mode: "embedded_page",
            customer: customerId,
            return_url: returnUrl,
            metadata,
            line_items: lineItems,
            payment_intent_data: { description, metadata, setup_future_usage: "off_session" },
          });

      await supabaseAdmin.from("event_bookings")
        .update({ stripe_session_id: session.id, stripe_customer_id: customerId })
        .eq("id", booking.id);

      return { clientSecret: session.client_secret ?? "" };
    } catch (e) {
      return { error: getStripeErrorMessage(e) };
    }
  });

/** Shared by the return page and the webhook. Idempotent. */
export async function finalizeSession(sessionId: string, env: StripeEnv) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const stripe = createStripeClient(env);
  const s = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["setup_intent", "payment_intent"] });
  const bookingId = s.metadata?.booking_id;
  if (!bookingId) return null;
  const { data: b } = await supabaseAdmin.from("event_bookings").select("*").eq("id", bookingId).maybeSingle();
  if (!b || b.environment !== env || b.stripe_session_id !== sessionId) return null;
  if (s.status !== "complete") return b;
  if (b.status !== "pending") return b;

  const patch: Record<string, string | number | null> = { status: "confirmed" };
  if (s.mode === "setup") {
    const si = s.setup_intent as { payment_method?: string | { id: string } } | null;
    const pm = typeof si?.payment_method === "string" ? si.payment_method : si?.payment_method?.id;
    patch.payment_status = "card_saved";
    patch.stripe_payment_method_id = pm ?? null;
  } else {
    if (s.payment_status === "unpaid") return b;
    const pi = s.payment_intent as { id: string; payment_method?: string | { id: string } } | null;
    patch.payment_status = "paid";
    patch.charged_amount_chf = b.amount_chf;
    patch.stripe_payment_intent_id = pi?.id ?? null;
    patch.stripe_payment_method_id = typeof pi?.payment_method === "string" ? pi.payment_method : pi?.payment_method?.id ?? null;
  }
  const { data: updated } = await supabaseAdmin.from("event_bookings").update(patch as never).eq("id", bookingId).eq("status", "pending").select("*").maybeSingle();
  if (!updated) return (await supabaseAdmin.from("event_bookings").select("*").eq("id", bookingId).maybeSingle()).data;
  // Only the call that performed the pending→confirmed transition sends the ticket email.
  try {
    const { data: ev } = await supabaseAdmin.from("events").select("title,event_date").eq("id", updated.event_id).maybeSingle();
    const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
    const date = ev?.event_date
      ? new Date(ev.event_date).toLocaleString("de-CH", { timeZone: "Europe/Zurich", dateStyle: "long", timeStyle: "short" })
      : undefined;
    await sendTemplateEmail("event-ticket", updated.email, {
      templateData: {
        name: updated.name, title: ev?.title, eventDate: date, persons: updated.persons,
        amount: Number(updated.amount_chf).toFixed(2), guarantee: updated.payment_mode === "guarantee",
        ticketUrl: `https://www.amaya-restaurant.ch/event-booking?session_id=${encodeURIComponent(sessionId)}`,
      },
      idempotencyKey: `event-ticket-${updated.id}`,
    });
  } catch (e) {
    console.error("Ticket email failed:", e);
  }
  return updated;
}

export const confirmEventBooking = createServerFn({ method: "POST" })
  .inputValidator((d: { sessionId: string; environment: StripeEnv }) => {
    if (!/^cs_[A-Za-z0-9_]+$/.test(d.sessionId)) throw new Error("Invalid session");
    return { sessionId: d.sessionId, environment: validEnv(d.environment) };
  })
  .handler(async ({ data }): Promise<Result<{ status: string; paymentStatus: string; mode: string; persons: number; amount: number; title: string; eventDate: string | null; ticketToken: string | null }>> => {
    try {
      const b = await finalizeSession(data.sessionId, data.environment);
      if (!b) return { error: "Buchung nicht gefunden." };
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: ev } = await supabaseAdmin.from("events").select("title,event_date").eq("id", b.event_id).maybeSingle();
      return {
        status: b.status, paymentStatus: b.payment_status, mode: b.payment_mode,
        persons: b.persons, amount: Number(b.amount_chf), title: ev?.title ?? "", eventDate: ev?.event_date ?? null,
        ticketToken: ticketIsValid(b.status, b.payment_status) ? b.ticket_token : null,
      };
    } catch (e) {
      return { error: getStripeErrorMessage(e) };
    }
  });

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (!data) throw new Error("Forbidden");
}

export const checkInEventTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { token: string; environment: StripeEnv; eventId?: string }) => ({
    token: ticketToken(data.token), environment: validEnv(data.environment),
    eventId: data.eventId ? ticketToken(data.eventId) : undefined,
  }))
  .handler(async ({ data, context }): Promise<Result<{ ok: true; name: string; persons: number }>> => {
    try {
      await assertAdmin(context);
      const result = await context.supabase.rpc("check_in_event_ticket", {
        _token: data.token, _environment: data.environment, _event_id: data.eventId,
      });
      if (result.error) return { error: result.error.message };
      return result.data as { ok: true; name: string; persons: number } | { error: string };
    } catch (error) { return { error: error instanceof Error ? error.message : "Ticketprüfung fehlgeschlagen." }; }
  });

/** Admin: charge a fee (late cancel / no-show) on the saved card. */
export const chargeBookingFee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { bookingId: string; amountChf: number; reason: "cancelled" | "no_show" }) => {
    const amt = Math.round(Number(d.amountChf) * 100) / 100;
    if (!(amt >= 0.5)) throw new Error("Betrag muss mindestens CHF 0.50 sein");
    if (d.reason !== "cancelled" && d.reason !== "no_show") throw new Error("Invalid reason");
    return { bookingId: d.bookingId, amountChf: amt, reason: d.reason };
  })
  .handler(async ({ data, context }): Promise<Result<{ ok: true }>> => {
    try {
      await assertAdmin(context);
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: b } = await supabaseAdmin.from("event_bookings").select("*").eq("id", data.bookingId).maybeSingle();
      if (!b) return { error: "Buchung nicht gefunden." };
      if (!b.stripe_customer_id || !b.stripe_payment_method_id) return { error: "Keine hinterlegte Karte vorhanden." };
      const { data: ev } = await supabaseAdmin.from("events").select("title").eq("id", b.event_id).maybeSingle();
      const stripe = createStripeClient(validEnv(b.environment));
      const pi = await stripe.paymentIntents.create({
        amount: Math.round(data.amountChf * 100),
        currency: "chf",
        customer: b.stripe_customer_id,
        payment_method: b.stripe_payment_method_id,
        off_session: true,
        confirm: true,
        description: `${data.reason === "no_show" ? "No-Show" : "Stornogebühr"}: ${ev?.title ?? "Event"}`,
        metadata: { booking_id: b.id, kind: data.reason },
      });
      await supabaseAdmin.from("event_bookings").update({
        status: data.reason,
        payment_status: "charged",
        charged_amount_chf: Number(b.charged_amount_chf) + data.amountChf,
        stripe_payment_intent_id: pi.id,
      }).eq("id", b.id);
      return { ok: true };
    } catch (e) {
      return { error: getStripeErrorMessage(e) };
    }
  });

/** Admin: refund a directly paid ticket (fully or partially). */
export const refundBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { bookingId: string; amountChf?: number }) => d)
  .handler(async ({ data, context }): Promise<Result<{ ok: true }>> => {
    try {
      await assertAdmin(context);
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: b } = await supabaseAdmin.from("event_bookings").select("*").eq("id", data.bookingId).maybeSingle();
      if (!b?.stripe_payment_intent_id) return { error: "Keine Zahlung zum Erstatten gefunden." };
      const stripe = createStripeClient(validEnv(b.environment));
      const amount = data.amountChf ? Math.round(data.amountChf * 100) : undefined;
      await stripe.refunds.create({ payment_intent: b.stripe_payment_intent_id, ...(amount && { amount }) });
      const refunded = amount ? amount / 100 : Number(b.charged_amount_chf);
      await supabaseAdmin.from("event_bookings").update({
        status: "cancelled",
        payment_status: "refunded",
        charged_amount_chf: Math.max(0, Number(b.charged_amount_chf) - refunded),
      }).eq("id", b.id);
      return { ok: true };
    } catch (e) {
      return { error: getStripeErrorMessage(e) };
    }
  });
