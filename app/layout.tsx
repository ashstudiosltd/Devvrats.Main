import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Devvrats | Developer Community",
  description:
    "Devvrats is a developer community where developers learn, build, collaborate, share knowledge, and grow together.",
 metadataBase: new URL("https://www.devvrats.in"),
  alternates: {
    canonical: "/",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Devvrats",
  url: "https://devvrats.in",
  description:
    "Devvrats is a developer community where developers learn, build, collaborate, share knowledge, and grow together.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${roboto.className} relative text-white`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        {/* Gradient background only */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black via-gray-900 to-purple-950 opacity-90" />

        {/* Page content */}
        <main className="relative z-10 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}