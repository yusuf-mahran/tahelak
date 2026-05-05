import * as React from 'react';
import { Eye, EyeOff, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratePassword } from 'generate-password-lite';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

const STRENGTH_LEVELS = [
  null,
  { score: 1, key: 'weak', barClass: 'bg-red-500', textClass: 'text-red-500' },
  {
    score: 2,
    key: 'fair',
    barClass: 'bg-amber-500',
    textClass: 'text-amber-500',
  },
  {
    score: 3,
    key: 'good',
    barClass: 'bg-yellow-500',
    textClass: 'text-yellow-500',
  },
  {
    score: 4,
    key: 'strong',
    barClass: 'bg-emerald-500',
    textClass: 'text-emerald-500',
  },
  {
    score: 5,
    key: 'veryStrong',
    barClass: 'bg-emerald-600',
    textClass: 'text-emerald-600',
  },
] as const;

function getPasswordStrength(password: string) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return STRENGTH_LEVELS[Math.max(1, Math.min(5, score))];
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  showPasswordToggle?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      icon: Icon,
      showPasswordToggle,
      onChange,
      value,
      ...restProps
    },
    ref,
  ) => {
    const { locale } = useLanguage();
    const isAr = locale === 'ar';
    const [showPassword, setShowPassword] = React.useState(false);
    const [liveValue, setLiveValue] = React.useState(String(value ?? ''));
    const internalRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      setLiveValue(String(value ?? ''));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLiveValue(e.target.value);
      onChange?.(e);
    };

    const strengthText: Record<string, string> = {
      weak: isAr ? 'ضعيفة' : 'Weak',
      fair: isAr ? 'مقبولة' : 'Fair',
      good: isAr ? 'جيدة' : 'Good',
      strong: isAr ? 'قوية' : 'Strong',
      veryStrong: isAr ? 'قوية جداً' : 'Very Strong',
    };

    const mergeRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        (
          internalRef as React.MutableRefObject<HTMLInputElement | null>
        ).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLInputElement | null>).current =
            node;
      },
      [ref],
    );

    const handleGenerate = () => {
      const generated = GeneratePassword({
        length: 18,
        lowercase: true,
        uppercase: true,
        numbers: true,
        symbols: true,
        minLengthLowercase: 2,
        minLengthUppercase: 2,
        minLengthNumbers: 2,
        minLengthSymbols: 2,
      });
      const input = internalRef.current;
      if (!input) return;
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set;
      nativeSetter?.call(input, generated);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      setLiveValue(generated);
      setShowPassword(true);
    };

    const resolvedType =
      showPasswordToggle && type === 'password'
        ? showPassword
          ? 'text'
          : 'password'
        : type;

    const strength = showPasswordToggle ? getPasswordStrength(liveValue) : null;

    return (
      <>
        {/* Using relative positioning to allow the label to be positioned absolutely within the input container */}
        {/* The label is placed above the input field and styled to look like a floating label */}
        <div className="relative flex flex-col space-y-2 group/field">
          {/* get icon as a prop to use it here instead of lock icon */}
          {Icon && (
            <Icon className="absolute top-1/2 start-4 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 group-focus-within/field:text-primary transition-colors" />
          )}
          {
            <label
              className={cn(
                value
                  ? 'backdrop-blur-3xl bg-background/90 text-primary -top-3 start-3 text-md'
                  : 'bg-muted/5 text-lg text-muted-foreground/70 top-4 start-10 group-focus-within/field:text-primary group-focus-within/field:-top-3 group-focus-within/field:start-3 group-focus-within/field:text-sm group-focus-within/field:backdrop-blur-3xl',
                'px-4 absolute pointer-events-none transition-all duration-200 group-focus-within/field:bg-background/90 group-focus-within/field:text-primary rounded-lg',
              )}
            >
              {restProps.placeholder}
            </label>
          }
          <input
            type={resolvedType}
            className={cn(
              'flex h-16 w-full rounded-lg text-start border border-accent bg-muted/30 ps-12 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:opacity-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/80 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              showPasswordToggle ? 'pe-16' : 'pe-4',
              className,
            )}
            ref={mergeRef}
            value={value}
            onChange={handleChange}
            {...restProps}
          />
          {showPasswordToggle && (
            <>
              <button
                type="button"
                onClick={handleGenerate}
                title="Generate strong password"
                aria-label="Generate strong password"
                className="absolute top-1/2 -translate-y-1/2 end-9 text-muted-foreground/50 hover:text-primary transition-colors"
                tabIndex={-1}
              >
                <Wand2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground/50 hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </>
          )}
        </div>

        {showPasswordToggle && (
          <AnimatePresence>
            {strength && liveValue && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-1.5">
                  <div className="flex gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          'h-1.5 flex-1 rounded-full transition-colors duration-300',
                          i < strength.score
                            ? strength.barClass
                            : 'bg-muted/40',
                        )}
                      />
                    ))}
                  </div>
                  <p
                    className={cn('text-xs font-semibold', strength.textClass)}
                  >
                    {strengthText[strength.key]}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </>
    );
  },
);
Input.displayName = 'Input';

export { Input };
