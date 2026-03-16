"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Zap, BarChart3, Globe, Bell } from "lucide-react";

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

const FEATURES = [
  { icon: BarChart3, text: "Track brand mentions across ChatGPT, Gemini, Perplexity, Grok & AI Overviews" },
  { icon: Globe, text: "Monitor cited sources and understand where AI engines pull data from" },
  { icon: Zap, text: "Get daily analysis with sentiment tracking and competitor benchmarking" },
  { icon: Bell, text: "Receive alerts when your brand visibility changes significantly" },
];

export default function Step4Paywall() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartTrial = async () => {
    setSaving(true);
    setError(null);

    try {
      const raw = localStorage.getItem("trace_onboarding");
      if (!raw) {
        router.replace("/onboarding/step-1");
        return;
      }
      const data = JSON.parse(raw);

      // Save everything to the database
      const res = await fetch("/api/onboarding/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: data.brandName,
          brandUrl: data.brandUrl,
          market: data.market,
          language: data.language,
          topics: data.topics,
          competitors: data.competitors,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save data");
      }

      const result = await res.json();

      // Save brand/org IDs for the dashboard
      localStorage.setItem("trace_brand_id", result.brandId);
      localStorage.setItem("trace_org_id", result.orgId);

      // Clean up onboarding data
      localStorage.removeItem("trace_onboarding");

      router.push("/overview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", maxWidth: 520, margin: "0 auto" }}>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <StepIndicator current={4} />

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: "#2D3B42", marginBottom: 8 }}>
          Start your free trial
        </h1>
        <p style={{ fontSize: 14, color: "#8A9BA3", lineHeight: 1.6 }}>
          Get full access to Trace for 7 days. No credit card required.
        </p>
      </div>

      {/* Plan card */}
      <div style={{
        border: "2px solid #EF4623", borderRadius: 16, overflow: "hidden", marginBottom: 24,
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #EF4623, #FF6B4A)", padding: "20px 24px",
          color: "#fff",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, opacity: 0.9, marginBottom: 4 }}>
                Pro Plan
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 36, fontWeight: 700, fontFamily: "'Instrument Serif', serif" }}>$79</span>
                <span style={{ fontSize: 14, opacity: 0.8 }}>/month</span>
              </div>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.2)", padding: "6px 14px",
              borderRadius: 20, fontSize: 12, fontWeight: 700,
            }}>
              7 days free
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{ padding: "20px 24px" }}>
          {FEATURES.map((feature, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < FEATURES.length - 1 ? 16 : 0, alignItems: "flex-start" }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: "#FDF1EE", display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <feature.icon style={{ width: 14, height: 14, color: "#EF4623" }} />
              </div>
              <span style={{ fontSize: 13, color: "#2D3B42", lineHeight: 1.5, paddingTop: 4 }}>
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* Plan details */}
        <div style={{ padding: "16px 24px", background: "#FAFAFA", borderTop: "1px solid #E8EAEB" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#2D3B42" }}>150</div>
              <div style={{ fontSize: 10, color: "#8A9BA3", fontWeight: 600, textTransform: "uppercase" }}>Prompts</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#2D3B42" }}>5</div>
              <div style={{ fontSize: 10, color: "#8A9BA3", fontWeight: 600, textTransform: "uppercase" }}>AI Engines</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#2D3B42" }}>Daily</div>
              <div style={{ fontSize: 10, color: "#8A9BA3", fontWeight: 600, textTransform: "uppercase" }}>Tracking</div>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginBottom: 16, padding: "10px 14px",
          background: "#FEF2F2", border: "1px solid rgba(220,38,38,0.1)",
          borderRadius: 8, fontSize: 13, color: "#DC2626",
        }}>
          {error}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleStartTrial}
        disabled={saving}
        style={{
          width: "100%", padding: "14px", background: saving ? "#8A9BA3" : "#EF4623",
          color: "#fff", border: "none", borderRadius: 10,
          fontSize: 15, fontWeight: 600,
          cursor: saving ? "not-allowed" : "pointer",
          fontFamily: "'Manrope', sans-serif",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          transition: "all 0.2s",
        }}
      >
        {saving && <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />}
        {saving ? "Setting up your account..." : "Start 7-day free trial"}
      </button>

      <p style={{ textAlign: "center", fontSize: 11, color: "#8A9BA3", marginTop: 12, lineHeight: 1.5 }}>
        No credit card required. Cancel anytime during your trial.
      </p>

      {/* Skip for now */}
      <button
        onClick={() => router.push("/overview")}
        style={{
          width: "100%", padding: "12px", marginTop: 8,
          background: "transparent", color: "#8A9BA3",
          border: "none", fontSize: 13, cursor: "pointer",
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        Skip for now and explore with sample data
      </button>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
