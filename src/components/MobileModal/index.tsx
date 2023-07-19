import { Binoculars, ChartLineUp, SignOut, User } from 'phosphor-react'
import {
  AvatarContainer,
  AvatarDefault,
  Container,
  Item,
  ItemsContainer,
  ProfileContainer,
  Separator,
  SignOutContainer,
} from './styles'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'

export function MobileModal() {
  const router = useRouter()
  const session = useSession()

  async function handleLogout() {
    signOut({ callbackUrl: '/' })
  }

  return (
    <Container>
      <ItemsContainer>
        <Item active={router.pathname === '/home'}>
          <ChartLineUp />
          <p>Home</p>
        </Item>
        <Item active={router.pathname === '/explore'}>
          <Binoculars />
          <p>Explore</p>
        </Item>
        <Item active={router.pathname === '/profile'}>
          <User />
          <p>Profile</p>
        </Item>
      </ItemsContainer>
      <Separator />
      {session.data?.user && (
        <ProfileContainer>
          <AvatarContainer>
            <AvatarDefault src={session.data?.user.avatar_url} />
          </AvatarContainer>
          <SignOutContainer>
            <p>{session.data?.user.name}</p>
            <SignOut onClick={handleLogout} />
          </SignOutContainer>
        </ProfileContainer>
      )}
    </Container>
  )
}
