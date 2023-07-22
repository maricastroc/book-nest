/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MobileHeader } from '@/components/MobileHeader'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import {
  BooksContainer,
  BooksSection,
  Container,
  Heading,
  HeadingTitle,
  ProfileContainer,
  ProfileContent,
  SearchBar,
  UserDetailsContainer,
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
import { RatingWithUserAndBook } from '@/pages/home/index.page'
import { MagnifyingGlass, User } from 'phosphor-react'
import { ProfileCard } from '@/components/ProfileCard'
import { EmptyContainer } from '@/components/EmptyContainer'
import { useSession } from 'next-auth/react'
import { UserDetails } from '@/components/UserDetails'

interface ProfileProps {
  infos: {
    pages: number
    booksCount: number
    authorsCount: number
    bestGenre: Category
  }
  user: UserPrisma & {
    ratings: (RatingWithUserAndBook & {
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
  const session = useSession()

  console.log(session.data?.user.id === user.id)

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
        <ProfileContainer>
          <Heading>
            <HeadingTitle>
              <User />
              <h2>Profile</h2>
            </HeadingTitle>
          </Heading>
          <ProfileContent>
            <BooksSection>
              <SearchBar>
                <input
                  type="text"
                  placeholder="Search for author or title"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  spellCheck={false}
                />
                <MagnifyingGlass />
              </SearchBar>
              <BooksContainer>
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
              </BooksContainer>
            </BooksSection>
            <UserDetailsContainer>
              <UserDetails
                avatar_url={user?.avatar_url!}
                created_at={user?.created_at!}
                name={user?.name!}
                total_pages={infos?.pages!}
                books_rated={infos?.booksCount!}
                authors_read={infos?.authorsCount!}
                most_read_category={infos?.bestGenre?.name ?? '-'}
              />
            </UserDetailsContainer>
          </ProfileContent>
        </ProfileContainer>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const userId = String(params?.user_id)
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      include: {
        ratings: {
          orderBy: {
            created_at: 'desc',
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
      return (acc += rating.book.total_pages)
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

    const genreNumbers = genres
      .reduce((acc: any, genre) => {
        const qtd = genres.filter((i: any) => i.id === genre.id).length
        return [
          ...acc,
          {
            ...genre,
            qtd,
          },
        ]
      }, [])
      .sort((a: any, b: any) => b.qtd - a.qtd)

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
