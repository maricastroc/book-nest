import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Pencil, Trash } from 'phosphor-react'

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
} from './styles'
import { UserActions } from '@/styles/shared'
import { EditReviewData } from '@/pages/home/index.page'
import { StarsRating } from '@/components/shared/StarsRating'
import { DeleteModal } from '@/components/modals/DeleteModal'
import { useScreenSize } from '@/utils/useScreenSize'
import { TextBox } from '@/components/shared/TextBox'
import { EditUserReviewModal } from '@/components/modals/EditUserReviewModal'

interface ProfileCardProps {
  book: BookProps
  rating: RatingProps
  handleDeleteReview?: () => Promise<void>
  handleEditReview?: (data: EditReviewData) => Promise<void>
}

export function ProfileCard({
  book,
  rating,
  handleDeleteReview,
  handleEditReview,
}: ProfileCardProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(rating.createdAt)

  const [isEditUserReviewModalOpen, setIsEditUserReviewModalOpen] =
    useState(false)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { loggedUser } = useAppContext()

  const isMobile = useScreenSize(480)

  const onDeleteReview = async () => {
    if (loggedUser && handleDeleteReview) {
      await handleDeleteReview()
      setIsDeleteModalOpen(false)
    }
  }

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
                    <Trash className="delete_icon" />
                  </Dialog.Trigger>
                  <DeleteModal
                    onConfirm={() => {
                      onDeleteReview()
                    }}
                  />
                </Dialog.Root>
                <Dialog.Root open={isEditUserReviewModalOpen}>
                  <Dialog.Trigger asChild>
                    <Pencil
                      className="edit_icon"
                      onClick={() => setIsEditUserReviewModalOpen(true)}
                    />
                  </Dialog.Trigger>
                  <EditUserReviewModal
                    rating={rating}
                    bookId={book.id}
                    handleEditReview={handleEditReview}
                    onClose={() => {
                      setIsEditUserReviewModalOpen(false)
                    }}
                  />
                </Dialog.Root>
              </UserActions>
            </>
          )}
        </ProfileCardHeader>

        <DividerLine className="larger" />

        {book && (
          <ProfileCardBody>
            <BookDetailsContainer>
              <BookCover src={book.coverUrl} alt="" />
              <BookSummaryWrapper>
                <BookTitleAndAuthor>
                  <h2>{book.name}</h2>
                  <p>{book.author}</p>
                </BookTitleAndAuthor>
                {!isMobile && (
                  <TextBox
                    maxHeight="5.8rem"
                    description={rating.description}
                  />
                )}
              </BookSummaryWrapper>
            </BookDetailsContainer>

            {isMobile && (
              <>
                <DividerLine />
                <TextBox maxHeight="5.8rem" description={rating.description} />
              </>
            )}
          </ProfileCardBody>
        )}
      </ProfileCardBox>
    </ProfileCardWrapper>
  )
}
