import { StatusBox } from '../StatusBox'
import { StatusBoxesContainer } from './styles'

import { BooksStatusProps } from '@/@types/books-status'

interface StatusBoxesProps {
  data: BooksStatusProps | undefined | null
}

export function StatusBoxes({ data }: StatusBoxesProps) {
  return (
    <StatusBoxesContainer>
      <StatusBox
        className="read"
        status="I've already read"
        books={data?.read}
        emptyBoxMessage="This is where the books you've already read will be."
      />
      <StatusBox
        className="reading"
        status="I am reading"
        books={data?.reading}
        emptyBoxMessage="This is where the books you're currently reading will be."
      />
      <StatusBox
        className="want_to_read"
        status="I want to read"
        books={data?.want_to_read}
        emptyBoxMessage="This is where the books you want to read will be."
      />
      <StatusBox
        className="did_not_finish"
        status="I didn't finish"
        books={data?.did_not_finish}
        emptyBoxMessage="This is where the books you didn't finish will be."
      />
    </StatusBoxesContainer>
  )
}
