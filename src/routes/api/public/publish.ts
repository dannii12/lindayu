import { createFileRoute } from "@tanstack/react-router";

// Plain JSON POST endpoint for publishing site config.
// We use this instead of createServerFn because the payload can be large
// (base64 photo uploads) and TanStack's seroval transport fails on it.
export const Route = createFileRoute("/api/public/publish")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { payload?: unknown };
          if (!body || typeof body !== "object" || !body.payload) {
            return new Response(JSON.stringify({ error: "Missing payload" }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { error } = await supabaseAdmin
            .from("site_config")
            .upsert({ id: "main", payload: body.payload as never, updated_at: new Date().toISOString() });
          if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { "content-type": "application/json" },
            });
          }
          return new Response(
            JSON.stringify({ ok: true, updated_at: new Date().toISOString() }),
            { status: 200, headers: { "content-type": "application/json" } },
          );
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Unknown error";
          return new Response(JSON.stringify({ error: msg }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
