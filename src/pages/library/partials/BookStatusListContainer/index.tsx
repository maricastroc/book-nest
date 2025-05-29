import { BookProps } from '@/@types/book'
import { BookStatusListWrapper } from './styles'
import { BooksByStatusProps } from '@/@types/books-status'
import { BookStatusList } from '../BookStatusList'
import { useAppContext } from '@/contexts/AppContext'
import { UserInfo } from '../../[userId]/index.page'
import { useState } from 'react'
import { BooksGridByStatus } from '../BooksGridByStatus'

interface BookStatusListContainerProps {
  data: BooksByStatusProps | undefined | null
  userInfo: UserInfo | undefined
  onSelect: (book: BookProps) => void
}

export function BookStatusListContainer({
  data,
  userInfo,
  onSelect,
}: BookStatusListContainerProps) {
  const { loggedUser } = useAppContext()

  const isLoggedUser = loggedUser?.id.toString() === userInfo?.id.toString()

  const [selectedLabel, setSelectedLabel] = useState('')

  const [selectedStatus, setSelectedStatus] = useState<
    'read' | 'reading' | 'want_to_read' | 'did_not_finish' | null
  >(null)

  const getEmptyBoxMessage = (
    status: 'read' | 'reading' | 'want_to_read' | 'did_not_finish',
  ): string => {
    const userName = userInfo?.name?.split(' ')[0] || ''

    const messages = {
      read: isLoggedUser
        ? "This is where the books you've already read will be."
        : `This is where the books ${userName} already read will be.`,
      reading: isLoggedUser
        ? "This is where the books you're currently reading will be."
        : `This is where the books ${userName} is currently reading will be.`,
      want_to_read: isLoggedUser
        ? 'This is where the books you want to read will be.'
        : `This is where the books ${userName} want to read will be.`,
      did_not_finish: isLoggedUser
        ? "This is where the books you didn't finish will be."
        : `This is where the books ${userName} didn't finish will be.`,
    }
    return messages[status]
  }

  const bookStatusList: {
    key: 'read' | 'reading' | 'want_to_read' | 'did_not_finish'
    label: string
    books: BookProps[] | undefined
  }[] = [
    { key: 'read', label: "I've already read", books: data?.read },
    { key: 'reading', label: 'I am reading', books: data?.reading },
    { key: 'want_to_read', label: 'I want to read', books: data?.want_to_read },
    {
      key: 'did_not_finish',
      label: "I didn't finish",
      books: data?.did_not_finish,
    },
  ]

  return selectedStatus ? (
    <BooksGridByStatus
      setSelectedStatus={(value) => setSelectedStatus(value)}
      setSelectedLabel={(value) => setSelectedLabel(value as string)}
      selectedLabel={selectedLabel}
      selectedStatus={selectedStatus}
      userId={userInfo?.id}
    />
  ) : (
    <BookStatusListWrapper>
      {bookStatusList.map(({ key, label, books }) => (
        <BookStatusList
          key={key}
          isLoggedUser={isLoggedUser}
          className={key}
          status={key}
          statusLabel={label}
          books={books}
          onSelect={onSelect}
          emptyBoxMessage={getEmptyBoxMessage(key)}
          onStatusClick={() => {
            setSelectedStatus(key)
            setSelectedLabel(label)
          }}
        />
      ))}
    </BookStatusListWrapper>
  )
}
