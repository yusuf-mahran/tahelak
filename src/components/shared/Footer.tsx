'use client';

import { siteConfig } from '@/config/site';
import { useLanguage } from '@/context/LanguageContext';
import { Facebook, Instagram, X, Youtube } from 'lucide-react';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/utils/LanguageSwitcher';
import { Section } from '../utils/Section';

const socialMedia = [
  {
    name: 'X',
    url: siteConfig.links.twitter,
    icon: X,
  },
  {
    name: 'Facebook',
    url: siteConfig.links.facebook,
    icon: Facebook,
  },
  {
    name: 'Instagram',
    url: siteConfig.links.instagram,
    icon: Instagram,
  },
  {
    name: 'Youtube',
    url: siteConfig.links.youtube,
    icon: Youtube,
  },
];

export const Footer = () => {
  const { localeData } = useLanguage();
  const footerData = localeData?.landingData.footer;

  const date = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="w-full border-t border-border bg-primary text-background py-8"
    >
      <Section className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex justify-start items-center gap-4 text-sm">
          <p>
            {footerData?.copyright} {date}
          </p>
          <LanguageSwitcher />
        </div>
        <div className="flex items-center gap-6">
          <p className="text-sm font-medium">{footerData?.socialText}</p>
          <div className="flex gap-4">
            {socialMedia.map(({ name, url, icon: Icon }, index) => (
              <Link
                key={index}
                href={url}
                title={name}
                className="w-8 h-8 flex items-center justify-center bg-background/10 hover:bg-background/20 rounded-md transition-colors duration-300"
                target="_self"
                rel="noopener noreferrer"
              >
                <Icon className="w-5 h-5 text-secondary hover:text-inherit transition-colors duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </footer>
  );
};
