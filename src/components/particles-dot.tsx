'use client'

import Particles from '@/components/ui/particles'

const ParticlesDot = () => {
  return (
    <Particles
      className='fixed inset-0 z-[0]'
      quantity={200}
      ease={200}
      size={0.2}
      color='#000000'
      refresh
    />
  )
}

export { ParticlesDot }
