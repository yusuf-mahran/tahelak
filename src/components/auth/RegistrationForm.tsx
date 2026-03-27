'use client';

import React from 'react';
import * as yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth, REGISTRATION_DATA } from '@/context/AuthContext';
import { Triangle } from 'lucide-react';
import Link from 'next/link';

export function RegistrationForm() {
  const { localeData } = useLanguage();
  const { registrationData, syncRegistrationData } = useAuth();
  const registerDict = localeData?.auth?.register;
  const [formData, setFormData] = React.useState<REGISTRATION_DATA>({
    institutionName: '',
    institutionType: '',
    institutionLink: '',
    address: '',
    email: '',
    password: '',
    doctorsCount: 30,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [doctorsCount, setDoctorsCount] = React.useState(30);

  // Initialize from context
  React.useEffect(() => {
    if (registrationData) {
      setFormData((prev) => ({ ...prev, ...registrationData }));
      setDoctorsCount(registrationData.doctorsCount || 30);
    }
  }, [registrationData]);

  const schema = yup.object().shape({
    institutionName: yup
      .string()
      .required(registerDict?.errors?.required || 'Required'),
    institutionType: yup
      .string()
      .required(registerDict?.errors?.required || 'Required'),
    institutionLink: yup.string().optional(),
    address: yup
      .string()
      .required(registerDict?.errors?.required || 'Required'),
    email: yup
      .string()
      .required(registerDict?.errors?.required || 'Required')
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        registerDict?.errors?.email || 'Invalid email address',
      ),
    password: yup
      .string()
      .required(registerDict?.errors?.required || 'Required')
      .min(6, registerDict?.errors?.password || 'Too short'),
  });

  const validate = async () => {
    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await validate()) {
      syncRegistrationData(formData, doctorsCount);
      // Proceed to next step
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    syncRegistrationData({ [name]: value }, doctorsCount);

    // Validate field on change
    try {
      const fieldSchema = yup.reach(schema, name) as yup.Schema;
      await fieldSchema.validate(value);
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setErrors((prev) => ({ ...prev, [name]: err.message }));
      }
    }
  };

  const containerRef = React.useRef<HTMLDivElement>(null);

  const calculateValue = (clientX: number) => {
    if (!containerRef.current) return doctorsCount;
    const rect = containerRef.current.getBoundingClientRect();
    const isRtl = document.dir === 'rtl';
    const x = clientX - rect.left;
    const percentage = isRtl ? (rect.width - x) / rect.width : x / rect.width;
    const newValue = Math.round(percentage * 100);
    const val = Math.min(100, Math.max(0, newValue));
    syncRegistrationData({}, val);
    return val;
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
      const clientX =
        'touches' in moveEvent
          ? moveEvent.touches[0].clientX
          : moveEvent.clientX;
      setDoctorsCount(calculateValue(clientX));
    };

    const upHandler = () => {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
      document.removeEventListener('touchmove', moveHandler);
      document.removeEventListener('touchend', upHandler);
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
    document.addEventListener('touchmove', moveHandler, { passive: false });
    document.addEventListener('touchend', upHandler);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDoctorsCount(calculateValue(clientX));
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <Input
            name="institutionName"
            value={formData.institutionName}
            onChange={handleChange}
            placeholder={registerDict?.institutionName}
            className={`h-14 text-lg border-gray-300 rounded-lg text-start ${
              errors.institutionName ? 'border-red-500' : ''
            }`}
          />
          {errors.institutionName && (
            <p className="text-red-500 text-sm px-1">
              {errors.institutionName}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Input
            name="institutionType"
            value={formData.institutionType}
            onChange={handleChange}
            placeholder={registerDict?.institutionType}
            className={`h-14 text-lg border-gray-300 rounded-lg text-start ${
              errors.institutionType ? 'border-red-500' : ''
            }`}
          />
          {errors.institutionType && (
            <p className="text-red-500 text-sm px-1">
              {errors.institutionType}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Input
            name="institutionLink"
            value={formData.institutionLink}
            onChange={handleChange}
            placeholder={registerDict?.institutionLink}
            className="h-14 text-lg border-gray-300 rounded-lg text-start"
          />
        </div>
        <div className="space-y-1">
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder={registerDict?.address}
            className={`h-14 text-lg border-gray-300 rounded-lg text-start ${
              errors.address ? 'border-red-500' : ''
            }`}
          />
          {errors.address && (
            <p className="text-red-500 text-sm px-1">{errors.address}</p>
          )}
        </div>

        <div className="space-y-1">
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={registerDict?.email}
            className={`h-14 text-lg border-gray-300 rounded-lg text-start ${
              errors.email ? 'border-red-500' : ''
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm px-1">{errors.email}</p>
          )}
        </div>
        <div className="space-y-1">
          <Input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={registerDict?.password}
            className={`h-14 text-lg border-gray-300 rounded-lg text-start ${
              errors.password ? 'border-red-500' : ''
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm px-1">{errors.password}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-start gap-6 mt-8">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex max-xs:flex-col items-center gap-4 xs:min-w-75 w-full md:w-64">
            <span className="text-gray-700 font-medium whitespace-nowrap mb-1">
              {registerDict?.doctorsCount}
            </span>
            <div
              ref={containerRef}
              className="relative w-full h-2 bg-gray-300 rounded-full cursor-pointer touch-none"
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              <div
                className="absolute top-0 start-0 h-full bg-primary rounded-full"
                style={{
                  width: `${Math.min(100, (doctorsCount / 100) * 100)}%`,
                }}
              />
              <div
                className="flex-center absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white border-2 border-border rounded-full shadow-lg cursor-pointer z-10"
                style={{
                  [document.dir === 'rtl' ? 'right' : 'left']: `calc(${Math.min(
                    100,
                    (doctorsCount / 100) * 100,
                  )}% - 16px)`,
                }}
              >
                {/* absolute label that move with slider containing the doctors count */}
                <span className="rotate-6 absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 rounded-full p-2 bg-primary text-xl text-primary-foreground font-medium whitespace-nowrap">
                  {doctorsCount}
                  <Triangle className="h-5 w-5 text-primary/70 absolute -top-2.5 left-1/2 -translate-x-1/2" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-10">
        <Button
          type="submit"
          variant="default"
          className="bg-primary hover:bg-primary/75 text-white px-12 py-6 text-xl rounded-xl"
        >
          <Link
            href="/registration/plans"
            className="w-full h-full flex items-center justify-center"
          >
            {registerDict?.next}
          </Link>
        </Button>
      </div>
    </form>
  );
}
