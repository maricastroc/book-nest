import { Users as UsersIcon } from 'phosphor-react'
import {
  UsersPageWrapper,
  UsersPageContainer,
  UsersPageHeading,
  UsersContainer,
  UsersPageContent,
  HeadingTitle,
  TitleAndSearch,
} from './styles'
import { Sidebar } from '@/components/shared/Sidebar'
import { NextSeo } from 'next-seo'
import { CategoryProps } from '@/@types/category'
import { BookProps } from '@/@types/book'
import { useScreenSize } from '@/hooks/useScreenSize'
import { useLoadingOnRouteChange } from '@/hooks/useLoadingOnRouteChange'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { MobileHeader } from '@/components/shared/MobileHeader'
import { UserCard } from './partials/UserCard'
import { SkeletonUserCard } from './partials/SkeletonUserCard'
import useRequest from '@/hooks/useRequest'
import { UserProps } from 'next-auth'
import { useEffect, useRef, useState } from 'react'
import { Pagination } from '@/components/shared/Pagination'
import { EmptyContainer } from '@/components/shared/EmptyContainer'
import { SearchBar } from '@/components/shared/SearchBar'

export interface UsersProps {
  categories: CategoryProps[]
  books: BookProps[]
}

export default function Users() {
  const isRouteLoading = useLoadingOnRouteChange()

  const [search, setSearch] = useState('')

  const perPage = 18

  const [currentPage, setCurrentPage] = useState(1)

  const gridRef = useRef<HTMLDivElement>(null)

  const isSmallSize = useScreenSize(480)
  const isMediumSize = useScreenSize(768)

  const [searchTerm, setSearchTerm] = useState('')

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
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    },
  )

  const users = data?.users || []

  const totalPages = data?.pagination?.totalPages || 1

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(search)
      setCurrentPage(1)
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

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
                {isValidating ? (
                  Array.from({ length: 12 }).map((_, index) => (
                    <SkeletonUserCard key={index} />
                  ))
                ) : data?.users && data?.users?.length > 0 ? (
                  users.map((user) => <UserCard key={user.id} user={user} />)
                ) : (
                  <EmptyContainer content="users" />
                )}
              </UsersContainer>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
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
