import './globals.css'

import type { Metadata, Viewport } from 'next'
import { SITE_CONFIG } from '@/config'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'
import { Analytics } from '@vercel/analytics/react'
import { ParticlesDot } from '@/components/particles-dot'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Geist, Geist_Mono } from 'next/font/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s - ${SITE_CONFIG.name}`
  },
  metadataBase: new URL(SITE_CONFIG.url),
  description: SITE_CONFIG.description,
  keywords: ['Avatar', 'Create', 'Design', 'Generate', 'Avatars', 'nxtvoid'],
  authors: [
    {
      name: 'nxtvoid',
      url: 'https://twitter.com/nxtvoid'
    }
  ],
  creator: 'nxtvoid',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
    creator: '@nxtvoid'
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-thin scrollbar-track-muted scrollbar-thumb-secondary-foreground relative min-h-dvh overflow-x-hidden bg-background font-sans text-secondary-foreground antialiased selection:bg-primary selection:text-accent',
          geistSans.variable,
          geistMono.variable
        )}
      >
        <TooltipProvider delayDuration={25}>
          <main className='relative z-[1] flex size-full min-h-screen flex-col overflow-auto'>
            {children}
          </main>
        </TooltipProvider>
        <Toaster closeButton />
        <ParticlesDot />
        <Analytics />
      </body>
    </html>
  )
}
