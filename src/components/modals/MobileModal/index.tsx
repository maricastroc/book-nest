import {
  Binoculars,
  Books,
  ChartLineUp,
  SignIn,
  SignOut,
  User,
} from 'phosphor-react'
import {
  MobileModalBox,
  PageLink,
  PagesLinksContainer,
  SignInButton,
  SignInContainer,
  ProfileContainer,
  DividerLine,
  SignOutContainer,
} from './styles'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
import * as Dialog from '@radix-ui/react-dialog'
import { SignInModal } from '@/components/modals/SignInModal'
import { Avatar } from '@/components/shared/Avatar'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { AVATAR_URL_DEFAULT } from '@/utils/constants'
import { useAppContext } from '@/contexts/AppContext'
import { UserProps } from '@/@types/user'

interface SignInButtonComponentProps {
  setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function SignInButtonComponent({
  setIsLoginModalOpen,
}: SignInButtonComponentProps) {
  return (
    <SignInContainer>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <SignInButton onClick={() => setIsLoginModalOpen(true)}>
            <p>Login</p>
            <SignIn />
          </SignInButton>
        </Dialog.Trigger>
      </Dialog.Root>
    </SignInContainer>
  )
}

interface UserProfileProps {
  loggedUser: UserProps | null
  isLoading: boolean
  handleLogout: () => void
}

function UserProfile({
  loggedUser,
  isLoading,
  handleLogout,
}: UserProfileProps) {
  const router = useRouter()

  return (
    <ProfileContainer>
      <Avatar
        isClickable
        isLoading={isLoading}
        avatarUrl={loggedUser?.avatarUrl ?? AVATAR_URL_DEFAULT}
        variant="medium"
        onClick={() => router.push(`profile/${loggedUser?.id}`)}
      />
      <SignOutContainer>
        <p>{loggedUser?.name.split(' ')[0]}</p>
        <SignOut onClick={handleLogout} />
      </SignOutContainer>
    </ProfileContainer>
  )
}

export function MobileModal() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const router = useRouter()

  const { loggedUser, isLoading } = useAppContext()

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
    toast.success('See you soon!')
  }

  return (
    <MobileModalBox>
      <PagesLinksContainer>
        <PageLink
          active={router.pathname === '/home'}
          onClick={() => router.push('/home')}
        >
          <ChartLineUp />
          <p>Home</p>
        </PageLink>
        <PageLink
          active={router.pathname === '/explore'}
          onClick={() => router.push('/explore')}
        >
          <Binoculars />
          <p>Explore</p>
        </PageLink>
        {loggedUser && (
          <>
            <PageLink
              active={router.pathname.includes('profile')}
              onClick={() => {
                const targetPath = `/profile/${loggedUser.id}`
                router.push(targetPath)
              }}
            >
              <User />
              <p>Profile</p>
            </PageLink>
            <PageLink
              active={router.pathname.includes('library')}
              onClick={() => {
                const targetPath = `/library/${loggedUser.id}`
                router.push(targetPath)
              }}
            >
              <Books />
              <p>Library</p>
            </PageLink>
          </>
        )}
      </PagesLinksContainer>
      {loggedUser ? (
        <>
          <DividerLine />
          <UserProfile
            loggedUser={loggedUser}
            isLoading={isLoading}
            handleLogout={handleLogout}
          />
        </>
      ) : (
        <SignInButtonComponent setIsLoginModalOpen={setIsLoginModalOpen} />
      )}
      {isLoginModalOpen && (
        <SignInModal onClose={() => setIsLoginModalOpen(false)} />
      )}
    </MobileModalBox>
  )
}
