import { DATA_EXAMPLES, type DataExample } from '@/lib/data'
import { ChevronRight, ChevronsLeftIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CopyButton } from '@/components/ui/copy-button'
import Link from 'next/link'

function DocCard({ example }: { example: DataExample }) {
  const badgeVariant = {
    default: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    optional: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    new: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
  }

  return (
    <div className='group relative rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/20 hover:shadow-sm'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex-1 space-y-3'>
          <div className='flex items-center gap-2'>
            <Badge
              variant='outline'
              className={cn(
                'font-medium text-xs capitalize',
                badgeVariant[example.badge]
              )}
            >
              {example.badge}
            </Badge>
            <h3 className='font-semibold text-foreground'>{example.title}</h3>
          </div>

          <p className='text-muted-foreground text-sm leading-relaxed'>
            {example.description}
          </p>

          <div className='flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2'>
            <code className='flex-1 truncate font-mono text-foreground text-sm'>
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
                  className='flex items-center gap-2 text-xs'
                >
                  <code className='rounded bg-muted px-1.5 py-0.5 font-mono text-foreground'>
                    {param.key}
                  </code>
                  <ChevronRight className='size-3 text-muted-foreground' />
                  <span className='text-muted-foreground'>
                    {param.description}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='shrink-0'>
          <Avatar className='size-16 rounded-lg border-0 shadow-sm'>
            <AvatarImage
              src={example.url}
              alt={example.title}
              className='size-full object-cover'
            />
            <AvatarFallback className='size-full animate-pulse rounded-lg' />
          </Avatar>
        </div>
      </div>
    </div>
  )
}

export default function DocsPage() {
  const basicExamples = DATA_EXAMPLES.filter((e) => e.badge !== 'new')
  const newExamples = DATA_EXAMPLES.filter((e) => e.badge === 'new')

  return (
    <section className='mx-auto w-full max-w-3xl space-y-6 py-16'>
      <div className='space-y-2'>
        <Link href='/' className='group flex items-center gap-2'>
          <div className='rounded-md p-1 transition-all group-hover:translate-x-[-2px] group-hover:bg-accent group-hover:text-accent-foreground'>
            <ChevronsLeftIcon className='size-4' />
          </div>
          <h2 className='font-bold text-2xl tracking-tight'>API Reference</h2>
        </Link>
        <p className='text-muted-foreground'>
          Generate unique avatars with a simple URL. All parameters are
          optional.
        </p>
      </div>

      <Tabs defaultValue='basic' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='basic'>Basic Usage</TabsTrigger>
          <TabsTrigger className='flex items-center gap-3' value='advanced'>
            Advanced
            <Badge className='pointer-events-none border-amber-500/20 bg-amber-500/10 text-amber-600 text-xs'>
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

      <div className='rounded-xl border border-border bg-muted/30 p-5'>
        <h3 className='mb-3 font-semibold'>Quick Reference</h3>
        <div className='grid gap-2 text-sm sm:grid-cols-2'>
          <div className='flex items-center gap-2'>
            <code className='rounded border bg-background px-2 py-1 font-mono text-xs'>
              /[name]
            </code>
            <span className='text-muted-foreground'>Base endpoint</span>
          </div>
          <div className='flex items-center gap-2'>
            <code className='rounded border bg-background px-2 py-1 font-mono text-xs'>
              ?text=AB
            </code>
            <span className='text-muted-foreground'>Custom initials</span>
          </div>
          <div className='flex items-center gap-2'>
            <code className='rounded border bg-background px-2 py-1 font-mono text-xs'>
              ?size=256
            </code>
            <span className='text-muted-foreground'>Output size (px)</span>
          </div>
          <div className='flex items-center gap-2'>
            <code className='rounded border bg-background px-2 py-1 font-mono text-xs'>
              ?type=png
            </code>
            <span className='text-muted-foreground'>Output format</span>
          </div>
          <div className='flex items-center gap-2'>
            <code className='rounded border bg-background px-2 py-1 font-mono text-xs'>
              ?shape=circle
            </code>
            <span className='text-muted-foreground'>Avatar shape</span>
          </div>
          <div className='flex items-center gap-2'>
            <code className='rounded border bg-background px-2 py-1 font-mono text-xs'>
              ?gradient=radial
            </code>
            <span className='text-muted-foreground'>Gradient style</span>
          </div>
        </div>
      </div>
    </section>
  )
}
