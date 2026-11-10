import type { Metadata } from "next";
import "./globals.css";
import "./studio.css";
import "./commerce.css";
import { StudioHeader } from "@/components/navigation/studio-header";
import { StudioFooter } from "@/components/navigation/studio-footer";
import { StoreProvider } from "@/components/store-provider";
import { ConnectionStatus } from "@/components/connection-status";
import { siteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Morrow Footwear — Move Into Your Day",
    template: "%s | Morrow",
  },
  description: "Original fictional footwear concepts for everyday movement. Demo storefront with sample data.",
  robots: { index: false, follow: true },
  keywords: ["footwear concept", "sample running shoes", "demo storefront"],
  authors: [{ name: "Morrow Footwear Co." }],
  openGraph: {
    title: "Morrow Footwear — Move Into Your Day",
    description: "Original fictional footwear concepts. Interactive sample storefront; no real sales.",
    images: ["/images/daybreak-one.jpg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <a className="skip-link" href="#main-content">
            Skip to main content
          </a>
          <StudioHeader />
          <ConnectionStatus />
          {children}
          <StudioFooter />
        </StoreProvider>
      </body>
    </html>
  );
}
