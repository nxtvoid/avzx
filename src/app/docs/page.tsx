import { DATA_EXAMPLES, type DataExample } from '@/lib/data'
import { AVATAR_PARAMS } from '@/lib/constants'
import { Playground } from '@/components/playground'
import { ChevronRight, ChevronsLeftIcon } from 'lucide-react'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CopyButton } from '@/components/ui/copy-button'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Reference',
  description: 'Every parameter accepted by the avatar endpoint.'
}

const BADGE_VARIANT: Record<DataExample['badge'], BadgeProps['variant']> = {
  default: 'muted',
  optional: 'muted',
  new: 'accent'
}

function DocCard({ example }: { example: DataExample }) {
  return (
    <div className='group relative rounded-xl border border-border bg-card/70 p-5 backdrop-blur-sm transition-all hover:border-foreground/20 hover:shadow-xs'>
      <div className='flex items-start gap-4'>
        <div className='min-w-0 flex-1 space-y-3'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge
              variant={BADGE_VARIANT[example.badge]}
              className='font-medium text-xs capitalize'
            >
              {example.badge}
            </Badge>
            <h3 className='font-semibold text-foreground'>{example.title}</h3>
          </div>

          <p className='text-muted-foreground text-sm leading-relaxed'>
            {example.description}
          </p>

          <div className='flex items-center gap-2 rounded-lg bg-muted/50 py-2 pr-2 pl-3'>
            <code className='min-w-0 flex-1 truncate font-mono text-foreground text-sm'>
              {example.url.replace(/[&?]source=[^&]*/g, '')}
            </code>
            <CopyButton
              text={example.url.replace(/source=[^&]*/, 'source=external')}
            />
          </div>

          {example.params && example.params.length > 0 && (
            <div className='space-y-1.5 pt-1'>
              {example.params.map((param) => (
                <div
                  key={param.key}
                  className='flex items-start gap-2 text-xs sm:items-center'
                >
                  <code className='shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-foreground'>
                    {param.key}
                  </code>
                  <ChevronRight className='mt-0.5 size-3 shrink-0 text-muted-foreground sm:mt-0' />
                  <span className='text-muted-foreground'>
                    {param.description}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Avatar className='hidden size-16 shrink-0 rounded-lg border-0 shadow-xs sm:block sm:size-20'>
          <AvatarImage
            src={example.url}
            alt={example.title}
            className='size-full object-cover'
          />
          <AvatarFallback className='size-full animate-pulse rounded-lg' />
        </Avatar>
      </div>
    </div>
  )
}

function ParamsTable() {
  return (
    <div className='overflow-hidden rounded-xl border border-border bg-card/70 backdrop-blur-sm'>
      <div className='scrollbar-thin scrollbar-thumb-border overflow-x-auto'>
        <table className='w-full border-collapse text-left text-sm'>
          <thead>
            <tr className='border-border border-b'>
              <th className='px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide'>
                Param
              </th>
              <th className='px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide'>
                Values
              </th>
              <th className='px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide'>
                Default
              </th>
            </tr>
          </thead>
          <tbody>
            {AVATAR_PARAMS.map((param) => (
              <tr
                key={param.name}
                className='border-border/60 border-b last:border-0'
              >
                <td className='whitespace-nowrap px-5 py-2.5'>
                  <code className='rounded bg-muted px-1.5 py-0.5 font-mono text-foreground text-xs'>
                    {param.name}
                  </code>
                </td>
                <td className='whitespace-nowrap px-5 py-2.5 font-mono text-muted-foreground text-xs'>
                  {param.values}
                </td>
                <td className='whitespace-nowrap px-5 py-2.5 font-mono text-muted-foreground text-xs'>
                  {param.fallback}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function DocsPage() {
  const basicExamples = DATA_EXAMPLES.filter((e) => e.badge !== 'new')
  const newExamples = DATA_EXAMPLES.filter((e) => e.badge === 'new')

  return (
    <section className='mx-auto w-full max-w-3xl space-y-6 px-6 py-16'>
      <div className='space-y-2'>
        <Link href='/' className='group flex items-center gap-2'>
          <div className='rounded-md p-1 transition-all group-hover:-translate-x-0.5 group-hover:bg-accent group-hover:text-accent-foreground'>
            <ChevronsLeftIcon className='size-4' />
          </div>
          <h2 className='font-bold text-2xl tracking-tight'>API Reference</h2>
        </Link>
        <p className='text-muted-foreground'>
          Generate unique avatars with a simple URL. The name is the path; every
          query parameter is optional.
        </p>
      </div>

      <div className='space-y-3'>
        <div className='space-y-1'>
          <h3 className='font-bold text-xl tracking-tight'>Playground</h3>
          <p className='text-muted-foreground text-sm'>
            Combine the options and copy the URL that produces what you see.
          </p>
        </div>
        <Playground />
      </div>

      <Tabs defaultValue='basic' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='basic'>Basic Usage</TabsTrigger>
          <TabsTrigger className='flex items-center gap-2' value='advanced'>
            Advanced
            <Badge
              variant='accent'
              className='pointer-events-none hidden text-xs sm:flex'
            >
              New
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value='basic' className='mt-4 space-y-3'>
          {basicExamples.map((example) => (
            <DocCard key={example.id} example={example} />
          ))}
        </TabsContent>

        <TabsContent value='advanced' className='mt-4 space-y-3'>
          {newExamples.map((example) => (
            <DocCard key={example.id} example={example} />
          ))}
        </TabsContent>
      </Tabs>

      <div className='space-y-3 pt-4'>
        <div className='space-y-1'>
          <h3 className='font-bold text-xl tracking-tight'>All parameters</h3>
          <p className='text-muted-foreground text-sm'>
            Every option the endpoint accepts. Unknown values return{' '}
            <code className='font-mono text-xs'>400</code>.
          </p>
        </div>
        <ParamsTable />
      </div>
    </section>
  )
}
