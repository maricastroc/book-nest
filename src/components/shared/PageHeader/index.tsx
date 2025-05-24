import { ReactNode } from 'react'
import { Container, Header } from './styles'

interface Props {
  isProfilePage?: boolean
  children: ReactNode
}

export const PageHeader = ({ children, isProfilePage = false }: Props) => {
  return (
    <Container>
      <Header className={`${isProfilePage ? 'profile_style' : ''}`}>
        {children}
      </Header>
    </Container>
  )
}
