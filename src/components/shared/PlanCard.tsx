'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button, type ButtonProps } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';

export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular: boolean;
}

interface PlanCardProps {
  plan: Plan;
  icon?: LucideIcon;
  isSelected: boolean;
  buttonLabel: string;
  buttonVariant?: ButtonProps['variant'];
  buttonSize?: ButtonProps['size'];
  buttonDisabled?: boolean;
  /** If set, the entire card becomes clickable */
  onCardClick?: () => void;
  onButtonClick: () => void;
  popularLabel?: string;
  priceInterval?: string;
}

export function PlanCard({
  plan,
  icon: Icon,
  isSelected,
  buttonLabel,
  buttonVariant,
  buttonSize,
  buttonDisabled,
  onCardClick,
  onButtonClick,
  popularLabel = 'Most Popular',
  priceInterval = '/year',
}: PlanCardProps) {
  return (
    <div
      onClick={onCardClick}
      className={cn(
        'relative flex flex-col p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg group',
        isSelected
          ? 'border-primary ring-2 ring-primary bg-primary/3 scale-[1.02]'
          : 'border-border bg-background hover:-translate-y-0.5',
        onCardClick && 'cursor-pointer select-none',
      )}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0">
          <Badge className="rounded-none rounded-bl-xl rounded-tr-xl bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-widest">
            {popularLabel}
          </Badge>
        </div>
      )}

      {Icon && (
        <div
          className={cn(
            'w-11 h-11 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110',
            plan.popular || isSelected
              ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
              : 'bg-muted text-muted-foreground',
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      )}

      <div className="mb-5">
        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
          {plan.name}
        </p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-black text-foreground">
            ${plan.price}
          </span>
          <span className="text-muted-foreground text-xs font-medium">
            {priceInterval}
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground min-h-8 leading-relaxed">
          {plan.description}
        </p>
      </div>

      <ul className="grow space-y-2.5 mb-6">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <div
              className={cn(
                'mt-0.5 p-0.5 rounded-full shrink-0',
                plan.popular || isSelected
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              <Check className="h-3 w-3" />
            </div>
            <span className="text-xs text-foreground/80 leading-relaxed">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Button
        className="w-full rounded-xl"
        variant={buttonVariant ?? (isSelected ? 'outline' : 'default')}
        size={buttonSize}
        disabled={buttonDisabled ?? isSelected}
        onClick={(e) => {
          if (onCardClick) e.stopPropagation();
          if (!(buttonDisabled ?? isSelected)) onButtonClick();
        }}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}
