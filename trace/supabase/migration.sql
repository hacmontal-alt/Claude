-- Trace App Database Schema
-- Supabase Migration

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE plan_type AS ENUM (
  'free', 'starter', 'pro', 'enterprise',
  'agency_starter', 'agency_growth', 'agency_scale'
);

CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member');

CREATE TYPE run_status AS ENUM ('queued', 'running', 'complete', 'failed');

CREATE TYPE llm_model AS ENUM ('chatgpt', 'gemini', 'perplexity', 'grok', 'ai_overviews');

CREATE TYPE sentiment_type AS ENUM ('positive', 'neutral', 'negative');

-- ============================================================
-- TABLES
-- ============================================================

-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  plan plan_type NOT NULL DEFAULT 'free',
  owner_user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Profiles
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Brands
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  brand_url TEXT NOT NULL,
  market TEXT NOT NULL DEFAULT 'US',
  language TEXT NOT NULL DEFAULT 'en',
  logo_url TEXT,
  is_sample BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Topics
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prompts
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  prompt_text TEXT NOT NULL,
  estimated_volume INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] NOT NULL DEFAULT '{}',
  market TEXT NOT NULL DEFAULT 'US',
  language TEXT NOT NULL DEFAULT 'en',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Competitors
CREATE TABLE competitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  competitor_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Analysis Runs
CREATE TABLE analysis_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  status run_status NOT NULL DEFAULT 'queued',
  prompt_count INTEGER NOT NULL DEFAULT 0,
  models TEXT[] NOT NULL DEFAULT '{}',
  is_sample BOOLEAN NOT NULL DEFAULT false
);

-- Analysis Results
CREATE TABLE analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id UUID NOT NULL REFERENCES analysis_runs(id) ON DELETE CASCADE,
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  llm_model llm_model NOT NULL,
  brand_mentioned BOOLEAN NOT NULL DEFAULT false,
  brand_position INTEGER,
  sentiment sentiment_type,
  raw_response TEXT NOT NULL DEFAULT '',
  competitor_mentions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cited Sources
CREATE TABLE cited_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id UUID NOT NULL REFERENCES analysis_runs(id) ON DELETE CASCADE,
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  llm_model TEXT NOT NULL,
  url TEXT NOT NULL,
  domain TEXT NOT NULL,
  content_type TEXT,
  is_brand_owned BOOLEAN NOT NULL DEFAULT false,
  citation_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SERP Queries
CREATE TABLE serp_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id UUID NOT NULL REFERENCES analysis_runs(id) ON DELETE CASCADE,
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  llm_model TEXT NOT NULL,
  original_prompt TEXT NOT NULL,
  web_search_query TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Content Generations
CREATE TABLE content_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  brief TEXT NOT NULL,
  title TEXT,
  output TEXT,
  source_prompt_id UUID REFERENCES prompts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_user_profiles_org_id ON user_profiles(org_id);
