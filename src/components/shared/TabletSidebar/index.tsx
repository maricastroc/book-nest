import * as Dialog from '@radix-ui/react-dialog'
import {
  Content,
  LateralMenuWrapper,
  ItemsContainer,
  LogoAndLinksWrapper,
} from './styles'
import {
  Binoculars,
  Books,
  ChartLineUp,
  SignIn,
  SignOut,
  User,
} from 'phosphor-react'
import {
  Overlay,
  PageBtnWrapper,
  SidebarProfileContainer,
  PageBtn,
  SignInButton,
  SignOutContainer,
  SignInContainer,
} from '@/styles/shared'
import { useRouter } from 'next/router'
import { useAppContext } from '@/contexts/AppContext'
import { ComponentType, useCallback, useState } from 'react'
import { Avatar } from '@/components/shared/Avatar'
import { AVATAR_URL_DEFAULT } from '@/utils/constants'
import { SkeletonUserSidebar } from '@/components/skeletons/SkeletonUserSidebar'
import { SignInModal } from '../../modals/SignInModal'
import { signOut } from 'next-auth/react'
import { toast } from 'react-toastify'
import Image from 'next/image'
import Logo from '../../../../public/assets/logo.svg'

interface LateralMenuProps {
  onClose: () => void
}

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
    <PageBtn className={active ? 'active' : ''} onClick={onClick}>
      <Icon />
      <p>{label}</p>
    </PageBtn>
  </PageBtnWrapper>
)

export function LateralMenu({ onClose }: LateralMenuProps) {
  const router = useRouter()

  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  const { loggedUser, isValidatingLoggedUser } = useAppContext()

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: '/' })
    toast.success('See you soon!')
  }, [])

  return (
    <Dialog.Portal>
      <Overlay className="DialogOverlay" onClick={onClose} />
      <Content className="DialogContent">
        <LateralMenuWrapper>
          <LogoAndLinksWrapper>
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
              {loggedUser && (
                <>
                  <NavigationItem
                    active={router.pathname.includes('profile')}
                    onClick={() => {
                      const targetPath = `/profile/${loggedUser?.id}`
                      router.push(targetPath)
                    }}
                    icon={User}
                    label="Profile"
                  />
                  <NavigationItem
                    active={router.pathname.includes('library')}
                    onClick={() => {
                      const targetPath = `/library/${loggedUser?.id}`
                      router.push(targetPath)
                    }}
                    icon={Books}
                    label="Library"
                  />
                </>
              )}
            </ItemsContainer>
          </LogoAndLinksWrapper>
          {loggedUser ? (
            <SidebarProfileContainer>
              {isValidatingLoggedUser ? (
                <SkeletonUserSidebar />
              ) : (
                <>
                  <Avatar
                    isClickable
                    variant="medium"
                    isLoading={isValidatingLoggedUser}
                    avatarUrl={loggedUser?.avatarUrl ?? AVATAR_URL_DEFAULT}
                    onClick={() => {
                      const currentPath = router.asPath
                      const targetPath = currentPath.includes('/profile/')
                        ? `/profile/${loggedUser.id}`
                        : `profile/${loggedUser.id}`

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
        </LateralMenuWrapper>
      </Content>
    </Dialog.Portal>
  )
}
