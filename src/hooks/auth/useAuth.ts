'use client';

import { useEffect, useState } from 'react';
import {
  getUserSession,
  logout,
  unSubOnAuthStateChange,
} from '@/repositories/auth';
import { Session, User } from '@supabase/supabase-js';

function clearRegistrationStorage() {
  try {
    localStorage.removeItem('registrationData');
    sessionStorage.removeItem('registrationPassword');
    const req = indexedDB.open('registrationDB', 1);
    req.onsuccess = () => {
      const db = req.result;
      if (db.objectStoreNames.contains('files')) {
        const tx = db.transaction('files', 'readwrite');
        tx.objectStore('files').delete('orgLogo');
        db.close();
      }
    };
  } catch {
    // ignore — storage may not exist
  }
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await logout();
      setUser(null);
      setSession(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const userSession = await getUserSession();
        if (userSession?.session && userSession?.user) {
          setSession(userSession.session);
          setUser(userSession.user);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSession();

    const unsubscribe = unSubOnAuthStateChange(async (_event, session) => {
      if (session?.user) {
        clearRegistrationStorage();
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    user,
    setUser,
    session,
    setSession,
    loading,
    error,
    handleLogout,
  };
};
