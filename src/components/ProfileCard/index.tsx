import { useState } from 'react'
import { useSession } from 'next-auth/react'
import * as Dialog from '@radix-ui/react-dialog'
import { Pencil, Trash } from 'phosphor-react'

import { StarsRating } from '../StarsRating'
import { DeleteModal } from '../LateralMenu/components/DeleteModal'
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { useAppContext } from '@/contexts/AppContext'
import { RatingProps } from '@/@types/rating'
import { BookProps } from '@/@types/book'

import {
  BookDetailsContainer,
  BookCover,
  BookDetailsContent,
  BookInfoSection,
  ReviewTextContainer,
  BookInfoHeader,
  ProfileCardBody,
  DividerLine,
  ProfileCardHeader,
  ProfileCardBox,
  BookTitleAndAuthor,
} from './styles'
import { ReadNotice, UserActions } from '@/styles/shared'
import { RatingCardForm } from '../LateralMenu/components/RatingCardForm'
import { EditReviewData } from '@/pages/home/index.page'

interface ProfileCardProps {
  book: BookProps
  rating: RatingProps
  handleDeleteReview?: () => void
  handleEditReview?: (data: EditReviewData) => void
}

export function ProfileCard({
  book,
  rating,
  handleDeleteReview,
  handleEditReview,
}: ProfileCardProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(rating.createdAt)

  const { data: session } = useSession()

  const [isEditRatingBoxOpen, setIsEditRatingBoxOpen] = useState(false)

  const { handleSetIsLoading } = useAppContext()

  const isLoggedUser = rating.userId === session?.user.id

  const onDeleteReview = async () => {
    if (session?.user?.id && handleDeleteReview) {
      handleSetIsLoading(true)

      handleDeleteReview()

      handleSetIsLoading(false)
    }
  }

  return (
    <ProfileCardBox>
      <ProfileCardHeader>
        <time title={dateFormatted} dateTime={dateString}>
          {dateRelativeToNow}
        </time>
        {isLoggedUser && (
          <UserActions>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Trash className="delete_icon" />
              </Dialog.Trigger>
              <DeleteModal onConfirm={() => onDeleteReview()} />
            </Dialog.Root>
            <Pencil
              className="edit_icon"
              onClick={() => setIsEditRatingBoxOpen(!isEditRatingBoxOpen)}
            />
          </UserActions>
        )}
      </ProfileCardHeader>
      <ProfileCardBody>
        {rating?.book?.alreadyRead && (
          <ReadNotice>
            <p>READ</p>
          </ReadNotice>
        )}
        <BookDetailsContainer>
          <BookDetailsContent>
            <BookInfoSection>
              <BookCover src={book.coverUrl} alt="" />
              <BookInfoHeader>
                <BookTitleAndAuthor>
                  <h2>{book.name}</h2>
                  <p>{book.author}</p>
                </BookTitleAndAuthor>
                {!isEditRatingBoxOpen && <StarsRating rating={rating.rate} />}
              </BookInfoHeader>
            </BookInfoSection>
            <DividerLine />
            {isEditRatingBoxOpen ? (
              <RatingCardForm
                isProfileScreen
                isEdit
                rating={rating}
                bookId={book.id}
                onClose={() => setIsEditRatingBoxOpen(false)}
                handleEditReview={handleEditReview}
              />
            ) : (
              <ReviewTextContainer>
                <p>{rating.description}</p>
              </ReviewTextContainer>
            )}
          </BookDetailsContent>
        </BookDetailsContainer>
      </ProfileCardBody>
    </ProfileCardBox>
  )
}
