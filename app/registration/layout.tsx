import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create your Devvrats account and join the developer community.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}