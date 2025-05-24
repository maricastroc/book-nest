import { Users as UsersIcon, MagnifyingGlass, X } from 'phosphor-react'
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
import { SearchBar } from '@/styles/shared'
import { SkeletonUserCard } from './partials/SkeletonUserCard'
import useRequest from '@/hooks/useRequest'
import { UserProps } from 'next-auth'
import { useState } from 'react'

export interface UsersProps {
  categories: CategoryProps[]
  books: BookProps[]
}

export default function Users() {
  const isRouteLoading = useLoadingOnRouteChange()

  const [search, setSearch] = useState('')

  const isSmallSize = useScreenSize(480)
  const isMediumSize = useScreenSize(768)

  const { data: users, isValidating: isValidatingUsers } = useRequest<
    UserProps[]
  >({
    url: '/user/search',
    method: 'GET',
    params: {
      search,
    },
  })

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
                <SearchBar>
                  <input
                    type="text"
                    placeholder="Search for reader's name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    spellCheck={false}
                  />
                  {search === '' ? (
                    <MagnifyingGlass />
                  ) : (
                    <X onClick={() => setSearch('')} />
                  )}
                </SearchBar>
              </TitleAndSearch>
            </UsersPageHeading>
            <UsersPageContent>
              <UsersContainer>
                {isValidatingUsers || !users?.length
                  ? Array.from({ length: 12 }).map((_, index) => (
                      <SkeletonUserCard key={index} />
                    ))
                  : users?.map((user) => (
                      <UserCard key={user.id} user={user} />
                    ))}
              </UsersContainer>
            </UsersPageContent>
          </UsersPageContainer>
        </UsersPageWrapper>
      )}
    </>
  )
}
