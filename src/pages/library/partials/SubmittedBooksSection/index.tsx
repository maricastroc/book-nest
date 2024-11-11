/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar } from '@/components/shared/Avatar'
import { useAppContext } from '@/contexts/AppContext'
import { AVATAR_URL_DEFAULT } from '@/utils/constants'
import * as Dialog from '@radix-ui/react-dialog'
import {
  DividerLine,
  EditProfileButton,
  EmptyBooksContainer,
  SubmittedBooksHeading,
  SubmittedBooksSectionWrapper,
  SubmittedBooksWrapper,
  UserProfileInfo,
} from './styles'
import { PencilSimple, Plus } from 'phosphor-react'
import { EditProfileModal } from '@/components/modals/EditProfileModal'
import { useState } from 'react'
import { SubmitBookFormModal } from '../SubmitBookFormModal'
import useRequest from '@/utils/useRequest'
import { CategoryProps } from '@/@types/category'
import { SkeletonBookCard } from '@/components/skeletons/SkeletonBookCard'
import { BookCard } from '@/components/cards/BookCard'
import { BookProps } from '@/@types/book'

interface SubmittedBooksSectionProps {
  onOpenDetails: (book: BookProps) => void
  userBooks: BookProps[] | undefined
  isValidating: boolean
  mutate: any
}

export function SubmittedBooksSection({
  onOpenDetails,
  userBooks,
  isValidating,
  mutate,
}: SubmittedBooksSectionProps) {
  const { loggedUser } = useAppContext()

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)

  const [isSubmitBookFormOpen, setIsSubmitBookFormOpen] = useState(false)

  const { data: categories } = useRequest<CategoryProps[]>({
    url: '/categories',
    method: 'GET',
  })

  return (
    <SubmittedBooksSectionWrapper>
      <UserProfileInfo>
        <Avatar
          avatarUrl={loggedUser?.avatarUrl ?? AVATAR_URL_DEFAULT}
          variant="large"
        />
        <h2>{loggedUser?.name}</h2>
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
      </UserProfileInfo>
      <DividerLine />
      <SubmittedBooksWrapper>
        <SubmittedBooksHeading>
          <p>Your Submitted Books</p>
        </SubmittedBooksHeading>
        {isValidating ? (
          Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBookCard key={index} />
          ))
        ) : userBooks && userBooks.length ? (
          <>
            {userBooks.map((book) => (
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
                  className="variant"
                  onClick={() => setIsSubmitBookFormOpen(true)}
                >
                  <Plus />
                </EmptyBooksContainer>
              </Dialog.Trigger>
              {categories && (
                <SubmitBookFormModal
                  categories={categories}
                  onClose={async () => {
                    setIsSubmitBookFormOpen(false)
                    await mutate()
                  }}
                />
              )}
            </Dialog.Root>
          </>
        ) : (
          <Dialog.Root open={isSubmitBookFormOpen}>
            <Dialog.Trigger asChild>
              <EmptyBooksContainer
                onClick={() => setIsSubmitBookFormOpen(true)}
              >
                <Plus />
              </EmptyBooksContainer>
            </Dialog.Trigger>
            {categories && (
              <SubmitBookFormModal
                categories={categories}
                onClose={async () => {
                  setIsSubmitBookFormOpen(false)
                  await mutate()
                }}
              />
            )}
          </Dialog.Root>
        )}
      </SubmittedBooksWrapper>
    </SubmittedBooksSectionWrapper>
  )
}
