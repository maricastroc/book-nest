import { useRef } from 'react'
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
import { StarsRating } from '@/components/shared/StarsRating'
import { useRouter } from 'next/router'
import { DID_NOT_FINISH_STATUS, READ_STATUS } from '@/utils/constants'
import { ScrollableSection } from '@/components/shared/ScrollableSection'
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll'
import { ReadingStatusTag } from '@/components/shared/ReadingStatusTag'

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
  const containerRef = useRef<HTMLDivElement>(null)

  const { handleScroll, isOverflowing } = useHorizontalScroll(containerRef)

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

      <ScrollableSection
        handleScroll={handleScroll}
        showIcons={isOverflowing && books && books.length > 0}
      >
        <ContainerWrapper
          ref={containerRef}
          className={books?.length ? '' : 'smaller'}
        >
          {books && books.length > 0 ? (
            <>
              {books.map((book) => (
                <BookContainer key={book.id}>
                  <BookCover
                    src={book.coverUrl}
                    onClick={() => onSelect(book)}
                  />
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
            </>
          ) : (
            <EmptyBooksContainer>
              <EmptyBookCover onClick={() => router.push('/explore')}>
                <Plus />
              </EmptyBookCover>
              <p>{emptyBoxMessage ?? ''}</p>
            </EmptyBooksContainer>
          )}
        </ContainerWrapper>
      </ScrollableSection>
    </LibraryContainerBox>
  )
}
