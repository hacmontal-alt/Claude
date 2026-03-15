"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CALENDLY_URL = "https://calendly.com/trace-demo";

const AI_NAMES = ["ChatGPT", "Gemini", "Perplexity", "Grok", "Claude", "AI Overviews"];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [aiIndex, setAiIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAiIndex(prev => (prev + 1) % AI_NAMES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

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
          <li><a href="#how-it-works">How it works</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#">Blog</a></li>
        </ul>
        <Link href="/signup" className="nav-cta">Start Free</Link>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-1"></div>
        <div className="hero-bg-2"></div>
        <div className="hero-badge fade-up"><span className="hero-badge-dot"></span> AI Search is the new SEO</div>
        <h1 className="lp-h1 fade-up delay-1">Be the brand<br /><em key={aiIndex} className="ai-cycle-text">{AI_NAMES[aiIndex]}</em><br />recommends</h1>
        <p className="hero-sub fade-up delay-2">Track exactly how your brand appears across ChatGPT, Perplexity, Google AI Overviews and every major AI engine. Know where you stand. Know what to fix.</p>
        <div className="hero-ctas fade-up delay-3">
          <Link href="/signup" className="btn-primary">Start for free</Link>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">Schedule a demo</a>
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
              <Link href="/signup" className="price-btn">Get started</Link>
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
              <Link href="/signup" className="price-btn">Get started</Link>
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
              <Link href="/signup" className="price-btn">Get started</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <div className="cta-dots"></div>
        <h2 className="cta-h2">Leave your trace.<br />Start today.</h2>
        <p className="cta-sub">Your competitors are already tracking their AI visibility. Don&apos;t fall behind.</p>
        <Link href="/signup" className="cta-btn">Start free — no credit card</Link>
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
    </>
  );
}
