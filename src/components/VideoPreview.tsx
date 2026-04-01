export function VideoPreview() {
  return (
    <section className="py-20 text-center">
      <div>
        <span className="text-[40px] font-[520] text-white">
          One-click integration
        </span>
        <br />
        <span className="text-[40px] font-[520] text-white">Accelerate </span>
        <span className="font-serif text-[40px] font-[520] italic text-white">
          innovation
        </span>
      </div>

      <p className="mx-auto mt-4 max-w-[600px] text-sm leading-relaxed text-white/50">
        Through our API service, you can easily integrate the world&apos;s
        leading video and image generation models, quickly build a video and
        image generation productivity engine, and boost enterprise application
        innovation
      </p>

      <div className="mx-auto mt-12 max-w-[900px] overflow-hidden rounded-xl bg-white/5 px-6">
        <video
          className="h-auto w-full rounded-xl"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/integration-preview.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
