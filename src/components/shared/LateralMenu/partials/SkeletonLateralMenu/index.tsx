import { SkeletonRatingCard } from '@/components/skeletons/SkeletonRatingCard'
import {
  Book,
  BookData,
  BookSection,
  BookWrapper,
  Container,
  Main,
  TitleAndAuthor,
} from './styles'
import { Skeleton } from '@mui/material'

const skeletonStyle = { backgroundColor: 'rgba(79, 97, 158, 0.3)' }

export function SkeletonLateralMenu() {
  return (
    <Container>
      <BookWrapper>
        <BookSection>
          <Book>
            <Skeleton
              width="100%"
              height="13rem"
              variant="rounded"
              style={skeletonStyle}
            />
          </Book>
          <BookData>
            <TitleAndAuthor>
              {[...Array(2)].map((_, i) => (
                <Skeleton
                  key={i}
                  width="100%"
                  height="2rem"
                  variant="rounded"
                  style={skeletonStyle}
                />
              ))}
            </TitleAndAuthor>
            <Skeleton
              width="100%"
              height="6rem"
              variant="rounded"
              style={skeletonStyle}
            />
          </BookData>
        </BookSection>
        <Main>
          <Skeleton
            width="100%"
            height="6rem"
            variant="rounded"
            style={skeletonStyle}
          />
        </Main>
      </BookWrapper>

      {[...Array(4)].map((_, i) => (
        <SkeletonRatingCard key={i} />
      ))}
    </Container>
  )
}
