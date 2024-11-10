import { BookProps } from '@/@types/book'

import { BookStatusListWrapper } from './styles'

import { BooksStatusProps } from '@/@types/books-status'
import { BookStatusList } from '../BookStatusList'

interface BookStatusListContainerProps {
  data: BooksStatusProps | undefined | null
  onSelect: (book: BookProps) => void
}

export function BookStatusListContainer({
  data,
  onSelect,
}: BookStatusListContainerProps) {
  return (
    <BookStatusListWrapper>
      <BookStatusList
        className="read"
        status="read"
        statusLabel="I've already read"
        books={data?.read}
        onSelect={onSelect}
        emptyBoxMessage="This is where the books you've already read will be."
      />
      <BookStatusList
        className="reading"
        status="reading"
        statusLabel="I am reading"
        books={data?.reading}
        onSelect={onSelect}
        emptyBoxMessage="This is where the books you're currently reading will be."
      />
      <BookStatusList
        className="want_to_read"
        status="want_to_read"
        statusLabel="I want to read"
        books={data?.want_to_read}
        onSelect={onSelect}
        emptyBoxMessage="This is where the books you want to read will be."
      />
      <BookStatusList
        className="did_not_finish"
        status="did_not_finish"
        statusLabel="I didn't finish"
        books={data?.did_not_finish}
        onSelect={onSelect}
        emptyBoxMessage="This is where the books you didn't finish will be."
      />
    </BookStatusListWrapper>
  )
}
