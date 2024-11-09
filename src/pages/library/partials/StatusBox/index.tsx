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
} from './styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { Plus } from 'phosphor-react'
import { StarsRating } from '@/components/shared/StarsRating'
import { useRouter } from 'next/router'

interface StatusBoxProps {
  status: string
  statusLabel: string
  books: BookProps[] | undefined
  className: string
  emptyBoxMessage?: string
  onSelect: (book: BookProps) => void
}

export function StatusBox({
  status,
  statusLabel,
  books,
  className,
  emptyBoxMessage,
  onSelect,
}: StatusBoxProps) {
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

  return (
    <LibraryContainerBox className={isOverflowing ? '' : 'smaller'}>
      <TagStatus className={className}>
        <FontAwesomeIcon icon={faBookmark} />
        {statusLabel}
      </TagStatus>
      <ContainerWrapper
        ref={containerRef}
        className={books?.length ? '' : 'smaller'}
        style={{ paddingRight: isOverflowing ? '0' : '1.2rem' }}
      >
        {books && books.length > 0 ? (
          <>
            {books.map((book) => (
              <BookContainer key={book.id}>
                <BookCover src={book.coverUrl} onClick={() => onSelect(book)} />
                <BookDetailsWrapper>
                  <p>{book.name}</p>
                  <h2>{book.author}</h2>
                  {status === 'read' && (
                    <StarsRating
                      size={'smaller'}
                      rating={book?.userRating ?? 0}
                    />
                  )}
                </BookDetailsWrapper>
              </BookContainer>
            ))}
            <BookContainer>
              <EmptyBookCover onClick={() => router.push('/explore')}>
                <Plus />
              </EmptyBookCover>
            </BookContainer>
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
    </LibraryContainerBox>
  )
}
