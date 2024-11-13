/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar } from '@/components/shared/Avatar'
import { useAppContext } from '@/contexts/AppContext'
import { AVATAR_URL_DEFAULT } from '@/utils/constants'
import * as Dialog from '@radix-ui/react-dialog'
import {
  DividerLine,
  EditProfileButton,
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

interface SubmittedBooksSectionProps {
  onOpenDetails: (book: BookProps) => void
  userId: string | undefined
  userInfo: UserInfo | undefined
}

export function SubmittedBooksSection({
  userId,
  onOpenDetails,
  userInfo,
}: SubmittedBooksSectionProps) {
  const {
    loggedUser,
    isValidating,
    categories,
    handleFetchUserSubmittedBooks,
  } = useAppContext()

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)

  const [isSubmitBookFormOpen, setIsSubmitBookFormOpen] = useState(false)

  const [submittedBooks, setSubmittedBooks] = useState<
    BookProps[] | undefined
  >()

  const isLoggedUser = loggedUser?.id.toString() === userInfo?.id.toString()

  const loadUserSubmittedBooks = async () => {
    const data = await handleFetchUserSubmittedBooks(userId)

    setSubmittedBooks(data)
  }

  useEffect(() => {
    if (userId) {
      loadUserSubmittedBooks()
    }
  }, [userId])

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
            {isLoggedUser && (
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <EditProfileButton
                    type="button"
                    onClick={() => setIsEditProfileModalOpen(true)}
                  >
                    <PencilSimple />
                    Edit Info
                  </EditProfileButton>
                </Dialog.Trigger>
                {isEditProfileModalOpen && (
                  <EditProfileModal
                    onClose={() => setIsEditProfileModalOpen(false)}
                  />
                )}
              </Dialog.Root>
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
            ) : submittedBooks && submittedBooks.length ? (
              <>
                {submittedBooks.map((book) => (
                  <BookCard
                    size="smaller"
                    key={book.id}
                    book={book}
                    onOpenDetails={() => {
                      onOpenDetails(book)
                    }}
                  />
                ))}
                <Dialog.Root open={isSubmitBookFormOpen}>
                  <Dialog.Trigger asChild>
                    <EmptyBooksContainer
                      className={`variant ${!isLoggedUser && 'disabled'}`}
                      onClick={
                        isLoggedUser
                          ? () => setIsSubmitBookFormOpen(true)
                          : () => null
                      }
                    >
                      <Plus />
                    </EmptyBooksContainer>
                  </Dialog.Trigger>
                  {categories && (
                    <SubmitBookFormModal
                      categories={categories}
                      onCloseWithoutUpdate={() =>
                        setIsSubmitBookFormOpen(false)
                      }
                      onClose={async () => {
                        await loadUserSubmittedBooks()
                        setIsSubmitBookFormOpen(false)
                      }}
                    />
                  )}
                </Dialog.Root>
              </>
            ) : (
              <Dialog.Root open={isSubmitBookFormOpen}>
                <Dialog.Trigger asChild>
                  <EmptyBooksContainer
                    className={`${!isLoggedUser && 'disabled'}`}
                    onClick={
                      isLoggedUser
                        ? () => setIsSubmitBookFormOpen(true)
                        : () => null
                    }
                  >
                    <Plus />
                  </EmptyBooksContainer>
                </Dialog.Trigger>
                {categories && (
                  <SubmitBookFormModal
                    categories={categories}
                    onCloseWithoutUpdate={() => setIsSubmitBookFormOpen(false)}
                    onClose={async () => {
                      await loadUserSubmittedBooks()
                      setIsSubmitBookFormOpen(false)
                    }}
                  />
                )}
              </Dialog.Root>
            )}
          </SubmittedBooksWrapper>
        </>
      )}
    </SubmittedBooksSectionWrapper>
  )
}
