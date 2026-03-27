'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Session, User } from '@supabase/supabase-js';

export type REGISTRATION_DATA = {
  institutionName: string;
  institutionType: string;
  address: string;
  institutionLink?: string;
  doctorsCount: number;
  email: string;
  password: string;
  selectedPlan?: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  registrationData: REGISTRATION_DATA | null;
  setRegistrationData: (data: REGISTRATION_DATA) => void;
  syncRegistrationData: (
    data: Partial<REGISTRATION_DATA>,
    count?: number,
  ) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registrationData, setRegistrationData] =
    useState<REGISTRATION_DATA | null>(null);
  const supabase = createClient();

  // Initialize from context or localStorage
  useEffect(() => {
    const saved = localStorage.getItem('registration_data');
    const updateRegistrationData = (
      data: Partial<REGISTRATION_DATA>,
      count?: number,
    ) => {
      setRegistrationData({
        institutionName: data?.institutionName || '',
        institutionType: data?.institutionType || '',
        address: data?.address || '',
        institutionLink: data?.institutionLink || '',
        email: data?.email || '',
        password: '', // Never restore password from storage
        doctorsCount: count || 30,
        selectedPlan: data?.selectedPlan || '',
      });
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        updateRegistrationData(parsed.formData, parsed.doctorsCount);
      } catch (e) {
        console.error('Failed to load saved registration data', e);
      }
    }
  }, []);

  const syncRegistrationData = (
    data: Partial<REGISTRATION_DATA>,
    count?: number,
  ) => {
    setRegistrationData((prev) => {
      const newData = {
        ...(prev || {
          institutionName: '',
          institutionType: '',
          address: '',
          institutionLink: '',
          email: '',
          password: '',
          doctorsCount: 30,
        }),
        ...data,
      } as REGISTRATION_DATA;

      if (count !== undefined) {
        newData.doctorsCount = count;
      }

      // 2. LocalStorage (persistent but secure, excludes password)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeData } = newData;
      localStorage.setItem(
        'registration_data',
        JSON.stringify({
          formData: safeData,
          doctorsCount: newData.doctorsCount,
        }),
      );

      return newData;
    });
  };

  useEffect(() => {
    const setData = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    setData();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signOut,
        signIn,
        signUp,
        registrationData,
        setRegistrationData,
        syncRegistrationData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
