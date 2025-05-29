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

import { SubmitBookFormModal } from '../SubmitBookFormModal'
import { Avatar } from '@/components/shared/Avatar'
import { SkeletonBookCard } from '@/components/skeletons/SkeletonBookCard'
import { ScrollableSection } from '@/components/shared/ScrollableSection'
import { EmptyContainer } from '@/components/shared/EmptyContainer'
import { SkeletonUserDetails } from '../SkeletonUserDetails'
import { Button } from '@/components/core/Button'
import { DividerLine } from '@/components/shared/DividerLine'
import { OutlineButton } from '@/components/core/OutlineButton'
import { SubmittedBookCard } from '../SubmittedBookCard'

import { getDateFormattedAndRelative } from '@/utils/timeFormatter'
import { BookProps } from '@/@types/book'
import { UserProps } from '@/@types/user'
import useRequest from '@/hooks/useRequest'
import { useScreenSize } from '@/hooks/useScreenSize'
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll'
import { SkeletonBookStatusList } from '../SkeletonBookStatusList'

interface SubmittedBooksSectionProps {
  userId: string | undefined
  userInfo: UserProps | null
  setUserInfo: (user: UserProps | null) => void
}

export function SubmittedBooksSection({
  userId,
  userInfo,
  setUserInfo,
}: SubmittedBooksSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const router = useRouter()

  const [isSubmitBookFormOpen, setIsSubmitBookFormOpen] = useState(false)

  const [submittedBooks, setSubmittedBooks] = useState<BookProps[] | null>([])

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

    if (submittedBooks && submittedBooks?.length > 0) {
      return submittedBooks.map((book) => (
        <SubmittedBookCard
          key={book.id}
          userId={userId}
          book={book}
          onUpdateBook={() => mutate()}
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
                onUpdateBook={() => mutate()}
                onClose={() => setIsSubmitBookFormOpen(false)}
              />
            </Dialog.Root>

            <SubmittedBooksHeading>
              <p>Submitted Books</p>
              <OutlineButton
                onClick={() => setIsSubmitBookFormOpen(true)}
                disabled={isValidatingSubmittedBooksData}
              >
                Add
                <Plus />
              </OutlineButton>
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
