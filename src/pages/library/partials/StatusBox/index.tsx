import { BookProps } from '@/@types/book'
import {
  BookCover,
  BookContainer,
  LibraryContainerBox,
  ContainerWrapper,
  TagStatus,
  BookDetailsWrapper,
  EmptyBookCover,
  EmptyBooksContainer,
} from './styles'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { Plus } from 'phosphor-react'

interface StatusBoxProps {
  status: string
  books: BookProps[] | undefined
  className: string
  emptyBoxMessage?: string
}

export function StatusBox({
  status,
  books,
  className,
  emptyBoxMessage,
}: StatusBoxProps) {
  return (
    <LibraryContainerBox className={books?.length ? '' : 'empty'}>
      <TagStatus className={className}>
        <FontAwesomeIcon icon={faBookmark} />
        {status}
      </TagStatus>
      <ContainerWrapper className={books?.length ? '' : 'empty'}>
        {books && books.length > 0 ? (
          <>
            {books.map((book) => (
              <BookContainer key={book.id}>
                <BookCover src={book.coverUrl} />
                <BookDetailsWrapper>
                  <p>{book.name}</p>
                  <h2>{book.author}</h2>
                </BookDetailsWrapper>
              </BookContainer>
            ))}
            <BookContainer>
              <EmptyBookCover>
                <Plus />
              </EmptyBookCover>
            </BookContainer>
          </>
        ) : (
          <EmptyBooksContainer>
            <EmptyBookCover>
              <Plus />
            </EmptyBookCover>
            <p>{emptyBoxMessage ?? ''}</p>
          </EmptyBooksContainer>
        )}
      </ContainerWrapper>
    </LibraryContainerBox>
  )
}
