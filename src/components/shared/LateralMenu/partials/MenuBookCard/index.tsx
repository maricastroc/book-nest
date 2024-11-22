import { StarsRating } from '@/components/shared/StarsRating'
import {
  BookCardWrapper,
  BookCardContent,
  BookCover,
  BookTitleAndAuthor,
  BookDetailsWrapper,
  BookRatingInfo,
  DividerLine,
  AddToLibraryButton,
  BookRatingAndReviews,
  BookOtherInfo,
  AddToLibrarySection,
} from './styles'
import { CategoryProps } from '@/@types/category'
import { BookProps } from '@/@types/book'
import { useEffect, useRef, useState } from 'react'
import { TextBox } from '@/components/shared/TextBox'
import { useClickOutside } from '@/utils/useClickOutside'
import { DropdownMenu } from './Partials/DropdownMenu'
import { BookStats } from './Partials/BookStats'
import { SignInModal } from '@/components/modals/SignInModal'
import * as Dialog from '@radix-ui/react-dialog'
import { RatingBookModal } from '@/components/shared/LateralMenu/partials/RatingBookModal'
import { useAppContext } from '@/contexts/AppContext'
import { getReadingStatusLabel } from '@/utils/getReadingStatusLabel'
import { RatingProps } from '@/@types/rating'

interface MenuBookCardProps {
  book: BookProps
  categories: CategoryProps[]
  onUpdateStatus: (
    book: BookProps,
    newStatus: string,
    userRating: number,
  ) => void
  onCreateReview: (newRating: RatingProps) => void
}

export function MenuBookCard({
  onUpdateStatus,
  onCreateReview,
  book,
  categories,
}: MenuBookCardProps) {
  const [updatedBook, setUpdatedBook] = useState(book)

  const categoryNames = categories.map((category) => category?.name)

  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  const [isAddToLibraryDropdownOpen, setIsAddToLibraryDropdownOpen] =
    useState(false)

  const [isRatingBookModalOpen, setIsRatingBookModalOpen] = useState(false)

  const [selectedStatus, setSelectedStatus] = useState('')

  const { loggedUser } = useAppContext()

  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useClickOutside(dropdownRef, () => setIsAddToLibraryDropdownOpen(false))

  useEffect(() => {
    if (book) {
      setUpdatedBook(book)
    }
  }, [book])

  return (
    <BookCardWrapper>
      <BookCardContent>
        <BookCover alt="" src={updatedBook.coverUrl} />
        <BookDetailsWrapper>
          <BookTitleAndAuthor>
            <h2>{updatedBook.name}</h2>
            <p>{updatedBook.author}</p>
          </BookTitleAndAuthor>
          <BookOtherInfo>
            <BookRatingAndReviews>
              <BookRatingInfo>
                <StarsRating rating={updatedBook?.rate ?? 0} />
                <p>{updatedBook?.rate?.toFixed(2) ?? '0.00'}</p>
              </BookRatingInfo>
              <p>
                (<span>{updatedBook?.ratings?.length ?? 0}</span> {''}
                {updatedBook?.ratings?.length === 1 ? 'rating' : 'ratings'})
              </p>
            </BookRatingAndReviews>
            <AddToLibrarySection>
              <Dialog.Root open={isSignInModalOpen}>
                <Dialog.Trigger asChild>
                  <AddToLibraryButton
                    onClick={() => {
                      !loggedUser
                        ? setIsSignInModalOpen(true)
                        : setIsAddToLibraryDropdownOpen(true)
                    }}
                  >
                    {updatedBook?.readingStatus
                      ? getReadingStatusLabel(updatedBook.readingStatus)
                      : 'Add to Library'}
                  </AddToLibraryButton>
                </Dialog.Trigger>
                <SignInModal onClose={() => setIsSignInModalOpen(false)} />
              </Dialog.Root>

              <Dialog.Root
                open={isRatingBookModalOpen}
                onOpenChange={setIsRatingBookModalOpen}
              >
                <Dialog.Trigger asChild>
                  <DropdownMenu
                    isOpen={isAddToLibraryDropdownOpen}
                    activeStatus={book?.readingStatus ?? null}
                    onClose={() => setIsAddToLibraryDropdownOpen(false)}
                    dropdownRef={dropdownRef}
                    book={book}
                    onUpdateStatus={onUpdateStatus}
                    handleOpenRatingBookModal={(status: string) => {
                      setSelectedStatus(status)
                      setIsRatingBookModalOpen(true)
                    }}
                  />
                </Dialog.Trigger>
                {loggedUser && (
                  <RatingBookModal
                    userId={loggedUser.id}
                    bookId={book.id}
                    onClose={() => setIsRatingBookModalOpen(false)}
                    bookStatus={selectedStatus}
                    onCreateReview={onCreateReview}
                  />
                )}
              </Dialog.Root>
            </AddToLibrarySection>
          </BookOtherInfo>
        </BookDetailsWrapper>
      </BookCardContent>
      <DividerLine />
      <TextBox maxHeight="4.5rem" description={book.summary} />
      <DividerLine />
      <BookStats
        categoryNames={categoryNames}
        totalPages={book.totalPages}
        publishingYear={book.publishingYear ?? '-'}
        publisher={book.publisher || ''}
        language={book.language || ''}
        isbn={book.isbn || ''}
      />
    </BookCardWrapper>
  )
}
