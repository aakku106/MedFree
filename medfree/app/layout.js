import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

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
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} font-sans antialiased`}>
          <SmoothScroll />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
