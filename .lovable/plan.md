## Goal
Clicking **Publish live** in the Tweak panel writes the current tweaks straight to the database — no token prompt, no localStorage token, no first-visit alert.

## Changes

### `src/routes/index.tsx` (Tweak panel)
- Delete `TOKEN_KEY`, `doClaimToken`, `ensureToken`, and all `localStorage` token handling.
- `publishLive` calls `doPublish({ data: { payload: {...} } })` directly, then shows "Live!" on success.
- Drop the "Wrong admin token" error branch.

### `src/lib/site-config.functions.ts` (server)
- `publishSiteConfig`: remove the `token` field from the Zod schema and the `SITE_ADMIN_TOKEN` check. Handler just writes the payload via `supabaseAdmin`.
- Remove `claimAdminToken` (no longer used).

## Heads-up (not a blocker, just so you know)
Without the token, **anyone who opens your site can click Publish live** and overwrite the published content, because the server function has no other caller check. If you're OK with that (private link, only you use it), we ship as-is. If you'd rather keep it locked down without a prompt, alternatives:
- Gate on a signed-in Supabase user (your account only).
- Bake the token into an env var the client reads at build time (still technically visible in the bundle, but no prompt).

Say the word and I'll implement — default is the no-gate version you asked for.