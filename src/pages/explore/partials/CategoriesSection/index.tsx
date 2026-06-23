import { SkeletonCategories } from '../SkeletonCategories'
import { SelectCategoryButton, CategoriesWrapper } from './styles'
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
  return (
    <CategoriesWrapper>
      <HorizontalScroll scrollAmount={300}>
        {!categories?.length ? (
          <SkeletonCategories />
        ) : (
          <>
            <SelectCategoryButton
              selected={!selectedCategory}
              onClick={() => {
                setCurrentPage(1)
                setSelectedCategory(null)
              }}
              disabled={!!isValidating}
            >
              All
            </SelectCategoryButton>
            {categories.map((category) => (
              <SelectCategoryButton
                selected={selectedCategory === category.id}
                key={category.id}
                onClick={() => {
                  setCurrentPage(1)
                  setSelectedCategory(category.id)
                }}
                disabled={!!isValidating}
              >
                {category.name}
              </SelectCategoryButton>
            ))}
          </>
        )}
      </HorizontalScroll>
    </CategoriesWrapper>
  )
}
