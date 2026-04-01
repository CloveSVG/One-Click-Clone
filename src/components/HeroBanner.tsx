'use client';

import { cn } from '@/lib/utils';

const VIDEO_SRC =
  'https://v15-kling.klingai.com/kos/s101/nlav112918/kling-website/dev-home/dev-home-banner.dfd88cddbc63a346.mp4';

interface HeroButtonProps {
  readonly children: React.ReactNode;
  readonly variant?: 'filled' | 'outline';
  readonly className?: string;
}

function HeroButton({ children, variant = 'outline', className }: HeroButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'h-[30px] rounded-[15px] px-4 text-[13.3px] font-normal leading-[30px] cursor-pointer transition-opacity hover:opacity-80',
        variant === 'filled'
          ? 'bg-white text-black'
          : 'border border-white/50 bg-transparent text-white',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function HeroBanner() {
  return (
    <section className="relative flex h-[680px] w-full items-center justify-center overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Gradient overlay — transparent at top, black at bottom */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-black" />

      {/* Centered content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4">
        <h1 className="text-[36px] font-medium text-white sm:text-[48px] lg:text-[64px]">
          API Platform
        </h1>

        <p className="mt-4 max-w-[600px] text-[14px] font-normal leading-relaxed text-white">
          Access the world&apos;s most popular video and image generation models through secure,
          easy-to-use, and reliable API online service
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <HeroButton variant="filled">
            Go to Console <span aria-hidden="true">&rarr;</span>
          </HeroButton>
          <HeroButton>Documentation</HeroButton>
          <HeroButton>Pricing</HeroButton>
          <HeroButton>Contact Us</HeroButton>
        </div>
      </div>
    </section>
  );
}
