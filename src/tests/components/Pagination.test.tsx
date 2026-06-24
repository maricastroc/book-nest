import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from '@/components/shared/Pagination'

jest.mock('@/components/shared/Pagination/styles', () => ({
  PaginationContainer: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PaginationButton: ({
    children,
    disabled,
    onClick,
  }: {
    children?: React.ReactNode
    disabled?: boolean
    onClick?: () => void
  }) => (
    <button disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
  PaginationPage: ({
    children,
    active,
    onClick,
  }: {
    children?: React.ReactNode
    active?: boolean
    onClick?: () => void
  }) => (
    <button data-active={active} onClick={onClick}>
      {children}
    </button>
  ),
}))

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders a button for each page', () => {
    render(<Pagination {...defaultProps} />)
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument()
    }
  })

  it('disables the previous button on the first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toBeDisabled()
  })

  it('disables the next button on the last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons[buttons.length - 1]).toBeDisabled()
  })

  it('calls onPageChange with the next page when clicking next', () => {
    const onPageChange = jest.fn()
    render(
      <Pagination
        {...defaultProps}
        currentPage={2}
        onPageChange={onPageChange}
      />,
    )
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[buttons.length - 1])
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('calls onPageChange with the previous page when clicking prev', () => {
    const onPageChange = jest.fn()
    render(
      <Pagination
        {...defaultProps}
        currentPage={3}
        onPageChange={onPageChange}
      />,
    )
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange with the correct page when clicking a page number', () => {
    const onPageChange = jest.fn()
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />)
    fireEvent.click(screen.getByText('3'))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('marks the current page button as active', () => {
    render(<Pagination {...defaultProps} currentPage={2} />)
    const pageButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.hasAttribute('data-active'))
    const activePage = pageButtons.find(
      (btn) => btn.getAttribute('data-active') === 'true',
    )
    expect(activePage).toHaveTextContent('2')
  })
})
