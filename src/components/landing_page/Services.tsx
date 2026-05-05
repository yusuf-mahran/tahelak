'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { TypographyP } from '@/components/ui/typography';
import { Section } from '../utils/Section';
import { useToast } from '@/hooks/useToast';

export const Services = () => {
  const { localeData } = useLanguage();
  const { showToast } = useToast();

  if (!localeData) return null;

  const { appDownload } = localeData.landingData;

  return (
    <Section
      id="services"
      className="py-20 lg:pt-40 lg:pb-60 max-lg:text-center"
    >
      <div className="rounded-3xl border border-border bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="relative h-100 lg:h-150 w-full bg-white/10 flex items-center justify-center pt-8 z-10">
            <div className="relative w-full h-full">
              <Image
                src="/assets/mobile app.svg"
                alt={appDownload.mobileAppAlt}
                fill
                className="object-contain md:scale-105 lg:scale-140 translate-y-1/20 rotate-5"
              />
            </div>
          </div>

          <div className="p-8 lg:p-16 space-y-8 z-20">
            <TypographyP className="text-2xl lg:text-3xl font-medium leading-relaxed">
              {appDownload.title}
            </TypographyP>
            <Button href="/registration" variant="secondary" size="lg">
              {appDownload.cta}
            </Button>

            <div className="pt-8 border-t border-primary-foreground/20">
              <TypographyP className="text-xl font-semibold mb-4">
                {appDownload.downloadTitle}
              </TypographyP>
              <button
                type="button"
                onClick={() =>
                  showToast({
                    title: 'Download Tahelak App',
                    description: localeData.errorsData.featureNotImplemented,
                  })
                }
                title="download tahelak app"
                className="w-36 transition-transform hover:scale-105 active:scale-95"
              >
                <Image
                  src="/assets/get it on google play.svg"
                  alt={appDownload.googlePlayAlt}
                  width={200}
                  height={60}
                  className="h-auto w-auto"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
