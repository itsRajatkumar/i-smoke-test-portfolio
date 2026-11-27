import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sonia S. — Career Journey",
  description:
    "A 3D interactive career journey through Sonia's professional life.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
