"use client";

import { useMemo } from "react";
import { useBrand } from "@/lib/context/BrandContext";
import Callout from "@/components/ui/Callout";
import Metric from "@/components/ui/Metric";
import Tag from "@/components/ui/Tag";

const MODEL_DISPLAY: Record<string, string> = {
  chatgpt: "ChatGPT",
  gemini: "Gemini",
  perplexity: "Perplexity",
  grok: "Grok",
  ai_overviews: "AI Overviews",
};

export default function EarnedPage() {
  const { hasBrand, hasRealData, results, sources, prompts, activeBrand, triggerAnalysis } = useBrand();

  const earnedMentions = useMemo(() => {
    if (!hasRealData) return [];

    const promptMap = new Map<
      string,
      { promptText: string; models: { model: string; position: number | null; sentiment: string | null }[]; sources: string[] }
    >();

    for (const r of results) {
      if (!r.brand_mentioned) continue;
      const existing = promptMap.get(r.prompt_id) || {
        promptText: prompts.find((p) => p.id === r.prompt_id)?.prompt_text ?? r.prompt_id,
        models: [],
        sources: [],
      };
      existing.models.push({
        model: r.llm_model,
        position: r.brand_position,
        sentiment: r.sentiment,
      });
      promptMap.set(r.prompt_id, existing);
    }

    for (const s of sources) {
      if (s.is_brand_owned) {
        const existing = promptMap.get(s.prompt_id);
        if (existing && !existing.sources.includes(s.domain)) {
          existing.sources.push(s.domain);
        }
      }
    }

    return Array.from(promptMap.entries()).map(([promptId, data]) => ({
      promptId,
      ...data,
    }));
  }, [hasRealData, results, sources, prompts]);

  const totalMentions = earnedMentions.reduce(
    (a, e) => a + e.models.length,
    0
  );
  const positiveMentions = earnedMentions.reduce(
    (a, e) => a + e.models.filter((m) => m.sentiment === "positive").length,
    0
  );
  const avgPosition = useMemo(() => {
    const withPos = earnedMentions.flatMap((e) =>
      e.models.filter((m) => m.position !== null)
    );
    if (withPos.length === 0) return "N/A";
    const avg =
      withPos.reduce((a, m) => a + (m.position || 0), 0) / withPos.length;
    return String(Math.round(avg * 10) / 10);
  }, [earnedMentions]);

  if (!hasBrand) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-[#8A9BA3] text-sm mb-4">Add a brand to track earned mentions.</p>
        <a href="/onboarding/step-1" className="px-6 py-3 bg-[#EF4623] text-white rounded-lg text-sm font-semibold">
          Add your first brand
        </a>
      </div>
    );
  }

  if (!hasRealData) {
    return (
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-[#2D3B42]">Earned</h1>
          <p className="text-[13px] text-[#8A9BA3] mt-0.5">
            Track where AI models organically mention {activeBrand?.brand_name ?? "your brand"} in their responses.
          </p>
        </div>
        <div className="bg-white border border-[#E8EAEB] rounded-xl p-8 text-center">
          <p className="text-[#8A9BA3] text-sm mb-4">
            Run an analysis to discover where AI models mention your brand organically.
          </p>
          <button
            onClick={() => triggerAnalysis()}
            className="px-6 py-3 bg-[#EF4623] text-white rounded-lg text-sm font-semibold hover:bg-[#d93d1e] transition"
          >
            Run analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-[#2D3B42]">Earned</h1>
        <p className="text-[13px] text-[#8A9BA3] mt-0.5">
          Track where AI models organically mention{" "}
          {activeBrand?.brand_name ?? "your brand"} in their responses.
        </p>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <Metric label="Total Mentions" value={String(totalMentions)} />
        <Metric label="Positive" value={String(positiveMentions)} />
        <Metric label="Avg. Position" value={avgPosition} />
        <Metric
          label="Prompts with Mentions"
          value={String(earnedMentions.length)}
        />
      </div>

      <div className="space-y-3">
        {earnedMentions.map((mention) => (
          <div
            key={mention.promptId}
            className="bg-white border border-[#E8EAEB] rounded-lg p-4"
          >
            <div className="text-[13px] font-medium text-[#2D3B42] mb-2">
              {mention.promptText}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {mention.models.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 bg-[#F8F9FA] rounded px-2 py-1"
                >
                  <span className="text-[11px] font-medium text-[#4A5D66]">
                    {MODEL_DISPLAY[m.model] ?? m.model}
                  </span>
                  {m.position !== null && (
                    <span className="text-[10px] text-[#8A9BA3]">
                      #{m.position}
                    </span>
                  )}
                  {m.sentiment && (
                    <Tag
                      label={m.sentiment}
                      color={
                        m.sentiment === "positive"
                          ? "green"
                          : m.sentiment === "negative"
                            ? "red"
                            : "gray"
                      }
                      small
                    />
                  )}
                </div>
              ))}
            </div>
            {mention.sources.length > 0 && (
              <div className="text-[11px] text-[#8A9BA3]">
                Brand sources cited: {mention.sources.join(", ")}
              </div>
            )}
          </div>
        ))}

        {earnedMentions.length === 0 && (
          <div className="text-center py-12 text-[#8A9BA3] text-sm">
            No earned mentions found in the latest analysis.
          </div>
        )}
      </div>
    </div>
  );
}
