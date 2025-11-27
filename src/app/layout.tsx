import './globals.css'

import type { Metadata, Viewport } from 'next'
import { SITE_CONFIG } from '@/config'
import { cn } from '@/lib/utils'
import { Analytics } from '@vercel/analytics/react'
import { ParticlesDot } from '@/components/particles-dot'
import { ThemeProvider } from './providers'
import localFont from 'next/font/local'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 200 300 400 500 600 900'
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
})

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s - ${SITE_CONFIG.name}`
  },
  metadataBase: new URL(SITE_CONFIG.url),
  description: SITE_CONFIG.description,
  keywords: ['Avatar', 'Create', 'Design'],
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
          'scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-thin scrollbar-track-muted scrollbar-thumb-secondary-foreground relative min-h-screen overflow-hidden bg-background font-sans text-secondary-foreground antialiased selection:bg-primary-foreground selection:text-primary-background',
          geistSans.variable,
          geistMono.variable
        )}
        vaul-drawer-wrapper=''
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <main className='fade-in-5 slide-in-from-bottom-3 relative z-[1] flex min-h-screen animate-in flex-col duration-500'>
            {children}
          </main>
          <ParticlesDot />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
