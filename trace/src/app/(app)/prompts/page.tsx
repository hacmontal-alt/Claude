"use client";

import { useState, useMemo } from "react";
import { useBrand } from "@/lib/context/BrandContext";
import {
  getSampleTopics,
  getSamplePrompts,
  getSampleAnalysisResults,
} from "@/lib/utils/sample-data";
import Callout from "@/components/ui/Callout";
import Tag from "@/components/ui/Tag";
import Metric from "@/components/ui/Metric";

const MODEL_DISPLAY: Record<string, string> = {
  chatgpt: "ChatGPT",
  gemini: "Gemini",
  perplexity: "Perplexity",
  grok: "Grok",
  ai_overviews: "AI Overviews",
};

const SENTIMENT_COLOR: Record<string, string> = {
  positive: "green",
  neutral: "gray",
  negative: "red",
};

export default function PromptsPage() {
  const brand = useBrand();
  const hasReal = brand.hasRealData;

  const topics = useMemo(() => {
    if (hasReal) {
      return brand.topics.map((t) => ({
        id: t.id,
        name: t.name,
        promptCount: brand.prompts.filter((p) => p.topic_id === t.id).length,
      }));
    }
    return getSampleTopics();
  }, [hasReal, brand.topics, brand.prompts]);

  const prompts = useMemo(() => {
    if (hasReal) {
      return brand.prompts.map((p) => ({
        id: p.id,
        topicId: p.topic_id ?? "",
        text: p.prompt_text,
        estimatedVolume: p.estimated_volume,
        tags: p.tags,
      }));
    }
    return getSamplePrompts();
  }, [hasReal, brand.prompts]);

  const results = useMemo(() => {
    if (hasReal) return brand.results;
    return getSampleAnalysisResults();
  }, [hasReal, brand.results]);

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredPrompts = selectedTopic
    ? prompts.filter((p) => p.topicId === selectedTopic)
    : prompts;

  const totalPrompts = prompts.length;
  const totalResults = results.length;
  const mentionedCount = results.filter((r) => r.brand_mentioned).length;
  const brandPresence = totalResults > 0 ? Math.round((mentionedCount / totalResults) * 1000) / 10 : 0;

  function getPromptResults(promptId: string) {
    return results.filter((r) => r.prompt_id === promptId);
  }

  function getPromptStatus(promptId: string) {
    const promptResults = getPromptResults(promptId);
    if (promptResults.length === 0) return { label: "Pending", color: "gray" };
    const mentioned = promptResults.filter((r) => r.brand_mentioned).length;
    const rate = mentioned / promptResults.length;
    if (rate >= 0.7) return { label: "Strong", color: "green" };
    if (rate >= 0.4) return { label: "Moderate", color: "orange" };
    return { label: "Weak", color: "red" };
  }

  function getTopicName(topicId: string) {
    return topics.find((t) => t.id === topicId)?.name ?? "Unknown";
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-[#2D3B42]">Prompts</h1>
        <p className="text-[13px] text-[#8A9BA3] mt-0.5">
          Manage and monitor the prompts being tracked for {brand.activeBrand?.brand_name ?? "your brand"}.
        </p>
      </div>

      <div className="mb-4">
        {!hasReal ? (
          <Callout type="info">
            Showing sample data{brand.activeBrand ? ` for ${brand.activeBrand.brand_name}` : ""}. Connect your brand to see real results.
            {brand.activeBrand && (
              <button onClick={() => brand.triggerAnalysis()} className="ml-2 underline font-semibold text-[#EF4623]">
                Run analysis now
              </button>
            )}
          </Callout>
        ) : (
          <Callout type="success">
            Showing real analysis results for {brand.activeBrand?.brand_name ?? "your brand"}.
          </Callout>
        )}
      </div>

      {/* Summary metrics */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <Metric label="Total Prompts" value={String(totalPrompts)} />
        <Metric label="Active" value={String(totalPrompts)} />
        <Metric label="Brand Presence" value={`${brandPresence}%`} change={!hasReal ? "+3.2%" : undefined} />
        <Metric label="Avg. Results / Prompt" value={totalPrompts > 0 ? String(Math.round(totalResults / totalPrompts)) : "0"} />
      </div>

      <div className="flex gap-5">
        {/* Topics sidebar */}
        <div className="w-[200px] shrink-0">
          <div className="bg-white border border-[#E8EAEB] rounded-lg p-2">
            <div className="text-[10px] text-[#8A9BA3] uppercase tracking-wider font-medium px-2 py-1.5">
              Topics
            </div>
            <button
              onClick={() => setSelectedTopic(null)}
              className={`w-full text-left text-[13px] px-2 py-1.5 rounded-md transition ${
                selectedTopic === null ? "bg-[#FDF1EE] text-[#EF4623] font-semibold" : "text-[#4A5D66] hover:bg-[#F8F9FA]"
              }`}
            >
              All
              <span className="text-[11px] text-[#8A9BA3] ml-1.5">{prompts.length}</span>
            </button>
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`w-full text-left text-[13px] px-2 py-1.5 rounded-md transition ${
                  selectedTopic === topic.id ? "bg-[#FDF1EE] text-[#EF4623] font-semibold" : "text-[#4A5D66] hover:bg-[#F8F9FA]"
                }`}
              >
                {topic.name}
                <span className="text-[11px] text-[#8A9BA3] ml-1.5">{topic.promptCount}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Prompts table */}
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-[#E8EAEB] rounded-lg overflow-hidden">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#E8EAEB] bg-[#F8F9FA]">
                  <th className="text-left text-[10px] text-[#8A9BA3] uppercase tracking-wider font-medium px-3 py-2.5">Prompt</th>
                  <th className="text-left text-[10px] text-[#8A9BA3] uppercase tracking-wider font-medium px-3 py-2.5">Topic</th>
                  <th className="text-right text-[10px] text-[#8A9BA3] uppercase tracking-wider font-medium px-3 py-2.5">Volume</th>
                  <th className="text-center text-[10px] text-[#8A9BA3] uppercase tracking-wider font-medium px-3 py-2.5">Status</th>
                  <th className="text-right text-[10px] text-[#8A9BA3] uppercase tracking-wider font-medium px-3 py-2.5">Last Run</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrompts.map((prompt) => {
                  const status = getPromptStatus(prompt.id);
                  const isExpanded = expandedRow === prompt.id;
                  const promptResults = getPromptResults(prompt.id);
                  return (
                    <PromptRow
                      key={prompt.id}
                      prompt={prompt}
                      topicName={getTopicName(prompt.topicId)}
                      status={status}
                      isExpanded={isExpanded}
                      promptResults={promptResults}
                      hasReal={hasReal}
                      lastRun={brand.latestRun?.started_at}
                      onToggle={() => setExpandedRow(isExpanded ? null : prompt.id)}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function PromptRow({
  prompt,
  topicName,
  status,
  isExpanded,
  promptResults,
  hasReal,
  lastRun,
  onToggle,
}: {
  prompt: { id: string; text: string; topicId: string; estimatedVolume: number; tags: string[] };
  topicName: string;
  status: { label: string; color: string };
  isExpanded: boolean;
  promptResults: { llm_model: string; brand_mentioned: boolean; brand_position: number | null; sentiment: string | null }[];
  hasReal: boolean;
  lastRun?: string | null;
  onToggle: () => void;
}) {
  const runDate = hasReal && lastRun
    ? new Date(lastRun).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Mar 14, 2026";

  return (
    <>
      <tr onClick={onToggle} className="border-b border-[#E8EAEB] hover:bg-[#F8F9FA] cursor-pointer transition">
        <td className="px-3 py-2.5">
          <div className="flex items-center gap-2">
            <svg
              className={`w-3 h-3 text-[#8A9BA3] transition-transform shrink-0 ${isExpanded ? "rotate-90" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[#2D3B42] truncate">{prompt.text}</span>
          </div>
        </td>
        <td className="px-3 py-2.5 text-[#4A5D66]">{topicName}</td>
        <td className="px-3 py-2.5 text-right text-[#4A5D66] tabular-nums">{prompt.estimatedVolume.toLocaleString()}</td>
        <td className="px-3 py-2.5 text-center">
          <Tag label={status.label} color={status.color} small />
        </td>
        <td className="px-3 py-2.5 text-right text-[#8A9BA3] text-[12px]">{runDate}</td>
      </tr>
      {isExpanded && (
        <tr className="border-b border-[#E8EAEB]">
          <td colSpan={5} className="bg-[#F8F9FA] px-3 py-3">
            <div className="pl-5">
              <div className="text-[10px] text-[#8A9BA3] uppercase tracking-wider font-medium mb-2">
                Model-by-model results
              </div>
              <div className="grid grid-cols-5 gap-2">
                {promptResults.map((r) => (
                  <div key={r.llm_model} className="bg-white border border-[#E8EAEB] rounded-lg p-2.5">
                    <div className="text-[11px] font-semibold text-[#2D3B42] mb-1.5">
                      {MODEL_DISPLAY[r.llm_model] ?? r.llm_model}
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${r.brand_mentioned ? "bg-[#059669]" : "bg-[#DC2626]"}`} />
                      <span className="text-[11px] text-[#4A5D66]">
                        {r.brand_mentioned ? "Mentioned" : "Not mentioned"}
                      </span>
                    </div>
                    {r.brand_position !== null && (
                      <div className="text-[11px] text-[#8A9BA3]">Position: #{r.brand_position}</div>
                    )}
                    <div className="mt-1">
                      <Tag label={r.sentiment ?? "N/A"} color={SENTIMENT_COLOR[r.sentiment ?? ""] ?? "gray"} small />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5 mt-2">
                {prompt.tags.map((tag) => (
                  <Tag key={tag} label={tag} color="gray" small />
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
