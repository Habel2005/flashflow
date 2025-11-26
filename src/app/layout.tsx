import type { Metadata } from "next";
import { FlashcardProvider } from "@/context/FlashcardContext";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlashFlow",
  description: "A straightforward flashcard app designed for efficient learning and memorization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FlashcardProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Toaster />
          </FlashcardProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
