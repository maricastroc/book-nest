import { Binoculars, MagnifyingGlass } from 'phosphor-react'
import {
  Categories,
  ButtonFilter,
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
import { BookWithRatingAndCategories } from '../home/index.page'
import { Category } from '@prisma/client'
import { ExploreCard } from '@/components/ExploreCard'
import { api } from '@/lib/axios'
import { LateralMenu } from '@/components/LateralMenu'

export interface ExploreProps {
  categories: Category[]
  books: BookWithRatingAndCategories[]
}

export default function Explore({ categories, books }: ExploreProps) {
  const [isMobile, setIsMobile] = useState(false)

  const [booksList, setBooksList] =
    useState<BookWithRatingAndCategories[]>(books)

  const [categorySelected, setCategorySelected] = useState<string | null>(null)

  const [search, setSearch] = useState('')

  const [selectedBook, setSelectedBook] =
    useState<BookWithRatingAndCategories | null>(null)

  const [openLateralMenu, setOpenLateralMenu] = useState(false)

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

  async function selectCategory(categoryId: string | null) {
    const query = categoryId ? `?category=${categoryId}` : ''
    const response = await api.get(`/books${query}`)
    if (response.data.booksWithRating) {
      setBooksList(response.data.booksWithRating)
    }
    setCategorySelected(categoryId)
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
    <Container>
      {openLateralMenu && (
        <LateralMenu book={selectedBook} onClose={handleCloseLateralMenu} />
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
            <ButtonFilter
              selected={!categorySelected}
              onClick={() => selectCategory(null)}
            >
              All
            </ButtonFilter>
            {categories.length > 0 &&
              categories.map((category) => {
                return (
                  <ButtonFilter
                    selected={categorySelected === category.id}
                    key={category.id}
                    onClick={() => selectCategory(category.id)}
                  >
                    {category.name}
                  </ButtonFilter>
                )
              })}
          </Categories>
          <BooksContainer>
            {filteredBooks.length > 0 &&
              filteredBooks.map((book) => {
                return (
                  <ExploreCard
                    key={book.id}
                    cover_url={book.cover_url}
                    author={book.author}
                    name={book.name}
                    rating={book.rating}
                    alreadyRead={book.alreadyRead}
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
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // Capturing session data
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  const categories = await prisma.category.findMany()

  // Searching for all books (w/ category)
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

  // Fixing category relationship
  const booksFixedRelationWithCategory = books.map((book) => {
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
  const booksWithRating = booksFixedRelationWithCategory.map((book) => {
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

  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories)),
      books: JSON.parse(JSON.stringify(booksWithRating)),
    },
  }
}
