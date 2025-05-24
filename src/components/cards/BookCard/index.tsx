import { BookProps } from '@/@types/book'
import { StarsRating } from '@/components/shared/StarsRating'
import {
  BookCover,
  BookTitleAndAuthor,
  BookContentWrapper,
  BookCardBox,
  RatingWrapper,
  FooterWrapper,
} from './styles'
import { getBookRatingsNumber } from '@/utils/getBookRatingsNumber'
import * as Dialog from '@radix-ui/react-dialog'
import { useAppContext } from '@/contexts/AppContext'
import { PencilSimple } from 'phosphor-react'
import { useState } from 'react'
import { SubmitBookFormModal } from '@/pages/library/partials/SubmitBookFormModal'
import { ReadNotice } from '@/components/shared/ReadNotice'
import { formatToSnakeCase } from '@/utils/formatToSnakeCase'
import { ActionButton } from '@/components/core/ActionButton'

interface BookCardProps {
  isLibraryPage?: boolean
  libraryPageUserId?: string | undefined
  book: BookProps
  onOpenDetails: () => void
  size?: string
  onClose?: () => void
  onUpdateBook?: (book: BookProps) => void
}

export function BookCard({
  book,
  onOpenDetails,
  libraryPageUserId,
  size = '',
  isLibraryPage = false,
  onUpdateBook,
}: BookCardProps) {
  const { loggedUser } = useAppContext()

  const [isEditBookFormOpen, setIsEditBookFormOpen] = useState(false)

  const isLoggedUser = loggedUser?.id === libraryPageUserId

  return (
    <BookCardBox
      className={`${size} ${isLibraryPage ? 'library_style' : ''}`}
      onClick={() => {
        if (!isLibraryPage) {
          onOpenDetails()
        }
      }}
    >
      <BookCover
        className={`${size} ${isLibraryPage ? 'library_style' : ''}`}
        src={book.coverUrl}
        onClick={() => onOpenDetails()}
      />
      <BookContentWrapper>
        {isLibraryPage
          ? libraryPageUserId === loggedUser?.id &&
            book?.readingStatus && (
              <ReadNotice
                readingStatus={formatToSnakeCase(book.readingStatus)}
              />
            )
          : book?.readingStatus && (
              <ReadNotice
                readingStatus={formatToSnakeCase(book.readingStatus)}
              />
            )}
        <BookTitleAndAuthor className={size}>
          <h2>{book.name}</h2>
          <p>{book.author}</p>
        </BookTitleAndAuthor>
        <FooterWrapper>
          <RatingWrapper className={isLibraryPage ? 'smaller' : ''}>
            <p>{getBookRatingsNumber(book)}</p>
            <StarsRating size={size} rating={book?.rate ?? 0} />
          </RatingWrapper>
          <Dialog.Root open={isEditBookFormOpen}>
            <Dialog.Trigger asChild>
              {isLoggedUser && isLibraryPage && (
                <ActionButton onClick={() => setIsEditBookFormOpen(true)}>
                  <PencilSimple className="edit_icon" />
                </ActionButton>
              )}
            </Dialog.Trigger>
            {isEditBookFormOpen && (
              <SubmitBookFormModal
                isEdit
                book={book}
                onUpdateBook={onUpdateBook}
                onClose={() => setIsEditBookFormOpen(false)}
              />
            )}
          </Dialog.Root>
        </FooterWrapper>
      </BookContentWrapper>
    </BookCardBox>
  )
}
