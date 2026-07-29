import { type ReactNode } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
