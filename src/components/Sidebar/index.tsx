import {
  AvatarContainer,
  AvatarDefault,
  BackgroundContainer,
  Container,
  Item,
  ItemsContainer,
  LoginButton,
  LoginContainer,
  ProfileContainer,
  SidebarContent,
  SidebarMain,
  SignOutContainer,
} from './styles'
import Image from 'next/image'
import SidebarBackground from '../../../public/assets/sidebar.svg'
import Logo from '../../../public/assets/logo.svg'
import { Binoculars, ChartLineUp, SignIn, SignOut, User } from 'phosphor-react'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import * as Dialog from '@radix-ui/react-dialog'
import { LoginModal } from '../LoginModal'

export function Sidebar() {
  const router = useRouter()
  const session = useSession()

  const fullName = session.data?.user.name
  const firstName = fullName?.split(' ')[0] ?? ''

  async function handleLogout() {
    signOut({ callbackUrl: '/' })
  }

  return (
    <Container>
      <BackgroundContainer>
        <SidebarContent>
          <SidebarMain>
            <Image
              src={Logo}
              width={200}
              alt="Logo Application."
              fetchPriority="high"
              quality={100}
            />
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
              {session.data?.user && (
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
              )}
            </ItemsContainer>
          </SidebarMain>
          {session.data?.user ? (
            <ProfileContainer>
              <AvatarContainer>
                <AvatarDefault src={session.data?.user.avatar_url} />
              </AvatarContainer>
              <SignOutContainer onClick={handleLogout}>
                <p>{firstName}</p>
                <SignOut />
              </SignOutContainer>
            </ProfileContainer>
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
        </SidebarContent>
        <Image
          src={SidebarBackground}
          width={232}
          alt=""
          quality={100}
          fetchPriority="high"
        />
      </BackgroundContainer>
    </Container>
  )
}
