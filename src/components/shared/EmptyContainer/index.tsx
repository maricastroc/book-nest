import { Container } from './styles'

interface EmptyContainerProps {
  content?: string
}

export function EmptyContainer({
  content = 'reviewed books',
}: EmptyContainerProps) {
  return (
    <Container>
      <p>It&apos;s a little empty around here!</p>
      <span>{`We couldn't find any ${content}.`}</span>
    </Container>
  )
}
