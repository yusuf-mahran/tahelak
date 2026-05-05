'use client';

import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { X, Skull, BadgeInfo, BadgeCheck, Siren } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { TypographyH4, TypographyP } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface ToastOptions {
  title?: string;
  description?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

const ToastContent = ({
  title,
  description,
  type,
  closeToast,
}: ToastOptions & { closeToast?: () => void }) => {
  const icons = {
    success: <BadgeCheck className="h-8 w-8 text-success" />,
    error: <Siren className="h-8 w-8 text-destructive" />,
    warning: <Skull className="h-8 w-8 text-warning" />,
    info: <BadgeInfo className="h-8 w-8 text-info" />,
  };

  const variants = {
    success: 'border-success bg-white/50',
    error: 'border-destructive bg-white/50',
    warning: 'border-warning bg-white/50',
    info: 'border-info bg-white/50',
  };

  return (
    <Card
      className={cn(
        'flex w-full items-start gap-3 rounded-lg border py-4 px-2 shadow-lg backdrop-blur-md transition-all',
        variants[type || 'info'],
      )}
    >
      <div className="shrink-0">{icons[type || 'info']}</div>
      <div className="flex-1 space-y-1 mt-2">
        {title && (
          <TypographyH4 className="text-base font-bold leading-none tracking-tight text-black border-none pb-0">
            {title}
          </TypographyH4>
        )}
        <TypographyP className="text-base font-medium text-black/90 leading-relaxed m-0">
          {description}
        </TypographyP>
      </div>
      <button
        type="button"
        title="Close Toast"
        onClick={closeToast}
        className="shrink-0 rounded-md p-1 text-slate-400 hover:text-slate-900 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </Card>
  );
};

export const useToast = () => {
  const { locale } = useLanguage();
  const isRTL = locale === 'ar';

  const showToast = useCallback(
    (options: ToastOptions) => {
      const { type = 'info', title, description } = options;

      setTimeout(() => {
        toast(
          ({ closeToast }) => (
            <ToastContent
              title={title}
              description={description}
              type={type}
              closeToast={closeToast}
            />
          ),
          {
            type,
            position: isRTL ? 'bottom-left' : 'bottom-right',
            icon: false,
            closeButton: false,
            autoClose: 8000,
            draggable: true,
            className:
              '!bg-transparent !border-0 !shadow-none !p-0 !min-h-0 !min-w-xl',
          },
        );
      }, 0);
    },
    [isRTL],
  );

  return { showToast };
};
