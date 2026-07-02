import { useState, type ReactNode } from "react";
import { Header } from "./Header";
import { SelectedListDrawer } from "./SelectedListDrawer";
import { ToastContainer } from "../ui";

interface LayoutProps {
  children: ReactNode;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onToggleFilters?: () => void;
}

export function Layout({ children, searchQuery, onSearchChange, onToggleFilters }: LayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col text-gray-900 font-sans">
      <Header 
        onOpenDrawer={() => setIsDrawerOpen(true)} 
        onToggleFilters={onToggleFilters}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto">
        {children}
      </main>

      <SelectedListDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />

      <ToastContainer />
    </div>
  );
}
