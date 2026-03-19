import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Universal Computer",
  description: "Toko Computer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
