import { useRouter } from 'next/router'
import { useState } from 'react'

import { Avatar } from '@/components/ui/Avatar'
import { SearchBar } from '@/components/ui/SearchBar'
import { Spinner } from '@/components/ui/Spinner'

import useRequest from '@/hooks/useRequest'
import { useFollowToggle } from '@/hooks/useFollowToggle'
import { usePaginationAndSearch } from '@/hooks/usePaginationAndSearchParams'
import { UserProps } from '@/@types/user'

function ReaderRow({
  user,
  onAfterToggle,
}: {
  user: UserProps
  onAfterToggle?: () => void
}) {
  const router = useRouter()
  const { isFollowing, isTogglingFollow, toggleFollow } = useFollowToggle(
    String(user.id),
    user.isFollowing ?? false,
  )

  const handleToggle = async () => {
    await toggleFollow()
    onAfterToggle?.()
  }

  const goToProfile = () => router.push(`/profile/${user.id}`)

  return (
    <div className="flex items-center gap-3 border-b border-line py-2.5 last:border-b-0">
      <Avatar
        isClickable
        avatarUrl={user.avatarUrl}
        variant="small"
        onClick={goToProfile}
      />
      <button
        onClick={goToProfile}
        className="min-w-0 flex-1 truncate text-left text-[13px] font-medium text-fg transition-colors hover:text-ac"
      >
        {user.name}
      </button>
      <button
        onClick={handleToggle}
        disabled={isTogglingFollow}
        className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
          isFollowing
            ? 'border border-line text-fg3 hover:border-st-reading hover:text-st-reading'
            : 'bg-ac text-ac-ink hover:brightness-110'
        }`}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  )
}

type FindReadersProps = {
  onAfterToggle?: () => void
  /** Compact teaser: a few readers, no search, no invite card, with a "See all" link. */
  compact?: boolean
  onSeeAll?: () => void
}

export function FindReaders({
  onAfterToggle,
  compact = false,
  onSeeAll,
}: FindReadersProps) {
  const perPage = compact ? 3 : 8

  const { search, setSearch, searchTerm } = usePaginationAndSearch({
    perPage,
  })

  const [copied, setCopied] = useState(false)

  const { data, isValidating } = useRequest<{ users: UserProps[] }>(
    {
      url: '/user/search',
      method: 'GET',
      params: {
        perPage,
        page: 1,
        ...(searchTerm ? { search: searchTerm } : {}),
      },
    },
    { revalidateOnFocus: false, keepPreviousData: true },
  )

  const users = data?.users ?? []

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Find readers card */}
      <div className="flex flex-col gap-3 rounded-feature border border-line bg-s1 p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-fg3">
          {compact ? 'Readers to follow' : 'Find Readers'}
        </p>

        {!compact && (
          <SearchBar
            fullWidth
            search={search}
            placeholder="Search by name..."
            onChange={(e) => setSearch(e.target.value)}
            onClick={() => setSearch('')}
          />
        )}

        <div className="flex flex-col">
          {isValidating && !users.length ? (
            <div className="flex justify-center py-6">
              <Spinner size="sm" />
            </div>
          ) : users.length > 0 ? (
            users.map((user) => (
              <ReaderRow
                key={user.id}
                user={user}
                onAfterToggle={onAfterToggle}
              />
            ))
          ) : (
            <p className="py-6 text-center text-[13px] text-fg3">
              No readers found.
            </p>
          )}
        </div>

        {compact && users.length > 0 && (
          <button
            onClick={onSeeAll}
            className="mt-1 self-start text-[12px] font-semibold text-ac transition-[filter] hover:brightness-110"
          >
            See all readers
          </button>
        )}
      </div>

      {!compact && (
        <div className="flex flex-col gap-2 rounded-feature border border-line bg-s1 p-5">
          <h4 className="text-[13px] font-semibold text-fg">
            Invite a friend 📚
          </h4>
          <p className="text-[12px] leading-relaxed text-fg3">
            Grow your shelf circle — share BookNest and read together.
          </p>
          <button
            onClick={handleCopyLink}
            className="mt-1 rounded-lg bg-ac py-2.5 text-[13px] font-semibold text-ac-ink transition-[filter] hover:brightness-110"
          >
            {copied ? 'Copied!' : 'Copy invite link'}
          </button>
        </div>
      )}
    </div>
  )
}
