import { Inter } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import CareerChatbot from "./components/CareerChatbot"
import { Suspense } from "react"
import { FirebaseAuthProvider } from "@/components/FirebaseAuthProvider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
})

export const metadata = {
  title: "ShikshaSetu — Your Future Starts Here",
  description:
    "Navigate your post-12th journey with confidence. Personalised guidance on subject combinations, college selection, career outcomes, scholarships and resources.",
  icons: {
    icon: "/favicon.ico.png",
    shortcut: "../favicon.ico.png",
  },
}

export default function RootLayout({ children }) {
  return (
    <FirebaseAuthProvider>
      {/* Always dark — applies the dark indigo OKLCH theme */}
      <html lang="en" className="dark">
        <body
          className={`font-sans antialiased ${inter.variable} ${GeistMono.variable}`}
          style={{ fontFamily: "var(--font-inter), var(--font-sans)" }}
        >
          <Suspense
            fallback={
              <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <p className="text-sm text-muted-foreground tracking-wide">Loading…</p>
                </div>
              </div>
            }
          >
            {children}
          </Suspense>
          <Analytics />
          <CareerChatbot />
        </body>
      </html>
    </FirebaseAuthProvider>
  )
}