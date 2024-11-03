import { Binoculars, MagnifyingGlass, X } from 'phosphor-react'
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
import { ExploreCard } from '@/components/ExploreCard'
import { api } from '@/lib/axios'
import { LateralMenu } from '@/components/LateralMenu'
import { NextSeo } from 'next-seo'
import { CategoryProps } from '@/@types/category'
import { BookProps } from '@/@types/book'
import { useScreenSize } from '@/utils/useScreenSize'
import { handleAxiosError } from '@/utils/handleAxiosError'
import { useRouter } from 'next/router'
import { SkeletonPopularBook } from '@/components/SkeletonPopularBook'
import { useAppContext } from '@/contexts/AppContext'
import { SkeletonCategories } from '@/components/SkeletonCategories'

export interface ExploreProps {
  categories: CategoryProps[]
  books: BookProps[]
}

export default function Explore() {
  const [search, setSearch] = useState('')

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const [openLateralMenu, setOpenLateralMenu] = useState(false)

  const [categorySelected, setCategorySelected] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  const isMobile = useScreenSize(980)

  const { books, categories, handleSetBooks } = useAppContext()

  const [filteredBooks, setFilteredBooks] = useState(books)

  const router = useRouter()

  const refreshData = () => {
    router.replace(router.asPath)
  }

  function handleCloseLateralMenu() {
    setOpenLateralMenu(false)
  }

  async function selectCategory(categoryId: string | null) {
    try {
      setIsLoading(true)

      const query = categoryId ? `?category=${categoryId}` : ''
      const response = await api.get(`/books${query}`)
      if (response.data.booksWithRating) {
        handleSetBooks(response.data.booksWithRating)
      }
      setCategorySelected(categoryId)
    } catch (error) {
      handleAxiosError(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const applyFilters = () => {
      let updatedBooks = [...books]

      if (categorySelected) {
        updatedBooks = updatedBooks.filter((book) =>
          book?.categories?.some((cat) => {
            if ('id' in cat) {
              return (cat as CategoryProps).id === categorySelected
            }
            return false
          }),
        )
      }

      if (search) {
        updatedBooks = updatedBooks.filter(
          (book) =>
            book.name.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase()),
        )
      }

      setFilteredBooks(updatedBooks)
    }

    applyFilters()
  }, [categorySelected, search, books])

  useEffect(() => {
    if (books.length > 0) {
      setFilteredBooks(books)
    }
  }, [books])

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
              {search === '' ? (
                <MagnifyingGlass />
              ) : (
                <X onClick={() => setSearch('')} />
              )}
            </SearchBar>
          </Heading>
          <ExploreContent>
            <Categories>
              {!categories.length ? (
                <SkeletonCategories />
              ) : (
                <>
                  <CategoryBtn
                    selected={!categorySelected}
                    onClick={() => selectCategory(null)}
                  >
                    All
                  </CategoryBtn>
                  {categories.map((category) => (
                    <CategoryBtn
                      selected={!isLoading && categorySelected === category.id}
                      key={category.id}
                      onClick={() => selectCategory(category.id)}
                      className={isLoading ? 'loading' : ''}
                    >
                      {category.name}
                    </CategoryBtn>
                  ))}
                </>
              )}
            </Categories>
            <BooksContainer>
              {isLoading || !books.length
                ? Array.from({ length: 9 }).map((_, index) => (
                    <SkeletonPopularBook key={index} />
                  ))
                : filteredBooks?.map((book) => (
                    <ExploreCard
                      key={book.id}
                      book={book}
                      onClick={() => {
                        setSelectedBook(book)
                        setOpenLateralMenu(true)
                      }}
                    />
                  ))}
            </BooksContainer>
          </ExploreContent>
        </ExploreContainer>
      </Container>
    </>
  )
}
