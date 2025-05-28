import { useEffect, useRef, useState } from 'react'
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
  CaretLeftIcon,
  CaretRightIcon,
  ScrollContainer,
  Header,
  ViewAllButton,
} from './styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { CaretLeft, CaretRight, Plus } from 'phosphor-react'
import { StarsRating } from '@/components/shared/StarsRating'
import { useRouter } from 'next/router'
import { DID_NOT_FINISH_STATUS, READ_STATUS } from '@/utils/constants'

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

  const [isOverflowing, setIsOverflowing] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        setIsOverflowing(
          containerRef.current.scrollWidth > containerRef.current.clientWidth,
        )
      }
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)

    return () => {
      window.removeEventListener('resize', checkOverflow)
    }
  }, [books])

  const handleScroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'right' ? 300 : -300
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      })
    }
  }

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

      <ScrollContainer>
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

        {isOverflowing && books && books.length > 0 && (
          <>
            <CaretLeftIcon onClick={() => handleScroll('left')}>
              <CaretLeft size={24} weight="bold" />
            </CaretLeftIcon>
            <CaretRightIcon onClick={() => handleScroll('right')}>
              <CaretRight size={24} weight="bold" />
            </CaretRightIcon>
          </>
        )}
      </ScrollContainer>
    </LibraryContainerBox>
  )
}
