'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';

const SLIDES = [
  {
    title: 'Professional Creation Platform',
    description:
      'Expand AI video generation capabilities for professional creation scenarios, and support one-click conversion of text and static images to dynamic videos. Help designers and marketing teams quickly produce high-quality videos, improve the competitiveness of creation tools, and expand monetization scenarios.',
    videoSrc: '/videos/demo-1.mp4',
  },
  {
    title: 'Entertainment and Social Applications',
    description:
      'Provide an AI special effects generation engine to achieve creative gameplay such as old photo restoration, holiday theme special effects, and Dual-character Effects. Help entertainment apps and various social applications increase user interaction, improve user stickiness, and expand monetization paths.',
    videoSrc: '/videos/demo-2.mp4',
  },
  {
    title: 'E-commerce and Marketing Platform',
    description:
      'Product display videos are automatically generated from pictures, and virtual try-on functions bring an immersive shopping experience. Help e-commerce and marketing platforms improve conversion rates, reduce material costs, and boost product sales.',
    videoSrc: '/videos/demo-3.mp4',
  },
] as const;

export function ClientCases() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function goTo(index: number) {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false);
    }, 300);
  }

  function goToPrev() {
    goTo(activeIndex === 0 ? SLIDES.length - 1 : activeIndex - 1);
  }

  function goToNext() {
    goTo(activeIndex === SLIDES.length - 1 ? 0 : activeIndex + 1);
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [activeIndex]);

  const activeSlide = SLIDES[activeIndex];

  return (
    <section className="py-24">
      <h2 className="text-center text-[40px] leading-tight text-white">
        <span className="font-serif italic">Client</span>{' '}
        <span className="font-medium">Cases</span>
      </h2>

      <div className="relative mx-auto mt-16 max-w-[1280px] px-6">
        {/* Previous button — far left of the section */}
        <button
          onClick={goToPrev}
          className="absolute left-6 top-[200px] z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white/70 transition-colors hover:bg-white/10"
          aria-label="Previous slide"
        >
          <ChevronLeftIcon />
        </button>

        {/* Slide content — flex row: left text + right video */}
        <div
          className={cn(
            'mx-auto flex min-h-[400px] max-w-[1080px] flex-col gap-10 transition-opacity duration-300 lg:flex-row lg:items-start',
            isTransitioning ? 'opacity-0' : 'opacity-100',
          )}
        >
          {/* Left: text area */}
          <div className="flex flex-1 flex-col justify-center">
            <h3 className="text-[24px] font-[520] leading-tight text-white">
              {activeSlide.title}
            </h3>
            <p className="mt-5 text-[14px] leading-[22px] text-white/50">
              {activeSlide.description}
            </p>
          </div>

          {/* Right: video — fixed 300px wide, 400px tall */}
          <div className="w-full overflow-hidden rounded-lg bg-white/5 lg:h-[400px] lg:w-[300px] lg:flex-shrink-0">
            <video
              ref={videoRef}
              key={activeSlide.videoSrc}
              className="h-full w-full rounded-lg object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={activeSlide.videoSrc} type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Next button — far right of the section */}
        <button
          onClick={goToNext}
          className="absolute right-6 top-[200px] z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white/70 transition-colors hover:bg-white/10"
          aria-label="Next slide"
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="mt-10 flex justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === activeIndex
                ? 'w-6 bg-white'
                : 'w-1.5 bg-white/30 hover:bg-white/50',
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
