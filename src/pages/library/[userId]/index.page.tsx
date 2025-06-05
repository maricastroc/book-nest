/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { Books } from 'phosphor-react'

import { UserLibraryContent, SubmittedBooksContainer } from './styles'

import { BookStatusListContainer } from '../partials/BookStatusListContainer'
import { SubmittedBooksSection } from '../partials/SubmittedBooksSection'

import { UserProps } from '@/@types/user'
import { useAppContext } from '@/contexts/AppContext'
import { MainLayout } from '@/layouts/MainLayout'

export default function Library() {
  const [userInfo, setUserInfo] = useState<UserProps | null>(null)

  const [refreshKey, setRefreshKey] = useState(0)

  const { loggedUser } = useAppContext()

  const isLoggedUser = loggedUser?.id === userInfo?.id

  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
  }, [])

  const router = useRouter()

  const userId = Array.isArray(router.query.userId)
    ? router.query.userId[0]
    : router.query.userId

  const libraryTitle = useMemo(() => {
    if (!userInfo) return 'Library'

    if (isLoggedUser) return 'My Library'

    return `${userInfo.name}'s Library`
  }, [userInfo, isLoggedUser, userInfo])

  return (
    <MainLayout
      title="Library | Book Nest"
      icon={<Books />}
      pageTitle={libraryTitle}
    >
      <UserLibraryContent>
        <BookStatusListContainer refreshKey={refreshKey} userInfo={userInfo} />
        <SubmittedBooksContainer>
          <SubmittedBooksSection
            userInfo={userInfo}
            setUserInfo={(value) => setUserInfo(value)}
            userId={userId}
            onTriggerRefresh={triggerRefresh}
          />
        </SubmittedBooksContainer>
      </UserLibraryContent>
    </MainLayout>
  )
}
