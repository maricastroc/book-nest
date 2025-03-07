import {
  BackgroundContainer,
  Container,
  ItemsContainer,
  SidebarContent,
  SidebarMain,
} from './styles'
import Image from 'next/image'
import SidebarBackground from '../../../../public/assets/sidebar.svg'
import Logo from '../../../../public/assets/logo.svg'
import {
  Binoculars,
  Books,
  ChartLineUp,
  SignIn,
  SignOut,
  User,
  Users,
} from 'phosphor-react'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
import * as Dialog from '@radix-ui/react-dialog'
import { SignInModal } from '../../modals/SignInModal'
import { toast } from 'react-toastify'
import { useState, useCallback, ComponentType } from 'react'
import { AVATAR_URL_DEFAULT } from '@/utils/constants'
import { Avatar } from '../Avatar'
import { useAppContext } from '@/contexts/AppContext'
import { SkeletonUserSidebar } from '@/components/skeletons/SkeletonUserSidebar'
import {
  PageBtn,
  PageBtnWrapper,
  SignInButton,
  SignOutContainer,
  SignInContainer,
  SidebarProfileContainer,
} from '@/styles/shared'

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
  <PageBtnWrapper>
    <PageBtn
      style={{ paddingLeft: '1.5rem' }}
      active={active}
      onClick={onClick}
    >
      <Icon />
      <p>{label}</p>
    </PageBtn>
  </PageBtnWrapper>
)

export function Sidebar() {
  const router = useRouter()

  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  const { loggedUser, isValidatingLoggedUser } = useAppContext()

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
              <NavigationItem
                active={router.pathname === '/readers'}
                onClick={() => router.push('/readers')}
                icon={Users}
                label="Readers"
              />
              {loggedUser && (
                <>
                  <NavigationItem
                    active={router.pathname.includes('profile')}
                    onClick={() => {
                      const targetPath = `/profile/${loggedUser.id}`
                      router.push(targetPath)
                    }}
                    icon={User}
                    label="Profile"
                  />
                  <NavigationItem
                    active={router.pathname.includes('library')}
                    onClick={() => {
                      const targetPath = `/library/${loggedUser.id}`
                      router.push(targetPath)
                    }}
                    icon={Books}
                    label="Library"
                  />
                </>
              )}
            </ItemsContainer>
          </SidebarMain>
          {loggedUser ? (
            <SidebarProfileContainer>
              {isValidatingLoggedUser ? (
                <SkeletonUserSidebar />
              ) : (
                <>
                  <Avatar
                    isClickable
                    isLoading={isValidatingLoggedUser}
                    avatarUrl={loggedUser?.avatarUrl ?? AVATAR_URL_DEFAULT}
                    onClick={() => {
                      const currentPath = router.asPath

                      const targetPath = currentPath.includes('/profile/')
                        ? `/profile/${loggedUser.id}`
                        : `/profile/${loggedUser.id}`

                      router.push(targetPath)
                    }}
                  />
                  <SignOutContainer onClick={handleLogout}>
                    <p>{loggedUser.name.split(' ')[0]}</p>
                    <SignOut />
                  </SignOutContainer>
                </>
              )}
            </SidebarProfileContainer>
          ) : (
            <SignInContainer>
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <SignInButton onClick={() => setIsSignInModalOpen(true)}>
                    <p>Login</p>
                    <SignIn />
                  </SignInButton>
                </Dialog.Trigger>
                {isSignInModalOpen && (
                  <SignInModal onClose={() => setIsSignInModalOpen(false)} />
                )}
              </Dialog.Root>
            </SignInContainer>
          )}
        </SidebarContent>
        <Image
          src={SidebarBackground}
          width={0}
          alt=""
          quality={100}
          fetchPriority="high"
        />
      </BackgroundContainer>
    </Container>
  )
}
