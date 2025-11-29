import type { ShapeType } from '@/zod/enums'

export function generateShapeClipPath(shape: ShapeType, size: number): string {
  const half = size / 2

  switch (shape) {
    case 'circle':
      return `<clipPath id="shapeClip">
        <circle cx="${half}" cy="${half}" r="${half}" />
      </clipPath>`

    case 'squircle':
      return `<clipPath id="shapeClip">
        <path d="
          M ${half} 0
          C ${size * 0.85} 0, ${size} ${size * 0.15}, ${size} ${half}
          C ${size} ${size * 0.85}, ${size * 0.85} ${size}, ${half} ${size}
          C ${size * 0.15} ${size}, 0 ${size * 0.85}, 0 ${half}
          C 0 ${size * 0.15}, ${size * 0.15} 0, ${half} 0
          Z
        " />
      </clipPath>`

    case 'hexagon': {
      const h = size * 0.25
      return `<clipPath id="shapeClip">
        <polygon points="
          ${half},0 
          ${size},${h} 
          ${size},${size - h} 
          ${half},${size} 
          0,${size - h} 
          0,${h}
        " />
      </clipPath>`
    }
    default:
      return ''
  }
}

export function needsClipPath(shape: ShapeType): boolean {
  return shape !== 'square'
}
