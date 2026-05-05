'use client';

import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepBarProps {
  /** 1-indexed current step */
  currentStep: number;
  steps: { label: string }[];
  /** When provided, step circles/labels become clickable buttons. */
  onStepClick?: (step: number) => void;
}

export function StepBar({ currentStep, steps, onStepClick }: StepBarProps) {
  return (
    <div className="sticky top-0 z-10 px-6 py-4 bg-background/95 backdrop-blur-xl border-b border-primary/8 shrink-0">
      <div className="flex items-center gap-2">
        {steps.map((step, i) => {
          const num = i + 1;
          const isCompleted = currentStep > num;
          const isActive = currentStep === num;
          const isClickable = !!onStepClick && num !== currentStep;

          const stepContent = (
            <>
              <div
                className={cn(
                  'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                  isCompleted || isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'bg-muted/40 text-muted-foreground',
                  isActive && 'scale-105',
                )}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                ) : (
                  num
                )}
              </div>
              <span
                className={cn(
                  'text-sm font-semibold transition-colors',
                  isActive ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {step.label}
              </span>
            </>
          );

          return (
            <Fragment key={num}>
              {isClickable ? (
                <button
                  type="button"
                  onClick={() => onStepClick(num)}
                  className="flex items-center gap-2 shrink-0 max-sm:flex-col rounded-lg px-1 py-0.5 hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {stepContent}
                </button>
              ) : (
                <div className="flex items-center gap-2 shrink-0 max-sm:flex-col">
                  {stepContent}
                </div>
              )}

              {/* Progress segment between steps */}
              {i < steps.length - 1 && (
                <div className="relative flex-1 h-1 min-w-4 rounded-full bg-muted/40 overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 start-0 bg-primary rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: currentStep > num ? '100%' : '0%' }}
                    transition={{ duration: 0.45, ease: 'easeInOut' }}
                  />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
