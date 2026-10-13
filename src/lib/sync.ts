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

export type CloudSyncFailureReason =
  | "not_configured"
  | "not_found"
  | "network"
  | "server";

export class CloudSyncError extends Error {
  reason: CloudSyncFailureReason;

  constructor(message: string, reason: CloudSyncFailureReason) {
    super(message);
    this.name = "CloudSyncError";
    this.reason = reason;
  }
}

export async function uploadToCloud(
  syncId: string,
  encryptedPayload: string,
  salt: string,
): Promise<string> {
  const supabase = getClient();
  if (!supabase) {
    throw new CloudSyncError(
      "Supabase não configurado neste build (variáveis de ambiente ausentes).",
      "not_configured",
    );
  }

  const updatedAt = new Date().toISOString();

  try {
    const { error } = await supabase.from("media_vaults").upsert(
      {
        sync_id: syncId,
        payload: encryptedPayload,
        salt,
        updated_at: updatedAt,
      },
      { onConflict: "sync_id" },
    );

    if (error) {
      throw new CloudSyncError(
        error.message || "Erro ao enviar cofre para a nuvem.",
        "server",
      );
    }
  } catch (err) {
    if (err instanceof CloudSyncError) throw err;
    throw new CloudSyncError(
      "Falha de rede ao sincronizar na nuvem.",
      "network",
    );
  }

  return updatedAt;
}

export async function downloadFromCloud(
  syncId: string,
): Promise<{ payload: string; salt: string; updatedAt: string }> {
  const supabase = getClient();
  if (!supabase) {
    throw new CloudSyncError(
      "Supabase não configurado neste build (variáveis de ambiente ausentes).",
      "not_configured",
    );
  }

  try {
    const { data, error } = await supabase
      .from("media_vaults")
      .select("payload, salt, updated_at")
      .eq("sync_id", syncId.trim())
      .maybeSingle();

    if (error) {
      throw new CloudSyncError(
        error.message || "Erro ao buscar cofre na nuvem.",
        "server",
      );
    }

    if (!data) {
      throw new CloudSyncError(
        "Código de sync não encontrado na nuvem.",
        "not_found",
      );
    }

    return {
      payload: data.payload,
      salt: data.salt,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    if (err instanceof CloudSyncError) throw err;
    throw new CloudSyncError(
      "Falha de rede ao baixar cofre da nuvem.",
      "network",
    );
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
