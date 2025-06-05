import { useState } from 'react'

import { Binoculars } from 'phosphor-react'

import { CategoryProps } from '@/@types/category'
import { BookProps } from '@/@types/book'

import { Pagination } from '@/components/shared/Pagination'
import { EmptyContainer } from '@/components/shared/EmptyContainer'
import { SearchBar } from '@/components/shared/SearchBar'

import { SkeletonExploreCard } from '@/components/skeletons/SkeletonExploreCard'

import { ExploreCard } from './partials/ExploreCard'

import {
  ExplorePageWrapper,
  ExplorePageContainer,
  ExplorePageHeading,
  BooksContainer,
  ExplorePageContent,
  HeadingTitle,
  TitleAndSearch,
} from './styles'
import { useExploreBooks } from '@/hooks/useExploreBooks'
import { CategoriesSection } from './partials/CategoriesSection'
import { MainLayout } from '@/layouts/MainLayout'

export interface ExploreProps {
  categories: CategoryProps[]
  books: BookProps[]
}

export default function Explore() {
  const [isLateralMenuOpen, setIsLateralMenuOpen] = useState(false)

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const {
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    setCurrentPage,
    totalPages,
    updatedBooks,
    onUpdateBook,
    categories,
    isValidating,
    containerRef,
    gridRef,
    perPage,
  } = useExploreBooks()

  const renderBookCards = () => {
    if (isValidating) {
      return Array.from({ length: perPage }).map((_, index) => (
        <SkeletonExploreCard key={index} />
      ))
    }

    if (!updatedBooks?.length && !isValidating) {
      return <EmptyContainer content="books" />
    }

    return updatedBooks.map((book) => (
      <ExploreCard
        key={book.id}
        book={book}
        onOpenDetails={() => {
          setSelectedBook(book)
          setIsLateralMenuOpen(true)
        }}
      />
    ))
  }

  return (
    <MainLayout
      title="Explore | Book Nest"
      isLateralMenuOpen={isLateralMenuOpen}
      setIsLateralMenuOpen={(value) => setIsLateralMenuOpen(value)}
      onUpdateBook={onUpdateBook}
      selectedBook={selectedBook}
    >
      <ExplorePageWrapper>
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
            <CategoriesSection
              categories={categories}
              containerRef={containerRef}
              isValidating={isValidating}
              setCurrentPage={(value) => setCurrentPage(value)}
              setSelectedCategory={(value) => setSelectedCategory(value)}
              selectedCategory={selectedCategory}
            />
          </ExplorePageHeading>
          <ExplorePageContent ref={gridRef}>
            <BooksContainer
              className={`${
                !updatedBooks?.length && !isValidating ? 'empty' : ''
              }`}
            >
              {renderBookCards()}
            </BooksContainer>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </ExplorePageContent>
        </ExplorePageContainer>
      </ExplorePageWrapper>
    </MainLayout>
  )
}
