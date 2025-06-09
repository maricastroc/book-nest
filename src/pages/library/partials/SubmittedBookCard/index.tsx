/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { PencilSimple } from 'phosphor-react'

import {
  BookCover,
  BookTitleAndAuthor,
  BookContentWrapper,
  BookCardBox,
  FooterWrapper,
  EditButton,
} from './styles'

import { BookProps } from '@/@types/book'
import { useAppContext } from '@/contexts/AppContext'
import { SubmitBookFormModal } from '@/pages/library/partials/SubmitBookFormModal'

interface Props {
  book: BookProps
  onClose?: () => void
  onUpdateBook?: (book: BookProps) => void
  onSelect: () => void
}

export function SubmittedBookCard({ book, onUpdateBook, onSelect }: Props) {
  const { loggedUser } = useAppContext()

  const [isEditBookFormOpen, setIsEditBookFormOpen] = useState(false)

  return (
    <BookCardBox>
      <BookCover src={book.coverUrl} onClick={onSelect} />
      <BookContentWrapper>
        <BookTitleAndAuthor>
          <h2>{book.name}</h2>
          <p>{book.author}</p>
        </BookTitleAndAuthor>
        <FooterWrapper>
          {loggedUser?.role === 'ADMIN' && (
            <>
              <Dialog.Root open={isEditBookFormOpen}>
                {isEditBookFormOpen && (
                  <SubmitBookFormModal
                    isEdit
                    book={book}
                    onUpdateBook={onUpdateBook}
                    onClose={() => setIsEditBookFormOpen(false)}
                  />
                )}
              </Dialog.Root>
              <EditButton onClick={() => setIsEditBookFormOpen(true)}>
                <PencilSimple size={20} />
              </EditButton>
            </>
          )}
        </FooterWrapper>
      </BookContentWrapper>
    </BookCardBox>
  )
}
