export interface UserStatistics {
  readPages: number
  booksCount: number
  authorsCount: number
  ratedBooks: number
  bestGenre: string | undefined
  user: UserProps
}
