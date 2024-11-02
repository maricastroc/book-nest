import { Binoculars, ChartLineUp, SignIn, SignOut, User } from 'phosphor-react'
import {
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
import { Avatar } from '../Avatar'
import { useEffect, useState } from 'react'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import { handleAxiosError } from '@/utils/handleAxiosError'
import { UserProps } from '@/@types/user'
import { AVATAR_URL_DEFAULT } from '@/utils/constants'

export function MobileModal() {
  const [user, setUser] = useState<UserProps | null>(null)

  const [userFirstName, setUserFirstName] = useState('')

  const router = useRouter()

  const session = useSession()

  async function handleLogout() {
    signOut({ callbackUrl: '/' })
    toast.success('See you soon!')
  }

  const [isLoading, setIsLoading] = useState(false)

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
            <Avatar
              isClickable
              isLoading={isLoading}
              avatarUrl={user?.avatarUrl ?? AVATAR_URL_DEFAULT}
              variant="medium"
              onClick={() => router.push(`profile/${user?.id}`)}
            />
            <SignOutContainer>
              <p>{userFirstName}</p>
              <SignOut onClick={handleLogout} />
            </SignOutContainer>
          </ProfileContainer>
        </>
      )}
    </Container>
  )
}
