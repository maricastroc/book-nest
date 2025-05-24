import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { Container, LogoWrapper } from './styles'
import SignUpForm from '@/pages/register/partials/SignUpForm'
import { useLoadingOnRouteChange } from '@/hooks/useLoadingOnRouteChange'
import { LoadingComponent } from '@/components/core/LoadingComponent'
import Logo from '../../../public/assets/logo.svg'

export default function Register() {
  const isRouteLoading = useLoadingOnRouteChange()

  const [isClient, setIsClient] = useState(false)

  const router = useRouter()

  const { status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/home')
    }
  }, [status, router])

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      <NextSeo
        title="Sign Up | Book Wise"
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
              <Image alt="" src={Logo} />
            </LogoWrapper>
            <SignUpForm />
          </Container>
        ))}
    </>
  )
}
