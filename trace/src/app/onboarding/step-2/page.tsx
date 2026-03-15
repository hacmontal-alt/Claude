"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Plus } from "lucide-react";

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

const MOCK_TOPICS: Topic[] = [
  {
    id: "t1", name: "Product Recommendations", checked: true,
    prompts: [
      { id: "p1", text: "What are the best tools for brand monitoring?", volume: "1.2K", checked: true },
      { id: "p2", text: "How does AI brand tracking work?", volume: "890", checked: true },
      { id: "p3", text: "What features should a brand monitoring tool have?", volume: "650", checked: true },
      { id: "p4", text: "Best AI-powered marketing tools in 2026", volume: "2.4K", checked: true },
    ],
  },
  {
    id: "t2", name: "Competitor Comparison", checked: true,
    prompts: [
      { id: "p5", text: "Best brand monitoring tools compared", volume: "2.1K", checked: true },
      { id: "p6", text: "Which AI search tracking tool is the best?", volume: "1.5K", checked: true },
      { id: "p7", text: "Top alternatives for brand tracking software", volume: "980", checked: true },
    ],
  },
  {
    id: "t3", name: "Industry Trends", checked: true,
    prompts: [
      { id: "p8", text: "How is AI changing search behavior?", volume: "3.4K", checked: true },
      { id: "p9", text: "What is GEO (Generative Engine Optimization)?", volume: "2.8K", checked: true },
      { id: "p10", text: "Will AI replace traditional SEO?", volume: "1.9K", checked: true },
      { id: "p11", text: "Future of AI search engines", volume: "1.6K", checked: true },
    ],
  },
  {
    id: "t4", name: "Use Cases", checked: true,
    prompts: [
      { id: "p12", text: "How to track brand mentions in AI responses?", volume: "1.1K", checked: true },
      { id: "p13", text: "How to improve brand visibility in ChatGPT?", volume: "980", checked: true },
      { id: "p14", text: "How do brands optimize for AI search?", volume: "720", checked: false },
    ],
  },
  {
    id: "t5", name: "Buying Guides", checked: false,
    prompts: [
      { id: "p15", text: "How much does AI brand monitoring cost?", volume: "720", checked: false },
      { id: "p16", text: "Free AI brand monitoring tools", volume: "1.8K", checked: false },
    ],
  },
];

function StepIndicator({ current }: { current: number }) {
  const steps = [
    { num: 1, label: "Brand" },
    { num: 2, label: "Prompts" },
    { num: 3, label: "Setup" },
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

export default function Step2() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>(MOCK_TOPICS);
  const [selectedTopicId, setSelectedTopicId] = useState<string>("t1");
  const [newPromptText, setNewPromptText] = useState("");

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

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", maxWidth: 760, margin: "0 auto" }}>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <StepIndicator current={2} />

      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: "#2D3B42", marginBottom: 6 }}>
          Review your prompts
        </h1>
        <p style={{ fontSize: 14, color: "#8A9BA3", lineHeight: 1.6 }}>
          We generated prompts based on your brand. Select the ones you want to track.
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
        Start tracking
      </button>
    </div>
  );
}
