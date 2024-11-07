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
import useRequest from '@/utils/useRequest'
import { UserProps } from 'next-auth'
import { DropdownMenu } from './Partials/DropdownMenu'
import { BookStats } from './Partials/BookStats'
import { SignInModal } from '@/components/modals/SignInModal'
import * as Dialog from '@radix-ui/react-dialog'
import { ReadBookModal } from '@/components/modals/ReadBookModal'
import { CreateReviewData } from '@/pages/home/index.page'
import { useAppContext } from '@/contexts/AppContext'

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

  const { loggedUser } = useAppContext()

  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useClickOutside(dropdownRef, () => setIsAddToLibraryDropdownOpen(false))

  const { data, mutate, isValidating } = useRequest<{
    book: BookProps
    user: UserProps
    readingStatus: string | null
  }>({
    url: `reading_status?userId=${loggedUser?.id}&bookId=${book?.id}`,
    method: 'GET',
  })

  const getAddToLibraryButtonLabel = () => {
    if (isValidating) {
      return 'Loading...'
    }

    return data?.readingStatus ? data.readingStatus : 'Add to Library'
  }

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
                <p>{book?.rate?.toFixed(2)}</p>
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
                    onClick={() => {
                      !loggedUser
                        ? setIsSignInModalOpen(true)
                        : setIsAddToLibraryDropdownOpen(true)
                    }}
                  >
                    {getAddToLibraryButtonLabel()}
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
                    activeStatus={data?.readingStatus ?? null}
                    onClose={() => setIsAddToLibraryDropdownOpen(false)}
                    dropdownRef={dropdownRef}
                    book={book}
                    handleOpenReadBookModal={() => setIsReadBookModalOpen(true)}
                    handleSelectReadingStatus={async (value: string) => {
                      await handleSelectReadingStatus(value)
                      await mutate()
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
                      await handleSelectReadingStatus('Read')
                      await mutate()
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
