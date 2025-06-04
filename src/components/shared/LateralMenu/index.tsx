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

  const { loadingState, onUpdateStatus, updatedBook } = useBookContext()

  return (
    <LateralMenuWrapper>
      <OverlayBackground onClick={onClose} />

      <CloseButton onClick={onClose}>
        <X />
      </CloseButton>

      <MenuBody>
        {loadingState?.initial ? (
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
            ) : updatedBook ? (
              <MenuBookCard
                key={updatedBook.id}
                book={updatedBook}
                setIsValidatingStatus={(value) => setIsValidatingStatus(value)}
                categories={updatedBook.categories as CategoryProps[]}
                onUpdateStatus={onUpdateStatus}
              />
            ) : null}

            <RatingsSection
              isValidatingStatus={isValidatingStatus}
              setIsSignInModalOpen={(value) => setIsSignInModalOpen(value)}
              setIsReviewWarningModalOpen={(value) =>
                setIsReviewWarningModalOpen(value)
              }
            />
          </>
        )}
      </MenuBody>
    </LateralMenuWrapper>
  )
}
