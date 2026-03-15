"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Globe,
  Loader2,
  Check,
  X,
  Plus,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Prompt {
  id: string;
  text: string;
  volume: string;
  checked: boolean;
}

interface Topic {
  id: string;
  name: string;
  checked: boolean;
  expanded: boolean;
  prompts: Prompt[];
}

// ── Mock data ──────────────────────────────────────────────────────────────────

const MARKETS = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "es", label: "Spain" },
  { value: "it", label: "Italy" },
  { value: "nl", label: "Netherlands" },
  { value: "au", label: "Australia" },
  { value: "ca", label: "Canada" },
  { value: "jp", label: "Japan" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "de", label: "German" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
  { value: "it", label: "Italian" },
  { value: "nl", label: "Dutch" },
  { value: "pt", label: "Portuguese" },
  { value: "ja", label: "Japanese" },
];

const MOCK_TOPICS: Topic[] = [
  {
    id: "t1",
    name: "Product Features",
    checked: true,
    expanded: false,
    prompts: [
      { id: "p1", text: "What are the best tools for brand monitoring?", volume: "1.2K", checked: true },
      { id: "p2", text: "How does AI brand tracking work?", volume: "890", checked: true },
      { id: "p3", text: "What features should a brand monitoring tool have?", volume: "650", checked: true },
    ],
  },
  {
    id: "t2",
    name: "Competitor Comparison",
    checked: true,
    expanded: false,
    prompts: [
      { id: "p4", text: "Best brand monitoring tools compared", volume: "2.1K", checked: true },
      { id: "p5", text: "Which AI search tracking tool is the best?", volume: "1.5K", checked: true },
    ],
  },
  {
    id: "t3",
    name: "Industry Trends",
    checked: true,
    expanded: false,
    prompts: [
      { id: "p6", text: "How is AI changing search behavior?", volume: "3.4K", checked: true },
      { id: "p7", text: "What is GEO (Generative Engine Optimization)?", volume: "2.8K", checked: true },
      { id: "p8", text: "Will AI replace traditional SEO?", volume: "1.9K", checked: true },
    ],
  },
  {
    id: "t4",
    name: "Use Cases",
    checked: true,
    expanded: false,
    prompts: [
      { id: "p9", text: "How to track brand mentions in AI responses?", volume: "1.1K", checked: true },
      { id: "p10", text: "How to improve brand visibility in ChatGPT?", volume: "980", checked: true },
    ],
  },
  {
    id: "t5",
    name: "Pricing & Plans",
    checked: false,
    expanded: false,
    prompts: [
      { id: "p11", text: "How much does AI brand monitoring cost?", volume: "720", checked: false },
      { id: "p12", text: "Free AI brand monitoring tools", volume: "1.8K", checked: false },
    ],
  },
];

const MOCK_COMPETITORS = ["Brandwatch", "Semrush", "Ahrefs", "Moz"];

const LLM_MODELS = [
  { name: "ChatGPT", icon: "🟢" },
  { name: "Gemini", icon: "🔵" },
  { name: "Perplexity", icon: "🟣" },
  { name: "Grok", icon: "⚫" },
  { name: "AI Overviews", icon: "🔴" },
];

const PROGRESS_MESSAGES = [
  "Creating brand profile...",
  "Setting up topics...",
  "Configuring prompts...",
  "Queuing first analysis...",
  "Done!",
];

