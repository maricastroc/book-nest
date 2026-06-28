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
    <section className="fixed right-0 top-0 z-9996 flex h-full w-full max-w-full justify-end overflow-scroll sm:max-w-140 md:max-w-166">
      <div
        className="fixed inset-0 h-full w-screen bg-black/70"
        onClick={onClose}
      />

      <button
        onClick={onClose}
        className="bn-scope absolute left-[92%] top-[6%] z-10 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg border border-line bg-s2 p-1.5 transition-colors hover:border-line-strong"
      >
        <FontAwesomeIcon
          icon={faXmark}
          className="text-fg3"
          style={{ fontSize: 16 }}
        />
      </button>

      <div className="bn-scope animate-slide-in-right lateral-menu-scroll relative flex h-full w-full flex-col items-start justify-start overflow-scroll border-l border-line bg-s1 px-6 pb-10 pt-8 sm:px-12 sm:pt-18">
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
      </div>
    </section>
  )
}
