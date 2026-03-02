import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Journey - Streamline Your Path to a New Career",
  description: "Track applications, manage interviews, and land your dream job with our all-in-one job search management platform. Organize your job pipeline with Kanban boards, analytics, and smart reminders.",
  keywords: ["Job Search", "Career", "Job Tracker", "Kanban", "Job Applications", "Interview Management", "Career Planning"],
  authors: [{ name: "Job Journey Team" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>",
  },
  openGraph: {
    title: "Job Journey - Streamline Your Path to a New Career",
    description: "Track applications, manage interviews, and land your dream job with our all-in-one job search management platform.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Job Journey - Streamline Your Path to a New Career",
    description: "Track applications, manage interviews, and land your dream job with our all-in-one job search management platform.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
