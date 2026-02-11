const JUDGE_ME_SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN ?? "";
const JUDGE_ME_API_TOKEN = process.env.JUDGE_ME_API_KEY_PRIVATE ?? "";

export type JudgeMeReview = {
  id: number;
  title: string;
  body: string;
  rating: number;
  reviewer: {
    id: number;
    name: string;
  };
  product_title: string;
  created_at: string;
  verified: string;
  hidden: boolean;
  curated: string;
  pictures: {
    hidden: boolean;
    urls: {
      small: string;
      compact: string;
      huge: string;
      original: string;
    };
  }[];
};

type JudgeMeResponse = {
  current_page: number;
  per_page: number;
  reviews: JudgeMeReview[];
};

export async function fetchJudgeMeReviews(perPage = 10, page = 1): Promise<JudgeMeReview[]> {
  if (!JUDGE_ME_SHOP_DOMAIN || !JUDGE_ME_API_TOKEN) {
    console.warn("JUDGE_ME_SHOP_DOMAIN or JUDGE_ME_API_TOKEN is not set");
    return [];
  }

  const url = new URL("https://judge.me/api/v1/reviews");
  url.searchParams.set("api_token", JUDGE_ME_API_TOKEN);
  url.searchParams.set("shop_domain", JUDGE_ME_SHOP_DOMAIN);
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("page", String(page));

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`Judge.me API error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data: JudgeMeResponse = await res.json();

    return data.reviews.filter((r) => r.curated === "ok" && !r.hidden);
  } catch (error) {
    console.error("Judge.me API fetch failed:", error);
    return [];
  }
}
