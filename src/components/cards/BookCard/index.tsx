import { StarsRating } from '@/components/shared/StarsRating'
import {
  BookCardWrapper,
  BookCardContent,
  BookCover,
  BookTitleAndAuthor,
  BookDetailsWrapper,
  BookStatsWrapper,
  StatWrapper,
  StatText,
  BookRatingInfo,
  DividerLine,
  AddToLibraryButton,
  BookRatingAndReviews,
  BookOtherInfo,
  AddToLibrarySection,
  AddToLibraryDropdown,
  ReadingStatusItem,
  DividerDropdown,
} from './styles'
import { BookOpen, BookmarkSimple, CalendarBlank } from 'phosphor-react'
import { CategoryProps } from '@/@types/category'
import { BookProps } from '@/@types/book'
import { useState } from 'react'
import { TextBox } from '@/components/shared/TextBox'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface BookCardProps {
  book: BookProps
  categories: CategoryProps[]
}

export function BookCard({ book, categories }: BookCardProps) {
  const categoryNames = categories.map((category) => category?.name)

  const [isAddToLibraryDropdownOpen, setIsAddToLibraryDropdownOpen] =
    useState(false)

  return (
    <BookCardWrapper>
      <BookCardContent>
        <BookCover alt="" src={book.coverUrl} />
        <BookDetailsWrapper>
          <BookTitleAndAuthor>
            <h2>{book.name}</h2>
            <p>{book.author}</p>
          </BookTitleAndAuthor>
          <BookOtherInfo>
            <BookRatingAndReviews>
              <BookRatingInfo>
                <StarsRating rating={book?.rate ?? 0} />
                <p>{book?.rate?.toFixed(2)}</p>
              </BookRatingInfo>
              <p>
                (<span>{book?.ratings?.length ?? 0}</span> {''}
                {book?.ratings?.length === 1 ? 'rating' : 'ratings'})
              </p>
            </BookRatingAndReviews>
            <AddToLibrarySection>
              <AddToLibraryButton
                onClick={() =>
                  setIsAddToLibraryDropdownOpen(!isAddToLibraryDropdownOpen)
                }
              >
                Add to Library
              </AddToLibraryButton>
              {isAddToLibraryDropdownOpen && (
                <AddToLibraryDropdown>
                  <ReadingStatusItem>
                    Read
                    <FontAwesomeIcon icon={faBookmark} className="read" />
                  </ReadingStatusItem>
                  <DividerDropdown />
                  <ReadingStatusItem>
                    Reading
                    <FontAwesomeIcon icon={faBookmark} className="reading" />
                  </ReadingStatusItem>
                  <DividerDropdown />
                  <ReadingStatusItem>
                    Did not Finished
                    <FontAwesomeIcon icon={faBookmark} className="dnf" />
                  </ReadingStatusItem>
                  <DividerDropdown />
                  <ReadingStatusItem>
                    Want to Read
                    <FontAwesomeIcon icon={faBookmark} className="wantread" />
                  </ReadingStatusItem>
                  <DividerDropdown />
                </AddToLibraryDropdown>
              )}
            </AddToLibrarySection>
          </BookOtherInfo>
        </BookDetailsWrapper>
      </BookCardContent>
      <DividerLine />
      <TextBox maxHeight="5.6rem" description={book.summary} />
      <DividerLine />
      <BookStatsWrapper>
        <StatWrapper>
          <BookmarkSimple />
          {categories && categoryNames && (
            <StatText>
              <p>Category</p>
              <h2>{categoryNames.join(', ')}</h2>
            </StatText>
          )}
        </StatWrapper>
        <StatWrapper>
          <BookOpen />
          <StatText>
            <p>Pages</p>
            <h2>{book.totalPages}</h2>
          </StatText>
        </StatWrapper>
        <StatWrapper>
          <CalendarBlank />
          <StatText>
            <p>Published on</p>
            <h2>{book.publishingYear}</h2>
          </StatText>
        </StatWrapper>
      </BookStatsWrapper>
    </BookCardWrapper>
  )
}
