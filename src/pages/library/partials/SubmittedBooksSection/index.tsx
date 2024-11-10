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
import { SkeletonPopularBook } from '@/components/skeletons/SkeletonPopularBook'
import { PopularBookCard } from '@/components/cards/PopularBookCard'
import { BookProps } from '@/@types/book'

interface SubmittedBooksSectionProps {
  onOpenDetails: (book: BookProps) => void
}

export function SubmittedBooksSection({
  onOpenDetails,
}: SubmittedBooksSectionProps) {
  const { loggedUser } = useAppContext()

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)

  const [isSubmitBookFormOpen, setIsSubmitBookFormOpen] = useState(false)

  const { data: categories } = useRequest<CategoryProps[]>({
    url: '/categories',
    method: 'GET',
  })

  const {
    data: userBooks,
    isValidating: isValidatingUserBooks,
    mutate,
  } = useRequest<BookProps[]>({
    url: `/profile/books`,
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
        {isValidatingUserBooks ? (
          Array.from({ length: 4 }).map((_, index) => (
            <SkeletonPopularBook key={index} />
          ))
        ) : userBooks && userBooks.length ? (
          <>
            {userBooks.map((book) => (
              <PopularBookCard
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
