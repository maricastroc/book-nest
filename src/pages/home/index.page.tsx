import { Header } from '@/components/Header'
import { Container, RecentCardsContainer } from './styles'
import { ReviewCard } from '@/components/ReviewCard'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { buildNextAuthOptions } from '../api/auth/[...nextauth].api'
import { getServerSession } from 'next-auth'
import { Book, Category, Rating, User } from '@prisma/client'
import { useSession } from 'next-auth/react'

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

  return (
    <Container>
      <Header />
      <RecentCardsContainer>
        {ratings.length > 0 &&
          ratings.map((rating) => (
            <ReviewCard key={rating.id} rating={rating} />
          ))}
      </RecentCardsContainer>
    </Container>
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
    },
  }
}
