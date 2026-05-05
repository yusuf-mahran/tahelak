'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Image from 'next/image';
import type { Database } from '@/lib/supabase';

type UserRow = Database['public']['Tables']['users']['Row'];

export function PatientSuccessCard({
  patient,
  createdLabel,
}: {
  patient: UserRow;
  createdLabel: string;
}) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1, type: 'spring', damping: 20 }}
      className="flex items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4"
    >
      <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden ring-2 ring-emerald-500/30 ring-offset-1 ring-offset-background">
        {patient.profile_img ? (
          <Image
            src={patient.profile_img}
            alt={patient.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-emerald-500/10 text-emerald-600 font-bold text-xl">
            {patient.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-foreground truncate">{patient.name}</p>
        <p className="text-sm text-muted-foreground truncate">
          {patient.email}
        </p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600">
        <Check className="h-3 w-3" strokeWidth={3} />
        {createdLabel}
      </span>
    </motion.div>
  );
}
