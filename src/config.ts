const IS_PROD = process.env.NODE_ENV === 'production'

export const APP_URL = IS_PROD
  ? 'https://avzx.vercel.app'
  : 'http://localhost:3000'

export const SITE_CONFIG = {
  name: 'avzx',
  description: 'Beautiful avatars for your projects',
  url: APP_URL,
  ogImage: `${APP_URL}/og.webp`,
  links: {
    twitter: 'https://twitter.com/nxtvoid',
    github: 'https://github.com/nxtvoid'
  }
}

export type SITE_CONFIG = typeof SITE_CONFIG
