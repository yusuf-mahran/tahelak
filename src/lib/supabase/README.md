# `/src/lib/supabase` — Supabase Blueprint

A modular, type-safe Supabase integration layer for Next.js (App Router).
Import everything from `@/lib/supabase` — the barrel `index.ts` re-exports it all.

---

## File Structure

```folder structure
src/lib/supabase/
├── index.ts      ← Public API (barrel export — import from here)
├── client.ts     ← Singleton client (browser + admin)
├── auth.ts       ← All auth operations
├── db.ts         ← Generic CRUD + real-time helpers
├── storage.ts    ← File upload / download / URL helpers
├── errors.ts     ← Error parsing + friendly messages
```

---

## Setup

### 1. Environment variables

Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server-only, never expose
```

### 2. Install the package

```bash
npm install @supabase/supabase-js
```

---

## Usage Examples

### Auth

```ts
import { signInWithEmail, signOut, signInWithOAuth } from '@/lib/supabase';

// Email + password
const { data: session, error } = await signInWithEmail(email, password);

// OAuth (Google, GitHub, …)
await signInWithOAuth('google', '/dashboard');

// Sign out
await signOut();
```

### Database

```ts
import { findById, insertOne, queryWithFilters } from '@/lib/supabase';

// Fetch by id
const { data: post } = await findById('posts', 'uuid-123');

// Insert
const { data: newPost } = await insertOne('posts', {
  title: 'Hello',
  slug: 'hello',
  author_id: userId,
});

// Filtered query
const { data: posts, count } = await queryWithFilters(
  'posts',
  [{ column: 'status', operator: 'eq', value: 'published' }],
  { page: 1, pageSize: 10, orderBy: 'published_at', ascending: false },
);
```

### Storage

```ts
import { uploadFile, getPublicUrl } from '@/lib/supabase';

const { data: url, error } = await uploadFile(
  'media',
  `covers/${slug}.jpg`,
  file,
);
```

### Error handling

```ts
import { parseError } from '@/lib/supabase';

const { data, error } = await supabase.from('posts').select('*');
if (error) {
  const { message } = parseError(error); // UI-safe message
  toast.error(message);
}
```

---

## Server-side (Server Actions / API Routes)

Use `getSupabaseAdmin()` for operations that need to bypass RLS:

```ts
// app/api/admin/route.ts
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  const admin = getSupabaseAdmin(); // service-role key, never sent to browser
  const { data } = await admin.from('users').select('*');
  return Response.json(data);
}
```

---

## Extending

Each module is self-contained. To add domain-specific logic:

```folder structure
src/lib/supabase/
└── repositories/
    ├── posts.ts    ← buildPostsRepo() using insertOne, findAll, etc.
    └── users.ts    ← buildUsersRepo() using upsertOne, etc.
```

```ts
// repositories/posts.ts
import { queryWithFilters, updateById } from '@/lib/supabase';

export const postsRepo = {
  getPublished: (page = 1) =>
    queryWithFilters(
      'posts',
      [{ column: 'status', operator: 'eq', value: 'published' }],
      { page },
    ),

  publish: (id: string) =>
    updateById('posts', id, {
      status: 'published',
      published_at: new Date().toISOString(),
    }),
};
```
