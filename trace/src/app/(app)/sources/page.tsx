"use client";

import { useMemo } from "react";
import { useBrand } from "@/lib/context/BrandContext";
import Callout from "@/components/ui/Callout";
import Tag from "@/components/ui/Tag";
import Metric from "@/components/ui/Metric";

const CONTENT_TYPE_COLOR: Record<string, string> = {
  brand: "coral",
  competitor: "red",
  review: "purple",
  ugc: "orange",
  video: "cyan",
  ecommerce: "green",
  reference: "gray",
  editorial: "gray",
};

export default function SourcesPage() {
  const { hasBrand, hasRealData, sources: rawSources, activeBrand, triggerAnalysis } = useBrand();

  const sources = useMemo(() => {
    if (!hasRealData) return [];

    const domainMap = new Map<
      string,
      { type: string; count: number; citations: number; owned: boolean }
    >();
    for (const s of rawSources) {
      const existing = domainMap.get(s.domain) || {
        type: s.content_type ?? "unknown",
        count: 0,
        citations: 0,
        owned: s.is_brand_owned,
      };
      existing.count++;
      existing.citations += s.citation_count;
      domainMap.set(s.domain, existing);
    }

    return Array.from(domainMap.entries())
      .map(([domain, data]) => ({
        domain,
        contentType: data.type,
        isBrandOwned: data.owned,
        frequency: data.count,
        totalCitations: data.citations,
        avgCitations: Math.round((data.citations / data.count) * 10) / 10,
      }))
      .sort((a, b) => b.frequency - a.frequency);
  }, [hasRealData, rawSources]);

  if (!hasBrand) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-[#8A9BA3] text-sm mb-4">Add a brand to see cited sources.</p>
        <a href="/onboarding/step-1" className="px-6 py-3 bg-[#EF4623] text-white rounded-lg text-sm font-semibold">
          Add your first brand
        </a>
      </div>
    );
  }

  if (!hasRealData) {
    return (
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-[#2D3B42]">Sources</h1>
          <p className="text-[13px] text-[#8A9BA3] mt-0.5">
            Domains and pages cited by AI models in responses about {activeBrand?.brand_name ?? "your brand"}.
          </p>
        </div>
        <div className="bg-white border border-[#E8EAEB] rounded-xl p-8 text-center">
          <p className="text-[#8A9BA3] text-sm mb-4">
            Run an analysis to discover which sources AI models cite when discussing your brand.
          </p>
          <button
            onClick={() => triggerAnalysis()}
            className="px-6 py-3 bg-[#EF4623] text-white rounded-lg text-sm font-semibold hover:bg-[#d93d1e] transition"
          >
            Run analysis
          </button>
        </div>
      </div>
    );
  }

  const totalSources = sources.length;
  const brandOwned = sources.filter((s) => s.isBrandOwned).length;
  const totalCitations = sources.reduce((a, s) => a + s.totalCitations, 0);
  const brandCitations = sources
    .filter((s) => s.isBrandOwned)
    .reduce((a, s) => a + s.totalCitations, 0);
  const citationRate =
    totalCitations > 0
      ? Math.round((brandCitations / totalCitations) * 1000) / 10
      : 0;

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-[#2D3B42]">Sources</h1>
        <p className="text-[13px] text-[#8A9BA3] mt-0.5">
          Domains and pages cited by AI models in responses about {activeBrand?.brand_name ?? "your brand"}.
        </p>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <Metric label="Total Sources" value={String(totalSources)} />
        <Metric label="Brand Owned" value={String(brandOwned)} />
        <Metric label="Brand Citation Rate" value={`${citationRate}%`} />
        <Metric label="Top Domain" value={sources[0]?.domain ?? "N/A"} />
      </div>

      <div className="bg-white border border-[#E8EAEB] rounded-lg overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#E8EAEB] bg-[#F8F9FA]">
              <th className="text-left text-[10px] text-[#8A9BA3] uppercase tracking-wider font-medium px-3 py-2.5">
                Domain
              </th>
              <th className="text-right text-[10px] text-[#8A9BA3] uppercase tracking-wider font-medium px-3 py-2.5">
                Citations
              </th>
              <th className="text-center text-[10px] text-[#8A9BA3] uppercase tracking-wider font-medium px-3 py-2.5">
                Content Type
              </th>
              <th className="text-center text-[10px] text-[#8A9BA3] uppercase tracking-wider font-medium px-3 py-2.5">
                Brand Owned
              </th>
            </tr>
          </thead>
          <tbody>
            {sources.map((source) => (
              <tr
                key={source.domain}
                className="border-b border-[#E8EAEB] hover:bg-[#F8F9FA] transition"
              >
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        source.isBrandOwned ? "bg-[#EF4623]" : "bg-[#E8EAEB]"
                      }`}
                    />
                    <span className="text-[#2D3B42] font-medium">
                      {source.domain}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-right text-[#4A5D66] tabular-nums">
                  {source.totalCitations}
                </td>
                <td className="px-3 py-2.5 text-center">
                  <Tag
                    label={source.contentType}
                    color={CONTENT_TYPE_COLOR[source.contentType] ?? "gray"}
                    small
                  />
                </td>
                <td className="px-3 py-2.5 text-center">
                  {source.isBrandOwned ? (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-[#ECFDF5] rounded-full">
                      <svg className="w-3 h-3 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  ) : (
                    <span className="text-[#8A9BA3]">&mdash;</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
