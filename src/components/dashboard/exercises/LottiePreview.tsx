'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import CardContainer from '@/components/shared/CardContainer';
import { CardContent } from '@/components/ui/card';
import { useCallback, useRef } from 'react';
import type { DotLottie } from '@lottiefiles/dotlottie-react';

interface LottiePreviewProps {
  src: string;
  name: string;
  selected?: boolean;
  onSelect?: () => void;
}

export function LottiePreview({
  src,
  name,
  selected,
  onSelect,
}: LottiePreviewProps) {
  const dotLottieRef = useRef<DotLottie | null>(null);

  const refCallback = useCallback((instance: DotLottie | null) => {
    dotLottieRef.current = instance;
  }, []);

  return (
    <CardContainer
      className={`group/card overflow-hidden transition-all hover:shadow-lg bg-white cursor-pointer ${
        selected ? 'ring-2 ring-primary shadow-md shadow-primary/20' : 'ring-0'
      }`}
      onClick={onSelect}
    >
      <div
        className="relative bg-muted/20 cursor-pointer"
        onMouseEnter={() => dotLottieRef.current?.play()}
        onMouseLeave={() => dotLottieRef.current?.pause()}
      >
        {selected && (
          <div className="absolute top-2 right-2 z-10 h-5 w-5 rounded-full bg-primary flex items-center justify-center shadow">
            <svg
              viewBox="0 0 12 12"
              className="h-3 w-3 text-white fill-current"
            >
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
        <DotLottieReact
          src={src}
          autoplay={false}
          dotLottieRefCallback={refCallback}
          loop
          className="w-full aspect-square"
        />
      </div>

      <CardContent className="px-3 py-2.5">
        <p className="text-sm font-semibold text-foreground leading-snug line-clamp-1 text-center">
          {name}
        </p>
      </CardContent>
    </CardContainer>
  );
}
