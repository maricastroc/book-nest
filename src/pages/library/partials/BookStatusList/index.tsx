import { BookProps } from '@/@types/book'
import {
  BookCover,
  BookContainer,
  LibraryContainerBox,
  ContainerWrapper,
  BookDetailsWrapper,
  EmptyBookCover,
  EmptyBooksContainer,
  Header,
  ViewAllButton,
  TagContainer,
} from './styles'
import { CaretRight, Plus } from 'phosphor-react'
import { StarsRating } from '@/components/features/books/StarsRating'
import { useRouter } from 'next/router'
import { DID_NOT_FINISH_STATUS, READ_STATUS } from '@/utils/constants'
import { HorizontalScroll } from '@/components/shared/HorizontalScroll'
import { ReadingStatusTag } from '@/components/features/books/ReadingStatusTag'

interface BookStatusListProps {
  isLoggedUser: boolean
  status: 'read' | 'reading' | 'wantToRead' | 'didNotFinish' | null
  statusLabel: string
  books: BookProps[] | undefined
  emptyBoxMessage?: string
  onSelect: (book: BookProps) => void
  onStatusClick: () => void
}

export function BookStatusList({
  status,
  statusLabel,
  books,
  emptyBoxMessage,
  isLoggedUser,
  onStatusClick,
  onSelect,
}: BookStatusListProps) {
  const router = useRouter()

  return (
    <LibraryContainerBox>
      <Header>
        <TagContainer>
          <ReadingStatusTag readingStatus={status} type="relative" />
          {statusLabel}
        </TagContainer>
        <ViewAllButton onClick={onStatusClick}>
          View All
          <CaretRight />
        </ViewAllButton>
      </Header>

      <ContainerWrapper className={books?.length ? '' : 'smaller'}>
        {books && books.length > 0 ? (
          <HorizontalScroll scrollAmount={300}>
            {books.map((book) => (
              <BookContainer key={book.id}>
                <BookCover src={book.coverUrl} onClick={() => onSelect(book)} />
                <BookDetailsWrapper>
                  <p>{book.name}</p>
                  <h2>{book.author}</h2>
                  {(status === READ_STATUS ||
                    status === DID_NOT_FINISH_STATUS) && (
                    <StarsRating
                      size={'smaller'}
                      rating={book?.userRating ?? 0}
                    />
                  )}
                </BookDetailsWrapper>
              </BookContainer>
            ))}

            {isLoggedUser && (
              <BookContainer>
                <EmptyBookCover onClick={() => router.push('/explore')}>
                  <Plus />
                </EmptyBookCover>
              </BookContainer>
            )}
          </HorizontalScroll>
        ) : (
          <EmptyBooksContainer>
            <EmptyBookCover onClick={() => router.push('/explore')}>
              <Plus />
            </EmptyBookCover>
            <p>{emptyBoxMessage ?? ''}</p>
          </EmptyBooksContainer>
        )}
      </ContainerWrapper>
    </LibraryContainerBox>
  )
}
