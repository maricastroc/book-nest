import { MobileHeader } from '@/components/MobileHeader'
import {
  Container,
  Heading,
  HomeContainer,
  HomeContent,
  LastRatingsContainer,
  LastRatingsContent,
  LastRatingsTitle,
  LastRatingsWrapper,
  LastReadContainer,
  LastReadTitle,
  PopularBooksCardsContainer,
  PopularBooksCardsContent,
  PopularBooksTitle,
} from './styles'
import { RatingCard } from '@/components/RatingCard'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { buildNextAuthOptions } from '../api/auth/[...nextauth].api'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { CaretRight, ChartLineUp } from 'phosphor-react'
import { PopularBookCard } from '@/components/PopularBookCard'
import { EmptyContainer } from '@/components/EmptyContainer'
import { NextSeo } from 'next-seo'
import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { LateralMenu } from '@/components/LateralMenu'
import { BookProps } from '@/@types/book'
import { UserProps } from '@/@types/user'
import { RatingProps } from '@/@types/rating'
import { useScreenSize } from '@/utils/useScreenSize'
import { LastReadCard } from '@/components/LastReadCard'

export interface RecentReadCardProps {
  book: BookProps
  created_at: string
  description: string
  id: string
  rate: number
  user: UserProps
}

interface HomeProps {
  ratings: RatingProps[]
  books: BookProps[]
  userLastRating: RatingProps
}

export default function Home({ ratings, books, userLastRating }: HomeProps) {
  const session = useSession()

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const [openLateralMenu, setOpenLateralMenu] = useState(false)

  const isMobile = useScreenSize(768)

  function handleSetSelectedBook(ratingBookId: string | undefined) {
    if (!ratingBookId) {
      return
    }

    const foundBook = books.find((book) => book.id === ratingBookId)
    if (!foundBook) {
      return
    }

    setSelectedBook(foundBook)
    setOpenLateralMenu(true)
  }

  function handleCloseLateralMenu() {
    setOpenLateralMenu(false)
  }

  return (
    <>
      <NextSeo title="Home | Book Wise" />
      <Container>
        {openLateralMenu && (
          <LateralMenu book={selectedBook} onClose={handleCloseLateralMenu} />
        )}
        {isMobile ? <MobileHeader /> : <Sidebar />}
        <HomeContainer>
          <Heading>
            <ChartLineUp />
            <h2>Home</h2>
          </Heading>
          <HomeContent>
            <LastRatingsWrapper>
              {session.data?.user && (
                <LastReadContainer>
                  {userLastRating && userLastRating?.book ? (
                    <>
                      <LastReadTitle>Your last reading</LastReadTitle>
                      <LastReadCard
                        key={userLastRating.id}
                        rating={userLastRating}
                        book={userLastRating.book}
                      />
                    </>
                  ) : (
                    <>
                      <LastReadTitle>Your last reading</LastReadTitle>
                      <EmptyContainer />
                    </>
                  )}
                </LastReadContainer>
              )}
              <LastRatingsContainer>
                <LastRatingsTitle>Last Ratings</LastRatingsTitle>
                <LastRatingsContent>
                  {ratings.length > 0 &&
                    ratings.map((rating) => (
                      <RatingCard
                        key={rating.id}
                        rating={rating}
                        onClick={() => {
                          handleSetSelectedBook(rating?.book?.id)
                        }}
                      />
                    ))}
                </LastRatingsContent>
              </LastRatingsContainer>
            </LastRatingsWrapper>

            <PopularBooksCardsContainer>
              <PopularBooksTitle>
                <p>Popular Books</p>
                <span>
                  View All
                  <CaretRight />
                </span>
              </PopularBooksTitle>
              <PopularBooksCardsContent>
                {books?.length > 0 &&
                  books.map((book) => (
                    <PopularBookCard
                      key={book.id}
                      book={book}
                      onOpenDetails={() => {
                        setSelectedBook(book)
                        setOpenLateralMenu(true)
                      }}
                    />
                  ))}
              </PopularBooksCardsContent>
            </PopularBooksCardsContainer>
          </HomeContent>
        </HomeContainer>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  let userLastRating = null

  if (session?.user) {
    userLastRating = await prisma.rating.findFirst({
      where: {
        userId: String(session?.user?.id),
      },
      include: {
        user: true,
        book: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  const books = await prisma.book.findMany({
    include: {
      ratings: {
        select: {
          rate: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
    },

    take: 4,
    orderBy: {
      ratings: {
        _count: 'desc',
      },
    },
  })

  const booksWithCategory = books.map((book) => {
    return {
      ...book,
      categories: book.categories.map((category) => category.category),
    }
  })

  let userBooksIds: string[] = []

  if (session) {
    const userBooks = await prisma.book.findMany({
      where: {
        ratings: {
          some: {
            userId: String(session?.user?.id),
          },
        },
      },
    })

    userBooksIds = userBooks?.map((x) => x?.id)
  }

  const booksWithRating = booksWithCategory.map((book) => {
    const avgRate =
      book.ratings.reduce((sum, rateObj) => {
        return sum + rateObj.rate
      }, 0) / book.ratings.length

    return {
      ...book,
      rate: avgRate,
      alreadyRead: userBooksIds.includes(book.id),
    }
  })

  const ratings = await prisma.rating.findMany({
    where: {
      NOT: {
        id: userLastRating?.id,
      },
    },
    include: {
      user: true,
      book: true,
    },
    take: 4,
    orderBy: {
      createdAt: 'desc',
    },
  })

  const ratingWithReadStatus = ratings.map((rating) => {
    return {
      ...rating,
      alreadyRead: userBooksIds.includes(rating.book.id),
    }
  })

  return {
    props: {
      ratings: JSON.parse(JSON.stringify(ratingWithReadStatus)),
      userLastRating: JSON.parse(JSON.stringify(userLastRating)),
      books: JSON.parse(JSON.stringify(booksWithRating)),
    },
  }
}
