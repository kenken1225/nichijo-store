"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import type { JudgeMeReview } from "@/lib/judgeme";

type Props = {
  reviews: JudgeMeReview[];
};

// render stars
function renderStars(count: number) {
  return (
    <div className="flex items-center gap-1 text-accent">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < count ? "fill-accent text-accent" : "text-muted-foreground"}`} />
      ))}
    </div>
  );
}

// get the first letter of the name
function getInitial(name: string) {
  return name.charAt(0).toUpperCase();
}

export function ReviewCarousel({ reviews }: Props) {
  const t = useTranslations("reviews");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      slidesToScroll: 1,
      direction: dir,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-2 text-sm text-foreground">
        {renderStars(Math.round(average))}
        <span className="font-medium">{average.toFixed(1)}</span>
        <span className="text-muted-foreground">({reviews.length} reviews)</span>
      </div>

      <div className="relative">
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="absolute -start-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-card p-2 shadow-sm transition-opacity hover:bg-secondary disabled:opacity-0"
          aria-label={t("prevReview")}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Slide area */}
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_calc(50%-8px)] lg:flex-[0_0_calc(33.333%-11px)]"
              >
                <div className="flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-foreground">
                      {getInitial(review.reviewer.name)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{review.reviewer.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    {review.verified === "buyer" && (
                      <span className="ms-auto rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        ei {t("verified")}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">{renderStars(review.rating)}</div>

                  {/* Title & Body */}
                  {review.title && <h3 className="text-sm font-medium text-foreground">{review.title}</h3>}
                  <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">{review.body}</p>

                  {/* Review images */}
                  {review.pictures.filter((pic) => !pic.hidden).length > 0 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {review.pictures
                        .filter((pic) => !pic.hidden)
                        .map((pic, idx) => (
                          <img
                            key={idx}
                            src={pic.urls.compact}
                            alt={`Review photo ${idx + 1}`}
                            className="h-16 w-16 rounded-md border border-border object-cover"
                          />
                        ))}
                    </div>
                  )}

                  {/* Product name */}
                  {review.product_title && (
                    <p className="mt-auto pt-2 text-xs text-muted-foreground/70 border-t border-border">
                      {review.product_title}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="absolute -end-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-card p-2 shadow-sm transition-opacity hover:bg-secondary disabled:opacity-0"
          aria-label={t("nextReview")}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
