import { Binoculars, MagnifyingGlass, X } from 'phosphor-react'
import {
  Categories,
  SelectCategoryButton,
  ExplorePageWrapper,
  ExplorePageContainer,
  ExplorePageHeading,
  SearchBar,
  BooksContainer,
  ExplorePageContent,
  HeadingTitle,
} from './styles'
import { useState } from 'react'
import { MobileHeader } from '@/components/shared/MobileHeader'
import { Sidebar } from '@/components/shared/Sidebar'
import { ExploreCard } from '@/components/cards/ExploreCard'
import { api } from '@/lib/axios'
import { LateralMenu } from '@/components/shared/LateralMenu'
import { NextSeo } from 'next-seo'
import { CategoryProps } from '@/@types/category'
import { BookProps } from '@/@types/book'
import { useScreenSize } from '@/utils/useScreenSize'
import { SkeletonPopularBook } from '@/components/skeletons/SkeletonPopularBook'
import { SkeletonCategories } from '@/components/skeletons/SkeletonCategories'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { CreateReviewData, EditReviewData } from '../home/index.page'
import { toast } from 'react-toastify'
import useRequest from '@/utils/useRequest'
import { handleApiError } from '@/utils/handleApiError'
import { useAppContext } from '@/contexts/AppContext'

export interface ExploreProps {
  categories: CategoryProps[]
  books: BookProps[]
}

export default function Explore() {
  const isRouteLoading = useLoadingOnRouteChange()

  const [search, setSearch] = useState('')

  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null)

  const [openLateralMenu, setOpenLateralMenu] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const { loggedUser } = useAppContext()

  const isMobile = useScreenSize(980)

  const {
    data: books,
    mutate: mutateBooks,
    isValidating,
  } = useRequest<BookProps[] | null>({
    url: '/books',
    method: 'GET',
    params: {
      category: selectedCategory,
      ...(search?.length ? { search } : {}),
    },
  })

  const { data: categories } = useRequest<CategoryProps[] | null>({
    url: '/categories',
    method: 'GET',
  })

  function handleCloseLateralMenu() {
    setOpenLateralMenu(false)
  }

  const handleDeleteReview = async (id: string) => {
    try {
      const payload = { id }

      await api.delete('/ratings', { data: payload })

      await mutateBooks()

      toast.success('Rating successfully deleted!')
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleEditReview = async (data: EditReviewData) => {
    try {
      const payload = {
        id: data.ratingId,
        description: data.description,
        rate: data.rate,
      }

      await api.put('/ratings', payload)

      await mutateBooks()

      toast.success('Rating successfully edited!')
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleCreateReview = async (data: CreateReviewData) => {
    try {
      const payload = {
        bookId: data.bookId,
        userId: data.userId,
        description: data.description,
        rate: data.rate,
      }

      await api.post(`/ratings`, { data: payload })

      await mutateBooks()

      toast.success('Rating successfully submitted!')
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleSelectReadingStatus = async (book: BookProps, status: string) => {
    if (loggedUser && book) {
      try {
        const payload = {
          userId: loggedUser?.id,
          bookId: book.id,
          status,
        }

        await Promise.all([api.post('/reading_status', payload), mutateBooks()])

        toast.success('Status successfully updated!')
      } catch (error) {
        handleApiError(error)
      }
    }
  }
  console.log(books)
  return (
    <>
      <NextSeo title="Explore | Book Wise" />
      {isRouteLoading ? (
        <LoadingPage />
      ) : (
        <ExplorePageWrapper>
          {openLateralMenu && (
            <LateralMenu
              book={selectedBook}
              handleCreateReview={handleCreateReview}
              handleEditReview={handleEditReview}
              handleDeleteReview={handleDeleteReview}
              handleSelectReadingStatus={handleSelectReadingStatus}
              onClose={() => {
                handleCloseLateralMenu()
              }}
            />
          )}
          {isMobile ? <MobileHeader /> : <Sidebar />}
          <ExplorePageContainer>
            <ExplorePageHeading>
              <HeadingTitle>
                <Binoculars />
                <h2>Explore</h2>
              </HeadingTitle>
              <SearchBar>
                <input
                  type="text"
                  placeholder="Search for author or title"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  spellCheck={false}
                />
                {search === '' ? (
                  <MagnifyingGlass />
                ) : (
                  <X onClick={() => setSearch('')} />
                )}
              </SearchBar>
            </ExplorePageHeading>
            <ExplorePageContent>
              <Categories>
                {!categories?.length ? (
                  <SkeletonCategories />
                ) : (
                  <>
                    <SelectCategoryButton
                      selected={!selectedCategory}
                      onClick={() => setSelectedCategory(null)}
                    >
                      All
                    </SelectCategoryButton>
                    {categories?.map((category) => (
                      <SelectCategoryButton
                        selected={
                          !isValidating && selectedCategory === category.id
                        }
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={isValidating ? 'loading' : ''}
                      >
                        {category.name}
                      </SelectCategoryButton>
                    ))}
                  </>
                )}
              </Categories>
              <BooksContainer>
                {isValidating || !books?.length
                  ? Array.from({ length: 9 }).map((_, index) => (
                      <SkeletonPopularBook key={index} />
                    ))
                  : books?.map((book) => (
                      <ExploreCard
                        key={book.id}
                        book={book}
                        onClick={() => {
                          setSelectedBook(book)
                          setOpenLateralMenu(true)
                        }}
                      />
                    ))}
              </BooksContainer>
            </ExplorePageContent>
          </ExplorePageContainer>
        </ExplorePageWrapper>
      )}
    </>
  )
}
