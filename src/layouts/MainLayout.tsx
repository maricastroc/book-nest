import { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { NextSeo } from 'next-seo'
import { useScreenSize } from '@/hooks/useScreenSize'
import { useLoadingOnRouteChange } from '@/hooks/useLoadingOnRouteChange'

import { LoadingPage } from '@/components/ui/LoadingPage'
import { MobileHeader } from '@/components/shared/MobileHeader'
import { BookProvider } from '@/contexts/BookContext'
import { BookProps } from '@/@types/book'
import { SearchBar } from '@/components/shared/SearchBar'
import { Sidebar } from '@/components/shared/Sidebar'

const LateralMenu = dynamic(
  () =>
    import('@/components/features/books/LateralMenu').then(
      (m) => m.LateralMenu,
    ),
  { ssr: false },
)

type MainLayoutProps = {
  title: string
  selectedBook?: BookProps | null
  isLateralMenuOpen?: boolean
  children: ReactNode
  icon?: ReactNode
  pageTitle: string
  hasSearchBar?: boolean
  search?: string
  variant?: 'primary' | 'secondary' | 'tertiary'
  headerAction?: ReactNode
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
  headerAction,
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

        <div className="bn-scope flex h-screen w-full overflow-hidden bg-bg">
          {isSmallSize || isMediumSize ? <MobileHeader /> : <Sidebar />}

          <div className="flex h-full min-w-0 flex-1 flex-col pl-0 pt-16 md:pl-62 md:pt-0">
            {pageTitle && (
              <div className="flex shrink-0 flex-col gap-3 px-6 pb-4 pt-8 sm:flex-row sm:items-center sm:justify-between md:px-7 md:pt-10">
                <div className="flex items-center gap-2.5">
                  <span className="text-ac [&_svg]:h-5 [&_svg]:w-5">
                    {icon}
                  </span>
                  <h2 className="text-[1.3rem] font-semibold text-fg sm:text-[1.4rem]">
                    {pageTitle}
                  </h2>
                </div>
                {headerAction && headerAction}
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
              </div>
            )}

            <div className="scroll-col min-h-0 flex-1">{children}</div>
          </div>
        </div>
      </BookProvider>
    </>
  )
}
