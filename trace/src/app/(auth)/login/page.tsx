"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      // Check if user has completed onboarding (has a brand)
      const { data: brands } = await supabase
        .from('brands')
        .select('id')
        .limit(1);

      if (brands && brands.length > 0) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      setError(error.message);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #E8EAEB",
    borderRadius: 10,
    fontSize: 14,
    color: "#2D3B42",
    fontFamily: "'Manrope', sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#2D3B42",
    marginBottom: 6,
  };

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "#EF4623",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(3deg)",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontWeight: 700,
                fontStyle: "italic",
                color: "#fff",
                fontSize: 18,
              }}
            >
              T
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 24,
              color: "#2D3B42",
            }}
          >
            Trace
          </span>
        </div>
        <p style={{ fontSize: 14, color: "#8A9BA3" }}>
          Track your brand across AI search engines
        </p>
      </div>

      {/* Card */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #E8EAEB",
          borderRadius: 16,
          padding: "32px 28px",
          boxShadow: "0 4px 24px rgba(45,59,66,0.06)",
        }}
      >
        <h2
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 28,
            color: "#2D3B42",
            marginBottom: 4,
          }}
        >
          Welcome back
        </h2>
        <p style={{ fontSize: 14, color: "#8A9BA3", marginBottom: 24 }}>
          Sign in to your Trace account.
        </p>

        {error && (
          <div
            style={{
              background: "#FEF2F2",
              border: "1px solid rgba(220,38,38,0.1)",
              color: "#DC2626",
              fontSize: 13,
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#EF4623")}
              onBlur={(e) => (e.target.style.borderColor = "#E8EAEB")}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#EF4623")}
              onBlur={(e) => (e.target.style.borderColor = "#E8EAEB")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#E8EAEB" : "#EF4623",
              color: loading ? "#8A9BA3" : "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Manrope', sans-serif",
              transition: "all 0.2s",
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "20px 0",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "#E8EAEB" }} />
          <span
            style={{
              fontSize: 11,
              color: "#8A9BA3",
              textTransform: "uppercase",
              letterSpacing: 1,
              fontWeight: 600,
            }}
          >
            or
          </span>
          <div style={{ flex: 1, height: 1, background: "#E8EAEB" }} />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            padding: "13px",
            border: "1px solid #E8EAEB",
            background: "#fff",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 500,
            color: "#2D3B42",
            cursor: "pointer",
            fontFamily: "'Manrope', sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transition: "background 0.2s",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "#8A9BA3", marginTop: 20 }}>
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          style={{ color: "#EF4623", fontWeight: 600, textDecoration: "none" }}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
