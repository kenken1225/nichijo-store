import { Container } from "@/components/layout/Container";
import { Package, CreditCard, Heart } from "lucide-react";

const trustItems = [
  {
    icon: Package,
    title: "Global Shipping",
    description: "Fast delivery to 150+ countries with tracking",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description: "Multiple currencies and payment methods accepted",
  },
  {
    icon: Heart,
    title: "Easy Returns",
    description: "Hassle-free return policy worldwide",
  },
];

export function Trust() {
  return (
    <section className="py-16 sm:py-20 bg-[var(--secondary)]">
      <Container>
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Shop With Confidence</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {trustItems.map((item) => (
            <div key={item.title} className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-stone-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
