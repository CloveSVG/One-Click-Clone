'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

interface TabTag {
  readonly label: string;
}

interface TabMediaVideo {
  readonly type: 'video';
  readonly src: string;
  readonly promptText: string;
}

interface TabMediaImage {
  readonly type: 'image';
  readonly src: string;
  readonly promptText: string;
}

interface TabMediaDual {
  readonly type: 'dual';
  readonly left: string;
  readonly right: string;
}

type TabMedia = TabMediaVideo | TabMediaImage | TabMediaDual;

interface TabData {
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly tags: readonly TabTag[];
  readonly media: TabMedia;
}

const TABS: readonly TabData[] = [
  {
    label: 'Video Generation API',
    title: 'Video Generation',
    description:
      'Connect to the KLing Video LargeModel, seamlessly integrate text-to-video, image-to-video, lip sync, motion brush, AI effects, and other cutting-edge video generation capabilities.',
    tags: [
      { label: 'Text to Video' },
      { label: 'Image to Video' },
      { label: 'Video Extension' },
      { label: 'Lip-Sync' },
      { label: 'Video Effects' },
      { label: 'Multi-Image to Video' },
      { label: 'Audio Generation' },
      { label: 'Multi-Elements' },
    ],
    media: {
      type: 'video',
      src: 'https://v1-kling.kechuangai.com/kcdn/cdn-kcdn112452/kling-homepage-aio-prod_aio/assets/videos/model-video-1.6900686236fd8a15.mp4',
      promptText:
        'The camera passes through the coral cave from a first person perspective, at high speed',
    },
  },
  {
    label: 'Image Generation API',
    title: 'Image Generation',
    description:
      'Enable rapid invocation of the Image Large Model, supporting text-to-image, image-to-image, and character reference API integration. Experience premium image creation with one click',
    tags: [
      { label: 'Text to Image' },
      { label: 'Image to Image' },
      { label: 'Multi-Image to Image' },
      { label: 'Image Expansion' },
    ],
    media: {
      type: 'image',
      src: '/images/image-gen-preview.jpg',
      promptText:
        'The painting depicts an old-fashioned red Ford Mustang convertible driving in the desert, with blue sky and clouds overhead. Oil painting style with heavy brushstrokes.',
    },
  },
  {
    label: 'Virtual Try-On API',
    title: 'Virtual Try-On',
    description:
      'Ideal for virtual try-on scenes in e-commerce, marketing, and entertainment. Supports single-item try-ons (tops, bottoms, full-body outfits) and combination try-ons (top + bottom).',
    tags: [],
    media: {
      type: 'dual',
      left: '/images/tryon-1.png',
      right: '/images/tryon-2.png',
    },
  },
] as const;

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                             */
/* -------------------------------------------------------------------------- */

function TagPill({
  label,
  active,
  onClick,
}: {
  readonly label: string;
  readonly active: boolean;
  readonly onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-3 py-1 text-xs transition-colors cursor-pointer',
        active
          ? 'bg-white/30 text-white'
          : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white/70',
      )}
    >
      {label}
    </button>
  );
}

function MediaPanel({ media }: { readonly media: TabMedia }) {
  if (media.type === 'video') {
    return (
      <div className="relative flex-1 overflow-hidden rounded-lg border border-white/20 bg-black">
        <video
          className="h-full w-full object-cover"
          src={media.src}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-8">
          <p className="text-xs leading-relaxed text-white/70">
            {media.promptText}
          </p>
        </div>
      </div>
    );
  }

  if (media.type === 'image') {
    return (
      <div className="relative flex-1 overflow-hidden rounded-lg border border-white/20 bg-black">
        {/* Fallback: use a dark gradient background if image not yet available */}
        <div className="aspect-video w-full bg-gradient-to-br from-gray-900 to-black" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-8">
          <p className="text-xs leading-relaxed text-white/70">
            {media.promptText}
          </p>
        </div>
      </div>
    );
  }

  /* dual images for virtual try-on */
  return (
    <div className="flex flex-1 gap-4">
      <div className="relative flex-1 overflow-hidden rounded-lg border border-white/20 bg-black">
        <Image
          src={media.left}
          alt="Virtual try-on before"
          fill
          className="object-cover"
        />
      </div>
      <div className="relative flex-1 overflow-hidden rounded-lg border border-white/20 bg-black">
        <Image
          src={media.right}
          alt="Virtual try-on after"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                             */
/* -------------------------------------------------------------------------- */

export function ProductFeatures() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeTagByTab, setActiveTagByTab] = useState<Record<number, number>>({
    0: 0,
    1: 0,
    2: 0,
  });

  const currentTab = TABS[activeTab];

  function handleTagClick(tagIndex: number) {
    setActiveTagByTab((prev) => ({ ...prev, [activeTab]: tagIndex }));
  }

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-20">
      {/* Section heading */}
      <h2 className="text-center text-[40px] text-white">
        <span className="font-serif font-bold italic">
          Product
        </span>{' '}
        <span className="font-medium">Features</span>
      </h2>

      {/* Tab buttons */}
      <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-12">
        {TABS.map((tab, index) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActiveTab(index)}
            className={cn(
              'text-[24px] font-[520] transition-opacity duration-200 cursor-pointer',
              index === activeTab ? 'text-white opacity-100' : 'text-white opacity-50 hover:opacity-70',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div
        key={activeTab}
        className="mt-12 flex animate-fade-in flex-col gap-8 lg:flex-row"
      >
        {/* Left: text content */}
        <div className="flex max-w-full flex-col lg:max-w-[500px]">
          <h3 className="text-[20px] font-[520] text-white">
            {currentTab.title}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-white/50">
            {currentTab.description}
          </p>

          {currentTab.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {currentTab.tags.map((tag, tagIndex) => (
                <TagPill
                  key={tag.label}
                  label={tag.label}
                  active={tagIndex === (activeTagByTab[activeTab] ?? 0)}
                  onClick={() => handleTagClick(tagIndex)}
                />
              ))}
            </div>
          )}

          <a
            href="#"
            className="mt-6 inline-flex h-[30px] w-fit items-center rounded-[15px] border border-white/50 px-4 text-sm text-white transition-opacity hover:opacity-80"
          >
            Learn More <span className="ml-1">&rarr;</span>
          </a>
        </div>

        {/* Right: media panel */}
        <div className="flex min-h-[300px] flex-1">
          <MediaPanel media={currentTab.media} />
        </div>
      </div>
    </section>
  );
}
