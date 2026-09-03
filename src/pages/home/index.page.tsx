import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'

import { MainLayout } from '@/layouts/MainLayout'
import { useHomeData } from '@/hooks/useHomeData'

import { HomeHeader } from './partials/HomeHeader'
import { LastRatingSection } from './partials/LastRatingSection'
import { FeaturedSection } from './partials/FeaturedSection'
import { GuestSignInCallout } from './partials/GuestSignInCallout'
import { BookCarousel } from './partials/BookCarousel'
import { CommunityFeed } from './partials/CommunityFeed'
import { PopularRail } from './partials/PopularRail'

export default function Home() {
  const router = useRouter()
  const {
    userId,
    isGuest,
    firstName,
    selectedBook,
    isLateralMenuOpen,
    setIsLateralMenuOpen,
    openBook,
    onUpdatePopularBook,
    onUpdateRating,
    lastRating,
    featured,
    recommended,
    trending,
    community,
    popularBooks,
  } = useHomeData()

  const goToExplore = () => router.push('/explore')

  return (
    <MainLayout
      title="Home | Book Nest"
      icon={<FontAwesomeIcon icon={faChartLine} />}
      pageTitle=""
      variant="tertiary"
      selectedBook={selectedBook}
      isLateralMenuOpen={isLateralMenuOpen}
      setIsLateralMenuOpen={setIsLateralMenuOpen}
      onUpdateBook={onUpdatePopularBook}
      onUpdateRating={onUpdateRating}
    >
      <div className="bn-scope flex h-full flex-col pl-8 pr-6 md:pl-10 md:pr-8">
        <HomeHeader userId={userId} firstName={firstName} />

        <div className="flex min-h-0 flex-1 gap-8 pt-7">
          <div className="lateral-menu-scroll flex min-w-0 flex-1 flex-col gap-8 overflow-y-auto pb-7 pr-2">
            {userId && (
              <LastRatingSection
                rating={lastRating.data}
                isLoading={lastRating.isLoading}
                error={lastRating.error}
                onOpenBook={openBook}
              />
            )}

            {isGuest && (
              <FeaturedSection
                rating={featured.data}
                isLoading={featured.isLoading}
                onOpenBook={openBook}
              />
            )}

            {isGuest && (
              <GuestSignInCallout onSignIn={() => router.push('/')} />
            )}

            {userId && (
              <BookCarousel
                title="Recommended for you"
                books={recommended.books}
                isLoading={recommended.isLoading}
                skeletonCount={2}
                onOpenBook={openBook}
                emptyMessage={
                  recommended.hasEnoughData === false
                    ? 'Rate books with 4+ stars to get personalized recommendations.'
                    : undefined
                }
              />
            )}

            {isGuest && (
              <BookCarousel
                title="Trending this week"
                books={trending.books}
                isLoading={trending.isLoading}
                skeletonCount={4}
                onOpenBook={openBook}
              />
            )}

            <CommunityFeed
              ratings={community.ratings}
              error={community.error}
              onOpenBook={openBook}
            />

            <section className="xl:hidden">
              <PopularRail
                books={popularBooks}
                onViewAll={goToExplore}
                onOpenBook={openBook}
              />
            </section>
          </div>

          <div className="lateral-menu-scroll hidden w-76 shrink-0 flex-col overflow-y-auto pb-7 pr-2 xl:flex">
            <PopularRail
              books={popularBooks}
              onViewAll={goToExplore}
              onOpenBook={openBook}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
