'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CloseConfirmOverlay } from '@/components/ui/close-confirm-overlay';
import { TypographyH3 } from '@/components/ui/typography';
import { useLanguage } from '@/context/LanguageContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** If true, closing the modal will prompt a confirmation warning. Default: true */
  confirmClose?: boolean;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw]',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = 'md',
  confirmClose = true,
}: ModalProps) {
  const { locale } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
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
        if (showWarning) {
          setShowWarning(false);
        } else {
          requestClose();
        }
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
  }, [isOpen, onClose, showWarning]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 w-dvw h-dvh z-50 flex items-center justify-center p-4">
          {/* Backdrop with strong blur for glass effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={requestClose}
            className="absolute inset-0 bg-primary/20 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            ref={modalRef}
            className={cn(
              'relative w-full overflow-hidden rounded-3xl border border-primary/20 bg-background/70 shadow-2xl backdrop-blur-xl',
              sizeClasses[size],
              className,
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-primary/10 p-6">
              {title && (
                <TypographyH3 className="text-xl font-bold tracking-tight text-primary">
                  {title}
                </TypographyH3>
              )}
              <button
                type="button"
                title="Close"
                onClick={requestClose}
                className="group relative rounded-full p-2 transition-colors hover:bg-primary/10"
              >
                <X className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[80vh] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-primary/10">
              {children}
            </div>

            {/* Close Warning Overlay */}
            <CloseConfirmOverlay
              show={showWarning}
              onKeep={() => setShowWarning(false)}
              onDiscard={confirmAndClose}
              locale={locale}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** @alias Modal — center-screen dialog variant */
export { Modal as ModalCentered };
