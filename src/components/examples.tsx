import { SITE_CONFIG } from '@/config'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const EXAMPLES = [
  {
    src: '/1?source=self',
    alt: 'Avatar generated from a name alone',
    label: 'no params'
  },
  {
    src: '/john-doe?style=initials&source=self',
    alt: 'Avatar showing initials read from the name',
    label: '?style=initials'
  },
  {
    src: '/octocat?style=identicon&source=self',
    alt: 'Mirrored identicon avatar',
    label: '?style=identicon'
  },
  {
    src: '/vercel?style=rings&source=self',
    alt: 'Concentric rings avatar',
    label: '?style=rings'
  },
  {
    src: '/shadcn-ui?style=bauhaus&source=self',
    alt: 'Flat geometric avatar',
    label: '?style=bauhaus'
  },
  {
    src: `/${SITE_CONFIG.name}?style=glyph&source=self`,
    alt: 'Single oversized initial avatar',
    label: '?style=glyph'
  },
  {
    src: '/tailwind?palette=pastel&text=TW&source=self',
    alt: 'Avatar using the pastel palette',
    label: '?palette=pastel'
  },
  {
    src: '/nextjs?emoji=🚀&text=JS&source=self',
    alt: 'Avatar with an emoji and text',
    label: '?emoji=🚀&text=JS'
  }
]

const MostPopularExamples = () => {
  return (
    <div className='grid gap-8'>
      <div className='grid gap-2 text-center'>
        <h2 className='font-mono font-semibold text-2xl'>Most popular</h2>
        <p className='font-mono text-muted-foreground text-sm'>
          Every avatar below is one GET request.
        </p>
      </div>

      <ul className='mx-auto grid w-full max-w-2xl grid-cols-2 justify-items-center gap-x-4 gap-y-8 sm:grid-cols-4'>
        {EXAMPLES.map((example) => (
          <li
            key={example.label}
            className='flex max-w-full flex-col items-center gap-3'
          >
            <Avatar className='size-20 rounded-lg border-none sm:size-24'>
              <AvatarImage
                className='size-full rounded-none'
                src={example.src}
                alt={example.alt}
              />
              <AvatarFallback className='size-full animate-pulse rounded-none' />
            </Avatar>
            <code className='max-w-full truncate font-mono text-muted-foreground text-xs'>
              {example.label}
            </code>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { MostPopularExamples }
