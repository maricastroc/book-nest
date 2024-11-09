import Image from 'next/image'
import { MobileHeaderBox, MobileHeaderContent, LinksContainer } from './styles'
import Logo from '../../../../public/assets/logo.svg'
import { List, X } from 'phosphor-react'
import { useState } from 'react'
import { MobileModal } from '../../modals/MobileModal'

export function MobileHeader({ ...rest }) {
  const [openModal, setOpenModal] = useState(false)

  return (
    <MobileHeaderBox {...rest}>
      <MobileHeaderContent>
        <Image
          src={Logo}
          width={200}
          alt="Logo Application."
          fetchPriority="high"
          quality={100}
        />
        <LinksContainer onClick={() => setOpenModal(!openModal)}>
          {openModal ? <X /> : <List />}
        </LinksContainer>
      </MobileHeaderContent>
      {openModal && <MobileModal />}
    </MobileHeaderBox>
  )
}
