import { BookProps } from '@/@types/book'

type BookStatusKey = 'read' | 'reading' | 'wantToRead' | 'didNotFinish'

type BookStatusListItem = {
  key: BookStatusKey
  label: string
  books: BookProps[] | undefined
}

type BookStatusData = Partial<Record<BookStatusKey, BookProps[]>>

export function getBookStatusList(
  data: BookStatusData | null | undefined,
): BookStatusListItem[] {
  return [
    { key: 'read', label: 'Finished', books: data?.read },
    { key: 'reading', label: 'In Progress', books: data?.reading },
    { key: 'wantToRead', label: 'To Read', books: data?.wantToRead },
    { key: 'didNotFinish', label: 'Abandoned', books: data?.didNotFinish },
  ]
}
