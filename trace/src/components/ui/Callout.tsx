"use client";

interface CalloutProps {
  type?: "info" | "warning" | "success";
  children: React.ReactNode;
}

export default function Callout({ type = "info", children }: CalloutProps) {
  const styles = {
    info: "bg-[#FDF1EE] border-[#EF4623]/10 text-[#EF4623]",
    warning: "bg-[#FFFBEB] border-[#D97706]/10 text-[#B45309]",
    success: "bg-[#ECFDF5] border-[#059669]/10 text-[#047857]",
  };

  return (
    <div className={`border rounded-lg px-3 py-2.5 text-[12px] ${styles[type]}`}>
      {children}
    </div>
  );
}
