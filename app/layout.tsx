import type { Metadata } from "next"
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

// Using Roboto which is similar to the WMO's font choice
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Jerukagung Seismologi",
    default: "Jerukagung Seismologi",
  },
  description: "Penelitian dan Pengembangan Pemantauan Sains Atmosfer Jerukagung Seismologi",
  keywords: [
    "Jerukagung",
    "Seismologi",
    "Pemantauan",
    "Sains Atmosfer",
    "Penelitian",
    "Pengembangan",
    "Teknologi",
    "Sensor",
    "Aktuator",
  ],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: "/img/logo.png",
        href: "/img/logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/img/logo.png",
        href: "/img/logo.png",
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
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Header />
          <Navbar/>
          {children}
          <Analytics />
          <SpeedInsights />
          <Footer/>
        </ThemeProvider>
      </body>
    </html>
  );
}
