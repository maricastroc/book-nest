import { useState } from 'react'
import { useScreenSize } from '@/hooks/useScreenSize'

interface TextBoxProps {
  description: string | undefined
  variant?: 'primary' | 'secondary'
}

export function TextBox({ description }: TextBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isSmallSize = useScreenSize(580)
  const MAX_CHARS = isSmallSize ? 150 : 250

  if (!description || description.length === 0) {
    return (
      <p className="w-full rounded-lg border border-dashed border-line px-3 py-2.5 text-center text-[12.5px] text-fg3">
        No description available
      </p>
    )
  }

  const isTruncated = description.length > MAX_CHARS
  const truncatedText = description.slice(0, MAX_CHARS).trimEnd()
  const lines = isExpanded ? description.split('\n') : truncatedText.split('\n')

  return (
    <p className="w-full text-left text-[13px] leading-[1.55] text-fg2 [word-break:break-word]">
      {lines.map((line, i) => {
        const isLast = i === lines.length - 1
        return (
          <span key={i}>
            {line}
            {isLast && !isExpanded && isTruncated && '... '}
            {isLast && (isTruncated || isExpanded) && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-transparent border-none ml-0.5 inline font-medium text-ac transition-colors hover:text-fg"
              >
                {isExpanded ? 'view less' : 'view more'}
              </button>
            )}
            <br />
          </span>
        )
      })}
    </p>
  )
}
