/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { RatingCard } from '@/components/features/books/RatingCard'
import { BookCard } from '@/components/features/books/BookCard'
import { EmptyContainer } from '@/components/ui/EmptyContainer'
import { SkeletonBookCard } from '@/components/features/books/SkeletonBookCard'
import { SkeletonRatingCard } from '@/components/features/books/SkeletonRatingCard'

import { BookProps } from '@/@types/book'
import { RatingProps } from '@/@types/rating'
import useRequest from '@/hooks/useRequest'
import { useAppContext } from '@/contexts/AppContext'
import { useSession } from 'next-auth/react'
import { MainLayout } from '@/layouts/MainLayout'
import { HorizontalScroll } from '@/components/ui/HorizontalScroll'

function SectionLabel({
  children,
  noMargin = false,
}: {
  children: React.ReactNode
  noMargin?: boolean
}) {
  return (
    <p
      className={`text-[10.5px] font-medium uppercase tracking-[0.14em] text-fg3 ${
        noMargin ? '' : 'mb-3'
      }`}
    >
      {children}
    </p>
  )
}

function PopularThisWeek({
  onViewAll,
  children,
}: {
  onViewAll: () => void
  children: React.ReactNode
}) {
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <SectionLabel noMargin>Popular this week</SectionLabel>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-[11px] font-medium text-ac transition-colors hover:text-fg"
        >
          View all{' '}
          <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 11 }} />
        </button>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </>
  )
}

function getIssueNumber() {
  const start = new Date(2024, 0, 1)
  const now = new Date()
  return Math.ceil(
    (now.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000),
  )
}

