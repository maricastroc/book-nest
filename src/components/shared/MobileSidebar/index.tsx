import * as Dialog from '@radix-ui/react-dialog'
import {
  Content,
  LateralMenuWrapper,
  ItemsContainer,
  LogoAndLinksWrapper,
  Overlay,
} from './styles'
import { Binoculars, Books, ChartLineUp, User, Users } from 'phosphor-react'
import { useRouter } from 'next/router'
import { useAppContext } from '@/contexts/AppContext'
import Image from 'next/image'
import Logo from '../../../../public/assets/logo.svg'
import { NavigationItem } from '../NavigationItem'
import { LogoutContainer } from '../LogoutContainer'

interface Props {
  onClose: () => void
}

export function MobileSidebar({ onClose }: Props) {
  const router = useRouter()

  const { loggedUser } = useAppContext()

  return (
    <Dialog.Portal>
      <Overlay className="DialogOverlay" onClick={onClose} />
      <Content className="DialogContent">
        <LateralMenuWrapper>
          <LogoAndLinksWrapper>
            <Image
              src={Logo}
              width={200}
              alt="Logo Application."
              fetchPriority="high"
              quality={100}
            />
            <ItemsContainer>
              <NavigationItem
                active={router.pathname === '/home'}
                onClick={() => router.push('/home')}
                icon={ChartLineUp}
                label="Home"
              />
              <NavigationItem
                active={router.pathname === '/explore'}
                onClick={() => router.push('/explore')}
                icon={Binoculars}
                label="Explore"
              />
              <NavigationItem
                active={router.pathname === '/readers'}
                onClick={() => router.push('/readers')}
                icon={Users}
                label="Readers"
              />
              {loggedUser && (
                <>
                  <NavigationItem
                    active={router.pathname.includes('profile')}
                    onClick={() => {
                      const targetPath = `/profile/${loggedUser?.id}`
                      router.push(targetPath)
                    }}
                    icon={User}
                    label="Profile"
                  />
                  <NavigationItem
                    active={router.pathname.includes('library')}
                    onClick={() => {
                      const targetPath = `/library/${loggedUser?.id}`
                      router.push(targetPath)
                    }}
                    icon={Books}
                    label="Library"
                  />
                </>
              )}
            </ItemsContainer>
          </LogoAndLinksWrapper>
          <LogoutContainer />
        </LateralMenuWrapper>
      </Content>
    </Dialog.Portal>
  )
}
