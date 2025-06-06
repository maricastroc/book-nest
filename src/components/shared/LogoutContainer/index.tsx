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
        isClickable
        isLoading={isValidatingLoggedUser}
        avatarUrl={loggedUser?.avatarUrl}
        onClick={() => {
          const currentPath = router.asPath

          const targetPath = currentPath.includes('/profile/')
            ? `/profile/${loggedUser?.id}`
            : `/profile/${loggedUser?.id}`

          router.push(targetPath)
        }}
      />
      <LogoutContent>
        <p>
          {isValidatingLoggedUser
            ? 'Loading...'
            : loggedUser
            ? loggedUser?.name.split(' ')[0]
            : 'Login'}
        </p>
        {!isValidatingLoggedUser &&
          (loggedUser ? (
            <SignOut className="logout" onClick={handleLogout} />
          ) : (
            <SignIn className="login" onClick={() => router.push('/')} />
          ))}
      </LogoutContent>
    </LogoutWrapper>
  )
}
