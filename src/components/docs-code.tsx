'use client'

import { cn } from '@/lib/utils'
import { CodeBlock } from 'react-code-block'

type formatType = 'txt' | undefined

const DocsCode = ({
  code,
  language,
  format
}: {
  code: string
  language: string
  format?: formatType
}) => {
  return (
    <CodeBlock code={code} language={language}>
      <CodeBlock.Code
        className={cn(
          'scrollbar-thin overflow-x-auto overflow-y-hidden rounded-lg bg-zinc-800 px-3 py-2 shadow-lg selection:bg-muted selection:text-muted-foreground dark:bg-zinc-900 dark:selection:bg-primary dark:selection:text-muted',
          format === 'txt' &&
            '[&_.boolean]:*:!text-secondary dark:[&_.boolean]:*:!text-secondary-foreground [&_.constant]:*:!text-secondary dark:[&_.constant]:*:!text-secondary-foreground [&_.literal-property]:*:!text-secondary dark:[&_.literal-property]:*:!text-secondary-foreground [&_.maybe-class-name]:*:!text-secondary dark:[&_.maybe-class-name]:*:!text-secondary-foreground [&_.number]:*:!text-secondary dark:[&_.number]:*:!text-secondary-foreground [&_.plain]:*:!text-secondary dark:[&_.plain]:*:!text-secondary-foreground [&_.property-access]:*:!text-secondary dark:[&_.property-access]:*:!text-secondary-foreground'
        )}
      >
        <div className='table-row'>
          <CodeBlock.LineNumber className='table-cell select-none pr-4 text-right text-muted-foreground text-sm' />
          <CodeBlock.LineContent className='table-cell'>
            <CodeBlock.Token />
          </CodeBlock.LineContent>
        </div>
      </CodeBlock.Code>
    </CodeBlock>
  )
}

export { DocsCode }
