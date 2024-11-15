import {
  Binoculars,
  Books,
  ChartLineUp,
  SignIn,
  User,
  Users,
} from 'phosphor-react'
import { MobileFooterBox, PageLink, PagesLinksContainer } from './styles'
import { useRouter } from 'next/router'
import * as Dialog from '@radix-ui/react-dialog'
import { SignInModal } from '@/components/modals/SignInModal'
import { useState } from 'react'
import { useAppContext } from '@/contexts/AppContext'

export function MobileFooter() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const router = useRouter()

  const { loggedUser } = useAppContext()

  return (
    <MobileFooterBox>
      <PagesLinksContainer className={!loggedUser ? 'unauthorized' : ''}>
        <PageLink
          className={`${router.pathname.includes('home') ? 'active' : ''}`}
          onClick={() => router.push('/home')}
        >
          <ChartLineUp />
          <p>Home</p>
        </PageLink>
        <PageLink
          className={`${router.pathname.includes('explore') ? 'active' : ''}`}
          onClick={() => router.push('/explore')}
        >
          <Binoculars />
          <p>Explore</p>
        </PageLink>
        <PageLink
          className={`${router.pathname.includes('readers') ? 'active' : ''}`}
          onClick={() => router.push('/readers')}
        >
          <Users />
          <p>Readers</p>
        </PageLink>
        <Dialog.Root>
          <Dialog.Trigger asChild></Dialog.Trigger>
        </Dialog.Root>
        {!loggedUser && (
          <Dialog.Root open={isLoginModalOpen}>
            <Dialog.Trigger asChild>
              <PageLink
                onClick={() => {
                  setIsLoginModalOpen(true)
                }}
              >
                <SignIn />
                <p>Sign In</p>
              </PageLink>
            </Dialog.Trigger>
            <SignInModal onClose={() => setIsLoginModalOpen(false)} />
          </Dialog.Root>
        )}
        {loggedUser && (
          <>
            <PageLink
              className={`${
                router.pathname.includes('profile') ? 'active' : ''
              }`}
              onClick={() => {
                const targetPath = `/profile/${loggedUser.id}`
                router.push(targetPath)
              }}
            >
              <User />
              <p>Profile</p>
            </PageLink>
            <PageLink
              className={`${
                router.pathname.includes('library') ? 'active' : ''
              }`}
              onClick={() => {
                const targetPath = `/library/${loggedUser.id}`
                router.push(targetPath)
              }}
            >
              <Books />
              <p>Library</p>
            </PageLink>
          </>
        )}
      </PagesLinksContainer>
    </MobileFooterBox>
  )
}
