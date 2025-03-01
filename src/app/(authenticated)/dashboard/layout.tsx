import Appsidebar from "answerwriting/components/react-common/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
} from "answerwriting/components/ui/sidebar";
import React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Appsidebar />
      <div className="h-screen w-screen">
        <div className="md:hidden flex justify-center py-4 m-0 relative">
          <SidebarTrigger className="absolute top-0 left-0 w-12 h-12" />
        </div>
        <div className="flex flex-col gap-2">{children}</div>
      </div>
    </SidebarProvider>
  );
}
