import { render, screen, fireEvent } from '@testing-library/react'
import { BookCard } from '@/components/features/books/BookCard'
import { BookProps } from '@/@types/book'

jest.mock('@/components/features/books/StarsRating', () => ({
  StarsRating: ({ rating }: { rating: number }) => (
    <div data-testid="stars-rating" data-rating={rating} />
  ),
}))

const mockBook: BookProps = {
  id: 'book-1',
  name: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  coverUrl: '/covers/gatsby.jpg',
  rate: 4,
  ratingCount: 42,
  readingStatus: null,
  summary: 'A classic novel.',
  totalPages: 180,
  categories: [],
  publishingYear: '1925',
  createdAt: new Date('2024-01-01'),
}

describe('BookCard', () => {
  it('renders the book title and author', () => {
    render(<BookCard book={mockBook} onOpenDetails={jest.fn()} />)
    expect(screen.getByText('The Great Gatsby')).toBeInTheDocument()
    expect(screen.getByText('F. Scott Fitzgerald')).toBeInTheDocument()
  })

  it('renders the rating count', () => {
    render(<BookCard book={mockBook} onOpenDetails={jest.fn()} />)
    expect(screen.getByText('(42 ratings)')).toBeInTheDocument()
  })

  it('renders the rating count as singular when there is 1 rating', () => {
    render(
      <BookCard
        book={{ ...mockBook, ratingCount: 1 }}
        onOpenDetails={jest.fn()}
      />,
    )
    expect(screen.getByText('(1 rating)')).toBeInTheDocument()
  })

  it('passes the correct rating value to StarsRating', () => {
    render(<BookCard book={mockBook} onOpenDetails={jest.fn()} />)
    const stars = screen.getByTestId('stars-rating')
    expect(stars).toHaveAttribute('data-rating', '4')
  })

  it('calls onOpenDetails when clicking the card', () => {
    const onOpenDetails = jest.fn()
    const { container } = render(
      <BookCard book={mockBook} onOpenDetails={onOpenDetails} />,
    )
    const card = container.firstChild as HTMLElement
    if (card) fireEvent.click(card)
    expect(onOpenDetails).toHaveBeenCalledTimes(1)
  })

  it('does not render a recommendation chip without recommendation meta', () => {
    render(<BookCard book={mockBook} onOpenDetails={jest.fn()} />)
    expect(screen.queryByText(/Because you like/)).not.toBeInTheDocument()
  })

  it('shows the taste-based reason when recommendation meta is present', () => {
    render(
      <BookCard
        book={{
          ...mockBook,
          recommendation: {
            score: 0.9,
            bayesianRate: 4.3,
            reasons: [
              { kind: 'affinity', label: 'Because you like Fiction' },
              { kind: 'quality', label: 'Highly rated by readers (4.3★)' },
            ],
          },
        }}
        onOpenDetails={jest.fn()}
      />,
    )
    expect(screen.getByText('Because you like Fiction')).toBeInTheDocument()
  })

  it('falls back to a quality reason when no affinity reason exists', () => {
    render(
      <BookCard
        book={{
          ...mockBook,
          recommendation: {
            score: 0.7,
            bayesianRate: 4.6,
            reasons: [
              { kind: 'quality', label: 'Highly rated by readers (4.6★)' },
            ],
          },
        }}
        onOpenDetails={jest.fn()}
      />,
    )
    expect(
      screen.getByText('Highly rated by readers (4.6★)'),
    ).toBeInTheDocument()
  })
})
