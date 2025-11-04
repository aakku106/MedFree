import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import PWAProvider from "@/components/PWAProvider";
import { OfflineAuthProvider } from "@/components/OfflineAuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "MedFree - Free Government Medical Services",
  description:
    "Easily find and access free medical services, checkups, and health camps provided by the government near you.",
  keywords:
    "free medical services, government health camps, Nepal healthcare, free checkups",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MedFree",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#059669",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} font-sans antialiased`}>
          <OfflineAuthProvider>
            <PWAProvider>
              <SmoothScroll />
              {children}
            </PWAProvider>
          </OfflineAuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
