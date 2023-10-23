import arData from '@/data/ar';
import enData from '@/data/en';

export const getDictionary = async (locale: 'en' | 'ar') => {
  return locale === 'en' || locale === 'ar'
    ? locale === 'ar'
      ? arData
      : enData
    : enData;
};
