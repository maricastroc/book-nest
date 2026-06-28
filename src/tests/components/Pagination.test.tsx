import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from '@/components/shared/Pagination'

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

  it('renders nothing when there is a single page', () => {
    const { container } = render(
      <Pagination {...defaultProps} totalPages={1} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('truncates with ellipsis when there are many pages', () => {
    render(
      <Pagination currentPage={10} totalPages={20} onPageChange={jest.fn()} />,
    )

    // first and last are always visible
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()

    // current page and its neighbors are visible
    expect(screen.getByText('9')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('11')).toBeInTheDocument()

    // far-away pages are collapsed behind the ellipsis
    expect(screen.queryByText('5')).not.toBeInTheDocument()
    expect(screen.queryByText('15')).not.toBeInTheDocument()
    expect(screen.getAllByText('…')).toHaveLength(2)
  })
})
