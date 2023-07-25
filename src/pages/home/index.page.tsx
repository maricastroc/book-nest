import { MobileHeader } from '@/components/MobileHeader'
import {
  Container,
  Heading,
  HomeContainer,
  HomeContent,
  LastReadContainer,
  LastReadTitle,
  PopularBooksCardsContainer,
  PopularBooksCardsContent,
  PopularBooksTitle,
  RecentAndLastRead,
  RecentCardsContainer,
  RecentCardsContent,
  RecentCardsTitle,
} from './styles'
import { ReviewCard } from '@/components/ReviewCard'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { buildNextAuthOptions } from '../api/auth/[...nextauth].api'
import { getServerSession } from 'next-auth'
import { Book, Category, Rating, User } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { CaretRight, ChartLineUp } from 'phosphor-react'
import { PopularBookCard } from '@/components/PopularBookCard'
import { LastReadCard } from '@/components/LastReadCard'
import { EmptyContainer } from '@/components/EmptyContainer'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { LateralMenu } from '@/components/LateralMenu'

interface BookProps {
  author: string
  cover_url: string
  created_at: string
  id: string
  name: string
  summary: string
  totalPages: number
}

interface UserProps {
  avatar_url: string
  created_at: string
  email: string
  emailVerified: string | null
  id: string
  name: string
}

export interface RecentReadCardProps {
  book: BookProps
  created_at: string
  description: string
  id: string
  rate: number
  user: UserProps
}

export interface BookWithRatingAndCategories extends Book {
  categories: Category[]
  rating: number
  alreadyRead: boolean
  ratings: Rating[]
}

export interface RatingWithUserAndBook extends Rating {
  user: User
  book: Book
  alreadyRead: boolean
}

interface HomeProps {
  ratings: RatingWithUserAndBook[]
  books: BookWithRatingAndCategories[]
  userLastRating: RatingWithUserAndBook
}

export default function Home({ ratings, books, userLastRating }: HomeProps) {
  const session = useSession()
  const [isMobile, setIsMobile] = useState(false)

  const [selectedBook, setSelectedBook] =
    useState<BookWithRatingAndCategories | null>(null)

  const [openLateralMenu, setOpenLateralMenu] = useState(false)

  function setSelectedBookFromRatingBookId(ratingBookId: string) {
    const foundBook = books.find((book) => book.id === ratingBookId)
    if (!foundBook) {
      return
    }
    setSelectedBook(foundBook)
    setOpenLateralMenu(true)
  }

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
            <RecentAndLastRead>
              {session.data?.user && (
                <LastReadContainer>
                  {userLastRating ? (
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
              <RecentCardsContainer>
                <RecentCardsTitle>Last Ratings</RecentCardsTitle>
                <RecentCardsContent>
                  {ratings.length > 0 &&
                    ratings.map((rating) => (
                      <ReviewCard
                        key={rating.id}
                        rating={rating}
                        onClick={() => {
                          setSelectedBookFromRatingBookId(rating.book.id)
                        }}
                      />
                    ))}
                </RecentCardsContent>
              </RecentCardsContainer>
            </RecentAndLastRead>
            <PopularBooksCardsContainer>
              <PopularBooksTitle>
                <p>Popular Books</p>
                <span>
                  View All
                  <CaretRight />
                </span>
              </PopularBooksTitle>
              <PopularBooksCardsContent>
                {books.length > 0 &&
                  books.map((book) => (
                    <PopularBookCard
                      key={book.id}
                      cover_url={book.cover_url}
                      name={book.name}
                      author={book.author}
                      rating={book.rating}
                      alreadyRead={book.alreadyRead}
                      onClick={() => {
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
  // Capturing session data
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  // Searching for last user review
  let userLastRating = null

  if (session?.user) {
    userLastRating = await prisma.rating.findFirst({
      where: {
        user_id: String(session?.user?.id),
      },
      include: {
        user: true,
        book: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    })
  }

  // Searching and filtering the 4 most popular books
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

  // Returning books with "fixed" category
  const booksWithCategory = books.map((book) => {
    return {
      ...book,
      categories: book.categories.map((category) => category.category),
    }
  })

  // Verifying if a book was read by logged user
  let userBooksIds: string[] = []

  if (session) {
    const userBooks = await prisma.book.findMany({
      where: {
        ratings: {
          some: {
            user_id: String(session?.user?.id),
          },
        },
      },
    })

    userBooksIds = userBooks?.map((x) => x?.id)
  }

  // Returning books with category, average rating and user reading status
  const booksWithRating = booksWithCategory.map((book) => {
    const avgRate =
      book.ratings.reduce((sum, rateObj) => {
        return sum + rateObj.rate
      }, 0) / book.ratings.length

    return {
      ...book,
      rating: avgRate,
      alreadyRead: userBooksIds.includes(book.id),
    }
  })

  // Searching for 4 latest ratings - excluding user ratings
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
      created_at: 'desc',
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
