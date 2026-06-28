import { CategoryProps } from '@/@types/category'
import { HorizontalScroll } from '@/components/shared/HorizontalScroll'

interface Props {
  categories: CategoryProps[] | null | undefined
  selectedCategory: string | null
  isValidating: boolean
  setCurrentPage: (value: number) => void
  setSelectedCategory: (value: string | null) => void
}

export const CategoriesSection = ({
  selectedCategory,
  categories,
  isValidating,
  setCurrentPage,
  setSelectedCategory,
}: Props) => {
  const pills = categories?.length
    ? [{ id: null, name: 'All' }, ...categories]
    : null

  return (
    <div className="mb-6">
      <HorizontalScroll scrollAmount={300}>
        {!pills
          ? Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-6 w-14 shrink-0 animate-pulse rounded-full bg-s2"
              />
            ))
          : pills.map((cat) => {
              const isActive =
                cat.id === null
                  ? !selectedCategory
                  : selectedCategory === cat.id
              return (
                <button
                  key={cat.id ?? 'all'}
                  disabled={!!isValidating}
                  onClick={() => {
                    setCurrentPage(1)
                    setSelectedCategory(cat.id)
                  }}
                  className={`shrink-0 rounded-full border px-3 py-1.25 text-[11.5px] font-medium tracking-wide whitespace-nowrap transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
                    isActive
                      ? 'border-ac bg-ac-soft text-ac'
                      : 'border-line text-fg3 hover:border-ac/40 hover:text-fg'
                  }`}
                >
                  {cat.name}
                </button>
              )
            })}
      </HorizontalScroll>
    </div>
  )
}
