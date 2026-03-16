"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Plus } from "lucide-react";
import { useBrand } from "@/lib/context/BrandContext";

export default function BrandSwitcher() {
  const { brands, activeBrand, setActiveBrandId, loading } = useBrand();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const displayName = activeBrand?.brand_name ?? (loading ? "Loading..." : "No brand");
  const displayMeta = activeBrand
    ? `${activeBrand.market} · ${activeBrand.language}`
    : "";

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="bg-white rounded-md px-2 py-1.5 flex items-center justify-between border border-[#E8EAEB] cursor-pointer hover:border-[#8A9BA3] transition-colors"
      >
        <div>
          <div className="text-[11px] font-semibold text-[#2D3B42]">{displayName}</div>
          {displayMeta && (
            <div className="text-[9px] text-[#8A9BA3]">{displayMeta}</div>
          )}
        </div>
        <ChevronDown size={12} className="text-[#8A9BA3]" />
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E8EAEB] rounded-md shadow-lg z-50 overflow-hidden">
            <div className="p-1">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  onClick={() => {
                    setActiveBrandId(brand.id);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer ${
                    brand.id === activeBrand?.id
                      ? "bg-[#FDF1EE]"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-5 h-5 rounded bg-[#EF4623]/10 flex items-center justify-center text-[10px] font-bold text-[#EF4623]">
                    {brand.brand_name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-[#2D3B42]">
                      {brand.brand_name}
                    </div>
                    <div className="text-[9px] text-[#8A9BA3]">
                      {brand.market} · {brand.language}
                    </div>
                  </div>
                </div>
              ))}
              {brands.length === 0 && !loading && (
                <div className="px-2 py-1.5 text-[11px] text-[#8A9BA3]">
                  No brands yet
                </div>
              )}
            </div>
            <div className="border-t border-[#E8EAEB] p-1">
              <div
                onClick={() => {
                  setOpen(false);
                  router.push("/onboarding/step-1");
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-gray-50 text-[11px] text-[#EF4623]"
              >
                <Plus size={12} />
                Add brand
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
