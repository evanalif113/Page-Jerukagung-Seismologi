import type React from "react"
import type { Metadata } from "next"
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

// Using Roboto which is similar to the WMO's font choice
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "Jerukagung Seismologi",
    default: "Jerukagung Seismologi",
  },
  description: "Penelitian dan Pengembangan Pemantauan Sains Atmosfer Jerukagung Seismologi",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: "/img/logo.png",
        href: "/img/logo.png",
      },
    ],
    apple: [
      {
        url: "/img/logo.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/img/logo.png" sizes="any"/>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          {children}
          <Analytics />
          <SpeedInsights />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
