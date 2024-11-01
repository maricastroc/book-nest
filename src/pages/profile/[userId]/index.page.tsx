import { MobileHeader } from '@/components/MobileHeader'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import {
  UserRatings,
  UserRatingsContainer,
  Container,
  Heading,
  HeadingTitle,
  ProfileContainer,
  SearchBar,
  UserDetailsContainer,
  ProfileWrapper,
  Divider,
} from './styles'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import {
  Book,
  CategoriesOnBooks,
  Category,
  Rating,
  User as UserPrisma,
} from '@prisma/client'
import { MagnifyingGlass, User, X } from 'phosphor-react'
import { ProfileCard } from '@/components/ProfileCard'
import { EmptyContainer } from '@/components/EmptyContainer'
import { UserDetails } from '@/components/UserDetails'
import { RatingProps } from '@/@types/rating'
import { CategoryProps } from '@/@types/category'

interface ProfileProps {
  infos: {
    pages: number
    booksCount: number
    authorsCount: number
    bestGenre: Category
  }
  user: UserPrisma & {
    ratings: (RatingProps & {
      book: Book & {
        categories: (CategoriesOnBooks & {
          category: Category
        })[]
      }
    })[]
  }
  ratings: (Rating & {
    alreadyRead: boolean
    user: UserPrisma
    book: Book & {
      categories: (CategoriesOnBooks & {
        category: Category
      })[]
    }
  })[]
}

export default function Profile({ user, ratings, infos }: ProfileProps) {
  const [isMobile, setIsMobile] = useState(false)

  const [search, setSearch] = useState('')

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const filteredBooks = ratings?.filter((rating) => {
    return (
      rating.book.name
        .toLowerCase()
        .includes(search.toLowerCase().replace(/( )+/g, ' ')) ||
      rating.book.author
        .toLowerCase()
        .includes(search.toLowerCase().replace(/( )+/g, ' '))
    )
  })

  return (
    <>
      <NextSeo title="Profile | Book Wise" />
      <Container>
        {isMobile ? <MobileHeader /> : <Sidebar />}
        <ProfileWrapper>
          <ProfileContainer>
            <Heading>
              <HeadingTitle>
                <User />
                <h2>Profile</h2>
              </HeadingTitle>
            </Heading>
            <UserRatingsContainer>
              <SearchBar>
                <input
                  type="text"
                  placeholder="Search for author or title"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  spellCheck={false}
                />
                {search === '' ? (
                  <MagnifyingGlass />
                ) : (
                  <X onClick={() => setSearch('')} />
                )}
              </SearchBar>
              <UserRatings>
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((rating) => {
                    return (
                      <ProfileCard
                        key={rating.id}
                        book={rating.book}
                        rating={rating}
                      />
                    )
                  })
                ) : (
                  <EmptyContainer />
                )}
              </UserRatings>
            </UserRatingsContainer>
          </ProfileContainer>
          <Divider />
          <UserDetailsContainer>
            {user && (
              <UserDetails
                avatarUrl={user?.avatarUrl ?? ''}
                createdAt={user?.createdAt}
                name={user?.name}
                totalPages={infos?.pages}
                booksRated={infos?.booksCount}
                authorsRead={infos?.authorsCount}
                bestGenre={infos?.bestGenre?.name ?? '-'}
              />
            )}
          </UserDetailsContainer>
        </ProfileWrapper>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const userId = String(params?.userId)

  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      include: {
        ratings: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            book: {
              include: {
                categories: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    const pages = user.ratings.reduce((acc, rating) => {
      return (acc += rating.book.totalPages)
    }, 0)

    const books = user.ratings.map((rating) => rating.book)

    const authors = user.ratings.map((rating) => rating.book.author)

    const uniqueAuthors: string[] = []

    authors.forEach((author) => {
      if (uniqueAuthors.indexOf(author) === -1) {
        uniqueAuthors.push(author)
      }
    })

    const genres = books
      .map((book) => book.categories.map((category) => category.category))
      .flat()

    interface CategoryWithCount extends CategoryProps {
      qtd: number
    }

    const genreNumbers = genres
      .reduce((acc: CategoryWithCount[], genre) => {
        const qtd = genres.filter(
          (i: CategoryProps) => i.id === genre.id,
        ).length
        return [
          ...acc,
          {
            ...genre,
            qtd,
          },
        ]
      }, [])
      .sort(
        (a: CategoryWithCount, b: CategoryWithCount) =>
          (b.qtd || 0) - (a.qtd || 0),
      )

    const infos = {
      pages,
      booksCount: books.length,
      authorsCount: uniqueAuthors.length,
      bestGenre: genreNumbers[0] ? genreNumbers[0] : null,
    }

    return {
      props: {
        ratings: JSON.parse(JSON.stringify(user.ratings)),
        user: JSON.parse(JSON.stringify(user)),
        infos,
      },
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}
