/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import {
  faBookOpen,
  faMagnifyingGlass,
  faXmark,
  faArrowLeft,
  faBookMedical,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { OutlineButton } from '@/components/ui/OutlineButton'

import { MainLayout } from '@/layouts/MainLayout'
import { LateralMenu } from '@/components/features/books/LateralMenu'
import { BookProvider } from '@/contexts/BookContext'
import { EmptyContainer } from '@/components/ui/EmptyContainer'
import { BookProps } from '@/@types/book'
import useRequest from '@/hooks/useRequest'
import { useAppContext } from '@/contexts/AppContext'

import { SubmitBookWizard } from './partials/SubmitBookWizard'
import { MyBooksGrid } from './partials/MyBooksGrid'

export default function MyBooks() {
  const { loggedUser } = useAppContext()
  const [view, setView] = useState<'list' | 'form'>('list')
  const [submittedBooks, setSubmittedBooks] = useState<BookProps[] | null>([])
  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)
  const [isLateralMenuOpen, setIsLateralMenuOpen] = useState(false)
  const [search, setSearch] = useState('')

  const userId = loggedUser?.id

  const { data, mutate, isValidating, error } = useRequest<{
    submittedBooks: BookProps[]
    user: unknown
    pagination: unknown
  }>(
    userId
      ? { url: '/library/submitted_books', method: 'GET', params: { userId } }
      : null,
  )

  useEffect(() => {
    if (data?.submittedBooks) setSubmittedBooks(data.submittedBooks)
  }, [data])

  const filteredBooks = submittedBooks
    ? search
      ? submittedBooks.filter(
          (b) =>
            b.name.toLowerCase().includes(search.toLowerCase()) ||
            b.author.toLowerCase().includes(search.toLowerCase()),
        )
      : submittedBooks
    : []

  if (!loggedUser) {
    return (
      <MainLayout
        title="My Books | Book Nest"
        icon={<FontAwesomeIcon icon={faBookOpen} />}
        pageTitle=""
      >
        <div className="bn-scope px-8 pb-12 pt-8 md:px-10">
          <EmptyContainer content="books" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout
      title="My Books | Book Nest"
      icon={<FontAwesomeIcon icon={faBookOpen} />}
      pageTitle=""
    >
      {isLateralMenuOpen && !!selectedBook && (
        <BookProvider
          bookId={selectedBook.id}
          onUpdateBook={() => {
            mutate()
          }}
          onUpdateRating={async () => {
            await mutate()
          }}
        >
          <LateralMenu onClose={() => setIsLateralMenuOpen(false)} />
        </BookProvider>
      )}

      <div className="bn-scope flex flex-col px-8 pb-12 pt-8 md:px-10">
        <header className="mb-7 border-b border-line pb-7">
          <div className="mb-1.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-fg3">
            <FontAwesomeIcon icon={faBookOpen} style={{ fontSize: 12 }} />
            <span>My Contributions</span>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-[2rem] font-semibold leading-tight tracking-tight text-fg">
                {view === 'form' ? 'Submit a Book' : "Books you've contributed"}
              </h1>
              <p className="mt-1 text-[13px] text-fg2">
                {view === 'form'
                  ? 'Fill in the details below to add a book to the catalogue.'
                  : "Track and manage the books you've submitted to the catalogue."}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              {view === 'form' && (
                <OutlineButton
                  onClick={() => {
                    setView('list')
                    mutate()
                  }}
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    style={{ width: 12, height: 12 }}
                  />{' '}
                  Back to My Books
                </OutlineButton>
              )}
              {view === 'list' && (
                <button
                  onClick={() => setView('form')}
                  className="flex items-center gap-2 rounded-[10px] bg-ac px-5 py-2.5 text-[13.5px] font-bold text-ac-ink shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition-all hover:opacity-90"
                >
                  <FontAwesomeIcon
                    icon={faBookMedical}
                    style={{ width: 15, height: 15 }}
                  />
                  Submit a Book
                </button>
              )}
            </div>
          </div>

          {view === 'list' && (
            <div className="relative mt-5 rounded-xl border border-line bg-s1 transition-colors hover:border-line-strong focus-within:border-ac/50">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg3"
                style={{ fontSize: 17 }}
              />
              <input
                type="text"
                placeholder="Search by title or author…"
                value={search}
                spellCheck={false}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border-0 bg-transparent py-3 pl-11 pr-10 text-[14px] text-fg outline-none placeholder:text-fg3"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fg3 transition-colors hover:text-fg"
                >
                  <FontAwesomeIcon icon={faXmark} style={{ fontSize: 15 }} />
                </button>
              )}
            </div>
          )}
        </header>

        {view === 'form' ? (
          <SubmitBookWizard
            onClose={() => {
              setView('list')
              mutate()
            }}
          />
        ) : (
          <MyBooksGrid
            books={submittedBooks}
            filteredBooks={filteredBooks}
            search={search}
            isValidating={isValidating}
            error={error}
            onOpenDetails={(book) => {
              setSelectedBook(book)
              setIsLateralMenuOpen(true)
            }}
            onSubmitFirst={() => setView('form')}
          />
        )}
      </div>
    </MainLayout>
  )
}
