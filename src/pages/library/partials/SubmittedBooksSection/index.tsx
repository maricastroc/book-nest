/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar } from '@/components/shared/Avatar'
import { useAppContext } from '@/contexts/AppContext'
import { AVATAR_URL_DEFAULT } from '@/utils/constants'
import * as Dialog from '@radix-ui/react-dialog'
import {
  EmptyBooksContainer,
  SkeletonContainer,
  SubmittedBooksHeading,
  SubmittedBooksSectionWrapper,
  SubmittedBooksWrapper,
  UserProfileInfo,
} from './styles'
import { PencilSimple, Plus } from 'phosphor-react'
import { EditProfileModal } from '@/components/modals/EditProfileModal'
import { useEffect, useState } from 'react'
import { SubmitBookFormModal } from '../SubmitBookFormModal'
import { SkeletonBookCard } from '@/components/skeletons/SkeletonBookCard'
import { BookCard } from '@/components/cards/BookCard'
import { BookProps } from '@/@types/book'
import { UserInfo } from '../../[userId]/index.page'
import { SkeletonUserDetails } from '../SkeletonUserDetails'
import { ActionButton, DividerLine } from '@/styles/shared'
import { useRouter } from 'next/router'
import { EmptyContainer } from '@/components/shared/EmptyContainer'

interface SubmittedBooksSectionProps {
  onOpenDetails: (book: BookProps) => void
  userId: string | undefined
  userInfo: UserInfo | undefined
  submittedBooks: BookProps[] | undefined
  isValidating: boolean
}

export function SubmittedBooksSection({
  onOpenDetails,
  isValidating,
  userId,
  userInfo,
  submittedBooks,
}: SubmittedBooksSectionProps) {
  const router = useRouter()

  const { loggedUser } = useAppContext()

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)

  const [isSubmitBookFormOpen, setIsSubmitBookFormOpen] = useState(false)

  const [updatedSubmittedBooks, setUpdatedSubmittedBooks] = useState<
    BookProps[] | null
  >([])

  const isLoggedUser = loggedUser?.id.toString() === userInfo?.id.toString()

  const onUpdateBook = (updatedBook: BookProps) => {
    setUpdatedSubmittedBooks((prevBooks) => {
      if (!prevBooks) return prevBooks

      return prevBooks.map((book) =>
        book.id === updatedBook.id
          ? {
              ...book,
              coverUrl: updatedBook.coverUrl,
              name: updatedBook.name,
              author: updatedBook.author,
            }
          : book,
      )
    })
  }

  const onCreateBook = (createdBook: BookProps) => {
    setUpdatedSubmittedBooks((prevBooks) => {
      if (!prevBooks) return [createdBook]

      return [...prevBooks, createdBook]
    })
  }

  useEffect(() => {
    if (submittedBooks) {
      setUpdatedSubmittedBooks(submittedBooks)
    }
  }, [submittedBooks])

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
              <Avatar
                avatarUrl={userInfo?.avatarUrl ?? AVATAR_URL_DEFAULT}
                variant="large"
              />
              <h2>{userInfo?.name}</h2>
            </>
            {isLoggedUser ? (
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <ActionButton
                    type="button"
                    onClick={() => setIsEditProfileModalOpen(true)}
                  >
                    <PencilSimple />
                    Edit Info
                  </ActionButton>
                </Dialog.Trigger>
                {isEditProfileModalOpen && (
                  <EditProfileModal
                    onClose={() => setIsEditProfileModalOpen(false)}
                  />
                )}
              </Dialog.Root>
            ) : (
              <ActionButton
                onClick={() => router.push(`/profile/${userId}`)}
              >{`View ${
                userInfo?.name?.split(' ')[0]
              }'s Profile`}</ActionButton>
            )}
            <DividerLine />
          </UserProfileInfo>
          <SubmittedBooksWrapper>
            <SubmittedBooksHeading>
              <p>{`${
                isLoggedUser
                  ? 'Your Submitted Books'
                  : `${userInfo?.name?.split(' ')[0]}'s Submitted Books`
              }`}</p>
            </SubmittedBooksHeading>
            {isValidating ? (
              Array.from({ length: 4 }).map((_, index) => (
                <SkeletonBookCard key={index} />
              ))
            ) : updatedSubmittedBooks && updatedSubmittedBooks.length ? (
              <>
                {updatedSubmittedBooks.map((book) => (
                  <BookCard
                    isLibraryPage
                    libraryPageUserId={userId}
                    size="smaller"
                    key={book.id}
                    book={book}
                    onUpdateBook={onUpdateBook}
                    onOpenDetails={() => {
                      onOpenDetails(book)
                    }}
                    onClose={() => setIsSubmitBookFormOpen(false)}
                  />
                ))}
                {isLoggedUser && (
                  <Dialog.Root open={isSubmitBookFormOpen}>
                    <Dialog.Trigger asChild>
                      <EmptyBooksContainer
                        className={`variant ${!isLoggedUser && 'disabled'}`}
                        onClick={() => setIsSubmitBookFormOpen(true)}
                      >
                        <Plus />
                      </EmptyBooksContainer>
                    </Dialog.Trigger>
                    <SubmitBookFormModal
                      onUpdateBook={onUpdateBook}
                      onCreateBook={onCreateBook}
                      onClose={() => setIsSubmitBookFormOpen(false)}
                    />
                  </Dialog.Root>
                )}
              </>
            ) : isLoggedUser ? (
              <Dialog.Root open={isSubmitBookFormOpen}>
                <Dialog.Trigger asChild>
                  <EmptyBooksContainer
                    onClick={
                      isLoggedUser
                        ? () => setIsSubmitBookFormOpen(true)
                        : () => null
                    }
                  >
                    <Plus />
                  </EmptyBooksContainer>
                </Dialog.Trigger>
                <SubmitBookFormModal
                  onUpdateBook={onUpdateBook}
                  onClose={() => setIsSubmitBookFormOpen(false)}
                />
              </Dialog.Root>
            ) : (
              <EmptyContainer content="submitted" />
            )}
          </SubmittedBooksWrapper>
        </>
      )}
    </SubmittedBooksSectionWrapper>
  )
}
