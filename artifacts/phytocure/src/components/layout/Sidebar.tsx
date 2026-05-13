import { Link, useLocation } from "wouter";
import { 
  Leaf, 
  LayoutDashboard, 
  Pill, 
  Truck, 
  FileText, 
  Microscope, 
  BrainCircuit,
  ArrowRightLeft,
  Menu,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Pill, label: "Products", href: "/products" },
  { icon: Truck, label: "Distributors", href: "/distributors" },
  { icon: FileText, label: "Prescriptions", href: "/prescriptions" },
  { icon: Microscope, label: "Research Hub", href: "/research" },
  { icon: BrainCircuit, label: "AI Analysis", href: "/ai" },
  { icon: ArrowRightLeft, label: "Transactions", href: "/transactions" },
];

export function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden fixed top-4 left-4 z-50 text-primary"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-sidebar-foreground">Phyto<span className="text-primary">cure</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium cursor-pointer group",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground")} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="bg-card/50 border border-border p-3 rounded-lg flex items-center gap-3">
            <div className="bg-primary/20 p-1.5 rounded-full">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-muted-foreground font-medium">Connected Wallet</p>
              <p className="text-sm text-foreground truncate font-mono">8x...3q9</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
