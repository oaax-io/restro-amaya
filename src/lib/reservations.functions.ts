import { createServerFn } from "@tanstack/react-start";

type Input = {
  name: string;
  email: string;
  phone: string | null;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  notes: string | null;
};

const s = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

// Stores a table request and notifies the restaurant by email.
export const submitReservation = createServerFn({ method: "POST" })
  .inputValidator((d: Input): Input => {
    const email = s(d.email, 200);
    const name = s(d.name, 120);
    if (!name) throw new Error("Bitte Namen angeben.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Bitte gültige E-Mail angeben.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.reservation_date)) throw new Error("Ungültiges Datum.");
    if (!/^\d{2}:\d{2}/.test(d.reservation_time)) throw new Error("Ungültige Uhrzeit.");
    const size = Math.max(1, Math.min(50, Math.floor(Number(d.party_size) || 2)));
    return {
      name, email, party_size: size,
      phone: s(d.phone, 40) || null,
      notes: s(d.notes, 1000) || null,
      reservation_date: d.reservation_date,
      reservation_time: d.reservation_time.slice(0, 5),
    };
  })
  .handler(async ({ data }): Promise<{ ok: true } | { error: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("reservations")
      .insert({ ...data, status: "pending" })
      .select("id")
      .single();
    if (error || !row) return { error: "Senden fehlgeschlagen. Bitte erneut versuchen." };
    try {
      const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
      const [y, m, d] = data.reservation_date.split("-");
      await sendTemplateEmail("owner-notification", "reservation@amaya-restaurant.ch", {
        templateData: {
          kind: "Reservierung",
          heading: `Neue Reservierung: ${data.name}, ${data.party_size} Pers. – ${d}.${m}.${y} ${data.reservation_time}`,
          rows: [
            { label: "Datum", value: `${d}.${m}.${y}, ${data.reservation_time} Uhr` },
            { label: "Personen", value: String(data.party_size) },
            { label: "Name", value: data.name },
            { label: "E-Mail", value: data.email },
            { label: "Telefon", value: data.phone ?? "–" },
            ...(data.notes ? [{ label: "Bemerkung", value: data.notes }] : []),
          ],
        },
        idempotencyKey: `owner-reservation-${row.id}`,
      });
    } catch (e) {
      console.error("Reservation notify failed:", e);
    }
    return { ok: true };
  });
