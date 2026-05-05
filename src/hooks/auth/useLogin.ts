'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { login } from '@/repositories/auth';
import { useToast } from '../useToast';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser, setSession } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (error) {
      showToast({
        title: 'Login Failed',
        description: error,
        type: 'error',
      });
    }
  }, [error, showToast]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await login(email, password);
      setUser(result.user);
      setSession(result.session);
      return result;
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleLogin,
    loading,
    error,
    email,
    setEmail,
    password,
    setPassword,
  };
};
