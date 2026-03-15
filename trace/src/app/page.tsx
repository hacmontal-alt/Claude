"use client";

import { useEffect, useState, useCallback } from "react";
import { Globe, Loader2, Check, X, Plus } from "lucide-react";

const AI_LOGOS: { name: string; logo: React.ReactNode }[] = [
  {
    name: "ChatGPT",
    logo: <svg width="120" height="60" viewBox="0 0 120 60" fill="none"><circle cx="30" cy="30" r="22" fill="#10a37f"/><path d="M30 14c-1.5 0-2.8.8-3.5 2l-7 12.1c-.7 1.2-.7 2.8 0 4l7 12.1c.7 1.2 2 2 3.5 2s2.8-.8 3.5-2l7-12.1c.7-1.2.7-2.8 0-4l-7-12.1c-.7-1.2-2-2-3.5-2z" fill="#fff" opacity="0.9"/><text x="58" y="36" fontFamily="'Manrope',sans-serif" fontSize="16" fontWeight="700" fill="#2D3B42">ChatGPT</text></svg>,
  },
  {
    name: "Gemini",
    logo: <svg width="110" height="60" viewBox="0 0 110 60" fill="none"><circle cx="30" cy="30" r="22" fill="#4285f4"/><path d="M30 12c-2 0-3.6 1.2-4.2 3l-5 15c-.4 1.2 0 2.5 1 3.3l12 9c1 .8 2.4.8 3.4 0l12-9c1-.8 1.4-2.1 1-3.3l-5-15c-.6-1.8-2.2-3-4.2-3h-10z" fill="#fff" opacity="0.85"/><text x="56" y="36" fontFamily="'Manrope',sans-serif" fontSize="16" fontWeight="700" fill="#2D3B42">Gemini</text></svg>,
  },
  {
    name: "Perplexity",
    logo: <svg width="130" height="60" viewBox="0 0 130 60" fill="none"><circle cx="30" cy="30" r="22" fill="#7c3aed"/><path d="M22 20h16v20H22z" fill="#fff" opacity="0.85" rx="3"/><path d="M26 26h8M26 30h6M26 34h8" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/><text x="56" y="36" fontFamily="'Manrope',sans-serif" fontSize="16" fontWeight="700" fill="#2D3B42">Perplexity</text></svg>,
  },
  {
    name: "Grok",
    logo: <svg width="95" height="60" viewBox="0 0 95 60" fill="none"><circle cx="30" cy="30" r="22" fill="#2D3B42"/><text x="30" y="37" textAnchor="middle" fontFamily="'Manrope',sans-serif" fontSize="20" fontWeight="800" fill="#fff">𝕏</text><text x="56" y="36" fontFamily="'Manrope',sans-serif" fontSize="16" fontWeight="700" fill="#2D3B42">Grok</text></svg>,
  },
  {
    name: "Claude",
    logo: <svg width="105" height="60" viewBox="0 0 105 60" fill="none"><circle cx="30" cy="30" r="22" fill="#D97706"/><path d="M24 22c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2V22z" fill="#fff" opacity="0.85"/><circle cx="30" cy="28" r="3" fill="#D97706"/><text x="56" y="36" fontFamily="'Manrope',sans-serif" fontSize="16" fontWeight="700" fill="#2D3B42">Claude</text></svg>,
  },
  {
    name: "AI Overviews",
    logo: <svg width="155" height="60" viewBox="0 0 155 60" fill="none"><circle cx="30" cy="30" r="22" fill="#ea4335"/><path d="M22 30a8 8 0 1116 0 8 8 0 01-16 0z" fill="#fff" opacity="0.85"/><path d="M30 25v10M25 30h10" stroke="#ea4335" strokeWidth="2" strokeLinecap="round"/><text x="56" y="36" fontFamily="'Manrope',sans-serif" fontSize="16" fontWeight="700" fill="#2D3B42">AI Overviews</text></svg>,
  },
];

// ── Onboarding data ──
interface OBPrompt { id: string; text: string; volume: string; checked: boolean; }
interface OBTopic { id: string; name: string; checked: boolean; prompts: OBPrompt[]; }

const MOCK_TOPICS: OBTopic[] = [
  { id: "t1", name: "Product Recommendations", checked: true, prompts: [
    { id: "p1", text: "What are the best tools for brand monitoring?", volume: "1.2K", checked: true },
    { id: "p2", text: "How does AI brand tracking work?", volume: "890", checked: true },
    { id: "p3", text: "What features should a brand monitoring tool have?", volume: "650", checked: true },
    { id: "p4", text: "Best AI-powered marketing tools in 2026", volume: "2.4K", checked: true },
  ]},
  { id: "t2", name: "Competitor Comparison", checked: true, prompts: [
    { id: "p5", text: "Best brand monitoring tools compared", volume: "2.1K", checked: true },
    { id: "p6", text: "Which AI search tracking tool is the best?", volume: "1.5K", checked: true },
    { id: "p7", text: "Top alternatives for brand tracking software", volume: "980", checked: true },
  ]},
  { id: "t3", name: "Industry Trends", checked: true, prompts: [
    { id: "p8", text: "How is AI changing search behavior?", volume: "3.4K", checked: true },
    { id: "p9", text: "What is GEO (Generative Engine Optimization)?", volume: "2.8K", checked: true },
    { id: "p10", text: "Will AI replace traditional SEO?", volume: "1.9K", checked: true },
    { id: "p11", text: "Future of AI search engines", volume: "1.6K", checked: true },
  ]},
  { id: "t4", name: "Use Cases", checked: true, prompts: [
    { id: "p12", text: "How to track brand mentions in AI responses?", volume: "1.1K", checked: true },
    { id: "p13", text: "How to improve brand visibility in ChatGPT?", volume: "980", checked: true },
    { id: "p14", text: "How do brands optimize for AI search?", volume: "720", checked: false },
  ]},
  { id: "t5", name: "Buying Guides", checked: false, prompts: [
    { id: "p15", text: "How much does AI brand monitoring cost?", volume: "720", checked: false },
    { id: "p16", text: "Free AI brand monitoring tools", volume: "1.8K", checked: false },
  ]},
];

const LLM_MODELS = [
  { key: "chatgpt", name: "ChatGPT", icon: "🟢", color: "#10a37f" },
  { key: "gemini", name: "Gemini", icon: "🔵", color: "#4285f4" },
  { key: "perplexity", name: "Perplexity", icon: "🟣", color: "#7c3aed" },
  { key: "grok", name: "Grok", icon: "⚫", color: "#2D3B42" },
  { key: "ai_overviews", name: "AI Overviews", icon: "🔴", color: "#ea4335" },
];

const SAMPLE_RESULTS = [
  { mentioned: true, position: 2, sentiment: "Positive" },
  { mentioned: true, position: 4, sentiment: "Neutral" },
  { mentioned: true, position: 1, sentiment: "Positive" },
  { mentioned: false, position: null as number | null, sentiment: "—" },
  { mentioned: true, position: 3, sentiment: "Positive" },
];

