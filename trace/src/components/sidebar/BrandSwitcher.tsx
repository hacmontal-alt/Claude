"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";

export default function BrandSwitcher() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="bg-white rounded-md px-2 py-1.5 flex items-center justify-between border border-[#E8EAEB] cursor-pointer hover:border-[#8A9BA3] transition-colors"
      >
        <div>
          <div className="text-[11px] font-semibold text-[#2D3B42]">Sample Brand</div>
          <div className="text-[9px] text-[#8A9BA3]">US · English</div>
        </div>
        <ChevronDown size={12} className="text-[#8A9BA3]" />
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E8EAEB] rounded-md shadow-lg z-50 overflow-hidden">
            <div className="p-1">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-[#FDF1EE] cursor-pointer">
                <div className="w-5 h-5 rounded bg-[#EF4623]/10 flex items-center justify-center text-[10px]">☕</div>
                <div>
                  <div className="text-[11px] font-semibold text-[#2D3B42]">Sample Brand</div>
                  <div className="text-[9px] text-[#8A9BA3]">US · English</div>
                </div>
              </div>
            </div>
            <div className="border-t border-[#E8EAEB] p-1">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-gray-50 text-[11px] text-[#EF4623]">
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
