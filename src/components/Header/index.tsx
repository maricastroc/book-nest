import Image from 'next/image'
import { Container, HeaderContainer, ListContainer } from './styles'
import Logo from '../../assets/logo.svg'
import { List } from 'phosphor-react'
import { useState } from 'react'
import { MobileModal } from '../MobileModal'

export function MobileHeader() {
  const [openModal, setOpenModal] = useState(false)

  return (
    <Container>
      <HeaderContainer>
        <Image
          src={Logo}
          width={200}
          alt="Logo Application."
          fetchPriority="high"
          quality={100}
        />
        <ListContainer>
          <List onClick={() => setOpenModal(!openModal)} />
        </ListContainer>
      </HeaderContainer>
      {openModal && <MobileModal />}
    </Container>
  )
}
