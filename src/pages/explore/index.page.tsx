import { useState, ChangeEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBinoculars,
  faMagnifyingGlass,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { BookProps } from '@/@types/book'

import { Pagination } from '@/components/shared/Pagination'
import { EmptyContainer } from '@/components/shared/EmptyContainer'
import { SkeletonExploreCard } from '@/components/skeletons/SkeletonExploreCard'

import { ExploreCard } from './partials/ExploreCard'
import { CategoriesSection } from './partials/CategoriesSection'
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
    currentPage,
    setCurrentPage,
    totalPages,
    updatedBooks,
    onUpdateBook,
    categories,
    isValidating,
    error,
    gridRef,
    perPage,
  } = useExploreBooks()

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
        <header className="mb-7 border-b border-line pb-7">
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

          <div className="relative mt-5 rounded-xl border border-line bg-s1 transition-colors hover:border-line-strong focus-within:border-ac/50">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-fg3 pointer-events-none"
              style={{ fontSize: 17 }}
            />
            <input
              type="text"
              placeholder="Search books, authors or ISBN..."
              value={search}
              spellCheck={false}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setCurrentPage(1)
                setSearch(e.target.value)
              }}
              className="w-full rounded-xl border-0 bg-transparent py-3 pl-11 pr-10 text-[14px] text-fg placeholder:text-fg3 outline-none"
            />
            {search && (
              <button
                onClick={() => {
                  setCurrentPage(1)
                  setSearch('')
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fg3 hover:text-fg transition-colors"
              >
                <FontAwesomeIcon icon={faXmark} style={{ fontSize: 15 }} />
              </button>
            )}
          </div>
        </header>

        <CategoriesSection
          categories={categories}
          isValidating={isValidating}
          setCurrentPage={(v) => setCurrentPage(v)}
          setSelectedCategory={(v) => setSelectedCategory(v)}
          selectedCategory={selectedCategory}
        />

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