const MARKETS = [
  { value: "us", label: "United States" }, { value: "uk", label: "United Kingdom" },
  { value: "de", label: "Germany" }, { value: "fr", label: "France" },
  { value: "es", label: "Spain" }, { value: "it", label: "Italy" },
];
const LANGUAGES = [
  { value: "en", label: "English" }, { value: "fr", label: "French" },
  { value: "de", label: "German" }, { value: "es", label: "Spanish" },
  { value: "it", label: "Italian" },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [aiIndex, setAiIndex] = useState(0);
  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [obStep, setObStep] = useState(1);
  // Step 1
  const [url, setUrl] = useState("");
  const [market, setMarket] = useState("us");
  const [language, setLanguage] = useState("en");
  const [brandName, setBrandName] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  // Step 2
  const [topics, setTopics] = useState<OBTopic[]>(MOCK_TOPICS);
  const [selectedTopicId, setSelectedTopicId] = useState("t1");
  const [newPromptText, setNewPromptText] = useState("");
  // Step 3
  const [modelStatuses, setModelStatuses] = useState<("waiting"|"querying"|"done")[]>(LLM_MODELS.map(() => "waiting"));
  const [modelResults, setModelResults] = useState<(typeof SAMPLE_RESULTS[0] | null)[]>(LLM_MODELS.map(() => null));
  const [completedCount, setCompletedCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAiIndex(prev => (prev + 1) % AI_LOGOS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const openOnboarding = useCallback(() => {
    setShowOnboarding(true);
    setObStep(1);
    document.body.style.overflow = "hidden";
  }, []);

  // Step 1 handlers
  const handleUrlBlur = () => {
    if (url.trim() && !brandName) {
      setDetecting(true);
      setTimeout(() => {
        const domain = url.replace(/https?:\/\/(www\.)?/, "").split(/[/?#]/)[0];
        const name = domain.split(".")[0];
        setBrandName(name.charAt(0).toUpperCase() + name.slice(1));
        setDetecting(false);
      }, 1200);
    }
  };
  const handleStep1Submit = () => {
    setAnalysing(true);
    setTimeout(() => { setAnalysing(false); setObStep(2); }, 2000);
  };

  // Step 2 handlers
  const toggleTopic = (topicId: string) => {
    setTopics(prev => prev.map(t => t.id === topicId ? { ...t, checked: !t.checked, prompts: t.prompts.map(p => ({ ...p, checked: !t.checked })) } : t));
  };
  const togglePrompt = (topicId: string, promptId: string) => {
    setTopics(prev => prev.map(t => t.id === topicId ? { ...t, prompts: t.prompts.map(p => p.id === promptId ? { ...p, checked: !p.checked } : p) } : t));
  };
  const removePrompt = (topicId: string, promptId: string) => {
    setTopics(prev => prev.map(t => t.id === topicId ? { ...t, prompts: t.prompts.filter(p => p.id !== promptId) } : t));
  };
  const addPrompt = () => {
    if (!newPromptText.trim()) return;
    setTopics(prev => prev.map(t => t.id === selectedTopicId ? { ...t, prompts: [...t.prompts, { id: `p-${Date.now()}`, text: newPromptText.trim(), volume: "—", checked: true }] } : t));
    setNewPromptText("");
  };
  const selectedTopic = topics.find(t => t.id === selectedTopicId);
  const totalChecked = topics.flatMap(t => t.prompts).filter(p => p.checked).length;

  // Step 3 — trigger model queries
  useEffect(() => {
    if (obStep !== 3) return;
    setElapsed(0); setCompletedCount(0);
    setModelStatuses(LLM_MODELS.map(() => "waiting"));
    setModelResults(LLM_MODELS.map(() => null));
    const timer = setInterval(() => setElapsed(prev => prev + 1), 1000);
    const delays = [1500, 4000, 7500, 11000, 15000];
    const durations = [2000, 3000, 3500, 3000, 2500];
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    LLM_MODELS.forEach((_, i) => {
      timeouts.push(setTimeout(() => {
        setModelStatuses(prev => prev.map((s, j) => j === i ? "querying" : s));
      }, delays[i]));
      timeouts.push(setTimeout(() => {
        setModelStatuses(prev => prev.map((s, j) => j === i ? "done" : s));
        setModelResults(prev => prev.map((r, j) => j === i ? SAMPLE_RESULTS[i] : r));
        setCompletedCount(prev => prev + 1);
      }, delays[i] + durations[i]));
    });
    return () => { clearInterval(timer); timeouts.forEach(clearTimeout); };
  }, [obStep]);

  // Redirect when step 3 done
  useEffect(() => {
    if (obStep === 3 && completedCount === LLM_MODELS.length) {
      const t = setTimeout(() => { window.location.href = "/dashboard"; }, 2500);
      return () => clearTimeout(t);
    }
  }, [obStep, completedCount]);
  // 90s max
  useEffect(() => {
    if (obStep === 3 && elapsed >= 90) window.location.href = "/dashboard";
  }, [obStep, elapsed]);

  return (
    <>
      <style jsx global>{`
        *{margin:0;padding:0;box-sizing:border-box}
        :root{
          --coral:#EF4623;
          --ink:#2D3B42;
          --peach:#FDF1EE;
          --ease:cubic-bezier(0.16,1,0.3,1);
        }
        body{font-family:'Manrope',sans-serif;background:#fff;color:var(--ink);overflow-x:hidden}
        .lp-nav{
          position:fixed;top:0;left:0;right:0;z-index:100;
          padding:16px 40px;
          display:flex;align-items:center;justify-content:space-between;
          transition:all 0.4s var(--ease);
        }
        .lp-nav.scrolled{background:rgba(255,255,255,0.85);backdrop-filter:blur(12px);border-bottom:1px solid rgba(45,59,66,0.08)}
        .logo-mark{
          width:36px;height:36px;background:var(--coral);
          display:flex;align-items:center;justify-content:center;
          transform:rotate(3deg);transition:transform 0.3s var(--ease);
          cursor:pointer;flex-shrink:0;
        }
        .logo-mark:hover{transform:rotate(12deg)}
        .logo-mark span{font-family:'Instrument Serif',serif;font-weight:700;font-style:italic;color:#fff;font-size:18px}
        .logo-wrap{display:flex;align-items:center;gap:10px}
        .logo-name{font-family:'Instrument Serif',serif;font-size:20px;font-weight:400;color:var(--ink)}
        .lp-nav ul{display:flex;gap:32px;list-style:none}
        .lp-nav ul a{font-size:13px;font-weight:600;color:rgba(45,59,66,0.7);text-decoration:none;transition:color 0.2s}
        .lp-nav ul a:hover{color:var(--ink)}
        .nav-cta{
          background:var(--coral);color:#fff;
          font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
          padding:10px 22px;border-radius:30px;text-decoration:none;
          box-shadow:0 8px 24px rgba(239,70,35,0.2);
          transition:all 0.3s var(--ease);
        }
        .nav-cta:hover{transform:translateY(-1px);box-shadow:0 12px 32px rgba(239,70,35,0.3)}
        .hero{
          padding:160px 40px 100px;
          text-align:center;
          position:relative;overflow:hidden;
        }
        .hero-bg-1{
          position:absolute;top:-60px;right:-80px;
          width:400px;height:400px;border-radius:50%;
          background:rgba(239,70,35,0.07);filter:blur(100px);pointer-events:none;
        }
        .hero-bg-2{
          position:absolute;bottom:-80px;left:-60px;
          width:350px;height:350px;border-radius:50%;
          background:rgba(239,70,35,0.05);filter:blur(120px);pointer-events:none;
        }
        .hero-badge{
          display:inline-flex;align-items:center;gap:8px;
          background:var(--peach);border-radius:30px;
          padding:8px 18px;margin-bottom:32px;
          font-size:13px;font-weight:600;color:var(--coral);
        }
        .hero-badge-dot{width:6px;height:6px;border-radius:50%;background:var(--coral);animation:pulse 2s infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .lp-h1{
          font-family:'Instrument Serif',serif;
          font-size:clamp(64px,9vw,120px);
          line-height:1;letter-spacing:-0.02em;
          color:var(--ink);margin-bottom:8px;
        }
        .lp-h1 em{color:var(--coral);font-style:italic}
        .hero-sub{
          max-width:540px;margin:24px auto 40px;
          font-size:18px;line-height:1.7;
          color:rgba(45,59,66,0.65);font-weight:400;
        }
        .hero-ctas{display:flex;gap:14px;justify-content:center;align-items:center;flex-wrap:wrap}
        .btn-primary{
          background:var(--coral);color:#fff;
          font-size:14px;font-weight:600;
          padding:14px 32px;border-radius:30px;text-decoration:none;
          box-shadow:0 16px 40px rgba(239,70,35,0.25);
          transition:all 0.3s var(--ease);display:inline-block;
        }
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 20px 48px rgba(239,70,35,0.35)}
        .btn-ghost{
          border:2px solid rgba(45,59,66,0.12);color:var(--ink);
          font-size:14px;font-weight:600;
          padding:14px 32px;border-radius:30px;text-decoration:none;
          transition:all 0.3s var(--ease);display:inline-block;
        }
        .btn-ghost:hover{border-color:rgba(45,59,66,0.3);background:rgba(45,59,66,0.03)}
        .trust-bar{
          margin:48px auto 0;max-width:600px;
          display:flex;align-items:center;justify-content:center;gap:32px;flex-wrap:wrap;
        }
        .trust-bar span{font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:rgba(45,59,66,0.35)}
        .trust-pill{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:rgba(45,59,66,0.5)}
        .trust-dot{width:6px;height:6px;border-radius:50%;background:rgba(45,59,66,0.2)}
        .sim-wrap{
          max-width:860px;margin:60px auto 0;
          background:var(--ink);border-radius:40px;
          overflow:hidden;padding:20px;
        }
        .sim-bar{display:flex;gap:6px;align-items:center;margin-bottom:16px;padding:0 4px}
        .sim-dot{width:10px;height:10px;border-radius:50%}
        .sim-dot.r{background:#FF5F57}.sim-dot.y{background:#FEBC2E}.sim-dot.g{background:#28C840}
        .sim-addr{flex:1;background:rgba(255,255,255,0.08);border-radius:8px;height:26px;margin-left:12px}
        .sim-inner{background:#fff;border-radius:28px;padding:24px;min-height:280px}
        .sim-header-sk{height:12px;width:40%;background:var(--peach);border-radius:6px;margin-bottom:20px}
        .sim-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}
        .sim-card{border-radius:16px;padding:16px}
        .sim-card.dark{background:var(--ink)}
        .sim-card.light{background:var(--peach)}
        .sim-card-label{font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:8px}
        .sim-card.dark .sim-card-label{color:rgba(255,255,255,0.4)}
        .sim-card.light .sim-card-label{color:var(--coral)}
        .sim-big-num{font-family:'Instrument Serif',serif;font-size:42px;font-weight:400}
        .sim-card.dark .sim-big-num{color:#fff}
        .sim-card.light .sim-big-num{color:var(--ink)}
        .sim-bar-wrap{margin-top:8px}
        .sim-bar-row{display:flex;align-items:center;gap:8px;margin-bottom:6px}
        .sim-bar-label{font-size:11px;font-weight:600;color:rgba(255,255,255,0.5);width:70px}
        .sim-bar-track{flex:1;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden}
        .sim-bar-fill{height:100%;border-radius:3px;background:var(--coral)}
        .sim-footer{
          background:rgba(45,59,66,0.06);
          border-radius:14px;padding:10px 16px;
          display:flex;align-items:center;gap:10px;margin-top:4px;
        }
        .sim-check{width:18px;height:18px;border-radius:50%;background:#28C840;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .sim-status{font-size:12px;font-weight:600;color:var(--ink)}
        .sim-tags{display:flex;gap:6px;margin-left:auto}
        .sim-tag{background:var(--ink);border-radius:6px;padding:4px 10px;font-size:11px;font-weight:600;color:rgba(255,255,255,0.6);font-family:monospace}
        .lp-section{padding:80px 40px}
        .section-inner{max-width:1100px;margin:0 auto}
        .section-label{
          display:inline-block;font-size:11px;font-weight:700;
          letter-spacing:0.1em;text-transform:uppercase;
          color:var(--coral);margin-bottom:16px;
        }
        .section-h2{
          font-family:'Instrument Serif',serif;
          font-size:clamp(40px,5vw,64px);
          line-height:1.1;letter-spacing:-0.02em;
          color:var(--ink);margin-bottom:20px;
        }
        .section-h2 em{font-style:italic;color:var(--coral)}
        .how-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;margin-top:48px}
        .how-steps{display:flex;flex-direction:column;gap:24px}
        .how-step{display:flex;gap:20px;align-items:flex-start}
        .step-num{
          width:44px;height:44px;border-radius:16px;
          background:var(--peach);flex-shrink:0;
          display:flex;align-items:center;justify-content:center;
          font-family:'Instrument Serif',serif;font-size:18px;font-style:italic;color:var(--coral);
        }
        .step-content h4{font-size:16px;font-weight:700;color:var(--ink);margin-bottom:4px}
        .step-content p{font-size:14px;color:rgba(45,59,66,0.6);line-height:1.6}
        .features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px}
        .feat-card{border-radius:48px;padding:36px;transition:transform 0.3s var(--ease);position:relative;overflow:hidden}
        .feat-card:hover{transform:translateY(-4px)}
        .feat-card.white{background:#fff;border:1px solid rgba(45,59,66,0.08)}
        .feat-card.dark{background:var(--ink);color:#fff}
        .feat-card.peach{background:var(--peach)}
        .feat-card.span2{grid-column:span 2}
        .feat-icon{
          width:52px;height:52px;border-radius:18px;
          display:flex;align-items:center;justify-content:center;
          margin-bottom:20px;font-size:22px;
        }
        .feat-card.white .feat-icon{background:var(--peach)}
        .feat-card.dark .feat-icon{background:rgba(255,255,255,0.1)}
        .feat-card.peach .feat-icon{background:#fff}
        .feat-card h3{font-size:18px;font-weight:700;margin-bottom:8px}
        .feat-card.dark h3{color:#fff}
        .feat-card p{font-size:14px;line-height:1.65;color:rgba(45,59,66,0.6)}
        .feat-card.dark p{color:rgba(255,255,255,0.55)}
        .feat-bg-icon{font-size:100px;opacity:0.05;position:absolute;bottom:-10px;right:16px;line-height:1;pointer-events:none}
        .platforms{
          background:var(--peach);border-radius:48px;
          padding:60px;margin-top:0;
          display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;
        }
        .platform-list{display:flex;flex-direction:column;gap:12px;margin-top:24px}
        .platform-item{
          display:flex;align-items:center;gap:14px;
          background:#fff;border-radius:20px;padding:14px 20px;
        }
        .platform-dot{width:10px;height:10px;border-radius:50%;background:var(--coral);flex-shrink:0}
        .platform-name{font-weight:700;font-size:15px;color:var(--ink)}
        .platform-desc{font-size:13px;color:rgba(45,59,66,0.5);margin-left:auto}
        .pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px}
        .price-card{border-radius:40px;padding:36px;border:1px solid rgba(45,59,66,0.08)}
        .price-card.featured{background:var(--ink);border-color:transparent}
        .price-label{font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:16px;color:rgba(45,59,66,0.4)}
        .price-card.featured .price-label{color:rgba(255,255,255,0.4)}
        .price-name{font-family:'Instrument Serif',serif;font-size:28px;margin-bottom:4px;color:var(--ink)}
        .price-card.featured .price-name{color:#fff}
        .price-amount{font-size:48px;font-weight:700;color:var(--ink);margin-bottom:4px}
        .price-card.featured .price-amount{color:#fff}
        .price-period{font-size:14px;color:rgba(45,59,66,0.4);margin-bottom:24px}
        .price-card.featured .price-period{color:rgba(255,255,255,0.4)}
        .price-features{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:28px}
        .price-features li{display:flex;gap:10px;font-size:14px;align-items:flex-start;color:var(--ink)}
        .price-features li::before{content:"✓";color:var(--coral);font-weight:700;flex-shrink:0}
        .price-card.featured .price-features li{color:rgba(255,255,255,0.75)}
        .price-btn{
          width:100%;padding:13px;border-radius:24px;
          font-size:14px;font-weight:700;cursor:pointer;
          border:none;transition:all 0.3s var(--ease);text-align:center;display:block;text-decoration:none;
        }
        .price-card:not(.featured) .price-btn{background:var(--peach);color:var(--coral)}
        .price-card:not(.featured) .price-btn:hover{background:var(--coral);color:#fff}
        .price-card.featured .price-btn{background:var(--coral);color:#fff;box-shadow:0 8px 24px rgba(239,70,35,0.3)}
        .price-badge{
          display:inline-block;background:var(--coral);color:#fff;
          font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
          padding:4px 12px;border-radius:20px;margin-bottom:12px;
        }
        .cta-section{
          background:var(--coral);border-radius:64px;
          padding:80px 60px;text-align:center;
          position:relative;overflow:hidden;margin:0 40px 80px;
        }
        .cta-dots{
          position:absolute;inset:0;
          background-image:radial-gradient(circle,rgba(255,255,255,0.2) 1px,transparent 1px);
          background-size:30px 30px;pointer-events:none;
        }
        .cta-h2{
          font-family:'Instrument Serif',serif;
          font-size:clamp(48px,7vw,96px);
          color:#fff;line-height:1;letter-spacing:-0.02em;
          margin-bottom:24px;position:relative;
        }
        .cta-sub{font-size:18px;color:rgba(255,255,255,0.75);margin-bottom:36px;position:relative}
        .cta-btn{
          display:inline-block;background:#fff;color:var(--coral);
          font-size:15px;font-weight:700;
          padding:16px 40px;border-radius:30px;text-decoration:none;
          position:relative;transition:all 0.3s var(--ease);
        }
        .cta-btn:hover{transform:translateY(-2px);box-shadow:0 16px 40px rgba(0,0,0,0.15)}
        .cta-trust{
          display:flex;align-items:center;justify-content:center;gap:24px;
          margin-top:28px;position:relative;flex-wrap:wrap;
        }
        .cta-trust span{font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.55)}
        .lp-footer{background:var(--ink);padding:60px 40px 32px}
        .footer-grid{
          max-width:1100px;margin:0 auto;
          display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:48px;
        }
        .footer-logo-name{font-family:'Instrument Serif',serif;font-size:22px;color:#fff}
        .footer-brand p{font-size:13px;color:rgba(255,255,255,0.4);margin-top:12px;line-height:1.6;max-width:240px}
        .footer-col h4{font-family:'Instrument Serif',serif;font-size:18px;color:#fff;margin-bottom:16px}
        .footer-col ul{list-style:none;display:flex;flex-direction:column;gap:10px}
        .footer-col ul a{font-size:13px;color:rgba(255,255,255,0.4);text-decoration:none;transition:color 0.2s}
        .footer-col ul a:hover{color:rgba(255,255,255,0.8)}
        .footer-bottom{
          max-width:1100px;margin:0 auto;
          border-top:1px solid rgba(255,255,255,0.06);
          padding-top:24px;
          display:flex;justify-content:space-between;align-items:center;
        }
        .footer-bottom p{font-size:12px;color:rgba(255,255,255,0.3)}
        .footer-links{display:flex;gap:20px}
        .footer-links a{font-size:12px;color:rgba(255,255,255,0.3);text-decoration:none}
        @keyframes fadeUp{
          from{opacity:0;transform:translateY(20px) rotate(2deg)}
          to{opacity:1;transform:translateY(0) rotate(0deg)}
        }
        .fade-up{animation:fadeUp 0.8s var(--ease) both}
        .delay-1{animation-delay:0.1s}
        .delay-2{animation-delay:0.2s}
        .delay-3{animation-delay:0.35s}
        .delay-4{animation-delay:0.5s}
        .ai-cycle-wrap{
          display:inline-flex;align-items:center;justify-content:center;
          min-width:200px;min-height:70px;vertical-align:middle;
          margin:8px 0;
        }
        .ai-cycle-text{
          display:inline-flex;align-items:center;
          animation:aiCycleIn 0.5s var(--ease) both;
        }
        .ai-cycle-text svg{
          height:clamp(40px,6vw,60px);width:auto;
        }
        @keyframes aiCycleIn{
          from{opacity:0;transform:translateY(24px) scale(0.9)}
          to{opacity:1;transform:translateY(0) scale(1)}
        }
        .ob-overlay{
          position:fixed;inset:0;z-index:200;
          background:#fff;
          overflow-y:auto;
          animation:obFadeIn 0.35s var(--ease) both;
        }
        @keyframes obFadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .ob-close{
          position:absolute;top:20px;right:24px;
          width:40px;height:40px;border-radius:50%;border:1px solid #E8EAEB;
          background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;
          transition:all 0.2s;z-index:10;
        }
        .ob-close:hover{background:#f5f5f5;border-color:#ccc}
        .ob-inner{max-width:720px;margin:0 auto;padding:80px 24px 60px}
        .ob-steps{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:48px}
        .ob-step-dot{
          width:32px;height:32px;border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          font-size:13px;font-weight:600;transition:all 0.3s;
        }
        .ob-step-dot.active{background:#EF4623;color:#fff}
        .ob-step-dot.done{background:#EF4623;color:#fff}
        .ob-step-dot.pending{background:#E8EAEB;color:#8A9BA3}
        .ob-step-label{font-size:13px;font-weight:500;transition:color 0.3s}
        .ob-step-label.active{color:#2D3B42}
        .ob-step-label.pending{color:#8A9BA3}
        .ob-step-line{width:48px;height:1px;transition:background 0.3s}
        .ob-step-line.done{background:#EF4623}
        .ob-step-line.pending{background:#E8EAEB}
        .ob-title{
          font-family:'Instrument Serif',serif;font-size:32px;
          color:#2D3B42;text-align:center;margin-bottom:8px;
        }
        .ob-subtitle{font-size:14px;color:#8A9BA3;text-align:center;line-height:1.6;margin-bottom:36px}
        .ob-input{
          width:100%;padding:14px 16px;border:1px solid #E8EAEB;border-radius:12px;
          font-size:14px;font-family:'Manrope',sans-serif;color:#2D3B42;
          outline:none;transition:border-color 0.2s;
        }
        .ob-input:focus{border-color:#EF4623}
        .ob-input::placeholder{color:#8A9BA3}
        .ob-select{
          width:100%;padding:14px 16px;border:1px solid #E8EAEB;border-radius:12px;
          font-size:14px;font-family:'Manrope',sans-serif;color:#2D3B42;
          outline:none;background:#fff;cursor:pointer;appearance:none;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A9BA3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat:no-repeat;background-position:right 16px center;
        }
        .ob-btn{
          width:100%;padding:16px;border-radius:30px;border:none;
          font-size:15px;font-weight:700;font-family:'Manrope',sans-serif;
          cursor:pointer;transition:all 0.3s var(--ease);
          display:flex;align-items:center;justify-content:center;gap:8px;
        }
        .ob-btn-primary{
          background:#EF4623;color:#fff;
          box-shadow:0 8px 24px rgba(239,70,35,0.2);
        }
        .ob-btn-primary:hover{transform:translateY(-1px);box-shadow:0 12px 32px rgba(239,70,35,0.3)}
        .ob-btn-primary:disabled{opacity:0.5;cursor:not-allowed;transform:none;box-shadow:none}
        .ob-topic-item{
          display:flex;align-items:center;gap:12px;
          padding:12px 16px;border-radius:12px;cursor:pointer;
          transition:background 0.2s;
        }
        .ob-topic-item:hover{background:#FAFAFA}
        .ob-topic-item.selected{background:#FDF1EE}
        .ob-checkbox{
          width:20px;height:20px;border-radius:6px;border:2px solid #E8EAEB;
          display:flex;align-items:center;justify-content:center;flex-shrink:0;
          transition:all 0.2s;cursor:pointer;
        }
        .ob-checkbox.checked{background:#EF4623;border-color:#EF4623}
        .ob-prompt-row{
          display:flex;align-items:center;gap:10px;
          padding:10px 14px;border:1px solid #E8EAEB;border-radius:10px;
          margin-bottom:8px;transition:all 0.2s;
        }
        .ob-prompt-row:hover{border-color:#ccc}
        .ob-model-row{
          display:flex;align-items:center;gap:14px;
          padding:14px 18px;margin-bottom:8px;
          border-radius:12px;transition:all 0.3s;
        }
        .ob-model-row.waiting{background:#FAFAFA;border:1px solid #E8EAEB}
        .ob-model-row.querying{background:#FDF1EE;border:1px solid rgba(239,70,35,0.13)}
        .ob-model-row.done{background:#fff;border:1px solid #E8EAEB}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @media(max-width:768px){
          .lp-nav ul{display:none}
          .lp-nav{padding:16px 20px}
          .how-grid,.features-grid,.pricing-grid,.footer-grid{grid-template-columns:1fr}
          .feat-card.span2{grid-column:span 1}
          .platforms{grid-template-columns:1fr;padding:36px}
          .lp-section{padding:60px 20px}
          .hero{padding:120px 20px 60px}
          .cta-section{margin:0 20px 60px;padding:60px 32px;border-radius:40px}
          .sim-grid{grid-template-columns:1fr}
          .ob-inner{padding:60px 16px 40px}
        }
      `}</style>

      {/* Nav */}
      <nav className={`lp-nav${scrolled ? " scrolled" : ""}`}>
        <div className="logo-wrap">
          <div className="logo-mark"><span>T</span></div>
          <span className="logo-name">Trace</span>
        </div>
        <ul>
          <li><a href="#">Product</a></li>
          <li><a href="#">Competitors</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#">Blog</a></li>
        </ul>
        <button onClick={openOnboarding} className="nav-cta" style={{ border: "none", cursor: "pointer" }}>Start Free</button>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-1"></div>
        <div className="hero-bg-2"></div>
        <div className="hero-badge fade-up"><span className="hero-badge-dot"></span> AI Search is the new SEO</div>
        <h1 className="lp-h1 fade-up delay-1">Be the brand<br /><span className="ai-cycle-wrap"><span key={aiIndex} className="ai-cycle-text">{AI_LOGOS[aiIndex].logo}</span></span><br />recommends</h1>
        <p className="hero-sub fade-up delay-2">Track exactly how your brand appears across ChatGPT, Perplexity, Google AI Overviews and every major AI engine. Know where you stand. Know what to fix.</p>
        <div className="hero-ctas fade-up delay-3">
          <button onClick={openOnboarding} className="btn-primary" style={{ border: "none", cursor: "pointer" }}>Start for free</button>
          <a href="#how-it-works" className="btn-ghost">See how it works</a>
        </div>
        <div className="trust-bar fade-up delay-4">
          <span>Trusted by</span>
          <div className="trust-pill"><div className="trust-dot"></div> DTC Brands</div>
          <div className="trust-pill"><div className="trust-dot"></div> SaaS Startups</div>
          <div className="trust-pill"><div className="trust-dot"></div> SEO Agencies</div>
        </div>
        <div className="sim-wrap fade-up delay-4">
          <div className="sim-bar">
            <div className="sim-dot r"></div>
            <div className="sim-dot y"></div>
            <div className="sim-dot g"></div>
            <div className="sim-addr"></div>
          </div>
          <div className="sim-inner">
            <div className="sim-header-sk"></div>
            <div className="sim-grid">
              <div className="sim-card dark">
                <div className="sim-card-label">AI Visibility Score</div>
                <div className="sim-big-num">74<span style={{ fontSize: "20px", color: "rgba(255,255,255,0.4)" }}>/100</span></div>
                <div className="sim-bar-wrap">
                  <div className="sim-bar-row"><span className="sim-bar-label">ChatGPT</span><div className="sim-bar-track"><div className="sim-bar-fill" style={{ width: "82%" }}></div></div><span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>82</span></div>
                  <div className="sim-bar-row"><span className="sim-bar-label">Perplexity</span><div className="sim-bar-track"><div className="sim-bar-fill" style={{ width: "67%" }}></div></div><span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>67</span></div>
                  <div className="sim-bar-row"><span className="sim-bar-label">Gemini</span><div className="sim-bar-track"><div className="sim-bar-fill" style={{ width: "58%" }}></div></div><span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>58</span></div>
                  <div className="sim-bar-row"><span className="sim-bar-label">AI Overview</span><div className="sim-bar-track"><div className="sim-bar-fill" style={{ width: "71%" }}></div></div><span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>71</span></div>
                </div>
              </div>
              <div className="sim-card light">
                <div className="sim-card-label">vs Competitors</div>
                <div className="sim-big-num" style={{ fontSize: "28px", marginBottom: "12px" }}>+18pts</div>
                <div style={{ fontSize: "12px", color: "rgba(45,59,66,0.5)", fontWeight: 600, marginBottom: "8px" }}>ahead of nearest competitor</div>
                <div style={{ background: "#fff", borderRadius: "12px", padding: "8px 12px", marginBottom: "6px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink)" }}>Your Brand</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--coral)" }}>74</span>
                </div>
                <div style={{ background: "#fff", borderRadius: "12px", padding: "8px 12px", marginBottom: "6px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(45,59,66,0.5)" }}>Competitor A</span>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(45,59,66,0.4)" }}>56</span>
                </div>
                <div style={{ background: "#fff", borderRadius: "12px", padding: "8px 12px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(45,59,66,0.5)" }}>Competitor B</span>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(45,59,66,0.4)" }}>41</span>
                </div>
              </div>
            </div>
            <div className="sim-footer">
              <div className="sim-check">
                <svg viewBox="0 0 10 10" fill="none" width="10" height="10"><path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </div>
              <span className="sim-status">Tracking active — last updated 2 mins ago</span>
              <div className="sim-tags">
                <div className="sim-tag">ChatGPT</div>
                <div className="sim-tag">Perplexity</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="lp-section">
        <div className="section-inner">
          <div style={{ textAlign: "center", marginBottom: "16px" }}><span className="section-label">How it works</span></div>
          <h2 className="section-h2" style={{ textAlign: "center" }}>Up and running in<br /><em>under 5 minutes</em></h2>
          <div className="how-grid">
            <div className="how-steps">
              <div className="how-step">
                <div className="step-num">1</div>
                <div className="step-content">
                  <h4>Set up your brand</h4>
                  <p>Enter your brand name, domain, and up to 5 competitors. Takes 3 minutes. No code, no integrations.</p>
                </div>
              </div>
              <div className="how-step">
                <div className="step-num">2</div>
                <div className="step-content">
                  <h4>We query every AI engine daily</h4>
                  <p>Trace automatically runs your brand prompts across ChatGPT, Perplexity, Gemini, Google AI Overviews and more — every single day.</p>
                </div>
              </div>
              <div className="how-step">
                <div className="step-num">3</div>
                <div className="step-content">
                  <h4>See your AI visibility score</h4>
                  <p>Your dashboard shows mention rate, sentiment, competitor benchmarks, and exactly which content is being cited.</p>
                </div>
              </div>
              <div className="how-step">
                <div className="step-num">4</div>
                <div className="step-content">
                  <h4>Get actionable recommendations</h4>
                  <p>Trace tells you exactly what content to publish to close visibility gaps — and tracks improvement over time.</p>
                </div>
              </div>
            </div>
            <div style={{ background: "var(--peach)", borderRadius: "48px", padding: "36px", minHeight: "400px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ background: "#fff", borderRadius: "32px", padding: "24px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--coral)", marginBottom: "16px" }}>Live AI Response</div>
                <div style={{ fontSize: "13px", color: "rgba(45,59,66,0.5)", marginBottom: "12px", fontStyle: "italic" }}>&ldquo;What&apos;s the best project management tool for remote teams?&rdquo;</div>
                <div style={{ fontSize: "13px", lineHeight: 1.7, color: "var(--ink)" }}>
                  For remote teams, <strong style={{ color: "var(--coral)", background: "rgba(239,70,35,0.08)", padding: "1px 4px", borderRadius: "4px" }}>YourBrand</strong> stands out as a top choice due to its intuitive interface and strong async collaboration features. Other popular options include Notion and Linear, though they lack some of YourBrand&apos;s dedicated remote-first workflow tools...
                </div>
                <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(45,59,66,0.06)", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <div style={{ background: "rgba(40,200,64,0.1)", color: "#1a7a2a", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "8px" }}>✓ Mentioned</div>
                  <div style={{ background: "rgba(239,70,35,0.08)", color: "var(--coral)", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "8px" }}>Positive sentiment</div>
                  <div style={{ background: "var(--peach)", color: "rgba(45,59,66,0.6)", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "8px" }}>Position #1</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="lp-section" style={{ background: "#fafafa" }}>
        <div className="section-inner">
          <span className="section-label">Features</span>
          <h2 className="section-h2">Everything you need to<br /><em>own AI search</em></h2>
          <div className="features-grid">
            <div className="feat-card dark span2">
              <div className="feat-icon">📡</div>
              <h3>Real-time AI monitoring across 6 platforms</h3>
              <p>Track your brand mentions in ChatGPT, Perplexity, Gemini, Google AI Overviews, Grok, and Claude. Daily automated queries so you never miss a shift in visibility.</p>
              <div className="feat-bg-icon">📡</div>
            </div>
            <div className="feat-card peach">
              <div className="feat-icon">📊</div>
              <h3>Visibility score</h3>
              <p>A single score that tells you exactly where you stand across all AI engines — updated daily.</p>
            </div>
            <div className="feat-card white">
              <div className="feat-icon">🎯</div>
              <h3>Sentiment analysis</h3>
              <p>Know not just if you&apos;re mentioned — but how. Positive, neutral, or negative signals across every platform.</p>
              <div className="feat-bg-icon">🎯</div>
            </div>
            <div className="feat-card white">
              <div className="feat-icon">⚡</div>
              <h3>Competitor benchmarking</h3>
              <p>See exactly how you compare to up to 10 competitors side by side on every AI engine.</p>
            </div>
            <div className="feat-card dark">
              <div className="feat-icon">🔔</div>
              <h3>Smart alerts</h3>
              <p>Get notified instantly when your visibility score drops or a competitor surges ahead of you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform coverage */}
      <section className="lp-section">
        <div className="section-inner">
          <div className="platforms">
            <div>
              <span className="section-label">Platform coverage</span>
              <h2 className="section-h2" style={{ fontSize: "clamp(32px,4vw,48px)" }}>Every AI engine.<br /><em>One dashboard.</em></h2>
              <p style={{ fontSize: "15px", color: "rgba(45,59,66,0.6)", marginTop: "12px", lineHeight: 1.7 }}>AI search is fragmented. Your customers use different platforms. Trace tracks all of them so you don&apos;t have to choose.</p>
            </div>
            <div className="platform-list">
              <div className="platform-item"><div className="platform-dot"></div><span className="platform-name">ChatGPT</span><span className="platform-desc">OpenAI</span></div>
              <div className="platform-item"><div className="platform-dot"></div><span className="platform-name">Perplexity</span><span className="platform-desc">perplexity.ai</span></div>
              <div className="platform-item"><div className="platform-dot"></div><span className="platform-name">Google AI Overviews</span><span className="platform-desc">Google</span></div>
              <div className="platform-item"><div className="platform-dot"></div><span className="platform-name">Gemini</span><span className="platform-desc">Google</span></div>
              <div className="platform-item"><div className="platform-dot"></div><span className="platform-name">Grok</span><span className="platform-desc">xAI</span></div>
              <div className="platform-item"><div className="platform-dot"></div><span className="platform-name">Claude</span><span className="platform-desc">Anthropic</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="lp-section" style={{ background: "#fafafa" }}>
        <div className="section-inner">
          <div style={{ textAlign: "center" }}><span className="section-label">Pricing</span></div>
          <h2 className="section-h2" style={{ textAlign: "center" }}>Simple, transparent<br /><em>pricing</em></h2>
          <div className="pricing-grid">
            <div className="price-card">
              <div className="price-label">Starter</div>
              <div className="price-name">Solo</div>
              <div className="price-amount">$99</div>
              <div className="price-period">per month</div>
              <ul className="price-features">
                <li>1 brand tracked</li>
                <li>3 competitors</li>
                <li>4 AI platforms</li>
                <li>Daily tracking</li>
                <li>Email alerts</li>
              </ul>
              <button onClick={openOnboarding} className="price-btn" style={{ border: "none", cursor: "pointer" }}>Get started</button>
            </div>
            <div className="price-card featured">
              <div className="price-badge">Most Popular</div>
              <div className="price-label">Growth</div>
              <div className="price-name">Pro</div>
              <div className="price-amount">$299</div>
              <div className="price-period">per month</div>
              <ul className="price-features">
                <li>3 brands tracked</li>
                <li>Unlimited competitors</li>
                <li>6 AI platforms</li>
                <li>Daily tracking</li>
                <li>Smart alerts + reports</li>
                <li>Content gap analysis</li>
              </ul>
              <button onClick={openOnboarding} className="price-btn" style={{ border: "none", cursor: "pointer" }}>Get started</button>
            </div>
            <div className="price-card">
              <div className="price-label">Agency</div>
              <div className="price-name">Agency</div>
              <div className="price-amount">$599</div>
              <div className="price-period">per month</div>
              <ul className="price-features">
                <li>10 brands tracked</li>
                <li>Unlimited competitors</li>
                <li>All AI platforms</li>
                <li>White-label reports</li>
                <li>API access</li>
                <li>Multi-user seats</li>
              </ul>
              <button onClick={openOnboarding} className="price-btn" style={{ border: "none", cursor: "pointer" }}>Get started</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <div className="cta-dots"></div>
        <h2 className="cta-h2">Leave your trace.<br />Start today.</h2>
        <p className="cta-sub">Your competitors are already tracking their AI visibility. Don&apos;t fall behind.</p>
        <button onClick={openOnboarding} className="cta-btn" style={{ border: "none", cursor: "pointer" }}>Start free — no credit card</button>
        <div className="cta-trust">
          <span>✓ Free 14-day trial</span>
          <span>✓ Cancel anytime</span>
          <span>✓ Setup in 3 minutes</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo-wrap">
              <div className="logo-mark"><span>T</span></div>
              <span className="footer-logo-name">Trace</span>
            </div>
            <p>AI search visibility for brands that want to be found — across every AI engine that matters.</p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><a href="#">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#">Changelog</a></li>
              <li><a href="#">Roadmap</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><a href="#">GEO Guide</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Case Studies</a></li>
              <li><a href="#">API Docs</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Trace. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* ── Onboarding Overlay ── */}
      {showOnboarding && (
        <div className="ob-overlay">
          <button className="ob-close" onClick={() => { setShowOnboarding(false); document.body.style.overflow = ""; }}>
            <X style={{ width: 18, height: 18, color: "#8A9BA3" }} />
          </button>
          <div className="ob-inner">
            {/* Step indicator */}
            <div className="ob-steps">
              {[{ num: 1, label: "Brand" }, { num: 2, label: "Prompts" }, { num: 3, label: "Setup" }].map((s, i, arr) => (
                <div key={s.num} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className={`ob-step-dot ${s.num < obStep ? "done" : s.num === obStep ? "active" : "pending"}`}>
                      {s.num < obStep ? "✓" : s.num}
                    </div>
                    <span className={`ob-step-label ${s.num <= obStep ? "active" : "pending"}`}>{s.label}</span>
                  </div>
                  {i < arr.length - 1 && <div className={`ob-step-line ${s.num < obStep ? "done" : "pending"}`} />}
                </div>
              ))}
            </div>

            {/* ── Step 1: Brand ── */}
            {obStep === 1 && (
              <div>
                <h2 className="ob-title">Tell us about your brand</h2>
                <p className="ob-subtitle">We&apos;ll use this to find how your brand appears across AI search engines.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#4A5D66", marginBottom: 6, display: "block" }}>Website URL</label>
                    <div style={{ position: "relative" }}>
                      <Globe style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#8A9BA3" }} />
                      <input
                        className="ob-input"
                        style={{ paddingLeft: 40 }}
                        placeholder="https://yourbrand.com"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        onBlur={handleUrlBlur}
                      />
                    </div>
                  </div>
                  {detecting && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#FDF1EE", borderRadius: 10 }}>
                      <Loader2 style={{ width: 14, height: 14, color: "#EF4623", animation: "spin 1s linear infinite" }} />
                      <span style={{ fontSize: 13, color: "#EF4623", fontWeight: 500 }}>Detecting brand...</span>
                    </div>
                  )}
                  {brandName && !detecting && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#ECFDF5", borderRadius: 10 }}>
                      <Check style={{ width: 14, height: 14, color: "#047857" }} />
                      <span style={{ fontSize: 13, color: "#047857", fontWeight: 600 }}>Brand detected: {brandName}</span>
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#4A5D66", marginBottom: 6, display: "block" }}>Market</label>
                      <select className="ob-select" value={market} onChange={e => setMarket(e.target.value)}>
                        {MARKETS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#4A5D66", marginBottom: 6, display: "block" }}>Language</label>
                      <select className="ob-select" value={language} onChange={e => setLanguage(e.target.value)}>
                        {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <button
                    className="ob-btn ob-btn-primary"
                    disabled={!url.trim() || analysing}
                    onClick={handleStep1Submit}
                    style={{ marginTop: 8 }}
                  >
                    {analysing ? (
                      <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> Analysing your brand...</>
                    ) : "Analyse my brand"}
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 2: Prompts ── */}
            {obStep === 2 && (
              <div>
                <h2 className="ob-title">Select your tracking prompts</h2>
                <p className="ob-subtitle">We found {totalChecked} prompts across {topics.filter(t => t.checked).length} topics that people ask AI about your market.</p>
                <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20, minHeight: 400 }}>
                  {/* Left: topics */}
                  <div style={{ borderRight: "1px solid #E8EAEB", paddingRight: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#8A9BA3", marginBottom: 12 }}>Topics</div>
                    {topics.map(t => (
                      <div
                        key={t.id}
                        className={`ob-topic-item${selectedTopicId === t.id ? " selected" : ""}`}
                        onClick={() => setSelectedTopicId(t.id)}
                      >
                        <div className={`ob-checkbox${t.checked ? " checked" : ""}`} onClick={e => { e.stopPropagation(); toggleTopic(t.id); }}>
                          {t.checked && <Check style={{ width: 12, height: 12, color: "#fff" }} />}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#2D3B42" }}>{t.name}</div>
                          <div style={{ fontSize: 11, color: "#8A9BA3" }}>{t.prompts.filter(p => p.checked).length} prompts</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Right: prompts for selected topic */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#2D3B42" }}>{selectedTopic?.name}</span>
                      <span style={{ fontSize: 12, color: "#8A9BA3", fontWeight: 600 }}>{totalChecked}/50 prompts</span>
                    </div>
                    <div style={{ maxHeight: 320, overflowY: "auto" }}>
                      {selectedTopic?.prompts.map(p => (
                        <div key={p.id} className="ob-prompt-row">
                          <div className={`ob-checkbox${p.checked ? " checked" : ""}`} onClick={() => togglePrompt(selectedTopicId, p.id)} style={{ width: 18, height: 18, borderRadius: 5 }}>
                            {p.checked && <Check style={{ width: 10, height: 10, color: "#fff" }} />}
                          </div>
                          <span style={{ flex: 1, fontSize: 13, color: "#2D3B42" }}>{p.text}</span>
                          <span style={{ fontSize: 11, color: "#8A9BA3", fontWeight: 600 }}>{p.volume}</span>
                          <button onClick={() => removePrompt(selectedTopicId, p.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                            <X style={{ width: 14, height: 14, color: "#8A9BA3" }} />
                          </button>
                        </div>
                      ))}
                    </div>
                    {/* Add prompt */}
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <input
                        className="ob-input"
                        style={{ flex: 1, padding: "10px 14px", fontSize: 13 }}
                        placeholder="Add a custom prompt..."
                        value={newPromptText}
                        onChange={e => setNewPromptText(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && addPrompt()}
                      />
                      <button onClick={addPrompt} style={{ background: "#FDF1EE", border: "none", borderRadius: 10, padding: "0 14px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                        <Plus style={{ width: 16, height: 16, color: "#EF4623" }} />
                      </button>
                    </div>
                    <button
                      className="ob-btn ob-btn-primary"
                      style={{ marginTop: 20 }}
                      disabled={totalChecked === 0}
                      onClick={() => setObStep(3)}
                    >
                      Start tracking ({totalChecked} prompts)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 3: Running analysis ── */}
            {obStep === 3 && (
              <div>
                <h2 className="ob-title">
                  {completedCount === LLM_MODELS.length ? "Your dashboard is ready!" : "Running your first analysis..."}
                </h2>
                <p className="ob-subtitle">
                  {completedCount === LLM_MODELS.length
                    ? "We found your brand across AI engines. Redirecting to your dashboard..."
                    : "We're querying each AI engine with your prompts. This usually takes about 20 seconds."
                  }
                </p>
                <div style={{ maxWidth: 480, margin: "0 auto" }}>
                  {LLM_MODELS.map((model, i) => (
                    <div key={model.key} className={`ob-model-row ${modelStatuses[i]}`}>
                      <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{model.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "#2D3B42" }}>{model.name}</span>
                          {modelStatuses[i] === "querying" && <span style={{ fontSize: 12, color: "#EF4623", fontWeight: 500 }}>Querying...</span>}
                          {modelStatuses[i] === "done" && <span style={{ fontSize: 12, color: "#047857", fontWeight: 500 }}>✓ Done</span>}
                          {modelStatuses[i] === "waiting" && <span style={{ fontSize: 12, color: "#8A9BA3" }}>Waiting</span>}
                        </div>
                        {modelStatuses[i] === "done" && modelResults[i] && (
                          <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: modelResults[i]!.mentioned ? "#ECFDF5" : "#FEF2F2", color: modelResults[i]!.mentioned ? "#047857" : "#DC2626" }}>
                              {modelResults[i]!.mentioned ? "✓ Mentioned" : "✗ Not mentioned"}
                            </span>
                            {modelResults[i]!.position && (
                              <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "#FDF1EE", color: "#EF4623" }}>
                                Position #{modelResults[i]!.position}
                              </span>
                            )}
                            <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "#F0F0F4", color: "#4A5D66" }}>
                              {modelResults[i]!.sentiment}
                            </span>
                          </div>
                        )}
                      </div>
                      <div style={{ width: 24, display: "flex", justifyContent: "center" }}>
                        {modelStatuses[i] === "waiting" && <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid #E8EAEB" }} />}
                        {modelStatuses[i] === "querying" && <Loader2 style={{ width: 18, height: 18, color: "#EF4623", animation: "spin 1s linear infinite" }} />}
                        {modelStatuses[i] === "done" && (
                          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#047857", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Check style={{ width: 12, height: 12, color: "#fff" }} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Progress bar */}
                  <div style={{ marginTop: 20, textAlign: "center" }}>
                    <div style={{ height: 4, background: "#E8EAEB", borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
                      <div style={{ height: "100%", borderRadius: 2, transition: "width 0.5s", background: completedCount === LLM_MODELS.length ? "#047857" : "#EF4623", width: `${(completedCount / LLM_MODELS.length) * 100}%` }} />
                    </div>
                    <span style={{ fontSize: 12, color: "#8A9BA3" }}>{completedCount}/{LLM_MODELS.length} engines complete · {elapsed}s elapsed</span>
                  </div>

                  {/* Early results teaser */}
                  {completedCount >= 2 && (
                    <div style={{ marginTop: 24, padding: 18, background: "#FDF1EE", border: "1px solid rgba(239,70,35,0.08)", borderRadius: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#EF4623", marginBottom: 12 }}>Early results</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                        <div style={{ background: "#fff", borderRadius: 8, padding: 12, textAlign: "center" }}>
                          <div style={{ fontSize: 24, fontWeight: 700, color: "#2D3B42", fontFamily: "'Instrument Serif', serif" }}>{Math.round((completedCount / LLM_MODELS.length) * 74)}%</div>
                          <div style={{ fontSize: 10, color: "#8A9BA3", marginTop: 2 }}>Visibility</div>
                        </div>
                        <div style={{ background: "#fff", borderRadius: 8, padding: 12, textAlign: "center" }}>
                          <div style={{ fontSize: 24, fontWeight: 700, color: "#2D3B42", fontFamily: "'Instrument Serif', serif" }}>#2.5</div>
                          <div style={{ fontSize: 10, color: "#8A9BA3", marginTop: 2 }}>Avg Position</div>
                        </div>
                        <div style={{ background: "#fff", borderRadius: 8, padding: 12, textAlign: "center" }}>
                          <div style={{ fontSize: 24, fontWeight: 700, color: "#047857", fontFamily: "'Instrument Serif', serif" }}>80%</div>
                          <div style={{ fontSize: 10, color: "#8A9BA3", marginTop: 2 }}>Positive</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
