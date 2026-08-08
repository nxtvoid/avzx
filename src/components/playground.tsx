'use client'

import { useMemo, useState } from 'react'

import { SITE_CONFIG } from '@/config'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CopyButton } from '@/components/ui/copy-button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { buildAvatarPath, OFF, PLAYGROUND_CONTROLS } from '@/lib/constants'

const HOST = SITE_CONFIG.url.replace(/^https?:\/\//, '')

const Playground = () => {
  const [name, setName] = useState('octocat')
  const [text, setText] = useState('')
  const [params, setParams] = useState<Record<string, string>>(
    Object.fromEntries(PLAYGROUND_CONTROLS.map((c) => [c.key, c.fallback]))
  )

  const path = useMemo(
    () => buildAvatarPath(name, text, params),
    [name, text, params]
  )

  const shareUrl = `${SITE_CONFIG.url}${path}`
  // `source=self` keeps the live preview out of the usage analytics.
  const previewUrl = `${path}${path.includes('?') ? '&' : '?'}source=self`

  return (
    <div className='space-y-4 rounded-xl border border-border bg-card/70 p-5 backdrop-blur-sm'>
      <div className='flex flex-col gap-5 sm:flex-row'>
        {/* biome-ignore lint/performance/noImgElement: the point is to show the endpoint's raw response, and the URL changes on every keystroke — routing it through next/image would optimise away what is being previewed. */}
        <img
          key={previewUrl}
          src={previewUrl}
          alt='Live avatar preview'
          width={128}
          height={128}
          className='mx-auto size-32 shrink-0 rounded-lg sm:mx-0'
        />

        <div className='grid min-w-0 flex-1 gap-3 sm:grid-cols-2'>
          <div className='space-y-1.5'>
            <Label className='text-muted-foreground text-xs' htmlFor='pg-name'>
              Name
            </Label>
            <Input
              id='pg-name'
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder='octocat'
              className='font-mono'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-muted-foreground text-xs' htmlFor='pg-text'>
              Text <span className='opacity-60'>(optional)</span>
            </Label>
            <Input
              id='pg-text'
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder='auto'
              className='font-mono'
            />
          </div>

          {PLAYGROUND_CONTROLS.map((control) => (
            <div key={control.key} className='space-y-1.5'>
              <Label
                className='text-muted-foreground text-xs'
                htmlFor={`pg-${control.key}`}
              >
                {control.label}
              </Label>
              <Select
                value={params[control.key]}
                onValueChange={(value) =>
                  setParams((current) => ({ ...current, [control.key]: value }))
                }
              >
                <SelectTrigger id={`pg-${control.key}`} className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {control.fallback === OFF && (
                    <SelectItem value={OFF}>none</SelectItem>
                  )}
                  {control.values.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      <div className='flex items-center gap-2 rounded-lg bg-muted/50 py-2 pr-2 pl-3'>
        <code className='min-w-0 flex-1 truncate font-mono text-foreground text-sm'>
          {HOST}
          {path}
        </code>
        <CopyButton text={shareUrl} />
      </div>
    </div>
  )
}

export { Playground }
