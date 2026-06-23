import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import Logo from '../../../public/assets/logo2.svg'
import { useLoadingOnRouteChange } from '@/hooks/useLoadingOnRouteChange'
import { LoadingComponent } from '@/components/ui/LoadingComponent'
import SignUpForm from '@/pages/register/partials/SignUpForm'
import { BookIllustration } from '@/pages/login/partials/BookIllustration'
import {
  Container,
  LeftPanel,
  LogoWrapper,
  HeroText,
  RightPanel,
  DesktopForm,
  MobileHero,
  MobileLogoBlock,
  MobileSlogan,
  MobileFormCard,
} from './styles'

export default function Register() {
  const isRouteLoading = useLoadingOnRouteChange()
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') router.push('/home')
  }, [status, router])

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      <NextSeo
        title="Sign Up | Book Nest"
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
                <SignUpForm />
              </MobileFormCard>

              <DesktopForm>
                <SignUpForm />
              </DesktopForm>
            </RightPanel>
          </Container>
        ))}
    </>
  )
}
