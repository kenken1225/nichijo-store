export function VideoSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster="/topview-poster-2.jpg"
        className="w-full object-contain sm:h-screen sm:object-cover sm:object-center"
      >
        <source src="/topview-movie-2.mp4" type="video/mp4" />
      </video>
    </section>
  );
}
