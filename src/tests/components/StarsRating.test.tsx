import { render } from '@testing-library/react'
import { StarsRating } from '@/components/features/books/StarsRating'

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

  it('applies the smaller styling when size is smaller', () => {
    const { container } = render(<StarsRating rating={3} size="smaller" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('opacity-80')
  })

  it('does not apply the smaller styling by default', () => {
    const { container } = render(<StarsRating rating={3} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).not.toContain('opacity-80')
  })
})
