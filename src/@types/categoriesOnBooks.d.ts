import { BookProps } from './book'
import { CategoryProps } from './category'

export interface CategoriesOnBooksProps {
  book_id: string
  category_id: string

  book?: BookProps
  category?: CategoryProps
}
