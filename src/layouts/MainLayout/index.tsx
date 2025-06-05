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

type MainLayoutProps = {
  title: string
  selectedBook?: BookProps | null
  isLateralMenuOpen?: boolean
  children: ReactNode
  onUpdateBook?: (book: BookProps) => void
  onUpdateRating?: () => Promise<void>
  setIsLateralMenuOpen?: (value: boolean) => void
}

export function MainLayout({
  title,
  selectedBook,
  isLateralMenuOpen,
  children,
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

        {isSmallSize || isMediumSize ? <MobileHeader /> : <Sidebar />}
        {children}
      </BookProvider>
    </>
  )
}
