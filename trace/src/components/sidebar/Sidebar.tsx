"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Clock,
  Link2,
  TrendingUp,
  Star,
  FileText,
  Lightbulb,
  Search,
  Zap,
  Settings,
  CreditCard,
  Users,
  FolderOpen,
  Key,
  Tag,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import BrandSwitcher from "./BrandSwitcher";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: string;
  disabled?: boolean;
  active: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, href, badge, disabled, active, onClick }: NavItemProps) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-md mx-1.5 transition-colors text-[13px]
        ${active ? "bg-[#FDF1EE] text-[#EF4623] font-semibold" : "text-[#2D3B42] hover:bg-gray-50"}
        ${disabled ? "opacity-40 cursor-default" : ""}
      `}
    >
      <span className={`flex items-center ${active ? "text-[#EF4623]" : "text-[#8A9BA3]"}`}>{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="text-[9px] font-medium text-[#8A9BA3] bg-[#F0F0F4] rounded-full px-1.5 py-0.5">
          {badge}
        </span>
      )}
      {disabled && (
        <span className="text-[8px] text-[#8A9BA3] bg-[#F0F0F4] rounded px-1 py-0.5">Soon</span>
      )}
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="text-[10px] font-semibold uppercase tracking-[1.5px] text-[#8A9BA3] px-3.5 pt-4 pb-1">
      {label}
    </div>
  );
}

function SubNavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 py-1 px-3 pl-5 cursor-pointer rounded mx-1.5 text-[12px] transition-colors
        ${active ? "bg-[#FDF1EE] text-[#EF4623] font-medium" : "text-[#4A5D66] hover:bg-gray-50"}
      `}
    >
      <span className="text-[#8A9BA3] flex items-center">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [projOpen, setProjOpen] = useState(false);
  const [compOpen, setCompOpen] = useState(false);
  const [showGS, setShowGS] = useState(true);

  const nav = (href: string) => () => router.push(href);
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const sz = 15;

  return (
    <div className="w-[200px] bg-[#FAFAFA] border-r border-[#E8EAEB] flex flex-col flex-shrink-0 h-screen">
      {/* Logo + Brand Switcher */}
      <div className="px-3.5 pt-3.5 pb-2.5">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[#EF4623] font-bold text-lg tracking-tight font-[family-name:var(--font-display)]">Trace</span>
        </div>
        <BrandSwitcher />
      </div>

      {/* Scrollable Nav */}
      <div className="flex-1 overflow-y-auto pt-0.5">
        {/* Getting Started */}
        {showGS && (
          <div
            onClick={nav("/onboarding/step-1")}
            className="mx-1.5 mb-1.5 p-2 rounded-md cursor-pointer bg-white border border-[#E8EAEB] hover:border-[#EF4623]/20"
          >
            <div className="flex justify-between mb-1">
              <span className="text-[10px] font-semibold text-[#2D3B42]">Getting Started</span>
              <span className="text-[9px] text-[#EF4623] font-semibold">0/6</span>
            </div>
            <div className="h-[2px] bg-[#F0F0F4] rounded-full">
              <div className="h-full w-0 bg-[#EF4623] rounded-full" />
            </div>
          </div>
        )}

        <SectionLabel label="Insights" />
        <NavItem icon={<LayoutGrid size={sz} />} label="Overview" href="/overview" active={isActive("/overview")} onClick={nav("/overview")} />
        <NavItem icon={<Clock size={sz} />} label="Prompts" href="/prompts" badge="82" active={isActive("/prompts")} onClick={nav("/prompts")} />
        <NavItem icon={<Link2 size={sz} />} label="Sources" href="/sources" active={isActive("/sources")} onClick={nav("/sources")} />
        <NavItem icon={<TrendingUp size={sz} />} label="Impact" href="/impact" active={isActive("/impact")} onClick={nav("/impact")} disabled />

        <SectionLabel label="Actions" />
        <NavItem icon={<Star size={sz} />} label="Earned" href="/earned" badge="14" active={isActive("/earned")} onClick={nav("/earned")} />
        <NavItem icon={<FileText size={sz} />} label="Content" href="/content" badge="7" active={isActive("/content")} onClick={nav("/content")} />
        <NavItem icon={<Lightbulb size={sz} />} label="Opportunities" href="/opportunities" badge="75" active={isActive("/opportunities")} onClick={nav("/opportunities")} />
        <NavItem icon={<Search size={sz} />} label="Prompt Research" href="/research" active={isActive("/research")} onClick={nav("/research")} disabled />

        {/* Project Section */}
        <div className="mt-4 border-t border-[#E8EAEB] pt-1">
          <div onClick={() => setProjOpen(!projOpen)} className="flex items-center gap-1.5 px-3.5 py-2 cursor-pointer">
            <span className="text-[10px] font-semibold text-[#8A9BA3] uppercase tracking-[1.5px] flex-1">Project</span>
            {projOpen ? <ChevronDown size={10} className="text-[#8A9BA3]" /> : <ChevronRight size={10} className="text-[#8A9BA3]" />}
          </div>
          {projOpen && (
            <>
              <SubNavItem icon={<Settings size={14} />} label="Settings" active={isActive("/settings/project")} onClick={nav("/settings/project")} />
              <SubNavItem icon={<Zap size={14} />} label="Brand Kit" active={isActive("/settings/brand-kit")} onClick={nav("/settings/brand-kit")} />
              <SubNavItem icon={<Tag size={14} />} label="Tags" active={isActive("/settings/tags")} onClick={nav("/settings/tags")} />
            </>
          )}
        </div>

        {/* Company Section */}
        <div>
          <div onClick={() => setCompOpen(!compOpen)} className="flex items-center gap-1.5 px-3.5 py-2 cursor-pointer">
            <span className="text-[10px] font-semibold text-[#8A9BA3] uppercase tracking-[1.5px] flex-1">Company</span>
            {compOpen ? <ChevronDown size={10} className="text-[#8A9BA3]" /> : <ChevronRight size={10} className="text-[#8A9BA3]" />}
          </div>
          {compOpen && (
            <>
              <SubNavItem icon={<Settings size={14} />} label="Settings" active={isActive("/settings/company")} onClick={nav("/settings/company")} />
              <SubNavItem icon={<FolderOpen size={14} />} label="Projects" active={isActive("/settings/projects")} onClick={nav("/settings/projects")} />
              <SubNavItem icon={<Key size={14} />} label="API Keys" active={isActive("/settings/api-keys")} onClick={nav("/settings/api-keys")} />
              <SubNavItem icon={<Users size={14} />} label="Members" active={isActive("/settings/members")} onClick={nav("/settings/members")} />
              <SubNavItem icon={<CreditCard size={14} />} label="Billing" active={isActive("/settings/billing")} onClick={nav("/settings/billing")} />
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-3.5 py-2 border-t border-[#E8EAEB] flex justify-between">
        <span className="text-[10px] text-[#8A9BA3]">Pro Plan</span>
        <span className="text-[10px] text-[#EF4623] cursor-pointer hover:underline">Manage</span>
      </div>
    </div>
  );
}
