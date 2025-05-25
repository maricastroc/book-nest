import {
  Binoculars,
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  X,
} from 'phosphor-react'
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
import { SearchBar } from '@/styles/shared'
import useRequest from '@/hooks/useRequest'
import { Pagination } from '@/components/shared/Pagination'
import { ExploreCard } from './partials/ExploreCard'
import { usePerPage } from '@/hooks/usePerPage'

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
  } | null>({
    url: '/books',
    method: 'GET',
    params: {
      category: selectedCategory,
      ...(search?.length ? { search } : {}),
      page: currentPage,
      perPage,
    },
  })

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
  console.log(booksData)
  useEffect(() => {
    if (booksData?.pagination) {
      setTotalPages(booksData.pagination.totalPages)
    }
  }, [booksData])

  // Atualizar livros quando os dados mudarem
  useEffect(() => {
    if (booksData?.books) {
      setUpdatedBooks(booksData.books)
    }
  }, [booksData])

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
                <SearchBar>
                  <input
                    type="text"
                    placeholder="Search for author or title"
                    value={search}
                    onChange={(e) => {
                      setCurrentPage(1)
                      setSearch(e.target.value)
                    }}
                    spellCheck={false}
                  />
                  {search === '' ? (
                    <MagnifyingGlass />
                  ) : (
                    <X
                      onClick={() => {
                        setCurrentPage(1)
                        setSearch('')
                      }}
                    />
                  )}
                </SearchBar>
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
                          selected={
                            !isValidating && selectedCategory === category.id
                          }
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
              <BooksContainer>
                {isValidating || !updatedBooks?.length
                  ? Array.from({ length: perPage }).map((_, index) => (
                      <SkeletonExploreCard key={index} />
                    ))
                  : updatedBooks?.map((book) => (
                      <ExploreCard
                        isExplorePage
                        key={book.id}
                        book={book}
                        onOpenDetails={() => {
                          setSelectedBook(book)
                          setOpenLateralMenu(true)
                        }}
                      />
                    ))}
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
