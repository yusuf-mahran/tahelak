/**
 * @file types.ts
 * @description Auto-generated Supabase database types.
 *
 * 🔄 To regenerate from your live schema run:
 *   npx supabase gen types typescript --project-id <YOUR_PROJECT_ID> > src/lib/supabase/types.ts
 *
 * The types below are a starter scaffold — replace them with your real schema.
 */

// ─── Column helpers ───────────────────────────────────────────────────────────

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
