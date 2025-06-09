/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

import {
  BookCover,
  BookTitleAndAuthor,
  BookContentWrapper,
  BookCardBox,
  EditButton,
  BookCardWrapper,
  DividerLine,
  UserInfoWrapper,
  UserInfoText,
} from './styles'

import { BookProps } from '@/@types/book'

import { SubmitBookFormModal } from '@/pages/library/partials/SubmitBookFormModal'
import { Avatar } from '@/components/shared/Avatar'
import { getDateFormattedAndRelative } from '@/utils/timeFormatter'

interface Props {
  book: BookProps
  onClose?: () => void
  onUpdateBook: (book: BookProps) => void
  mutate: any
}

export function ReviewBookCard({ book, mutate, onUpdateBook }: Props) {
  const { dateFormatted, dateRelativeToNow, dateString } =
    getDateFormattedAndRelative(book.createdAt)

  const [isEditBookFormOpen, setIsEditBookFormOpen] = useState(false)

  return (
    <BookCardWrapper>
      <BookCardBox>
        <BookCover src={book.coverUrl} />
        <BookContentWrapper>
          <BookTitleAndAuthor>
            <h2>{book.name}</h2>
            <p>{book.author}</p>
          </BookTitleAndAuthor>
          <time title={dateFormatted} dateTime={dateString}>
            {dateRelativeToNow}
          </time>
        </BookContentWrapper>
      </BookCardBox>
      <DividerLine />
      <UserInfoWrapper>
        <Avatar variant="small" avatarUrl={book?.user?.avatarUrl} />
        <UserInfoText>
          <p>{`Submitted by:`}</p>
          <strong>{`${book?.user?.name}`}</strong>
        </UserInfoText>
      </UserInfoWrapper>
      <DividerLine />
      <Dialog.Root open={isEditBookFormOpen}>
        {isEditBookFormOpen && (
          <SubmitBookFormModal
            isEdit
            book={book}
            onUpdateBook={onUpdateBook}
            onClose={() => setIsEditBookFormOpen(false)}
            mutate={mutate}
          />
        )}
      </Dialog.Root>
      <EditButton onClick={() => setIsEditBookFormOpen(true)}>
        Review
      </EditButton>
    </BookCardWrapper>
  )
}
