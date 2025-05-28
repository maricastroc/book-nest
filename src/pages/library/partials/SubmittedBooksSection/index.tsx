/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar } from '@/components/shared/Avatar'
import * as Dialog from '@radix-ui/react-dialog'
import {
  SkeletonContainer,
  SubmittedBooksContent,
  SubmittedBooksHeading,
  SubmittedBooksSectionWrapper,
  SubmittedBooksWrapper,
  UserProfileInfo,
} from './styles'
import { Plus } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { SubmitBookFormModal } from '../SubmitBookFormModal'
import { SkeletonBookCard } from '@/components/skeletons/SkeletonBookCard'
import { BookProps } from '@/@types/book'
import { SkeletonUserDetails } from '../SkeletonUserDetails'
import { useRouter } from 'next/router'
import { EmptyContainer } from '@/components/shared/EmptyContainer'
import { Button } from '@/components/core/Button'
import { UserProps } from '@/@types/user'
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { DividerLine } from '@/components/shared/DividerLine'
import { OutlineButton } from '@/components/core/OutlineButton'
import { SubmittedBookCard } from '../../SubmittedBookCard'

interface SubmittedBooksSectionProps {
  onUpdateBook: (book: BookProps) => void
  userId: string | undefined
  userInfo: UserProps | undefined
  submittedBooks: BookProps[] | undefined
  isValidating: boolean
}

export function SubmittedBooksSection({
  onUpdateBook,
  isValidating,
  userId,
  userInfo,
  submittedBooks,
}: SubmittedBooksSectionProps) {
  const router = useRouter()

  const [isSubmitBookFormOpen, setIsSubmitBookFormOpen] = useState(false)

  const [dateInfo, setDateInfo] = useState({
    dateFormatted: '',
    dateRelativeToNow: '',
    dateString: '',
  })

  const [updatedSubmittedBooks, setUpdatedSubmittedBooks] = useState<
    BookProps[] | null
  >([])

  useEffect(() => {
    if (submittedBooks) {
      setUpdatedSubmittedBooks(submittedBooks)
    }
  }, [submittedBooks])

  useEffect(() => {
    if (userInfo && userInfo?.createdAt) {
      const formattedUserCreatedAt = new Date(userInfo?.createdAt as string)
      const dateFormattedData = getDateFormattedAndRelative(
        formattedUserCreatedAt,
      )

      setDateInfo(dateFormattedData)
    }
  }, [userInfo])

  return (
    <SubmittedBooksSectionWrapper>
      {isValidating ? (
        <SkeletonContainer>
          <SkeletonUserDetails />
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBookCard key={index} />
          ))}
        </SkeletonContainer>
      ) : (
        <>
          <UserProfileInfo>
            <>
              <Avatar avatarUrl={userInfo?.avatarUrl} variant="large" />
              <h2>{userInfo?.name}</h2>
              <time
                title={dateInfo.dateFormatted}
                dateTime={dateInfo.dateString}
              >
                joined {dateInfo.dateRelativeToNow}
              </time>
            </>
            <Button
              isSmaller
              content="View Profile"
              onClick={() => router.push(`/profile/${userId}`)}
              style={{ marginTop: '1rem' }}
            />
            <DividerLine />
          </UserProfileInfo>
          <SubmittedBooksWrapper>
            {isSubmitBookFormOpen && (
              <Dialog.Root open={isSubmitBookFormOpen}>
                <SubmitBookFormModal
                  onUpdateBook={onUpdateBook}
                  onClose={() => setIsSubmitBookFormOpen(false)}
                />
              </Dialog.Root>
            )}
            <SubmittedBooksHeading>
              <p>Submitted Books</p>
              <OutlineButton onClick={() => setIsSubmitBookFormOpen(true)}>
                Add
                <Plus />
              </OutlineButton>
            </SubmittedBooksHeading>
            <SubmittedBooksContent>
              {isValidating ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonBookCard key={index} />
                ))
              ) : updatedSubmittedBooks && updatedSubmittedBooks.length ? (
                <>
                  {updatedSubmittedBooks.map((book) => (
                    <SubmittedBookCard
                      key={book.id}
                      userId={userId}
                      book={book}
                      onUpdateBook={onUpdateBook}
                      onClose={() => setIsSubmitBookFormOpen(false)}
                    />
                  ))}
                </>
              ) : (
                <EmptyContainer content="submitted" />
              )}
            </SubmittedBooksContent>
          </SubmittedBooksWrapper>
        </>
      )}
    </SubmittedBooksSectionWrapper>
  )
}
