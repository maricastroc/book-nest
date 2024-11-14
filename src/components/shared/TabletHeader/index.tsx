import Image from 'next/image'
import {
  LinksContainer,
  TabletHeaderWrapper,
  TabletHeaderContent,
} from './styles'
import Logo from '../../../../public/assets/logo.svg'
import { List } from 'phosphor-react'
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { LateralMenu } from '@/components/shared/TabletSidebar'

export function TabletHeader({ ...rest }) {
  const [isLateralMenuOpen, setIsLateralMenuOpen] = useState(false)

  return (
    <TabletHeaderWrapper {...rest}>
      <TabletHeaderContent>
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
          <LateralMenu onClose={() => setIsLateralMenuOpen(false)} />
        </Dialog.Root>
      </TabletHeaderContent>
    </TabletHeaderWrapper>
  )
}
