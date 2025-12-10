import { LogoutWrapper, LogoutContent } from './styles'
import toast from 'react-hot-toast'
import { useCallback } from 'react'
import { signOut } from 'next-auth/react'
import { SignIn, SignOut } from 'phosphor-react'
import { useAppContext } from '@/contexts/AppContext'
import { Avatar } from '../Avatar'
import { useRouter } from 'next/router'

export const LogoutContainer = () => {
  const router = useRouter()

  const { loggedUser, isValidatingLoggedUser } = useAppContext()

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: '/' })
    localStorage.removeItem('loggedUser')
    toast.success('See you soon!')
  }, [])

  return (
    <LogoutWrapper>
      <Avatar
        isLoading={isValidatingLoggedUser}
        avatarUrl={loggedUser?.avatarUrl}
      />
      <LogoutContent
        onClick={() => {
          if (loggedUser) {
            handleLogout()
          } else {
            router.push('/')
          }
        }}
      >
        <p>
          {isValidatingLoggedUser
            ? 'Loading...'
            : loggedUser
            ? loggedUser?.name.split(' ')[0]
            : 'Login'}
        </p>
        {!isValidatingLoggedUser &&
          (loggedUser ? (
            <SignOut className="logout" />
          ) : (
            <SignIn className="login" />
          ))}
      </LogoutContent>
    </LogoutWrapper>
  )
}
