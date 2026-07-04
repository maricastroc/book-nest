/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { CategoryProps } from '@/@types/category'
import { MenuBookCard } from './partials/MenuBookCard'
import { ReviewWarningModal } from './partials/ReviewWarningModal'
import { SkeletonLateralMenu } from './partials/SkeletonLateralMenu'
import { SkeletonMenuBookCard } from './partials/SkeletonMenuBookCard'
import { SignInModal } from '@/components/features/auth/SignInModal'
import { RatingsSection } from './partials/RatingsSection'
import { useBookContext } from '@/contexts/BookContext'

interface LateralMenuProps {
  onClose: () => void
}

export function LateralMenu({ onClose }: LateralMenuProps) {
  const [isValidatingStatus, setIsValidatingStatus] = useState(false)
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const [isReviewWarningModalOpen, setIsReviewWarningModalOpen] =
    useState(false)

  const { bookData, status } = useBookContext()

  const isLoadingInitial =
    (bookData.book === null || bookData.book === undefined) &&
    bookData.isValidating

  return (
    <Dialog.Root
      open
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-9996 bg-black/70" />

        <Dialog.Content
          aria-describedby={undefined}
          className="bn-scope animate-slide-in-right lateral-menu-scroll h-app pt-lateral pb-safe-10 fixed right-0 top-0 z-9996 flex w-full max-w-full flex-col items-start justify-start overflow-y-auto overscroll-contain border-l border-line bg-s1 px-6 focus:outline-none sm:max-w-140 sm:px-12 md:max-w-166"
        >
          <Dialog.Title className="sr-only">
            {bookData.book?.name ?? 'Book details'}
          </Dialog.Title>

          <Dialog.Close asChild>
            <button
              aria-label="Close"
              className="bn-scope top-safe-panel fixed right-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-line bg-s2 transition-colors hover:border-line-strong sm:right-6 sm:h-9 sm:w-9"
            >
              <FontAwesomeIcon
                icon={faXmark}
                className="text-fg3"
                style={{ fontSize: 16 }}
              />
            </button>
          </Dialog.Close>

          {isLoadingInitial ? (
            <SkeletonLateralMenu />
          ) : (
            <>
              {isSignInModalOpen && (
                <Dialog.Root open={isSignInModalOpen}>
                  <SignInModal
                    context="review"
                    onClose={() => setIsSignInModalOpen(false)}
                  />
                </Dialog.Root>
              )}

              {isReviewWarningModalOpen && (
                <Dialog.Root open={isReviewWarningModalOpen}>
                  <ReviewWarningModal
                    onClose={() => setIsReviewWarningModalOpen(false)}
                  />
                </Dialog.Root>
              )}

              {isValidatingStatus || bookData.isValidating ? (
                <SkeletonMenuBookCard />
              ) : bookData.book ? (
                <MenuBookCard
                  key={bookData.book.id}
                  book={bookData.book}
                  setIsValidatingStatus={setIsValidatingStatus}
                  categories={bookData.book.categories as CategoryProps[]}
                  onUpdateStatus={status.update}
                />
              ) : null}

              <RatingsSection
                isValidatingStatus={isValidatingStatus}
                setIsSignInModalOpen={setIsSignInModalOpen}
                setIsReviewWarningModalOpen={setIsReviewWarningModalOpen}
              />
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
