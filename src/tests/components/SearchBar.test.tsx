import { render, screen, fireEvent } from '@testing-library/react'
import { SearchBar } from '@/components/shared/SearchBar'

jest.mock('@/styles', () => ({
  styled: () => {
    const Component = ({
      children,
      className,
    }: {
      children?: React.ReactNode
      className?: string
    }) => <div className={className}>{children}</div>
    Component.displayName = 'styled'
    return Component
  },
}))

describe('SearchBar', () => {
  const defaultProps = {
    search: '',
    placeholder: 'Search books...',
    onChange: jest.fn(),
    onClick: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the input with the correct placeholder', () => {
    render(<SearchBar {...defaultProps} />)
    expect(screen.getByPlaceholderText('Search books...')).toBeInTheDocument()
  })

  it('displays the current search value', () => {
    render(<SearchBar {...defaultProps} search="Harry Potter" />)
    const input = screen.getByDisplayValue('Harry Potter')
    expect(input).toBeInTheDocument()
  })

  it('calls onChange when the user types', () => {
    const onChange = jest.fn()
    render(<SearchBar {...defaultProps} onChange={onChange} />)
    const input = screen.getByPlaceholderText('Search books...')
    fireEvent.change(input, { target: { value: 'Dune' } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('shows a magnifying glass icon when search is empty', () => {
    const { container } = render(<SearchBar {...defaultProps} search="" />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(1)
  })

  it('shows an X icon when search has a value', () => {
    const { container } = render(<SearchBar {...defaultProps} search="Dune" />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(1)
  })

  it('calls onClick when the X icon is clicked', () => {
    const onClick = jest.fn()
    const { container } = render(
      <SearchBar {...defaultProps} search="Dune" onClick={onClick} />,
    )
    const xIcon = container.querySelector('svg')
    if (xIcon) fireEvent.click(xIcon)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
