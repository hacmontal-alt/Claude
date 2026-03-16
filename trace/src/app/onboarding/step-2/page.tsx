"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";

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
  prompts: Prompt[];
}

function formatVolume(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(v);
}

function buildTopicsFromData(
  data: { name: string; prompts: { text: string; tags: string[]; estimatedVolume: number }[] }[]
): Topic[] {
  return data.map((t, ti) => ({
    id: `t${ti + 1}`,
    name: t.name,
    checked: true,
    prompts: t.prompts.map((p, pi) => ({
      id: `p${ti + 1}-${pi + 1}`,
      text: p.text,
      volume: formatVolume(p.estimatedVolume),
      checked: true,
    })),
  }));
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

export default function Step2() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [newPromptText, setNewPromptText] = useState("");
  const [brandName, setBrandName] = useState("");

  // Load data from localStorage (set by step-1)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("trace_onboarding");
      if (raw) {
        const data = JSON.parse(raw);
        setBrandName(data.brandName || "");
        if (data.topics && data.topics.length > 0) {
          const built = buildTopicsFromData(data.topics);
          setTopics(built);
          setSelectedTopicId(built[0]?.id || "");
          return;
        }
      }
    } catch {
      // fall through to redirect
    }
    // No data — send back to step 1
    router.replace("/onboarding/step-1");
  }, [router]);

  const MAX_PROMPTS = 50;
  const totalChecked = topics.flatMap(t => t.prompts).filter(p => p.checked).length;

  const selectedTopic = topics.find(t => t.id === selectedTopicId);

  const toggleTopic = (topicId: string) => {
    setTopics(prev => prev.map(t =>
      t.id === topicId
        ? { ...t, checked: !t.checked, prompts: t.prompts.map(p => ({ ...p, checked: !t.checked })) }
        : t
    ));
  };

  const togglePrompt = (topicId: string, promptId: string) => {
    setTopics(prev => prev.map(t =>
      t.id === topicId
        ? { ...t, prompts: t.prompts.map(p => p.id === promptId ? { ...p, checked: !p.checked } : p) }
        : t
    ));
  };

  const removePrompt = (topicId: string, promptId: string) => {
    setTopics(prev => prev.map(t =>
      t.id === topicId
        ? { ...t, prompts: t.prompts.filter(p => p.id !== promptId) }
        : t
    ));
  };

  const addPrompt = () => {
    if (!newPromptText.trim() || !selectedTopicId) return;
    const newId = `p-${Date.now()}`;
    setTopics(prev => prev.map(t =>
      t.id === selectedTopicId
        ? { ...t, prompts: [...t.prompts, { id: newId, text: newPromptText.trim(), volume: "—", checked: true }] }
        : t
    ));
    setNewPromptText("");
  };

  if (topics.length === 0) {
    return (
      <div style={{ fontFamily: "'Manrope', sans-serif", textAlign: "center", paddingTop: 120 }}>
        <p style={{ color: "#8A9BA3", fontSize: 14 }}>Loading prompts...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", maxWidth: 760, margin: "0 auto" }}>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <StepIndicator current={2} />

      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: "#2D3B42", marginBottom: 6 }}>
          Review your prompts
        </h1>
        <p style={{ fontSize: 14, color: "#8A9BA3", lineHeight: 1.6 }}>
          We generated prompts based on {brandName ? <strong>{brandName}</strong> : "your brand"}. Select the ones you want to track.
        </p>
      </div>

      {/* Counter */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#2D3B42" }}>
          {totalChecked}<span style={{ color: "#8A9BA3", fontWeight: 400 }}>/{MAX_PROMPTS} prompts selected</span>
        </div>
        <div style={{ height: 4, width: 120, background: "#E8EAEB", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(totalChecked / MAX_PROMPTS) * 100}%`, background: "#EF4623", borderRadius: 2, transition: "width 0.3s" }} />
        </div>
      </div>

      {/* Two-panel layout */}
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 0, border: "1px solid #E8EAEB", borderRadius: 12, overflow: "hidden", minHeight: 380 }}>
        {/* Left panel: Topics */}
        <div style={{ borderRight: "1px solid #E8EAEB", background: "#FAFAFA" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #E8EAEB" }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#8A9BA3" }}>Topics</span>
          </div>
          {topics.map(topic => {
            const topicCheckedCount = topic.prompts.filter(p => p.checked).length;
            return (
              <div
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 14px", cursor: "pointer",
                  background: selectedTopicId === topic.id ? "#FDF1EE" : "transparent",
                  borderLeft: selectedTopicId === topic.id ? "3px solid #EF4623" : "3px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <input
                  type="checkbox"
                  checked={topic.checked}
                  onChange={(e) => { e.stopPropagation(); toggleTopic(topic.id); }}
                  style={{ accentColor: "#EF4623", cursor: "pointer", flexShrink: 0 }}
                />
                <span style={{ fontSize: 12, fontWeight: selectedTopicId === topic.id ? 600 : 400, color: "#2D3B42", flex: 1, lineHeight: 1.3 }}>{topic.name}</span>
                <span style={{ fontSize: 10, color: "#8A9BA3", fontWeight: 600, flexShrink: 0 }}>{topicCheckedCount}</span>
              </div>
            );
          })}
        </div>

        {/* Right panel: Prompts for selected topic */}
        <div style={{ background: "#fff" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #E8EAEB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#2D3B42" }}>{selectedTopic?.name}</span>
            <span style={{ fontSize: 11, color: "#8A9BA3" }}>{selectedTopic?.prompts.filter(p => p.checked).length} selected</span>
          </div>

          <div style={{ maxHeight: 280, overflowY: "auto" }}>
            {selectedTopic?.prompts.map(prompt => (
              <div
                key={prompt.id}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 16px",
                  borderBottom: "1px solid #F0F0F4",
                  background: prompt.checked ? "#fff" : "#FAFAFA",
                }}
              >
                <input
                  type="checkbox"
                  checked={prompt.checked}
                  onChange={() => togglePrompt(selectedTopic.id, prompt.id)}
                  style={{ accentColor: "#EF4623", cursor: "pointer", flexShrink: 0 }}
                />
                <span style={{
                  fontSize: 13, color: prompt.checked ? "#2D3B42" : "#8A9BA3",
                  flex: 1, lineHeight: 1.4,
                  textDecoration: prompt.checked ? "none" : "line-through",
                }}>{prompt.text}</span>
                <span style={{
                  fontSize: 10, fontWeight: 600, color: "#8A9BA3",
                  background: "#F0F0F4", borderRadius: 4,
                  padding: "2px 8px", flexShrink: 0,
                }}>{prompt.volume}</span>
                <button
                  onClick={() => removePrompt(selectedTopic.id, prompt.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#8A9BA3", padding: 2, display: "flex" }}
                >
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </div>
            ))}
          </div>

          {/* Add prompt */}
          <div style={{ padding: "10px 16px", borderTop: "1px solid #E8EAEB", display: "flex", gap: 8 }}>
            <input
              value={newPromptText}
              onChange={(e) => setNewPromptText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPrompt()}
              placeholder="Add a custom prompt..."
              style={{
                flex: 1, padding: "8px 12px",
                border: "1px solid #E8EAEB", borderRadius: 6,
                fontSize: 12, color: "#2D3B42",
                fontFamily: "'Manrope', sans-serif",
                outline: "none",
              }}
            />
            <button
              onClick={addPrompt}
              disabled={!newPromptText.trim()}
              style={{
                padding: "8px 12px", background: newPromptText.trim() ? "#FDF1EE" : "#F0F0F4",
                color: newPromptText.trim() ? "#EF4623" : "#8A9BA3",
                border: "none", borderRadius: 6, cursor: newPromptText.trim() ? "pointer" : "default",
                display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600,
              }}
            >
              <Plus style={{ width: 14, height: 14 }} /> Add
            </button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => router.push("/onboarding/step-3")}
        disabled={totalChecked === 0}
        style={{
          width: "100%", padding: "14px", marginTop: 24,
          background: totalChecked > 0 ? "#EF4623" : "#E8EAEB",
          color: totalChecked > 0 ? "#fff" : "#8A9BA3",
          border: "none", borderRadius: 10,
          fontSize: 15, fontWeight: 600,
          cursor: totalChecked > 0 ? "pointer" : "not-allowed",
          fontFamily: "'Manrope', sans-serif",
          transition: "all 0.2s",
        }}
      >
        See my brand&apos;s AI visibility
      </button>
    </div>
  );
}
