/** biome-ignore-all lint/performance/noImgElement: intended for demo purposes */
import { SITE_CONFIG } from '@/config'
import { BtnDocsClient } from '@/components/btn-docs-client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

export default function Home() {
  return (
    <div className='grid grow place-content-center gap-28 px-3'>
      <div className='grid place-content-center place-items-center gap-4'>
        <div className='text-center'>
          <h1 className='font-extrabold text-9xl'>{SITE_CONFIG.name}</h1>
          <p className='text-pretty font-mono text-lg'>
            {SITE_CONFIG.description}
          </p>
        </div>
        <BtnDocsClient />
      </div>

      <div className='flex flex-col gap-6 *:text-center'>
        <div className='grid gap-2'>
          <h2 className='font-mono font-semibold text-2xl'>Most popular</h2>
          <div className='flex items-center justify-center gap-2'>
            <Tooltip disableHoverableContent>
              <TooltipTrigger asChild>
                <img
                  className='size-16 rounded-lg'
                  src={`/${SITE_CONFIG.name}?text=${SITE_CONFIG.name}&type=svg&size=150`}
                  alt={SITE_CONFIG.name}
                />
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
                <Avatar className='size-16 rounded-lg'>
                  <AvatarImage
                    className='size-full rounded-none'
                    src='/1'
                    alt={SITE_CONFIG.name}
                  />
                  <AvatarFallback className='size-full animate-pulse rounded-none bg-muted/50' />
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
                <Avatar className='size-16 rounded-lg'>
                  <AvatarImage
                    className='size-full rounded-none'
                    src='/shadcn-ui'
                    alt='@shadcn-ui'
                  />
                  <AvatarFallback className='size-full animate-pulse rounded-none bg-muted/50' />
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
                <Avatar className='size-16 rounded-lg'>
                  <AvatarImage
                    className='size-full rounded-none'
                    src='/nextjs'
                    alt='@nextjs'
                  />
                  <AvatarFallback className='size-full animate-pulse rounded-none bg-muted/50' />
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
        <div className='grid gap-2'>
          <h2 className='font-mono font-semibold text-2xl'>Special</h2>
          <div className='flex items-center justify-center gap-2'>
            <Tooltip disableHoverableContent>
              <TooltipTrigger asChild>
                <img
                  className='size-16 rounded-lg'
                  src={`/${SITE_CONFIG.name}?text=${SITE_CONFIG.name}&type=svg&size=120&rounded=true`}
                  alt={SITE_CONFIG.name}
                />
              </TooltipTrigger>
              <TooltipContent
                className='font-bold font-mono uppercase'
                sideOffset={10}
              >
                <p>Rounded</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip disableHoverableContent>
              <TooltipTrigger asChild>
                <img
                  className='size-16 rounded-lg'
                  src={`/${SITE_CONFIG.name}?type=svg&size=50&color=3742fa`}
                  alt={SITE_CONFIG.name}
                />
              </TooltipTrigger>
              <TooltipContent
                className='font-bold font-mono uppercase'
                sideOffset={10}
              >
                <p>Custom color</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip disableHoverableContent>
              <TooltipTrigger asChild>
                <img
                  className='size-16 rounded-lg'
                  src={`/${SITE_CONFIG.name}?pattern=true&size=150&type=svg`}
                  alt={SITE_CONFIG.name}
                />
              </TooltipTrigger>
              <TooltipContent
                className='font-bold font-mono uppercase'
                sideOffset={10}
              >
                <p>Pattern</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip disableHoverableContent>
              <TooltipTrigger asChild>
                <img
                  className='size-16 rounded-lg'
                  src={`/${SITE_CONFIG.name}?emoji=💻&size=250&text=${SITE_CONFIG.name}&type=svg`}
                  alt={SITE_CONFIG.name}
                />
              </TooltipTrigger>
              <TooltipContent
                className='font-bold font-mono uppercase'
                sideOffset={10}
              >
                <p>Emoji</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}
