import { useEffect, useRef } from 'react'
import { NextSeo } from 'next-seo'
import { Users as UsersIcon } from 'phosphor-react'

import { CategoryProps } from '@/@types/category'
import { BookProps } from '@/@types/book'
import { UserProps } from 'next-auth'

import { useScreenSize } from '@/hooks/useScreenSize'
import { useLoadingOnRouteChange } from '@/hooks/useLoadingOnRouteChange'
import useRequest from '@/hooks/useRequest'
import { READERS_PER_PAGE } from '@/utils/constants'
import { usePaginationAndSearch } from '@/hooks/usePaginationAndSearchParams'

import { Sidebar } from '@/components/shared/Sidebar'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { MobileHeader } from '@/components/shared/MobileHeader'
import { Pagination } from '@/components/shared/Pagination'
import { EmptyContainer } from '@/components/shared/EmptyContainer'
import { SearchBar } from '@/components/shared/SearchBar'

import { UserCard } from './partials/UserCard'
import { SkeletonUserCard } from './partials/SkeletonUserCard'

import {
  UsersPageWrapper,
  UsersPageContainer,
  UsersPageHeading,
  UsersContainer,
  UsersPageContent,
  HeadingTitle,
  TitleAndSearch,
} from './styles'

export interface UsersProps {
  categories: CategoryProps[]
  books: BookProps[]
}

export default function Users() {
  const gridRef = useRef<HTMLDivElement>(null)

  const isSmallSize = useScreenSize(480)

  const isMediumSize = useScreenSize(768)

  const isRouteLoading = useLoadingOnRouteChange()

  const {
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    searchTerm,
    perPage,
  } = usePaginationAndSearch({ perPage: READERS_PER_PAGE })

  const { data, isValidating } = useRequest<{
    users: UserProps[]
    pagination: {
      page: number
      perPage: number
      total: number
      totalPages: number
    }
  }>(
    {
      url: '/user/search',
      method: 'GET',
      params: {
        search: searchTerm,
        page: currentPage,
        perPage,
      },
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    },
  )

  const users = data?.users || []

  const totalPages = data?.pagination?.totalPages || 1

  const renderUsers = () => {
    if (isValidating) {
      return Array.from({ length: 12 }).map((_, index) => (
        <SkeletonUserCard key={index} />
      ))
    }

    if (!users.length) {
      return <EmptyContainer content="users" />
    }

    return users.map((user) => <UserCard key={user.id} user={user} />)
  }

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentPage])

  return (
    <>
      <NextSeo title="Readers | Book Wise" />
      {isRouteLoading ? (
        <LoadingPage />
      ) : (
        <UsersPageWrapper>
          {isSmallSize || isMediumSize ? <MobileHeader /> : <Sidebar />}
          <UsersPageContainer>
            <UsersPageHeading>
              <TitleAndSearch>
                <HeadingTitle>
                  <UsersIcon />
                  <h2>Readers</h2>
                </HeadingTitle>
                <SearchBar
                  search={search}
                  onClick={() => {
                    setSearch('')
                    setCurrentPage(1)
                  }}
                  placeholder={`Search for reader's name`}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </TitleAndSearch>
            </UsersPageHeading>
            <UsersPageContent ref={gridRef}>
              <UsersContainer
                className={`${
                  !data?.users?.length && !isValidating ? 'empty' : ''
                }`}
              >
                {renderUsers()}
              </UsersContainer>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page)
                  }}
                />
              )}
            </UsersPageContent>
          </UsersPageContainer>
        </UsersPageWrapper>
      )}
    </>
  )
}
