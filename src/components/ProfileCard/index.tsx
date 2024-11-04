import {
  BookContainer,
  BookCover,
  BookDetails,
  BookDescription,
  BookInfo,
  Container,
  Separator,
  ReadNotice,
  Heading,
  Wrapper,
  BookInfoText,
  BookData,
  DeleteAndEdit,
} from './styles'
import { StarsRating } from '../StarsRating'
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { RatingProps } from '@/@types/rating'
import { BookProps } from '@/@types/book'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Pencil, Trash } from 'phosphor-react'
import * as Dialog from '@radix-ui/react-dialog'
import { DeleteModal } from '../LateralMenu/components/DeleteModal'
import { useAppContext } from '@/contexts/AppContext'

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
  } = useAppContext()

  const isLoggedUser = rating.userId === session?.user.id

  const onDelete = async () => {
    if (session?.user?.id && onDeleteRating) {
      handleDeleteReview(rating.id)

      await Promise.all([
        onDeleteRating(),
        refreshLatestRatings(),
        refreshPopularBooks(),
        refreshUserLatestRatings(),
      ])
    }
  }

  return (
    <Wrapper>
      <Heading>
        <time title={dateFormatted} dateTime={dateString}>
          {dateRelativeToNow}
        </time>
        {isLoggedUser && (
          <DeleteAndEdit>
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
          </DeleteAndEdit>
        )}
      </Heading>
      <Container>
        {rating?.book?.alreadyRead && (
          <ReadNotice>
            <p>READ</p>
          </ReadNotice>
        )}
        <BookContainer>
          <BookDetails>
            <BookData>
              <BookCover src={book.coverUrl} alt="" />
              <BookInfo>
                <BookInfoText>
                  <h2>{book.name}</h2>
                  <p>{book.author}</p>
                </BookInfoText>
                <StarsRating rating={rating.rate} />
              </BookInfo>
            </BookData>
            <Separator />
            <BookDescription>
              <p>{rating.description}</p>
            </BookDescription>
          </BookDetails>
        </BookContainer>
      </Container>
    </Wrapper>
  )
}
