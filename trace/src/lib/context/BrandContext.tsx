"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";

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
  const hasRealData = results.length > 0;

  // Load brands on mount
  useEffect(() => {
    async function loadBrands() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: brandList } = await supabase
        .from("brands")
        .select("*")
        .order("created_at", { ascending: true });

      if (brandList && brandList.length > 0) {
        setBrands(brandList);
        setActiveBrandId(brandList[0].id);
      }
      setLoading(false);
    }
    loadBrands();
  }, []);

  // Load brand data when active brand changes
  const loadBrandData = useCallback(async (brandId: string) => {
    const supabase = createClient();

    const [topicsRes, promptsRes, competitorsRes, runsRes] = await Promise.all([
      supabase.from("topics").select("*").eq("brand_id", brandId),
      supabase.from("prompts").select("*").eq("brand_id", brandId).order("created_at"),
      supabase.from("competitors").select("*").eq("brand_id", brandId),
      supabase
        .from("analysis_runs")
        .select("*")
        .eq("brand_id", brandId)
        .order("started_at", { ascending: false })
        .limit(1),
    ]);

    setTopics(topicsRes.data ?? []);
    setPrompts(promptsRes.data ?? []);
    setCompetitors(competitorsRes.data ?? []);

    const run = runsRes.data?.[0] ?? null;
    setLatestRun(run);

    if (run) {
      const [resultsRes, sourcesRes] = await Promise.all([
        supabase.from("analysis_results").select("*").eq("run_id", run.id),
        supabase.from("cited_sources").select("*").eq("run_id", run.id),
      ]);
      setResults(resultsRes.data ?? []);
      setSources(sourcesRes.data ?? []);
    } else {
      setResults([]);
      setSources([]);
    }
  }, []);

  useEffect(() => {
    if (activeBrandId) {
      loadBrandData(activeBrandId);
    }
  }, [activeBrandId, loadBrandData]);

  const refresh = useCallback(async () => {
    if (activeBrandId) {
      await loadBrandData(activeBrandId);
    }
  }, [activeBrandId, loadBrandData]);

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
        hasRealData,
        setActiveBrandId,
        refresh,
        triggerAnalysis,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}
