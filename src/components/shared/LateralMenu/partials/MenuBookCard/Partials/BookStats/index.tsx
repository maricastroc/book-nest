import { BookmarkSimple, BookOpen, CalendarBlank } from 'phosphor-react'
import { BookStatsWrapper, StatText, StatWrapper } from './styles'

export const BookStats = ({
  categoryNames,
  totalPages,
  publishingYear,
}: {
  categoryNames: string[]
  totalPages: number
  publishingYear: string
}) => {
  const stats = [
    {
      icon: <BookmarkSimple />,
      label: 'Category',
      value: categoryNames.join(', '),
    },
    { icon: <BookOpen />, label: 'Pages', value: totalPages },
    { icon: <CalendarBlank />, label: 'Published on', value: publishingYear },
  ]

  return (
    <BookStatsWrapper>
      {stats.map((stat, index) => (
        <StatWrapper key={index}>
          {stat.icon}
          <StatText>
            <p>{stat.label}</p>
            <h2>{stat.value}</h2>
          </StatText>
        </StatWrapper>
      ))}
    </BookStatsWrapper>
  )
}
