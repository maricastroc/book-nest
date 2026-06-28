import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBinoculars } from '@fortawesome/free-solid-svg-icons'
import { BookProps } from '@/@types/book'

import { Pagination } from '@/components/ui/Pagination'
import { SearchBar } from '@/components/ui/SearchBar'
import { EmptyContainer } from '@/components/ui/EmptyContainer'
import { SkeletonExploreCard } from '@/components/features/books/SkeletonExploreCard'

import { ExploreCard } from './partials/ExploreCard'
import { CategoriesSection } from './partials/CategoriesSection'
import { ResultsBar } from './partials/ResultsBar'
import { useExploreBooks } from '@/hooks/useExploreBooks'
import { MainLayout } from '@/layouts/MainLayout'

export default function Explore() {
  const [isLateralMenuOpen, setIsLateralMenuOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const {
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    sort,
    setSort,
    currentPage,
    setCurrentPage,
    totalPages,
    totalBooks,
    updatedBooks,
    onUpdateBook,
    categories,
    isValidating,
    error,
    gridRef,
    perPage,
  } = useExploreBooks()

  const categoryName =
    categories?.find((category) => category.id === selectedCategory)?.name ??
    null

  const renderBookCards = () => {
    if (isValidating) {
      return Array.from({ length: perPage }).map((_, i) => (
        <SkeletonExploreCard key={i} />
      ))
    }
    if (error) return <EmptyContainer content="books" variant="error" />
    if (!updatedBooks?.length) return <EmptyContainer content="books" />

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
      icon={<FontAwesomeIcon icon={faBinoculars} />}
      pageTitle=""
      isLateralMenuOpen={isLateralMenuOpen}
      setIsLateralMenuOpen={(v) => setIsLateralMenuOpen(v)}
      onUpdateBook={onUpdateBook}
      selectedBook={selectedBook}
    >
      <div
        className="bn-scope flex flex-col px-8 pb-12 pt-8 md:px-10"
        ref={gridRef}
      >
        <header className="mb-4 border-b border-line pb-7">
          <div className="mb-1.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-fg3">
            <FontAwesomeIcon icon={faBinoculars} style={{ fontSize: 12 }} />
            <span>The BookNest Collection</span>
          </div>
          <h1 className="font-serif text-[2rem] font-semibold leading-tight tracking-tight text-fg">
            What are you looking for today?
          </h1>
          <p className="mt-1 text-[13px] text-fg2">
            Browse{' '}
            {categories?.length ? `${categories.length} genres` : 'all genres'},
            or search by title, author, or ISBN.
          </p>

          <SearchBar
            search={search}
            placeholder="Search books, authors or ISBN..."
            fullWidth
            className="mt-5"
            onChange={(e) => {
              setCurrentPage(1)
              setSearch(e.target.value)
            }}
            onClick={() => {
              setCurrentPage(1)
              setSearch('')
            }}
          />
        </header>

        <CategoriesSection
          categories={categories}
          isValidating={isValidating}
          setCurrentPage={(v) => setCurrentPage(v)}
          setSelectedCategory={(v) => setSelectedCategory(v)}
          selectedCategory={selectedCategory}
        />

        {!error && (
          <ResultsBar
            total={totalBooks}
            isValidating={isValidating}
            search={search}
            categoryName={categoryName}
            sort={sort}
            onSortChange={(value) => {
              setCurrentPage(1)
              setSort(value)
            }}
          />
        )}

        <div
          className={`grid gap-3 ${
            !updatedBooks?.length && !isValidating
              ? 'grid-cols-1'
              : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
          }`}
        >
          {renderBookCards()}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </MainLayout>
  )
}
