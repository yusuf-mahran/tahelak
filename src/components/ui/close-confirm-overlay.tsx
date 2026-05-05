'use client';

import { useEffect, useId, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CloseConfirmOverlayProps {
  show: boolean;
  onKeep: () => void;
  onDiscard: () => void;
  locale: string;
  /**
   * Controls vertical alignment of the dialog card within the overlay.
   * - `'center'` — used inside centered modals (default)
   * - `'end'`    — used inside side panels, card floats near the bottom
   */
  align?: 'center' | 'end';
}

/**
 * Accessible close-confirmation overlay.
 *
 * Accessibility features:
 * - `role="alertdialog"` + `aria-modal` on the card
 * - `aria-labelledby` / `aria-describedby` via `useId`
 * - Auto-focuses the safe "Keep Editing" button on mount
 * - Focus trap: Tab / Shift+Tab cycles only between the two action buttons
 */
export function CloseConfirmOverlay({
  show,
  onKeep,
  onDiscard,
  locale,
  align = 'center',
}: CloseConfirmOverlayProps) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;

  const keepRef = useRef<HTMLButtonElement>(null);
  const discardRef = useRef<HTMLButtonElement>(null);

  // Auto-focus the safe button as soon as the dialog appears
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => keepRef.current?.focus(), 40);
    return () => clearTimeout(t);
  }, [show]);

  // Trap focus inside the two buttons
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return;
    const buttons = [keepRef.current, discardRef.current].filter(
      (b): b is HTMLButtonElement => b !== null,
    );
    if (buttons.length < 2) return;
    const [first, last] = [buttons[0], buttons[buttons.length - 1]];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            'absolute inset-0 z-20 flex justify-center bg-background/80 backdrop-blur-sm rounded-[inherit] px-6',
            align === 'end' ? 'items-end pb-10' : 'items-center',
          )}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            onKeyDown={handleKeyDown}
            initial={{ scale: 0.95, opacity: 0, y: align === 'end' ? 20 : 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: align === 'end' ? 20 : 10 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="w-full max-w-sm flex flex-col items-center gap-5 rounded-3xl border border-primary/25 bg-background/95 p-8 text-center shadow-2xl"
          >
            {/* Icon — decorative */}
            <div
              aria-hidden="true"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/10"
            >
              <AlertTriangle className="h-7 w-7 text-primary" />
            </div>

            {/* Labelled content */}
            <div className="space-y-1.5">
              <p id={titleId} className="text-base font-bold text-foreground">
                {locale === 'en'
                  ? 'Discard changes?'
                  : 'هل تريد تجاهل التغييرات؟'}
              </p>
              <p id={descId} className="text-sm text-muted-foreground">
                {locale === 'en'
                  ? 'You have unsaved information. Closing will lose your progress.'
                  : 'لديك معلومات غير محفوظة. الإغلاق سيؤدي إلى فقدان تقدمك.'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex w-full gap-3">
              <button
                ref={keepRef}
                type="button"
                onClick={onKeep}
                className="flex-1 rounded-2xl border border-border/60 bg-background py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {locale === 'en' ? 'Keep Editing' : 'استمر في التحرير'}
              </button>
              <button
                ref={discardRef}
                type="button"
                onClick={onDiscard}
                className="flex-1 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {locale === 'en' ? 'Discard' : 'تجاهل'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
