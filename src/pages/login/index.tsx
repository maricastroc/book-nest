import { NextSeo } from 'next-seo'
import {
  CoverContainer,
  Heading,
  Container,
  Separator,
  WelcomeContainer,
  WelcomeContent,
} from './styles'

import Image from 'next/image'
import CoverImage from '../../../public/assets/cover.png'
import Logo from '../../../public/assets/logo.svg'
import LoginForm from '@/components/LoginForm'

export default function Login() {
  return (
    <>
      <NextSeo title="Login | Book Wise" />
      <Container>
        <CoverContainer>
          <Image
            fetchPriority="high"
            src={Logo}
            alt="Application logo."
            width={210}
            quality={100}
            className="logo_image"
          />
          <Image
            fetchPriority="high"
            src={CoverImage}
            alt="Application logo featuring a woman lying on a couch reading a book in the background."
            width={700}
            quality={100}
            className="cover_image"
          />
        </CoverContainer>
        <Separator />
        <WelcomeContainer>
          <WelcomeContent>
            <Heading>
              <h2>Welcome!</h2>
              <p>Please, login or enter as a guest.</p>
            </Heading>
            <LoginForm />
          </WelcomeContent>
        </WelcomeContainer>
      </Container>
    </>
  )
}
