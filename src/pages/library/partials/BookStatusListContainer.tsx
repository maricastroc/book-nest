/* eslint-disable react-hooks/exhaustive-deps */
import { BookProps } from '@/@types/book'
import { BooksByStatusProps } from '@/@types/books-status'
import { BookStatusList } from './BookStatusList'
import { useAppContext } from '@/contexts/AppContext'
import { useEffect, useState } from 'react'
import { BooksGridByStatus } from './BooksGridByStatus'
import { UserProps } from '@/@types/user'
import { getBookStatusList } from '@/utils/getBookStatusList'
import useRequest from '@/hooks/useRequest'
import { SkeletonBookStatusList } from './SkeletonBookStatusList'
import { LateralMenu } from '@/components/features/books/LateralMenu'
import { getEmptyBoxMessage } from '@/utils/getEmptyBoxMessage'
import { BookProvider } from '@/contexts/BookContext'

interface BookStatusListContainerProps {
  userInfo: UserProps | null
  refreshKey: number
  onTriggerRefresh: () => void
  onStatsLoaded?: (stats: Record<string, number>) => void
}

export function BookStatusListContainer({
  userInfo,
  refreshKey,
  onTriggerRefresh,
  onStatsLoaded,
}: BookStatusListContainerProps) {
  const { loggedUser } = useAppContext()

  const isLoggedUser = loggedUser?.id.toString() === userInfo?.id.toString()

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)
  const [isLateralMenuOpen, setIsLateralMenuOpen] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState('')
  const [booksByStatus, setBooksByStatus] = useState<BooksByStatusProps>()
  const [selectedStatus, setSelectedStatus] = useState<
    'read' | 'reading' | 'wantToRead' | 'didNotFinish' | null
  >(null)

  const booksByStatusRequest = userInfo?.id
    ? {
        url: '/library/books_by_status',
        method: 'GET',
        params: { userId: userInfo.id },
      }
    : null

  const {
    data: booksByStatusData,
    mutate,
    isValidating: isValidatingBooksByStatusData,
  } = useRequest<{ booksByStatus: BooksByStatusProps }>(booksByStatusRequest, {
    revalidateOnFocus: false,
    revalidateIfStale: true,
    dedupingInterval: 20000,
    focusThrottleInterval: 30000,
    keepPreviousData: true,
  })

  useEffect(() => {
    if (booksByStatusData) {
      const bbs = booksByStatusData.booksByStatus
      setBooksByStatus(bbs)
      onStatsLoaded?.({
        read: bbs.read?.length ?? 0,
        reading: bbs.reading?.length ?? 0,
        wantToRead: bbs.wantToRead?.length ?? 0,
        didNotFinish: bbs.didNotFinish?.length ?? 0,
      })
    }
  }, [booksByStatusData])

  useEffect(() => {
    mutate()
  }, [refreshKey])

  return selectedStatus ? (
    <BooksGridByStatus
      setSelectedStatus={(value) => setSelectedStatus(value)}
      setSelectedLabel={(value) => setSelectedLabel(value as string)}
      selectedLabel={selectedLabel}
      selectedStatus={selectedStatus}
      userId={userInfo?.id as string}
      refreshKey={refreshKey}
      onTriggerRefresh={onTriggerRefresh}
    />
  ) : (
    <div className="w-full">
      {isLateralMenuOpen && !!selectedBook && (
        <BookProvider
          bookId={selectedBook.id}
          onUpdateBook={async () => {
            await mutate()
            onTriggerRefresh()
          }}
          onUpdateRating={async () => {
            await mutate()
            onTriggerRefresh()
          }}
        >
          <LateralMenu onClose={() => setIsLateralMenuOpen(false)} />
        </BookProvider>
      )}

      <div className="flex max-w-6xl flex-col">
        {isValidatingBooksByStatusData || !booksByStatusData
          ? Array.from({ length: 3 }, (_, index) => (
              <SkeletonBookStatusList key={index} />
            ))
          : getBookStatusList(booksByStatus).map(({ key, label, books }) => (
              <BookStatusList
                key={key}
                isLoggedUser={isLoggedUser}
                status={key}
                statusLabel={label}
                books={books}
                onSelect={(book) => {
                  setIsLateralMenuOpen(true)
                  setSelectedBook(book)
                }}
                emptyBoxMessage={getEmptyBoxMessage(key, userInfo, loggedUser)}
                onStatusClick={() => {
                  setSelectedStatus(key)
                  setSelectedLabel(label)
                }}
              />
            ))}
      </div>
    </div>
  )
}
