import { ReactNode, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faRss,
  faUserPlus,
  faRightToBracket,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { useSession } from 'next-auth/react'

import { MainLayout } from '@/layouts/MainLayout'
import { RatingCard } from '@/components/features/books/RatingCard'
import { SkeletonRatingCard } from '@/components/features/books/SkeletonRatingCard'
import { Pagination } from '@/components/ui/Pagination'
import { SearchBar } from '@/components/ui/SearchBar'

import { FindReaders } from './partials/FindReaders'

import useRequest from '@/hooks/useRequest'
import { BookProps } from '@/@types/book'
import { RatingProps } from '@/@types/rating'

type RatingActivity = {
  type: 'rating'
  id: string
  createdAt: string
  user: { id: string; name: string; avatarUrl?: string | null }
  book: { id: string; name: string; author: string; coverUrl: string }
  rate: number
  description: string
  votes: { up: number; down: number; userVote: string | null }
}

type AnyActivity = RatingActivity | { type: 'reading_status'; id: string }

function FeedEmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: IconDefinition
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-16 text-center lg:my-auto">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-ac-border bg-ac-soft text-ac">
        <FontAwesomeIcon icon={icon} style={{ fontSize: 20 }} />
      </div>
      <div className="flex max-w-xs flex-col gap-1.5">
        <p className="font-serif text-[1.1rem] font-semibold leading-tight text-fg">
          {title}
        </p>
        <p className="text-[13.5px] leading-relaxed text-fg2">{description}</p>
      </div>
      {action}
    </div>
  )
}

export default function Feed() {
  const { data: session } = useSession()
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)
  const [isLateralMenuOpen, setIsLateralMenuOpen] = useState(false)
  const findReadersRef = useRef<HTMLDivElement>(null)

  const { data, isValidating, mutate } = useRequest<{
    activities: AnyActivity[]
    totalPages: number
    followingIds: string[]
  }>(
    session?.user
      ? {
          url: '/feed',
          method: 'GET',
          params: { page: currentPage, ...(search ? { search } : {}) },
        }
      : null,
    { revalidateOnFocus: false, keepPreviousData: true, dedupingInterval: 0 },
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  // Only surface the feed search once there's actually a feed to search —
  // otherwise it competes with the "Find Readers" search in the empty state.
  const showFeedSearch =
    !!session?.user && (!!search || (data?.followingIds?.length ?? 0) > 0)

  const scrollToFindReaders = () => {
    findReadersRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const renderFeed = () => {
    if (!session?.user) {
      return (
        <FeedEmptyState
          icon={faRightToBracket}
          title="See your community feed"
          description="Sign in to see what the readers you follow are reading and reviewing."
        />
      )
    }

    if (isValidating) {
      return Array.from({ length: 4 }).map((_, i) => (
        <SkeletonRatingCard key={i} />
      ))
    }

    if (!data?.followingIds?.length) {
      return (
        <FeedEmptyState
          icon={faUserPlus}
          title="Your feed is empty"
          description="Follow other readers to see their reviews and reading activity here."
          action={
            <button
              onClick={scrollToFindReaders}
              className="rounded-lg bg-ac px-4 py-2 text-[13px] font-semibold text-ac-ink transition-[filter] hover:brightness-110"
            >
              Find Readers
            </button>
          }
        />
      )
    }

    const ratingActivities = (data.activities ?? []).filter(
      (a): a is RatingActivity => a.type === 'rating',
    )

    if (!ratingActivities.length) {
      return (
        <FeedEmptyState
          icon={faRss}
          title={search ? 'No matches found' : 'Nothing here yet'}
          description={
            search
              ? 'No activity matches your search. Try a different book, author or reader.'
              : "The readers you follow haven't posted any activity yet."
          }
        />
      )
    }

    return (
      <>
        {ratingActivities.map((activity) => {
          const rating = {
            ...activity,
            createdAt: new Date(activity.createdAt),
            bookId: activity.book.id,
            userId: activity.user.id,
            deletedAt: null,
          } as unknown as RatingProps

          return (
            <RatingCard
              key={rating.id}
              rating={rating}
              onOpenDetails={() => {
                setSelectedBook(activity.book as BookProps)
                setIsLateralMenuOpen(true)
              }}
            />
          )
        })}
        {(data?.totalPages ?? 0) > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </>
    )
  }

  return (
    <MainLayout
      title="Following | BookNest"
      pageTitle=""
      selectedBook={selectedBook}
      isLateralMenuOpen={isLateralMenuOpen}
      setIsLateralMenuOpen={setIsLateralMenuOpen}
    >
      <div className="bn-scope flex flex-col px-8 pb-12 pt-8 md:px-10 lg:h-full lg:pb-0">
        <header className="mb-6 shrink-0 border-b border-line pb-6">
          <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-fg3">
            <FontAwesomeIcon icon={faRss} style={{ fontSize: 12 }} />
            <span>The Community</span>
          </div>
          <h1 className="font-serif text-[2rem] font-semibold leading-tight tracking-tight text-fg">
            Following
          </h1>
          <p className="mt-0.5 text-[13px] text-fg2">
            Latest activity from readers you follow.
          </p>
        </header>

        <div className="flex flex-col gap-8 lg:min-h-0 lg:flex-1 lg:flex-row lg:items-stretch">
          {/* Main feed */}
          <main className="lateral-menu-scroll flex min-w-0 flex-col gap-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pb-12 lg:pr-2">
            {showFeedSearch && (
              <SearchBar
                fullWidth
                search={search}
                placeholder="Search by book, author or reader..."
                onChange={handleSearchChange}
                onClick={() => {
                  setSearch('')
                  setCurrentPage(1)
                }}
              />
            )}
            {renderFeed()}
          </main>

          <aside
            ref={findReadersRef}
            className="lateral-menu-scroll w-full shrink-0 lg:min-h-0 lg:w-76 lg:overflow-y-auto lg:pb-12 lg:pr-2"
          >
            <FindReaders onAfterToggle={() => mutate()} />
          </aside>
        </div>
      </div>
    </MainLayout>
  )
}
