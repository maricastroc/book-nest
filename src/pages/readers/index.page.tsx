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
import { MobileHeader } from '@/components/shared/MobileHeader'
import { Sidebar } from '@/components/shared/Sidebar'
import { NextSeo } from 'next-seo'
import { CategoryProps } from '@/@types/category'
import { BookProps } from '@/@types/book'
import { useScreenSize } from '@/utils/useScreenSize'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { useAppContext } from '@/contexts/AppContext'
import { TabletHeader } from '@/components/shared/TabletHeader'
import { MobileFooter } from '@/components/shared/MobileFooter'
import { UserCard } from './partials/UserCard'
import { SearchBar } from '@/styles/shared'
import { SkeletonUserCard } from './partials/SkeletonUserCard'

export interface UsersProps {
  categories: CategoryProps[]
  books: BookProps[]
}

export default function Users() {
  const isRouteLoading = useLoadingOnRouteChange()

  const { isValidatingUsers, search, handleSetSearch, users } = useAppContext()

  const isSmallSize = useScreenSize(480)
  const isMediumSize = useScreenSize(768)

  return (
    <>
      <NextSeo title="Readers | Book Wise" />
      {isRouteLoading ? (
        <LoadingPage />
      ) : (
        <UsersPageWrapper>
          {isSmallSize ? (
            <MobileHeader />
          ) : isMediumSize ? (
            <TabletHeader />
          ) : (
            <Sidebar />
          )}
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
                    onChange={(e) => handleSetSearch(e.target.value)}
                    spellCheck={false}
                  />
                  {search === '' ? (
                    <MagnifyingGlass />
                  ) : (
                    <X onClick={() => handleSetSearch('')} />
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
          {isSmallSize && <MobileFooter />}
        </UsersPageWrapper>
      )}
    </>
  )
}
