import { Binoculars, MagnifyingGlass, X } from 'phosphor-react'
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
} from './styles'
import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/shared/Sidebar'
import { LateralMenu } from '@/components/shared/LateralMenu'
import { NextSeo } from 'next-seo'
import { CategoryProps } from '@/@types/category'
import { BookProps } from '@/@types/book'
import { useScreenSize } from '@/utils/useScreenSize'
import { SkeletonBookCard } from '@/components/skeletons/SkeletonBookCard'
import { SkeletonCategories } from '@/pages/explore/partials/SkeletonCategories'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { BookCard } from '@/components/cards/BookCard'
import { MobileHeader } from '@/components/shared/MobileHeader'
import { SearchBar } from '@/styles/shared'
import useRequest from '@/utils/useRequest'

export interface ExploreProps {
  categories: CategoryProps[]
  books: BookProps[]
}

export default function Explore() {
  const isRouteLoading = useLoadingOnRouteChange()

  const [updatedBooks, setUpdatedBooks] = useState<BookProps[] | []>([])

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const [search, setSearch] = useState('')

  const [selectedCategory, setSelectedCategory] = useState<string | null>('')

  const [openLateralMenu, setOpenLateralMenu] = useState(false)

  const { data: books, isValidating } = useRequest<BookProps[] | null>({
    url: '/books',
    method: 'GET',
    params: {
      category: selectedCategory,
      ...(search?.length ? { search } : {}),
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

  useEffect(() => {
    if (books) {
      setUpdatedBooks(books)
    }
  }, [books])

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
                    onChange={(e) => setSearch(e.target.value)}
                    spellCheck={false}
                  />
                  {search === '' ? (
                    <MagnifyingGlass />
                  ) : (
                    <X onClick={() => setSearch('')} />
                  )}
                </SearchBar>
              </TitleAndSearch>
              <Categories>
                {!categories?.length ? (
                  <SkeletonCategories />
                ) : (
                  <>
                    <SelectCategoryButton
                      selected={!selectedCategory}
                      onClick={() => setSelectedCategory(null)}
                    >
                      All
                    </SelectCategoryButton>
                    {categories?.map((category) => (
                      <SelectCategoryButton
                        selected={
                          !isValidating && selectedCategory === category.id
                        }
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={isValidating ? 'loading' : ''}
                      >
                        {category.name}
                      </SelectCategoryButton>
                    ))}
                  </>
                )}
              </Categories>
            </ExplorePageHeading>
            <ExplorePageContent>
              <BooksContainer>
                {isValidating || !updatedBooks?.length
                  ? Array.from({ length: 9 }).map((_, index) => (
                      <SkeletonBookCard key={index} />
                    ))
                  : updatedBooks?.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        onOpenDetails={() => {
                          setSelectedBook(book)
                          setOpenLateralMenu(true)
                        }}
                      />
                    ))}
              </BooksContainer>
            </ExplorePageContent>
          </ExplorePageContainer>
        </ExplorePageWrapper>
      )}
    </>
  )
}
