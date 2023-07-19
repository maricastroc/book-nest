import {
  AvatarContainer,
  AvatarDefault,
  BackgroundContainer,
  Container,
  Item,
  ItemsContainer,
  ProfileContainer,
  SidebarContent,
  SidebarMain,
  SignOutContainer,
} from './styles'
import Image from 'next/image'
import SidebarBackground from '../../../public/assets/sidebar.svg'
import Logo from '../../../public/assets/logo.svg'
import { Binoculars, ChartLineUp, SignOut, User } from 'phosphor-react'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'

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
          </SidebarMain>
          {session.data?.user && (
            <ProfileContainer>
              <AvatarContainer>
                <AvatarDefault src={session.data?.user.avatar_url} />
              </AvatarContainer>
              <SignOutContainer onClick={handleLogout}>
                <p>{firstName}</p>
                <SignOut />
              </SignOutContainer>
            </ProfileContainer>
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
