import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.devvrats.in"),

  title: {
    default: "Devvrats | Developer Community",
    template: "%s | Devvrats",
  },

  description:
    "Devvrats is a developer community where developers learn, build, collaborate, share knowledge, and grow together.",

  applicationName: "Devvrats",

  authors: [
    {
      name: "Devvrats",
      url: "https://www.devvrats.in",
    },
  ],

  creator: "Devvrats",
  publisher: "Devvrats",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.devvrats.in",
    siteName: "Devvrats",
    title: "Devvrats | Developer Community",
    description:
      "Devvrats is a developer community where developers learn, build, collaborate, share knowledge, and grow together.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Devvrats | Developer Community",
    description:
      "Devvrats is a developer community where developers learn, build, collaborate, share knowledge, and grow together.",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Devvrats",
  url: "https://www.devvrats.in",
  description:
    "Devvrats is a developer community where developers learn, build, collaborate, share knowledge, and grow together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${roboto.className} relative text-white`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <div className="absolute inset-0 -z-10 bg-black" />

        <main className="relative z-10 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}