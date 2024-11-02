import { BookOpen } from 'phosphor-react'
import { Container } from './styles'

interface EmptyContainerProps {
  hasIcon?: boolean
  largeSize?: boolean
}

export function EmptyContainer({
  hasIcon = false,
  largeSize = false,
}: EmptyContainerProps) {
  return (
    <Container className={largeSize ? 'large' : ''}>
      {hasIcon && <BookOpen />}
      <p>It&apos;s a little empty around here!</p>
      <span>We could not find any reviewed books yet.</span>
    </Container>
  )
}
