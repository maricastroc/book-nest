import { useRef } from 'react'
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
  Header,
  ViewAllButton,
} from './styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { CaretRight, Plus } from 'phosphor-react'
import { StarsRating } from '@/components/shared/StarsRating'
import { useRouter } from 'next/router'
import { DID_NOT_FINISH_STATUS, READ_STATUS } from '@/utils/constants'
import { ScrollableSection } from '@/components/shared/ScrollableSection'
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll'

interface BookStatusListProps {
  isLoggedUser: boolean
  status: string
  statusLabel: string
  books: BookProps[] | undefined
  className: string
  emptyBoxMessage?: string
  onSelect: (book: BookProps) => void
  onStatusClick: () => void
}

export function BookStatusList({
  status,
  statusLabel,
  books,
  className,
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
        <TagStatus className={className}>
          <FontAwesomeIcon icon={faBookmark} />
          {statusLabel}
        </TagStatus>
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
