import { Binoculars, CaretLeft, CaretRight } from 'phosphor-react'
import {
  Categories,
  SelectCategoryButton,
  ExplorePageWrapper,
  ExplorePageContainer,
  ExplorePageHeading,
  BooksContainer,
  ExplorePageContent,
  HeadingTitle,
  TitleAndSearch,
  ScrollContainer,
  CaretLeftIcon,
  CaretRightIcon,
} from './styles'
import { useEffect, useRef, useState } from 'react'
import { Sidebar } from '@/components/shared/Sidebar'
import { LateralMenu } from '@/components/shared/LateralMenu'
import { NextSeo } from 'next-seo'
import { CategoryProps } from '@/@types/category'
import { BookProps } from '@/@types/book'
import { useScreenSize } from '@/hooks/useScreenSize'
import { SkeletonExploreCard } from '@/components/skeletons/SkeletonExploreCard'
import { SkeletonCategories } from '@/pages/explore/partials/SkeletonCategories'
import { useLoadingOnRouteChange } from '@/hooks/useLoadingOnRouteChange'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { MobileHeader } from '@/components/shared/MobileHeader'
import useRequest from '@/hooks/useRequest'
import { Pagination } from '@/components/shared/Pagination'
import { ExploreCard } from './partials/ExploreCard'
import { usePerPage } from '@/hooks/useExploreBooksPerPage'
import { EmptyContainer } from '@/components/shared/EmptyContainer'
import { SearchBar } from '@/components/shared/SearchBar'

export interface ExploreProps {
  categories: CategoryProps[]
  books: BookProps[]
}

export default function Explore() {
  const isRouteLoading = useLoadingOnRouteChange()

  const [updatedBooks, setUpdatedBooks] = useState<BookProps[] | []>([])

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const perPage = usePerPage()

  const [currentPage, setCurrentPage] = useState(1)

  const [totalPages, setTotalPages] = useState(1)

  const [search, setSearch] = useState('')

  const [searchTerm, setSearchTerm] = useState('')

  const [selectedCategory, setSelectedCategory] = useState<string | null>('')

  const [openLateralMenu, setOpenLateralMenu] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  const { data: booksData, isValidating } = useRequest<{
    books: BookProps[]
    pagination: {
      page: number
      perPage: number
      total: number
      totalPages: number
    }
  } | null>(
    {
      url: '/books',
      method: 'GET',
      params: {
        category: selectedCategory,
        ...(searchTerm?.length ? { search: searchTerm } : {}),
        page: currentPage,
        perPage,
      },
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      keepPreviousData: true,
    },
  )

  const { data: categories } = useRequest<CategoryProps[] | null>({
    url: '/categories',
    method: 'GET',
  })

  const isSmallSize = useScreenSize(480)
  const isMediumSize = useScreenSize(768)

  function handleCloseLateralMenu() {
    setOpenLateralMenu(false)
  }

  const onUpdateBook = (updatedBook: BookProps) => {
    setUpdatedBooks((prevBooks) => {
      if (!prevBooks) return prevBooks

      const updatedBooks = prevBooks.map((book) =>
        book.id === updatedBook.id ? updatedBook : book,
      )

      return updatedBooks
    })
  }

  const handleScroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'right' ? 300 : -300
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    if (booksData?.pagination) {
      setTotalPages(booksData.pagination.totalPages)
    }
  }, [booksData])

  useEffect(() => {
    if (booksData?.books) {
      setUpdatedBooks(booksData.books)
    }
  }, [booksData])

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(search)
      setCurrentPage(1)
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  return (
    <>
      <NextSeo title="Explore | Book Wise" />
      {isRouteLoading ? (
        <LoadingPage />
      ) : (
        <ExplorePageWrapper>
          {openLateralMenu && selectedBook && (
            <LateralMenu
              bookId={selectedBook.id}
              onUpdateBook={onUpdateBook}
              onClose={async () => {
                handleCloseLateralMenu()
              }}
            />
          )}
          {isSmallSize || isMediumSize ? <MobileHeader /> : <Sidebar />}
          <ExplorePageContainer>
            <ExplorePageHeading>
              <TitleAndSearch>
                <HeadingTitle>
                  <Binoculars />
                  <h2>Explore</h2>
                </HeadingTitle>
                <SearchBar
                  placeholder="Search for Author or Title"
                  search={search}
                  onChange={(e) => {
                    setCurrentPage(1)
                    setSearch(e.target.value)
                  }}
                  onClick={() => {
                    setCurrentPage(1)
                    setSearch('')
                  }}
                />
              </TitleAndSearch>
              <ScrollContainer>
                <Categories ref={containerRef}>
                  {!categories?.length ? (
                    <SkeletonCategories />
                  ) : (
                    <>
                      <SelectCategoryButton
                        selected={!selectedCategory}
                        onClick={() => {
                          setCurrentPage(1)
                          setSelectedCategory(null)
                        }}
                      >
                        All
                      </SelectCategoryButton>
                      {categories?.map((category) => (
                        <SelectCategoryButton
                          selected={selectedCategory === category.id}
                          key={category.id}
                          onClick={() => {
                            setCurrentPage(1)
                            setSelectedCategory(category.id)
                          }}
                          className={isValidating ? 'loading' : ''}
                        >
                          {category.name}
                        </SelectCategoryButton>
                      ))}
                    </>
                  )}

                  <CaretLeftIcon onClick={() => handleScroll('left')}>
                    <CaretLeft size={28} weight="bold" />
                  </CaretLeftIcon>
                  <CaretRightIcon onClick={() => handleScroll('right')}>
                    <CaretRight size={28} weight="bold" />
                  </CaretRightIcon>
                </Categories>
              </ScrollContainer>
            </ExplorePageHeading>
            <ExplorePageContent>
              <BooksContainer
                className={`${
                  !updatedBooks?.length && !isValidating ? 'empty' : ''
                }`}
              >
                {isValidating ? (
                  Array.from({ length: perPage }).map((_, index) => (
                    <SkeletonExploreCard key={index} />
                  ))
                ) : updatedBooks?.length ? (
                  updatedBooks?.map((book) => (
                    <ExploreCard
                      key={book.id}
                      book={book}
                      onOpenDetails={() => {
                        setSelectedBook(book)
                        setOpenLateralMenu(true)
                      }}
                    />
                  ))
                ) : (
                  <EmptyContainer content="books" />
                )}
              </BooksContainer>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </ExplorePageContent>
          </ExplorePageContainer>
        </ExplorePageWrapper>
      )}
    </>
  )
}
