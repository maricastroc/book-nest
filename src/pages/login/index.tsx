import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Logo from '../../../public/assets/logo2.svg'
import { useLoadingOnRouteChange } from '@/hooks/useLoadingOnRouteChange'
import { LoadingComponent } from '@/components/ui/LoadingComponent'
import SignInForm from '@/pages/login/partials/SignInForm'
import { BookIllustration } from '@/pages/login/partials/BookIllustration'
import {
  Container,
  LeftPanel,
  LogoWrapper,
  HeroText,
  RightPanel,
  MobileHero,
  MobileLogoBlock,
  MobileSlogan,
  MobileFormCard,
  DesktopForm,
} from './styles'

export default function Login() {
  const isRouteLoading = useLoadingOnRouteChange()
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') router.push('/home')
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
            <LeftPanel>
              <LogoWrapper>
                <Image alt="BookNest" src={Logo} height={32} />
              </LogoWrapper>

              <BookIllustration />

              <HeroText>
                <h1>
                  Your next favorite book
                  <br />
                  is <span>waiting.</span>
                </h1>
                <p>
                  Track your reading journey, discover new books,
                  <br />
                  and share reviews with readers worldwide.
                </p>
              </HeroText>
            </LeftPanel>

            <RightPanel>
              <MobileHero>
                <MobileLogoBlock>
                  <Image alt="BookNest" src={Logo} height={40} />
                </MobileLogoBlock>

                <MobileSlogan>
                  <h2>
                    Your next favorite book
                    <br />
                    is <span>waiting.</span>
                  </h2>
                  <p>Track your reading journey and discover new books.</p>
                </MobileSlogan>
              </MobileHero>

              <MobileFormCard>
                <SignInForm />
              </MobileFormCard>

              <DesktopForm>
                <SignInForm />
              </DesktopForm>
            </RightPanel>
          </Container>
        ))}
    </>
  )
}