CREATE INDEX idx_brands_org_id ON brands(org_id);
CREATE INDEX idx_topics_brand_id ON topics(brand_id);
CREATE INDEX idx_prompts_brand_id ON prompts(brand_id);
CREATE INDEX idx_prompts_topic_id ON prompts(topic_id);
CREATE INDEX idx_competitors_brand_id ON competitors(brand_id);
CREATE INDEX idx_analysis_runs_brand_id ON analysis_runs(brand_id);
CREATE INDEX idx_analysis_runs_status ON analysis_runs(status);
CREATE INDEX idx_analysis_results_run_id ON analysis_results(run_id);
CREATE INDEX idx_analysis_results_prompt_id ON analysis_results(prompt_id);
CREATE INDEX idx_analysis_results_llm_model ON analysis_results(llm_model);
CREATE INDEX idx_cited_sources_run_id ON cited_sources(run_id);
CREATE INDEX idx_cited_sources_domain ON cited_sources(domain);
CREATE INDEX idx_serp_queries_run_id ON serp_queries(run_id);
CREATE INDEX idx_content_generations_brand_id ON content_generations(brand_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE cited_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE serp_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_generations ENABLE ROW LEVEL SECURITY;

-- Organizations: users can view their own org
CREATE POLICY "Users can view their own organization"
  ON organizations FOR SELECT
  USING (id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Owners can update their organization"
  ON organizations FOR UPDATE
  USING (owner_user_id = auth.uid());

-- User Profiles: users can view profiles in their org
CREATE POLICY "Users can view profiles in their org"
  ON user_profiles FOR SELECT
  USING (org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- Brands: org members can view brands
CREATE POLICY "Org members can view brands"
  ON brands FOR SELECT
  USING (org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Org members can insert brands"
  ON brands FOR INSERT
  WITH CHECK (org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Org members can update brands"
  ON brands FOR UPDATE
  USING (org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Org members can delete brands"
  ON brands FOR DELETE
  USING (org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid()));

-- Topics: access via brand ownership
CREATE POLICY "Org members can view topics"
  ON topics FOR SELECT
  USING (brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Org members can insert topics"
  ON topics FOR INSERT
  WITH CHECK (brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Org members can update topics"
  ON topics FOR UPDATE
  USING (brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Org members can delete topics"
  ON topics FOR DELETE
  USING (brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())));

-- Prompts: access via brand ownership
CREATE POLICY "Org members can view prompts"
  ON prompts FOR SELECT
  USING (brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Org members can insert prompts"
  ON prompts FOR INSERT
  WITH CHECK (brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Org members can update prompts"
  ON prompts FOR UPDATE
  USING (brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Org members can delete prompts"
  ON prompts FOR DELETE
  USING (brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())));

-- Competitors: access via brand ownership
CREATE POLICY "Org members can view competitors"
  ON competitors FOR SELECT
  USING (brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Org members can insert competitors"
  ON competitors FOR INSERT
  WITH CHECK (brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Org members can update competitors"
  ON competitors FOR UPDATE
  USING (brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Org members can delete competitors"
  ON competitors FOR DELETE
  USING (brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())));

-- Analysis Runs: access via brand ownership
CREATE POLICY "Org members can view analysis runs"
  ON analysis_runs FOR SELECT
  USING (brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Org members can insert analysis runs"
  ON analysis_runs FOR INSERT
  WITH CHECK (brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())));

-- Analysis Results: access via run ownership
CREATE POLICY "Org members can view analysis results"
  ON analysis_results FOR SELECT
  USING (run_id IN (SELECT id FROM analysis_runs WHERE brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid()))));

CREATE POLICY "Org members can insert analysis results"
  ON analysis_results FOR INSERT
  WITH CHECK (run_id IN (SELECT id FROM analysis_runs WHERE brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid()))));

-- Cited Sources: access via run ownership
CREATE POLICY "Org members can view cited sources"
  ON cited_sources FOR SELECT
  USING (run_id IN (SELECT id FROM analysis_runs WHERE brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid()))));

CREATE POLICY "Org members can insert cited sources"
  ON cited_sources FOR INSERT
  WITH CHECK (run_id IN (SELECT id FROM analysis_runs WHERE brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid()))));

-- SERP Queries: access via run ownership
CREATE POLICY "Org members can view serp queries"
  ON serp_queries FOR SELECT
  USING (run_id IN (SELECT id FROM analysis_runs WHERE brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid()))));

CREATE POLICY "Org members can insert serp queries"
  ON serp_queries FOR INSERT
  WITH CHECK (run_id IN (SELECT id FROM analysis_runs WHERE brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid()))));

-- Content Generations: access via brand ownership
CREATE POLICY "Org members can view content generations"
  ON content_generations FOR SELECT
  USING (brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Org members can insert content generations"
  ON content_generations FOR INSERT
  WITH CHECK (brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Org members can update content generations"
  ON content_generations FOR UPDATE
  USING (brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())));

CREATE POLICY "Org members can delete content generations"
  ON content_generations FOR DELETE
  USING (brand_id IN (SELECT id FROM brands WHERE org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())));
