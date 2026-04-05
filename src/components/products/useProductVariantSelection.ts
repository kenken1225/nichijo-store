"use client";

import { useEffect, useMemo, useState } from "react";
import type { ShopifyVariant } from "@/lib/types/shopify";

function pickDefaultVariant(variants: ShopifyVariant[]): ShopifyVariant | null {
  return variants.find((v) => v.availableForSale !== false) ?? variants[0] ?? null;
}

function selectionsFromVariant(variant: ShopifyVariant | null): Record<string, string> {
  const map: Record<string, string> = {};
  variant?.selectedOptions?.forEach((o) => {
    map[o.name] = o.value;
  });
  return map;
}

function variantMatches(variant: ShopifyVariant, nextSelections: Record<string, string>): boolean {
  const opts = variant.selectedOptions ?? [];
  return opts.every((o) => {
    const chosen = nextSelections[o.name];
    return !chosen || chosen === o.value;
  });
}

type UseProductVariantSelectionArgs = {
  variants: ShopifyVariant[];
  onVariantImageChange?: (imageUrl: string | null) => void;
};

export function useProductVariantSelection({
  variants,
  onVariantImageChange,
}: UseProductVariantSelectionArgs) {
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(() =>
    pickDefaultVariant(variants)
  );
  const [selections, setSelections] = useState<Record<string, string>>(() =>
    selectionsFromVariant(pickDefaultVariant(variants))
  );

  const [prevVariants, setPrevVariants] = useState(variants);
  if (variants !== prevVariants) {
    setPrevVariants(variants);
    const nextVariant = pickDefaultVariant(variants);
    setSelectedVariant(nextVariant);
    setSelections(selectionsFromVariant(nextVariant));
  }

  const optionValues = useMemo(() => {
    const map = new Map<string, Set<string>>();
    variants.forEach((v) => {
      v.selectedOptions?.forEach((o) => {
        if (!map.has(o.name)) map.set(o.name, new Set());
        map.get(o.name)!.add(o.value);
      });
    });
    return map;
  }, [variants]);

  useEffect(() => {
    onVariantImageChange?.(selectedVariant?.image?.url ?? null);
  }, [selectedVariant, onVariantImageChange]);

  const hasAvailableVariantFor = (nextSelections: Record<string, string>) => {
    return variants.some((v) => v.availableForSale !== false && variantMatches(v, nextSelections));
  };

  const handleSelectOption = (name: string, value: string) => {
    const next = { ...selections, [name]: value };
    const match = variants.find((v) => v.availableForSale !== false && variantMatches(v, next));
    const pick = match ?? selectedVariant ?? variants[0] ?? null;
    setSelectedVariant(pick);
    setSelections(selectionsFromVariant(pick));
  };

  const isOptionUnavailable = (name: string, value: string) => {
    const next = { ...selections, [name]: value };
    return !hasAvailableVariantFor(next);
  };

  return {
    selectedVariant,
    selections,
    optionValues,
    handleSelectOption,
    isOptionUnavailable,
  };
}
