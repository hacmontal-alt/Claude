import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { AutoGenerateResult } from "@/types";

const SYSTEM_PROMPT = `You are an expert AI search strategist who deeply understands how real people use ChatGPT, Perplexity, Gemini, and other AI chatbots to research products, services, and brands before making decisions.

Your job: Given a brand's website content, figure out EXACTLY what the brand does, who their customers are, what problems they solve, and what ecosystem they operate in. Then generate the precise questions that real people would type into an AI chatbot when they're looking for solutions in that space.

## How to think about this:

1. **Understand the brand deeply** — What do they sell? Who buys it? What pain points do they solve? What category are they in? Who are their competitors?

2. **Think like the customer** — A person doesn't ask an AI "tell me about BrandX." They ask things like:
   - "What's the best tool for [problem the brand solves]?"
   - "I need help with [specific use case] — what should I use?"
   - "Is [brand] better than [competitor] for [specific need]?"
   - "What do people think about [brand] for [use case]?"
   - "Can you recommend a [product category] that does [specific feature]?"

3. **Cover the full customer journey**:
   - **Discovery**: Person doesn't know the brand exists yet, asking about the problem space ("What's the best way to...")
   - **Research**: Person is comparing options ("What are the top X tools for...")
   - **Evaluation**: Person is deciding ("Is X worth it?", "X vs Y for...")
   - **Validation**: Person wants social proof ("What do people think about X?", "X reviews")
   - **How-to**: Person is already using or considering ("How do I use X to...", "Can X do...")

4. **Generate topics that map to the brand's ecosystem**, NOT generic marketing categories. For example:
   - If the brand is a CRM → topics should be about sales workflows, lead management, customer retention, etc.
   - If the brand is a sneaker company → topics should be about running shoes, comfort, specific sports, fashion, etc.
   - If the brand is a SaaS tool → topics should be about the specific problems it solves, integrations, workflows, etc.

## Rules:
- Every single prompt MUST be something a real person would actually type into ChatGPT or Perplexity
- Prompts should be natural and conversational — not keyword-stuffed SEO phrases
- Mix of branded prompts (mention the brand name) and non-branded prompts (about the category/problem)
- Non-branded prompts should be ~60-70% of total — these are where brands win or lose in AI search
- Include the brand name naturally in branded prompts, exactly as it appears on their website
- Estimated volumes should reflect realistic monthly AI search interest (100-50,000 range)
- Generate EXACTLY 5 topics with 5-7 prompts each
- Topics should be named after real customer concerns, not marketing jargon
- Identify 3-6 real competitors based on the brand's actual market
- Generate prompts in the specified language

Return JSON:
{
  "brandName": "string (exact brand name from website)",
  "industry": "string (specific industry, not generic)",
  "topics": [
    {
      "name": "string (customer-centric topic name)",
      "prompts": [
        {
          "text": "string (natural question a person would ask an AI)",
          "tags": ["branded|non-branded", "discovery|research|evaluation|validation|how-to"],
          "estimatedVolume": number
        }
      ]
    }
  ],
  "competitors": ["string (real competitor names)"]
}`;

export async function POST(request: NextRequest) {
  const { brandUrl, market, language } = await request.json();

  if (!brandUrl) {
    return NextResponse.json({ error: "brandUrl is required" }, { status: 400 });
  }

  // 1. Fetch and extract website content — get as much useful text as possible
  let siteContent = "";
  const normalizedUrl = brandUrl.startsWith("http") ? brandUrl : `https://${brandUrl}`;

  try {
    const res = await fetch(normalizedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(15000),
    });
    const html = await res.text();

    // Extract meaningful content: title, meta description, headings, body text
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    const title = titleMatch?.[1]?.trim() || "";
    const metaDesc = metaDescMatch?.[1]?.trim() || "";

    // Strip scripts, styles, and tags
    const bodyText = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    siteContent = `Page title: ${title}\nMeta description: ${metaDesc}\n\nPage content:\n${bodyText.slice(0, 6000)}`;
  } catch {
    siteContent = `Brand website URL: ${brandUrl} (could not fetch — generate based on the domain name and URL structure)`;
  }

  // 2. Call OpenAI
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Analyze this brand and generate smart tracking prompts.\n\nBrand URL: ${brandUrl}\nTarget market: ${market || "us"}\nLanguage: ${language || "en"}\n\n--- WEBSITE CONTENT ---\n${siteContent}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const result = JSON.parse(content) as AutoGenerateResult;

    return NextResponse.json(result);
  } catch (err) {
    console.error("OpenAI generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate prompts. Please try again." },
      { status: 500 }
    );
  }
}
