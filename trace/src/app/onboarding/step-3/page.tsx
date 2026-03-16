"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, TrendingUp, Eye, MessageSquare, ExternalLink, Shield } from "lucide-react";

interface GlimpseResult {
  promptText: string;
  promptId: string;
  chatgpt: {
    brandMentioned: boolean;
    brandPosition: number | null;
    sentiment: string | null;
    rawResponse: string;
    citedSources: { url: string; domain: string }[];
    competitorMentions: { name: string; position: number }[];
  } | null;
  gemini: {
    brandMentioned: boolean;
    brandPosition: number | null;
    sentiment: string | null;
    rawResponse: string;
    citedSources: { url: string; domain: string }[];
    competitorMentions: { name: string; position: number }[];
  } | null;
}

interface Summary {
  brandPresence: number;
  totalMentions: number;
  totalQueries: number;
  sentiment: { positive: number; neutral: number; negative: number };
  topSources: string[];
  topCompetitors: { name: string; mentions: number }[];
}

function StepIndicator({ current }: { current: number }) {
  const steps = [
    { num: 1, label: "Brand" },
    { num: 2, label: "Prompts" },
    { num: 3, label: "Preview" },
    { num: 4, label: "Start" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 36 }}>
      {steps.map((step, i) => (
        <div key={step.num} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 600,
              background: step.num <= current ? "#EF4623" : "#E8EAEB",
              color: step.num <= current ? "#fff" : "#8A9BA3",
            }}>
              {step.num < current ? "\u2713" : step.num}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: step.num <= current ? "#2D3B42" : "#8A9BA3" }}>{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 36, height: 1, background: step.num < current ? "#EF4623" : "#E8EAEB" }} />
          )}
        </div>
      ))}
    </div>
  );
}

function SentimentDot({ sentiment }: { sentiment: string | null }) {
  const color = sentiment === "positive" ? "#047857" : sentiment === "negative" ? "#DC2626" : "#8A9BA3";
  const label = sentiment === "positive" ? "Positive" : sentiment === "negative" ? "Negative" : "Neutral";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color, fontWeight: 600 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />
      {label}
    </span>
  );
}

