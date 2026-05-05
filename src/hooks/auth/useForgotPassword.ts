'use client';

import { sendPasswordResetEmail, updatePassword } from '@/repositories/auth';
import { useState } from 'react';

export const useForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'request' | 'token' | 'success'>('request');

  const handleResetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(email);
      setStep('token');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : 'Failed to send reset email',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = async (
    passwordValue?: string,
    tokenValue?: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      await updatePassword(
        email,
        passwordValue ?? newPassword,
        tokenValue ?? token,
      );
      setStep('success');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : 'Failed to update password',
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    token,
    setToken,
    newPassword,
    setNewPassword,
    handleResetPassword,
    handleTokenSubmit,
    loading,
    error,
    step,
  };
};
