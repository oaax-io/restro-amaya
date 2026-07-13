import { createFileRoute } from "@tanstack/react-router";

// One-shot bootstrap: creates the first super admin (info@oaase.com) with a
// generated password. Fails after any admin already exists. Delete this file
// once the account has been created.
export const Route = createFileRoute("/api/public/bootstrap-admin")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        // Refuse if there is already at least one admin role assigned.
        const { count, error: countErr } = await supabaseAdmin
          .from("user_roles")
          .select("*", { count: "exact", head: true })
          .eq("role", "admin");
        if (countErr) return Response.json({ error: countErr.message }, { status: 500 });
        if ((count ?? 0) > 0) return Response.json({ error: "Admin already exists." }, { status: 403 });

        const email = "info@oaase.com";
        // Generate a strong readable password
        const alphabet = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        const bytes = new Uint8Array(20);
        crypto.getRandomValues(bytes);
        const password = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");

        // Try to create; if the user already exists, fetch and use them
        let userId: string | null = null;
        const created = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name: "Amaya Super Admin" },
        });
        if (created.error) {
          // fetch by listing (admin exists but no role yet)
          const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
          const existing = list?.users.find((u) => u.email?.toLowerCase() === email);
          if (!existing) return Response.json({ error: created.error.message }, { status: 500 });
          userId = existing.id;
          // reset password so the caller gets a usable one
          await supabaseAdmin.auth.admin.updateUserById(userId, { password, email_confirm: true });
        } else {
          userId = created.data.user?.id ?? null;
        }
        if (!userId) return Response.json({ error: "No user id" }, { status: 500 });

        const { error: roleErr } = await supabaseAdmin
          .from("user_roles")
          .insert({ user_id: userId, role: "admin" });
        if (roleErr && !roleErr.message.includes("duplicate")) {
          return Response.json({ error: roleErr.message }, { status: 500 });
        }

        return Response.json({ ok: true, email, password });
      },
    },
  },
});
