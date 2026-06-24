import { render, screen, fireEvent } from '@testing-library/react'
import { BookCard } from '@/components/features/books/BookCard'
import { BookProps } from '@/@types/book'

jest.mock('@/styles', () => ({
  styled: (_tag: any, _styles: any) => {
    const Component = ({ children, className, onClick }: any) => (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    )
    Component.displayName = 'styled'
    return Component
  },
}))

jest.mock('@/components/features/books/StarsRating', () => ({
  StarsRating: ({ rating }: { rating: number }) => (
    <div data-testid="stars-rating" data-rating={rating} />
  ),
}))

jest.mock('@/components/features/books/ReadingStatusTag', () => ({
  ReadingStatusTag: ({ readingStatus }: { readingStatus: string }) => (
    <div data-testid="reading-status-tag" data-status={readingStatus} />
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
  publishingYear: 1925,
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
    fireEvent.click(container.firstChild as HTMLElement)
    expect(onOpenDetails).toHaveBeenCalledTimes(1)
  })

  it('does not render the ReadingStatusTag when readingStatus is null', () => {
    render(<BookCard book={mockBook} onOpenDetails={jest.fn()} />)
    expect(screen.queryByTestId('reading-status-tag')).not.toBeInTheDocument()
  })

  it('renders the ReadingStatusTag when readingStatus is set', () => {
    render(
      <BookCard
        book={{ ...mockBook, readingStatus: 'read' }}
        onOpenDetails={jest.fn()}
      />,
    )
    const tag = screen.getByTestId('reading-status-tag')
    expect(tag).toBeInTheDocument()
    expect(tag).toHaveAttribute('data-status', 'read')
  })
})