// ── Step indicator ─────────────────────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: "Brand" },
    { num: 2, label: "Topics" },
    { num: 3, label: "Setup" },
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                currentStep >= step.num
                  ? "bg-coral text-white"
                  : "bg-border text-ink-light"
              }`}
            >
              {currentStep > step.num ? (
                <Check className="w-4 h-4" />
              ) : (
                step.num
              )}
            </div>
            <span
              className={`text-sm font-medium transition-colors ${
                currentStep >= step.num ? "text-ink" : "text-ink-light"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-12 h-px mx-1 transition-colors ${
                currentStep > step.num ? "bg-coral" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Step 1: Brand URL ──────────────────────────────────────────────────────────

function Step1({
  url,
  setUrl,
  market,
  setMarket,
  language,
  setLanguage,
  onContinue,
}: {
  url: string;
  setUrl: (v: string) => void;
  market: string;
  setMarket: (v: string) => void;
  language: string;
  setLanguage: (v: string) => void;
  onContinue: () => void;
}) {
  const isValid = url.trim().length > 0;

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl text-ink mb-3">
          Let&apos;s set up your brand
        </h1>
        <p className="text-ink-muted text-base leading-relaxed max-w-md mx-auto">
          Enter your website URL and we&apos;ll automatically detect your brand
          and generate tracking prompts.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">
            Website URL
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-light" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourbrand.com"
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-md text-sm text-ink placeholder:text-ink-light focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-colors bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
              Market
            </label>
            <select
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-md text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-colors appearance-none cursor-pointer"
            >
              {MARKETS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-md text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-colors appearance-none cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={onContinue}
          disabled={!isValid}
          className="w-full py-2.5 bg-coral text-white rounded-md font-semibold text-sm hover:bg-coral/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-2"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// ── Step 2: Review topics & prompts ────────────────────────────────────────────

function Step2({
  onStartTracking,
}: {
  onStartTracking: () => void;
}) {
  const [generating, setGenerating] = useState(true);
  const [brandName, setBrandName] = useState("Your Brand");
  const [industry, setIndustry] = useState("Technology");
  const [topics, setTopics] = useState<Topic[]>(MOCK_TOPICS);
  const [competitors, setCompetitors] = useState<string[]>(MOCK_COMPETITORS);
  const [newCompetitor, setNewCompetitor] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setGenerating(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const toggleTopic = useCallback((topicId: string) => {
    setTopics((prev) =>
      prev.map((t) =>
        t.id === topicId
          ? {
              ...t,
              checked: !t.checked,
              prompts: t.prompts.map((p) => ({ ...p, checked: !t.checked })),
            }
          : t
      )
    );
  }, []);

  const toggleExpand = useCallback((topicId: string) => {
    setTopics((prev) =>
      prev.map((t) =>
        t.id === topicId ? { ...t, expanded: !t.expanded } : t
      )
    );
  }, []);

  const togglePrompt = useCallback((topicId: string, promptId: string) => {
    setTopics((prev) =>
      prev.map((t) =>
        t.id === topicId
          ? {
              ...t,
              prompts: t.prompts.map((p) =>
                p.id === promptId ? { ...p, checked: !p.checked } : p
              ),
            }
          : t
      )
    );
  }, []);

  const removeCompetitor = useCallback((index: number) => {
    setCompetitors((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addCompetitor = useCallback(() => {
    if (newCompetitor.trim()) {
      setCompetitors((prev) => [...prev, newCompetitor.trim()]);
      setNewCompetitor("");
    }
  }, [newCompetitor]);

  if (generating) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-coral animate-spin mb-5" />
        <h2 className="font-display text-2xl text-ink mb-2">
          Analyzing your brand...
        </h2>
        <p className="text-ink-muted text-sm">
          Generating topics and prompts based on your website
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl text-ink mb-2">
          Review your setup
        </h1>
        <p className="text-ink-muted text-sm">
          We detected the following from your website. Edit anything below.
        </p>
      </div>

      {/* Brand info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">
            Brand Name
          </label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">
            Industry
          </label>
          <input
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-colors"
          />
        </div>
      </div>

      {/* Topics & Prompts */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-ink">Topics & Prompts</h3>
          <button
            onClick={() => {
              const newId = `t${Date.now()}`;
              setTopics((prev) => [
                ...prev,
                {
                  id: newId,
                  name: "New Topic",
                  checked: true,
                  expanded: true,
                  prompts: [],
                },
              ]);
            }}
            className="flex items-center gap-1 text-xs font-medium text-coral hover:text-coral/80 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add topic
          </button>
        </div>

        <div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
          {topics.map((topic) => (
            <div key={topic.id}>
              {/* Topic row */}
              <div className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-bg/50 transition-colors">
                <input
                  type="checkbox"
                  checked={topic.checked}
                  onChange={() => toggleTopic(topic.id)}
                  className="w-4 h-4 rounded border-border text-coral accent-coral cursor-pointer"
                />
                <button
                  onClick={() => toggleExpand(topic.id)}
                  className="flex items-center gap-1 flex-1 text-left"
                >
                  {topic.expanded ? (
                    <ChevronDown className="w-4 h-4 text-ink-light" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-ink-light" />
                  )}
                  <span className="text-sm font-medium text-ink">
                    {topic.name}
                  </span>
                  <span className="text-xs text-ink-light ml-1">
                    ({topic.prompts.length} prompts)
                  </span>
                </button>
              </div>

              {/* Prompts under topic */}
              {topic.expanded && (
                <div className="bg-bg/30">
                  {topic.prompts.map((prompt) => (
                    <div
                      key={prompt.id}
                      className="flex items-center gap-3 px-4 py-2.5 pl-12 border-t border-border/50"
                    >
                      <input
                        type="checkbox"
                        checked={prompt.checked}
                        onChange={() => togglePrompt(topic.id, prompt.id)}
                        className="w-3.5 h-3.5 rounded border-border text-coral accent-coral cursor-pointer"
                      />
                      <span className="text-sm text-ink-muted flex-1">
                        {prompt.text}
                      </span>
                      <span className="text-xs font-medium text-ink-light bg-white border border-border rounded-full px-2 py-0.5">
                        {prompt.volume}
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newPromptId = `p${Date.now()}`;
                      setTopics((prev) =>
                        prev.map((t) =>
                          t.id === topic.id
                            ? {
                                ...t,
                                prompts: [
                                  ...t.prompts,
                                  {
                                    id: newPromptId,
                                    text: "New prompt",
                                    volume: "—",
                                    checked: true,
                                  },
                                ],
                              }
                            : t
                        )
                      );
                    }}
                    className="flex items-center gap-1 px-4 py-2 pl-12 text-xs font-medium text-coral hover:text-coral/80 transition-colors border-t border-border/50 w-full"
                  >
                    <Plus className="w-3 h-3" />
                    Add prompt
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Competitors */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-ink mb-3">Competitors</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {competitors.map((comp, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border rounded-full text-sm text-ink"
            >
              {comp}
              <button
                onClick={() => removeCompetitor(i)}
                className="text-ink-light hover:text-red transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCompetitor}
            onChange={(e) => setNewCompetitor(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCompetitor()}
            placeholder="Add competitor..."
            className="flex-1 px-3 py-2 border border-border rounded-md text-sm text-ink placeholder:text-ink-light bg-white focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-colors"
          />
          <button
            onClick={addCompetitor}
            disabled={!newCompetitor.trim()}
            className="px-3 py-2 border border-border rounded-md text-sm text-ink-muted hover:bg-bg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <button
        onClick={onStartTracking}
        className="w-full py-2.5 bg-coral text-white rounded-md font-semibold text-sm hover:bg-coral/90 transition-all"
      >
        Start Tracking
      </button>
    </div>
  );
}

// ── Step 3: Loading & progress ─────────────────────────────────────────────────

function Step3() {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [modelStatuses, setModelStatuses] = useState<
    ("pending" | "loading" | "done")[]
  >(LLM_MODELS.map(() => "pending"));

  useEffect(() => {
    // Animate progress from 0 to 100 over ~5 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Update messages based on progress
  useEffect(() => {
    if (progress < 20) setMessageIndex(0);
    else if (progress < 40) setMessageIndex(1);
    else if (progress < 60) setMessageIndex(2);
    else if (progress < 85) setMessageIndex(3);
    else setMessageIndex(4);
  }, [progress]);

  // Update model statuses based on progress
  useEffect(() => {
    setModelStatuses(
      LLM_MODELS.map((_, i) => {
        const threshold = 20 + i * 15;
        if (progress >= threshold + 15) return "done";
        if (progress >= threshold) return "loading";
        return "pending";
      })
    );
  }, [progress]);

  // Redirect when done
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <div className="flex flex-col items-center py-10">
      <h1 className="font-display text-3xl text-ink mb-2">
        Setting up your dashboard...
      </h1>
      <p className="text-ink-muted text-sm mb-10">
        {PROGRESS_MESSAGES[messageIndex]}
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-md mb-10">
        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-coral rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-ink-light text-right mt-1.5">{progress}%</p>
      </div>

      {/* Model statuses */}
      <div className="w-full max-w-sm space-y-3">
        {LLM_MODELS.map((model, i) => (
          <div
            key={model.name}
            className="flex items-center justify-between px-4 py-2.5 bg-white border border-border rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-base">{model.icon}</span>
              <span className="text-sm font-medium text-ink">{model.name}</span>
            </div>
            <div>
              {modelStatuses[i] === "pending" && (
                <span className="text-xs text-ink-light">Waiting</span>
              )}
              {modelStatuses[i] === "loading" && (
                <Loader2 className="w-4 h-4 text-coral animate-spin" />
              )}
              {modelStatuses[i] === "done" && (
                <Check className="w-4 h-4 text-green" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main onboarding page ───────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [url, setUrl] = useState("");
  const [market, setMarket] = useState("us");
  const [language, setLanguage] = useState("en");

  return (
    <div>
      <StepIndicator currentStep={step} />

      {step === 1 && (
        <Step1
          url={url}
          setUrl={setUrl}
          market={market}
          setMarket={setMarket}
          language={language}
          setLanguage={setLanguage}
          onContinue={() => setStep(2)}
        />
      )}

      {step === 2 && <Step2 onStartTracking={() => setStep(3)} />}

      {step === 3 && <Step3 />}
    </div>
  );
}
