"use client";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  isSample?: boolean;
}

export default function EmptyState({ icon, title, description, action, isSample }: EmptyStateProps) {
  return (
    <div className="bg-white border border-[#E8EAEB] rounded-lg p-8 text-center">
      {isSample && (
        <div className="bg-[#FDF1EE] border border-[#EF4623]/10 rounded-md px-3 py-2 mb-4 text-[12px] text-[#EF4623] inline-block">
          Showing sample data — your results are loading
        </div>
      )}
      {icon && <div className="text-4xl mb-3">{icon}</div>}
      <div className="text-base font-semibold text-[#2D3B42] mb-1">{title}</div>
      <div className="text-[12px] text-[#8A9BA3] mb-4 max-w-sm mx-auto">{description}</div>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-[#EF4623] text-white border-none rounded-md px-5 py-2 text-[12px] font-semibold cursor-pointer hover:bg-[#D93D1E] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
