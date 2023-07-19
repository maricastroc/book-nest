import { Warning } from 'phosphor-react'
import { Container } from './styles'

export function EmptyContainer() {
  return (
    <Container>
      <Warning />
      <p>Ooooops!</p>
      <span>You haven&apos;t reviewed any books yet.</span>
    </Container>
  )
}
