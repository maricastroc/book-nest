import { useState } from 'react'
import { useRouter } from 'next/router'
import { Rss } from 'phosphor-react'
import { useSession } from 'next-auth/react'

import { MainLayout } from '@/layouts/MainLayout'
import { RatingCard } from '@/components/features/books/RatingCard'
import { SkeletonRatingCard } from '@/components/skeletons/SkeletonRatingCard'
import { Pagination } from '@/components/shared/Pagination'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/shared/Avatar'
import { SearchBar } from '@/components/shared/SearchBar'

import useRequest from '@/hooks/useRequest'
import { useFollowStatus } from '@/hooks/useFollowStatus'
import { BookProps } from '@/@types/book'
import { RatingProps } from '@/@types/rating'
import { UserProps } from '@/@types/user'

import {
  FeedLayout,
  FeedMain,
  FeedSidebar,
  PageSubtitle,
  SidebarWidget,
  WidgetHeader,
  WidgetTitle,
  WidgetSeeAll,
  SuggestedUserRow,
  SuggestedUserInfo,
  SuggestedUserName,
  FollowBtn,
  InviteCard,
  CopyLinkBtn,
  EmptyFeedContainer,
} from './styles'

type RatingActivity = {
  type: 'rating'
  id: string
  createdAt: string
  user: { id: string; name: string; avatarUrl?: string | null }
  book: { id: string; name: string; author: string; coverUrl: string }
  rate: number
  description: string
  votes: { up: number; down: number; userVote: string | null }
}

type AnyActivity = RatingActivity | { type: 'reading_status'; id: string }

function SuggestedUser({
  user,
  onAfterToggle,
}: {
  user: UserProps
  onAfterToggle?: () => void
}) {
  const router = useRouter()
  const { isFollowing, isTogglingFollow, toggleFollow } = useFollowStatus(
    String(user.id),
  )

  const handleToggle = async () => {
    await toggleFollow()
    onAfterToggle?.()
  }

  return (
    <SuggestedUserRow>
      <Avatar
        isClickable
        avatarUrl={user.avatarUrl}
        variant="small"
        onClick={() => router.push(`/profile/${user.id}`)}
      />
      <SuggestedUserInfo
        style={{ cursor: 'pointer' }}
        onClick={() => router.push(`/profile/${user.id}`)}
      >
        <SuggestedUserName>{user.name}</SuggestedUserName>
      </SuggestedUserInfo>
      <FollowBtn
        following={isFollowing}
        onClick={handleToggle}
        disabled={isTogglingFollow}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </FollowBtn>
    </SuggestedUserRow>
  )
}

function RightSidebar({ onAfterToggle }: { onAfterToggle?: () => void }) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const { data: suggestedUsersData } = useRequest<{ users: UserProps[] }>(
    { url: '/user/search', method: 'GET', params: { perPage: 6, page: 1 } },
    { revalidateOnFocus: false },
  )

  const suggestions = (suggestedUsersData?.users ?? []).slice(0, 6)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <FeedSidebar>
      {suggestions.length > 0 && (
        <SidebarWidget>
          <WidgetHeader>
            <WidgetTitle>Who to follow</WidgetTitle>
            <WidgetSeeAll onClick={() => router.push('/readers')}>
              See all
            </WidgetSeeAll>
          </WidgetHeader>
          {suggestions.map((user) => (
            <SuggestedUser
              key={user.id}
              user={user}
              onAfterToggle={onAfterToggle}
            />
          ))}
        </SidebarWidget>
      )}

      <InviteCard>
        <h4>Invite a friend 📚</h4>
        <p>Grow your shelf circle — share BookNest and read together.</p>
        <CopyLinkBtn onClick={handleCopyLink}>
          {copied ? 'Copied!' : 'Copy invite link'}
        </CopyLinkBtn>
      </InviteCard>
    </FeedSidebar>
  )
}

export default function Feed() {
  const router = useRouter()
  const { data: session } = useSession()
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)
  const [isLateralMenuOpen, setIsLateralMenuOpen] = useState(false)

  const { data, isValidating, mutate } = useRequest<{
    activities: AnyActivity[]
    totalPages: number
    followingIds: string[]
  }>(
    session?.user
      ? {
          url: '/feed',
          method: 'GET',
          params: { page: currentPage, ...(search ? { search } : {}) },
        }
      : null,
    { revalidateOnFocus: false, keepPreviousData: true, dedupingInterval: 0 },
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  const renderFeed = () => {
    if (!session?.user) {
      return (
        <EmptyFeedContainer>
          <p>Sign in to see what people you follow are reading.</p>
        </EmptyFeedContainer>
      )
    }

    if (isValidating) {
      return Array.from({ length: 4 }).map((_, i) => (
        <SkeletonRatingCard key={i} />
      ))
    }

    if (!data?.followingIds?.length) {
      return (
        <EmptyFeedContainer>
          <p>
            Your feed is empty. Follow other readers to see their activity here.
          </p>
          <Button
            isSmaller
            content="Browse Readers"
            onClick={() => router.push('/readers')}
          />
        </EmptyFeedContainer>
      )
    }

    const ratingActivities = (data.activities ?? []).filter(
      (a): a is RatingActivity => a.type === 'rating',
    )

    if (!ratingActivities.length) {
      return (
        <EmptyFeedContainer>
          <p>No activity yet from readers you follow.</p>
        </EmptyFeedContainer>
      )
    }

    return (
      <>
        {ratingActivities.map((activity) => {
          const rating = {
            ...activity,
            createdAt: new Date(activity.createdAt),
            bookId: activity.book.id,
            userId: activity.user.id,
            deletedAt: null,
          } as unknown as RatingProps

          return (
            <RatingCard
              key={rating.id}
              rating={rating}
              onOpenDetails={() => {
                setSelectedBook(activity.book as BookProps)
                setIsLateralMenuOpen(true)
              }}
            />
          )
        })}
        {(data?.totalPages ?? 0) > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </>
    )
  }

  return (
    <MainLayout
      title="Following | BookNest"
      icon={<Rss />}
      pageTitle="Following"
      selectedBook={selectedBook}
      isLateralMenuOpen={isLateralMenuOpen}
      setIsLateralMenuOpen={setIsLateralMenuOpen}
    >
      <FeedLayout>
        <FeedMain>
          <PageSubtitle>Latest activity from readers you follow</PageSubtitle>
          <SearchBar
            fullWidth
            search={search}
            placeholder="Search by book, author or reader..."
            onChange={handleSearchChange}
            onClick={() => {
              setSearch('')
              setCurrentPage(1)
            }}
          />
          {renderFeed()}
        </FeedMain>

        <RightSidebar onAfterToggle={() => mutate()} />
      </FeedLayout>
    </MainLayout>
  )
}
