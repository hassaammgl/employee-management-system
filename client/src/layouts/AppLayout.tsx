import { SidebarProvider } from "@/components/ui/sidebar";
import type React from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { ModeToggle } from "@/components/mode-toggle";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="h-screen w-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
        <div className="fixed bottom-6 right-6">
          <ModeToggle />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
