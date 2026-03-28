import { adminAuthClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function DELETE(userId: string) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, error } = await adminAuthClient.deleteUser(userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.json({ message: 'User deleted successfully' });
}
