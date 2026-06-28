import { useRouter } from 'next/router'
import { useState } from 'react'

import { Avatar } from '@/components/shared/Avatar'
import { SearchBar } from '@/components/shared/SearchBar'
import { Spinner } from '@/components/ui/Spinner'

import useRequest from '@/hooks/useRequest'
import { useFollowStatus } from '@/hooks/useFollowStatus'
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
  const { isFollowing, isTogglingFollow, toggleFollow } = useFollowStatus(
    String(user.id),
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

export function FindReaders({ onAfterToggle }: { onAfterToggle?: () => void }) {
  const { search, setSearch, searchTerm } = usePaginationAndSearch({
    perPage: 8,
  })

  const [copied, setCopied] = useState(false)

  const { data, isValidating } = useRequest<{ users: UserProps[] }>(
    {
      url: '/user/search',
      method: 'GET',
      params: {
        perPage: 8,
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
          Find Readers
        </p>

        <SearchBar
          fullWidth
          search={search}
          placeholder="Search by name..."
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setSearch('')}
        />

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
      </div>

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
    </div>
  )
}
