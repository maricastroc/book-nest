/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import {
  AvatarContainer,
  AvatarDefault,
  BookDescription,
  DeleteAndEdit,
  Header,
  NameAndDate,
  RatingContainer,
  RatingContent,
  UserData,
} from './styles'
import { StarsRating } from '@/components/StarsRating'
import { useSession } from 'next-auth/react'
import { Trash, Pencil } from 'phosphor-react'
import { DeleteModal } from '../DeleteModal'
import * as Dialog from '@radix-ui/react-dialog'
import { toast } from 'react-toastify'
import { api } from '@/lib/axios'

interface RatingCardProps {
  id: string
  avatar_url: string | null
  name: string | null
  created_at: Date | null
  description: string | null
  rating: number | null
  user: string | null
  onCloseLateralMenu: () => void
}

export function RatingCard({
  id,
  avatar_url,
  name,
  rating,
  created_at,
  description,
  user,
  onCloseLateralMenu,
}: RatingCardProps) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(created_at!)

  const session = useSession()

  async function handleDeleteReview(id: string) {
    try {
      const payload = {
        id,
      }
      await api.delete('/ratings', { data: payload })
    } catch (err) {
      console.log(err)
    }
    onCloseLateralMenu()
    toast.success('Review successfully deleted!')
  }

  return (
    <RatingContainer>
      <RatingContent
        className={user === session.data?.user.id ? 'from_user' : ''}
      >
        <Header>
          <UserData>
            <AvatarContainer>
              <AvatarDefault alt="" src={avatar_url!} />
            </AvatarContainer>
            <NameAndDate>
              <p>{name}</p>
              <time title={dateFormatted} dateTime={dateString}>
                {dateRelativeToNow}
              </time>
            </NameAndDate>
          </UserData>
          <StarsRating rating={rating!} />
        </Header>
        <BookDescription>
          <p>{description}</p>
        </BookDescription>
      </RatingContent>
      {user === session.data?.user.id && (
        <>
          <DeleteAndEdit>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Trash
                  className="delete_icon"
                  onClick={() => handleDeleteReview(id)}
                />
              </Dialog.Trigger>
              <DeleteModal />
            </Dialog.Root>
            <Pencil className="edit_icon" />
          </DeleteAndEdit>
        </>
      )}
    </RatingContainer>
  )
}
