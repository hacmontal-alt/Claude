import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { AutoGenerateResult } from "@/types";

const SYSTEM_PROMPT = `You are an AI search strategist. Given a brand's website content, generate tracking prompts that real customers would ask AI chatbots about this brand's category.

Return JSON with this structure:
{
  "brandName": "string",
  "industry": "string",
  "topics": [
    {
      "name": "string",
      "prompts": [
        {
          "text": "string",
          "tags": ["non-branded", "awareness"],
          "estimatedVolume": number
        }
      ]
    }
  ],
  "competitors": ["string"]
}

Rules:
- Generate prompts in the specified language, not English (unless language is English)
- Mix branded and non-branded prompts
- Include prompts at each journey stage: awareness, consideration, decision, post-purchase
- Make prompts conversational — how a real person would ask an AI chatbot
- Estimated volumes should be realistic (10-500,000 range)
- Generate exactly 4-6 topics with 4-8 prompts each`;

export async function POST(request: NextRequest) {
  const { brandUrl, market, language } = await request.json();

  if (!brandUrl) {
    return NextResponse.json({ error: "brandUrl is required" }, { status: 400 });
  }

  // 1. Fetch and extract website content
  let siteContent = "";
  try {
    const url = brandUrl.startsWith("http") ? brandUrl : `https://${brandUrl}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; TraceBot/1.0)" },
      signal: AbortSignal.timeout(10000),
    });
    const html = await res.text();
    siteContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 5000);
  } catch {
    siteContent = `Brand website: ${brandUrl}`;
  }

  // 2. Call OpenAI to analyze content and generate topics/prompts
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
          content: `Brand URL: ${brandUrl}\nLanguage: ${language || "en"}\nMarket: ${market || "us"}\n\nWebsite content:\n${siteContent}`,
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
