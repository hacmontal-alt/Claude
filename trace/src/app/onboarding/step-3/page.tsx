"use client";

import { useState, useEffect } from "react";
import { Loader2, Check } from "lucide-react";

const LLM_MODELS = [
  { key: "chatgpt", name: "ChatGPT", icon: "🟢", color: "#10a37f" },
  { key: "gemini", name: "Gemini", icon: "🔵", color: "#4285f4" },
  { key: "perplexity", name: "Perplexity", icon: "🟣", color: "#7c3aed" },
  { key: "grok", name: "Grok", icon: "⚫", color: "#2D3B42" },
  { key: "ai_overviews", name: "AI Overviews", icon: "🔴", color: "#ea4335" },
];

interface ModelStatus {
  key: string;
  name: string;
  icon: string;
  color: string;
  status: "waiting" | "querying" | "done";
  result?: { mentioned: boolean; position: number | null; sentiment: string };
}

const SAMPLE_RESULTS = [
  { mentioned: true, position: 2, sentiment: "Positive" },
  { mentioned: true, position: 4, sentiment: "Neutral" },
  { mentioned: true, position: 1, sentiment: "Positive" },
  { mentioned: false, position: null, sentiment: "—" },
  { mentioned: true, position: 3, sentiment: "Positive" },
];

function StepIndicator({ current }: { current: number }) {
  const steps = [
    { num: 1, label: "Brand" },
    { num: 2, label: "Prompts" },
    { num: 3, label: "Setup" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 48 }}>
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
              {step.num < current ? "✓" : step.num}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: step.num <= current ? "#2D3B42" : "#8A9BA3" }}>{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 48, height: 1, background: step.num < current ? "#EF4623" : "#E8EAEB" }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Step3() {
  const [models, setModels] = useState<ModelStatus[]>(
    LLM_MODELS.map(m => ({ ...m, status: "waiting" }))
  );
  const [completedCount, setCompletedCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    // Timer
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate each model querying sequentially with staggered timing
    const delays = [1500, 4000, 7500, 11000, 15000]; // ms before each model starts
    const durations = [2000, 3000, 3500, 3000, 2500]; // ms each model takes

    LLM_MODELS.forEach((_, i) => {
      // Start querying
      setTimeout(() => {
        setModels(prev => prev.map((m, j) => j === i ? { ...m, status: "querying" } : m));
      }, delays[i]);

      // Complete
      setTimeout(() => {
        setModels(prev => prev.map((m, j) => j === i ? { ...m, status: "done", result: SAMPLE_RESULTS[i] } : m));
        setCompletedCount(prev => prev + 1);
      }, delays[i] + durations[i]);
    });
  }, []);

  // Redirect when all done
  useEffect(() => {
    if (completedCount === LLM_MODELS.length) {
      const timer = setTimeout(() => {
        window.location.href = "/dashboard";
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [completedCount]);

  // Max 90 second timeout
  useEffect(() => {
    if (elapsedSeconds >= 90) {
      window.location.href = "/dashboard";
    }
  }, [elapsedSeconds]);

  const allDone = completedCount === LLM_MODELS.length;

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <StepIndicator current={3} />

      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: "#2D3B42", marginBottom: 8 }}>
          {allDone ? "Your dashboard is ready!" : "Running your first analysis..."}
        </h1>
        <p style={{ fontSize: 14, color: "#8A9BA3", lineHeight: 1.6 }}>
          {allDone
            ? "We found your brand across AI engines. Redirecting to your dashboard..."
            : "We're querying each AI engine with your prompts. This usually takes about 20 seconds."
          }
        </p>
      </div>

      {/* Model progress */}
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        {models.map((model) => (
          <div
            key={model.key}
            style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "14px 18px", marginBottom: 8,
              background: model.status === "done" ? "#fff" : model.status === "querying" ? "#FDF1EE" : "#FAFAFA",
              border: `1px solid ${model.status === "done" ? "#E8EAEB" : model.status === "querying" ? "#EF4623" + "22" : "#E8EAEB"}`,
              borderRadius: 12,
              transition: "all 0.3s",
            }}
          >
            {/* Icon */}
            <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{model.icon}</span>

            {/* Name + status text */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#2D3B42" }}>{model.name}</span>
                {model.status === "querying" && (
                  <span style={{ fontSize: 12, color: "#EF4623", fontWeight: 500 }}>Querying...</span>
                )}
                {model.status === "done" && (
                  <span style={{ fontSize: 12, color: "#047857", fontWeight: 500 }}>✓ Done</span>
                )}
                {model.status === "waiting" && (
                  <span style={{ fontSize: 12, color: "#8A9BA3" }}>Waiting</span>
                )}
              </div>

              {/* Result teaser */}
              {model.status === "done" && model.result && (
                <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                    background: model.result.mentioned ? "#ECFDF5" : "#FEF2F2",
                    color: model.result.mentioned ? "#047857" : "#DC2626",
                  }}>
                    {model.result.mentioned ? "✓ Mentioned" : "✗ Not mentioned"}
                  </span>
                  {model.result.position && (
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "#FDF1EE", color: "#EF4623" }}>
                      Position #{model.result.position}
                    </span>
                  )}
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "#F0F0F4", color: "#4A5D66" }}>
                    {model.result.sentiment}
                  </span>
                </div>
              )}
            </div>

            {/* Status icon */}
            <div style={{ width: 24, display: "flex", justifyContent: "center" }}>
              {model.status === "waiting" && (
                <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid #E8EAEB" }} />
              )}
              {model.status === "querying" && (
                <Loader2 style={{ width: 18, height: 18, color: "#EF4623", animation: "spin 1s linear infinite" }} />
              )}
              {model.status === "done" && (
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#047857", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check style={{ width: 12, height: 12, color: "#fff" }} />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Overall progress */}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <div style={{ height: 4, background: "#E8EAEB", borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
            <div style={{
              height: "100%", borderRadius: 2, transition: "width 0.5s",
              background: allDone ? "#047857" : "#EF4623",
              width: `${(completedCount / LLM_MODELS.length) * 100}%`,
            }} />
          </div>
          <span style={{ fontSize: 12, color: "#8A9BA3" }}>
            {completedCount}/{LLM_MODELS.length} engines complete · {elapsedSeconds}s elapsed
          </span>
        </div>

        {/* Live data teaser */}
        {completedCount >= 2 && (
          <div style={{
            marginTop: 24, padding: 18,
            background: "#FDF1EE", border: "1px solid #EF4623" + "15",
            borderRadius: 12,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#EF4623", marginBottom: 12 }}>
              Early results
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div style={{ background: "#fff", borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#2D3B42", fontFamily: "'Instrument Serif', serif" }}>
                  {Math.round((completedCount / LLM_MODELS.length) * 74)}%
                </div>
                <div style={{ fontSize: 10, color: "#8A9BA3", marginTop: 2 }}>Visibility</div>
              </div>
              <div style={{ background: "#fff", borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#2D3B42", fontFamily: "'Instrument Serif', serif" }}>
                  #2.5
                </div>
                <div style={{ fontSize: 10, color: "#8A9BA3", marginTop: 2 }}>Avg Position</div>
              </div>
              <div style={{ background: "#fff", borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#047857", fontFamily: "'Instrument Serif', serif" }}>
                  80%
                </div>
                <div style={{ fontSize: 10, color: "#8A9BA3", marginTop: 2 }}>Positive</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
