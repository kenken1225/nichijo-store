"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ShopifyImage } from "@/lib/types/shopify";

type ProductGalleryProps = {
  images: ShopifyImage[];
  title: string;
};

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [gallery, setGallery] = useState<ShopifyImage[]>(images);
  const thumbsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setGallery(images);
  }, [images]);

  const [main, ...rest] = gallery;

  const selectImage = (index: number) => {
    if (index === 0) return;
    setGallery((prev) => {
      if (!prev[index]) return prev;
      const main = prev[0];
      const chosen = prev[index];
      const others = prev.filter((_, i) => i !== 0 && i !== index);
      return [chosen, ...others, main];
    });
  };

  const scrollThumbs = (direction: "left" | "right") => {
    const node = thumbsRef.current;
    if (!node) return;
    const delta = direction === "left" ? -120 : 120;
    node.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="space-y-4 w-full max-w-full overflow-hidden">
      <div className="relative aspect-[4/5] w-full max-w-full overflow-hidden rounded-lg bg-muted/40">
        {main ? (
          <Image
            src={main.url}
            alt={main.altText ?? title}
            fill
            sizes="(min-width: 1024px) 520px, 90vw"
            className="object-cover"
            priority
          />
        ) : null}
      </div>
      <div className="space-y-2 w-full max-w-full">
        <div
          ref={thumbsRef}
          className="flex w-full max-w-full gap-2 overflow-x-auto py-1"
          role="list"
          aria-label="Product gallery thumbnails"
        >
          {[main, ...rest].filter(Boolean).map((img, idx) => (
            <button
              type="button"
              key={`${img!.url}-${idx}`}
              onClick={() => selectImage(idx)}
              className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-transparent bg-muted/60 transition hover:border-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              aria-label={`Thumbnail ${idx + 1}`}
            >
              <Image src={img!.url} alt={img!.altText ?? title} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
