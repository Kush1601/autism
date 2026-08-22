import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  title: "Early Autism Screening | AI-Powered Child Monitoring",
  description: "Identify potential autism risk patterns and track your child's developmental progress over time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
