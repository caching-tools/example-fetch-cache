import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "react-json-view-lite/dist/index.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next.js Third-Party Library Caching Example",
  description:
    "This app is a Next.js project that showcases how third-party libraries like `axios` interact with Next.js' caching mechanism. It compares the caching abilities of native `fetch` API with `axios` in Next.js. The example demonstrates custom caching and revalidation implementations by tag for third-party libraries, providing insights into managing external data fetching with caching strategies in a Next.js application.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
