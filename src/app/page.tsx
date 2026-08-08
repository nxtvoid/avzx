import { SITE_CONFIG } from '@/config'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import { MostPopularExamples } from '@/components/examples'
import Link from 'next/link'

const SAMPLE_URL = `${SITE_CONFIG.url}/your-name`
const SAMPLE_HOST = SITE_CONFIG.url.replace(/^https?:\/\//, '')

export default function Home() {
  return (
    <section className='flex flex-1 flex-col gap-24 px-6 py-16'>
      <article className='flex flex-1 flex-col items-center justify-center gap-6'>
        <div className='grid gap-3 text-center'>
          <h1 className='font-extrabold text-[clamp(4rem,18vw,10rem)] leading-[0.9] tracking-wider'>
            {SITE_CONFIG.name}
          </h1>
          <p className='text-pretty font-mono text-base sm:text-lg'>
            {SITE_CONFIG.description}
          </p>
        </div>

        <div className='flex w-full max-w-sm items-center gap-2 rounded-lg border border-border bg-card/70 py-2 pr-2 pl-3 backdrop-blur-sm'>
          <code className='min-w-0 flex-1 truncate font-mono text-sm'>
            <span className='text-muted-foreground'>{SAMPLE_HOST}/</span>
            <span className='font-medium'>your-name</span>
          </code>
          <CopyButton text={SAMPLE_URL} />
        </div>

        <Button className='select-none font-mono' asChild>
          <Link href='/docs'>Documentation</Link>
        </Button>
      </article>

      <MostPopularExamples />
    </section>
  )
}
