import { render, screen, fireEvent } from '@testing-library/react'
import { NavigationItem } from '@/components/shared/NavigationItem'
import { faHouse } from '@fortawesome/free-solid-svg-icons'

jest.mock('@/styles', () => ({
  styled: () => {
    const Component = ({
      children,
      className,
      onClick,
    }: {
      children?: React.ReactNode
      className?: string
      onClick?: () => void
    }) => (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    )
    Component.displayName = 'styled'
    return Component
  },
}))

describe('NavigationItem', () => {
  const defaultProps = {
    active: false,
    onClick: jest.fn(),
    icon: faHouse,
    label: 'Home',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the label', () => {
    render(<NavigationItem {...defaultProps} />)
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('renders the icon', () => {
    const { container } = render(<NavigationItem {...defaultProps} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('applies the active class when active is true', () => {
    render(<NavigationItem {...defaultProps} active={true} />)
    const button = screen.getByText('Home').closest('div')
    expect(button?.className).toContain('active')
  })

  it('does not apply the active class when active is false', () => {
    render(<NavigationItem {...defaultProps} active={false} />)
    const button = screen.getByText('Home').closest('div')
    expect(button?.className).not.toContain('active')
  })

  it('calls onClick when clicked', () => {
    const onClick = jest.fn()
    render(<NavigationItem {...defaultProps} onClick={onClick} />)
    fireEvent.click(screen.getByText('Home'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
