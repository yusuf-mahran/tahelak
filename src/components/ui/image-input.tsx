'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AlertCircle, Camera, X } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export interface ImageInputProps {
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  /** Short label shown inside the empty avatar circle */
  label?: string;
  error?: string;
  className?: string;
  maxSizeMB?: number;
}

export function ImageInput({
  value,
  onChange,
  label,
  error,
  maxSizeMB = 5,
}: ImageInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const { locale } = useLanguage();
  const addPhotoLabel = locale === 'ar' ? 'أضف صورة' : 'Add Photo';
  const heroTitle =
    label ?? (locale === 'ar' ? 'أضف صورة شخصية' : 'Add a profile picture');
  const heroSub =
    locale === 'ar'
      ? `اختر صورة واضحة. الحد الأقصى للحجم هو ${maxSizeMB} ميجابايت.`
      : `Choose a clear photo. Max size is ${maxSizeMB}MB.`;

  useEffect(() => {
    const applyPreview = (url: string | null) => {
      setPreview(url);
    };
    // Revoke previous object URL before creating a new one
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      objectUrlRef.current = url;
      applyPreview(url);
      return () => {
        URL.revokeObjectURL(url);
        objectUrlRef.current = null;
      };
    } else if (typeof value === 'string' && value) {
      applyPreview(value);
    } else {
      applyPreview(null);
    }
  }, [value]);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setSizeError(null);
      onChange?.(null);
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setSizeError(
        locale === 'ar'
          ? `يجب أن يكون حجم الملف أقل من ${maxSizeMB} ميجابايت`
          : `File size must be less than ${maxSizeMB}MB`,
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setSizeError(null);
    onChange?.(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) handleFileChange(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files?.[0] ?? null);
  };

  const clearImage = () => {
    handleFileChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const hasError = !!(error || sizeError);

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        'w-full flex flex-col items-center gap-4 px-6 py-8 border-4 border-none rounded-lg transition-colors',
        isDragging &&
          'ring-4 ring-primary/70 ring-offset-2 ring-offset-background border-dashed border-primary/50 bg-primary/10',
        hasError &&
          'border-double border-destructive/50 bg-destructive/10 hover:border-destructive/70',
      )}
    >
      <div className="relative group/av">
        {preview ? (
          <div className="relative h-24 w-24 rounded-full overflow-hidden ring-4 ring-primary/20 ring-offset-2 ring-offset-background shadow-xl">
            <Image src={preview} alt="Patient" fill className="object-cover" />
            <motion.button
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              type="button"
              onClick={clearImage}
              aria-label={locale === 'ar' ? 'إزالة الصورة' : 'Remove image'}
              className="absolute inset-0 flex items-center justify-center bg-black/50"
            >
              <X className="h-6 w-6 text-white" />
            </motion.button>
          </div>
        ) : (
          <label className="relative flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-primary/25 bg-primary/5 transition-all hover:border-primary/45 hover:bg-primary/10 group/lbl">
            <Camera className="h-7 w-7 text-primary/30 transition-colors group-hover/lbl:text-primary/60" />
            <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-primary/35 transition-colors group-hover/lbl:text-primary/55">
              {addPhotoLabel}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif,image/svg+xml"
              className="hidden"
              onChange={handleInputChange}
            />
          </label>
        )}
        {!preview && (
          <div className="pointer-events-none absolute -bottom-1 -end-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-md shadow-primary/30 ring-2 ring-background">
            <Camera className="h-3 w-3 text-primary-foreground" />
          </div>
        )}
      </div>

      <div className="text-center space-y-1">
        <h3 className="text-base font-bold text-foreground">{heroTitle}</h3>
        <p
          className={cn(
            'text-sm max-w-xs leading-relaxed flex items-center justify-center gap-1',
            hasError ? 'text-destructive' : 'text-muted-foreground',
          )}
        >
          {hasError && <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
          {hasError ? sizeError || error : heroSub}
        </p>
      </div>
    </div>
  );
}
