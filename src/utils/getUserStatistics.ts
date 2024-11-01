import { BookProps } from '@/@types/book'
import { CategoryProps } from '@/@types/category'
import { RatingProps } from '@/@types/rating'

export function calculateTotalPages(ratings: RatingProps[]): number {
  return ratings.reduce((acc, rating) => acc + rating.book.totalPages, 0)
}

export function getUniqueAuthors(ratings: RatingProps[]): string[] {
  const authors = ratings.map((rating) => rating.book.author)
  return Array.from(new Set(authors))
}

export function getBestGenre(
  books: BookProps[],
): { id: string; count: number } | null {
  // Use flatMap para extrair os gêneros, garantindo que não retornemos elementos undefined
  const genres = books.flatMap(
    (book) =>
      book?.categories?.map(
        (category) => category as unknown as CategoryProps,
      ) || [],
  )

  // Verifique se há gêneros antes de contar
  if (genres.length === 0) return null

  const genreCounts = genres.reduce<Record<string, number>>((acc, genre) => {
    if (genre && genre.id) {
      acc[genre.id] = (acc[genre.id] || 0) + 1
    }
    return acc
  }, {})

  const bestGenreId = Object.keys(genreCounts).reduce((a, b) =>
    genreCounts[a] > genreCounts[b] ? a : b,
  )

  return bestGenreId
    ? { id: bestGenreId, count: genreCounts[bestGenreId] }
    : null
}
