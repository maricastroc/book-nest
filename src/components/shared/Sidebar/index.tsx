import {
  BackgroundContainer,
  Container,
  ItemsContainer,
  SidebarContent,
  SidebarMain,
} from './styles'
import Image from 'next/image'
import SidebarBackground from '../../../../public/assets/sidebar.svg'
import Logo from '../../../../public/assets/logo2.svg'
import { Binoculars, Books, ChartLineUp, User, Users } from 'phosphor-react'
import { useRouter } from 'next/router'
import { useAppContext } from '@/contexts/AppContext'
import { NavigationItem } from '../NavigationItem'
import { LogoutContainer } from '../LogoutContainer'

export function Sidebar() {
  const router = useRouter()

  const { loggedUser } = useAppContext()

  return (
    <Container>
      <BackgroundContainer>
        <SidebarContent>
          <SidebarMain>
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
                      const targetPath = `/profile/${loggedUser.id}`
                      router.push(targetPath)
                    }}
                    icon={User}
                    label="Profile"
                  />
                  <NavigationItem
                    active={router.pathname.includes('library')}
                    onClick={() => {
                      const targetPath = `/library/${loggedUser.id}`
                      router.push(targetPath)
                    }}
                    icon={Books}
                    label="Library"
                  />
                </>
              )}
            </ItemsContainer>
          </SidebarMain>
          <LogoutContainer />
        </SidebarContent>
        <Image
          src={SidebarBackground}
          width={0}
          alt=""
          quality={100}
          fetchPriority="high"
        />
      </BackgroundContainer>
    </Container>
  )
}
