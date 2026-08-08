import { SITE_CONFIG } from '@/config'
import { GitHubLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons'

const LINKS = [
  { href: SITE_CONFIG.links.github, label: 'GitHub', Icon: GitHubLogoIcon },
  { href: SITE_CONFIG.links.twitter, label: 'Twitter', Icon: TwitterLogoIcon }
]

const SiteFooter = () => {
  return (
    <footer className='mt-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6 py-10 font-mono text-muted-foreground text-xs'>
      <span>{SITE_CONFIG.name}</span>
      {LINKS.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target='_blank'
          rel='noreferrer'
          className='flex items-center gap-1.5 transition-colors hover:text-foreground'
        >
          <Icon className='size-3.5' />
          {label}
        </a>
      ))}
    </footer>
  )
}

export { SiteFooter }
