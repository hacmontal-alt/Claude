export interface Organization {
  id: string;
  name: string;
  plan: PlanType;
  owner_user_id: string;
  created_at: string;
}

export type PlanType = 'free' | 'starter' | 'pro' | 'enterprise' | 'agency_starter' | 'agency_growth' | 'agency_scale';

export interface Brand {
  id: string;
  org_id: string;
  brand_name: string;
  brand_url: string;
  market: string;
  language: string;
  logo_url: string | null;
  is_sample: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  org_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
}

export interface Topic {
  id: string;
  brand_id: string;
  name: string;
  created_at: string;
}

export interface Prompt {
  id: string;
  brand_id: string;
  topic_id: string | null;
  prompt_text: string;
  estimated_volume: number;
  tags: string[];
  market: string;
  language: string;
  is_active: boolean;
  created_at: string;
}

export interface Competitor {
  id: string;
  brand_id: string;
  competitor_name: string;
  created_at: string;
}

export interface AnalysisRun {
  id: string;
  brand_id: string;
  started_at: string;
  completed_at: string | null;
  status: 'queued' | 'running' | 'complete' | 'failed';
  prompt_count: number;
  models: string[];
  is_sample: boolean;
}

export interface AnalysisResult {
  id: string;
  run_id: string;
  prompt_id: string;
  llm_model: LLMModel;
  brand_mentioned: boolean;
  brand_position: number | null;
  sentiment: Sentiment;
  raw_response: string;
  competitor_mentions: CompetitorMention[];
  created_at: string;
}

export type LLMModel = 'chatgpt' | 'gemini' | 'perplexity' | 'grok' | 'ai_overviews';

export type Sentiment = 'positive' | 'neutral' | 'negative' | null;

export interface CompetitorMention {
  name: string;
  position: number;
  sentiment?: Sentiment;
}

export interface CitedSource {
  id: string;
  run_id: string;
  prompt_id: string;
  llm_model: string;
  url: string;
  domain: string;
  content_type: string | null;
  is_brand_owned: boolean;
  citation_count: number;
  created_at: string;
}

export interface SerpQuery {
  id: string;
  run_id: string;
  prompt_id: string;
  llm_model: string;
  original_prompt: string;
  web_search_query: string;
  created_at: string;
}

export interface ContentGeneration {
  id: string;
  brand_id: string;
  brief: string;
  title: string | null;
  output: string | null;
  source_prompt_id: string | null;
  created_at: string;
}

export interface LLMQueryResult {
  model: string;
  promptId: string;
  brandMentioned: boolean;
  brandPosition: number | null;
  sentiment: Sentiment;
  rawResponse: string;
  citedSources: { url: string; domain: string }[];
  serpQueries: string[];
  competitorMentions: CompetitorMention[];
}

export interface AutoGenerateResult {
  brandName: string;
  industry: string;
  topics: {
    name: string;
    prompts: {
      text: string;
      tags: string[];
      estimatedVolume: number;
    }[];
  }[];
  competitors: string[];
}

export const PLAN_LIMITS: Record<PlanType, { prompts: number; models: number; frequency: string; brands: number; languages: number }> = {
  free:           { prompts: 10,  models: 3, frequency: 'weekly', brands: 1,  languages: 1 },
  starter:        { prompts: 50,  models: 3, frequency: 'daily',  brands: 1,  languages: 2 },
  pro:            { prompts: 150, models: 5, frequency: 'daily',  brands: 3,  languages: 5 },
  agency_starter: { prompts: 111, models: 5, frequency: 'daily',  brands: 3,  languages: 5 },
  agency_growth:  { prompts: 277, models: 5, frequency: 'daily',  brands: 10, languages: 5 },
  agency_scale:   { prompts: 722, models: 5, frequency: 'daily',  brands: 25, languages: 5 },
  enterprise:     { prompts: -1,  models: -1, frequency: 'daily', brands: -1, languages: -1 },
};
