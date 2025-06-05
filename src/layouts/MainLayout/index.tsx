import { ReactNode } from 'react'
import { NextSeo } from 'next-seo'
import { useScreenSize } from '@/hooks/useScreenSize'
import { useLoadingOnRouteChange } from '@/hooks/useLoadingOnRouteChange'
import { Sidebar } from '@/components/shared/Sidebar'
import { LateralMenu } from '@/components/shared/LateralMenu'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { MobileHeader } from '@/components/shared/MobileHeader'
import { BookProvider } from '@/contexts/BookContext'
import { BookProps } from '@/@types/book'
import {
  LayoutContainer,
  LayoutHeading,
  LayoutWrapper,
  TitleWrapper,
} from './styles'
import { SearchBar } from '@/components/shared/SearchBar'

type MainLayoutProps = {
  title: string
  selectedBook?: BookProps | null
  isLateralMenuOpen?: boolean
  children: ReactNode
  icon: ReactNode
  pageTitle: string
  hasSearchBar?: boolean
  search?: string
  variant?: 'primary' | 'secondary' | 'tertiary'
  setSearch?: (value: string) => void
  setCurrentPage?: (value: number) => void
  onUpdateBook?: (book: BookProps) => void
  onUpdateRating?: () => Promise<void>
  setIsLateralMenuOpen?: (value: boolean) => void
}

export function MainLayout({
  title,
  selectedBook,
  isLateralMenuOpen,
  children,
  pageTitle,
  icon,
  hasSearchBar = false,
  search,
  variant = 'primary',
  setCurrentPage,
  setSearch,
  onUpdateBook,
  onUpdateRating,
  setIsLateralMenuOpen,
}: MainLayoutProps) {
  const isRouteLoading = useLoadingOnRouteChange()

  const isSmallSize = useScreenSize(480)

  const isMediumSize = useScreenSize(768)

  if (isRouteLoading) return <LoadingPage />

  return (
    <>
      <NextSeo title={title} />
      <BookProvider
        bookId={selectedBook?.id}
        onUpdateBook={onUpdateBook}
        onUpdateRating={onUpdateRating}
      >
        {isLateralMenuOpen && selectedBook && (
          <LateralMenu onClose={() => setIsLateralMenuOpen?.(false)} />
        )}

        <LayoutWrapper variant={variant}>
          {isSmallSize || isMediumSize ? <MobileHeader /> : <Sidebar />}
          <LayoutContainer variant={variant}>
            <LayoutHeading>
              <TitleWrapper>
                {icon}
                <h2>{pageTitle}</h2>
              </TitleWrapper>

              {hasSearchBar && (
                <SearchBar
                  placeholder="Search for Author or Title"
                  search={search as string}
                  onChange={(e) => {
                    setCurrentPage?.(1)
                    setSearch?.(e.target.value)
                  }}
                  onClick={() => {
                    setCurrentPage?.(1)
                    setSearch?.('')
                  }}
                />
              )}
            </LayoutHeading>
            {children}
          </LayoutContainer>
        </LayoutWrapper>
      </BookProvider>
    </>
  )
}
