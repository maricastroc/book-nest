import { Binoculars, ChartLineUp, User } from 'phosphor-react'
import { Container, Item, ItemsContainer } from './styles'
import { useRouter } from 'next/router'

export function MobileModal() {
  const router = useRouter()

  return (
    <Container>
      <ItemsContainer>
        <Item className={router.pathname === '/home' ? 'active' : 'none'}>
          <ChartLineUp />
          <p>Home</p>
        </Item>
        <Item className={router.pathname === '/explore' ? 'active' : 'none'}>
          <Binoculars />
          <p>Explore</p>
        </Item>
        <Item className={router.pathname === '/profile' ? 'active' : 'none'}>
          <User />
          <p>Profile</p>
        </Item>
      </ItemsContainer>
    </Container>
  )
}
