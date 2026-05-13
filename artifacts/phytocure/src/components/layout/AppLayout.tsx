import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-foreground dot-grid flex flex-col">
      <Navbar />
      <main className="pt-16 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
