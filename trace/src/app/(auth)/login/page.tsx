"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // No real auth — just redirect to onboarding
      router.push("/onboarding");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl text-[#2D3B42]">Trace</h1>
        <p className="text-[12px] text-[#8A9BA3] mt-1">
          by <span className="font-medium text-[#4A5D66]">Trace GEO</span>
        </p>
      </div>

      {/* Card */}
      <div className="bg-white border border-[#E8EAEB] rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#2D3B42] mb-1">Sign in</h2>
        <p className="text-[13px] text-[#8A9BA3] mb-5">
          Welcome back. Enter your credentials to continue.
        </p>

        {error && (
          <div className="bg-[#FEF2F2] border border-[#DC2626]/10 text-[#DC2626] text-[12px] rounded-lg px-3 py-2.5 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-[12px] font-medium text-[#4A5D66] mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full border border-[#E8EAEB] rounded-lg px-3 py-2 text-[13px] text-[#2D3B42] placeholder:text-[#8A9BA3] focus:outline-none focus:ring-2 focus:ring-[#EF4623]/20 focus:border-[#EF4623] transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[12px] font-medium text-[#4A5D66] mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-[#E8EAEB] rounded-lg px-3 py-2 text-[13px] text-[#2D3B42] placeholder:text-[#8A9BA3] focus:outline-none focus:ring-2 focus:ring-[#EF4623]/20 focus:border-[#EF4623] transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#EF4623] text-white font-semibold text-[13px] rounded-lg py-2.5 hover:bg-[#d93d1e] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E8EAEB]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-[11px] text-[#8A9BA3] uppercase tracking-wider">
              or
            </span>
          </div>
        </div>

        <button
          type="button"
          className="w-full border border-[#E8EAEB] bg-white text-[#2D3B42] font-medium text-[13px] rounded-lg py-2.5 hover:bg-[#F8F9FA] transition flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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

      <p className="text-center text-[12px] text-[#8A9BA3] mt-5">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-[#EF4623] font-medium hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
