import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "answerwriting/components/ui/toaster";
import { GoogleTagManager } from "@next/third-parties/google";
import Header from "answerwriting/components/react-common/header_footer/unauth_header";
import Footer from "answerwriting/components/react-common/header_footer/unauth_footer";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AnswerWriting",
  description: "Master UPSC Mains Answer Writing with AI Precision",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-M3XH7KGZ" />
      <body className={`${openSans.variable} antialiased`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M3XH7KGZ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <div className="h-screen w-screen overflow-auto">
          <Header />
          {children}
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
