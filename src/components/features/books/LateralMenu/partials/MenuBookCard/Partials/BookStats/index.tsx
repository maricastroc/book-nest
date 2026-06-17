import {
  Barcode,
  BookmarkSimple,
  BookOpen,
  CalendarBlank,
  Clock,
  GlobeHemisphereEast,
  House,
} from 'phosphor-react'
import { BookStatsWrapper, StatText, StatWrapper } from './styles'
import { calculateReadingTime } from '@/utils/calculateReadingTime'

export const BookStats = ({
  categoryNames,
  totalPages,
  publishingYear,
  publisher,
  language,
  isbn,
}: {
  categoryNames: string[]
  totalPages: number
  publishingYear: string
  publisher: string | undefined
  language: string | undefined
  isbn: string | undefined
}) => {
  const stats = [
    {
      icon: <BookmarkSimple />,
      label: 'Category',
      value: categoryNames.join(', '),
    },
    { icon: <BookOpen />, value: `${totalPages} pages` },
    { icon: <CalendarBlank />, value: `${publishingYear}` },
    { icon: <Clock />, value: `${calculateReadingTime(totalPages)}` },
    { icon: <GlobeHemisphereEast />, value: `${language}` },
    { icon: <House />, value: `${publisher}` },
    { icon: <Barcode />, value: `${isbn}` },
  ]

  return (
    <BookStatsWrapper>
      {stats.map((stat, index) => (
        <StatWrapper key={index}>
          {stat.icon}
          <StatText>
            <p>{stat.value}</p>
          </StatText>
        </StatWrapper>
      ))}
    </BookStatsWrapper>
  )
}
