import { BookProps } from './book'
import { CategoryProps } from './category'

export interface CategoriesOnBooksProps {
  bookId: string
  categoryId: string

  book?: BookProps
  category?: CategoryProps
}
