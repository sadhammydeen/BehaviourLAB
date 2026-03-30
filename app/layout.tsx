import type { Metadata, Viewport } from 'next'
import { Fraunces, Space_Grotesk, Space_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const fraunces = Fraunces({ 
  subsets: ["latin"],
  variable: '--font-fraunces',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const spaceMono = Space_Mono({ 
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BehaviourLab | Why People Avoid Insurance Even When It Helps Them',
  description: 'A behavioural economics deep-dive into the psychology of risk avoidance, present bias, loss aversion, and the hidden cost of doing nothing. Explore prospect theory, nudge theory, and choice architecture.',
  keywords: ['behavioural economics', 'loss aversion', 'prospect theory', 'nudge theory', 'insurance', 'present bias', 'choice architecture'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#FF5C00',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <body className="font-sans antialiased bg-[#FFFBF0]">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
