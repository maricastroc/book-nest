import { useState } from 'react'
import {
  ViewMoreButton,
  TextBoxContent,
  TextBoxWrapper,
  EmptyRating,
} from './styles'
import { useScreenSize } from '@/hooks/useScreenSize'

interface TextBoxProps {
  description: string | undefined
  variant?: 'primary' | 'secondary'
}

export function TextBox({ description, variant = 'primary' }: TextBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const isSmallSize = useScreenSize(480)

  const MAX_CHARS = isSmallSize ? 150 : 250

  if (!description || description.length === 0) {
    return (
      <TextBoxWrapper>
        <EmptyRating>No description available</EmptyRating>
      </TextBoxWrapper>
    )
  }

  const isTruncated = description.length > MAX_CHARS
  const truncatedText = description.slice(0, MAX_CHARS).trimEnd()
  const descriptionLines = isExpanded
    ? description.split('\n')
    : truncatedText.split('\n')

  return (
    <TextBoxWrapper>
      <TextBoxContent>
        <p>
          {descriptionLines.map((line, index) => {
            const isLastLine = index === descriptionLines.length - 1
            return (
              <span key={index}>
                {line}
                {isLastLine && !isExpanded && isTruncated && '... '}
                {isLastLine && (isTruncated || isExpanded) && (
                  <ViewMoreButton
                    className={variant}
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{ display: 'inline', padding: 0, marginLeft: 4 }}
                  >
                    {isExpanded ? 'view less' : 'view more'}
                  </ViewMoreButton>
                )}

                <br />
              </span>
            )
          })}
        </p>
      </TextBoxContent>
    </TextBoxWrapper>
  )
}
