import Image from 'next/image'
import {
  LogoAndIcon,
  MobileHeaderBox,
  MobileHeaderContent,
  SignOutButton,
} from './styles'
import Logo from '../../../../public/assets/logo.svg'
import { useAppContext } from '@/contexts/AppContext'
import { SignOut } from 'phosphor-react'
import { signOut } from 'next-auth/react'
import { toast } from 'react-toastify'

export function MobileHeader({ ...rest }) {
  const { loggedUser } = useAppContext()

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
    toast.success('See you soon!')
  }

  return (
    <MobileHeaderBox {...rest}>
      <MobileHeaderContent>
        {loggedUser ? (
          <LogoAndIcon>
            <Image
              src={Logo}
              width={200}
              alt="Logo Application."
              fetchPriority="high"
              quality={100}
            />
            <SignOutButton onClick={handleLogout}>
              <SignOut />
            </SignOutButton>
          </LogoAndIcon>
        ) : (
          <Image
            src={Logo}
            width={200}
            alt="Logo Application."
            fetchPriority="high"
            quality={100}
          />
        )}
      </MobileHeaderContent>
    </MobileHeaderBox>
  )
}
