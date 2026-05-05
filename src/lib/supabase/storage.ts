/**
 * @file storage.ts
 * @description Supabase Storage helpers — upload, download, delete, and URL generation.
 */

import { supabase } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StorageResult<T = null> {
  data: T;
  error: string | null;
}

export interface UploadOptions {
  /** Replace the file if it already exists at the same path. Default: true */
  upsert?: boolean;
  /** MIME type override. Auto-detected from File if omitted. */
  contentType?: string;
  /** Cache-Control header. Default: "3600" */
  cacheControl?: string;
}

// ─── Upload ───────────────────────────────────────────────────────────────────

/**
 * Upload a file to a Supabase Storage bucket.
 *
 * @param bucket   Bucket name (must exist in your Supabase project)
 * @param path     Storage path e.g. "avatars/user-123.png"
 * @param file     File | Blob | ArrayBuffer | string (base64)
 * @param options  UploadOptions
 * @returns        Full public URL on success, null on error
 *
 * @example
 * const { data: url } = await uploadFile("media", `covers/${slug}.jpg`, file);
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Blob | ArrayBuffer | string,
  options: UploadOptions = {}
): Promise<StorageResult<string | null>> {
  const { upsert = true, contentType, cacheControl = "3600" } = options;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert,
    contentType,
    cacheControl,
  });

  if (error) return { data: null, error: error.message };

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
  return { data: urlData.publicUrl, error: null };
}

// ─── Signed URL (for private buckets) ────────────────────────────────────────

/**
 * Generate a temporary signed URL for a private file.
 * @param expiresIn  Seconds until expiry. Default: 3600 (1 hour)
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn = 3600
): Promise<StorageResult<string | null>> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  return {
    data: data?.signedUrl ?? null,
    error: error?.message ?? null,
  };
}

// ─── Public URL (for public buckets) ─────────────────────────────────────────

/**
 * Get the public URL for a file in a public bucket (no expiry).
 */
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// ─── Download ─────────────────────────────────────────────────────────────────

/**
 * Download a file as a Blob.
 */
export async function downloadFile(
  bucket: string,
  path: string
): Promise<StorageResult<Blob | null>> {
  const { data, error } = await supabase.storage.from(bucket).download(path);
  return { data: data ?? null, error: error?.message ?? null };
}

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Delete one or more files from a bucket.
 * @param paths  Array of storage paths to delete
 */
export async function deleteFiles(
  bucket: string,
  paths: string[]
): Promise<StorageResult<null>> {
  const { error } = await supabase.storage.from(bucket).remove(paths);
  return { data: null, error: error?.message ?? null };
}

// ─── List files ───────────────────────────────────────────────────────────────

export interface StorageFile {
  name: string;
  id: string | null;
  updated_at: string | null;
  created_at: string | null;
  last_accessed_at: string | null;
  metadata: Record<string, unknown> | null;
}

/**
 * List files in a bucket folder.
 * @param folder  Folder prefix, e.g. "avatars/" — use "" for root.
 */
export async function listFiles(
  bucket: string,
  folder = "",
  limit = 100
): Promise<StorageResult<StorageFile[]>> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder, { limit, sortBy: { column: "created_at", order: "desc" } });

  return {
    data: (data as StorageFile[]) ?? [],
    error: error?.message ?? null,
  };
}

// ─── Move / Rename ────────────────────────────────────────────────────────────

/**
 * Move (rename) a file within the same bucket.
 */
export async function moveFile(
  bucket: string,
  fromPath: string,
  toPath: string
): Promise<StorageResult<null>> {
  const { error } = await supabase.storage
    .from(bucket)
    .move(fromPath, toPath);
  return { data: null, error: error?.message ?? null };
}

// ─── Copy ─────────────────────────────────────────────────────────────────────

export async function copyFile(
  bucket: string,
  fromPath: string,
  toPath: string
): Promise<StorageResult<null>> {
  const { error } = await supabase.storage
    .from(bucket)
    .copy(fromPath, toPath);
  return { data: null, error: error?.message ?? null };
}
