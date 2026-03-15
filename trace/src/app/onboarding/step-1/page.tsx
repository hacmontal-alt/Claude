"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Loader2 } from "lucide-react";

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
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "es", label: "Spanish" },
  { value: "it", label: "Italian" },
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
              transition: "all 0.3s",
            }}>
              {step.num < current ? "✓" : step.num}
            </div>
            <span style={{
              fontSize: 13, fontWeight: 500,
              color: step.num <= current ? "#2D3B42" : "#8A9BA3",
            }}>{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 48, height: 1, background: step.num < current ? "#EF4623" : "#E8EAEB" }} />
          )}
        </div>
      ))}
    </div>
  );
}

export { StepIndicator };

export default function Step1() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [market, setMarket] = useState("us");
  const [language, setLanguage] = useState("en");
  const [brandName, setBrandName] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [analysing, setAnalysing] = useState(false);

  const handleUrlBlur = () => {
    if (url.trim() && !brandName) {
      setDetecting(true);
      // Simulate brand detection from URL
      setTimeout(() => {
        const domain = url.replace(/https?:\/\/(www\.)?/, "").split(/[/?#]/)[0];
        const name = domain.split(".")[0];
        setBrandName(name.charAt(0).toUpperCase() + name.slice(1));
        setDetecting(false);
      }, 1200);
    }
  };

  const handleSubmit = () => {
    setAnalysing(true);
    // Simulate auto-generate trigger
    setTimeout(() => {
      router.push("/onboarding/step-2");
    }, 2000);
  };

  const isValid = url.trim().length > 0;

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <StepIndicator current={1} />

      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, color: "#2D3B42", marginBottom: 8 }}>
          Set up your brand
        </h1>
        <p style={{ fontSize: 15, color: "#8A9BA3", maxWidth: 440, margin: "0 auto", lineHeight: 1.6 }}>
          Enter your website URL and we&apos;ll automatically detect your brand and generate tracking prompts.
        </p>
      </div>

      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        {/* URL Input */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#2D3B42", marginBottom: 6 }}>Website URL</label>
          <div style={{ position: "relative" }}>
            <Globe style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#8A9BA3" }} />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={handleUrlBlur}
              placeholder="https://yourbrand.com"
              style={{
                width: "100%", padding: "12px 12px 12px 38px",
                border: "1px solid #E8EAEB", borderRadius: 8,
                fontSize: 14, color: "#2D3B42", outline: "none",
                fontFamily: "'Manrope', sans-serif",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Brand name (auto-detected) */}
        {(brandName || detecting) && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#2D3B42", marginBottom: 6 }}>Brand name</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={detecting ? "" : brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder={detecting ? "Detecting..." : ""}
                style={{
                  width: "100%", padding: "12px",
                  border: "1px solid #E8EAEB", borderRadius: 8,
                  fontSize: 14, color: "#2D3B42", outline: "none",
                  fontFamily: "'Manrope', sans-serif",
                  boxSizing: "border-box",
                }}
              />
              {detecting && (
                <Loader2 style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#EF4623", animation: "spin 1s linear infinite" }} />
              )}
              {brandName && !detecting && (
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, fontWeight: 600, color: "#047857", background: "#ECFDF5", padding: "2px 8px", borderRadius: 4 }}>Auto-detected</span>
              )}
            </div>
          </div>
        )}

        {/* Market & Language dropdowns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#2D3B42", marginBottom: 6 }}>Market</label>
            <select
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              style={{
                width: "100%", padding: "12px",
                border: "1px solid #E8EAEB", borderRadius: 8,
                fontSize: 14, color: "#2D3B42", background: "#fff",
                fontFamily: "'Manrope', sans-serif",
                cursor: "pointer", outline: "none",
                boxSizing: "border-box",
              }}
            >
              {MARKETS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#2D3B42", marginBottom: 6 }}>Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                width: "100%", padding: "12px",
                border: "1px solid #E8EAEB", borderRadius: 8,
                fontSize: 14, color: "#2D3B42", background: "#fff",
                fontFamily: "'Manrope', sans-serif",
                cursor: "pointer", outline: "none",
                boxSizing: "border-box",
              }}
            >
              {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleSubmit}
          disabled={!isValid || analysing}
          style={{
            width: "100%", padding: "14px",
            background: isValid && !analysing ? "#EF4623" : "#E8EAEB",
            color: isValid && !analysing ? "#fff" : "#8A9BA3",
            border: "none", borderRadius: 10,
            fontSize: 15, fontWeight: 600,
            cursor: isValid && !analysing ? "pointer" : "not-allowed",
            fontFamily: "'Manrope', sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "all 0.2s",
          }}
        >
          {analysing && <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />}
          {analysing ? "Analysing your brand..." : "Analyse my brand"}
        </button>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
