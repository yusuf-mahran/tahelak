'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { CloseConfirmOverlay } from '@/components/ui/close-confirm-overlay';

export interface ModalSidedProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** If true, closing prompts a confirmation warning. Default: true */
  confirmClose?: boolean;
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}

export function ModalSided({
  isOpen,
  onClose,
  title,
  children,
  className,
  confirmClose = true,
}: ModalSidedProps) {
  const { locale } = useLanguage();
  const isRtl = locale === 'ar';
  const isMobile = useIsMobile();
  const [showWarning, setShowWarning] = useState(false);

  const requestClose = () => {
    if (confirmClose) {
      setShowWarning(true);
    } else {
      onClose();
    }
  };

  const confirmAndClose = () => {
    setShowWarning(false);
    onClose();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showWarning) setShowWarning(false);
        else requestClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, showWarning]);

  const panelVariants = isMobile
    ? {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' },
      }
    : {
        initial: { x: isRtl ? '-100%' : '100%' },
        animate: { x: 0 },
        exit: { x: isRtl ? '-100%' : '100%' },
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={requestClose}
            className="absolute inset-0 bg-blur-dark"
          />

          {/* Panel anchor */}
          <div
            className={cn(
              'absolute',
              isMobile
                ? 'inset-x-0 bottom-0'
                : isRtl
                  ? 'inset-y-0 left-0'
                  : 'inset-y-0 right-0',
            )}
          >
            <motion.div
              variants={panelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              className={cn(
                'relative flex flex-col bg-background/97 backdrop-blur-2xl shadow-2xl',
                isMobile
                  ? 'w-full h-[95dvh] rounded-t-3xl border-t border-x border-border/50'
                  : 'h-dvh md:w-[66vw] lg:w-[50vw] max-w-full lg:max-w-3xl min-w-80 rounded-s-3xl border-s border-y border-border/50',
                className,
              )}
            >
              {/* Mobile drag indicator */}
              {isMobile && (
                <div className="flex justify-center pt-3 pb-1 shrink-0">
                  <div className="h-1 w-10 rounded-full bg-muted-foreground/20" />
                </div>
              )}

              {/* Header */}
              <div className="flex items-center gap-3 border-b border-primary/10 px-6 py-4 shrink-0">
                {title && (
                  <div className="flex-1 min-w-0">
                    {typeof title === 'string' ? (
                      <h2 className="text-xl font-bold tracking-tight text-primary truncate">
                        {title}
                      </h2>
                    ) : (
                      title
                    )}
                  </div>
                )}
                <button
                  type="button"
                  title={locale === 'ar' ? 'إغلاق' : 'Close'}
                  onClick={requestClose}
                  className="group ms-auto shrink-0 rounded-full p-2 transition-colors hover:bg-primary/10"
                >
                  <X className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                {children}
              </div>

              {/* Close-confirmation overlay */}
              <CloseConfirmOverlay
                show={showWarning}
                onKeep={() => setShowWarning(false)}
                onDiscard={confirmAndClose}
                locale={locale}
                align="end"
              />
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
