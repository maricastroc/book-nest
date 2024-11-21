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
import { useState } from 'react'
import { MobileHeader } from '@/components/shared/MobileHeader'
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
import { useAppContext } from '@/contexts/AppContext'
import { BookCard } from '@/components/cards/BookCard'
import { TabletHeader } from '@/components/shared/TabletHeader'
import { MobileFooter } from '@/components/shared/MobileFooter'
import { SearchBar } from '@/styles/shared'

export interface ExploreProps {
  categories: CategoryProps[]
  books: BookProps[]
}

export default function Explore() {
  const isRouteLoading = useLoadingOnRouteChange()

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const [openLateralMenu, setOpenLateralMenu] = useState(false)

  const {
    books,
    categories,
    isValidatingExplorePage,
    selectedCategory,
    handleSetSelectedCategory,
    search,
    handleSetSearch,
  } = useAppContext()

  const isSmallSize = useScreenSize(480)
  const isMediumSize = useScreenSize(768)

  function handleCloseLateralMenu() {
    setOpenLateralMenu(false)
  }
  console.log(books)
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
              onClose={async () => {
                handleCloseLateralMenu()
              }}
            />
          )}
          {isSmallSize ? (
            <MobileHeader />
          ) : isMediumSize ? (
            <TabletHeader />
          ) : (
            <Sidebar />
          )}
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
                    onChange={(e) => handleSetSearch(e.target.value)}
                    spellCheck={false}
                  />
                  {search === '' ? (
                    <MagnifyingGlass />
                  ) : (
                    <X onClick={() => handleSetSearch('')} />
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
                      onClick={() => handleSetSelectedCategory(null)}
                    >
                      All
                    </SelectCategoryButton>
                    {categories?.map((category) => (
                      <SelectCategoryButton
                        selected={
                          !isValidatingExplorePage &&
                          selectedCategory === category.id
                        }
                        key={category.id}
                        onClick={() => handleSetSelectedCategory(category.id)}
                        className={isValidatingExplorePage ? 'loading' : ''}
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
                {isValidatingExplorePage || !books?.length
                  ? Array.from({ length: 9 }).map((_, index) => (
                      <SkeletonBookCard key={index} />
                    ))
                  : books?.map((book) => (
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
          {isSmallSize && <MobileFooter />}
        </ExplorePageWrapper>
      )}
    </>
  )
}
