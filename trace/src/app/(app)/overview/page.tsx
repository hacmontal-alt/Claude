"use client";

import { useMemo } from "react";
import { useBrand } from "@/lib/context/BrandContext";
import {
  getSampleOverviewData,
  getSampleCitedSources,
  getSampleCompetitorData,
  getSampleRecentChats,
  getSampleOpportunities,
} from "@/lib/utils/sample-data";
import Metric from "@/components/ui/Metric";
import Tag from "@/components/ui/Tag";
import Callout from "@/components/ui/Callout";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  Zap,
  MessageSquare,
  ExternalLink,
  Loader2,
} from "lucide-react";

const MODEL_LABELS: Record<string, string> = {
  chatgpt: "ChatGPT",
  gemini: "Gemini",
  perplexity: "Perplexity",
  grok: "Grok",
  ai_overviews: "AI Overviews",
};

const MODEL_COLORS: Record<string, string> = {
  chatgpt: "#10A37F",
  gemini: "#4285F4",
  perplexity: "#1A73E8",
  grok: "#2D3B42",
  ai_overviews: "#EF4623",
};

const SENTIMENT_COLORS = {
  positive: "#059669",
  neutral: "#8A9BA3",
  negative: "#DC2626",
};

const SOURCE_TYPE_COLORS: Record<string, string> = {
  brand: "#EF4623",
  review: "#4285F4",
  ugc: "#7C3AED",
  ecommerce: "#D97706",
  video: "#DC2626",
  reference: "#8A9BA3",
  editorial: "#0891B2",
  competitor: "#2D3B42",
  unknown: "#E8EAEB",
};

const SEVERITY_CONFIG: Record<string, { color: "red" | "orange" | "gray" }> = {
  high: { color: "red" },
  medium: { color: "orange" },
  low: { color: "gray" },
};

