import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const VALID_TYPES = new Set(["weekly", "lunch", "mesa", "sushi", "wine", "bar"]);

export const Route = createFileRoute("/api/public/menu-pdf/$menuType")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const menuType = params.menuType;
        if (!VALID_TYPES.has(menuType)) {
          return new Response("Not found", { status: 404 });
        }

        const supabase = createClient(
          process.env["SUPABASE_URL"]!,
          process.env["SUPABASE_PUBLISHABLE_KEY"]!,
          { auth: { persistSession: false, autoRefreshToken: false } },
        );

        const { data: meta } = await supabase
          .from("menu_meta")
          .select("pdf_url")
          .eq("menu_type", menuType)
          .maybeSingle();

        const pdfPath = meta?.pdf_url;
        if (!pdfPath) return new Response("Not found", { status: 404 });

        let fileUrl: string;
        if (pdfPath.startsWith("http")) {
          fileUrl = pdfPath;
        } else {
          const { data: signed } = await supabase.storage
            .from("menu-pdfs")
            .createSignedUrl(pdfPath, 60);
          if (!signed?.signedUrl) return new Response("Not found", { status: 404 });
          fileUrl = signed.signedUrl;
        }

        const upstream = await fetch(fileUrl);
        if (!upstream.ok || !upstream.body) {
          return new Response("Not found", { status: 404 });
        }

        return new Response(upstream.body, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="Amaya-${menuType}.pdf"`,
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
