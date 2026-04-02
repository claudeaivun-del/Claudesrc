import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "CCProxy Chat - Claude-style AI powered by Gemini",
  description: "An advanced AI coding assistant with Claude-style capabilities, powered by Gemini API. Features include code execution, file operations, web search, and intelligent code analysis.",
  keywords: ["AI", "chat", "coding assistant", "Gemini", "Claude", "code generation", "programming"],
}

export const viewport: Viewport = {
  themeColor: '#030712',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-100">{children}</body>
    </html>
  )
}
