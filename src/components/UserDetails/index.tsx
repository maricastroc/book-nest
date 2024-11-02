import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import {
  Container,
  EditUserBtn,
  ItemText,
  Separator,
  UserInfo,
  UserInfoContainer,
  UserInfoItem,
} from './styles'
import {
  BookOpen,
  BookmarkSimple,
  Books,
  PencilSimple,
  UserList,
} from 'phosphor-react'
import * as Dialog from '@radix-ui/react-dialog'
import { EditUserModal } from '../EditUserModal'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { UserProps } from '@/@types/user'
import { api } from '@/lib/axios'
import { handleAxiosError } from '@/utils/handleAxiosError'
import { RatingProps } from '@/@types/rating'
import { SkeletonUserDetails } from '../SkeletonUserDetails'
import { AVATAR_URL_DEFAULT } from '@/utils/constants'
import { Avatar } from '../Avatar'

interface UserDetailsProps {
  userId: string
}

interface UserDataProps {
  user: UserProps
  ratings: RatingProps[]
  ratedBooks: number
  readAuthors: number
  readPages: number
  mostReadCategory: string
}

export function UserDetails({ userId }: UserDetailsProps) {
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false)

  const [userData, setUserData] = useState<UserDataProps | null>(null)

  const [dateFormatted, setDateFormatted] = useState('')

  const [dateString, setDateString] = useState('')

  const [dateRelativeToNow, setDateRelativeToNow] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const session = useSession()

  useEffect(() => {
    setIsLoading(true)

    const loadUser = async () => {
      if (userId) {
        try {
          const response = await api.get(`/profile/${userId}`)
          if (response.data) {
            setUserData(response.data.profile)
          }
        } catch (error) {
          handleAxiosError(error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadUser()
  }, [userId, session?.data?.user])

  useEffect(() => {
    if (userData?.user.createdAt) {
      const { dateFormatted, dateRelativeToNow, dateString } =
        getDateFormattedAndRelative(userData?.user.createdAt)
      setDateFormatted(dateFormatted)
      setDateRelativeToNow(dateRelativeToNow)
      setDateString(dateString)
    }
  }, [userData?.user.createdAt])

  return (
    <Container>
      {isLoading ? (
        <SkeletonUserDetails />
      ) : (
        <>
          <UserInfo>
            <Avatar
              avatarUrl={userData?.user.avatarUrl ?? AVATAR_URL_DEFAULT}
              variant="large"
            />
            <h2>{userData?.user.name}</h2>
            <time title={dateFormatted} dateTime={dateString}>
              joined {dateRelativeToNow}
            </time>
          </UserInfo>
          {session.data?.user.id === userId && (
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <EditUserBtn
                  type="button"
                  onClick={() => setIsEditUserModalOpen(true)}
                >
                  <PencilSimple />
                  Edit Info
                </EditUserBtn>
              </Dialog.Trigger>
              {isEditUserModalOpen && (
                <EditUserModal
                  onClose={() => {
                    setIsEditUserModalOpen(false)
                  }}
                />
              )}
            </Dialog.Root>
          )}
          <Separator />
          <UserInfoContainer>
            <UserInfoItem>
              <BookOpen />
              <ItemText>
                <h2>{userData?.readPages}</h2>
                <p>Pages read</p>
              </ItemText>
            </UserInfoItem>
            <UserInfoItem>
              <Books />
              <ItemText>
                <h2>{userData?.ratings.length}</h2>
                <p>Rated books</p>
              </ItemText>
            </UserInfoItem>
            <UserInfoItem>
              <UserList />
              <ItemText>
                <h2>{userData?.readAuthors}</h2>
                <p>Authors read</p>
              </ItemText>
            </UserInfoItem>
            <UserInfoItem>
              <BookmarkSimple />
              <ItemText>
                <h2>{userData?.mostReadCategory}</h2>
                <p>Most read category</p>
              </ItemText>
            </UserInfoItem>
          </UserInfoContainer>
        </>
      )}
    </Container>
  )
}
