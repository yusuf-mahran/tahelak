/**
 * @file errors.ts
 * @description Standardized Supabase error handling utilities.
 * Maps Supabase / PostgreSQL error codes to friendly messages.
 */

import type { PostgrestError, AuthError } from "@supabase/supabase-js";

// ─── Error shape ──────────────────────────────────────────────────────────────

export interface AppError {
  /** Human-readable message safe to show in the UI */
  message: string;
  /** Original error code from Postgres or Supabase Auth */
  code?: string;
  /** Detailed hint (dev-only, don't expose to users) */
  hint?: string;
}

// ─── PostgreSQL error code map ────────────────────────────────────────────────

const PG_ERROR_MESSAGES: Record<string, string> = {
  "23505": "This record already exists.",          // unique_violation
  "23503": "Related record not found.",            // foreign_key_violation
  "23502": "Required field is missing.",           // not_null_violation
  "42501": "You don't have permission to do this.", // insufficient_privilege
  "42P01": "Table not found.",                     // undefined_table
  "22P02": "Invalid input format.",                // invalid_text_representation
  PGRST116: "Record not found.",                   // .single() returned no rows
  PGRST301: "Row Level Security blocked this action.",
};

// ─── Auth error code map ──────────────────────────────────────────────────────

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "Incorrect email or password.",
  email_not_confirmed: "Please verify your email before signing in.",
  user_already_exists: "An account with this email already exists.",
  weak_password: "Password is too weak. Use at least 8 characters.",
  over_email_send_rate_limit:
    "Too many emails sent. Please wait a few minutes.",
  session_not_found: "Your session has expired. Please sign in again.",
  user_not_found: "No account found with this email.",
};

// ─── Parsers ──────────────────────────────────────────────────────────────────

/**
 * Parse a PostgREST error into a friendly AppError.
 */
export function parsePostgrestError(error: PostgrestError): AppError {
  const code = error.code ?? "";
  return {
    message:
      PG_ERROR_MESSAGES[code] ??
      error.message ??
      "A database error occurred.",
    code,
    hint: error.hint ?? undefined,
  };
}

/**
 * Parse a Supabase Auth error into a friendly AppError.
 */
export function parseAuthError(error: AuthError): AppError {
  // Auth errors use `error.code` or fall back to parsing the message
  const code = (error as { code?: string }).code ?? "";
  return {
    message:
      AUTH_ERROR_MESSAGES[code] ??
      error.message ??
      "Authentication failed.",
    code,
  };
}

/**
 * Universal error parser — accepts anything thrown by Supabase helpers.
 */
export function parseError(
  error: PostgrestError | AuthError | Error | unknown
): AppError {
  if (!error) return { message: "Unknown error." };

  // PostgREST errors have a `code` field and `details`
  if (typeof error === "object" && "code" in (error as object)) {
    const e = error as PostgrestError;
    if (e.details !== undefined) return parsePostgrestError(e);
    return parseAuthError(error as AuthError);
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: String(error) };
}

// ─── Guard helper ─────────────────────────────────────────────────────────────

/**
 * Throws a standardized Error if the Supabase result has an error.
 * Use in server-side code where you'd rather throw than return.
 *
 * @example
 * const { data, error } = await supabase.from("posts").select("*");
 * const posts = throwOnError(data, error);
 */
export function throwOnError<T>(
  data: T | null,
  error: PostgrestError | null
): T {
  if (error) throw new Error(parsePostgrestError(error).message);
  if (data === null) throw new Error("No data returned.");
  return data;
}

// ─── isNotFound helper ────────────────────────────────────────────────────────

/**
 * Returns true if the error indicates a "not found" condition (PGRST116).
 * Useful to distinguish 404-like cases from real errors.
 */
export function isNotFound(error: PostgrestError | null): boolean {
  return error?.code === "PGRST116";
}
