import { SITE_CONFIG } from '@/config'

interface DataExample {
  id: string
  title: string
  badge: 'default' | 'optional' | 'new'
  description: string
  url: string
  params?: { key: string; value: string; description?: string }[]
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
        value: 'vercel',
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
      { key: 'name', value: 'john-doe', description: 'Base name for gradient' },
      {
        key: 'text',
        value: 'John Doe',
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
    params: [{ key: 'type', value: 'png', description: 'svg (default) or png' }]
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
        value: '256',
        description: 'Size in pixels (default: 120)'
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
        value: 'squircle',
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
        value: 'radial',
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
        value: 'dots',
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
    params: [
      { key: 'color', value: '6366f1', description: 'Hex color without #' }
    ]
  },
  {
    id: 'emoji',
    title: 'Emoji support',
    badge: 'optional',
    description: 'Add an emoji to your avatar for extra personality.',
    url: `${SITE_CONFIG.url}/avatar?emoji=🚀&text=AB&source=self`,
    params: [
      { key: 'emoji', value: '🚀', description: 'Any emoji character' },
      { key: 'text', value: 'AB', description: 'Optional text above emoji' }
    ]
  }
]

export { DATA_EXAMPLES, type DataExample }
