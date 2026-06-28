/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookBookmark } from '@fortawesome/free-solid-svg-icons'
import { BookStatusListContainer } from '../partials/BookStatusListContainer'

import { UserProps } from '@/@types/user'
import { useAppContext } from '@/contexts/AppContext'
import { MainLayout } from '@/layouts/MainLayout'
import useRequest from '@/hooks/useRequest'

const STATUS_META = [
  { key: 'read', label: 'Finished', color: 'var(--color-st-read)' },
  { key: 'reading', label: 'In Progress', color: 'var(--color-st-reading)' },
  { key: 'wantToRead', label: 'To Read', color: 'var(--color-st-want)' },
  { key: 'didNotFinish', label: 'Abandoned', color: 'var(--color-st-dnf)' },
] as const

export default function Library() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [stats, setStats] = useState<Record<string, number> | null>(null)

  const { loggedUser } = useAppContext()
  const router = useRouter()

  const userId = Array.isArray(router.query.userId)
    ? router.query.userId[0]
    : router.query.userId

  const { data: userInfo } = useRequest<UserProps>(
    userId ? { url: `/user/${userId}`, method: 'GET' } : null,
  )

  const isLoggedUser = loggedUser?.id === userId

  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
  }, [])

  const libraryTitle = useMemo(() => {
    if (!userInfo) return 'Library'
    if (isLoggedUser) return 'My Library'
    return `${userInfo.name}'s Library`
  }, [userInfo, isLoggedUser])

  const totalBooks = stats
    ? Object.values(stats).reduce((a, b) => a + b, 0)
    : null

  return (
    <MainLayout title="Library | Book Nest" pageTitle="">
      <div className="bn-scope flex flex-col px-8 pb-12 pt-8 md:px-10">
        <header className="mb-3 border-b border-line pb-5">
          <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-fg3">
            <FontAwesomeIcon icon={faBookBookmark} style={{ fontSize: 12 }} />
            <span>Reading Journal</span>
          </div>
          <h1 className="font-serif text-[2rem] font-semibold leading-tight tracking-tight text-fg">
            {libraryTitle}
          </h1>
          <p className="mt-0.5 text-[13px] text-fg2">
            Your books, organized by reading status.
          </p>

          {/* Stats chips */}
          {stats !== null && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {totalBooks !== null && (
                <span className="mr-1 text-[13px] font-semibold text-fg">
                  {totalBooks} books
                </span>
              )}
              {STATUS_META.map(({ key, label, color }) => {
                const count = stats[key] ?? 0
                return (
                  <span
                    key={key}
                    className="flex items-center gap-1.5 rounded-full border border-line bg-s1 px-3 py-1 text-[12px] text-fg2"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {count} {label}
                  </span>
                )
              })}
            </div>
          )}
        </header>

        <BookStatusListContainer
          onTriggerRefresh={triggerRefresh}
          refreshKey={refreshKey}
          userInfo={userInfo ?? null}
          onStatsLoaded={setStats}
        />
      </div>
    </MainLayout>
  )
}
