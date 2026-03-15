import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-xl">
        <h1 className="font-[family-name:var(--font-display)] text-5xl text-[#2D3B42] mb-4">
          Trace
        </h1>
        <p className="text-lg text-[#4A5D66] mb-2">
          Be the brand AI recommends.
        </p>
        <p className="text-sm text-[#8A9BA3] mb-8 max-w-md mx-auto leading-relaxed">
          Monitor and optimize how your brand appears across ChatGPT, Gemini, Perplexity, Grok, and Google AI Overviews.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/onboarding"
            className="px-6 py-3 bg-[#EF4623] text-white rounded-lg text-sm font-semibold hover:bg-[#D93D1E] transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-[#E8EAEB] text-[#2D3B42] rounded-lg text-sm font-semibold hover:bg-[#F0F0F4] transition-colors"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 text-[11px] text-[#8A9BA3]">
          <span>ChatGPT</span>
          <span>Gemini</span>
          <span>Perplexity</span>
          <span>Grok</span>
          <span>AI Overviews</span>
        </div>
      </div>
    </div>
  );
}
