import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "CCProxy v2",
  description: "Claude Code CLI powered by Gemini",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
