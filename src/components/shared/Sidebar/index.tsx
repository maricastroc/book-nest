import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBookOpen,
  faBinoculars,
  faBookBookmark,
  faChartLine,
  faFileLines,
  faRss,
  faRightToBracket,
  faRightFromBracket,
  faUser,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '@/contexts/AppContext'
import { Avatar } from '../Avatar'

type NavEntry = {
  label: string
  icon: IconDefinition
  active: boolean
  onClick: () => void
}

export function Sidebar() {
  const router = useRouter()
  const { loggedUser, isValidatingLoggedUser } = useAppContext()

  const go = (path: string) => () => router.push(path)

  const items: NavEntry[] = [
    {
      label: 'Home',
      icon: faChartLine,
      active: router.pathname === '/home',
      onClick: go('/home'),
    },
    {
      label: 'Explore',
      icon: faBinoculars,
      active: router.pathname === '/explore',
      onClick: go('/explore'),
    },
  ]

  if (loggedUser) {
    items.push(
      {
        label: 'Feed',
        icon: faRss,
        active: router.pathname === '/feed',
        onClick: go('/feed'),
      },
      {
        label: 'Profile',
        icon: faUser,
        active: router.pathname.includes('profile'),
        onClick: go(`/profile/${loggedUser.id}`),
      },
      {
        label: 'Library',
        icon: faBookBookmark,
        active: router.pathname.includes('library'),
        onClick: go(`/library/${loggedUser.id}`),
      },
      {
        label: 'Contributions',
        icon: faBookOpen,
        active: router.pathname === '/my-books',
        onClick: go('/my-books'),
      },
    )

    if (loggedUser.role === 'ADMIN') {
      items.push({
        label: 'Submissions',
        icon: faFileLines,
        active: router.pathname === '/submissions',
        onClick: go('/submissions'),
      })
    }
  }

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: '/' })
    localStorage.removeItem('loggedUser')
    toast.success('See you soon!')
  }, [])

  const userLabel = isValidatingLoggedUser
    ? 'Loading...'
    : loggedUser
    ? loggedUser.name.split(' ')[0]
    : 'Login'

  return (
    <aside className="bn-scope fixed left-6 top-4 z-10 flex h-[calc(100vh-2rem)] w-58 flex-col rounded-2xl border border-line bg-s1 p-5">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3 px-1">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-ac text-ac-ink">
          <FontAwesomeIcon icon={faBookOpen} style={{ fontSize: 18 }} />
        </div>
        <div className="leading-none">
          <div className="font-serif text-[18px] font-semibold tracking-tight text-fg">
            booknest
          </div>
          <div className="mt-1.25 text-[8.5px] uppercase tracking-[0.18em] text-fg3">
            reading journal
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5">
        {items.map(({ label, icon: Icon, active, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={`group relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
              active
                ? 'bg-s2 text-fg'
                : 'text-fg3 hover:bg-s2/60 hover:text-fg2'
            }`}
          >
            <span
              className={`absolute left-0 top-1/2 h-4.5 w-0.75 -translate-y-1/2 rounded-r-full transition-opacity ${
                active ? 'bg-ac opacity-100' : 'opacity-0'
              }`}
            />
            <FontAwesomeIcon
              icon={Icon}
              className="w-5"
              style={{ fontSize: 17 }}
            />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-auto border-t border-line pt-4">
        <div className="flex items-center gap-3">
          <Avatar
            isLoading={isValidatingLoggedUser}
            avatarUrl={loggedUser?.avatarUrl}
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[12.5px] font-medium text-fg">
              {userLabel}
            </span>
            {loggedUser && (
              <span className="truncate text-[10.5px] text-fg3">
                {loggedUser.email}
              </span>
            )}
          </div>
          <button
            onClick={() => (loggedUser ? handleLogout() : router.push('/'))}
            className="shrink-0 text-fg3 transition-colors hover:text-fg"
          >
            {!isValidatingLoggedUser &&
              (loggedUser ? (
                <FontAwesomeIcon
                  icon={faRightFromBracket}
                  style={{ fontSize: 16 }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faRightToBracket}
                  style={{ fontSize: 16 }}
                />
              ))}
          </button>
        </div>
      </div>
    </aside>
  )
}
