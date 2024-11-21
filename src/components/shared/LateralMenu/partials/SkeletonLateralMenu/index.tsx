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

export function SkeletonLateralMenu() {
  return (
    <Container>
      <BookWrapper>
        <BookSection>
          <Book>
            <Skeleton
              width={'100%'}
              height={'13rem'}
              variant="rounded"
              style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
            />
          </Book>
          <BookData>
            <TitleAndAuthor>
              <Skeleton
                width={'100%'}
                height={'2rem'}
                variant="rounded"
                style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
              />
              <Skeleton
                width={'100%'}
                height={'2rem'}
                variant="rounded"
                style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
              />
            </TitleAndAuthor>
            <Skeleton
              width={'100%'}
              height={'6rem'}
              variant="rounded"
              style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
            />
          </BookData>
        </BookSection>
        <Main>
          <Skeleton
            width={'100%'}
            height={'6rem'}
            variant="rounded"
            style={{ backgroundColor: 'rgba(79, 97, 158, 0.3)' }}
          />
        </Main>
      </BookWrapper>
      <SkeletonRatingCard />
      <SkeletonRatingCard />
      <SkeletonRatingCard />
      <SkeletonRatingCard />
    </Container>
  )
}
