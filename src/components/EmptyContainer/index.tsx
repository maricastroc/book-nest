import { Warning } from 'phosphor-react'
import { Container } from './styles'

export function EmptyContainer() {
  return (
    <Container>
      <Warning />
      <p>Ooooops!</p>
      <span>We could not find any reviewed books yet.</span>
    </Container>
  )
}
