import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { PencilSimple, Plus, TrashSimple } from 'phosphor-react'

import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { useAppContext } from '@/contexts/AppContext'
import { RatingProps } from '@/@types/rating'
import { BookProps } from '@/@types/book'

import {
  BookDetailsContainer,
  BookSummaryWrapper,
  BookCover,
  ProfileCardBody,
  DividerLine,
  ProfileCardHeader,
  ProfileCardBox,
  BookTitleAndAuthor,
  ProfileCardWrapper,
  EmptyCardContent,
  ActionButton,
} from './styles'
import { UserActions } from '@/styles/shared'
import { StarsRating } from '@/components/shared/StarsRating'
import { DeleteModal } from '@/components/modals/DeleteModal'
import { useScreenSize } from '@/utils/useScreenSize'
import { TextBox } from '@/components/shared/TextBox'
import { EditUserReviewModal } from '@/pages/profile/partials/EditUserReviewModal'

interface ProfileCardProps {
  book: BookProps
  rating: RatingProps
  onUpdateReview: (updatedReview: RatingProps) => void
  onCreateReview: (newRating: RatingProps) => void
  onDeleteReview: (ratingId: string) => void
}

export function ProfileCard({
  book,
  rating,
  onUpdateReview,
  onCreateReview,
  onDeleteReview,
}: ProfileCardProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(rating.createdAt)

  const [isEditUserReviewModalOpen, setIsEditUserReviewModalOpen] =
    useState(false)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { loggedUser, handleDeleteReview } = useAppContext()

  const isMobile = useScreenSize(480)

  const deleteReview = async () => {
    if (loggedUser) {
      await handleDeleteReview(rating.id)
      onDeleteReview(rating.id)
      setIsDeleteModalOpen(false)
    }
  }
  console.log(rating, book)
  return (
    <ProfileCardWrapper>
      <time title={dateFormatted} dateTime={dateString}>
        {dateRelativeToNow}
      </time>
      <ProfileCardBox>
        <ProfileCardHeader>
          <StarsRating variant={'secondary'} rating={rating.rate} />
          {rating.userId === loggedUser?.id && (
            <>
              <UserActions style={{ paddingRight: 0, marginTop: 0 }}>
                <Dialog.Root open={isDeleteModalOpen}>
                  <Dialog.Trigger asChild>
                    <ActionButton
                      className="delete"
                      type="button"
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      <TrashSimple />
                    </ActionButton>
                  </Dialog.Trigger>
                  <DeleteModal
                    onConfirm={() => {
                      deleteReview()
                    }}
                  />
                </Dialog.Root>
                <Dialog.Root open={isEditUserReviewModalOpen}>
                  <Dialog.Trigger asChild>
                    <ActionButton
                      className="edit"
                      type="button"
                      onClick={() => setIsEditUserReviewModalOpen(true)}
                    >
                      <PencilSimple />
                    </ActionButton>
                  </Dialog.Trigger>
                  <EditUserReviewModal
                    rating={rating}
                    book={book}
                    onUpdateReview={onUpdateReview}
                    onCreateReview={onCreateReview}
                    onClose={() => {
                      setIsEditUserReviewModalOpen(false)
                    }}
                  />
                </Dialog.Root>
              </UserActions>
            </>
          )}
        </ProfileCardHeader>

        {book && (
          <ProfileCardBody>
            <BookDetailsContainer>
              <BookCover src={book.coverUrl} alt="" />
              <BookSummaryWrapper>
                <BookTitleAndAuthor>
                  <h2>{book.name}</h2>
                  <p>{book.author}</p>
                </BookTitleAndAuthor>
                {!isMobile &&
                  (rating.description !== '' ? (
                    <TextBox
                      maxHeight="5.8rem"
                      description={rating.description}
                    />
                  ) : (
                    <EmptyCardContent
                      onClick={() => setIsEditUserReviewModalOpen(true)}
                    >
                      Add your Review
                      <Plus />
                    </EmptyCardContent>
                  ))}
              </BookSummaryWrapper>
            </BookDetailsContainer>

            {isMobile &&
              (rating.description !== '' ? (
                <>
                  <DividerLine />
                  <TextBox
                    maxHeight="5.8rem"
                    description={rating.description}
                  />
                </>
              ) : (
                <>
                  <DividerLine />
                  <EmptyCardContent
                    onClick={() => setIsEditUserReviewModalOpen(true)}
                  >
                    Add your Review
                    <Plus />
                  </EmptyCardContent>
                </>
              ))}
          </ProfileCardBody>
        )}
      </ProfileCardBox>
    </ProfileCardWrapper>
  )
}
