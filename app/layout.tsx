import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Devvrats",
  description: "Static gradient background",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="relative text-white">
        {/* Gradient background only */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-950 via-gray-900 to-purple-950 opacity-90" />
        
        {/* Page content */}
        <main className="relative z-10 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}