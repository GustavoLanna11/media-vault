import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SYNC_ID_KEY = "media_vault_sync_id";
export const UPDATED_AT_KEY = "media_vault_updated_at";

let client: SupabaseClient | null = null;

function getSupabaseUrl(): string | undefined {
  return import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
}

function getSupabaseAnonKey(): string | undefined {
  return import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

export function isCloudEnabled(): boolean {
  return !!(getSupabaseUrl() && getSupabaseAnonKey());
}

function getClient(): SupabaseClient | null {
  if (!isCloudEnabled()) return null;
  if (!client) {
    const url = getSupabaseUrl()!;
    const key = getSupabaseAnonKey()!;
    client = createClient(url, key, {
      auth: { persistSession: false },
    });
  }
  return client;
}

export function getSyncId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SYNC_ID_KEY);
}

export function setSyncId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SYNC_ID_KEY, id);
}

/**
 * Gera uma sequência numérica única de 8 dígitos para o cofre.
 * Exemplo: '84920153'
 */
export function generateSyncId(): string {
  const min = 10000000;
  const max = 99999999;
  const rand = Math.floor(Math.random() * (max - min + 1)) + min;
  return String(rand);
}

export type SyncStatus = "idle" | "syncing" | "synced" | "error" | "offline";

export async function uploadToCloud(
  syncId: string,
  encryptedPayload: string,
  salt: string,
): Promise<void> {
  const supabase = getClient();
  if (!supabase) return;

  try {
    const { error } = await supabase.from("media_vaults").upsert(
      {
        sync_id: syncId,
        payload: encryptedPayload,
        salt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "sync_id" },
    );

    if (error) {
      console.warn("Aviso de sincronização na nuvem:", error.message);
    }
  } catch (err) {
    console.warn("Falha de rede ao sincronizar na nuvem:", err);
  }
}

export async function downloadFromCloud(
  syncId: string,
): Promise<{ payload: string; salt: string; updatedAt: string } | null> {
  const supabase = getClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("media_vaults")
      .select("payload, salt, updated_at")
      .eq("sync_id", syncId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      payload: data.payload,
      salt: data.salt,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.warn("Falha de rede ao baixar cofre da nuvem:", err);
    return null;
  }
}

export async function checkCloudAvailable(): Promise<boolean> {
  if (!isCloudEnabled()) return false;
  try {
    const supabase = getClient()!;
    const { error } = await supabase
      .from("media_vaults")
      .select("sync_id")
      .limit(1);
    return !error;
  } catch {
    return false;
  }
}
