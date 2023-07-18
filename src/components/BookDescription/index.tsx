import { useEffect, useRef, useState } from 'react'
import { TruncatedText } from './styles'

interface BookDescriptionProps {
  text: string
}

export function BookDescription({ text }: BookDescriptionProps) {
  const [isTruncated, setIsTruncated] = useState(true)
  const textRef = useRef<HTMLDivElement | null>(null)
  const divRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (textRef.current && divRef.current) {
      setIsTruncated(textRef.current.scrollHeight > divRef.current.clientHeight)
    }
  }, [text])

  return (
    <TruncatedText>
      <div ref={divRef}>
        <p ref={textRef}>{text}</p>
      </div>
      {isTruncated && (
        <span className="ellipsis">
          ...
          <span className="see-more">see more</span>
        </span>
      )}
    </TruncatedText>
  )
}
