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
    { key: 'read', label: "I've already read", books: data?.read },
    { key: 'reading', label: 'I am reading', books: data?.reading },
    { key: 'wantToRead', label: 'I want to read', books: data?.wantToRead },
    {
      key: 'didNotFinish',
      label: "I didn't finish",
      books: data?.didNotFinish,
    },
  ]
}
