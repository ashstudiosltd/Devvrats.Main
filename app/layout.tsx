import type { Metadata } from "next";
// The stylesheet is processed by Next.js at build time and has no TypeScript module declaration.
// @ts-expect-error -- side-effect CSS imports are handled by Next.js
import "./globals.css";

export const metadata: Metadata = {
  title: "Devvrats",
  description: "Devvrats is indian's own developer community,bringing developers together to learn,build,collaborate, and grow."
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