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
import { useClickOutside } from '@/hooks/useClickOutside'
import { DropdownMenu } from './Partials/DropdownMenu'
import { BookStats } from './Partials/BookStats'
import { SignInModal } from '@/components/modals/SignInModal'
import * as Dialog from '@radix-ui/react-dialog'
import { useAppContext } from '@/contexts/AppContext'
import { getReadingStatusLabel } from '@/utils/getReadingStatusLabel'
import { ReadingStatusTag } from '@/components/shared/ReadingStatusTag'
import { ReadingStatus } from '@/@types/reading-status'

interface MenuBookCardProps {
  book: BookProps
  categories: CategoryProps[]
  setIsValidatingStatus: (value: boolean) => void
  onUpdateStatus: (newStatus: string) => void
}

export function MenuBookCard({
  onUpdateStatus,
  setIsValidatingStatus,
  book,
  categories,
}: MenuBookCardProps) {
  const [updatedBook, setUpdatedBook] = useState(book)

  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  const [isAddToLibraryDropdownOpen, setIsAddToLibraryDropdownOpen] =
    useState(false)

  const [isRatingBookModalOpen, setIsRatingBookModalOpen] = useState(false)

  const { loggedUser } = useAppContext()

  const categoryNames = categories.map((category) => category?.name)

  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useClickOutside([dropdownRef], () => setIsAddToLibraryDropdownOpen(false))

  useEffect(() => {
    if (book) {
      setUpdatedBook(book)
    }
  }, [book])
  console.log(book?.readingStatus)
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
                    <ReadingStatusTag
                      type="relative"
                      readingStatus={updatedBook.readingStatus as ReadingStatus}
                    />
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
                    setIsValidatingStatus={(value) =>
                      setIsValidatingStatus(value)
                    }
                    activeStatus={book?.readingStatus as ReadingStatus}
                    onClose={() => setIsAddToLibraryDropdownOpen(false)}
                    dropdownRef={dropdownRef}
                    book={book}
                    onUpdateStatus={onUpdateStatus}
                  />
                </Dialog.Trigger>
              </Dialog.Root>
            </AddToLibrarySection>
          </BookOtherInfo>
        </BookDetailsWrapper>
      </BookCardContent>
      <DividerLine />
      <TextBox description={book.summary} />
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