export default function OverviewPage() {
  const {
    activeBrand,
    results,
    sources,
    competitors,
    prompts,
    latestRun,
    hasRealData,
    hasBrand,
    loading,
    analyzing,
    triggerAnalysis,
  } = useBrand();

  const sampleOverview = useMemo(() => getSampleOverviewData(), []);
  const sampleSources = useMemo(() => getSampleCitedSources(), []);
  const sampleCompetitors = useMemo(() => getSampleCompetitorData(), []);
  const sampleChats = useMemo(() => getSampleRecentChats(), []);
  const sampleOpps = useMemo(() => getSampleOpportunities(), []);

  // ── Metrics ──
  const metrics = useMemo(() => {
    if (!hasRealData) {
      return {
        brandPresence: 67,
        avgPosition: 2.4,
        citationRate: 34,
        sentimentScore: 78,
        totalPrompts: 24,
        brandPresenceChange: "+5.2%",
        avgPositionChange: "-0.3",
        citationRateChange: "+2.1%",
        sentimentChange: "+1.8%",
      };
    }
    const total = results.length;
    const mentioned = results.filter((r) => r.brand_mentioned).length;
    const brandPresence = total > 0 ? Math.round((mentioned / total) * 1000) / 10 : 0;
    const withPos = results.filter((r) => r.brand_position !== null);
    const avgPosition =
      withPos.length > 0
        ? Math.round((withPos.reduce((a, r) => a + (r.brand_position || 0), 0) / withPos.length) * 10) / 10
        : 0;
    const totalCitations = sources.reduce((a, s) => a + s.citation_count, 0);
    const brandCitations = sources.filter((s) => s.is_brand_owned).reduce((a, s) => a + s.citation_count, 0);
    const citationRate = totalCitations > 0 ? Math.round((brandCitations / totalCitations) * 1000) / 10 : 0;
    const mentionedResults = results.filter((r) => r.brand_mentioned);
    const positive = mentionedResults.filter((r) => r.sentiment === "positive").length;
    const sentimentScore = mentionedResults.length > 0 ? Math.round((positive / mentionedResults.length) * 1000) / 10 : 0;

    return {
      brandPresence,
      avgPosition,
      citationRate,
      sentimentScore,
      totalPrompts: prompts.length,
      brandPresenceChange: undefined,
      avgPositionChange: undefined,
      citationRateChange: undefined,
      sentimentChange: undefined,
    };
  }, [hasRealData, results, sources, prompts]);

  // ── Model Breakdown ──
  const modelBreakdown = useMemo(() => {
    if (!hasRealData) return sampleOverview.modelBreakdown;
    const models = ["chatgpt", "gemini", "perplexity", "grok", "ai_overviews"];
    return models.map((model) => {
      const mr = results.filter((r) => r.llm_model === model);
      const mentioned = mr.filter((r) => r.brand_mentioned).length;
      return {
        model,
        presence: mr.length > 0 ? Math.round((mentioned / mr.length) * 1000) / 10 : 0,
        avgPosition: null as number | null,
        totalQueries: mr.length,
      };
    });
  }, [hasRealData, results, sampleOverview]);

  // ── Sentiment Breakdown ──
  const sentiment = useMemo(() => {
    if (!hasRealData) return sampleOverview.sentimentBreakdown;
    const mentioned = results.filter((r) => r.brand_mentioned);
    return {
      positive: mentioned.filter((r) => r.sentiment === "positive").length,
      neutral: mentioned.filter((r) => r.sentiment === "neutral").length,
      negative: mentioned.filter((r) => r.sentiment === "negative").length,
    };
  }, [hasRealData, results, sampleOverview]);

  const sentimentTotal = sentiment.positive + sentiment.neutral + sentiment.negative;
  const sentimentPieData = [
    { name: "Positive", value: sentiment.positive, color: SENTIMENT_COLORS.positive },
    { name: "Neutral", value: sentiment.neutral, color: SENTIMENT_COLORS.neutral },
    { name: "Negative", value: sentiment.negative, color: SENTIMENT_COLORS.negative },
  ];

  // ── Trend Data ──
  const trendData = useMemo(() => {
    if (!hasRealData) return sampleOverview.trends;
    return sampleOverview.trends;
  }, [hasRealData, sampleOverview]);

  // ── Top Sources ──
  const topSources = useMemo(() => {
    const raw = hasRealData ? sources : sampleSources;
    const domainMap: Record<string, { domain: string; citations: number; type: string; brandOwned: boolean }> = {};
    raw.forEach((s) => {
      if (!domainMap[s.domain]) {
        domainMap[s.domain] = { domain: s.domain, citations: 0, type: s.content_type ?? "unknown", brandOwned: s.is_brand_owned };
      }
      domainMap[s.domain].citations += s.citation_count;
    });
    return Object.values(domainMap).sort((a, b) => b.citations - a.citations).slice(0, 8);
  }, [hasRealData, sources, sampleSources]);

  // ── Source Type Distribution ──
  const sourceTypes = useMemo(() => {
    const raw = hasRealData ? sources : sampleSources;
    const typeMap: Record<string, number> = {};
    raw.forEach((s) => {
      const t = s.content_type ?? "unknown";
      typeMap[t] = (typeMap[t] || 0) + s.citation_count;
    });
    return Object.entries(typeMap)
      .map(([type, count]) => ({ name: type, value: count, color: SOURCE_TYPE_COLORS[type] ?? "#8A9BA3" }))
      .sort((a, b) => b.value - a.value);
  }, [hasRealData, sources, sampleSources]);

  const totalSourceCitations = sourceTypes.reduce((a, s) => a + s.value, 0);

  // ── Competitor Comparison ──
  const competitorComparison = useMemo(() => {
    if (!hasRealData) return sampleCompetitors.sort((a, b) => b.mentionRate - a.mentionRate).slice(0, 5);
    return competitors.map((comp) => {
      let count = 0;
      for (const r of results) {
        const mentions = r.competitor_mentions as any[];
        if (Array.isArray(mentions) && mentions.some((m: any) => m.name?.toLowerCase() === comp.competitor_name.toLowerCase())) {
          count++;
        }
      }
      return {
        name: comp.competitor_name,
        domain: "",
        mentionRate: results.length > 0 ? Math.round((count / results.length) * 1000) / 10 : 0,
      };
    }).sort((a, b) => b.mentionRate - a.mentionRate).slice(0, 5);
  }, [hasRealData, competitors, results, sampleCompetitors]);

  // ── Recent Chats ──
  const recentChats = useMemo(() => {
    if (!hasRealData) return sampleChats;
    return results
      .filter((r) => r.brand_mentioned && r.raw_response)
      .slice(0, 5)
      .map((r) => ({
        id: r.id,
        model: r.llm_model,
        prompt: prompts.find((p) => p.id === r.prompt_id)?.prompt_text ?? "Unknown prompt",
        brandMentioned: r.brand_mentioned,
        position: r.brand_position,
        sentiment: r.sentiment as "positive" | "neutral" | "negative",
        timestamp: r.created_at,
        snippet: r.raw_response?.slice(0, 150) + "...",
      }));
  }, [hasRealData, results, prompts, sampleChats]);

  // ── Top Opportunities ──
  const topOpps = useMemo(() => {
    if (!hasRealData) return sampleOpps.slice(0, 3);
    return sampleOpps.slice(0, 3);
  }, [hasRealData, sampleOpps]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-[#8A9BA3] text-sm">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading dashboard...
      </div>
    );
  }

  const brandName = activeBrand?.brand_name ?? "Your Brand";

  return (
    <div className="max-w-[1200px] mx-auto space-y-5">
      {/* Status banners */}
      {analyzing && (
        <Callout type="info">
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Running analysis across AI models... This may take a few minutes.
          </span>
        </Callout>
      )}

      {!analyzing && !hasRealData && (
        <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-[#FDF1EE] to-[#FFF7F5] border border-[#EF4623]/10 rounded-xl p-4">
          <div>
            <p className="text-sm font-semibold text-[#2D3B42]">
              {hasBrand ? `Showing sample data for ${brandName}` : "Showing sample data"}
            </p>
            <p className="text-xs text-[#8A9BA3] mt-0.5">Run an analysis to see real results from AI models.</p>
          </div>
          <button
            onClick={() => triggerAnalysis()}
            className="shrink-0 px-5 py-2.5 rounded-lg bg-[#EF4623] text-white font-semibold text-sm hover:bg-[#D93D1E] transition-colors shadow-sm"
          >
            Run Analysis Now
          </button>
        </div>
      )}

      {!analyzing && hasRealData && latestRun && (
        <Callout type="success">
          <span className="flex items-center justify-between w-full">
            <span>Results from {new Date(latestRun.started_at).toLocaleDateString()} ({latestRun.status})</span>
            <button onClick={() => triggerAnalysis()} className="underline font-semibold text-[#047857]">
              Run new analysis
            </button>
          </span>
        </Callout>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#2D3B42]">Overview</h1>
        <p className="text-[13px] text-[#8A9BA3] mt-0.5">
          AI visibility dashboard for {brandName}
        </p>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Metric label="Brand Presence" value={`${metrics.brandPresence}%`} change={metrics.brandPresenceChange} />
        <Metric label="Avg. Position" value={String(metrics.avgPosition)} change={metrics.avgPositionChange} />
        <Metric label="Citation Rate" value={`${metrics.citationRate}%`} change={metrics.citationRateChange} />
        <Metric label="Sentiment" value={`${metrics.sentimentScore}%`} change={metrics.sentimentChange} />
        <Metric label="Prompts Tracked" value={String(metrics.totalPrompts)} />
      </div>

      {/* ── Row: Visibility Chart + Sentiment Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Visibility Over Time */}
        <div className="lg:col-span-2 bg-white border border-[#E8EAEB] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#2D3B42]">Visibility Over Time</h2>
            <div className="flex gap-1">
              {["W", "M", "Q"].map((period) => (
                <button
                  key={period}
                  className={`px-2.5 py-1 text-[10px] font-semibold rounded ${
                    period === "W"
                      ? "bg-[#EF4623] text-white"
                      : "bg-[#F0F0F4] text-[#8A9BA3] hover:bg-[#E8EAEB]"
                  } transition-colors`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="visGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4623" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#EF4623" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F4" vertical={false} />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 10, fill: "#8A9BA3" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })}
              />
              <YAxis tick={{ fontSize: 10, fill: "#8A9BA3" }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ fontSize: 11, border: "1px solid #E8EAEB", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
                formatter={(value: number) => [`${value}%`, "Visibility"]}
                labelFormatter={(label) => new Date(label).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })}
              />
              <Area type="monotone" dataKey="brandPresence" stroke="#EF4623" strokeWidth={2} fill="url(#visGradient)" dot={{ r: 3, fill: "#fff", stroke: "#EF4623", strokeWidth: 1.5 }} activeDot={{ r: 5, fill: "#EF4623" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment Breakdown */}
        <div className="bg-white border border-[#E8EAEB] rounded-xl p-4">
          <h2 className="text-sm font-semibold text-[#2D3B42] mb-3">Sentiment Breakdown</h2>
          <div className="flex justify-center">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={sentimentPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {sentimentPieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ fontSize: 11, border: "1px solid #E8EAEB", borderRadius: 8 }}
                  formatter={(value: number, name: string) => [`${value} (${sentimentTotal > 0 ? Math.round((value / sentimentTotal) * 100) : 0}%)`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {sentimentPieData.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-xs text-[#4A5D66]">{s.name}</span>
                </div>
                <span className="text-xs font-semibold text-[#2D3B42]">
                  {sentimentTotal > 0 ? Math.round((s.value / sentimentTotal) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row: Share of Voice by Model + Competitor Comparison ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Share of Voice by Model */}
        <div className="bg-white border border-[#E8EAEB] rounded-xl p-4">
          <h2 className="text-sm font-semibold text-[#2D3B42] mb-4">Share of Voice by Model</h2>
          <div className="space-y-3">
            {modelBreakdown
              .sort((a, b) => b.presence - a.presence)
              .map((m) => {
                const pct = Math.round(m.presence);
                return (
                  <div key={m.model} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-xs font-medium text-[#4A5D66]">
                      {MODEL_LABELS[m.model] ?? m.model}
                    </span>
                    <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-[#F0F0F4]">
                      <div
                        className="absolute inset-y-0 left-0 rounded-md transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: MODEL_COLORS[m.model] ?? "#8A9BA3" }}
                      />
                    </div>
                    <span className="w-12 shrink-0 text-right text-xs font-bold text-[#2D3B42]">
                      {pct}%
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Competitor Comparison */}
        <div className="bg-white border border-[#E8EAEB] rounded-xl p-4">
          <h2 className="text-sm font-semibold text-[#2D3B42] mb-4">Competitor Share of Voice</h2>
          <div className="space-y-3">
            {/* Brand's own bar */}
            <div className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-xs font-bold text-[#EF4623] truncate">
                {brandName}
              </span>
              <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-[#F0F0F4]">
                <div
                  className="absolute inset-y-0 left-0 rounded-md bg-[#EF4623] transition-all duration-500"
                  style={{ width: `${metrics.brandPresence}%` }}
                />
              </div>
              <span className="w-12 shrink-0 text-right text-xs font-bold text-[#EF4623]">
                {metrics.brandPresence}%
              </span>
            </div>
            {/* Competitors */}
            {competitorComparison.map((comp) => (
              <div key={comp.name} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-xs font-medium text-[#4A5D66] truncate">
                  {comp.name}
                </span>
                <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-[#F0F0F4]">
                  <div
                    className="absolute inset-y-0 left-0 rounded-md bg-[#8A9BA3] transition-all duration-500"
                    style={{ width: `${comp.mentionRate}%` }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right text-xs font-semibold text-[#2D3B42]">
                  {comp.mentionRate}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row: Top Cited Sources + Source Type Distribution ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Cited Sources */}
        <div className="lg:col-span-2 bg-white border border-[#E8EAEB] rounded-xl p-4">
          <h2 className="text-sm font-semibold text-[#2D3B42] mb-3">Top Cited Sources</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8EAEB] text-[10px] uppercase tracking-wider text-[#8A9BA3]">
                  <th className="pb-2 pr-4 font-medium">#</th>
                  <th className="pb-2 pr-4 font-medium">Domain</th>
                  <th className="pb-2 pr-4 font-medium text-right">Citations</th>
                  <th className="pb-2 pr-4 font-medium">Type</th>
                  <th className="pb-2 font-medium">Owner</th>
                </tr>
              </thead>
              <tbody>
                {topSources.map((s, i) => (
                  <tr key={s.domain} className="border-b border-[#E8EAEB] last:border-0 hover:bg-[#FAFAFA] transition-colors">
                    <td className="py-2 pr-4 text-[#8A9BA3] tabular-nums">{i + 1}</td>
                    <td className="py-2 pr-4 font-medium text-[#2D3B42]">{s.domain}</td>
                    <td className="py-2 pr-4 text-right text-[#4A5D66] tabular-nums">{s.citations}</td>
                    <td className="py-2 pr-4">
                      <Tag label={s.type} color={s.brandOwned ? "coral" : "gray"} small />
                    </td>
                    <td className="py-2">
                      {s.brandOwned ? (
                        <Tag label="You" color="coral" small />
                      ) : (
                        <span className="text-[10px] text-[#8A9BA3]">Third-party</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Source Type Distribution */}
        <div className="bg-white border border-[#E8EAEB] rounded-xl p-4">
          <h2 className="text-sm font-semibold text-[#2D3B42] mb-3">Source Types</h2>
          <div className="flex justify-center mb-3">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={sourceTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {sourceTypes.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ fontSize: 11, border: "1px solid #E8EAEB", borderRadius: 8 }}
                  formatter={(value: number, name: string) => [`${value} citations`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5">
            {sourceTypes.slice(0, 6).map((t) => (
              <div key={t.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: t.color }} />
                  <span className="text-[11px] text-[#4A5D66] capitalize">{t.name}</span>
                </div>
                <span className="text-[11px] font-semibold text-[#2D3B42]">
                  {totalSourceCitations > 0 ? Math.round((t.value / totalSourceCitations) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent AI Responses ── */}
      <div className="bg-white border border-[#E8EAEB] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#2D3B42] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#8A9BA3]" />
            Recent AI Responses
          </h2>
        </div>
        <div className="space-y-3">
          {recentChats.map((chat) => (
            <div key={chat.id} className="border border-[#E8EAEB] rounded-lg p-3 hover:border-[#D0D3D6] transition-colors">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-[#2D3B42] truncate">{chat.prompt}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Tag
                    label={MODEL_LABELS[chat.model] ?? chat.model}
                    color={chat.model === "chatgpt" ? "green" : chat.model === "gemini" ? "cyan" : chat.model === "perplexity" ? "purple" : "gray"}
                    small
                  />
                  {chat.position !== null && (
                    <span className="text-[10px] font-semibold text-[#8A9BA3] bg-[#F0F0F4] px-1.5 py-0.5 rounded">
                      #{chat.position}
                    </span>
                  )}
                  <Tag
                    label={chat.sentiment}
                    color={chat.sentiment === "positive" ? "green" : chat.sentiment === "negative" ? "red" : "gray"}
                    small
                  />
                </div>
              </div>
              <p className="text-[11px] text-[#4A5D66] leading-relaxed line-clamp-2">{chat.snippet}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Top Opportunities ── */}
      <div className="bg-white border border-[#E8EAEB] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#2D3B42] flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#D97706]" />
            Top Opportunities
          </h2>
          <a href="/opportunities" className="text-[11px] font-semibold text-[#EF4623] hover:underline flex items-center gap-1">
            View all <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="space-y-2.5">
          {topOpps.map((opp) => {
            const config = SEVERITY_CONFIG[opp.severity];
            return (
              <div key={opp.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#FAFAFA] transition-colors">
                <div className="mt-0.5">
                  <Tag label={opp.severity} color={config.color} small />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-[#2D3B42]">{opp.title}</p>
                  <p className="text-[11px] text-[#8A9BA3] mt-0.5 line-clamp-1">{opp.description}</p>
                </div>
                {opp.estimatedImpact && (
                  <div className="shrink-0 text-right">
                    <div className="text-[11px] font-bold text-[#2D3B42]">{(opp.estimatedImpact / 1000).toFixed(0)}K</div>
                    <div className="text-[9px] text-[#8A9BA3] uppercase">volume</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
