import { useState } from "react";
const C = {
  bg: "#F8F8FA", white: "#FFFFFF", sidebar: "#FAFAFA",
  sidebarActive: "#EDEFFF", border: "#E4E5EA", borderLight: "#EEEFF2",
  accent: "#4F46E5", accentLight: "#EDEFFF", accentText: "#4338CA",
  green: "#059669", greenLight: "#ECFDF5", greenText: "#047857",
  red: "#DC2626", redLight: "#FEF2F2",
  orange: "#D97706", orangeLight: "#FFFBEB", orangeText: "#B45309",
  purple: "#7C3AED", purpleLight: "#F5F3FF",
  cyan: "#0891B2", cyanLight: "#ECFEFF",
  t1: "#18181B", t2: "#71717A", t3: "#A1A1AA", t4: "#D4D4D8",
};
const F = "'Inter', system-ui, sans-serif";
const M = "'JetBrains Mono', monospace";
// Icons
const IC = {
  overview: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></svg>,
  prompts: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="5.5"/><path d="M8 5.5v3l2 1.5"/></svg>,
  sources: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 10l-2.5 2.5M10 6l2.5-2.5M6.5 9.5l3-3M4.5 7.5a3 3 0 01-.5-4 3 3 0 014 .5M8.5 11.5a3 3 0 004-.5 3 3 0 00-.5-4"/></svg>,
  impact: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12l3.5-4 3 2.5L14 4"/><path d="M10 4h4v4"/></svg>,
  earned: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1l2.5 3H14v3.5L12.5 10 14 13H11l-3 2-3-2H2l1.5-3L2 7.5V4h3.5z"/></svg>,
  content: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 2h7l3 3v9H3V2z"/><path d="M5 8h6M5 10.5h4"/></svg>,
  research: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/></svg>,
  actions: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 1L4 9h4l-1 6 5-8H8l1-6z"/></svg>,
  opportunities: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1v2M3 3l1.5 1.5M13 3l-1.5 1.5M2 8h2M12 8h2"/><circle cx="8" cy="8" r="3.5"/><path d="M6.5 12h3v2h-3z"/></svg>,
  settings: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="2"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4"/></svg>,
  brand: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="12" height="10" rx="2"/><path d="M5 7h6M5 9.5h3"/></svg>,
  tag: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 2h5.5l6.5 6.5-5 5L2 7V2z"/><circle cx="5.5" cy="5.5" r="1" fill="currentColor"/></svg>,
  project: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h3l2-2h7v10H2V4z"/></svg>,
  key: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="5.5" cy="9" r="3"/><path d="M8 7l5.5-5.5M11 4l2 2"/></svg>,
  members: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="5" r="2.5"/><path d="M1 14c0-3.3 2.2-5 5-5s5 1.7 5 5"/><circle cx="11.5" cy="5.5" r="1.5"/><path d="M14.5 13c0-2-1.2-3-2.5-3"/></svg>,
  billing: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1.5" y="3" width="13" height="10" rx="2"/><path d="M1.5 7h13"/></svg>,
};
// Shared components
const Metric = ({ label, value, change, sub, s }) => (
  <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: s ? "10px 12px" : "14px 18px", flex: 1, minWidth: s ? 90 : 130 }}>
    <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontWeight: 500 }}>{label}</div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
      <span style={{ fontSize: s ? 18 : 26, fontWeight: 700, color: C.t1 }}>{value}</span>
      {change && <span style={{ fontSize: 10, fontWeight: 600, borderRadius: 3, padding: "1px 5px", color: change.startsWith("+") ? C.greenText : change.startsWith("-") ? C.red : C.t3, background: change.startsWith("+") ? C.greenLight : change.startsWith("-") ? C.redLight : "transparent" }}>{change}</span>}
    </div>
    {sub && <div style={{ fontSize: 9, color: C.t3, marginTop: 2 }}>{sub}</div>}
  </div>
);
const Tabs = ({ items, active, set }) => (
  <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.border}`, marginBottom: 16 }}>
    {items.map(t => {
      const isO = typeof t === "object";
      const l = isO ? t.label : t;
      const b = isO ? t.badge : null;
      return (
        <button key={l} onClick={() => set(l)} style={{
          padding: "8px 14px", border: "none", cursor: "pointer", fontSize: 12,
          fontWeight: active === l ? 600 : 400, color: active === l ? C.accent : C.t2,
          borderBottom: active === l ? `2px solid ${C.accent}` : "2px solid transparent",
          background: "transparent", marginBottom: -1, display: "flex", alignItems: "center", gap: 5,
        }}>
          {l}
          {b && <span style={{ fontSize: 9, fontWeight: 600, background: C.accentLight, color: C.accentText, borderRadius: 8, padding: "1px 5px" }}>{b}</span>}
        </button>
      );
    })}
  </div>
);
const Tag = ({ label, color, s }) => {
  const cols = {
    green: [C.greenLight, C.greenText], purple: [C.purpleLight, C.purple],
    orange: [C.orangeLight, C.orangeText], cyan: [C.cyanLight, C.cyan],
    accent: [C.accentLight, C.accentText], red: [C.redLight, C.red],
    gray: ["#F0F0F4", C.t2],
  };
  const [bg, fg] = cols[color] || cols.gray;
  return <span style={{ fontSize: s ? 9 : 10, fontWeight: 500, padding: s ? "1px 5px" : "2px 7px", borderRadius: 4, background: bg, color: fg, whiteSpace: "nowrap" }}>{label}</span>;
};
const Bar = ({ v }) => (
  <div style={{ width: 44, height: 4, background: "#E4E5EA", borderRadius: 2, overflow: "hidden" }}>
    <div style={{ height: "100%", width: `${Math.min(v, 100)}%`, borderRadius: 2, background: v > 60 ? C.green : v > 30 ? C.orange : v > 0 ? C.red : C.t4 }} />
  </div>
);
const Spark = ({ d }) => (
  <div style={{ width: 40, height: 14, display: "flex", alignItems: "end", gap: 1 }}>
    {d.map((v, i) => <div key={i} style={{ flex: 1, height: `${v}%`, background: C.accent, borderRadius: 1, opacity: 0.2 + (i / d.length) * 0.8 }} />)}
  </div>
);
// Nav components
const Sec = ({ label }) => (
  <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: C.t3, padding: "18px 14px 5px" }}>{label}</div>
);
const NavBtn = ({ icon, label, active, onClick, badge }) => (
  <div onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", cursor: "pointer",
    background: active ? C.sidebarActive : "transparent", borderRadius: 6, margin: "1px 6px",
  }}>
    <span style={{ color: C.t3, display: "flex", alignItems: "center" }}>{icon}</span>
    <span style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: active ? C.accentText : C.t1, flex: 1 }}>{label}</span>
    {badge && <span style={{ fontSize: 9, fontWeight: 500, color: C.t3, background: C.borderLight, borderRadius: 8, padding: "1px 5px" }}>{badge}</span>}
  </div>
);
const SubNavBtn = ({ icon, label, onClick, active }) => (
  <div onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 7, padding: "5px 12px 5px 20px",
    cursor: "pointer", borderRadius: 5, margin: "0 6px",
    background: active ? C.sidebarActive : "transparent",
  }}>
    <span style={{ color: C.t3, display: "flex", alignItems: "center" }}>{icon}</span>
    <span style={{ fontSize: 12, color: active ? C.accentText : C.t2, fontWeight: active ? 500 : 400 }}>{label}</span>
  </div>
);
// ── GETTING STARTED ──
function GettingStartedPage({ onDismiss }) {
  const [ch, setCh] = useState([false, false, false, false, false, false]);
  const toggle = i => { const n = [...ch]; n[i] = !n[i]; setCh(n); };
  const done = ch.filter(Boolean).length;
  const steps = [
    { t: "Add your brand details", d: "Brand name, domain, key products.", a: "Set up" },
    { t: "Define your topics", d: "Group prompts into topics.", a: "Add topics" },
    { t: "Add competitors", d: "We'll compare them vs you.", a: "Add" },
    { t: "Add prompts to track", d: "Questions customers ask AI.", a: "Add prompts" },
    { t: "See competitor comparison", d: "Who's winning your prompts.", a: "View" },
    { t: "Take your first action", d: "Create content or outreach.", a: "Go" },
  ];
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 2px" }}>Welcome to Spotlight</h1>
      <p style={{ fontSize: 13, color: C.t2, margin: "0 0 16px" }}>Complete these steps to get started</p>
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>Progress</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.accent }}>{done}/6</span>
        </div>
        <div style={{ height: 4, background: C.borderLight, borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${(done/6)*100}%`, background: C.accent, borderRadius: 2, transition: "width 0.3s" }} />
        </div>
        {done === 6 && <button onClick={onDismiss} style={{ marginTop: 8, background: C.accent, color: "#fff", border: "none", borderRadius: 7, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Go to Overview →</button>}
      </div>
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 14, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: C.t1, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, flexShrink: 0 }}>▶</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>Daily Getting Started Session</div>
          <div style={{ fontSize: 11, color: C.t2 }}>Live walkthrough with Q&A</div>
        </div>
        <button style={{ background: C.white, color: C.t1, border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 12px", fontSize: 11, cursor: "pointer" }}>Reserve</button>
        <button style={{ color: C.t3, background: "none", border: "none", fontSize: 11, cursor: "pointer" }}>Dismiss</button>
      </div>
      {steps.map((s, i) => (
        <div key={i} style={{ background: C.white, border: `1px solid ${ch[i] ? C.green+"33" : C.border}`, borderRadius: 8, padding: "10px 14px", marginBottom: 3, display: "flex", gap: 10, alignItems: "center" }}>
          <div onClick={() => toggle(i)} style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${ch[i] ? C.green : C.t4}`, background: ch[i] ? C.greenLight : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.green, fontWeight: 700, flexShrink: 0 }}>{ch[i] ? "✓" : ""}</div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: ch[i] ? C.t3 : C.t1, textDecoration: ch[i] ? "line-through" : "none" }}>{s.t}</span>
            <span style={{ fontSize: 11, color: C.t3, marginLeft: 8 }}>{s.d}</span>
          </div>
          <button style={{ background: ch[i] ? "none" : C.accentLight, color: ch[i] ? C.t3 : C.accentText, border: `1px solid ${ch[i] ? C.border : C.accent+"18"}`, borderRadius: 5, padding: "4px 10px", fontSize: 10, fontWeight: 500, cursor: "pointer" }}>{ch[i] ? "Done" : s.a}</button>
        </div>
      ))}
    </div>
  );
}
// ── OVERVIEW ──
function OverviewPage() {
  const [vizRange, setVizRange] = useState("W");
  const [customizing, setCustomizing] = useState(false);
  const [showBrandOnly, setShowBrandOnly] = useState(false);
  const allSections = [
    { id: "visibility", label: "Visibility Chart" },
    { id: "brands", label: "Brands Table" },
    { id: "actions", label: "Actions" },
    { id: "sources", label: "Top Sources" },
    { id: "chats", label: "Recent Chats" },
  ];
  const [visibleSections, setVisibleSections] = useState(allSections.map(s => s.id));
  const toggleSection = id => setVisibleSections(v => v.includes(id) ? v.filter(x => x !== id) : [...v, id]);
  const show = id => visibleSections.includes(id);
  const Donut = ({ data, size }) => {
    const total = data.reduce((a, b) => a + b.v, 0);
    let cum = 0;
    const r = (size - 8) / 2, cx = size/2, cy = size/2;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((d, i) => {
          const angle = (d.v / total) * 360;
          const sa = (cum - 90) * Math.PI / 180;
          cum += angle;
          const ea = (cum - 90) * Math.PI / 180;
          const large = angle > 180 ? 1 : 0;
          const x1 = cx + r * Math.cos(sa), y1 = cy + r * Math.sin(sa);
          const x2 = cx + r * Math.cos(ea), y2 = cy + r * Math.sin(ea);
          return <path key={i} d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`} fill={d.c} />;
        })}
        <circle cx={cx} cy={cy} r={r * 0.58} fill={C.white} />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="15" fontWeight="700" fill={C.t1} fontFamily={F}>{total}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="7" fill={C.t3} fontFamily={F}>Citations</text>
      </svg>
    );
  };
  const VisChart = () => {
    const dataW = [
      { d: "Feb 16", v: 35 }, { d: "Feb 17", v: 38 }, { d: "Feb 18", v: 42 },
      { d: "Feb 19", v: 55 }, { d: "Feb 20", v: 60 }, { d: "Feb 21", v: 65 }, { d: "Feb 22", v: 72.6 },
    ];
    const dataM = [
      { d: "Jan 22", v: 20 }, { d: "Jan 29", v: 35 }, { d: "Feb 5", v: 45 },
      { d: "Feb 12", v: 58 }, { d: "Feb 19", v: 65 }, { d: "Feb 22", v: 72.6 },
    ];
    const data = vizRange === "W" ? dataW : vizRange === "D" ? dataW.slice(-3) : dataM;
    const w = 440, h = 160, pad = { t: 10, b: 24, l: 32, r: 10 };
    const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;
    const maxV = 100;
    const pts = data.map((d, i) => ({
      x: pad.l + (i / (data.length - 1)) * cw,
      y: pad.t + ch - (d.v / maxV) * ch,
    }));
    const line = pts.map(p => `${p.x},${p.y}`).join(" ");
    const area = `${pad.l},${pad.t + ch} ${line} ${pts[pts.length-1].x},${pad.t + ch}`;
    return (
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
        {[0, 25, 50, 75, 100].map(v => {
          const y = pad.t + ch - (v / maxV) * ch;
          return (
            <g key={v}>
              <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke={C.borderLight} strokeWidth="0.5" />
              <text x={pad.l - 4} y={y + 3} textAnchor="end" fontSize="8" fill={C.t3} fontFamily={F}>{v}%</text>
            </g>
          );
        })}
        <polygon points={area} fill={C.accent} opacity="0.08" />
        <polyline points={line} fill="none" stroke={C.accent} strokeWidth="2" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3" fill={C.white} stroke={C.accent} strokeWidth="1.5" />
            <text x={p.x} y={h - 4} textAnchor="middle" fontSize="8" fill={C.t3} fontFamily={F}>{data[i].d}</text>
          </g>
        ))}
        <rect x={pts[pts.length-1].x - 22} y={pts[pts.length-1].y - 18} width="44" height="14" rx="3" fill={C.accent} />
        <text x={pts[pts.length-1].x} y={pts[pts.length-1].y - 8} textAnchor="middle" fontSize="8" fontWeight="600" fill="#fff" fontFamily={F}>{data[data.length-1].v}%</text>
      </svg>
    );
  };
  const brands = [
    { r: 1, n: "Nespresso", icon: "☕", v: 72.6, sent: "Positive", pos: 2.9, you: true },
    { r: 2, n: "Keurig", icon: "🟤", v: 55.2, sent: "Positive", pos: 3.8 },
    { r: 3, n: "Breville", icon: "⚙️", v: 28.0, sent: "Neutral", pos: 5.4 },
    { r: 4, n: "De'Longhi", icon: "🇮🇹", v: 21.1, sent: "Neutral", pos: 6.1 },
    { r: 5, n: "Ninja", icon: "🥷", v: 20.5, sent: "Positive", pos: 7.3 },
    { r: 6, n: "AeroPress", icon: "💨", v: 18.4, sent: "Positive", pos: 7.5 },
    { r: 7, n: "Starbucks", icon: "⭐", v: 15.1, sent: "Neutral", pos: 8.2 },
  ];
  const sources = [
    { d: "reddit.com", icon: "🔴", used: "90%", avgCit: "0.2", type: "UGC", tc: C.orange },
    { d: "google.com", icon: "🟡", used: "59%", avgCit: "0.1", type: "Other", tc: C.t3 },
    { d: "nespresso.com", icon: "☕", used: "23%", avgCit: "0.4", type: "Corporate", tc: C.cyan },
    { d: "youtube.com", icon: "▶️", used: "20%", avgCit: "0.1", type: "UGC", tc: C.orange },
    { d: "cnet.com", icon: "📱", used: "16%", avgCit: "1.4", type: "Editorial", tc: C.accent },
    { d: "wirecutter.com", icon: "✂️", used: "14%", avgCit: "1.1", type: "Editorial", tc: C.accent },
  ];
  const donutData = [
    { l: "Editorial", v: 238, c: C.accent },
    { l: "UGC", v: 196, c: C.orange },
    { l: "Corporate", v: 142, c: C.cyan },
    { l: "Other", v: 64, c: C.t3 },
    { l: "Reference", v: 35, c: C.purple },
    { l: "Institutional", v: 12, c: C.green },
  ];
  const recentChats = [
    { q: "What are the top-rated espresso machines for home use?", preview: "For home espresso, the most popular machines include Nespresso Vertuo, Breville Barista Express, and De'Longhi...", models: ["ChatGPT", "Gemini"], time: "3 hr. ago", mentioned: true },
    { q: "Which easy coffee makers brew real espresso?", preview: "For easy espresso at home, Nespresso machines lead the category with single-button operation. The Vertuo line...", models: ["Perplexity"], time: "3 hr. ago", mentioned: true },
    { q: "Best single-serve coffee machines 2026?", preview: "The top single-serve machines for 2026 include Keurig K-Supreme, Nespresso Vertuo Pop, and Hamilton Beach...", models: ["ChatGPT", "Grok"], time: "5 hr. ago", mentioned: true },
    { q: "Is Nespresso worth the price compared to regular coffee?", preview: "Nespresso pods cost about $0.80-1.10 per cup, which is more expensive than drip coffee but significantly less...", models: ["Gemini"], time: "5 hr. ago", mentioned: true },
    { q: "How do capsule coffee machines work?", preview: "Capsule coffee machines work by puncturing a sealed pod and forcing hot water through the grounds at high...", models: ["ChatGPT"], time: "6 hr. ago", mentioned: false },
    { q: "Most sustainable coffee pod options?", preview: "When it comes to sustainability, Nespresso leads with their recycling program. Their aluminum pods are 100%...", models: ["Perplexity", "Gemini"], time: "7 hr. ago", mentioned: true },
    { q: "Espresso machine maintenance tips?", preview: "Regular maintenance is key to espresso machine longevity. Descale every 3 months, clean the group head weekly...", models: ["ChatGPT"], time: "7 hr. ago", mentioned: false },
    { q: "Nespresso vs Keurig which is better?", preview: "Both systems have strengths: Nespresso excels in espresso quality with higher pressure and crema, while Keurig...", models: ["Grok", "ChatGPT"], time: "8 hr. ago", mentioned: true },
  ];
  const modelIcon = m => m === "ChatGPT" ? "🟢" : m === "Gemini" ? "🔵" : m === "Perplexity" ? "🟣" : m === "Grok" ? "⚫" : "🔴";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.t1, margin: 0 }}>Overview</h1>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button onClick={() => setCustomizing(!customizing)} style={{
            background: customizing ? C.accent : C.white, color: customizing ? "#fff" : C.t2,
            border: `1px solid ${customizing ? C.accent : C.border}`, borderRadius: 6,
            padding: "5px 10px", fontSize: 11, fontWeight: 500, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            {IC.settings}
            {customizing ? "Done" : "Customize"}
          </button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
        <select style={{ padding: "5px 10px", borderRadius: 20, border: `1px solid ${C.border}`, fontSize: 11, color: C.t1, background: C.white, cursor: "pointer" }}><option>Nespresso</option></select>
        <select style={{ padding: "5px 10px", borderRadius: 20, border: `1px solid ${C.border}`, fontSize: 11, color: C.t1, background: C.white, cursor: "pointer" }}><option>Last 7 days</option><option>Last 30 days</option></select>
        <select style={{ padding: "5px 10px", borderRadius: 20, border: `1px solid ${C.border}`, fontSize: 11, color: C.t1, background: C.white, cursor: "pointer" }}><option>All Tags</option></select>
        <select style={{ padding: "5px 10px", borderRadius: 20, border: `1px solid ${C.border}`, fontSize: 11, color: C.t1, background: C.white, cursor: "pointer" }}><option>All Models</option></select>
        <select style={{ padding: "5px 10px", borderRadius: 20, border: `1px solid ${C.border}`, fontSize: 11, color: C.t1, background: C.white, cursor: "pointer" }}><option>All Topics</option></select>
      </div>
      {customizing && (
        <div style={{ background: C.accentLight, border: `1px solid ${C.accent}22`, borderRadius: 8, padding: 10, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.accentText, marginBottom: 6 }}>Toggle sections</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {allSections.map(s => (
              <button key={s.id} onClick={() => toggleSection(s.id)} style={{
                padding: "4px 10px", borderRadius: 5, fontSize: 10, fontWeight: 500, cursor: "pointer",
                background: visibleSections.includes(s.id) ? C.accent : C.white,
                color: visibleSections.includes(s.id) ? "#fff" : C.t2,
                border: `1px solid ${visibleSections.includes(s.id) ? C.accent : C.border}`,
              }}>{s.label}</button>
            ))}
          </div>
        </div>
      )}
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        {show("visibility") && (
          <div style={{ flex: 1, background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>Visibility</span>
                <span style={{ fontSize: 10, color: C.t3, marginLeft: 6 }}>Percentage of chats mentioning each brand</span>
              </div>
              <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
                {["D", "W", "M"].map(r => (
                  <button key={r} onClick={() => setVizRange(r)} style={{
                    padding: "3px 10px", fontSize: 10, fontWeight: vizRange === r ? 600 : 400,
                    background: vizRange === r ? C.t1 : "transparent", color: vizRange === r ? "#fff" : C.t2,
                    border: `1px solid ${C.border}`, cursor: "pointer",
                    borderRadius: r === "D" ? "4px 0 0 4px" : r === "M" ? "0 4px 4px 0" : 0,
                    borderLeft: r !== "D" ? "none" : undefined,
                  }}>{r}</button>
                ))}
                <button style={{ marginLeft: 6, background: "none", border: `1px solid ${C.border}`, borderRadius: 4, padding: "3px 6px", cursor: "pointer", fontSize: 10, color: C.t3 }}>↗</button>
              </div>
            </div>
            <VisChart />
          </div>
        )}
        {show("brands") && (
          <div style={{ flex: 1, background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>Brands</span>
                <span style={{ fontSize: 10, color: C.t3, marginLeft: 6 }}>Top brands across LLMs for your prompts</span>
              </div>
              <span style={{ fontSize: 10, color: C.accent, cursor: "pointer" }}>Show All ↗</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "26px 1fr 60px 70px 50px", gap: 4, padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: C.t3 }}>#</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: C.t3 }}>Brand</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textAlign: "right" }}>Visibility</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textAlign: "center" }}>Sentiment</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textAlign: "right" }}>Position</span>
            </div>
            {brands.map(b => (
              <div key={b.n} style={{ display: "grid", gridTemplateColumns: "26px 1fr 60px 70px 50px", gap: 4, padding: "6px 0", borderBottom: `1px solid ${C.borderLight}`, alignItems: "center", background: b.you ? C.accentLight+"44" : "transparent", borderRadius: b.you ? 4 : 0 }}>
                <span style={{ fontSize: 11, color: C.t3, textAlign: "center" }}>{b.r}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 13 }}>{b.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: b.you ? 600 : 400, color: b.you ? C.accentText : C.t1 }}>{b.n}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: b.v > 0 ? C.t1 : C.t3, textAlign: "right" }}>{b.v}%</span>
                <div style={{ textAlign: "center" }}>
                  {b.sent !== "--" ? (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: b.sent === "Positive" ? C.green : b.sent === "Neutral" ? C.t4 : C.red }} />
                      <span style={{ fontSize: 10, color: C.t2 }}>{b.sent}</span>
                    </div>
                  ) : <span style={{ fontSize: 10, color: C.t3 }}>—</span>}
                </div>
                <span style={{ fontSize: 11, color: b.pos ? C.t1 : C.t3, textAlign: "right" }}>{b.pos || "—"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {show("actions") && (
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.t1, marginBottom: 10 }}>Improve Visibility</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, cursor: "pointer", transition: "all 0.15s" }}
                   onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.background = C.accentLight+"33"; }}
                   onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "transparent"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 7, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent }}>{IC.content}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>Create Content</div>
                    <div style={{ fontSize: 10, color: C.t3 }}>7 content gaps found</div>
                  </div>
                </div>
                {[{ p: "Top espresso machines for home", v: "336K vol" }, { p: "Easy coffee makers with espresso", v: "222K vol" }, { p: "Cafe-quality espresso at home", v: "127K vol" }].map((g, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderTop: `1px solid ${C.borderLight}` }}>
                    <span style={{ fontSize: 10, color: C.t2 }}>{g.p}</span>
                    <span style={{ fontSize: 9, color: C.t3, fontFamily: M, flexShrink: 0, marginLeft: 6 }}>{g.v}</span>
                  </div>
                ))}
                <button style={{ marginTop: 8, width: "100%", background: C.accent, color: "#fff", border: "none", borderRadius: 6, padding: "7px 0", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Create Content →</button>
              </div>
              <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, cursor: "pointer", transition: "all 0.15s" }}
                   onMouseEnter={e => { e.currentTarget.style.borderColor = C.purple; e.currentTarget.style.background = C.purpleLight+"33"; }}
                   onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "transparent"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 7, background: C.purpleLight, display: "flex", alignItems: "center", justifyContent: "center", color: C.purple }}>{IC.earned}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>Earned & Outreach</div>
                    <div style={{ fontSize: 10, color: C.t3 }}>14 opportunities</div>
                  </div>
                </div>
                {[{ t: "r/espresso — best machines thread", u: "High" }, { t: "CNET review — pitch for update", u: "Very High" }, { t: "Wirecutter — new capsule roundup", u: "High" }].map((o, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderTop: `1px solid ${C.borderLight}` }}>
                    <span style={{ fontSize: 10, color: C.t2 }}>{o.t}</span>
                    <Tag label={o.u} color={o.u.includes("Very") ? "red" : "orange"} s />
                  </div>
                ))}
                <button style={{ marginTop: 8, width: "100%", background: C.purple, color: "#fff", border: "none", borderRadius: 6, padding: "7px 0", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>View Opportunities →</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {show("sources") && (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>Top Sources</span>
              <span style={{ fontSize: 10, color: C.t3, marginLeft: 6 }}>Sources across active models</span>
            </div>
            <span style={{ fontSize: 10, color: C.accent, cursor: "pointer" }}>Show All ↗</span>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 10, color: C.t3, marginBottom: 4 }}>Domain type</div>
              <Donut data={donutData} size={110} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6, justifyContent: "center", maxWidth: 130 }}>
                {donutData.map(d => (
                  <div key={d.l} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 9, color: C.t2 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 1, background: d.c }} />
                    {d.l}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 55px 70px 80px", gap: 4, padding: "4px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ display: "inline-flex", width: 13, height: 13, borderRadius: "50%", background: C.bg, alignItems: "center", justifyContent: "center", fontSize: 8 }}>🌐</span>
                  Domain
                </span>
                <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textAlign: "right" }}>Used</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textAlign: "right" }}>Avg. Citations</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textAlign: "right" }}>Type</span>
              </div>
              {sources.map(s => (
                <div key={s.d} style={{ display: "grid", gridTemplateColumns: "1fr 55px 70px 80px", gap: 4, padding: "6px 0", borderBottom: `1px solid ${C.borderLight}`, alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: 12 }}>{s.icon}</span>
                    <span style={{ fontSize: 12, color: C.t1 }}>{s.d}</span>
                  </div>
                  <span style={{ fontSize: 11, color: C.t1, textAlign: "right" }}>{s.used}</span>
                  <span style={{ fontSize: 11, color: C.t1, textAlign: "right" }}>{s.avgCit}</span>
                  <div style={{ textAlign: "right" }}>
                    <Tag label={s.type} color={s.type === "Editorial" ? "accent" : s.type === "UGC" ? "orange" : s.type === "Corporate" ? "cyan" : "gray"} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {show("chats") && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>Recent Chats</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div onClick={() => setShowBrandOnly(!showBrandOnly)} style={{ width: 30, height: 16, borderRadius: 8, background: showBrandOnly ? C.accent : C.t4, cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                  <div style={{ width: 12, height: 12, borderRadius: 6, background: C.white, position: "absolute", top: 2, left: showBrandOnly ? 16 : 2, transition: "left 0.2s" }} />
                </div>
                <span style={{ fontSize: 11, color: C.t2 }}>Nespresso mentioned</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "thin" }}>
            {recentChats.filter(c => showBrandOnly ? c.mentioned : true).map((chat, i) => (
              <div key={i} style={{
                minWidth: 220, maxWidth: 240, background: C.white, border: `1px solid ${C.border}`,
                borderRadius: 10, padding: 12, cursor: "pointer", flexShrink: 0,
                transition: "border-color 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: C.t1, lineHeight: 1.3, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {chat.q}
                </div>
                <div style={{ fontSize: 10, color: C.t3, lineHeight: 1.4, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {chat.preview}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 2 }}>
                    {chat.models.map(m => (
                      <span key={m} style={{ fontSize: 10 }} title={m}>{modelIcon(m)}</span>
                    ))}
                  </div>
                  <span style={{ fontSize: 9, color: C.t3 }}>{chat.time}</span>
                </div>
                {chat.mentioned && (
                  <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 3 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.green }} />
                    <span style={{ fontSize: 9, color: C.greenText }}>Nespresso mentioned</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
// ── PROMPTS ──
function PromptsPage() {
  const [mainTab, setMainTab] = useState("Active");
  const [selTopic, setSelTopic] = useState("All topics");
  const [tagF, setTagF] = useState("All Tags");
  const [exp, setExp] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showAddT, setShowAddT] = useState(false);
  const topics = [{ n: "All topics", c: 82 }, { n: "Home Espresso", c: 18 }, { n: "Single-Serve", c: 14 }, { n: "Capsules & Flavors", c: 12 }, { n: "Premium Coffee", c: 10 }, { n: "Sustainability", c: 8 }, { n: "Smart Machines", c: 6 }, { n: "No topic", c: 14 }];
  const prompts = [
    { id: 1, p: "What are the top-rated espresso machines for home use?", v: 72.6, pos: 2, sent: "Positive", men: 8, vol: "336,600", topic: "Home Espresso", tags: ["non-branded", "consideration"], loc: "US", added: "Jan 15", models: { ChatGPT: 65, Gemini: 78, Perplexity: 82, Grok: 79 } },
    { id: 2, p: "Which easy-to-use coffee makers can brew espresso?", v: 68.4, pos: 3, sent: "Positive", men: 6, vol: "222,620", topic: "Single-Serve", tags: ["non-branded", "consideration"], loc: "US", added: "Jan 15", models: { ChatGPT: 72, Gemini: 65, Perplexity: 70, Grok: 68 } },
    { id: 3, p: "What coffee machines brew individual cups?", v: 45.2, pos: 5, sent: "Neutral", men: 3, vol: "192,600", topic: "Single-Serve", tags: ["non-branded", "awareness"], loc: "US", added: "Jan 22", models: { ChatGPT: 40, Gemini: 50, Perplexity: 45, Grok: 48 } },
    { id: 4, p: "Best Nespresso capsule flavors for beginners?", v: 93.3, pos: 1, sent: "Positive", men: 12, vol: "158,000", topic: "Capsules & Flavors", tags: ["branded", "decision"], loc: "US", added: "Jan 15", models: { ChatGPT: 95, Gemini: 90, Perplexity: 92, Grok: 96 } },
    { id: 5, p: "Most convenient coffee machines for home?", v: 38.1, pos: 7, sent: "Neutral", men: 2, vol: "158,000", topic: "Home Espresso", tags: ["non-branded", "awareness"], loc: "US", added: "Jan 22", models: { ChatGPT: 35, Gemini: 42, Perplexity: 38, Grok: 40 } },
    { id: 6, p: "Which machines deliver cafe-quality espresso?", v: 0, pos: null, sent: "--", men: 0, vol: "127,100", topic: "Home Espresso", tags: ["non-branded", "consideration"], loc: "US", added: "Feb 1", models: { ChatGPT: 0, Gemini: 0, Perplexity: 0, Grok: 0 } },
    { id: 7, p: "Is Nespresso worth the price?", v: 76.2, pos: 2, sent: "Positive", men: 9, vol: "89,200", topic: "Premium Coffee", tags: ["branded", "decision"], loc: "US", added: "Jan 22", models: { ChatGPT: 78, Gemini: 72, Perplexity: 80, Grok: 75 } },
    { id: 8, p: "How does Nespresso compare to Keurig?", v: 81.5, pos: 1, sent: "Positive", men: 11, vol: "89,200", topic: "Single-Serve", tags: ["branded", "consideration"], loc: "US", added: "Jan 15", models: { ChatGPT: 85, Gemini: 78, Perplexity: 82, Grok: 80 } },
    { id: 9, p: "Nespresso recycling program?", v: 88.9, pos: 1, sent: "Positive", men: 10, vol: "78,100", topic: "Sustainability", tags: ["branded", "post-purchase"], loc: "US", added: "Jan 15", models: { ChatGPT: 90, Gemini: 85, Perplexity: 88, Grok: 92 } },
  ];
  const tc = { branded: "accent", "non-branded": "gray", awareness: "cyan", consideration: "orange", decision: "purple", "post-purchase": "green" };
  let f = prompts;
  if (selTopic !== "All topics") f = f.filter(x => x.topic === selTopic);
  if (tagF !== "All Tags") f = f.filter(x => x.tags.includes(tagF.toLowerCase()));
  const avgV = f.length ? Math.round(f.reduce((a, x) => a + x.v, 0) / f.length) : 0;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.t1, margin: 0 }}>Prompts</h1>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: C.t3 }}>{f.length}/500</span>
          <button onClick={() => setShowAdd(!showAdd)} style={{ background: C.t1, color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ Add Prompt</button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        <select style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11, color: C.t1, background: C.white, cursor: "pointer" }}><option>Nespresso</option></select>
        <select value={tagF} onChange={e => setTagF(e.target.value)} style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11, color: C.t1, background: C.white, cursor: "pointer" }}>
          <option>All Tags</option><option>Branded</option><option>Non-branded</option><option>Awareness</option><option>Consideration</option><option>Decision</option><option>Post-purchase</option>
        </select>
        <select style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11, color: C.t1, background: C.white, cursor: "pointer" }}><option>All Models</option><option>ChatGPT</option><option>Gemini</option><option>Perplexity</option><option>Grok</option></select>
        <select value={selTopic} onChange={e => setSelTopic(e.target.value)} style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${selTopic !== "All topics" ? C.accent : C.border}`, fontSize: 11, color: selTopic !== "All topics" ? C.accentText : C.t1, background: selTopic !== "All topics" ? C.accentLight : C.white, cursor: "pointer", fontWeight: selTopic !== "All topics" ? 500 : 400 }}>
          {topics.map(t => <option key={t.n} value={t.n}>{t.n} ({t.c})</option>)}
        </select>
      </div>
      <Tabs items={[{ label: "Active" }, { label: "Suggested", badge: "+12" }, { label: "Scorecard" }, { label: "Inactive" }]} active={mainTab} set={setMainTab} />
      {mainTab === "Scorecard" ? (
        <div>
          <div style={{ fontSize: 13, color: C.t2, marginBottom: 12 }}>What AI chatbots think about Nespresso</div>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr 1fr 1fr 1fr", gap: 4, padding: "8px 14px", background: C.bg, borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 9, color: C.t3, fontWeight: 600, textTransform: "uppercase" }}>Property</span>
              {["ChatGPT", "Gemini", "Perplexity", "Grok"].map(m => <span key={m} style={{ fontSize: 9, color: C.t3, fontWeight: 600, textTransform: "uppercase", textAlign: "center" }}>{m}</span>)}
            </div>
            {[
              { p: "Emotional Connection", s: ["Exceptional", "Exceptional", "Exceptional", "Exceptional"] },
              { p: "Differentiation", s: ["Exceptional", "Exceptional", "Exceptional", "Exceptional"] },
              { p: "Quality", s: ["Great", "Great", "Great", "Great"] },
              { p: "Innovation", s: ["Great", "Exceptional", "Great", "Great"] },
              { p: "Sustainability", s: ["Moderate", "Exceptional", "Great", "Great"] },
              { p: "Value for Money", s: ["Moderate", "Great", "Good", "Moderate"] },
            ].map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "150px 1fr 1fr 1fr 1fr", gap: 4, padding: "9px 14px", borderBottom: `1px solid ${C.borderLight}`, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: C.t1, fontWeight: 500 }}>{r.p}</span>
                {r.s.map((s, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: s === "Exceptional" ? C.green : s === "Great" ? "#34D399" : C.orange }} />
                    <span style={{ fontSize: 11, color: C.t2 }}>{s}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 0 }}>
          <div style={{ width: 165, flexShrink: 0, borderRight: `1px solid ${C.border}`, paddingRight: 10, marginRight: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: C.t2, textTransform: "uppercase", letterSpacing: 1 }}>Topics</span>
              <button onClick={() => setShowAddT(!showAddT)} style={{ background: "none", border: "none", color: C.accent, fontSize: 14, cursor: "pointer", padding: 0 }}>+</button>
            </div>
            {showAddT && <input placeholder="New topic..." style={{ width: "100%", padding: "4px 6px", borderRadius: 4, border: `1px solid ${C.accent}`, fontSize: 10, outline: "none", marginBottom: 6, boxSizing: "border-box" }} />}
            {topics.map(t => (
              <div key={t.n} onClick={() => setSelTopic(t.n)} style={{ display: "flex", justifyContent: "space-between", padding: "5px 6px", borderRadius: 4, cursor: "pointer", marginBottom: 1, background: selTopic === t.n ? C.accentLight : "transparent" }}>
                <span style={{ fontSize: 12, color: selTopic === t.n ? C.accentText : C.t1, fontWeight: selTopic === t.n ? 600 : 400 }}>{t.n}</span>
                <span style={{ fontSize: 11, color: C.t3 }}>{t.c}</span>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", gap: 14, marginBottom: 10, fontSize: 12, color: C.t2 }}>
              <span>Visibility <strong style={{ color: C.t1 }}>{avgV}%</strong></span>
              <span style={{ color: C.t4 }}>|</span>
              <span>Position <strong style={{ color: C.t1 }}>{f.filter(x => x.pos).length ? (f.filter(x => x.pos).reduce((a, x) => a + (x.pos || 0), 0) / f.filter(x => x.pos).length).toFixed(1) : "--"}</strong></span>
              <div style={{ flex: 1 }} />
              <button style={{ background: "none", border: "none", color: C.t2, fontSize: 11, cursor: "pointer" }}>Export</button>
            </div>
            {showAdd && (
              <div style={{ background: C.accentLight, border: `1px solid ${C.accent}22`, borderRadius: 8, padding: 12, marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.t1, marginBottom: 6 }}>Add prompts</div>
                <textarea placeholder="One prompt per line..." style={{ width: "100%", padding: 8, borderRadius: 5, border: `1px solid ${C.border}`, fontSize: 11, minHeight: 50, resize: "vertical", fontFamily: F, outline: "none", boxSizing: "border-box" }} />
                <div style={{ display: "flex", gap: 5, marginTop: 6 }}>
                  <select style={{ padding: "4px 8px", borderRadius: 4, border: `1px solid ${C.border}`, fontSize: 10 }}><option>Topic...</option>{topics.filter(t => t.n !== "All topics" && t.n !== "No topic").map(t => <option key={t.n}>{t.n}</option>)}</select>
                  <select style={{ padding: "4px 8px", borderRadius: 4, border: `1px solid ${C.border}`, fontSize: 10 }}><option>US</option><option>UK</option><option>DE</option></select>
                  <div style={{ flex: 1 }} />
                  <button style={{ background: C.t1, color: "#fff", border: "none", borderRadius: 5, padding: "5px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Add</button>
                </div>
              </div>
            )}
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 50px 36px 50px 68px 36px 54px", gap: 3, padding: "7px 10px", background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                {["Prompt", "Vis", "Ment.", "Pos", "Sent", "Volume", "Loc", "Added"].map(h => <span key={h} style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase", letterSpacing: 0.6 }}>{h}</span>)}
              </div>
              {f.map(p => (
                <div key={p.id}>
                  <div onClick={() => setExp(exp === p.id ? null : p.id)} style={{ display: "grid", gridTemplateColumns: "1fr 60px 50px 36px 50px 68px 36px 54px", gap: 3, padding: "8px 10px", borderBottom: `1px solid ${C.borderLight}`, cursor: "pointer", background: exp === p.id ? C.bg : "transparent", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 12, color: C.t1, lineHeight: 1.3, marginBottom: 2 }}>{p.p}</div>
                      <div style={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>{p.tags.map(t => <Tag key={t} label={t} color={tc[t]} s />)}<span style={{ fontSize: 10, color: C.accent, cursor: "pointer" }}>+</span></div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 3 }}><Bar v={p.v} /><span style={{ fontSize: 11, fontWeight: 600, color: p.v === 0 ? C.red : C.t1 }}>{p.v}%</span></div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: p.men === 0 ? C.t3 : C.t1 }}>{p.men}</span>
                    <span style={{ fontSize: 12, color: p.pos ? C.t1 : C.t3 }}>{p.pos ? `#${p.pos}` : "—"}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 2 }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: p.sent === "Positive" ? C.green : p.sent === "Neutral" ? C.t4 : C.red }} /><span style={{ fontSize: 10, color: C.t2 }}>{p.sent === "Positive" ? "Pos" : p.sent === "Neutral" ? "Neu" : p.sent}</span></div>
                    <span style={{ fontSize: 10, color: C.t2, fontFamily: M }}>{p.vol}</span>
                    <span style={{ fontSize: 10 }}>{p.loc === "US" ? "🇺🇸" : "🇬🇧"}</span>
                    <span style={{ fontSize: 10, color: C.t3 }}>{p.added}</span>
                  </div>
                  {exp === p.id && (
                    <div style={{ padding: "10px 14px", background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                      <div style={{ display: "flex", gap: 14 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 9, color: C.t3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontWeight: 600 }}>By Model</div>
                          {Object.entries(p.models).map(([m, v]) => (
                            <div key={m} style={{ display: "flex", alignItems: "center", gap: 5, padding: "2px 0" }}>
                              <span style={{ width: 55, fontSize: 10, color: C.t2 }}>{m}</span>
                              <div style={{ flex: 1, height: 3, background: C.borderLight, borderRadius: 2 }}><div style={{ height: "100%", width: `${v}%`, background: v > 60 ? C.green : v > 30 ? C.orange : v > 0 ? C.red : C.t4, borderRadius: 2 }} /></div>
                              <span style={{ fontSize: 10, fontWeight: 600, color: v === 0 ? C.red : C.t1, width: 24, textAlign: "right" }}>{v}%</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 9, color: C.t3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontWeight: 600 }}>Top Sources</div>
                          {["reddit.com/r/espresso", "cnet.com/coffee", "nespresso.com", "wirecutter.com"].map((s, i) => <div key={s} style={{ fontSize: 10, color: C.t2, padding: "2px 0", fontFamily: M }}>{i+1}. {s}</div>)}
                        </div>
                        <div>
                          <div style={{ fontSize: 9, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 4 }}>Actions</div>
                          {p.v === 0 ? <button style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 4, padding: "5px 10px", fontSize: 10, fontWeight: 600, cursor: "pointer", marginBottom: 3, display: "block" }}>Create Content</button> : <button style={{ background: C.white, color: C.t2, border: `1px solid ${C.border}`, borderRadius: 4, padding: "5px 10px", fontSize: 10, cursor: "pointer", marginBottom: 3, display: "block" }}>Optimize</button>}
                          <button style={{ background: C.white, color: C.t2, border: `1px solid ${C.border}`, borderRadius: 4, padding: "5px 10px", fontSize: 10, cursor: "pointer", display: "block" }}>View Sources</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: C.t3 }}>
              <span>{f.length} Prompts</span>
              <div style={{ display: "flex", gap: 8 }}><button style={{ background: "none", border: "none", color: C.t2, fontSize: 11, cursor: "pointer" }}>Assign tags</button><button style={{ background: "none", border: "none", color: C.t2, fontSize: 11, cursor: "pointer" }}>Assign topic</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ── SOURCES ──
function SourcesPage() {
  const [viewTab, setViewTab] = useState("Domains");
  const [domainType, setDomainType] = useState("All Domain Types");
  const [gapMode, setGapMode] = useState(false);
  const [exp, setExp] = useState(null);
  const [search, setSearch] = useState("");
  const [drillDomain, setDrillDomain] = useState(null);
  const [detailTab, setDetailTab] = useState("URLs");
  const [urlTypeFilter, setUrlTypeFilter] = useState("All URL Types");
  const [urlSearch, setUrlSearch] = useState("");
  const domains = [
    { id: 1, d: "reddit.com", icon: "🔴", type: "UGC", used: 90, avgCit: 0.2, trend: [0,0,0,5,15,60,90],
      urls: [
        { url: "r/jewelry: What makes a jewelry brand trustworthy?", path: "reddit.com/r/jewelry/comments/1o5rwe6/what_makes_a_jewelry_...", urlType: "Discussion", mentioned: false, mentions: "", usedTotal: 6, avgCit: 0.0, updated: "2 days ago" },
        { url: "r/jewelry: Durable yet affordable metal for wedding bands?", path: "reddit.com/r/jewelry/comments/7n5kxm/durable_yet_affordable_m...", urlType: "Discussion", mentioned: false, mentions: "", usedTotal: 5, avgCit: 0.0, updated: "13 hr. ago" },
        { url: "r/EngagementRings: Basic things to look out for when...", path: "reddit.com/r/EngagementRings/comments/1d0s7aa/some_of_the_...", urlType: "Discussion", mentioned: false, mentions: "", usedTotal: 4, avgCit: 0.0, updated: "3 days ago" },
        { url: "r/jewelry: What are your beloved jewelry brands?", path: "reddit.com/r/jewelry/comments/1dgtygn/what_are_your_beloved_j...", urlType: "Discussion", mentioned: false, mentions: "", usedTotal: 4, avgCit: 0.0, updated: "4 days ago" },
        { url: "r/espresso: Best home espresso machines 2026", path: "reddit.com/r/espresso/comments/abc123/best_home_espresso...", urlType: "Discussion", mentioned: true, mentions: "3", usedTotal: 12, avgCit: 0.3, updated: "1 day ago" },
        { url: "r/Coffee: Nespresso vs manual espresso - honest review", path: "reddit.com/r/Coffee/comments/def456/nespresso_vs_manual...", urlType: "Review", mentioned: true, mentions: "5", usedTotal: 8, avgCit: 0.5, updated: "2 days ago" },
        { url: "r/BuyItForLife: Coffee machines that last decades", path: "reddit.com/r/BuyItForLife/comments/ghi789/coffee_machines...", urlType: "Discussion", mentioned: true, mentions: "2", usedTotal: 6, avgCit: 0.1, updated: "5 days ago" },
        { url: "r/frugal: Cheapest way to get good espresso at home", path: "reddit.com/r/frugal/comments/jkl012/cheapest_espresso...", urlType: "Discussion", mentioned: false, mentions: "", usedTotal: 3, avgCit: 0.0, updated: "6 days ago" },
      ],
      serpQueries: [
        { model: "ChatGPT", prompt: "What are the best espresso machines for home?", query: "best home espresso machine reddit reviews 2026" },
        { model: "ChatGPT", prompt: "What are the best espresso machines for home?", query: "espresso machine recommendations forum discussion" },
        { model: "Gemini", prompt: "Is Nespresso worth the price?", query: "nespresso worth it reddit user opinions" },
        { model: "Gemini", prompt: "Is Nespresso worth the price?", query: "nespresso vs regular coffee cost comparison reddit" },
        { model: "Perplexity", prompt: "Best single-serve coffee machines 2026", query: "single serve coffee machine review reddit 2026" },
        { model: "ChatGPT", prompt: "Most sustainable coffee pod options?", query: "sustainable coffee pods discussion reddit" },
        { model: "Grok", prompt: "Nespresso vs Keurig which is better?", query: "nespresso keurig comparison reddit honest review" },
      ]
    },
    { id: 2, d: "google.com", icon: "🟡", type: "Other", used: 59, avgCit: 0.1, trend: [0,0,0,3,10,40,59], urls: [], serpQueries: [] },
    { id: 3, d: "nespresso.com", icon: "☕", type: "Corporate", used: 23, avgCit: 0.4, trend: [2,3,4,5,8,15,23],
      urls: [
        { url: "Official Capsule Flavors Guide", path: "nespresso.com/us/en/original-coffee-pods", urlType: "Product page", mentioned: true, mentions: "12", usedTotal: 15, avgCit: 0.8, updated: "1 day ago" },
        { url: "Machine Lineup 2026", path: "nespresso.com/us/en/machines", urlType: "Product page", mentioned: true, mentions: "9", usedTotal: 12, avgCit: 0.6, updated: "2 days ago" },
        { url: "Recycling Program", path: "nespresso.com/us/en/recycling", urlType: "Article", mentioned: true, mentions: "4", usedTotal: 7, avgCit: 0.4, updated: "3 days ago" },
        { url: "Sustainability Commitment", path: "nespresso.com/us/en/sustainability", urlType: "Article", mentioned: true, mentions: "3", usedTotal: 5, avgCit: 0.2, updated: "5 days ago" },
      ],
      serpQueries: [
        { model: "ChatGPT", prompt: "What are the best espresso machines for home?", query: "nespresso official capsule flavors list" },
        { model: "Gemini", prompt: "Most sustainable coffee pod options?", query: "nespresso recycling program details" },
      ]
    },
    { id: 4, d: "youtube.com", icon: "▶️", type: "UGC", used: 20, avgCit: 0.1, trend: [0,0,2,5,8,15,20], urls: [], serpQueries: [] },
    { id: 5, d: "cnet.com", icon: "📱", type: "Editorial", used: 16, avgCit: 1.4, trend: [5,6,7,8,10,13,16], urls: [
      { url: "Best Espresso Machines for 2026", path: "cnet.com/home/kitchen/best-espresso-machines", urlType: "Review", mentioned: true, mentions: "6", usedTotal: 14, avgCit: 1.8, updated: "12 hr. ago" },
      { url: "Nespresso Vertuo Pop Review", path: "cnet.com/home/kitchen/nespresso-vertuo-review", urlType: "Review", mentioned: true, mentions: "8", usedTotal: 11, avgCit: 1.5, updated: "2 days ago" },
      { url: "Coffee Maker Buying Guide", path: "cnet.com/home/kitchen/coffee-maker-buying-guide", urlType: "Guide", mentioned: false, mentions: "", usedTotal: 8, avgCit: 0.9, updated: "4 days ago" },
    ], serpQueries: [
      { model: "ChatGPT", prompt: "What are the top-rated espresso machines?", query: "best espresso machine cnet review 2026" },
      { model: "Gemini", prompt: "Nespresso machine reviews", query: "nespresso vertuo review cnet rating" },
    ] },
    { id: 6, d: "wirecutter.com", icon: "✂️", type: "Editorial", used: 14, avgCit: 1.1, trend: [4,5,5,6,8,11,14], urls: [], serpQueries: [] },
    { id: 7, d: "seriouseats.com", icon: "🍽️", type: "Editorial", used: 11, avgCit: 0.5, trend: [2,3,3,4,6,9,11], urls: [], serpQueries: [] },
    { id: 8, d: "etsy.com", icon: "🛍️", type: "Corporate", used: 10, avgCit: 0.6, trend: [1,2,3,4,5,8,10], urls: [], serpQueries: [] },
    { id: 9, d: "coffeegeek.com", icon: "☕", type: "Editorial", used: 8, avgCit: 0.8, trend: [3,3,4,4,5,7,8], urls: [], serpQueries: [] },
  ];
  const typeColors = { UGC: "orange", Other: "gray", Corporate: "cyan", Editorial: "accent", Reference: "purple", Institutional: "green", Discussion: "accent", Review: "red", Guide: "purple", Article: "green", "Product page": "cyan" };
  const typeCounts = { Editorial: 238, UGC: 196, Corporate: 142, Other: 64, Reference: 35, Institutional: 12 };
  const total = Object.values(typeCounts).reduce((a, b) => a + b, 0);
  let filtered = domains;
  if (domainType !== "All Domain Types") filtered = filtered.filter(x => x.type === domainType);
  if (search) filtered = filtered.filter(x => x.d.toLowerCase().includes(search.toLowerCase()));
  const MiniChart = ({ data, w, h }) => {
    const max = Math.max(...data, 1);
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(" ");
    return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}><polyline points={pts} fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinejoin="round" /></svg>;
  };
  const SDonut = ({ entries, colors, totalVal, size = 104 }) => {
    let cum = 0;
    const r = (size - 20) / 2, cx = size/2, cy = size/2;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {entries.map(([, count], i) => {
          const angle = (count / totalVal) * 360;
          const sa = (cum - 90) * Math.PI / 180;
          cum += angle;
          const ea = (cum - 90) * Math.PI / 180;
          const large = angle > 180 ? 1 : 0;
          const x1 = cx + r * Math.cos(sa), y1 = cy + r * Math.sin(sa);
          const x2 = cx + r * Math.cos(ea), y2 = cy + r * Math.sin(ea);
          return <path key={i} d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`} fill={colors[i]} />;
        })}
        <circle cx={cx} cy={cy} r={r * 0.6} fill={C.white} />
        <text x={cx} y={cy - 3} textAnchor="middle" fontSize={size > 80 ? "16" : "13"} fontWeight="700" fill={C.t1} fontFamily={F}>{totalVal}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize={size > 80 ? "8" : "7"} fill={C.t3} fontFamily={F}>Citations</text>
      </svg>
    );
  };
  // ── DETAIL DRILL-DOWN VIEW ──
  if (drillDomain) {
    const dom = domains.find(d => d.id === drillDomain);
    if (!dom) return null;
    let filteredUrls = dom.urls;
    if (urlTypeFilter !== "All URL Types") filteredUrls = filteredUrls.filter(u => u.urlType === urlTypeFilter);
    if (urlSearch) filteredUrls = filteredUrls.filter(u => u.url.toLowerCase().includes(urlSearch.toLowerCase()) || u.path.toLowerCase().includes(urlSearch.toLowerCase()));
    const urlTypes = [...new Set(dom.urls.map(u => u.urlType))];
    const urlTypeCounts = urlTypes.reduce((a, t) => { a[t] = dom.urls.filter(u => u.urlType === t).length; return a; }, {});
    const urlTypeTotal = dom.urls.length;
    const dtColors = { Discussion: C.accent, Review: "#EF4444", Guide: C.purple, Article: C.green, "Product page": C.cyan };
    const DetailChart = () => {
      const data = dom.trend;
      const dates = ["Feb 16", "Feb 17", "Feb 18", "Feb 19", "Feb 20", "Feb 21", "Feb 22"];
      const w = 580, h = 180, pad = { t: 12, b: 26, l: 36, r: 12 };
      const cw = w - pad.l - pad.r, ch2 = h - pad.t - pad.b;
      const maxV = Math.max(...data) * 1.3 || 30;
      const pts = data.map((d, i) => ({
        x: pad.l + (i / (data.length - 1)) * cw,
        y: pad.t + ch2 - (d / maxV) * ch2,
      }));
      const line = pts.map(p => `${p.x},${p.y}`).join(" ");
      const area = `${pad.l},${pad.t + ch2} ${line} ${pts[pts.length-1].x},${pad.t + ch2}`;
      const gridVals = [0, Math.round(maxV * 0.25), Math.round(maxV * 0.5), Math.round(maxV * 0.75), Math.round(maxV)];
      return (
        <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
          {gridVals.map(v => {
            const y = pad.t + ch2 - (v / maxV) * ch2;
            return (
              <g key={v}>
                <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke={C.borderLight} strokeWidth="0.5" />
                <text x={pad.l - 4} y={y + 3} textAnchor="end" fontSize="8" fill={C.t3} fontFamily={F}>{v}%</text>
              </g>
            );
          })}
          <polygon points={area} fill={C.accent} opacity="0.06" />
          <polyline points={line} fill="none" stroke={C.accent} strokeWidth="2" strokeLinejoin="round" />
          {pts.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="3" fill={C.white} stroke={C.accent} strokeWidth="1.5" />
              <text x={p.x} y={h - 4} textAnchor="middle" fontSize="8" fill={C.t3} fontFamily={F}>{dates[i]}</text>
            </g>
          ))}
        </svg>
      );
    };
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
          <span onClick={() => { setDrillDomain(null); setDetailTab("URLs"); setUrlTypeFilter("All URL Types"); setUrlSearch(""); }} style={{ fontSize: 12, color: C.accent, cursor: "pointer", fontWeight: 500 }}>Sources</span>
          <span style={{ fontSize: 11, color: C.t3 }}>›</span>
          <span style={{ fontSize: 12, color: C.t1, fontWeight: 600 }}>{dom.icon} {dom.d}</span>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
          <select style={{ padding: "5px 10px", borderRadius: 20, border: `1px solid ${C.border}`, fontSize: 11, background: C.white, cursor: "pointer" }}><option>Nespresso</option></select>
          <select style={{ padding: "5px 10px", borderRadius: 20, border: `1px solid ${C.border}`, fontSize: 11, background: C.white, cursor: "pointer" }}><option>Last 7 days</option></select>
          <select style={{ padding: "5px 10px", borderRadius: 20, border: `1px solid ${C.border}`, fontSize: 11, background: C.white, cursor: "pointer" }}><option>All Tags</option></select>
          <select style={{ padding: "5px 10px", borderRadius: 20, border: `1px solid ${C.border}`, fontSize: 11, background: C.white, cursor: "pointer" }}><option>All Models</option></select>
          <select style={{ padding: "5px 10px", borderRadius: 20, border: `1px solid ${C.border}`, fontSize: 11, background: C.white, cursor: "pointer" }}><option>All Topics</option></select>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 3, background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
            <DetailChart />
          </div>
          <div style={{ flex: 1, background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <SDonut entries={Object.entries(urlTypeCounts)} colors={urlTypes.map(t => dtColors[t] || C.t3)} totalVal={urlTypeTotal} size={120} />
            <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
              {urlTypes.map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 9, color: C.t2 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 1, background: dtColors[t] || C.t3 }} />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <select value={urlTypeFilter} onChange={e => setUrlTypeFilter(e.target.value)} style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11, background: C.white, cursor: "pointer" }}>
            <option>All URL Types</option>
            {urlTypes.map(t => <option key={t}>{t}</option>)}
          </select>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div onClick={() => setGapMode(!gapMode)} style={{ width: 30, height: 16, borderRadius: 8, background: gapMode ? C.accent : C.t4, cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
              <div style={{ width: 12, height: 12, borderRadius: 6, background: C.white, position: "absolute", top: 2, left: gapMode ? 16 : 2, transition: "left 0.2s" }} />
            </div>
            <span style={{ fontSize: 11, color: C.t2 }}>Gap Analysis</span>
            <span style={{ fontSize: 9, color: C.t3, cursor: "help" }} title="Show only URLs where your brand is NOT mentioned">ⓘ</span>
          </div>
          <div style={{ flex: 1 }} />
          <input value={urlSearch} onChange={e => setUrlSearch(e.target.value)} placeholder="Search..." style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11, outline: "none", width: 150, background: C.white }} />
          <button style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 6, padding: "5px 12px", fontSize: 11, color: C.t2, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>↗ Export</button>
        </div>
        <div style={{ display: "flex", gap: 0, marginBottom: 10 }}>
          {["URLs", "SERP Queries", "Analyze"].map((t, i) => (
            <button key={t} onClick={() => setDetailTab(t)} style={{
              padding: "6px 16px", border: `1px solid ${C.border}`, cursor: "pointer", fontSize: 11,
              fontWeight: detailTab === t ? 600 : 400, color: detailTab === t ? C.t1 : C.t2,
              background: detailTab === t ? C.white : "transparent",
              borderRadius: i === 0 ? "6px 0 0 6px" : i === 2 ? "0 6px 6px 0" : 0,
              borderLeft: i > 0 ? "none" : undefined,
            }}>{t}{t === "URLs" ? ` (${filteredUrls.length})` : t === "SERP Queries" ? ` (${dom.serpQueries.length})` : ""}</button>
          ))}
        </div>
        {detailTab === "URLs" && (
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 50px 60px 75px 75px", gap: 4, padding: "8px 12px", background: C.bg, borderBottom: `1px solid ${C.border}`, alignItems: "center" }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase" }}>URL</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase" }}>URL Type</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase", textAlign: "center" }}>Mentioned</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase", textAlign: "right" }}>Mentions</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase", textAlign: "right" }}>Used</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase", textAlign: "right" }}>Avg. Cit.</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase", textAlign: "right" }}>Updated</span>
            </div>
            {(gapMode ? filteredUrls.filter(u => !u.mentioned) : filteredUrls).map((u, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 50px 60px 75px 75px", gap: 4, padding: "10px 12px", borderBottom: `1px solid ${C.borderLight}`, alignItems: "center", cursor: "pointer", transition: "background 0.1s" }}
                   onMouseEnter={e => e.currentTarget.style.background = C.bg}
                   onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: 13 }}>{dom.icon}</span>
                    <span style={{ fontSize: 12, color: C.t1, fontWeight: 500 }}>{u.url}</span>
                  </div>
                  <div style={{ fontSize: 10, color: C.t3, marginTop: 2, fontFamily: M, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 350 }}>{u.path}</div>
                </div>
                <div><Tag label={u.urlType} color={typeColors[u.urlType] || "gray"} /></div>
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 4, background: u.mentioned ? C.greenLight : C.redLight, color: u.mentioned ? C.greenText : C.red }}>{u.mentioned ? "Yes" : "No"}</span>
                </div>
                <span style={{ fontSize: 11, color: C.t1, textAlign: "right" }}>{u.mentions || "—"}</span>
                <span style={{ fontSize: 11, color: C.t1, textAlign: "right" }}>{u.usedTotal}</span>
                <span style={{ fontSize: 11, color: C.t1, textAlign: "right" }}>{u.avgCit}</span>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 10, color: C.t3 }}>{u.updated}</span>
                </div>
              </div>
            ))}
            {filteredUrls.length === 0 && (
              <div style={{ padding: 30, textAlign: "center", color: C.t3, fontSize: 12 }}>No URLs found for this domain.</div>
            )}
          </div>
        )}
        {detailTab === "SERP Queries" && (
          <div>
            <div style={{ fontSize: 12, color: C.t3, marginBottom: 10 }}>Search queries AI chatbots used to find content on <strong>{dom.d}</strong></div>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr", gap: 4, padding: "8px 12px", background: C.bg, borderBottom: `1px solid ${C.border}`, alignItems: "center" }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase" }}>Model</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase" }}>Prompt</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase" }}>Search Query</span>
              </div>
              {dom.serpQueries.map((q, i) => {
                const mColor = q.model === "ChatGPT" ? C.green : q.model === "Gemini" ? C.accent : q.model === "Perplexity" ? C.purple : C.t1;
                return (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr", gap: 4, padding: "9px 12px", borderBottom: `1px solid ${C.borderLight}`, alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: mColor }} />
                      <span style={{ fontSize: 11, color: C.t1 }}>{q.model}</span>
                    </div>
                    <span style={{ fontSize: 11, color: C.accent, cursor: "pointer" }}>{q.prompt}</span>
                    <span style={{ fontSize: 11, color: C.t1, fontFamily: M, paddingLeft: 8, borderLeft: `2px solid ${C.accent}22` }}>{q.query}</span>
                  </div>
                );
              })}
              {dom.serpQueries.length === 0 && (
                <div style={{ padding: 30, textAlign: "center", color: C.t3, fontSize: 12 }}>No SERP queries recorded for this domain yet.</div>
              )}
            </div>
          </div>
        )}
        {detailTab === "Analyze" && (
          <div>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🔬</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 4 }}>Reverse Engineer {dom.d}</div>
              <div style={{ fontSize: 12, color: C.t3, marginBottom: 16, maxWidth: 450, margin: "0 auto 16px" }}>Discover why AI models cite this domain. Analyze content patterns, keyword usage, page structure, and citation triggers.</div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
                {[
                  { icon: "📄", t: "Content Patterns", d: "What topics & formats get cited" },
                  { icon: "🔗", t: "Link Profile", d: "Backlink & authority signals" },
                  { icon: "🏗️", t: "Page Structure", d: "Schema, headers, readability" },
                  { icon: "🎯", t: "Keyword Strategy", d: "Terms that trigger citations" },
                ].map(f2 => (
                  <div key={f2.t} style={{ background: C.bg, borderRadius: 8, padding: "12px 14px", width: 120, textAlign: "center" }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{f2.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.t1 }}>{f2.t}</div>
                    <div style={{ fontSize: 9, color: C.t3, marginTop: 2 }}>{f2.d}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <button style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "10px 28px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>🔬 Analyze Top URLs</button>
                <button style={{ background: C.white, color: C.t1, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 28px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Analyze All URLs</button>
              </div>
              <div style={{ fontSize: 10, color: C.t3, marginTop: 8 }}>1 credit per URL analysis</div>
            </div>
          </div>
        )}
        <div style={{ fontSize: 11, color: C.t3, marginTop: 8 }}>{filteredUrls.length} URLs from {dom.d}</div>
      </div>
    );
  }
  // ── MAIN SOURCES OVERVIEW ──
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 2px" }}>Sources</h1>
      <p style={{ fontSize: 12, color: C.t3, margin: "0 0 12px" }}>Websites AI models cite when answering prompts in your category</p>
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <select style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11, background: C.white, cursor: "pointer" }}><option>Last 7 days</option><option>Last 30 days</option></select>
        <select style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11, background: C.white, cursor: "pointer" }}><option>All Tags</option></select>
        <select style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11, background: C.white, cursor: "pointer" }}><option>All Models</option></select>
        <select style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11, background: C.white, cursor: "pointer" }}><option>All Topics</option></select>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 3, background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.t1, marginBottom: 8 }}>Source Usage by Domain</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
            {domains.slice(0, 5).map(d => (
              <div key={d.d} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: C.t2 }}>
                <div style={{ width: 6, height: 6, borderRadius: 1, background: C.accent, opacity: 0.3 + (0.7 * d.used / 100) }} />
                {d.d}
              </div>
            ))}
          </div>
          <div style={{ height: 120, position: "relative", borderBottom: `1px solid ${C.borderLight}`, marginBottom: 4 }}>
            {[100, 75, 50, 25, 0].map(v => (
              <div key={v} style={{ position: "absolute", left: 0, bottom: `${v}%`, fontSize: 9, color: C.t3, transform: "translateY(50%)" }}>{v}%</div>
            ))}
            <div style={{ position: "absolute", left: 30, right: 0, top: 0, bottom: 0 }}>
              {domains.slice(0, 5).map((d, i) => (
                <div key={d.d} style={{ position: "absolute", bottom: 0, left: 0, right: 0, top: 0, opacity: 0.4 + (i === 0 ? 0.6 : 0) }}>
                  <MiniChart data={d.trend} w={500} h={120} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ flex: 1, background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.t1, marginBottom: 8, alignSelf: "flex-start" }}>Domain Type</div>
          <SDonut entries={Object.entries(typeCounts)} colors={[C.accent, C.orange, C.cyan, C.t3, C.purple, C.green]} totalVal={total} />
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
            {Object.keys(typeCounts).map(type => (
              <div key={type} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 9, color: C.t2 }}>
                <div style={{ width: 6, height: 6, borderRadius: 1, background: type === "Editorial" ? C.accent : type === "UGC" ? C.orange : type === "Corporate" ? C.cyan : type === "Reference" ? C.purple : type === "Institutional" ? C.green : C.t3 }} />
                {type}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <select value={domainType} onChange={e => setDomainType(e.target.value)} style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11, background: C.white, cursor: "pointer" }}>
          <option>All Domain Types</option><option>Editorial</option><option>UGC</option><option>Corporate</option><option>Other</option>
        </select>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div onClick={() => setGapMode(!gapMode)} style={{ width: 30, height: 16, borderRadius: 8, background: gapMode ? C.accent : C.t4, cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: C.white, position: "absolute", top: 2, left: gapMode ? 16 : 2, transition: "left 0.2s" }} />
          </div>
          <span style={{ fontSize: 11, color: C.t2 }}>Gap Analysis</span>
        </div>
        <div style={{ flex: 1 }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11, outline: "none", width: 150, background: C.white }} />
        <button style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 6, padding: "5px 12px", fontSize: 11, color: C.t2, cursor: "pointer" }}>Export</button>
      </div>
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 90px 60px 80px 70px 60px", gap: 4, padding: "8px 12px", background: C.bg, borderBottom: `1px solid ${C.border}`, alignItems: "center" }}>
          <span style={{ fontSize: 9, fontWeight: 600, color: C.t3 }}>#</span>
          <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase" }}>Source</span>
          <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase" }}>Domain Type</span>
          <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase" }}>Used</span>
          <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase" }}>Avg. Citations</span>
          <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase" }}>Trend</span>
          <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase" }}></span>
        </div>
        {filtered.map((d, i) => (
          <div key={d.id} onClick={() => { setDrillDomain(d.id); setDetailTab("URLs"); }} style={{
            display: "grid", gridTemplateColumns: "28px 1fr 90px 60px 80px 70px 60px",
            gap: 4, padding: "9px 12px", borderBottom: `1px solid ${C.borderLight}`,
            cursor: "pointer", alignItems: "center", transition: "background 0.1s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = C.bg}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <span style={{ fontSize: 11, color: C.t3 }}>{i + 1}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12 }}>{d.icon}</span>
              <span style={{ fontSize: 13, color: C.t1, fontWeight: 500 }}>{d.d}</span>
              <span style={{ fontSize: 10, color: C.t3 }}>({d.urls.length} URLs)</span>
            </div>
            <Tag label={d.type} color={typeColors[d.type]} s />
            <span style={{ fontSize: 12, color: C.t1, fontWeight: 500 }}>{d.used}%</span>
            <span style={{ fontSize: 12, color: C.t1 }}>{d.avgCit}</span>
            <MiniChart data={d.trend} w={60} h={16} />
            <button onClick={e => { e.stopPropagation(); setDrillDomain(d.id); setDetailTab("Analyze"); }} style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 4, padding: "4px 8px", fontSize: 9, fontWeight: 600, cursor: "pointer" }}>Analyze</button>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: C.t3, marginTop: 6 }}>{filtered.length} domains · Click to drill down</div>
    </div>
  );
}
// ── IMPACT ──
function ImpactPage() {
  const [tab, setTab] = useState("Citations");
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 2px" }}>Impact</h1>
      <p style={{ fontSize: 12, color: C.t3, margin: "0 0 16px" }}>Track progress and prove ROI</p>
      <Tabs items={["Citations", "Traffic", "Timeline"]} active={tab} set={setTab} />
      {tab === "Citations" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <Metric label="Total Citations" value="639" change="+23" s />
            <Metric label="Citation Share" value="1.9%" change="-0.2%" s />
            <Metric label="Tracked URLs" value="67" change="+5" s />
          </div>
          {[{ u: "/us/en/original-coffee-pods", c: 193, ch: "+12", sp: [30,45,55,60,65,70,75] }, { u: "/us/en/recycling", c: 167, ch: "+8", sp: [25,35,45,55,58,62,65] }, { u: "/us/en/circularity", c: 147, ch: "+15", sp: [15,25,40,50,55,62,70] }].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: C.white, border: `1px solid ${C.border}`, borderRadius: 7, marginBottom: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.green }} />
              <span style={{ flex: 1, fontSize: 11, color: C.t2, fontFamily: M }}>nespresso.com{r.u}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>{r.c}</span>
              <span style={{ fontSize: 10, color: C.greenText }}>{r.ch}</span>
              <Spark d={r.sp} />
            </div>
          ))}
        </div>
      )}
      {tab === "Traffic" && (
        <div>
          <div style={{ background: C.orangeLight, border: `1px solid ${C.orange}22`, borderRadius: 8, padding: 12, marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: C.orangeText }}>Connect Google Analytics to see LLM referral traffic</span>
            <button style={{ background: C.orange, color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>Connect GA4</button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Metric label="Est. LLM Traffic" value="~2,597" sub="weekly" s />
            <Metric label="LLM Share" value="~27%" s />
            <Metric label="Top Source" value="ChatGPT" sub="29%" s />
          </div>
        </div>
      )}
      {tab === "Timeline" && (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 10 }}>Brand Presence Timeline</div>
          {[{ b: "Nespresso", v: "72.6%", c: C.accent }, { b: "Keurig", v: "55.2%", c: C.green }, { b: "Breville", v: "28.0%", c: C.orange }].map(b => (
            <div key={b.b} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: b.c }} />
              <span style={{ fontSize: 11, color: C.t2, width: 70 }}>{b.b}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.t1 }}>{b.v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// ── EARNED ──
function EarnedPage() {
  const [tab, setTab] = useState("Reddit");
  const items = {
    Reddit: [
      { t: "r/coffee — Best espresso machine for beginners?", m: "2,400 upvotes · ChatGPT, Gemini", u: "High" },
      { t: "r/espresso — Nespresso vs real espresso", m: "1,800 upvotes · Perplexity, Grok", u: "High" },
      { t: "r/BuyItForLife — Coffee machine lasting 10+ years?", m: "890 upvotes · ChatGPT", u: "Medium" },
    ],
    Outreach: [
      { t: "cnet.com — Top review source across all AI", m: "97 AI responses · Review", u: "Very High" },
      { t: "wirecutter.com — Primary recommendation source", m: "78 AI responses · Review", u: "Very High" },
      { t: "seriouseats.com — Growing coffee influence", m: "45 AI responses · Editorial", u: "High" },
    ],
  };
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 2px" }}>Earned</h1>
      <p style={{ fontSize: 12, color: C.t3, margin: "0 0 16px" }}>Influence third-party sources that AI models cite</p>
      <Tabs items={["Reddit", "Outreach", "PR Targets"]} active={tab} set={setTab} />
      {(items[tab] || []).map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 4 }}>
          <div style={{ flex: 1 }}><div style={{ fontSize: 13, color: C.t1, marginBottom: 2 }}>{r.t}</div><div style={{ fontSize: 11, color: C.t3 }}>{r.m}</div></div>
          <Tag label={r.u} color={r.u.includes("High") ? "orange" : "cyan"} />
          <button style={{ background: C.white, color: C.t2, border: `1px solid ${C.border}`, borderRadius: 5, padding: "5px 12px", fontSize: 11, cursor: "pointer" }}>View</button>
        </div>
      ))}
      {tab === "PR Targets" && <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 24, textAlign: "center", color: C.t3, fontSize: 12 }}>Publications AI models frequently cite — coming soon</div>}
    </div>
  );
}
// ── CONTENT ──
function ContentPage() {
  const [tab, setTab] = useState("Gaps");
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 2px" }}>Content</h1>
      <p style={{ fontSize: 12, color: C.t3, margin: "0 0 16px" }}>Create and optimize content for AI visibility</p>
      <Tabs items={["Gaps", "Ideas", "Create", "Optimize"]} active={tab} set={setTab} />
      {tab === "Gaps" && [
        { p: "Top-rated espresso machines for home use?", v: "336,600", ms: ["Gemini", "Perplexity", "ChatGPT"] },
        { p: "Easy-to-use coffee makers that brew espresso?", v: "222,620", ms: ["AI Mode", "ChatGPT"] },
        { p: "Machines that deliver cafe-quality espresso?", v: "127,100", ms: ["All models"] },
      ].map((g, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 4 }}>
          <div style={{ flex: 1 }}><div style={{ fontSize: 13, color: C.t1, marginBottom: 3 }}>{g.p}</div><div style={{ display: "flex", gap: 3 }}>{g.ms.map(m => <Tag key={m} label={m} color="orange" s />)}</div></div>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.t2, fontFamily: M }}>{g.v}</span>
          <button style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 6, padding: "7px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Create</button>
        </div>
      ))}
      {tab === "Ideas" && (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 3 }}>Reverse Engineered Content Ideas</div>
          <div style={{ fontSize: 11, color: C.t3, marginBottom: 10 }}>Analyze what competitors write about and what AI cites</div>
          {["How to choose the right espresso machine for your kitchen", "Single-serve vs traditional: a complete comparison guide", "The sustainability story behind coffee pods"].map((idea, i) => (
            <div key={i} style={{ padding: "8px 0", borderBottom: i < 2 ? `1px solid ${C.borderLight}` : "none", display: "flex", alignItems: "center" }}>
              <span style={{ flex: 1, fontSize: 12, color: C.t1 }}>{idea}</span>
              <button style={{ background: C.accentLight, color: C.accentText, border: "none", borderRadius: 4, padding: "4px 10px", fontSize: 10, fontWeight: 500, cursor: "pointer" }}>Create</button>
            </div>
          ))}
        </div>
      )}
      {tab === "Create" && (
        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ flex: 2, background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 8 }}>Create AI-Optimized Content</div>
            <textarea placeholder="Describe what the article should cover..." style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, minHeight: 80, resize: "vertical", fontFamily: F, outline: "none", boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              <input placeholder="Title (optional)" style={{ flex: 1, padding: "6px 8px", borderRadius: 5, border: `1px solid ${C.border}`, fontSize: 11, outline: "none" }} />
              <button style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Create</button>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>Context</div>
            {["Brand Information", "Tone of Voice", "Competitor Info"].map(c2 => (
              <div key={c2} style={{ display: "flex", justifyContent: "space-between", padding: "7px 10px", background: C.white, border: `1px solid ${C.border}`, borderRadius: 5, marginBottom: 3, fontSize: 11 }}>
                <span style={{ color: C.t2 }}>{c2}</span>
                <span style={{ color: C.accent, fontSize: 10, cursor: "pointer" }}>+ Add</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "Optimize" && (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 8 }}>Optimize for AI Search</div>
          <div style={{ fontSize: 11, color: C.t3, marginBottom: 10 }}>Analyze how well your content performs for AI search optimization</div>
          <div style={{ display: "flex", gap: 6 }}>
            <input placeholder="https://yourblog.com/article" style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, outline: "none" }} />
            <button style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Score URL</button>
          </div>
        </div>
      )}
    </div>
  );
}
// ── RESEARCH ──
function ResearchPage() {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 2px" }}>Prompt Research</h1>
      <p style={{ fontSize: 12, color: C.t3, margin: "0 0 16px" }}>The keyword planner for AI search</p>
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ flex: 2, background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <button style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 5, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Enter Keywords</button>
            <button style={{ background: C.white, color: C.t2, border: `1px solid ${C.border}`, borderRadius: 5, padding: "6px 12px", fontSize: 11, cursor: "pointer" }}>Enter Topic</button>
          </div>
          <textarea placeholder={"Enter search keywords (one per line, max 10)\ne.g. sustainable coffee\ne.g. home espresso machine"} style={{ width: "100%", padding: 10, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, minHeight: 70, resize: "vertical", fontFamily: F, outline: "none", boxSizing: "border-box" }} />
          <button style={{ marginTop: 8, background: C.accent, color: "#fff", border: "none", borderRadius: 6, padding: "10px 0", fontSize: 12, fontWeight: 600, cursor: "pointer", width: "100%" }}>Discover Prompts</button>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>Recent Searches</div>
          {["Convenient coffee brewing", "Premium coffee capsules", "Sustainable coffee brands", "Home espresso for beginners"].map(s => (
            <div key={s} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 5, padding: "7px 10px", marginBottom: 3, fontSize: 12, color: C.t1, cursor: "pointer" }}>{s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
// ── SETTINGS ──
function SettingsPage({ title, desc }) {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 2px" }}>{title}</h1>
      <p style={{ fontSize: 12, color: C.t3, margin: "0 0 16px" }}>{desc}</p>
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 20 }}>
        <div style={{ color: C.t3, fontSize: 12 }}>Settings content for {title}</div>
      </div>
    </div>
  );
}
// ── OPPORTUNITIES ──
function OpportunitiesPage() {
  const [cat, setCat] = useState("mention-gaps");
  const [expanded, setExpanded] = useState(null);
  const categories = [
    { section: "Creation", items: [
      { id: "content-gaps", label: "Content Gaps", icon: "📝", count: 7 },
      { id: "untapped", label: "Untapped Prompts", icon: "🔍", count: 12 },
    ]},
    { section: "Refresh", items: [
      { id: "weak-content", label: "Weak Content", icon: "⚠️", count: 3 },
      { id: "declining", label: "Declining Citations", icon: "📉", count: 2 },
    ]},
    { section: "Outreach", items: [
      { id: "mention-gaps", label: "Mention Gaps", icon: "🎯", count: 29 },
      { id: "influencing", label: "Influencing Websites", icon: "🌐", count: 8 },
    ]},
    { section: "Community", items: [
      { id: "reddit", label: "Reddit Discussions", icon: "💬", count: 14 },
    ]},
  ];
  const allItems = categories.flatMap(c => c.items);
  const active = allItems.find(i => i.id === cat);
  const mentionGaps = [
    { id: 1, url: "https://www.cnet.com/home/kitchen/best-espresso-machines-2026/", domain: "cnet.com", icon: "📱", status: "New", targetPrompts: 5, competitors: 3, compNames: ["Keurig", "Breville", "De'Longhi"] },
    { id: 2, url: "https://www.wirecutter.com/reviews/best-espresso-machines/", domain: "wirecutter.com", icon: "✂️", status: "New", targetPrompts: 4, competitors: 2, compNames: ["Breville", "De'Longhi"] },
    { id: 3, url: "https://www.seriouseats.com/best-espresso-machines-review/", domain: "seriouseats.com", icon: "🍽️", status: "New", targetPrompts: 3, competitors: 2, compNames: ["Breville", "AeroPress"] },
    { id: 4, url: "https://www.reddit.com/r/espresso/comments/top-picks/", domain: "reddit.com", icon: "🔴", status: "New", targetPrompts: 3, competitors: 1, compNames: ["Breville"] },
    { id: 5, url: "https://coffeegeek.com/reviews/best-pod-machines-2026/", domain: "coffeegeek.com", icon: "☕", status: "In Progress", targetPrompts: 3, competitors: 1, compNames: ["Keurig"] },
  ];
  const sc = s => s === "New" ? { bg: C.accentLight, text: C.accentText } : s === "In Progress" ? { bg: C.orangeLight, text: C.orangeText } : { bg: C.greenLight, text: C.greenText };
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 2px" }}>Opportunities</h1>
      <p style={{ fontSize: 12, color: C.t3, margin: "0 0 14px" }}>Prioritized actions to improve your AI visibility</p>
      <div style={{ display: "flex", gap: 0 }}>
        <div style={{ width: 190, flexShrink: 0, borderRight: `1px solid ${C.border}`, paddingRight: 10, marginRight: 12 }}>
          {categories.map(c => (
            <div key={c.section} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase", letterSpacing: 1.2, padding: "4px 6px", marginBottom: 2 }}>{c.section}</div>
              {c.items.map(item => (
                <div key={item.id} onClick={() => setCat(item.id)} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "6px 8px", borderRadius: 5, cursor: "pointer", marginBottom: 1,
                  background: cat === item.id ? C.accentLight : "transparent",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: 11 }}>{item.icon}</span>
                    <span style={{ fontSize: 12, color: cat === item.id ? C.accentText : C.t1, fontWeight: cat === item.id ? 600 : 400 }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: 10, color: C.t1, fontWeight: 500, background: C.bg, borderRadius: 8, padding: "1px 6px" }}>{item.count}</span>
                </div>
              ))}
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8, marginTop: 6 }}>
            <div style={{ fontSize: 10, color: C.t3, marginBottom: 4 }}>Total opportunities</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.t1 }}>{allItems.reduce((a, i) => a + i.count, 0)}</div>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 10 }}>{active?.label}</div>
          {cat === "mention-gaps" && (
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 70px 90px 80px 80px", gap: 4, padding: "8px 12px", background: C.bg, borderBottom: `1px solid ${C.border}`, alignItems: "center" }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase" }}>Citation URL</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase" }}>Status</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase" }}>Domain</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase", textAlign: "center" }}>Prompts</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase", textAlign: "center" }}>Competitors</span>
              </div>
              {mentionGaps.map(item => {
                const sCol = sc(item.status);
                return (
                  <div key={item.id}>
                    <div onClick={() => setExpanded(expanded === item.id ? null : item.id)} style={{
                      display: "grid", gridTemplateColumns: "1fr 70px 90px 80px 80px",
                      gap: 4, padding: "10px 12px", borderBottom: `1px solid ${C.borderLight}`,
                      cursor: "pointer", alignItems: "center", background: expanded === item.id ? C.bg : "transparent",
                    }}>
                      <div style={{ fontSize: 12, color: C.t1, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.url}</div>
                      <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 4, background: sCol.bg, color: sCol.text }}>{item.status}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 11 }}>{item.icon}</span>
                        <span style={{ fontSize: 11, color: C.t1 }}>{item.domain}</span>
                      </div>
                      <span style={{ fontSize: 11, color: C.t1, textAlign: "center" }}>💬 {item.targetPrompts}</span>
                      <span style={{ fontSize: 11, color: C.t1, textAlign: "center" }}>👥 {item.competitors}</span>
                    </div>
                    {expanded === item.id && (
                      <div style={{ padding: "12px 16px", background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                        <div style={{ display: "flex", gap: 20 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Competitors on this source</div>
                            {item.compNames.map(cn => (
                              <div key={cn} style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 0" }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.red }} />
                                <span style={{ fontSize: 11, color: C.t1 }}>{cn}</span>
                              </div>
                            ))}
                          </div>
                          <div>
                            <div style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Actions</div>
                            <button style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 5, padding: "6px 12px", fontSize: 10, fontWeight: 600, cursor: "pointer", display: "block", marginBottom: 4 }}>Request Mention</button>
                            <button style={{ background: C.white, color: C.t2, border: `1px solid ${C.border}`, borderRadius: 5, padding: "6px 12px", fontSize: 10, cursor: "pointer", display: "block" }}>Create Content</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {cat !== "mention-gaps" && (
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 30, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{active?.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.t1, marginBottom: 4 }}>{active?.label}</div>
              <div style={{ fontSize: 11, color: C.t3 }}>{active?.count} opportunities found</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// ── ACTIONS ──
function ActionsPage() {
  const categories = [
    { group: "Creation", items: [
      { id: "content-gaps", label: "Content Gaps", count: 7, icon: "📝" },
      { id: "untapped", label: "Untapped Prompts", count: 3, icon: "🎯" },
    ]},
    { group: "Refresh", items: [
      { id: "weak-content", label: "Weak Content", count: 2, icon: "⚠️" },
      { id: "declining", label: "Declining Citations", count: 1, icon: "📉" },
    ]},
    { group: "Outreach", items: [
      { id: "mention-gaps", label: "Mention Gaps", count: 29, icon: "📧" },
      { id: "influencing", label: "Influencing Websites", count: 8, icon: "🌐" },
    ]},
    { group: "Community", items: [
      { id: "reddit", label: "Reddit Discussions", count: 5, icon: "💬" },
    ]},
  ];
  const totalCount = categories.reduce((a, g) => a + g.items.reduce((b, i) => b + i.count, 0), 0);
  const [selected, setSelected] = useState("mention-gaps");
  const mentionGapItems = [
    { url: "cnet.com/home/kitchen/best-espresso-machines", domain: "cnet.com", icon: "📱", status: "New", targetPrompts: 5, competitors: 3, created: "This week" },
    { url: "wirecutter.com/reviews/best-pod-coffee-makers", domain: "wirecutter.com", icon: "✂️", status: "New", targetPrompts: 4, competitors: 2, created: "This week" },
    { url: "seriouseats.com/best-espresso-machines", domain: "seriouseats.com", icon: "🍽️", status: "New", targetPrompts: 3, competitors: 2, created: "This week" },
    { url: "reddit.com/r/espresso/top-machines-2026", domain: "reddit.com", icon: "🔴", status: "In Progress", targetPrompts: 3, competitors: 2, created: "Last week" },
    { url: "goodhousekeeping.com/coffee-makers", domain: "goodhousekeeping.com", icon: "🏠", status: "New", targetPrompts: 2, competitors: 1, created: "This week" },
  ];
  const activeItem = categories.flatMap(g => g.items).find(i => i.id === selected);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.t1, margin: "0 0 2px" }}>Actions</h1>
          <p style={{ fontSize: 12, color: C.t3, margin: 0 }}>{totalCount} opportunities to improve your AI visibility</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ width: 195, flexShrink: 0 }}>
          {categories.map(g => (
            <div key={g.group} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.t3, textTransform: "uppercase", letterSpacing: 1.2, padding: "0 6px", marginBottom: 4 }}>{g.group}</div>
              {g.items.map(item => (
                <div key={item.id} onClick={() => setSelected(item.id)} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "7px 8px", borderRadius: 6,
                  cursor: "pointer", marginBottom: 1,
                  background: selected === item.id ? C.white : "transparent",
                  border: `1px solid ${selected === item.id ? C.border : "transparent"}`,
                }}>
                  <span style={{ fontSize: 12 }}>{item.icon}</span>
                  <span style={{ flex: 1, fontSize: 12, color: selected === item.id ? C.t1 : C.t2, fontWeight: selected === item.id ? 500 : 400 }}>{item.label}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: C.accent, background: C.accentLight, borderRadius: 8, padding: "1px 6px" }}>{item.count}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.t1, marginBottom: 12 }}>{activeItem?.label}</div>
          {selected === "mention-gaps" && (
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 50px 80px 70px 80px", gap: 4, padding: "8px 12px", background: C.bg, borderBottom: `1px solid ${C.border}`, alignItems: "center" }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase" }}>URL</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase" }}>Domain</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase" }}>Status</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase", textAlign: "center" }}>Prompts</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase", textAlign: "center" }}>Comp.</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, textTransform: "uppercase" }}>Created</span>
              </div>
              {mentionGapItems.map((item, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 110px 50px 80px 70px 80px", gap: 4, padding: "10px 12px", borderBottom: `1px solid ${C.borderLight}`, alignItems: "center", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{ fontSize: 12, color: C.accent, fontFamily: M, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.url}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 11 }}>{item.icon}</span>
                    <span style={{ fontSize: 11, color: C.t1 }}>{item.domain}</span>
                  </div>
                  <Tag label={item.status} color={item.status === "New" ? "accent" : "orange"} s />
                  <span style={{ fontSize: 11, color: C.t1, textAlign: "center" }}>💬 {item.targetPrompts}</span>
                  <span style={{ fontSize: 11, color: C.t1, textAlign: "center" }}>👥 {item.competitors}</span>
                  <span style={{ fontSize: 10, color: C.t3 }}>{item.created}</span>
                </div>
              ))}
            </div>
          )}
          {selected !== "mention-gaps" && (
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 30, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{activeItem?.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.t1, marginBottom: 4 }}>{activeItem?.label}</div>
              <div style={{ fontSize: 11, color: C.t3 }}>{activeItem?.count} items</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// ── MAIN APP ──
export default function App() {
  const [page, setPage] = useState("overview");
  const [showGS, setShowGS] = useState(true);
  const [projOpen, setProjOpen] = useState(false);
  const [compOpen, setCompOpen] = useState(false);
  const pages = {
    "getting-started": <GettingStartedPage onDismiss={() => { setShowGS(false); setPage("overview"); }} />,
    overview: <OverviewPage />,
    prompts: <PromptsPage />,
    sources: <SourcesPage />,
    impact: <ImpactPage />,
    earned: <EarnedPage />,
    content: <ContentPage />,
    opportunities: <OpportunitiesPage />,
    actions: <ActionsPage />,
    research: <ResearchPage />,
    "proj-settings": <SettingsPage title="Project Settings" desc="Configure this project" />,
    "brand-kit": <SettingsPage title="Brand Kit" desc="Brand details, domain, and key products" />,
    "tags": <SettingsPage title="Tags" desc="Manage prompt and content tags" />,
    "comp-settings": <SettingsPage title="Company Settings" desc="Organization-level settings" />,
    "projects": <SettingsPage title="Projects" desc="Manage all projects in your organization" />,
    "api-keys": <SettingsPage title="API Keys" desc="Manage API access and integrations" />,
    "members": <SettingsPage title="Members" desc="Invite and manage team members" />,
    "billing": <SettingsPage title="Billing" desc="Manage your subscription and invoices" />,
  };
  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, fontFamily: F, overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
      {/* Sidebar */}
      <div style={{ width: 200, background: C.sidebar, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "14px 14px 10px" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.t1, letterSpacing: -0.3 }}>Spotlight</div>
          <div style={{ marginTop: 8, background: C.white, borderRadius: 6, padding: "6px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${C.border}`, cursor: "pointer" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.t1 }}>Nespresso</div>
              <div style={{ fontSize: 9, color: C.t3 }}>US · English</div>
            </div>
            <span style={{ fontSize: 8, color: C.t3 }}>▼</span>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", paddingTop: 2 }}>
          {showGS && (
            <div onClick={() => setPage("getting-started")} style={{ margin: "0 6px 6px", padding: "6px 8px", borderRadius: 6, cursor: "pointer", background: page === "getting-started" ? C.accentLight : C.white, border: `1px solid ${page === "getting-started" ? C.accent+"22" : C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: C.t1 }}>Getting Started</span>
                <span style={{ fontSize: 9, color: C.accent, fontWeight: 600 }}>0/6</span>
              </div>
              <div style={{ height: 2, background: C.borderLight, borderRadius: 1 }}><div style={{ height: "100%", width: "0%", background: C.accent, borderRadius: 1 }} /></div>
            </div>
          )}
          <Sec label="Insights" />
          <NavBtn icon={IC.overview} label="Overview" active={page === "overview"} onClick={() => setPage("overview")} />
          <NavBtn icon={IC.prompts} label="Prompts" active={page === "prompts"} onClick={() => setPage("prompts")} badge="82" />
          <NavBtn icon={IC.sources} label="Sources" active={page === "sources"} onClick={() => setPage("sources")} />
          <NavBtn icon={IC.impact} label="Impact" active={page === "impact"} onClick={() => setPage("impact")} />
          <Sec label="Actions" />
          <NavBtn icon={IC.earned} label="Earned" active={page === "earned"} onClick={() => setPage("earned")} badge="14" />
          <NavBtn icon={IC.content} label="Content" active={page === "content"} onClick={() => setPage("content")} badge="7" />
          <NavBtn icon={IC.opportunities} label="Opportunities" active={page === "opportunities"} onClick={() => setPage("opportunities")} badge="75" />
          <NavBtn icon={IC.actions} label="Actions" active={page === "actions"} onClick={() => setPage("actions")} badge="55" />
          <NavBtn icon={IC.research} label="Prompt Research" active={page === "research"} onClick={() => setPage("research")} />
          <div style={{ marginTop: 16, borderTop: `1px solid ${C.border}`, paddingTop: 4 }}>
            <div onClick={() => setProjOpen(!projOpen)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", cursor: "pointer" }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: C.t3, textTransform: "uppercase", letterSpacing: 1.5, flex: 1 }}>Project</span>
              <span style={{ color: C.t3, fontSize: 10 }}>{projOpen ? "▼" : "▶"}</span>
            </div>
            {projOpen && (
              <div>
                <SubNavBtn icon={IC.settings} label="Settings" onClick={() => setPage("proj-settings")} active={page === "proj-settings"} />
                <SubNavBtn icon={IC.brand} label="Brand Kit" onClick={() => setPage("brand-kit")} active={page === "brand-kit"} />
                <SubNavBtn icon={IC.tag} label="Tags" onClick={() => setPage("tags")} active={page === "tags"} />
              </div>
            )}
          </div>
          <div>
            <div onClick={() => setCompOpen(!compOpen)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", cursor: "pointer" }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: C.t3, textTransform: "uppercase", letterSpacing: 1.5, flex: 1 }}>Company</span>
              <span style={{ color: C.t3, fontSize: 10 }}>{compOpen ? "▼" : "▶"}</span>
            </div>
            {compOpen && (
              <div>
                <SubNavBtn icon={IC.settings} label="Settings" onClick={() => setPage("comp-settings")} active={page === "comp-settings"} />
                <SubNavBtn icon={IC.project} label="Projects" onClick={() => setPage("projects")} active={page === "projects"} />
                <SubNavBtn icon={IC.key} label="API Keys" onClick={() => setPage("api-keys")} active={page === "api-keys"} />
                <SubNavBtn icon={IC.members} label="Members" onClick={() => setPage("members")} active={page === "members"} />
                <SubNavBtn icon={IC.billing} label="Billing" onClick={() => setPage("billing")} active={page === "billing"} />
              </div>
            )}
          </div>
        </div>
        <div style={{ padding: "8px 14px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 10, color: C.t3 }}>Pro Plan</span>
          <span style={{ fontSize: 10, color: C.accent, cursor: "pointer" }}>Manage</span>
        </div>
      </div>
      {/* Main content */}
      <div style={{ flex: 1, overflow: "auto", padding: "16px 24px" }}>
        {pages[page]}
      </div>
    </div>
  );
}
