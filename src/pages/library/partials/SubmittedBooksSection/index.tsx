/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import * as Dialog from '@radix-ui/react-dialog'
import { Plus } from 'phosphor-react'

import {
  SkeletonContainer,
  SubmittedBooksContent,
  SubmittedBooksHeading,
  SubmittedBooksSectionWrapper,
  SubmittedBooksWrapper,
  UserProfileInfo,
} from './styles'

import dynamic from 'next/dynamic'
import { Avatar } from '@/components/shared/Avatar'
import { SkeletonBookCard } from '@/components/skeletons/SkeletonBookCard'
import { ScrollableSection } from '@/components/shared/ScrollableSection'
import { EmptyContainer } from '@/components/shared/EmptyContainer'
import { SkeletonUserDetails } from '../SkeletonUserDetails'
import { Button } from '@/components/ui/Button'
import { DividerLine } from '@/components/ui/DividerLine'
import { OutlineButton } from '@/components/ui/OutlineButton'
import { SubmittedBookCard } from '../SubmittedBookCard'

import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { BookProps } from '@/@types/book'
import { UserProps } from '@/@types/user'
import useRequest from '@/hooks/useRequest'
import { useScreenSize } from '@/hooks/useScreenSize'
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll'
import { SkeletonBookStatusList } from '../SkeletonBookStatusList'
import { LateralMenu } from '@/components/features/books/LateralMenu'
import { BookProvider } from '@/contexts/BookContext'
import { useAppContext } from '@/contexts/AppContext'

const SubmitBookFormModal = dynamic(
  () => import('../SubmitBookFormModal').then((m) => m.SubmitBookFormModal),
  { ssr: false },
)

interface SubmittedBooksSectionProps {
  userId: string | undefined
  userInfo: UserProps | null
  setUserInfo: (user: UserProps | null) => void
  onTriggerRefresh: () => void
}

export function SubmittedBooksSection({
  userId,
  userInfo,
  setUserInfo,
  onTriggerRefresh,
}: SubmittedBooksSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const router = useRouter()

  const [isSubmitBookFormOpen, setIsSubmitBookFormOpen] = useState(false)

  const [submittedBooks, setSubmittedBooks] = useState<BookProps[] | null>([])

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const [isLateralMenuOpen, setIsLateralMenuOpen] = useState(false)

  const { loggedUser } = useAppContext()

  const [dateInfo, setDateInfo] = useState({
    dateFormatted: '',
    dateRelativeToNow: '',
    dateString: '',
  })

  const isMediumSize = useScreenSize(1200)

  const { handleScroll, isOverflowing } = useHorizontalScroll(containerRef)

  const submittedBooksRequest = userId
    ? {
        url: '/library/submitted_books',
        method: 'GET',
        params: { userId },
      }
    : null

  const {
    data: submittedBooksData,
    mutate,
    isValidating: isValidatingSubmittedBooksData,
    error: submittedBooksError,
  } = useRequest<{
    submittedBooks: BookProps[]
    user: UserProps
    pagination: {
      page: number
      perPage: number
      total: number
      totalPages: number
    }
  }>(submittedBooksRequest)

  const renderSubmittedBooks = () => {
    if (isValidatingSubmittedBooksData) {
      return !isMediumSize ? (
        Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBookCard key={index} />
        ))
      ) : (
        <SkeletonBookStatusList />
      )
    }

    if (submittedBooksError) {
      return <EmptyContainer content="submitted books" variant="error" />
    }

    if (submittedBooks && submittedBooks?.length > 0) {
      return submittedBooks.map((book) => (
        <SubmittedBookCard
          key={book.id}
          book={book}
          onUpdateBook={() => mutate()}
          onSelect={() => {
            setSelectedBook(book)
            setIsLateralMenuOpen(true)
          }}
          onClose={() => setIsSubmitBookFormOpen(false)}
        />
      ))
    }

    return <EmptyContainer content="submitted" />
  }

  useEffect(() => {
    if (submittedBooksData) {
      setSubmittedBooks(submittedBooksData.submittedBooks)
      setUserInfo(submittedBooksData.user)
    }
  }, [submittedBooksData])

  useEffect(() => {
    if (!userInfo?.createdAt) return

    const formattedUserCreatedAt = new Date(userInfo.createdAt)

    setDateInfo(getDateFormattedAndRelative(formattedUserCreatedAt))
  }, [userInfo])

  return (
    <SubmittedBooksSectionWrapper>
      {isLateralMenuOpen && !!selectedBook && (
        <BookProvider
          bookId={selectedBook.id}
          onUpdateBook={() => {
            onTriggerRefresh()
          }}
          onUpdateRating={async () => {
            onTriggerRefresh()
          }}
        >
          <LateralMenu
            onClose={() => {
              setIsLateralMenuOpen(false)
            }}
          />
        </BookProvider>
      )}

      {isValidatingSubmittedBooksData ? (
        <SkeletonContainer>
          <SkeletonUserDetails />

          {!isMediumSize ? (
            Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBookCard key={index} />
            ))
          ) : (
            <SkeletonBookStatusList />
          )}
        </SkeletonContainer>
      ) : (
        <>
          <UserProfileInfo>
            <Avatar avatarUrl={userInfo?.avatarUrl} variant="large" />
            <h2>{userInfo?.name}</h2>
            <time title={dateInfo.dateFormatted} dateTime={dateInfo.dateString}>
              joined {dateInfo.dateRelativeToNow}
            </time>
            <Button
              isSmaller
              content="View Profile"
              onClick={() => router.push(`/profile/${userId}`)}
              style={{ marginTop: '1rem' }}
            />
            <DividerLine />
          </UserProfileInfo>

          <SubmittedBooksWrapper>
            <Dialog.Root open={isSubmitBookFormOpen}>
              <SubmitBookFormModal
                onUpdateBook={async () => await mutate()}
                onClose={() => setIsSubmitBookFormOpen(false)}
              />
            </Dialog.Root>

            <SubmittedBooksHeading>
              <p>Submitted Books</p>
              {loggedUser?.id === userId && (
                <OutlineButton
                  onClick={() => setIsSubmitBookFormOpen(true)}
                  disabled={isValidatingSubmittedBooksData}
                >
                  Add
                  <Plus />
                </OutlineButton>
              )}
            </SubmittedBooksHeading>

            <ScrollableSection
              showIcons={
                isOverflowing &&
                isMediumSize &&
                !!submittedBooks &&
                submittedBooks.length > 0
              }
              handleScroll={handleScroll}
            >
              <SubmittedBooksContent ref={containerRef}>
                {renderSubmittedBooks()}
              </SubmittedBooksContent>
            </ScrollableSection>
          </SubmittedBooksWrapper>
        </>
      )}
    </SubmittedBooksSectionWrapper>
  )
}
