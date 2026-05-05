'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  TypographyH1,
  TypographyP,
  TypographyLead,
} from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Section } from '../utils/Section';
import { useToast } from '@/hooks/useToast';

export const Hero = () => {
  const { localeData, locale } = useLanguage();
  const { showToast } = useToast();

  if (!localeData) return null;

  const { hero } = localeData.landingData;

  return (
    <header className="mx-auto py-12 lg:py-24 relative">
      <Section
        applyPadding={false}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-20 mb-40 overflow-x-hidden overflow-y-hidden max-w-430"
      >
        <div className="space-y-8 text-center lg:text-start lg:ps-20 lg:pe-0 md:px-20 px-6">
          <div className="space-y-4">
            <TypographyH1 className="text-4xl lg:text-6xl font-bold leading-tight">
              {hero.title.split(' ').map((word, i) =>
                word === 'الذكي' || word === 'Smart' ? (
                  <span key={i} className="text-primary">
                    {word}{' '}
                  </span>
                ) : (
                  word + ' '
                ),
              )}
            </TypographyH1>
            <TypographyLead className="text-xl text-muted-foreground">
              {hero.subtitle}
            </TypographyLead>
          </div>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Button
              onClick={() =>
                showToast({
                  title: hero.cta1,
                  description: localeData.errorsData.featureNotImplemented,
                })
              }
              size="lg"
              className="px-8"
            >
              {hero.cta1}
            </Button>
            <Button
              href="/dashboard"
              variant="outline"
              size="lg"
              className="px-8"
            >
              {hero.cta2}
            </Button>
          </div>
        </div>
        <div className="hidden sm:flex justify-center items-center relative aspect-video w-full max-w-2xl mx-auto">
          <Image
            src="/assets/graphic-running-hero-man.png"
            alt="an athlete motion man"
            width={400}
            height={400}
            className="w-full h-full object-contain scale-125"
            style={{
              // mirror image for english locale
              transformOrigin: 'center',
              transform: `scaleX(${locale === 'en' ? -1 : 1}) translateX(-10%)`,
            }}
            priority
          />
        </div>
      </Section>

      <Section>
        <Section
          applyPadding={false}
          className="grid grid-cols-1 lg:grid-cols-3 border border-border p-6 rounded-lg shadow-lg max-lg:max-w-200 bg-background"
        >
          {hero.cards.map(({ imgUrl, heading, desc }, index) => (
            <Card
              key={index}
              className="flex flex-col items-center text-center p-6 bg-transparent shadow-none rounded-none lg:border-e lg:border-e-border lg:border-y-0 lg:border-s-0 lg:last:border-e-0 border-b border-b-border border-x-0 border-t-0 last:border-b-0"
            >
              <CardHeader className="p-0 mb-4">
                <div className="w-20 h-20 mb-4 relative mx-auto bg-primary/10 rounded-full flex items-center justify-center p-4">
                  <Image
                    src={imgUrl}
                    alt={heading}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <CardTitle className="text-xl font-bold">{heading}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <TypographyP className="text-muted-foreground leading-relaxed">
                  {desc}
                </TypographyP>
              </CardContent>
            </Card>
          ))}
        </Section>
      </Section>
    </header>
  );
};
