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

interface ProfileCardProps {
  book: BookProps
  rating: RatingProps
  onDeleteRating?: () => Promise<void>
}

export function ProfileCard({
  book,
  rating,
  onDeleteRating,
}: ProfileCardProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(rating.createdAt)

  const { data: session } = useSession()

  const [isEditRatingBoxOpen, setIsEditRatingBoxOpen] = useState(false)

  const {
    handleDeleteReview,
    refreshLatestRatings,
    refreshUserLatestRatings,
    refreshPopularBooks,
    handleSetIsLoading,
  } = useAppContext()

  const isLoggedUser = rating.userId === session?.user.id

  const onDelete = async () => {
    if (session?.user?.id && onDeleteRating) {
      handleSetIsLoading(true)

      handleDeleteReview(rating.id)

      await Promise.all([
        onDeleteRating(),
        refreshLatestRatings(),
        refreshPopularBooks(),
        refreshUserLatestRatings(),
      ])

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
              <DeleteModal onConfirm={() => onDelete()} />
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
                <StarsRating rating={rating.rate} />
              </BookInfoHeader>
            </BookInfoSection>
            <DividerLine />
            <ReviewTextContainer>
              <p>{rating.description}</p>
            </ReviewTextContainer>
          </BookDetailsContent>
        </BookDetailsContainer>
      </ProfileCardBody>
    </ProfileCardBox>
  )
}
