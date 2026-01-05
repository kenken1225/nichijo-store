import type { ComponentType } from "react";

import { Container } from "@/components/layout/Container";
import { Box, Heart, Leaf, RotateCcw, Sparkles, Truck } from "lucide-react";

type Point = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

const points: Point[] = [
  {
    title: "Designs drawn from quiet, real moments of life in Japan — not trends.",
    description: "",
    icon: Sparkles,
  },
  {
    title: "We deliver Japanese culture to fans around the world.",
    description: "",
    icon: Heart,
  },
  {
    title: "Every product begins with cultural context, not just visual appeal.",
    description: "",
    icon: Leaf,
  },
  {
    title: "Simple and transparent return policies for peace of mind.",
    description: "",
    icon: Truck,
  },
  {
    title: "Each piece carries a story, not just a function or logo.",
    description: "",
    icon: Box,
  },
  {
    title: "Only items that align with our values and vision make it here.",
    description: "",
    icon: RotateCcw,
  },
];

export function WhyLoveIt() {
  return (
    <section className="bg-[#fbf7f3] py-14">
      <Container className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-semibold text-neutral-900">Why You'll Love It</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {points.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center gap-4 rounded-lg bg-white p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7e8dc] text-[#d79c7a]">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-base text-neutral-700 leading-relaxed">{item.title}</p>
                  {item.description && <p className="text-sm text-neutral-500">{item.description}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
