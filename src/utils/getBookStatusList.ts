import { BookProps } from '@/@types/book'

type BookStatusKey = 'read' | 'reading' | 'want_to_read' | 'did_not_finish'

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
    { key: 'want_to_read', label: 'I want to read', books: data?.want_to_read },
    {
      key: 'did_not_finish',
      label: "I didn't finish",
      books: data?.did_not_finish,
    },
  ]
}
