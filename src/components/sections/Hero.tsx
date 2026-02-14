import { Image } from "@/components/shared/Image";

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/topview-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover object-center"
      >
        <source src="/topview-movie.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="animate-fade-in">
          <Image src="/top-view-text.png" alt="Nichijo Store" width={450} height={300} preload sizes="(max-width: 768px) 90vw, 450px" />
        </div>
      </div>
    </section>
  );
}
