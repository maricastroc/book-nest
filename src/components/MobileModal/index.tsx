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

  const fullName = session.data?.user.name
  const firstName = fullName?.split(' ')[0] ?? ''

  async function handleLogout() {
    signOut({ callbackUrl: '/' })
  }

  return (
    <Container>
      <ItemsContainer>
        <Item
          active={router.pathname === '/home'}
          onClick={() => router.push('/home')}
        >
          <ChartLineUp />
          <p>Home</p>
        </Item>
        <Item
          active={router.pathname === '/explore'}
          onClick={() => router.push('/explore')}
        >
          <Binoculars />
          <p>Explore</p>
        </Item>
        <Item
          active={router.pathname === '/profile'}
          onClick={() => router.push('/home')}
        >
          <User />
          <p>Profile</p>
        </Item>
      </ItemsContainer>
      {session.data?.user && (
        <>
          <Separator />
          <ProfileContainer>
            <AvatarContainer>
              <AvatarDefault src={session.data?.user.avatar_url} />
            </AvatarContainer>
            <SignOutContainer>
              <p>{firstName}</p>
              <SignOut onClick={handleLogout} />
            </SignOutContainer>
          </ProfileContainer>
        </>
      )}
    </Container>
  )
}
