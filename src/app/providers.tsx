'use client'

import type { ThemeProviderProps } from 'next-themes/dist/types'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ModalProvider } from '@/components/modals'

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider delayDuration={0}>
        <ModalProvider />
        {children}
      </TooltipProvider>
    </NextThemesProvider>
  )
}

export { ThemeProvider }
