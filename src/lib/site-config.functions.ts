import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type SiteConfigResult = { payload: string | null; updated_at: string | null };

// Public read — anyone visiting the site loads the currently published payload.
export const getSiteConfig = createServerFn({ method: "GET" }).handler(async (): Promise<SiteConfigResult> => {
  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
  const { data, error } = await client
    .from("site_config")
    .select("payload, updated_at")
    .eq("id", "main")
    .maybeSingle();
  if (error || !data) return { payload: null, updated_at: null };
  return { payload: JSON.stringify(data.payload ?? {}), updated_at: (data.updated_at as string) ?? null };
});

const publishSchema = z.object({
  payload: z.object({
    design: z.any().optional(),
    content: z.any().optional(),
    milestones: z.any().optional(),
    hidden: z.any().optional(),
  }),
});

export const publishSiteConfig = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => publishSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_config")
      .upsert({ id: "main", payload: data.payload, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true, updated_at: new Date().toISOString() };
  });
