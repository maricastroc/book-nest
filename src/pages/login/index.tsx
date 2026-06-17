import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { Container, LogoWrapper } from './styles'
import SignInForm from '@/pages/login/partials/SignInForm'
import { useLoadingOnRouteChange } from '@/hooks/useLoadingOnRouteChange'
import { LoadingComponent } from '@/components/ui/LoadingComponent'
import Logo from '../../../public/assets/logo2.svg'

export default function Login() {
  const isRouteLoading = useLoadingOnRouteChange()

  const [isClient, setIsClient] = useState(false)

  const router = useRouter()

  const { status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/home')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      <NextSeo
        title="Login | Book Nest"
        additionalMetaTags={[
          {
            name: 'viewport',
            content:
              'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
          },
        ]}
      />
      {isClient &&
        (isRouteLoading ? (
          <LoadingComponent withBackground />
        ) : (
          <Container>
            <LogoWrapper>
              <Image alt="BookWise" src={Logo} width={116} height={29} />
            </LogoWrapper>
            <SignInForm />
          </Container>
        ))}
    </>
  )
}
