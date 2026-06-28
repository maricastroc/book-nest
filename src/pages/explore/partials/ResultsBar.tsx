import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ExploreSort } from '@/hooks/useExploreBooks'

interface ResultsBarProps {
  total: number
  isValidating: boolean
  search: string
  categoryName?: string | null
  sort: ExploreSort
  onSortChange: (sort: ExploreSort) => void
}

const SORT_OPTIONS: { value: ExploreSort; label: string }[] = [
  { value: 'title-asc', label: 'Title A–Z' },
  { value: 'title-desc', label: 'Title Z–A' },
  { value: 'rating', label: 'Top rated' },
  { value: 'most-rated', label: 'Most rated' },
  { value: 'newest', label: 'Newest' },
]

export function ResultsBar({
  total,
  isValidating,
  search,
  categoryName,
  sort,
  onSortChange,
}: ResultsBarProps) {
  const scope = search.trim()
    ? `Results for “${search.trim()}”`
    : categoryName ?? 'All books'

  const activeLabel =
    SORT_OPTIONS.find((option) => option.value === sort)?.label ??
    SORT_OPTIONS[0].label

  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <p className="min-w-0 truncate text-[13px] text-fg2">
        <span className="font-medium text-fg">{scope}</span>
        {!isValidating && (
          <span className="text-fg3">
            {' · '}
            {total} {total === 1 ? 'book' : 'books'}
          </span>
        )}
      </p>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            aria-label="Sort books"
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-line bg-s1 py-1.5 pl-3 pr-2.5 text-[12.5px] font-medium text-fg2 transition-colors hover:border-line-strong hover:text-fg focus:outline-none focus-visible:border-ac-border data-[state=open]:border-line-strong data-[state=open]:text-fg"
          >
            <span>{activeLabel}</span>
            <FontAwesomeIcon
              icon={faChevronDown}
              aria-hidden
              className="text-fg3"
              style={{ fontSize: 11 }}
            />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={8}
            className="z-9997 min-w-46 overflow-hidden rounded-xl border border-line bg-el p-1.5 shadow-[0_16px_36px_rgba(0,0,0,0.55)]"
          >
            {SORT_OPTIONS.map((option) => {
              const isActive = option.value === sort

              return (
                <DropdownMenu.Item
                  key={option.value}
                  onSelect={() => onSortChange(option.value)}
                  className={`flex cursor-pointer items-center justify-between gap-3 whitespace-nowrap rounded-lg border-0 bg-transparent px-3 py-2 text-left text-[0.85rem] font-medium transition-colors focus:outline-none data-highlighted:bg-white/6 ${
                    isActive
                      ? 'text-fg data-highlighted:text-fg'
                      : 'text-fg2 data-highlighted:text-fg'
                  }`}
                >
                  <span>{option.label}</span>
                  {isActive && (
                    <FontAwesomeIcon
                      icon={faCheck}
                      aria-hidden
                      className="text-ac"
                      style={{ fontSize: 11 }}
                    />
                  )}
                </DropdownMenu.Item>
              )
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  )
}
