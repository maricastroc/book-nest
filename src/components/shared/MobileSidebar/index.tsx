import * as Dialog from '@radix-ui/react-dialog'
import {
  faBinoculars,
  faBookOpen,
  faBookBookmark,
  faChartLine,
  faFileLines,
  faRss,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { useAppContext } from '@/contexts/AppContext'
import Image from 'next/image'
import Logo from '../../../../public/assets/logo2.svg'
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
      <Dialog.Overlay
        className="fixed inset-0 z-9997 bg-black/70"
        onClick={onClose}
      />
      <Dialog.Content className="fixed left-0 top-0 z-9998 flex h-full w-[min(100vw,460px)] flex-col overflow-y-auto bg-s1 px-10 py-10 pb-8">
        <div className="flex h-full flex-col items-start justify-between">
          <div className="flex flex-col items-start gap-12">
            <Image
              src={Logo}
              width={200}
              alt="Logo Application."
              fetchPriority="high"
              quality={100}
              className="w-[8.2rem]"
            />
            <div className="flex flex-col items-start gap-8">
              <NavigationItem
                active={router.pathname === '/home'}
                onClick={() => router.push('/home')}
                icon={faChartLine}
                label="Home"
              />
              <NavigationItem
                active={router.pathname === '/explore'}
                onClick={() => router.push('/explore')}
                icon={faBinoculars}
                label="Explore"
              />
              {loggedUser && (
                <>
                  <NavigationItem
                    active={router.pathname === '/feed'}
                    onClick={() => router.push('/feed')}
                    icon={faRss}
                    label="Feed"
                  />
                  <NavigationItem
                    active={router.pathname.includes('profile')}
                    onClick={() => router.push(`/profile/${loggedUser.id}`)}
                    icon={faUser}
                    label="Profile"
                  />
                  <NavigationItem
                    active={router.pathname.includes('library')}
                    onClick={() => router.push(`/library/${loggedUser.id}`)}
                    icon={faBookBookmark}
                    label="Library"
                  />
                  <NavigationItem
                    active={router.pathname === '/my-books'}
                    onClick={() => router.push('/my-books')}
                    icon={faBookOpen}
                    label="My Books"
                  />
                </>
              )}
              {loggedUser?.role === 'ADMIN' && (
                <NavigationItem
                  active={router.pathname === '/submissions'}
                  onClick={() => router.push('/submissions')}
                  icon={faFileLines}
                  label="Submissions"
                />
              )}
            </div>
          </div>
          <LogoutContainer />
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
