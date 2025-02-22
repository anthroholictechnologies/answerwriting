import Header from "answerwriting/components/react-common/header_footer/unauth_header";
import { BlogSidebar } from "answerwriting/components/react-common/blog-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
} from "answerwriting/components/ui/sidebar";
import React from "react";
import { auth } from "answerwriting/auth";

export default async function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SidebarProvider>
      <BlogSidebar />
      <div className="h-screen w-screen">
        <Header isLoggedIn={!!session} />
        <div className="md:hidden flex justify-center p-0 m-0">
          <SidebarTrigger />
        </div>
        <div className="flex flex-col items-center gap-8 py-4 px-2 xl:px-24">
          {children}
        </div>
        {/* <Footer /> */}
      </div>
    </SidebarProvider>
  );
}
