import { SITE_CONFIG } from '@/config'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const MostPopularExamples = () => {
  return (
    <div className='grid gap-2'>
      <h2 className='font-mono font-semibold text-2xl'>Most popular</h2>
      <div className='flex items-center justify-center gap-2'>
        <Tooltip disableHoverableContent>
          <TooltipTrigger asChild>
            <Avatar className='size-20 rounded-lg border-none'>
              <AvatarImage
                className='size-full rounded-none'
                src={`/${SITE_CONFIG.name}?text=${SITE_CONFIG.name}&type=svg&size=150&source=self`}
                alt={SITE_CONFIG.name}
              />
              <AvatarFallback className='size-full animate-pulse rounded-none' />
            </Avatar>
          </TooltipTrigger>
          <TooltipContent
            className='font-bold font-mono uppercase'
            sideOffset={10}
          >
            <p>With text, type, and size</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip disableHoverableContent>
          <TooltipTrigger asChild>
            <Avatar className='size-20 rounded-lg border-none'>
              <AvatarImage
                className='size-full rounded-none'
                src='/1?source=self'
                alt={SITE_CONFIG.name}
              />
              <AvatarFallback className='size-full animate-pulse rounded-none' />
            </Avatar>
          </TooltipTrigger>
          <TooltipContent
            className='font-bold font-mono uppercase'
            sideOffset={10}
          >
            <p>Default usage</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip disableHoverableContent>
          <TooltipTrigger asChild>
            <Avatar className='size-20 rounded-lg border-none'>
              <AvatarImage
                className='size-full rounded-none'
                src='/shadcn-ui?gradient=radial&source=self'
                alt='@shadcn-ui'
              />
              <AvatarFallback className='size-full animate-pulse rounded-none' />
            </Avatar>
          </TooltipTrigger>
          <TooltipContent
            className='font-bold font-mono uppercase'
            sideOffset={10}
          >
            <p>Radial gradient</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip disableHoverableContent>
          <TooltipTrigger asChild>
            <Avatar className='size-20 rounded-lg border-none'>
              <AvatarImage
                className='size-full rounded-none'
                src='/nextjs?emoji=🚀&text=JS&source=self'
                alt='@nextjs'
              />
              <AvatarFallback className='size-full animate-pulse rounded-none' />
            </Avatar>
          </TooltipTrigger>
          <TooltipContent
            className='font-bold font-mono uppercase'
            sideOffset={10}
          >
            <p>Default usage</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

export { MostPopularExamples }
