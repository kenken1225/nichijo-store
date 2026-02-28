"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ShopifyImage, ShopifyVariant } from "@/lib/types/shopify";

type VariantImageInfo = {
  label: string;
  imageUrl: string;
  imageIndex: number;
};

type ProductGalleryProps = {
  images: ShopifyImage[];
  title: string;
  variants?: ShopifyVariant[];
  selectedVariantImageUrl?: string | null;
};

function buildVariantImages(images: ShopifyImage[], variants: ShopifyVariant[]): VariantImageInfo[] {
  const seen = new Set<string>();
  const result: VariantImageInfo[] = [];

  for (const variant of variants) {
    if (!variant.image?.url) continue;
    const colorOption = variant.selectedOptions?.find(
      (o) =>
        o.name.toLowerCase() === "color" || o.name.toLowerCase() === "colour" || o.name === "カラー" || o.name === "色"
    );
    const label = colorOption?.value ?? variant.title;
    if (seen.has(variant.image.url)) continue;
    seen.add(variant.image.url);

    const idx = images.findIndex((img) => img.url === variant.image!.url);
    if (idx >= 0) {
      result.push({ label, imageUrl: variant.image.url, imageIndex: idx });
    }
  }
  return result;
}

export function ProductGallery({ images, title, variants = [], selectedVariantImageUrl }: ProductGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const isDefaultOnly = variants.length <= 1 && variants[0]?.title;
  const variantImages = isDefaultOnly ? [] : buildVariantImages(images, variants);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || !selectedVariantImageUrl) return;
    const idx = images.findIndex((img) => img.url === selectedVariantImageUrl);
    if (idx >= 0 && idx !== emblaApi.selectedScrollSnap()) {
      emblaApi.scrollTo(idx);
    }
  }, [emblaApi, selectedVariantImageUrl, images]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="space-y-3 w-full max-w-full overflow-hidden">
      {/* Main carousel */}
      <div className="relative w-full">
        <div className="overflow-hidden rounded-lg" ref={emblaRef}>
          <div className="flex">
            {images.map((img, idx) => (
              <div key={`${img.url}-${idx}`} className="relative aspect-[4/5] w-full flex-[0_0_100%] min-w-0">
                <Image
                  src={img.url}
                  alt={img.altText ?? title}
                  fill
                  sizes="(min-width: 1024px) 520px, 90vw"
                  className="object-cover"
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Arrow buttons */}
        {canScrollPrev && (
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 shadow-md backdrop-blur-sm transition hover:bg-background"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
        )}
        {canScrollNext && (
          <button
            type="button"
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 shadow-md backdrop-blur-sm transition hover:bg-background"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        )}
      </div>

      {/* Variant image row */}
      {variantImages.length > 0 && (
        <div className="w-full max-w-full">
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(7, minmax(0, 1fr))` }}>
            {variantImages.map((vi) => (
              <button
                key={vi.imageUrl}
                type="button"
                onClick={() => scrollTo(vi.imageIndex)}
                className="group flex flex-col items-center gap-1"
              >
                <div
                  className={`relative aspect-square w-full overflow-hidden rounded-md border-2 transition ${
                    selectedIndex === vi.imageIndex ? "border-foreground" : "border-transparent hover:border-border"
                  }`}
                >
                  <Image src={vi.imageUrl} alt={vi.label} fill sizes="80px" className="object-cover" />
                </div>
                <span className="text-[10px] leading-tight text-muted-foreground text-center line-clamp-2">
                  {vi.label}
                </span>
                あああ
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All thumbnails grid */}
      <div className="w-full max-w-full">
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(7, minmax(0, 1fr))` }}>
          {images.map((img, idx) => (
            <button
              key={`thumb-${img.url}-${idx}`}
              type="button"
              onClick={() => scrollTo(idx)}
              className={`relative aspect-square w-full overflow-hidden rounded-md border-2 transition ${
                selectedIndex === idx ? "border-foreground" : "border-transparent hover:border-border"
              }`}
              aria-label={`Thumbnail ${idx + 1}`}
            >
              <Image src={img.url} alt={img.altText ?? title} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
