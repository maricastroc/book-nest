import {
  BackgroundContainer,
  Container,
  Item,
  ItemsContainer,
  LoginButton,
  LoginContainer,
  PageBtn,
  ProfileContainer,
  SidebarContent,
  SidebarMain,
  SignOutContainer,
} from './styles'
import Image from 'next/image'
import SidebarBackground from '../../../public/assets/sidebar.svg'
import Logo from '../../../public/assets/logo.svg'
import { Binoculars, ChartLineUp, SignIn, SignOut } from 'phosphor-react'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import * as Dialog from '@radix-ui/react-dialog'
import { LoginModal } from '../LoginModal'
import { toast } from 'react-toastify'
import { useState, useCallback, ComponentType } from 'react'
import { CircularProgress } from '@mui/material'
import { AVATAR_URL_DEFAULT } from '@/utils/constants'
import { Avatar } from '../Avatar'
import { useAppContext } from '@/contexts/AppContext'

interface NavigationItemProps {
  active: boolean
  onClick: () => void
  icon: ComponentType
  label: string
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  active,
  onClick,
  icon: Icon,
  label,
}) => (
  <Item>
    <PageBtn active={active} onClick={onClick}>
      <Icon />
      <p>{label}</p>
    </PageBtn>
  </Item>
)

export function Sidebar() {
  const router = useRouter()

  const { data: session } = useSession()

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const { loggedUser, isLoading } = useAppContext()

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: '/' })
    toast.success('See you soon!')
  }, [])

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
              <NavigationItem
                active={router.pathname === '/home'}
                onClick={() => router.push('/home')}
                icon={ChartLineUp}
                label="Home"
              />
              <NavigationItem
                active={router.pathname === '/explore'}
                onClick={() => router.push('/explore')}
                icon={Binoculars}
                label="Explore"
              />
              {session?.user && (
                <NavigationItem
                  active={router.pathname.includes('profile')}
                  onClick={() => {
                    const currentPath = router.asPath
                    const targetPath = currentPath.includes('/profile/')
                      ? `/profile/${session.user.id}`
                      : `profile/${session.user.id}`

                    router.push(targetPath)
                  }}
                  icon={Binoculars}
                  label="Profile"
                />
              )}
            </ItemsContainer>
          </SidebarMain>
          {loggedUser && session?.user.id ? (
            <ProfileContainer>
              {isLoading ? (
                <CircularProgress size="1.5rem" />
              ) : (
                <Avatar
                  isClickable
                  isLoading={isLoading}
                  avatarUrl={loggedUser?.avatarUrl ?? AVATAR_URL_DEFAULT}
                  onClick={() => {
                    const currentPath = router.asPath
                    const targetPath = currentPath.includes('/profile/')
                      ? `/profile/${session.user.id}`
                      : `profile/${session.user.id}`

                    router.push(targetPath)
                  }}
                />
              )}
              <SignOutContainer onClick={handleLogout}>
                <p>{loggedUser.name.split(' ')[0]}</p>
                <SignOut />
              </SignOutContainer>
            </ProfileContainer>
          ) : (
            <LoginContainer>
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <LoginButton onClick={() => setIsLoginModalOpen(true)}>
                    <p>Login</p>
                    <SignIn />
                  </LoginButton>
                </Dialog.Trigger>
                {isLoginModalOpen && (
                  <LoginModal onClose={() => setIsLoginModalOpen(false)} />
                )}
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
