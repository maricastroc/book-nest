/* eslint-disable react-hooks/exhaustive-deps */
import { NextSeo } from 'next-seo'

import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { Books } from 'phosphor-react'

import {
  UserLibraryContent,
  UserLibraryHeading,
  UserLibraryHeadingTitle,
  UserLibraryBody,
  UserLibraryPageWrapper,
  SubmittedBooksContainer,
} from './styles'

import { Sidebar } from '@/components/shared/Sidebar'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { MobileHeader } from '@/components/shared/MobileHeader'
import { BookStatusListContainer } from '../partials/BookStatusListContainer'
import { SubmittedBooksSection } from '../partials/SubmittedBooksSection'

import { useLoadingOnRouteChange } from '@/hooks/useLoadingOnRouteChange'
import { useScreenSize } from '@/hooks/useScreenSize'
import { UserProps } from '@/@types/user'
import { useAppContext } from '@/contexts/AppContext'

export default function Library() {
  const isRouteLoading = useLoadingOnRouteChange()

  const [userInfo, setUserInfo] = useState<UserProps | null>(null)

  const { loggedUser } = useAppContext()

  const isLoggedUser = loggedUser?.id === userInfo?.id

  const [refreshKey, setRefreshKey] = useState(0)

  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
  }, [])

  const router = useRouter()

  const userId = Array.isArray(router.query.userId)
    ? router.query.userId[0]
    : router.query.userId

  const isSmallSize = useScreenSize(480)
  const isMediumSize = useScreenSize(768)

  const libraryTitle = useMemo(() => {
    if (!userInfo) return 'Library'

    if (isLoggedUser) return 'My Library'

    return `${userInfo.name}'s Library`
  }, [userInfo, isLoggedUser, userInfo])

  return (
    <>
      <NextSeo
        title="Library | Book Wise"
        additionalMetaTags={[
          {
            name: 'viewport',
            content:
              'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
          },
        ]}
      />
      {isRouteLoading ? (
        <LoadingPage />
      ) : (
        <UserLibraryPageWrapper>
          {isSmallSize || isMediumSize ? <MobileHeader /> : <Sidebar />}
          <UserLibraryBody>
            <UserLibraryHeading>
              <UserLibraryHeadingTitle>
                <Books />
                <h2>{libraryTitle}</h2>
              </UserLibraryHeadingTitle>
            </UserLibraryHeading>

            <UserLibraryContent>
              <BookStatusListContainer
                refreshKey={refreshKey}
                userInfo={userInfo}
              />
              <SubmittedBooksContainer>
                <SubmittedBooksSection
                  userInfo={userInfo}
                  setUserInfo={(value) => setUserInfo(value)}
                  userId={userId}
                  onUpdateBook={triggerRefresh}
                />
              </SubmittedBooksContainer>
            </UserLibraryContent>
          </UserLibraryBody>
        </UserLibraryPageWrapper>
      )}
    </>
  )
}
