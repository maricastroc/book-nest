import Image from 'next/image'
import {
  LinksContainer,
  MobileHeaderWrapper,
  MobileHeaderContent,
} from './styles'
import Logo from '../../../../public/assets/logo.svg'
import { List } from 'phosphor-react'
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { MobileSidebar } from '@/components/shared/MobileSidebar'

export function MobileHeader({ ...rest }) {
  const [isLateralMenuOpen, setIsLateralMenuOpen] = useState(false)

  return (
    <MobileHeaderWrapper {...rest}>
      <MobileHeaderContent>
        <Image
          src={Logo}
          width={200}
          alt="Logo Application."
          fetchPriority="high"
          quality={100}
        />
        <Dialog.Root open={isLateralMenuOpen}>
          <Dialog.Trigger asChild>
            <LinksContainer
              onClick={() => setIsLateralMenuOpen(!isLateralMenuOpen)}
            >
              <List />
            </LinksContainer>
          </Dialog.Trigger>
          <MobileSidebar onClose={() => setIsLateralMenuOpen(false)} />
        </Dialog.Root>
      </MobileHeaderContent>
    </MobileHeaderWrapper>
  )
}
