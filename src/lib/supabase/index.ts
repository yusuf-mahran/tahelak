/**
 * @file index.ts
 * @description Public API for the Supabase library.
 * Import everything your app needs from "@/lib/supabase".
 *
 * Usage:
 *   import { supabase, signInWithEmail, findById, uploadFile } from "@/lib/supabase";
 */

// Client
export { supabase, getSupabaseClient, getSupabaseAdmin } from './client';

// Auth
export {
  signUpWithEmail,
  signInWithEmail,
  signInWithMagicLink,
  signInWithOAuth,
  signOut,
  getSession,
  getCurrentUser,
  sendPasswordResetEmail,
  updatePassword,
  onAuthStateChange,
} from './auth';

// Database
export {
  findById,
  findAll,
  insertOne,
  insertMany,
  updateById,
  deleteById,
  upsertOne,
  queryWithFilters,
  subscribeToTable,
} from './db';

// Storage
export {
  uploadFile,
  getSignedUrl,
  getPublicUrl,
  downloadFile,
  deleteFiles,
  listFiles,
  moveFile,
  copyFile,
} from './storage';

// Errors
export {
  parsePostgrestError,
  parseAuthError,
  parseError,
  throwOnError,
  isNotFound,
} from './errors';

// Types
export type { AppError } from './errors';
export type {
  QueryResult,
  PaginatedResult,
  Filter,
  FilterOperator,
  RealtimeEvent,
} from './db';
export type * from './database.types';
export type { StorageResult, UploadOptions } from './storage';
