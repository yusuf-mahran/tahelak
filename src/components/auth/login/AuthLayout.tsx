'use client';

import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: React.ReactNode;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="max-w-430 py-10 w-full h-full">
      <div className="relative w-full h-full grid lg:grid-cols-2 border border-border rounded-2xl overflow-hidden">
        {/* Left Side: Branding / Editorial */}
        <div className="hidden lg:flex relative flex-col justify-center p-6 lg:p-12 xl:p-20 z-10">
          <div className="absolute top-0 start-0 w-full h-full bg-primary/10" />
          <div className="space-y-8">
            <div className="w-16 h-1.5 bg-primary rounded-full mb-8" />
            <h2 className="text-5xl xl:text-6xl font-black tracking-tighter leading-[1.1] text-foreground">
              {title}
            </h2>
            <p className="text-lg xl:text-xl text-muted-foreground/80 font-medium leading-relaxed max-w-md">
              {subtitle}
            </p>

            <div className="pt-10 grid grid-cols-2 gap-8 border-t border-primary/10">
              <div>
                <p className="text-2xl xl:text-3xl font-bold">100%</p>
                <p className="text-sm text-muted-foreground">
                  Secure Data Access
                </p>
              </div>
              <div>
                <p className="text-2xl xl:text-3xl font-bold">24/7</p>
                <p className="text-sm text-muted-foreground">Premium Support</p>
              </div>
            </div>
          </div>

          {/* Abstract Pattern */}
          <div className="absolute bottom-40 start-0 opacity-10 rotate-12 scale-125 pointer-events-none">
            <div className="grid grid-cols-4 gap-3">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Centered Form */}
        <div className="w-full flex flex-col justify-center items-center z-20 h-full overflow-y-auto">
          <div className="absolute -bottom-[10%] end-[20%] w-75 h-75 bg-primary/5 rounded-full" />
          <div className="absolute -top-[20%] start-[80%] w-125 h-125 bg-primary/10 rounded-t-full rounded-b-full rounded-l-full rounded-r-full" />
          <div className="w-full h-full mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
