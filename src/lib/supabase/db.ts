/**
 * @file db.ts
 * @description Reusable database query helpers built on top of the Supabase client.
 * Covers CRUD, filtering, pagination, and real-time subscriptions.
 */

import { supabase } from './client';
import type { Database } from './';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ─── Types ────────────────────────────────────────────────────────────────────

type TableName = keyof Database['public']['Tables'];
type Row<T extends TableName> = Database['public']['Tables'][T]['Row'];
type InsertDTO<T extends TableName> = Database['public']['Tables'][T]['Insert'];
type UpdateDTO<T extends TableName> = Database['public']['Tables'][T]['Update'];

export interface QueryResult<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
  error: string | null;
}

export interface PaginationOptions {
  page?: number; // 1-based
  pageSize?: number;
}

// ─── Generic CRUD ─────────────────────────────────────────────────────────────

/**
 * Fetch a single row by primary key.
 * @example
 * const { data } = await findById("posts", "uuid-123");
 */
export async function findById<T extends TableName>(
  table: T,
  id: string,
): Promise<QueryResult<Row<T>>> {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();
  return { data: data as Row<T> | null, error: error?.message ?? null };
}

/**
 * Fetch a single row by a specific column value.
 * @example
 * const { data } = await findOne("users", "email", "user@example.com");
 */
export async function findOne<T extends TableName>(
  table: T,
  column: string,
  value: unknown,
): Promise<QueryResult<Row<T>>> {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .limit(1)
    .eq(column, value)
    .single();
  return { data: data as Row<T> | null, error: error?.message ?? null };
}

/**
 * Fetch multiple rows where a specific column matches a value.
 * @example
 * const { data } = await findMany("orders", "status", "pending");
 */
export async function findMany<T extends TableName>(
  table: T,
  column: string,
  value: unknown,
): Promise<QueryResult<Row<T>[]>> {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq(column, value);
  return { data: (data as Row<T>[]) ?? null, error: error?.message ?? null };
}

/**
 * Fetch all rows with optional pagination.
 */
export async function findAll<T extends TableName>(
  table: T,
  options?: PaginationOptions,
): Promise<PaginatedResult<Row<T>>> {
  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 1000;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from(table)
    .select('*', { count: 'exact' })
    .range(from, to);

  return {
    data: (data ?? []) as Row<T>[],
    count: count ?? 0,
    error: error?.message ?? null,
  };
}

/**
 * Insert one row and return the created record.
 */
export async function insertOne<T extends TableName>(
  table: T,
  payload: InsertDTO<T>,
): Promise<QueryResult<Row<T>>> {
  const { data, error } = await supabase
    .from(table)
    .insert(payload as never)
    .select()
    .single();
  return { data: data as Row<T> | null, error: error?.message ?? null };
}

/**
 * Insert multiple rows and return all created records.
 */
export async function insertMany<T extends TableName>(
  table: T,
  payload: InsertDTO<T>[],
): Promise<QueryResult<Row<T>[]>> {
  const { data, error } = await supabase
    .from(table)
    .insert(payload as never)
    .select();
  return { data: data as Row<T>[] | null, error: error?.message ?? null };
}

/**
 * Update a single row by id and return the updated record.
 */
export async function updateById<T extends TableName>(
  table: T,
  id: string,
  payload: UpdateDTO<T>,
): Promise<QueryResult<Row<T>>> {
  const { data, error } = await supabase
    .from(table)
    .update(payload as never)
    .eq('id', id)
    .select()
    .single();
  return { data: data as Row<T> | null, error: error?.message ?? null };
}

/**
 * Delete a row by id. Returns true on success.
 */
export async function deleteById<T extends TableName>(
  table: T,
  id: string,
): Promise<QueryResult<boolean>> {
  const { error } = await supabase.from(table).delete().eq('id', id);
  return { data: !error, error: error?.message ?? null };
}

// ─── Upsert ───────────────────────────────────────────────────────────────────

/**
 * Insert or update (upsert) based on conflict column(s).
 * @param conflictColumns  Comma-separated column names that determine uniqueness.
 */
export async function upsertOne<T extends TableName>(
  table: T,
  payload: InsertDTO<T>,
  conflictColumns = 'id',
): Promise<QueryResult<Row<T>>> {
  const { data, error } = await supabase
    .from(table)
    .upsert(payload as never, { onConflict: conflictColumns })
    .select()
    .single();
  return { data: data as Row<T> | null, error: error?.message ?? null };
}

// ─── Filtered query helper ────────────────────────────────────────────────────

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'is'
  | 'in';

export interface Filter {
  column: string;
  operator: FilterOperator;
  value: unknown;
}

/**
 * Run a filtered + paginated query.
 * @example
 * const { data } = await queryWithFilters("posts", [
 *   { column: "status", operator: "eq", value: "published" },
 * ], { page: 1, pageSize: 10 });
 */
export async function queryWithFilters<T extends TableName>(
  table: T,
  filters: Filter[] = [],
  options?: PaginationOptions & { orderBy?: string; ascending?: boolean },
): Promise<PaginatedResult<Row<T>>> {
  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from(table)
    .select('*', { count: 'planned' })
    .range(from, to);

  for (const f of filters) {
    // @ts-expect-error dynamic operator
    query = query[f.operator](f.column, f.value);
  }

  if (options?.orderBy) {
    query = query.order(options.orderBy, {
      ascending: options.ascending ?? true,
    });
  }

  const { data, error, count } = await query;

  return {
    data: (data ?? []) as Row<T>[],
    count: count ?? 0,
    error: error?.message ?? null,
  };
}

// ─── Real-time subscriptions ──────────────────────────────────────────────────

export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

/**
 * Subscribe to real-time changes on a table.
 * Returns the channel so you can call `channel.unsubscribe()` on cleanup.
 *
 * @example
 * const channel = subscribeToTable("posts", "*", (payload) => {
 *   console.log("Change:", payload);
 * });
 * // cleanup:
 * channel.unsubscribe();
 */
export function subscribeToTable<T extends TableName>(
  table: T,
  event: RealtimeEvent,
  callback: (payload: {
    eventType: RealtimeEvent;
    new: Row<T> | null;
    old: Row<T> | null;
  }) => void,
): RealtimeChannel {
  return supabase
    .channel(`table-${table}-${Date.now()}`)
    .on('postgres_changes', { event, schema: 'public', table }, (payload) => {
      callback({
        eventType: payload.eventType as RealtimeEvent,
        new: (payload.new as Row<T>) ?? null,
        old: (payload.old as Row<T>) ?? null,
      });
    })
    .subscribe();
}
