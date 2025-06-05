/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'phosphor-react'

import { CategoryProps } from '@/@types/category'

import {
  CloseButton,
  LateralMenuWrapper,
  OverlayBackground,
  MenuBody,
} from './styles'

import { MenuBookCard } from './partials/MenuBookCard'
import { ReviewWarningModal } from './partials/ReviewWarningModal'
import { SkeletonLateralMenu } from './partials/SkeletonLateralMenu'
import { SkeletonMenuBookCard } from './partials/SkeletonMenuBookCard'

import { SignInModal } from '@/components/modals/SignInModal'
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
    <LateralMenuWrapper>
      <OverlayBackground onClick={onClose} />
      <CloseButton onClick={onClose}>
        <X />
      </CloseButton>

      <MenuBody>
        {isLoadingInitial ? (
          <SkeletonLateralMenu />
        ) : (
          <>
            {isSignInModalOpen && (
              <Dialog.Root open={isSignInModalOpen}>
                <SignInModal onClose={() => setIsSignInModalOpen(false)} />
              </Dialog.Root>
            )}

            {isReviewWarningModalOpen && (
              <Dialog.Root open={isReviewWarningModalOpen}>
                <ReviewWarningModal
                  onClose={() => setIsReviewWarningModalOpen(false)}
                />
              </Dialog.Root>
            )}

            {isValidatingStatus ? (
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
      </MenuBody>
    </LateralMenuWrapper>
  )
}
