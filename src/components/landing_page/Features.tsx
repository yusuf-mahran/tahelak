'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { TypographyH3, TypographyP } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Section } from '../utils/Section';

export const Features = () => {
  const { localeData } = useLanguage();

  if (!localeData) return null;

  const { features } = localeData.landingData;

  return (
    <Section
      applyPadding={false}
      className="w-full bg-linear-135 from-primary to-foreground"
    >
      <Section className="py-20 space-y-12 text-white px-6 max-w-430 mx-auto">
        <TypographyH3 className="text-3xl font-bold text-center border-none pb-0">
          {features.title}
        </TypographyH3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 gap-8 justify-center items-stretch text-center">
          {features.items.map(({ title, desc }, index) =>
            title ? (
              <Card
                key={index}
                className={`border border-border/20 shadow-md hover:shadow-xl transition-shadow bg-card/50 backdrop-blur-sm ${
                  index === 1 || index === 3
                    ? 'lg:col-span-3'
                    : index === 0 || index === 2 || index === 4
                    ? 'lg:col-span-1'
                    : 'lg:col-span-3'
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyP className="text-muted/60 leading-relaxed">
                    {desc}
                  </TypographyP>
                </CardContent>
              </Card>
            ) : (
              <div key={index} className="max-lg:hidden"></div>
            )
          )}
        </div>
      </Section>
    </Section>
  );
};
