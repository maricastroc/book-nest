import { BookProps } from '@/@types/book'
import {
  BookCover,
  BookTitleAndAuthor,
  BookContentWrapper,
  BookCardBox,
} from './styles'
import { useAppContext } from '@/contexts/AppContext'
import { ReadNotice } from '@/components/shared/ReadNotice'
import { formatToSnakeCase } from '@/utils/formatToSnakeCase'

interface BookCardProps {
  isLibraryPage?: boolean
  isExplorePage?: boolean
  libraryPageUserId?: string | undefined
  book: BookProps
  onOpenDetails: () => void
  size?: string
  onClose?: () => void
  onUpdateBook?: (book: BookProps) => void
}

export function ExploreCard({
  book,
  onOpenDetails,
  libraryPageUserId,
  size = '',
  isLibraryPage = false,
  isExplorePage = false,
}: BookCardProps) {
  const { loggedUser } = useAppContext()

  return (
    <BookCardBox
      className={`${size} ${
        isLibraryPage ? 'library_style' : isExplorePage ? 'explore_style' : ''
      }`}
      onClick={() => {
        if (!isLibraryPage) {
          onOpenDetails()
        }
      }}
    >
      <BookCover
        className={`${size} ${
          isLibraryPage ? 'library_style' : isExplorePage ? 'explore_style' : ''
        }`}
        src={book.coverUrl}
        onClick={() => onOpenDetails()}
      />
      <BookContentWrapper>
        {isLibraryPage
          ? libraryPageUserId === loggedUser?.id &&
            book?.readingStatus && (
              <ReadNotice
                readingStatus={formatToSnakeCase(book.readingStatus)}
              />
            )
          : book?.readingStatus && (
              <ReadNotice
                readingStatus={formatToSnakeCase(book.readingStatus)}
              />
            )}
        <BookTitleAndAuthor className={size}>
          <h2>{book.name}</h2>
          <p>{book.author}</p>
        </BookTitleAndAuthor>
      </BookContentWrapper>
    </BookCardBox>
  )
}
