import Sidebar from "@/components/sidebar/Sidebar";
import { BrandProvider } from "@/lib/context/BrandContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <BrandProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </BrandProvider>
  );
}
