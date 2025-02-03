import Footer from "answerwriting/components/misc/misc_footer";
import Header from "answerwriting/components/misc/misc_header";
import { AppSidebar } from "answerwriting/components/react-common/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
} from "answerwriting/components/ui/sidebar";
import React from "react";

export default async function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="h-screen w-screen">
        <Header />
        <div className="md:hidden flex justify-center p-0 m-0">
          <SidebarTrigger />
        </div>
        <div className="flex flex-col items-center gap-8 py-4 px-2 xl:px-24">
          {children}
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
