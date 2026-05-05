'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Stethoscope } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { SectionHeading } from './SectionHeading';
import type { Database } from '@/lib/supabase';

type UserRow = Database['public']['Tables']['users']['Row'];

export function DoctorPicker({
  doctors,
  selectedId,
  sectionLabel,
  onSelect,
}: {
  doctors: UserRow[];
  selectedId: string;
  sectionLabel: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <SectionHeading icon={Stethoscope} label={sectionLabel} />
      <div className="flex gap-3 overflow-x-auto py-1 -mx-1 px-1 scrollbar-none snap-x snap-mandatory">
        {doctors.map((doc) => {
          const isSel = selectedId === doc.user_id;
          return (
            <button
              key={doc.id}
              type="button"
              onClick={() => onSelect(doc.user_id)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-all duration-200 shrink-0 w-28 snap-start text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isSel
                  ? 'border-primary bg-primary/8 shadow-lg shadow-primary/15'
                  : 'border-border/40 bg-muted/10 hover:border-border hover:bg-muted/20',
              )}
            >
              <div className="relative h-14 w-14 rounded-full overflow-hidden shrink-0">
                {doc.profile_img ? (
                  <Image
                    src={doc.profile_img}
                    alt={doc.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xl">
                    {doc.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <AnimatePresence>
                  {isSel && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 flex items-center justify-center bg-primary/25"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-md">
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span
                className={cn(
                  'text-[11px] font-semibold leading-tight line-clamp-2 w-full transition-colors',
                  isSel ? 'text-primary' : 'text-foreground/80',
                )}
              >
                {doc.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
