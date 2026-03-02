import type { ComponentType } from "react";

import { Container } from "@/components/layout/Container";
import { Box, Heart, Leaf, RotateCcw, Sparkles, Truck } from "lucide-react";
import { getTranslations } from "next-intl/server";

type Point = {
  icon: ComponentType<{ className?: string }>;
  key: string;
};

const points: Point[] = [
  { key: "whyLoveIt1", icon: Sparkles },
  { key: "whyLoveIt2", icon: Heart },
  { key: "whyLoveIt3", icon: Leaf },
  { key: "whyLoveIt4", icon: Truck },
  { key: "whyLoveIt5", icon: Box },
  { key: "whyLoveIt6", icon: RotateCcw },
];

export async function WhyLoveIt() {
  const t = await getTranslations("product");

  return (
    <section className="bg-[#fbf7f3] py-14">
      <Container className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-semibold text-neutral-900 whitespace-pre-line">{t("whyLoveItTitle")}</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {points.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex items-center gap-4 rounded-lg bg-white p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7e8dc] text-[#d79c7a]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-base text-neutral-700 leading-relaxed">{t(item.key)}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
