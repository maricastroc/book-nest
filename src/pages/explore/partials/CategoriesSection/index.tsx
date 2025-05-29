import { CaretLeft, CaretRight } from 'phosphor-react'
import { SkeletonCategories } from '../SkeletonCategories'
import {
  CaretLeftIcon,
  CaretRightIcon,
  Categories,
  ScrollContainer,
  SelectCategoryButton,
} from './styles'
import { RefObject } from 'react'
import { CategoryProps } from '@/@types/category'

interface Props {
  categories: CategoryProps[] | null | undefined
  containerRef: RefObject<HTMLDivElement>
  selectedCategory: string | null
  isValidating: boolean
  setCurrentPage: (value: number) => void
  setSelectedCategory: (value: string | null) => void
}

export const CategoriesSection = ({
  containerRef,
  selectedCategory,
  categories,
  isValidating,
  setCurrentPage,
  setSelectedCategory,
}: Props) => {
  const handleScroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'right' ? 300 : -300
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <ScrollContainer>
      <Categories ref={containerRef}>
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
            >
              All
            </SelectCategoryButton>
            {categories?.map((category) => (
              <SelectCategoryButton
                selected={selectedCategory === category.id}
                key={category.id}
                onClick={() => {
                  setCurrentPage(1)
                  setSelectedCategory(category.id)
                }}
                className={isValidating ? 'loading' : ''}
              >
                {category.name}
              </SelectCategoryButton>
            ))}
          </>
        )}

        <CaretLeftIcon onClick={() => handleScroll('left')}>
          <CaretLeft size={28} weight="bold" />
        </CaretLeftIcon>
        <CaretRightIcon onClick={() => handleScroll('right')}>
          <CaretRight size={28} weight="bold" />
        </CaretRightIcon>
      </Categories>
    </ScrollContainer>
  )
}
