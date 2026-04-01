import Image from 'next/image';
import { cn } from '@/lib/utils';

const MODEL_CARDS = [
  {
    title: 'Video Generation',
    poweredBy: 'Kling',
    modelName: 'Model',
    media: 'video' as const,
    videoSrc:
      'https://v1-kling.kechuangai.com/kcdn/cdn-kcdn112452/kling-website/dev-home/model-video-bg.cb39536e7c0db6b4.mp4',
    features: [
      'Text to Video',
      'Image to Video',
      'Video Extension',
      'Lip Sync',
      'Video Effects',
      'Elements Reference',
    ],
  },
  {
    title: 'Image Generation',
    poweredBy: 'Kolors',
    modelName: 'Model',
    media: 'image' as const,
    imageSrc: '/images/model-image-bg.png',
    features: ['Text to Image', 'Image to Image'],
  },
  {
    title: 'Intelligent Scenarios',
    poweredBy: null,
    verticalLabel: 'Vertical-Specific Model',
    media: 'image' as const,
    imageSrc: '/images/model-other-bg.png',
    features: ['Virtual Try-on'],
  },
] as const;

function ModelCard({
  card,
}: {
  card: (typeof MODEL_CARDS)[number];
}) {
  return (
    <div
      className={cn(
        'model-card relative w-full md:w-[400px] h-[563px]',
        'bg-card-bg border border-card-border rounded-lg overflow-hidden',
        'cursor-pointer group',
      )}
    >
      {/* Media area */}
      <div className="relative h-[380px] overflow-hidden">
        {card.media === 'video' ? (
          <video
            className="h-full w-full object-cover"
            src={card.videoSrc}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <Image
            className="h-full w-full object-cover"
            src={card.imageSrc}
            alt={card.title}
            width={400}
            height={380}
          />
        )}

        {/* Feature tags overlay (visible on hover) */}
        <div
          className={cn(
            'model-features absolute inset-0',
            'flex flex-wrap content-end gap-2 p-4',
            'bg-gradient-to-t from-black/60 to-transparent',
          )}
        >
          {card.features.map((feature) => (
            <span
              key={feature}
              className="rounded-full bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-sm"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Info area */}
      <div className="p-5">
        <div className="text-[20px] font-[520] text-white">{card.title}</div>
        <div className="mt-1 text-sm text-white/50">
          {card.poweredBy ? (
            <>
              Powered By {card.poweredBy} {card.modelName}
              <sup>&reg;</sup>
            </>
          ) : (
            card.verticalLabel
          )}
        </div>
        <button
          className={cn(
            'mt-3 h-[30px] rounded-[15px] border border-white/50',
            'px-4 text-sm text-white',
            'transition-colors duration-200 hover:bg-white/10',
          )}
        >
          Purchase &rarr;
        </button>
      </div>
    </div>
  );
}

export function FlagshipModels() {
  return (
    <section className="py-20 text-center">
      <h2 className="text-[40px] leading-tight text-white">
        <span className="font-semibold italic font-serif">Flagship</span>{' '}
        <span className="font-medium">Model</span>
      </h2>

      <p className="mt-3 text-sm text-white/50">
        The Kling 3.0 series models API is now fully available
      </p>

      <div
        className={cn(
          'mx-auto mt-12 flex max-w-[1280px] flex-col items-center gap-6 px-6',
          'md:flex-row md:justify-center',
        )}
      >
        {MODEL_CARDS.map((card) => (
          <ModelCard key={card.title} card={card} />
        ))}
      </div>
    </section>
  );
}
