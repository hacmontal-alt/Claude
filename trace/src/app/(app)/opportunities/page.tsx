"use client";

import { useMemo } from "react";
import { useBrand } from "@/lib/context/BrandContext";
import Metric from "@/components/ui/Metric";
import Tag from "@/components/ui/Tag";

const MODEL_DISPLAY: Record<string, string> = {
  chatgpt: "ChatGPT",
  gemini: "Gemini",
  perplexity: "Perplexity",
  grok: "Grok",
  ai_overviews: "AI Overviews",
};

const SEVERITY_COLOR: Record<string, string> = {
  high: "red",
  medium: "orange",
  low: "gray",
};

const TYPE_LABEL: Record<string, string> = {
  missing_presence: "Missing",
  low_position: "Low Position",
  negative_sentiment: "Sentiment",
  citation_gap: "Citation Gap",
  competitor_threat: "Competitor",
};

export default function OpportunitiesPage() {
  const { hasBrand, hasRealData, results, prompts, sources, activeBrand, triggerAnalysis } = useBrand();

  const opportunities = useMemo(() => {
    if (!hasRealData) return [];

    const opps: {
      id: string;
      type: string;
      severity: string;
      title: string;
      description: string;
      promptText: string | null;
      affectedModels: string[];
      estimatedImpact: number | null;
    }[] = [];

    const promptGroups = new Map<
      string,
      { mentioned: string[]; notMentioned: string[]; volume: number; text: string }
    >();

    for (const r of results) {
      const prompt = prompts.find((p) => p.id === r.prompt_id);
      if (!prompt) continue;
      const existing = promptGroups.get(r.prompt_id) || {
        mentioned: [],
        notMentioned: [],
        volume: prompt.estimated_volume,
        text: prompt.prompt_text,
      };
      if (r.brand_mentioned) {
        existing.mentioned.push(r.llm_model);
      } else {
        existing.notMentioned.push(r.llm_model);
      }
      promptGroups.set(r.prompt_id, existing);
    }

    let idx = 0;
    for (const [promptId, group] of promptGroups) {
      if (group.notMentioned.length >= 3) {
        idx++;
        opps.push({
          id: `opp-${idx}`,
          type: "missing_presence",
          severity: group.volume > 30000 ? "high" : "medium",
          title: `Not mentioned in "${group.text.slice(0, 60)}${group.text.length > 60 ? "..." : ""}"`,
          description: `Your brand is absent from ${group.notMentioned.length} out of ${group.mentioned.length + group.notMentioned.length} AI models for this ${group.volume > 0 ? `${(group.volume / 1000).toFixed(0)}K monthly volume` : ""} query.`,
          promptText: group.text,
          affectedModels: group.notMentioned,
          estimatedImpact: group.volume,
        });
      }

      const lowPosResults = results.filter(
        (r) =>
          r.prompt_id === promptId &&
          r.brand_mentioned &&
          r.brand_position !== null &&
          r.brand_position >= 4
      );
      if (lowPosResults.length >= 2) {
        idx++;
        opps.push({
          id: `opp-${idx}`,
          type: "low_position",
          severity: "medium",
          title: `Ranked low for "${group.text.slice(0, 60)}${group.text.length > 60 ? "..." : ""}"`,
          description: `Your brand appears in position #4+ on ${lowPosResults.length} models. Improving content authority could move you up.`,
          promptText: group.text,
          affectedModels: lowPosResults.map((r) => r.llm_model),
          estimatedImpact: group.volume,
        });
      }

      const negResults = results.filter(
        (r) =>
          r.prompt_id === promptId &&
          r.brand_mentioned &&
          r.sentiment === "negative"
      );
      if (negResults.length >= 2) {
        idx++;
        opps.push({
          id: `opp-${idx}`,
          type: "negative_sentiment",
          severity: "medium",
          title: `Negative sentiment for "${group.text.slice(0, 60)}${group.text.length > 60 ? "..." : ""}"`,
          description: `AI models express negative sentiment about ${activeBrand?.brand_name ?? "your brand"} in ${negResults.length} responses.`,
          promptText: group.text,
          affectedModels: negResults.map((r) => r.llm_model),
          estimatedImpact: group.volume,
        });
      }
    }

    const severityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
    return opps.sort(
      (a, b) =>
        (severityOrder[a.severity] ?? 2) - (severityOrder[b.severity] ?? 2) ||
        (b.estimatedImpact ?? 0) - (a.estimatedImpact ?? 0)
    );
  }, [hasRealData, results, prompts, sources, activeBrand]);

  if (!hasBrand) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-[#8A9BA3] text-sm mb-4">Add a brand to discover opportunities.</p>
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
          <h1 className="text-xl font-bold text-[#2D3B42]">Opportunities</h1>
          <p className="text-[13px] text-[#8A9BA3] mt-0.5">
            Visibility gaps and improvement opportunities for {activeBrand?.brand_name ?? "your brand"}.
          </p>
        </div>
        <div className="bg-white border border-[#E8EAEB] rounded-xl p-8 text-center">
          <p className="text-[#8A9BA3] text-sm mb-4">
            Run an analysis to discover visibility gaps and opportunities.
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

  const highCount = opportunities.filter((o) => o.severity === "high").length;
  const totalImpact = opportunities.reduce(
    (a, o) => a + (o.estimatedImpact ?? 0),
    0
  );

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-[#2D3B42]">Opportunities</h1>
        <p className="text-[13px] text-[#8A9BA3] mt-0.5">
          Visibility gaps and improvement opportunities for {activeBrand?.brand_name ?? "your brand"}.
        </p>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <Metric label="Opportunities" value={String(opportunities.length)} />
        <Metric label="High Priority" value={String(highCount)} />
        <Metric
          label="Est. Monthly Volume"
          value={
            totalImpact > 0
              ? `${(totalImpact / 1000).toFixed(0)}K`
              : "N/A"
          }
        />
      </div>

      <div className="space-y-3">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            className="bg-white border border-[#E8EAEB] rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Tag
                label={opp.severity}
                color={SEVERITY_COLOR[opp.severity] ?? "gray"}
                small
              />
              <Tag
                label={TYPE_LABEL[opp.type] ?? opp.type}
                color="gray"
                small
              />
              {opp.estimatedImpact && (
                <span className="text-[10px] text-[#8A9BA3]">
                  {(opp.estimatedImpact / 1000).toFixed(0)}K monthly
                </span>
              )}
            </div>
            <h3 className="text-[14px] font-semibold text-[#2D3B42] mb-1">
              {opp.title}
            </h3>
            <p className="text-[13px] text-[#4A5D66] mb-2">
              {opp.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {opp.affectedModels.map((model) => (
                <span
                  key={model}
                  className="text-[10px] bg-[#F0F0F4] rounded px-1.5 py-0.5 text-[#4A5D66]"
                >
                  {MODEL_DISPLAY[model] ?? model}
                </span>
              ))}
            </div>
          </div>
        ))}

        {opportunities.length === 0 && (
          <div className="text-center py-12 text-[#8A9BA3] text-sm">
            No major opportunities found. Your brand visibility looks solid!
          </div>
        )}
      </div>
    </div>
  );
}
