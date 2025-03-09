import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Providers } from "@/components/providers"
import Head from "next/head"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The Dev Jounal",
  description: "The Perfect Blog For The Modern Software Developer",
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1e293b" },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "The Dev Journal",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
<title>The Dev Journal</title>
<meta name="description" content="The Perfect Blog For The Modern Software Developer"/>
<meta property="og:url" content="https://the-dev-journal-blog.vercel.app/"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="The Dev Journal"/>
<meta property="og:description" content="The Perfect Blog For The Modern Software Developer"/>
<meta property="og:image" content="https://opengraph.b-cdn.net/production/images/b477a1f9-eb25-492d-9ee7-394e9c38c09a.png?token=NeW9nEowS7OdWdmYcfswq9af90aPsIFtaacXxohmMug&height=162&width=418&expires=33277522370"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta property="twitter:domain" content="the-dev-journal-blog.vercel.app"/>
<meta property="twitter:url" content="https://the-dev-journal-blog.vercel.app/"/>
<meta name="twitter:title" content="The Dev Journal"/>
<meta name="twitter:description" content="The Perfect Blog For The Modern Software Developer"/>
<meta name="twitter:image" content="https://opengraph.b-cdn.net/production/images/b477a1f9-eb25-492d-9ee7-394e9c38c09a.png?token=NeW9nEowS7OdWdmYcfswq9af90aPsIFtaacXxohmMug&height=162&width=418&expires=33277522370"/>
<meta property="og:image" content="https://ogcdn.net/08412a0c-7311-426c-940d-480f94d637d4/v1/myagency.com/Get%20On%20Board%20Meta%20Ads%20Campaigns/https%3A%2F%2Fopengraph.b-cdn.net%2Fproduction%2Fimages%2F56188dc2-e3c3-4ce5-a8b1-1323953e37b9.jpg%3Ftoken%3DhOY-wLL-tV2Wb6eqlpzb3hUOqYMZbXQ3az2flBDqaSs%26height%3D800%26width%3D1200%26expires%3D33251249770/%23000000/og.png" />

      </Head>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}

