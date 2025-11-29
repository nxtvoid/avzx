import { SITE_CONFIG } from '@/config'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SparklesIcon } from 'lucide-react'
import { MostPopularExamples } from '@/components/examples'
import Link from 'next/link'

export default function Home() {
  return (
    <section className='grid flex-1 gap-16'>
      <article className='grid place-content-center place-items-center gap-4'>
        <Badge className='pointer-events-none gap-2 border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 font-mono text-emerald-700 text-sm transition-all hover:border-emerald-500/50 hover:bg-emerald-500/20'>
          <SparklesIcon className='size-4' />
          <span>
            <strong>v2.0</strong> — New variants.
          </span>
        </Badge>
        <div className='text-center'>
          <h1 className='font-extrabold text-[10rem] leading-tight tracking-wider'>
            {SITE_CONFIG.name}
          </h1>
          <p className='text-pretty font-mono text-lg'>
            {SITE_CONFIG.description}
          </p>
        </div>
        <Button className='select-none font-mono' asChild>
          <Link href='/docs'>Documentation</Link>
        </Button>
      </article>

      <article className='flex flex-col gap-10 *:text-center'>
        <MostPopularExamples />
      </article>
    </section>
  )
}
