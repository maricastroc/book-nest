import { Binoculars, MagnifyingGlass } from 'phosphor-react'
import {
  Categories,
  CategoryBtn,
  Container,
  ExploreContainer,
  Heading,
  SearchBar,
  BooksContainer,
  ExploreContent,
  HeadingTitle,
} from './styles'
import { useEffect, useState } from 'react'
import { MobileHeader } from '@/components/MobileHeader'
import { Sidebar } from '@/components/Sidebar'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../api/auth/[...nextauth].api'
import { prisma } from '@/lib/prisma'
import { ExploreCard } from '@/components/ExploreCard'
import { api } from '@/lib/axios'
import { LateralMenu } from '@/components/LateralMenu'
import { NextSeo } from 'next-seo'
import { CategoryProps } from '@/@types/category'
import { BookProps } from '@/@types/book'
import { useScreenSize } from '@/utils/useScreenSize'
import { handleAxiosError } from '@/utils/handleAxiosError'
import { useRouter } from 'next/router'

export interface ExploreProps {
  categories: CategoryProps[]
  books: BookProps[]
}

export default function Explore({ categories, books }: ExploreProps) {
  const [booksList, setBooksList] = useState<BookProps[]>(books)

  const [categorySelected, setCategorySelected] = useState<string | null>(null)

  const [search, setSearch] = useState('')

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const [openLateralMenu, setOpenLateralMenu] = useState(false)

  const isMobile = useScreenSize(980)

  const router = useRouter()

  const refreshData = () => {
    router.replace(router.asPath)
  }

  async function selectCategory(categoryId: string | null) {
    try {
      const query = categoryId ? `?category=${categoryId}` : ''

      const response = await api.get(`/books${query}`)

      if (response.data.booksWithRating) {
        setBooksList(response.data.booksWithRating)
      }

      setCategorySelected(categoryId)
    } catch (error) {
      handleAxiosError(error)
    }
  }

  function handleCloseLateralMenu() {
    setOpenLateralMenu(false)
  }

  useEffect(() => {
    if (search) {
      const filteredBooks = booksList?.filter((book) => {
        return (
          book.name
            .toLowerCase()
            .includes(search.toLowerCase().replace(/( )+/g, ' ')) ||
          book.author
            .toLowerCase()
            .includes(search.toLowerCase().replace(/( )+/g, ' '))
        )
      })

      setBooksList(filteredBooks)
    } else {
      setBooksList(books)
    }
  }, [search, booksList, books])

  return (
    <>
      <NextSeo title="Explore | Book Wise" />
      <Container>
        {openLateralMenu && (
          <LateralMenu
            book={selectedBook}
            onClose={() => {
              handleCloseLateralMenu()
              refreshData()
            }}
          />
        )}
        {isMobile ? <MobileHeader /> : <Sidebar />}
        <ExploreContainer>
          <Heading>
            <HeadingTitle>
              <Binoculars />
              <h2>Explore</h2>
            </HeadingTitle>
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
          </Heading>
          <ExploreContent>
            <Categories>
              <CategoryBtn
                selected={!categorySelected}
                onClick={() => selectCategory(null)}
              >
                All
              </CategoryBtn>
              {categories.length > 0 &&
                categories.map((category) => {
                  return (
                    <CategoryBtn
                      selected={categorySelected === category.id}
                      key={category.id}
                      onClick={() => selectCategory(category.id)}
                    >
                      {category.name}
                    </CategoryBtn>
                  )
                })}
            </Categories>
            <BooksContainer>
              {booksList.length > 0 &&
                booksList.map((book) => {
                  return (
                    <ExploreCard
                      key={book.id}
                      book={book}
                      onClick={() => {
                        setSelectedBook(book)
                        setOpenLateralMenu(true)
                      }}
                    />
                  )
                })}
            </BooksContainer>
          </ExploreContent>
        </ExploreContainer>
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

  const categories = await prisma.category.findMany()

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
  })

  const booksFixedRelationWithCategory = books.map((book) => {
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

  const booksWithRating = booksFixedRelationWithCategory.map((book) => {
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

  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories)),
      books: JSON.parse(JSON.stringify(booksWithRating)),
    },
  }
}
