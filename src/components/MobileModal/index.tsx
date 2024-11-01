import { Binoculars, ChartLineUp, SignIn, SignOut, User } from 'phosphor-react'
import {
  AvatarContainer,
  AvatarDefault,
  Container,
  Item,
  ItemsContainer,
  LoginButton,
  LoginContainer,
  ProfileContainer,
  Separator,
  SignOutContainer,
} from './styles'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import * as Dialog from '@radix-ui/react-dialog'
import { LoginModal } from '../LoginModal'

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
        {session.data?.user ? (
          <Item
            active={router.pathname.includes('profile')}
            onClick={() => {
              router.pathname.includes('profile')
                ? router.push(`../profile/${session.data?.user.id}`)
                : router.push(`profile/${session.data?.user.id}`)
            }}
          >
            <User />
            <p>Profile</p>
          </Item>
        ) : (
          <LoginContainer>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <LoginButton>
                  <p>Login</p>
                  <SignIn />
                </LoginButton>
              </Dialog.Trigger>
              <LoginModal />
            </Dialog.Root>
          </LoginContainer>
        )}
      </ItemsContainer>
      {session.data?.user && (
        <>
          <Separator />
          <ProfileContainer>
            <AvatarContainer>
              <AvatarDefault src={session.data?.user.avatarUrl} />
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
