'use client';

import { useEffect, useState } from 'react';
import { signUp } from '@/repositories/auth';
import { useAuth } from './useAuth';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { useRouter } from 'next/navigation';
import { useToast } from '../useToast';
import { useLanguage } from '@/context/LanguageContext';

export interface REGISTRATION_DATA {
  name: string;
  orgName: string;
  orgAddress: string;
  orgLink: string | null;
  orgLogo?: File | null;
  email: string;
  password: string;
  subscriptionPlan: {
    id: string;
    name: string;
    price: number;
    experies_at?: string;
  };
}

export const useRegistration = () => {
  const { user, setUser, session, setSession } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localDataLoaded, setLocalDataLoaded] = useState(false);
  const [registrationData, setRegistrationData] = useState<REGISTRATION_DATA>({
    name: '',
    orgName: '',
    orgLink: null,
    orgAddress: '',
    orgLogo: null,
    email: '',
    password: '',
    subscriptionPlan: {
      id: '',
      name: '',
      price: 0,
      experies_at: undefined,
    },
  });
  const router = useRouter();
  const { showToast } = useToast();
  const { locale } = useLanguage();

  useEffect(() => {
    if (error) {
      showToast({
        title: locale === 'ar' ? 'حدث خطأ ما' : 'Some error occurred',
        description: error,
        type: 'error',
      });
    }
  }, [error, showToast, locale]);

  // IndexedDB helpers for storing the logo as a native File/Blob
  const openLogoDB = (): Promise<IDBDatabase> =>
    new Promise((resolve, reject) => {
      const req = indexedDB.open('registrationDB', 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore('files');
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

  const saveLogo = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const db = await openLogoDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction('files', 'readwrite');
      tx.objectStore('files').put(
        { blob: arrayBuffer, name: file.name, type: file.type },
        'orgLogo',
      );
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  };

  const loadLogo = async (): Promise<File | null> => {
    try {
      const db = await openLogoDB();
      return new Promise((resolve) => {
        const tx = db.transaction('files', 'readonly');
        const req = tx.objectStore('files').get('orgLogo');
        req.onsuccess = () => {
          db.close();
          if (req.result) {
            const { blob, name, type } = req.result;
            resolve(new File([blob], name, { type }));
          } else {
            resolve(null);
          }
        };
        req.onerror = () => {
          db.close();
          resolve(null);
        };
      });
    } catch {
      return null;
    }
  };

  const deleteLogo = async () => {
    try {
      const db = await openLogoDB();
      const tx = db.transaction('files', 'readwrite');
      tx.objectStore('files').delete('orgLogo');
      db.close();
    } catch {
      // ignore
    }
  };

  //   sync from local storage on mount
  useEffect(() => {
    const restoreData = async () => {
      const storedData = localStorage.getItem('registrationData');
      const storedPassword = sessionStorage.getItem('registrationPassword');
      const orgLogo = await loadLogo();

      setRegistrationData((prev) => ({
        ...prev,
        ...(storedData ? JSON.parse(storedData) : {}),
        ...(storedPassword ? { password: storedPassword } : {}),
        ...(orgLogo ? { orgLogo } : {}),
      }));
      setLocalDataLoaded(true);
    };

    restoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //   sync to local storage on registrationData change (exclude password and logo)
  useEffect(() => {
    if (!localDataLoaded) return; // prevent overwriting local data on initial load
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, orgLogo: __, ...dataToStore } = registrationData;
    localStorage.setItem('registrationData', JSON.stringify(dataToStore));
    if (registrationData.password) {
      sessionStorage.setItem('registrationPassword', registrationData.password);
    }

    // persist logo in IndexedDB (native binary, no encoding overhead)
    if (registrationData.orgLogo instanceof File) {
      saveLogo(registrationData.orgLogo);
    } else if (registrationData.orgLogo === null) {
      deleteLogo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationData, localDataLoaded]);

  const syncRegistrationData = (data: Partial<REGISTRATION_DATA>) => {
    setRegistrationData((prev) => ({ ...prev, ...data }));
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);

    // validate required fields before making API call
    if (
      localDataLoaded &&
      (!registrationData.name.trim() ||
        !registrationData.orgName.trim() ||
        !registrationData.orgAddress.trim() ||
        !registrationData.email.trim() ||
        !registrationData.password ||
        !registrationData.subscriptionPlan.id)
    ) {
      setError('Please fill in all required fields.');
      setLoading(false);
      router.push('/registration?error=true');
      return;
    }

    try {
      let orgImageUrl: string | null = null;
      if (registrationData.orgLogo instanceof File) {
        const uploaded = await uploadImageToCloudinary(
          registrationData.orgLogo,
        );
        orgImageUrl = uploaded.secure_url;
      }

      const result = await signUp(
        registrationData.email,
        registrationData.password,
        {
          role: 'root',
          orgName: registrationData.orgName.trim(),
          orgLink: registrationData.orgLink?.trim() || null,
          orgAddress: registrationData.orgAddress.trim(),
          orgImage: orgImageUrl || null,
          userName: registrationData.name.trim(),
          orgPlan: registrationData.subscriptionPlan,
        },
      );

      setUser(result.user);
      setSession(result.session);
    } catch (err: unknown) {
      if ((err as Error).message === 'Database error saving new user') {
        syncRegistrationData({ orgName: '' }); // clear org name to prevent duplicate error on retry
        setError(
          locale === 'ar'
            ? 'يوجد منظمة بهذا الاسم بالفعل. يرجى اختيار اسم مختلف.'
            : 'An Organization with this name already exists. Please choose a different name.',
        );
        router.push('/registration?error=true');
        return;
      } else if ((err as Error).message === 'User already registered') {
        setError(
          locale === 'ar'
            ? 'هذا البريد الإلكتروني مستخدم بالفعل. يرجى تسجيل الدخول أو استخدام بريد إلكتروني مختلف.'
            : 'This email is already in use. Please log in or use a different email.',
        );
        return;
      }
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    error,
    handleSignUp,
    registrationData,
    syncRegistrationData,
    localDataLoaded,
  };
};
