import { render, screen } from '@testing-library/react'
import { EmptyContainer } from '@/components/shared/EmptyContainer'

jest.mock('@/styles', () => ({
  styled: () => {
    const Component = ({ children }: { children?: React.ReactNode }) => (
      <div>{children}</div>
    )
    Component.displayName = 'styled'
    return Component
  },
}))

describe('EmptyContainer', () => {
  it('renders the empty state by default', () => {
    render(<EmptyContainer />)
    expect(
      screen.getByText("It's a little empty around here!"),
    ).toBeInTheDocument()
    expect(
      screen.getByText("We couldn't find any reviewed books."),
    ).toBeInTheDocument()
  })

  it('renders a custom content label in the empty state', () => {
    render(<EmptyContainer content="books" />)
    expect(screen.getByText("We couldn't find any books.")).toBeInTheDocument()
  })

  it('renders the error state when variant is error', () => {
    render(<EmptyContainer variant="error" />)
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument()
    expect(
      screen.getByText(/We couldn't load the reviewed books/),
    ).toBeInTheDocument()
  })

  it('renders a custom content label in the error state', () => {
    render(<EmptyContainer variant="error" content="ratings" />)
    expect(screen.getByText(/We couldn't load the ratings/)).toBeInTheDocument()
  })
})
