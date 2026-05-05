'use client';

import React, { useRef, KeyboardEvent, ClipboardEvent } from 'react';
import { cn } from '@/lib/utils';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  className?: string;
}

export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  className,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const focusAt = (index: number) => {
    inputRefs.current[Math.max(0, Math.min(index, length - 1))]?.focus();
  };

  const handleChange = (index: number, char: string) => {
    const digit = char.replace(/\D/g, '').slice(-1);
    const next = digits.map((d, i) => (i === index ? digit : d)).join('');
    onChange(next);
    if (digit && index < length - 1) focusAt(index + 1);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = digits.map((d, i) => (i === index ? '' : d)).join('');
        onChange(next);
      } else {
        focusAt(index - 1);
      }
    } else if (e.key === 'ArrowLeft') {
      focusAt(index - 1);
    } else if (e.key === 'ArrowRight') {
      focusAt(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, length);
    onChange(
      pasted
        .padEnd(value.length > pasted.length ? value.length : 0, '')
        .slice(0, length),
    );
    if (pasted.length > 0) focusAt(Math.min(pasted.length, length - 1));
  };

  return (
    <div className={cn('flex gap-2 justify-center', className)} dir="ltr">
      {digits.map((digit, index) => (
        <label key={index} className="relative">
          <input
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={disabled}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            placeholder="-"
            title={`Digit ${index + 1}`}
            className={cn(
              'w-12 h-14 rounded-xl border-2 bg-muted/30 text-center text-xl font-mono font-bold transition-all duration-200',
              'focus:outline-none focus:ring-0 focus:border-primary focus:bg-primary/5 focus:text-primary',
              'border-accent hover:border-primary/40',
              digit
                ? 'border-primary/60 bg-primary/5 text-primary'
                : 'text-foreground',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
          />
        </label>
      ))}
    </div>
  );
}
