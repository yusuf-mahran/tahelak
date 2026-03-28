import { adminAuthClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const {
    email,
    password,
    institutionName,
    institutionType,
    institutionLink,
    address,
    doctorsCount,
    selectedPlan,
  } = await request.json();

  const { data, error } = await adminAuthClient.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      institutionName,
      institutionType,
      institutionLink,
      address,
      doctorsCount,
      selectedPlan,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ data });
}
