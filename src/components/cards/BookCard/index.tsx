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
import { useRef, useState } from 'react'
import { TextBox } from '@/components/shared/TextBox'
import { useClickOutside } from '@/utils/useClickOutside'
import { DropdownMenu } from './Partials/DropdownMenu'
import { BookStats } from './Partials/BookStats'
import { SignInModal } from '@/components/modals/SignInModal'
import * as Dialog from '@radix-ui/react-dialog'
import { ReadBookModal } from '@/components/modals/ReadBookModal'
import { CreateReviewData } from '@/pages/home/index.page'
import { useAppContext } from '@/contexts/AppContext'
import { getReadingStatusLabel } from '@/utils/getReadingStatusLabel'

interface BookCardProps {
  book: BookProps
  categories: CategoryProps[]
  handleCreateReview: (data: CreateReviewData) => Promise<void>
  handleSelectReadingStatus: (status: string) => Promise<void>
  closeLateralMenu: () => void
}

export function BookCard({
  closeLateralMenu,
  book,
  categories,
  handleCreateReview,
  handleSelectReadingStatus,
}: BookCardProps) {
  const categoryNames = categories.map((category) => category?.name)

  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  const [isAddToLibraryDropdownOpen, setIsAddToLibraryDropdownOpen] =
    useState(false)

  const [isReadBookModalOpen, setIsReadBookModalOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const { loggedUser } = useAppContext()

  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useClickOutside(dropdownRef, () => setIsAddToLibraryDropdownOpen(false))

  return (
    <BookCardWrapper>
      <BookCardContent>
        <BookCover alt="" src={book.coverUrl} />
        <BookDetailsWrapper>
          <BookTitleAndAuthor>
            <h2>{book.name}</h2>
            <p>{book.author}</p>
          </BookTitleAndAuthor>
          <BookOtherInfo>
            <BookRatingAndReviews>
              <BookRatingInfo>
                <StarsRating rating={book?.rate ?? 0} />
                <p>{book?.rate?.toFixed(2) ?? '0.00'}</p>
              </BookRatingInfo>
              <p>
                (<span>{book?.ratings?.length ?? 0}</span> {''}
                {book?.ratings?.length === 1 ? 'rating' : 'ratings'})
              </p>
            </BookRatingAndReviews>
            <AddToLibrarySection>
              <Dialog.Root open={isSignInModalOpen}>
                <Dialog.Trigger asChild>
                  <AddToLibraryButton
                    disabled={isLoading}
                    onClick={() => {
                      !loggedUser
                        ? setIsSignInModalOpen(true)
                        : setIsAddToLibraryDropdownOpen(true)
                    }}
                  >
                    {book?.readingStatus
                      ? getReadingStatusLabel(book.readingStatus)
                      : 'Add to Library'}
                  </AddToLibraryButton>
                </Dialog.Trigger>
                <SignInModal onClose={() => setIsSignInModalOpen(false)} />
              </Dialog.Root>

              <Dialog.Root
                open={isReadBookModalOpen}
                onOpenChange={setIsReadBookModalOpen}
              >
                <Dialog.Trigger asChild>
                  <DropdownMenu
                    isOpen={isAddToLibraryDropdownOpen}
                    activeStatus={book?.readingStatus ?? null}
                    onClose={() => setIsAddToLibraryDropdownOpen(false)}
                    dropdownRef={dropdownRef}
                    book={book}
                    handleOpenReadBookModal={() => setIsReadBookModalOpen(true)}
                    isValidating={isLoading}
                    handleSelectReadingStatus={async (value: string) => {
                      setIsLoading(true)

                      handleSelectReadingStatus(value)

                      setIsLoading(false)
                      closeLateralMenu()
                    }}
                  />
                </Dialog.Trigger>
                {loggedUser && (
                  <ReadBookModal
                    userId={loggedUser.id}
                    bookId={book.id}
                    onClose={() => setIsReadBookModalOpen(false)}
                    closeLateralMenu={() => closeLateralMenu()}
                    handleCreateReview={async (data: CreateReviewData) => {
                      await handleCreateReview(data)
                      closeLateralMenu()
                    }}
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
      />
    </BookCardWrapper>
  )
}
