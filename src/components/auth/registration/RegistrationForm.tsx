'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import * as z from 'zod/mini';
import { Input, ImageInput } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { useRegistration } from '@/hooks/auth/useRegistration';
import {
  Building2,
  Eye,
  EyeOff,
  Home,
  Link,
  Lock,
  Mail,
  User,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/useToast';

export function RegistrationForm() {
  const { localeData } = useLanguage();
  const { registrationData, syncRegistrationData } = useRegistration();
  const { errors: registerErrors, ...registerData } = localeData?.auth
    ?.register || {
    name: 'Full Name',
    orgName: 'Organization Name',
    orgLink: 'Organization Website (optional)',
    orgLogo: 'Organization Logo (optional)',
    orgAddress: 'Organization Address',
    email: 'Email',
    password: 'Password',
    next: 'Next',
  };
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const errorParam = useSearchParams().get('error') === 'true';
  const router = useRouter();
  const { showToast } = useToast();

  const zodSchema = useMemo(
    () =>
      z.object({
        orgLogo: z.any(), // Optional or add validation as needed
        name: z
          .string()
          .check(z.trim())
          .check(
            z.minLength(1, registerErrors?.nameEmpty || 'Name is required'),
          )
          .check(z.toUpperCase()),
        orgName: z
          .string()
          .check(z.trim())
          .check(
            z.minLength(
              1,
              registerErrors?.orgNameEmpty || 'Organization name is required',
            ),
          ),
        orgLink: z.nullish(z.url()),
        orgAddress: z
          .string()
          .check(z.trim())
          .check(
            z.minLength(
              1,
              registerErrors?.orgAddressEmpty ||
                'Organization address is required',
            ),
          ),
        email: z.string().check(z.email(registerErrors?.email || 'Required')),
        password: z
          .string(registerErrors?.passwordTooShort || 'Required')
          .check(
            z.minLength(6, registerErrors?.passwordTooShort || 'Too short'),
          )
          .check(z.maxLength(18, registerErrors?.passwordTooLong || 'Too long'))
          .check(
            z.regex(
              /\d/,
              registerErrors?.passwordNoNumber || 'Must contain a number',
            ),
          )
          .check(
            z.regex(
              /[A-Z]/,
              registerErrors?.passwordNoUpper ||
                'Must contain an uppercase letter',
            ),
          )
          .check(
            z.regex(
              /[a-z]/,
              registerErrors?.passwordNoLower ||
                'Must contain a lowercase letter',
            ),
          )
          .check(
            z.regex(
              /[!@#$%^&*(),.?":{}|<>]/,
              registerErrors?.passwordNoSpecial ||
                'Must contain a special character',
            ),
          ),
      }),
    [registerErrors],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extractZodErrors = (result: any) => {
    const newErrors: Record<string, string> = {};
    for (const issue of result?.error?.issues || []) {
      const path = issue.path?.[0];
      if (path && !newErrors[String(path)]) {
        newErrors[String(path)] = issue.message;
      }
    }
    return newErrors;
  };

  const validate = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { subscriptionPlan: _, ...formFields } = registrationData;
    const result = zodSchema.safeParse({
      ...formFields,
      orgLink: formFields.orgLink || null,
      orgLogo: registrationData.orgLogo,
    });
    if (result.success) {
      setErrors({});
      return true;
    }
    setErrors(extractZodErrors(result));
    return false;
  }, [registrationData, zodSchema]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      router.push('/registration/plans');
      showToast({
        title: localeData?.infoMessages?.registeration?.orgDataSuccess.title,
        description:
          localeData?.infoMessages?.registeration?.orgDataSuccess.description,
        type: 'info',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    syncRegistrationData({ [name]: value });

    // Validate the updated data on change
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { subscriptionPlan: _, ...formFields } = registrationData;
    const updated = { ...formFields, [name]: value };
    const result = zodSchema.safeParse({
      ...updated,
      orgLink: updated.orgLink || null,
      orgLogo: registrationData.orgLogo,
    });

    if (result.success) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    } else {
      const fieldErrors = extractZodErrors(result);
      if (fieldErrors[name]) {
        setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    }
  };

  useEffect(() => {
    if (errorParam) {
      // Use a microtask to avoid synchronous setState in effect
      queueMicrotask(() => validate());
    }
  }, [errorParam, validate]);

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full space-y-8">
      <div className="w-full flex flex-col items-center justify-center space-y-4">
        <ImageInput
          label={registerData?.orgLogo || 'Organization Logo'}
          value={registrationData.orgLogo}
          onChange={(file) => syncRegistrationData({ orgLogo: file })}
          error={errors.orgLogo}
          maxSizeMB={3}
          className="max-w-60"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <Input
            name="name"
            value={registrationData.name}
            onChange={handleChange}
            placeholder={registerData?.name}
            className={`${errors.name ? 'border-destructive' : ''}`}
            icon={User}
          />
          {errors.name && (
            <p className="text-destructive text-sm px-1">{errors.name}</p>
          )}
        </div>

        <div className="space-y-1">
          <Input
            name="orgName"
            value={registrationData.orgName}
            onChange={handleChange}
            placeholder={registerData?.orgName}
            className={`${errors.orgName ? 'border-destructive' : ''}`}
            icon={Building2}
          />
          {errors.orgName && (
            <p className="text-destructive text-sm px-1">{errors.orgName}</p>
          )}
        </div>

        <div className="space-y-1">
          <Input
            name="orgLink"
            value={registrationData.orgLink ?? ''}
            onChange={handleChange}
            placeholder={registerData?.orgLink}
            className={`${errors.orgLink ? 'border-destructive' : ''}`}
            icon={Link}
          />
          {errors.orgLink && (
            <p className="text-destructive text-sm px-1">{errors.orgLink}</p>
          )}
        </div>
        <div className="space-y-1">
          <Input
            name="orgAddress"
            value={registrationData.orgAddress}
            onChange={handleChange}
            placeholder={registerData?.orgAddress}
            className={`${errors.orgAddress ? 'border-destructive' : ''}`}
            icon={Home}
          />
          {errors.orgAddress && (
            <p className="text-destructive text-sm px-1">{errors.orgAddress}</p>
          )}
        </div>

        <div className="space-y-1">
          <Input
            name="email"
            type="email"
            value={registrationData.email}
            onChange={handleChange}
            placeholder={registerData?.email}
            className={`${errors.email ? 'border-destructive' : ''}`}
            icon={Mail}
          />
          {errors.email && (
            <p className="text-destructive text-sm px-1">{errors.email}</p>
          )}
        </div>
        <div className="space-y-1">
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={registrationData.password}
              onChange={handleChange}
              placeholder={registerData?.password}
              className={`pe-12 ${errors.password ? 'border-destructive' : ''}`}
              icon={Lock}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-destructive text-sm px-1">{errors.password}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-10">
        <Button
          type="submit"
          variant="default"
          className="bg-primary hover:bg-primary/75 text-white px-12 py-6 text-xl rounded-xl"
        >
          <span className="w-full h-full flex items-center justify-center">
            {registerData?.next}
          </span>
        </Button>
      </div>
    </form>
  );
}
