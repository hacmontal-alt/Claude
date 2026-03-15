import { NextRequest, NextResponse } from "next/server";
import type { AutoGenerateResult } from "@/types";

export async function POST(request: NextRequest) {
  const { brandUrl, market, language } = await request.json();

  // Extract a brand name from the URL for the mock response
  const brandName = brandUrl
    ? new URL(brandUrl.startsWith("http") ? brandUrl : `https://${brandUrl}`)
        .hostname.replace("www.", "")
        .split(".")[0]
        .replace(/^\w/, (c: string) => c.toUpperCase())
    : "YourBrand";

  const result: AutoGenerateResult = {
    brandName,
    industry: "Consumer Products",
    topics: [
      {
        name: "Product Recommendations",
        prompts: [
          {
            text: `What is the best ${brandName} product?`,
            tags: ["product", "recommendation"],
            estimatedVolume: 8200,
          },
          {
            text: `Top ${brandName} alternatives in 2025`,
            tags: ["alternatives", "comparison"],
            estimatedVolume: 5400,
          },
        ],
      },
      {
        name: "Brand Comparisons",
        prompts: [
          {
            text: `${brandName} vs competitors comparison`,
            tags: ["comparison", "vs"],
            estimatedVolume: 6100,
          },
          {
            text: `Is ${brandName} worth the price?`,
            tags: ["value", "pricing"],
            estimatedVolume: 4300,
          },
        ],
      },
      {
        name: "Buying Guides",
        prompts: [
          {
            text: `${brandName} buying guide for beginners`,
            tags: ["buying guide", "beginners"],
            estimatedVolume: 3900,
          },
          {
            text: `Best ${brandName} products under $100`,
            tags: ["budget", "buying guide"],
            estimatedVolume: 7200,
          },
        ],
      },
    ],
    competitors: ["Competitor A", "Competitor B", "Competitor C", "Competitor D"],
  };

  return NextResponse.json(result);
}
