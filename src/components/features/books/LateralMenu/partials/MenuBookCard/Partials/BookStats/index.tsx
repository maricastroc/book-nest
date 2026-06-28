import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBarcode,
  faBookOpen,
  faBookmark,
  faCalendar,
  faClock,
  faGlobe,
  faHouse,
} from '@fortawesome/free-solid-svg-icons'
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
    { icon: faBookmark, value: categoryNames.join(', ') },
    { icon: faBookOpen, value: `${totalPages} pages` },
    { icon: faCalendar, value: `${publishingYear}` },
    { icon: faClock, value: `${calculateReadingTime(totalPages)}` },
    { icon: faGlobe, value: `${language}` },
    { icon: faHouse, value: `${publisher}` },
    { icon: faBarcode, value: `${isbn}` },
  ]

  return (
    <footer className="flex w-full flex-wrap gap-2">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex items-center gap-1.5 rounded-[6px] border border-white/[0.06] bg-white/[0.04] px-2.5 py-1.5"
        >
          <FontAwesomeIcon
            icon={stat.icon}
            className="shrink-0 text-fg3"
            style={{ fontSize: 13 }}
          />
          <span className="text-[0.78rem] font-medium text-fg2">
            {stat.value}
          </span>
        </div>
      ))}
    </footer>
  )
}
