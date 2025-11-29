'use client'

import { useState } from 'react'
import { Button } from './button'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (copied) return

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)

      toast.success('URL copied to clipboard!')

      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Button
      variant='ghost'
      size='icon-xs'
      className={cn(
        'shrink-0 text-muted-foreground hover:text-foreground',
        copied && 'pointer-events-none'
      )}
      onClick={handleCopy}
    >
      {copied ? <Check /> : <Copy />}
      <span className='sr-only'>Copy URL</span>
    </Button>
  )
}

export { CopyButton }
