import { Container } from './styles'

interface EmptyContainerProps {
  content?: string
  variant?: 'empty' | 'error'
}

export function EmptyContainer({
  content = 'reviewed books',
  variant = 'empty',
}: EmptyContainerProps) {
  if (variant === 'error') {
    return (
      <Container>
        <p>Something went wrong.</p>
        <span>
          We couldn&apos;t load the {content}. Please try again later.
        </span>
      </Container>
    )
  }

  return (
    <Container>
      <p>It&apos;s a little empty around here!</p>
      <span>{`We couldn't find any ${content}.`}</span>
    </Container>
  )
}