export default function Step3Glimpse() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<GlimpseResult[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [brandName, setBrandName] = useState("");

  useEffect(() => {
    const runGlimpse = async () => {
      try {
        const raw = localStorage.getItem("trace_onboarding");
        if (!raw) {
          router.replace("/onboarding/step-1");
          return;
        }
        const data = JSON.parse(raw);
        setBrandName(data.brandName || "");

        // Collect checked prompts across all topics
        const allPrompts: { text: string; id: string }[] = [];
        if (data.topics) {
          for (const topic of data.topics) {
            for (const prompt of topic.prompts || []) {
              allPrompts.push({ text: prompt.text, id: `glimpse-${allPrompts.length}` });
            }
          }
        }

        if (allPrompts.length === 0) {
          router.replace("/onboarding/step-2");
          return;
        }

        // Animate progress
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) { clearInterval(progressInterval); return 90; }
            return prev + Math.random() * 15;
          });
        }, 800);

        const res = await fetch("/api/onboarding/glimpse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompts: allPrompts.slice(0, 3),
            brandName: data.brandName,
            competitors: data.competitors || [],
          }),
        });

        clearInterval(progressInterval);

        if (!res.ok) {
          throw new Error("Analysis failed");
        }

        const result = await res.json();
        setProgress(100);

        // Short delay for the animation to complete
        await new Promise(r => setTimeout(r, 500));
        setResults(result.results || []);
        setSummary(result.summary || null);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setLoading(false);
      }
    };

    runGlimpse();
  }, [router]);

  if (loading) {
    return (
      <div style={{ fontFamily: "'Manrope', sans-serif", maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <StepIndicator current={3} />

        <div style={{ marginTop: 40 }}>
          <Loader2 style={{ width: 40, height: 40, color: "#EF4623", margin: "0 auto 20px", animation: "spin 1s linear infinite" }} />
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: "#2D3B42", marginBottom: 8 }}>
            Analysing your brand visibility
          </h2>
          <p style={{ fontSize: 14, color: "#8A9BA3", marginBottom: 32, lineHeight: 1.6 }}>
            We&apos;re querying ChatGPT and Gemini with your prompts to see how {brandName || "your brand"} appears in AI responses...
          </p>

          {/* Progress bar */}
          <div style={{ maxWidth: 320, margin: "0 auto" }}>
            <div style={{ height: 6, background: "#E8EAEB", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                height: "100%", background: "linear-gradient(90deg, #EF4623, #FF6B4A)",
                borderRadius: 3, transition: "width 0.5s ease",
                width: `${Math.min(progress, 100)}%`,
              }} />
            </div>
            <p style={{ fontSize: 11, color: "#8A9BA3", marginTop: 8 }}>
              {progress < 30 ? "Querying ChatGPT..." : progress < 60 ? "Querying Gemini..." : progress < 90 ? "Analyzing responses..." : "Almost done..."}
            </p>
          </div>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ fontFamily: "'Manrope', sans-serif", maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <StepIndicator current={3} />
        <div style={{ marginTop: 40, padding: 24, background: "#FEF2F2", borderRadius: 12 }}>
          <p style={{ color: "#DC2626", fontSize: 14, marginBottom: 16 }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: "10px 24px", background: "#EF4623", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Manrope', sans-serif" }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const presenceColor = (summary?.brandPresence ?? 0) >= 60 ? "#047857" : (summary?.brandPresence ?? 0) >= 30 ? "#D97706" : "#DC2626";

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", maxWidth: 720, margin: "0 auto" }}>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <StepIndicator current={3} />

      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: "#2D3B42", marginBottom: 6 }}>
          Here&apos;s a preview of your AI visibility
        </h1>
        <p style={{ fontSize: 14, color: "#8A9BA3", lineHeight: 1.6 }}>
          We queried ChatGPT and Gemini with {results.length} of your prompts. Here&apos;s what we found.
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
        {/* Brand presence */}
        <div style={{ padding: "20px 16px", background: "#FAFAFA", borderRadius: 12, border: "1px solid #E8EAEB", textAlign: "center" }}>
          <Eye style={{ width: 20, height: 20, color: "#8A9BA3", margin: "0 auto 8px" }} />
          <div style={{ fontSize: 32, fontWeight: 700, color: presenceColor, fontFamily: "'Instrument Serif', serif" }}>
            {summary?.brandPresence ?? 0}%
          </div>
          <div style={{ fontSize: 11, color: "#8A9BA3", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Brand Presence
          </div>
        </div>

        {/* Sentiment */}
        <div style={{ padding: "20px 16px", background: "#FAFAFA", borderRadius: 12, border: "1px solid #E8EAEB", textAlign: "center" }}>
          <MessageSquare style={{ width: 20, height: 20, color: "#8A9BA3", margin: "0 auto 8px" }} />
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#047857" }}>{summary?.sentiment.positive ?? 0}</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#8A9BA3" }}>{summary?.sentiment.neutral ?? 0}</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#DC2626" }}>{summary?.sentiment.negative ?? 0}</span>
          </div>
          <div style={{ fontSize: 11, color: "#8A9BA3", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Sentiment
          </div>
        </div>

        {/* Competitors */}
        <div style={{ padding: "20px 16px", background: "#FAFAFA", borderRadius: 12, border: "1px solid #E8EAEB", textAlign: "center" }}>
          <TrendingUp style={{ width: 20, height: 20, color: "#8A9BA3", margin: "0 auto 8px" }} />
          <div style={{ fontSize: 32, fontWeight: 700, color: "#2D3B42", fontFamily: "'Instrument Serif', serif" }}>
            {summary?.topCompetitors.length ?? 0}
          </div>
          <div style={{ fontSize: 11, color: "#8A9BA3", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Competitors Found
          </div>
        </div>
      </div>

      {/* Prompt results detail */}
      <div style={{ border: "1px solid #E8EAEB", borderRadius: 12, overflow: "hidden", marginBottom: 24 }}>
        <div style={{ padding: "12px 16px", background: "#FAFAFA", borderBottom: "1px solid #E8EAEB" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#2D3B42" }}>Prompt Analysis Preview</span>
        </div>
        {results.map((r, i) => (
          <div key={i} style={{ padding: "14px 16px", borderBottom: i < results.length - 1 ? "1px solid #F0F0F4" : "none" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#2D3B42", marginBottom: 10, lineHeight: 1.4 }}>
              &ldquo;{r.promptText}&rdquo;
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {/* ChatGPT result */}
              <div style={{ padding: "10px 12px", background: "#F9FAFB", borderRadius: 8, border: "1px solid #E8EAEB" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#2D3B42" }}>ChatGPT</span>
                  {r.chatgpt ? (
                    r.chatgpt.brandMentioned ? (
                      <span style={{ fontSize: 10, fontWeight: 600, color: "#047857", background: "#ECFDF5", padding: "2px 6px", borderRadius: 4 }}>
                        Mentioned #{r.chatgpt.brandPosition}
                      </span>
                    ) : (
                      <span style={{ fontSize: 10, fontWeight: 600, color: "#DC2626", background: "#FEF2F2", padding: "2px 6px", borderRadius: 4 }}>
                        Not mentioned
                      </span>
                    )
                  ) : (
                    <span style={{ fontSize: 10, color: "#8A9BA3" }}>Error</span>
                  )}
                </div>
                {r.chatgpt && <SentimentDot sentiment={r.chatgpt.sentiment} />}
                {r.chatgpt && r.chatgpt.citedSources.length > 0 && (
                  <div style={{ marginTop: 6 }}>
                    <span style={{ fontSize: 10, color: "#8A9BA3" }}>
                      {r.chatgpt.citedSources.length} source{r.chatgpt.citedSources.length > 1 ? "s" : ""} cited
                    </span>
                  </div>
                )}
              </div>

              {/* Gemini result */}
              <div style={{ padding: "10px 12px", background: "#F9FAFB", borderRadius: 8, border: "1px solid #E8EAEB" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#2D3B42" }}>Gemini</span>
                  {r.gemini ? (
                    r.gemini.brandMentioned ? (
                      <span style={{ fontSize: 10, fontWeight: 600, color: "#047857", background: "#ECFDF5", padding: "2px 6px", borderRadius: 4 }}>
                        Mentioned #{r.gemini.brandPosition}
                      </span>
                    ) : (
                      <span style={{ fontSize: 10, fontWeight: 600, color: "#DC2626", background: "#FEF2F2", padding: "2px 6px", borderRadius: 4 }}>
                        Not mentioned
                      </span>
                    )
                  ) : (
                    <span style={{ fontSize: 10, color: "#8A9BA3" }}>Error</span>
                  )}
                </div>
                {r.gemini && <SentimentDot sentiment={r.gemini.sentiment} />}
                {r.gemini && r.gemini.citedSources.length > 0 && (
                  <div style={{ marginTop: 6 }}>
                    <span style={{ fontSize: 10, color: "#8A9BA3" }}>
                      {r.gemini.citedSources.length} source{r.gemini.citedSources.length > 1 ? "s" : ""} cited
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Blurred teaser - "more data available" */}
      <div style={{
        position: "relative", padding: "20px 16px", background: "#FAFAFA",
        borderRadius: 12, border: "1px solid #E8EAEB", marginBottom: 24,
        overflow: "hidden",
      }}>
        <div style={{ filter: "blur(4px)", opacity: 0.5, pointerEvents: "none" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 8 }}>
            {["Perplexity", "Grok", "AI Overviews", "Claude", "Meta AI"].map(name => (
              <div key={name} style={{ padding: "12px 8px", background: "#fff", borderRadius: 8, textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#2D3B42", marginBottom: 4 }}>{name}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#047857" }}>{Math.floor(Math.random() * 80 + 20)}%</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(255,255,255,0.6)", backdropFilter: "blur(2px)",
        }}>
          <div style={{ textAlign: "center" }}>
            <Shield style={{ width: 20, height: 20, color: "#EF4623", margin: "0 auto 8px" }} />
            <p style={{ fontSize: 13, fontWeight: 600, color: "#2D3B42" }}>
              Unlock all 5 AI engines + daily tracking
            </p>
            <p style={{ fontSize: 12, color: "#8A9BA3" }}>
              Start your free trial to see the full picture
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => router.push("/onboarding/step-4")}
        style={{
          width: "100%", padding: "14px", background: "#EF4623",
          color: "#fff", border: "none", borderRadius: 10,
          fontSize: 15, fontWeight: 600, cursor: "pointer",
          fontFamily: "'Manrope', sans-serif", transition: "all 0.2s",
        }}
      >
        Continue to start your free trial
      </button>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
