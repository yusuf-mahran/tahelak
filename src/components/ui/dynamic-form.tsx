'use client';

import { useForm, FieldValues, DefaultValues, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageInput } from '@/components/ui/image-input';
import { SectionHeading } from '@/components/dashboard/users/form/SectionHeading';
import { useState, useMemo, ComponentType, SVGProps } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

// ─── Field configuration ──────────────────────────────────────────────────────

export interface DynamicFormField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'textarea'
    | 'select'
    | 'image';
  placeholder?: string;
  colSpan?: 1 | 2;
  options?: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  /** Icon rendered inside the input */
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** Existing image URL shown as preview (used when editing) */
  initialImageUrl?: string;
  /** Groups the field under a named SectionHeading. All consecutive fields sharing
   *  the same key are rendered under a single heading. */
  section?: {
    key: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  };
}

interface DynamicFormProps<T extends FieldValues> {
  fields: DynamicFormField[];
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => void;
  defaultValues?: DefaultValues<T>;
  submitLabel?: string;
  /** Label shown inside the button while submitting */
  loadingLabel?: string;
  isLoading?: boolean;
  /** Optional content rendered after all field sections, before the submit button */
  renderExtra?: () => React.ReactNode;
}

const INPUT_TYPES = ['text', 'email', 'password', 'number', 'tel'] as const;

export function DynamicForm<T extends FieldValues>({
  fields,
  schema,
  onSubmit,
  defaultValues,
  submitLabel = 'Submit',
  loadingLabel = 'Processing...',
  isLoading = false,
  renderExtra,
}: DynamicFormProps<T>) {
  const [imageFiles, setImageFiles] = useState<Record<string, File | null>>({});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues,
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedValues = watch();

  /** The first image field, hoisted to the top of the form */
  const imageField = useMemo(
    () => fields.find((f) => f.type === 'image'),
    [fields],
  );

  /** Non-image fields grouped into consecutive sections */
  const sectionedFields = useMemo(() => {
    type SectionGroup = {
      key?: string;
      label?: string;
      icon?: React.ComponentType<{ className?: string }>;
      fields: DynamicFormField[];
    };
    const sections: SectionGroup[] = [];
    for (const field of fields.filter((f) => f.type !== 'image')) {
      const sKey = field.section?.key;
      const last = sections[sections.length - 1];
      if (sKey && last?.key === sKey) {
        last.fields.push(field);
      } else {
        sections.push({
          key: sKey,
          label: field.section?.label,
          icon: field.section?.icon,
          fields: [field],
        });
      }
    }
    return sections;
  }, [fields]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <form onSubmit={handleSubmit(onSubmit as any)}>
      {/* ── Image — hoisted to top ── */}
      {imageField && (
        <div className="border-b border-border/30">
          <ImageInput
            value={
              imageFiles[imageField.name] ?? imageField.initialImageUrl ?? null
            }
            onChange={(file) => {
              setImageFiles((prev) => ({ ...prev, [imageField.name]: file }));
              setValue(
                imageField.name as Path<T>,
                file as unknown as T[Path<T>],
              );
            }}
            maxSizeMB={3}
          />
        </div>
      )}

      {/* ── Sections + fields ── */}
      <div className="px-6 pb-8 pt-7 space-y-8">
        {sectionedFields.map((section, i) => (
          <div key={section.key ?? i}>
            {section.icon && section.label && (
              <SectionHeading icon={section.icon} label={section.label} />
            )}
            <div className="space-y-4">
              {section.fields.map((field) => {
                const fieldValue = watchedValues[field.name];
                const hasValue = fieldValue != null && fieldValue !== '';
                const isInputType = (INPUT_TYPES as readonly string[]).includes(
                  field.type,
                );

                return (
                  <div key={field.name}>
                    {/* ── Standard inputs ── */}
                    {isInputType ? (
                      <Input
                        id={field.name}
                        type={field.type}
                        placeholder={
                          field.required ? `${field.label} *` : field.label
                        }
                        value={fieldValue != null ? String(fieldValue) : ''}
                        {...register(field.name as Path<T>)}
                        icon={
                          field.icon as
                            | ComponentType<SVGProps<SVGSVGElement>>
                            | undefined
                        }
                        showPasswordToggle={field.type === 'password'}
                        disabled={field.disabled}
                        autoComplete={
                          field.type === 'password' ? 'new-password' : 'off'
                        }
                        className={cn(
                          errors[field.name] &&
                            'border-destructive ring-destructive focus-visible:ring-destructive',
                        )}
                      />
                    ) : field.type === 'select' ? (
                      /* ── Select — floating label ── */
                      <div className="relative flex flex-col space-y-2 group/field">
                        <label
                          htmlFor={field.name}
                          className={cn(
                            'px-4 absolute pointer-events-none transition-all duration-200 rounded-lg z-10',
                            hasValue
                              ? 'backdrop-blur-3xl bg-background/90 text-primary -top-3 start-3 text-sm'
                              : 'bg-muted/5 text-lg text-muted-foreground/70 top-4 start-4 group-focus-within/field:text-primary group-focus-within/field:-top-3 group-focus-within/field:start-3 group-focus-within/field:text-sm group-focus-within/field:backdrop-blur-3xl group-focus-within/field:bg-background/90',
                          )}
                        >
                          {field.required ? `${field.label} *` : field.label}
                        </label>
                        <select
                          id={field.name}
                          {...register(field.name as Path<T>)}
                          disabled={field.disabled}
                          className={cn(
                            'flex h-16 w-full rounded-lg border border-accent bg-muted/30 ps-4 pe-10 py-2 text-lg ring-offset-background appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/80 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all text-foreground',
                            !hasValue && 'text-transparent',
                            errors[field.name] && 'border-destructive',
                          )}
                        >
                          <option value="" />
                          {field.options?.map((opt) => (
                            <option
                              key={opt.value}
                              value={opt.value}
                              className="text-foreground bg-background"
                            >
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute top-1/2 -translate-y-1/2 end-4 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
                      </div>
                    ) : field.type === 'textarea' ? (
                      /* ── Textarea ── */
                      <div className="space-y-2">
                        <label
                          htmlFor={field.name}
                          className="text-sm font-semibold text-muted-foreground/80"
                        >
                          {field.label}
                          {field.required && (
                            <span className="ml-1 text-primary">*</span>
                          )}
                        </label>
                        <textarea
                          id={field.name}
                          {...register(field.name as Path<T>)}
                          placeholder={field.placeholder}
                          disabled={field.disabled}
                          className={cn(
                            'flex min-h-25 w-full rounded-lg border border-accent bg-muted/30 px-4 py-3 text-lg ring-offset-background placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/80 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
                            errors[field.name] && 'border-destructive',
                          )}
                        />
                      </div>
                    ) : null}

                    {errors[field.name] && (
                      <p className="mt-1.5 px-1 text-xs font-semibold text-destructive">
                        {errors[field.name]?.message as string}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {renderExtra?.()}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl py-6 text-base font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-[0.98]"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {loadingLabel}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {submitLabel}
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
