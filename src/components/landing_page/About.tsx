'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { TypographyH3, TypographyP } from '@/components/ui/typography';
import { Section } from '../utils/Section';

export const About = () => {
  const { localeData } = useLanguage();

  if (!localeData) return null;

  const { about } = localeData.landingData;

  return (
    <Section id="about" className="py-20 space-y-16">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="relative w-full md:max-w-md aspect-square lg:w-1/3">
          <Image
            src="/tahelak.svg"
            alt="tahelak about logo"
            fill
            className="object-contain"
          />
        </div>
        <div className="flex-1 space-y-4 max-lg:text-center lg:text-start">
          <TypographyH3 className="text-3xl font-bold text-primary border-none pb-0">
            {about.whoAreWeTitle}
          </TypographyH3>
          <TypographyP className="text-justify text-lg text-muted-foreground leading-relaxed">
            {about.aboutText}
          </TypographyP>
        </div>
      </div>

      <div className="bg-primary/5 rounded-3xl p-8 lg:p-12 max-lg:text-center space-y-6">
        <TypographyH3 className="text-3xl font-bold text-primary border-none pb-0">
          {about.missionTitle}
        </TypographyH3>
        <TypographyP className="text-justify text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          {about.missionText}
        </TypographyP>
      </div>
    </Section>
  );
};
