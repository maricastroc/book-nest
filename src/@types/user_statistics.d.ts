export interface StatusCounts {
  read: number
  reading: number
  wantToRead: number
  didNotFinish: number
}

export interface UserStatistics {
  readPages: number
  booksCount: number
  authorsCount: number
  ratedBooks: number
  bestGenre: string | undefined
  statusCounts: StatusCounts
  user: UserProps
}
