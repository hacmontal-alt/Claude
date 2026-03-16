"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

// ── Types ──

export interface BrandData {
  id: string;
  brand_name: string;
  brand_url: string;
  market: string;
  language: string;
  logo_url: string | null;
  is_sample: boolean;
  org_id: string;
}

export interface TopicData {
  id: string;
  brand_id: string;
  name: string;
}

export interface PromptData {
  id: string;
  brand_id: string;
  topic_id: string | null;
  prompt_text: string;
  estimated_volume: number;
  tags: string[];
  is_active: boolean;
}

export interface CompetitorData {
  id: string;
  brand_id: string;
  competitor_name: string;
}

export interface AnalysisRunData {
  id: string;
  brand_id: string;
  started_at: string;
  completed_at: string | null;
  status: string;
  prompt_count: number;
  models: string[];
  is_sample: boolean;
}

export interface AnalysisResultData {
  id: string;
  run_id: string;
  prompt_id: string;
  llm_model: string;
  brand_mentioned: boolean;
  brand_position: number | null;
  sentiment: string | null;
  raw_response: string;
  competitor_mentions: { name: string; position: number; sentiment?: string }[];
  created_at: string;
}

export interface CitedSourceData {
  id: string;
  run_id: string;
  prompt_id: string;
  llm_model: string;
  url: string;
  domain: string;
  content_type: string | null;
  is_brand_owned: boolean;
  citation_count: number;
}

interface BrandContextValue {
  // Data
  brands: BrandData[];
  activeBrand: BrandData | null;
  topics: TopicData[];
  prompts: PromptData[];
  competitors: CompetitorData[];
  latestRun: AnalysisRunData | null;
  results: AnalysisResultData[];
  sources: CitedSourceData[];

  // State
  loading: boolean;
  analyzing: boolean;
  hasBrand: boolean;
  hasRealData: boolean;

  // Actions
  setActiveBrandId: (id: string) => void;
  refresh: () => Promise<void>;
  triggerAnalysis: () => Promise<{ runId: string } | null>;
}

const BrandContext = createContext<BrandContextValue | null>(null);

export function useBrand() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error("useBrand must be used within BrandProvider");
  return ctx;
}

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [activeBrandId, setActiveBrandId] = useState<string | null>(null);
  const [topics, setTopics] = useState<TopicData[]>([]);
  const [prompts, setPrompts] = useState<PromptData[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [latestRun, setLatestRun] = useState<AnalysisRunData | null>(null);
  const [results, setResults] = useState<AnalysisResultData[]>([]);
  const [sources, setSources] = useState<CitedSourceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const activeBrand = brands.find((b) => b.id === activeBrandId) ?? null;
  const hasBrand = activeBrand !== null;
  const hasRealData = results.length > 0;

  // Load brands and data via API route (bypasses RLS)
  const loadData = useCallback(async (brandId?: string) => {
    try {
      const url = brandId ? `/api/brands?brandId=${brandId}` : "/api/brands";
      const res = await fetch(url);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();

      if (data.brands && data.brands.length > 0) {
        setBrands(data.brands);
        const targetId = brandId || data.brands[0].id;
        setActiveBrandId(targetId);
      }

      if (data.brandData) {
        setTopics(data.brandData.topics ?? []);
        setPrompts(data.brandData.prompts ?? []);
        setCompetitors(data.brandData.competitors ?? []);
        setLatestRun(data.brandData.latestRun ?? null);
        setResults(data.brandData.results ?? []);
        setSources(data.brandData.sources ?? []);
      }
    } catch (err) {
      console.error("Failed to load brand data:", err);
    }
    setLoading(false);
  }, []);

  // Load on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reload when brand changes
  const switchBrand = useCallback(
    (id: string) => {
      setActiveBrandId(id);
      loadData(id);
    },
    [loadData]
  );

  const refresh = useCallback(async () => {
    if (activeBrandId) {
      await loadData(activeBrandId);
    }
  }, [activeBrandId, loadData]);

  const triggerAnalysis = useCallback(async () => {
    if (!activeBrandId) return null;
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analysis/run-direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId: activeBrandId }),
      });
      if (!res.ok) {
        setAnalyzing(false);
        return null;
      }
      const data = await res.json();
      await refresh();
      setAnalyzing(false);
      return data;
    } catch {
      setAnalyzing(false);
      return null;
    }
  }, [activeBrandId, refresh]);

  return (
    <BrandContext.Provider
      value={{
        brands,
        activeBrand,
        topics,
        prompts,
        competitors,
        latestRun,
        results,
        sources,
        loading,
        analyzing,
        hasBrand,
        hasRealData,
        setActiveBrandId: switchBrand,
        refresh,
        triggerAnalysis,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}
