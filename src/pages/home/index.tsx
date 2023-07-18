import { Icon } from '@iconify/react'
import { RocketLaunch } from 'phosphor-react'
import {
  ButtonAccess,
  ButtonsContainer,
  CoverContainer,
  Heading,
  HomeContainer,
  Separator,
  WelcomeContainer,
} from './styles'
import Image from 'next/image'
import CoverImage from '../../assets/cover.png'
import Logo from '../../assets/logo.svg'
import { signIn, useSession } from 'next-auth/react'

export default function Home() {
  const session = useSession()

  console.log(session)

  return (
    <HomeContainer>
      <CoverContainer>
        <Image
          fetchPriority="high"
          src={Logo}
          alt=""
          width={210}
          quality={100}
          className="logo_image"
        />
        <Image
          src={CoverImage}
          alt=""
          width={700}
          quality={100}
          className="cover_image"
        />
      </CoverContainer>
      <Separator />
      <WelcomeContainer>
        <Heading>
          <h2>Welcome!</h2>
          <p>Please, login or enter as a guest.</p>
        </Heading>
        <ButtonsContainer>
          <ButtonAccess onClick={() => signIn()}>
            <Icon icon="flat-color-icons:google" />
            <p>Login with Google</p>
          </ButtonAccess>
          <ButtonAccess onClick={() => signIn()}>
            <Icon icon="ant-design:github-outlined" color="white" />
            <p>Login with GitHub</p>
          </ButtonAccess>
          <ButtonAccess>
            <RocketLaunch size={32} className="rocket-icon" />
            <p>Access as a guest</p>
          </ButtonAccess>
        </ButtonsContainer>
      </WelcomeContainer>
    </HomeContainer>
  )
}
