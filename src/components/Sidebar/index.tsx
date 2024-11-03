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
import { useEffect, useState, useCallback, ComponentType } from 'react'
import { api } from '@/lib/axios'
import { UserProps } from '@/@types/user'
import { handleAxiosError } from '@/utils/handleAxiosError'
import { CircularProgress } from '@mui/material'
import { AVATAR_URL_DEFAULT } from '@/utils/constants'
import { Avatar } from '../Avatar'

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
  const [user, setUser] = useState<UserProps | null>(null)

  const [userFirstName, setUserFirstName] = useState('')

  const router = useRouter()

  const session = useSession()

  const [isLoading, setIsLoading] = useState(false)

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: '/' })
    toast.success('See you soon!')
  }, [])

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true)

      if (session?.data?.user) {
        try {
          const response = await api.get(`/profile/${session.data.user.id}`)
          if (response.data) {
            const userProfile = response.data.profile.user
            setUser(userProfile)
            setUserFirstName(userProfile.name.split(' ')[0] ?? '')
          }
        } catch (error) {
          handleAxiosError(error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadUser()
  }, [session?.data?.user])

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
              {session.data?.user && (
                <NavigationItem
                  active={router.pathname.includes('profile')}
                  onClick={() => router.push(`profile/${session.data.user.id}`)}
                  icon={Binoculars}
                  label="Profile"
                />
              )}
            </ItemsContainer>
          </SidebarMain>
          {session.data?.user ? (
            <ProfileContainer>
              {isLoading ? (
                <CircularProgress size="1.5rem" />
              ) : (
                <Avatar
                  isClickable
                  isLoading={isLoading}
                  avatarUrl={user?.avatarUrl ?? AVATAR_URL_DEFAULT}
                  onClick={() => router.push(`profile/${session.data.user.id}`)}
                />
              )}
              <SignOutContainer onClick={handleLogout}>
                <p>{userFirstName}</p>
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
