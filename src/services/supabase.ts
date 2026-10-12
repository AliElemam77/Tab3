import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function normalizeUrl(url: string): string {
  if (!url) return '';
  let clean = url.trim();
  clean = clean.replace(/\/rest\/v1\/?$/, '');
  clean = clean.replace(/\/+$/, '');
  return clean;
}

export function getSupabaseConfig(): { url: string; key: string } | null {
  try {
    const saved = localStorage.getItem('crm_supabase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.key) {
        return { url: normalizeUrl(parsed.url), key: parsed.key.trim() };
      }
    }
  } catch {}

  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (envUrl && envKey) {
    return { url: normalizeUrl(envUrl), key: envKey.trim() };
  }
  return null;
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;
  const cfg = getSupabaseConfig();
  if (cfg && cfg.url && cfg.key) {
    try {
      supabaseInstance = createClient(cfg.url, cfg.key);
      return supabaseInstance;
    } catch (e) {
      console.warn('Failed to init Supabase in Tab3:', e);
    }
  }
  return null;
}
