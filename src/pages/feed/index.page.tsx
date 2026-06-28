import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRss } from '@fortawesome/free-solid-svg-icons'
import { useSession } from 'next-auth/react'

import { MainLayout } from '@/layouts/MainLayout'
import { RatingCard } from '@/components/features/books/RatingCard'
import { SkeletonRatingCard } from '@/components/skeletons/SkeletonRatingCard'
import { Pagination } from '@/components/shared/Pagination'
import { SearchBar } from '@/components/shared/SearchBar'

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

  const scrollToFindReaders = () => {
    findReadersRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const renderFeed = () => {
    if (!session?.user) {
      return (
        <div className="flex flex-col items-center gap-4 px-4 py-16 text-center text-fg3">
          <p className="max-w-sm text-[15px] leading-relaxed">
            Sign in to see what people you follow are reading.
          </p>
        </div>
      )
    }

    if (isValidating) {
      return Array.from({ length: 4 }).map((_, i) => (
        <SkeletonRatingCard key={i} />
      ))
    }

    if (!data?.followingIds?.length) {
      return (
        <div className="flex flex-col items-center gap-4 px-4 py-16 text-center text-fg3">
          <p className="max-w-sm text-[15px] leading-relaxed">
            Your feed is empty. Follow other readers to see their activity here.
          </p>
          <button
            onClick={scrollToFindReaders}
            className="rounded-lg bg-ac px-4 py-2 text-[13px] font-semibold text-ac-ink transition-[filter] hover:brightness-110"
          >
            Find Readers
          </button>
        </div>
      )
    }

    const ratingActivities = (data.activities ?? []).filter(
      (a): a is RatingActivity => a.type === 'rating',
    )

    if (!ratingActivities.length) {
      return (
        <div className="flex flex-col items-center gap-4 px-4 py-16 text-center text-fg3">
          <p className="max-w-sm text-[15px] leading-relaxed">
            No activity yet from readers you follow.
          </p>
        </div>
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
