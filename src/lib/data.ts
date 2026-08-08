import { SITE_CONFIG } from '@/config'

interface DataExample {
  id: string
  title: string
  badge: 'default' | 'optional' | 'new'
  description: string
  url: string
  params?: { key: string; description: string }[]
}

const DATA_EXAMPLES: DataExample[] = [
  {
    id: 'default',
    title: 'Default usage',
    badge: 'default',
    description:
      'Generate an avatar using just a name. The gradient is deterministically generated from the name.',
    url: `${SITE_CONFIG.url}/vercel?source=self`,
    params: [
      {
        key: 'name',
        description: 'Any string to generate a unique avatar'
      }
    ]
  },
  {
    id: 'text',
    title: 'Custom text',
    badge: 'optional',
    description:
      'Add initials or custom text overlay. Full names are automatically converted to initials.',
    url: `${SITE_CONFIG.url}/john-doe?text=John Doe&source=self`,
    params: [
      { key: 'name', description: 'Base name for gradient' },
      {
        key: 'text',
        description: 'Displayed text (auto-converts to JD)'
      }
    ]
  },
  {
    id: 'type',
    title: 'Output format',
    badge: 'optional',
    description:
      'Choose between SVG (default, scalable) or PNG format for your avatar.',
    url: `${SITE_CONFIG.url}/avatar?type=png&source=self`,
    params: [{ key: 'type', description: 'svg (default) or png' }]
  },
  {
    id: 'size',
    title: 'Custom size',
    badge: 'optional',
    description: 'Specify the output dimensions in pixels. Default is 120px.',
    url: `${SITE_CONFIG.url}/avatar?size=256&source=self`,
    params: [
      {
        key: 'size',
        description: 'Size in pixels (default: 120)'
      }
    ]
  },
  {
    id: 'style',
    title: 'Avatar styles',
    badge: 'new',
    description:
      'Switch the kind of mark entirely: mirrored identicon, concentric rings, flat geometry, or a single oversized initial. Unlike the default, initials and glyph read the letters off the name when no text is given.',
    url: `${SITE_CONFIG.url}/avatar?style=identicon&source=self`,
    params: [
      {
        key: 'style',
        description: 'gradient | initials | identicon | rings | bauhaus | glyph'
      }
    ]
  },
  {
    id: 'initials',
    title: 'Initials from the name',
    badge: 'new',
    description:
      'The default draws the gradient alone. Ask for the initials style and the letters are derived from the name, splitting on slug separators.',
    url: `${SITE_CONFIG.url}/john-doe?style=initials&source=self`,
    params: [
      {
        key: 'style',
        description: 'john-doe becomes JD, octocat becomes OC'
      }
    ]
  },
  {
    id: 'palette',
    title: 'Colour palettes',
    badge: 'new',
    description:
      'Shift the whole colour range without picking colours by hand. Still deterministic from the name.',
    url: `${SITE_CONFIG.url}/avatar?palette=pastel&source=self`,
    params: [
      {
        key: 'palette',
        description: 'vivid | pastel | earth | mono | neon'
      }
    ]
  },
  {
    id: 'shape',
    title: 'Shape variants',
    badge: 'new',
    description:
      'Choose from multiple shape options: square, circle, squircle, or hexagon.',
    url: `${SITE_CONFIG.url}/avatar?shape=squircle&source=self`,
    params: [
      {
        key: 'shape',
        description: 'square | circle | squircle | hexagon'
      }
    ]
  },
  {
    id: 'gradient',
    title: 'Gradient styles',
    badge: 'new',
    description: 'Select different gradient types for more visual variety.',
    url: `${SITE_CONFIG.url}/avatar?gradient=radial&source=self`,
    params: [
      {
        key: 'gradient',
        description: 'linear | radial | conic | mesh'
      }
    ]
  },
  {
    id: 'pattern',
    title: 'Pattern overlay',
    badge: 'new',
    description: 'Add subtle patterns over the gradient background.',
    url: `${SITE_CONFIG.url}/avatar?pattern=dots&source=self`,
    params: [
      {
        key: 'pattern',
        description: 'dots | grid | stripes | noise'
      }
    ]
  },
  {
    id: 'color',
    title: 'Custom color',
    badge: 'optional',
    description:
      'Override the auto-generated gradient with a specific hex color.',
    url: `${SITE_CONFIG.url}/avatar?color=6366f1&source=self`,
    params: [{ key: 'color', description: 'Hex color without #' }]
  },
  {
    id: 'emoji',
    title: 'Emoji support',
    badge: 'optional',
    description: 'Add an emoji to your avatar for extra personality.',
    url: `${SITE_CONFIG.url}/avatar?emoji=🚀&text=AB&source=self`,
    params: [
      { key: 'emoji', description: 'Any emoji character' },
      { key: 'text', description: 'Optional text above emoji' }
    ]
  }
]

export { DATA_EXAMPLES, type DataExample }