export default function Home() {
  const router = useRouter()
  const session = useSession()
  const { isValidatingReview } = useAppContext()
  const userId = session?.data?.user?.id
    ? String(session.data.user.id)
    : undefined

  const [updatedPopularBooks, setUpdatedPopularBooks] = useState<BookProps[]>(
    [],
  )
  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)
  const [isLateralMenuOpen, setIsLateralMenuOpen] = useState(false)

  const userLatestRatingRequest = userId
    ? { url: `/ratings/user_latest`, method: 'GET', params: { userId } }
    : null

  const { data: popularBooks, mutate: mutatePopularBooks } = useRequest<
    BookProps[]
  >(
    { url: '/books/popular', method: 'GET' },
    { keepPreviousData: true, revalidateOnFocus: false },
  )

  const { data: latestRatings, error: latestRatingsError } = useRequest<
    RatingProps[]
  >(
    { url: '/ratings/latest', method: 'GET' },
    { revalidateOnFocus: false, keepPreviousData: true },
  )

  const recommendedRequest = userId
    ? { url: '/books/recommended', method: 'GET' }
    : null

  const { data: recommendedData, isValidating: isValidatingRecommended } =
    useRequest<{
      books: BookProps[]
      hasEnoughData: boolean
    }>(recommendedRequest, { revalidateOnFocus: false, keepPreviousData: true })

  const {
    data: userLatestRatingData,
    mutate: mutateUserLatestRating,
    isValidating: isValidatingUserLatestReading,
    error: userLatestRatingError,
  } = useRequest<RatingProps | null>(userLatestRatingRequest, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  })

  const renderUserLatestRating = () => {
    if (isValidatingUserLatestReading || isValidatingReview)
      return <SkeletonRatingCard withMarginBottom />
    if (userLatestRatingError)
      return <EmptyContainer content="reading history" variant="error" />
    if (userLatestRatingData?.book) {
      return (
        <RatingCard
          key={userLatestRatingData.id}
          rating={userLatestRatingData}
          onOpenDetails={() => {
            setSelectedBook(userLatestRatingData.book as BookProps)
            setIsLateralMenuOpen(true)
          }}
        />
      )
    }
    return <EmptyContainer />
  }

  const renderLatestRatings = () => {
    if (latestRatingsError)
      return <EmptyContainer content="recent ratings" variant="error" />
    if (!latestRatings?.length) {
      return Array.from({ length: 9 }).map((_, i) => (
        <SkeletonRatingCard key={i} />
      ))
    }
    return latestRatings.map((rating: RatingProps) => (
      <RatingCard
        key={rating.id}
        rating={rating}
        onOpenDetails={() => {
          if (rating?.book) {
            setSelectedBook(rating.book as BookProps)
            setIsLateralMenuOpen(true)
          }
        }}
      />
    ))
  }

  const renderRecommendedBooks = () => {
    if (isValidatingRecommended || !recommendedData) {
      return Array.from({ length: 2 }).map((_, i) => (
        <SkeletonBookCard key={i} />
      ))
    }
    if (!recommendedData.hasEnoughData) {
      return (
        <p className="text-[12px] italic text-fg3">
          Rate books with 4+ stars to get personalized recommendations.
        </p>
      )
    }
    return recommendedData.books.map((book) => (
      <div key={book.id} className="w-76 shrink-0">
        <BookCard
          book={book}
          onOpenDetails={() => {
            setSelectedBook(book)
            setIsLateralMenuOpen(true)
          }}
        />
      </div>
    ))
  }

  const renderPopularBooks = () => {
    const books = updatedPopularBooks?.length ? updatedPopularBooks : null
    if (!books) {
      return Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <span className="w-5 shrink-0 font-serif text-[15px] font-semibold leading-tight text-fg3/40 select-none">
            {i + 1}
          </span>
          <SkeletonBookCard />
        </div>
      ))
    }
    return books.map((book, i) => (
      <div key={book.id} className="flex items-start gap-1">
        <span className="w-5 shrink-0 pt-1 font-serif text-[15px] font-semibold leading-tight text-fg3 select-none">
          {i + 1}
        </span>
        <div className="min-w-0 flex-1">
          <BookCard
            book={book}
            onOpenDetails={() => {
              setSelectedBook(book)
              setIsLateralMenuOpen(true)
            }}
          />
        </div>
      </div>
    ))
  }

  useEffect(() => {
    if (popularBooks) setUpdatedPopularBooks(popularBooks)
  }, [popularBooks])

  const firstName = session?.data?.user?.name?.split(' ')[0] ?? 'Reader'
  const issueNumber = getIssueNumber()
  const formattedDate = new Date()
    .toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
    .toUpperCase()

  return (
    <MainLayout
      title="Home | Book Nest"
      icon={<FontAwesomeIcon icon={faChartLine} />}
      pageTitle=""
      variant="tertiary"
      selectedBook={selectedBook}
      isLateralMenuOpen={isLateralMenuOpen}
      setIsLateralMenuOpen={(v) => setIsLateralMenuOpen(v)}
      onUpdateBook={(updated) =>
        setUpdatedPopularBooks((prev) =>
          prev.map((b) => (b.id === updated.id ? updated : b)),
        )
      }
      onUpdateRating={async () => {
        await mutateUserLatestRating()
        await mutatePopularBooks()
      }}
    >
      <div className="bn-scope flex h-full flex-col pl-8 pr-6 md:pl-10 md:pr-8">
        <header className="shrink-0 border-b border-line pb-5 pt-8">
          <div className="mb-2 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-fg3">
            <span>The Shelf</span>
            <span className="flex-1 border-t border-line" />
            <span>
              Issue {issueNumber} · {formattedDate}
            </span>
          </div>
          <h1 className="font-serif text-[2.4rem] font-semibold leading-[1.08] tracking-tight text-fg">
            {userId ? `Good evening, ${firstName}.` : 'Your reading journal.'}
          </h1>
          <p className="mt-1.5 text-[13px] text-fg2">
            {userId
              ? "Here's what's been happening on the shelf."
              : 'Discover what readers are finishing, loving, and recommending.'}
          </p>
        </header>

        <div className="flex min-h-0 flex-1 gap-8 pt-7">
          <div className="lateral-menu-scroll flex min-w-0 flex-1 flex-col gap-8 overflow-y-auto pb-7 pr-2">
            {userId && (
              <section>
                <SectionLabel>Your last rating</SectionLabel>
                {renderUserLatestRating()}
              </section>
            )}

            {userId && (
              <section>
                <SectionLabel>Recommended for you</SectionLabel>
                <HorizontalScroll>{renderRecommendedBooks()}</HorizontalScroll>
              </section>
            )}

            <section>
              <SectionLabel>From the community</SectionLabel>
              <div className="flex flex-col gap-4">{renderLatestRatings()}</div>
            </section>

            <section className="xl:hidden">
              <PopularThisWeek onViewAll={() => router.push('/explore')}>
                {renderPopularBooks()}
              </PopularThisWeek>
            </section>

            <div className="h-8 shrink-0" />
          </div>

          <div className="lateral-menu-scroll hidden w-76 shrink-0 flex-col overflow-y-auto pb-7 pr-2 xl:flex">
            <PopularThisWeek onViewAll={() => router.push('/explore')}>
              {renderPopularBooks()}
            </PopularThisWeek>

            <div className="h-8 shrink-0" />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
