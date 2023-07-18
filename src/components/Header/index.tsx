import Image from 'next/image'
import { Container } from './styles'
import Logo from '../../assets/logo.svg'
import { List } from 'phosphor-react'

export function Header() {
  return (
    <Container>
      <Image
        src={Logo}
        width={200}
        alt="Logo Application."
        fetchPriority="high"
        quality={100}
      />
      <List />
    </Container>
  )
}
