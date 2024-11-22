import { BookProps } from '@/@types/book'
import { StarsRating } from '@/components/shared/StarsRating'
import {
  BookCover,
  BookTitleAndAuthor,
  BookContentWrapper,
  BookCardBox,
  RatingWrapper,
  FooterWrapper,
  ActionButton,
} from './styles'
import { getBookRatingsNumber } from '@/utils/getBookRatingsNumber'
import * as Dialog from '@radix-ui/react-dialog'
import { useAppContext } from '@/contexts/AppContext'
import { PencilSimple } from 'phosphor-react'
import { useState } from 'react'
import { SubmitBookFormModal } from '@/pages/library/partials/SubmitBookFormModal'
import { ReadNotice } from '@/components/shared/ReadNotice'
import { formatToSnakeCase } from '@/utils/formatToSnakeCase'

interface BookCardProps {
  isLibraryPage?: boolean
  libraryPageUserId?: string | undefined
  book: BookProps
  onOpenDetails: () => void
  size?: string
  onClose?: () => Promise<void>
  onCloseWithoutUpdate?: () => void
}

export function BookCard({
  book,
  onOpenDetails,
  libraryPageUserId,
  size = '',
  isLibraryPage = false,
  onClose,
  onCloseWithoutUpdate,
}: BookCardProps) {
  const { loggedUser } = useAppContext()

  const [isEditBookFormOpen, setIsEditBookFormOpen] = useState(false)

  const isLoggedUser = loggedUser?.id === libraryPageUserId

  return (
    <BookCardBox
      className={size}
      onClick={() => {
        if (!isLibraryPage) {
          onOpenDetails()
        }
      }}
    >
      <BookCover
        className={size}
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
                <ActionButton
                  className="edit"
                  onClick={() => setIsEditBookFormOpen(true)}
                >
                  <PencilSimple />
                </ActionButton>
              )}
            </Dialog.Trigger>
            <SubmitBookFormModal
              isEdit
              book={book}
              onClose={async () => {
                if (onClose) {
                  await onClose()
                }
                setIsEditBookFormOpen(false)
              }}
              onCloseWithoutUpdate={() => {
                if (onCloseWithoutUpdate) {
                  onCloseWithoutUpdate()
                }
                setIsEditBookFormOpen(false)
              }}
            />
          </Dialog.Root>
        </FooterWrapper>
      </BookContentWrapper>
    </BookCardBox>
  )
}
