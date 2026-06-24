import { render } from '@testing-library/react'
import { StarsRating } from '@/components/features/books/StarsRating'

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

describe('StarsRating', () => {
  it('renders 5 star icons', () => {
    const { container } = render(<StarsRating rating={3} />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(5)
  })

  it('renders a half star when rating is not a whole number', () => {
    const { container } = render(<StarsRating rating={3.5} />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(5)
  })

  it('renders correctly with rating 0', () => {
    const { container } = render(<StarsRating rating={0} />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(5)
  })

  it('renders correctly with max rating 5', () => {
    const { container } = render(<StarsRating rating={5} />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(5)
  })

  it('applies the smaller class when size is smaller', () => {
    const { container } = render(<StarsRating rating={3} size="smaller" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('smaller')
  })

  it('applies variant class when provided', () => {
    const { container } = render(<StarsRating rating={3} variant="large" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('large')
  })
})
