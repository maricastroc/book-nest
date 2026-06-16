/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CaretRight, ChartLineUp } from 'phosphor-react'
import { SWRConfig } from 'swr'
import type { GetStaticProps } from 'next'

import {
  HomePageContent,
  LastRatingsContainer,
  LastRatingsContent,
  LastRatingsTitle,
  LastRatingsWrapper,
  UserLatestReadingContainer,
  UserLatestReadingTitle,
  PopularBooksWrapper,
  PopularBooksContent,
  PopularBooksTitle,
} from './styles'

import { RatingCard } from '@/components/cards/RatingCard'
import { BookCard } from '@/components/cards/BookCard'
import { EmptyContainer } from '@/components/shared/EmptyContainer'
import { SkeletonBookCard } from '@/components/skeletons/SkeletonBookCard'
import { SkeletonRatingCard } from '@/components/skeletons/SkeletonRatingCard'
import { OutlineButton } from '@/components/core/OutlineButton'

import { BookProps } from '@/@types/book'
import { RatingProps } from '@/@types/rating'
import useRequest from '@/hooks/useRequest'
import { useAppContext } from '@/contexts/AppContext'
import { useSession } from 'next-auth/react'
import { MainLayout } from '@/layouts/MainLayout'
import { prisma } from '@/lib/prisma'

interface HomeProps {
  fallback: Record<string, unknown>
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const [booksRaw, ratingsRaw] = await Promise.all([
    prisma.book.findMany({
      where: { status: 'APPROVED' },
      include: { ratings: { select: { rate: true } } },
      orderBy: { ratings: { _count: 'desc' } },
      take: 6,
    }),
    prisma.rating.findMany({
      where: { deletedAt: null, NOT: { description: '' } },
      orderBy: { createdAt: 'desc' },
      include: {
        book: {
          select: { id: true, name: true, author: true, coverUrl: true },
        },
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            email: true,
            createdAt: true,
          },
        },
        votes: true,
      },
      take: 5,
    }),
  ])

  const popularBooks = booksRaw.map((book) => {
    const ratingCount = book.ratings.length
    const rate =
      ratingCount > 0
        ? book.ratings.reduce((s, r) => s + r.rate, 0) / ratingCount
        : 0
    const { ratings: _ratings, ...rest } = book
    return {
      ...rest,
      ratingCount,
      rate,
      readingStatus: null,
      createdAt: book.createdAt.toISOString(),
      updatedAt: book.updatedAt?.toISOString() ?? null,
    }
  })

  const latestRatings = ratingsRaw.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt?.toISOString() ?? null,
    deletedAt: r.deletedAt?.toISOString() ?? null,
    votes: {
      up: r.votes.filter((v) => v.type === 'UP').length,
      down: r.votes.filter((v) => v.type === 'DOWN').length,
      userVote: null,
    },
    user: {
      ...r.user,
      createdAt: r.user.createdAt.toISOString(),
      updatedAt: r.user.updatedAt?.toISOString() ?? null,
    },
  }))

  const makeResponse = (data: unknown) => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  })

  return {
    props: {
      fallback: {
        'GET /books/popular': makeResponse({ books: popularBooks }),
        'GET /ratings/latest': makeResponse({ ratings: latestRatings }),
      },
    },
    revalidate: 60,
  }
}

export default function Home({ fallback }: HomeProps) {
  return (
    <SWRConfig value={{ fallback }}>
      <HomeContent />
    </SWRConfig>
  )
}

function HomeContent() {
  const router = useRouter()

  const session = useSession()

  const { isValidatingReview } = useAppContext()

  const [updatedPopularBooks, setUpdatedPopularBooks] = useState<
    BookProps[] | []
  >([])

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const [isLateralMenuOpen, setIsLateralMenuOpen] = useState(false)

  const userLatestRatingRequest = session?.data?.user
    ? {
        url: `/ratings/user_latest`,
        method: 'GET',
        params: { userId: session?.data?.user?.id },
      }
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
    {
      url: '/ratings/latest',
      method: 'GET',
    },
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
  )

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
    if (isValidatingUserLatestReading || isValidatingReview) {
      return <SkeletonRatingCard withMarginBottom />
    }

    if (userLatestRatingError) {
      return <EmptyContainer content="reading history" variant="error" />
    }

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
    if (latestRatingsError) {
      return <EmptyContainer content="recent ratings" variant="error" />
    }

    if (!latestRatings?.length) {
      return Array.from({ length: 9 }).map((_, index) => (
        <SkeletonRatingCard key={index} />
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

  const renderPopularBooks = () => {
    if (!updatedPopularBooks?.length) {
      return Array.from({ length: 12 }).map((_, index) => (
        <SkeletonBookCard key={index} />
      ))
    }

    return updatedPopularBooks.map((book) => (
      <BookCard
        key={book.id}
        book={book}
        onOpenDetails={() => {
          setSelectedBook(book)
          setIsLateralMenuOpen(true)
        }}
      />
    ))
  }

  const handleUpdatePopularBooks = async (updatedBook: BookProps) => {
    setUpdatedPopularBooks((prevBooks) => {
      if (!prevBooks) return prevBooks

      const updatedBooks = prevBooks.map((book) =>
        book.id === updatedBook.id ? updatedBook : book,
      )

      return updatedBooks
    })
  }

  useEffect(() => {
    if (popularBooks) {
      setUpdatedPopularBooks(popularBooks)
    }
  }, [popularBooks])

  return (
    <MainLayout
      title="Home | Book Nest"
      icon={<ChartLineUp />}
      pageTitle="Home"
      selectedBook={selectedBook}
      isLateralMenuOpen={isLateralMenuOpen}
      setIsLateralMenuOpen={(value) => setIsLateralMenuOpen(value)}
      onUpdateBook={handleUpdatePopularBooks}
      onUpdateRating={async () => {
        await mutateUserLatestRating()
        await mutatePopularBooks()
      }}
    >
      <HomePageContent>
        <LastRatingsWrapper>
          {session?.data?.user && (
            <>
              <UserLatestReadingTitle>Your Last Rating</UserLatestReadingTitle>
              <UserLatestReadingContainer>
                {renderUserLatestRating()}
              </UserLatestReadingContainer>
            </>
          )}
          <LastRatingsContainer>
            <LastRatingsTitle>Last Ratings</LastRatingsTitle>
            <LastRatingsContent>{renderLatestRatings()}</LastRatingsContent>
          </LastRatingsContainer>
        </LastRatingsWrapper>

        <PopularBooksWrapper>
          <PopularBooksTitle>
            <p>Popular Books</p>
            <OutlineButton onClick={() => router.push('/explore')}>
              View All
              <CaretRight />
            </OutlineButton>
          </PopularBooksTitle>
          <PopularBooksContent>{renderPopularBooks()}</PopularBooksContent>
        </PopularBooksWrapper>
      </HomePageContent>
    </MainLayout>
  )
}
