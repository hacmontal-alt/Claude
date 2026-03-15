import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trace — Be the brand AI recommends",
  description: "Monitor and improve how your brand appears in AI-generated search results across ChatGPT, Gemini, Perplexity, Grok, and Google AI Overviews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
