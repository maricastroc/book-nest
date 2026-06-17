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
import { SkeletonBox } from '@/components/ui/Skeleton'

export function SkeletonLateralMenu() {
  return (
    <Container>
      <BookWrapper>
        <BookSection>
          <Book>
            <SkeletonBox style={{ width: '100%', height: '13rem' }} />
          </Book>
          <BookData>
            <TitleAndAuthor>
              {[...Array(2)].map((_, i) => (
                <SkeletonBox
                  key={i}
                  style={{ width: '100%', height: '2rem' }}
                />
              ))}
            </TitleAndAuthor>
            <SkeletonBox style={{ width: '100%', height: '6rem' }} />
          </BookData>
        </BookSection>
        <Main>
          <SkeletonBox style={{ width: '100%', height: '6rem' }} />
        </Main>
      </BookWrapper>

      {[...Array(4)].map((_, i) => (
        <SkeletonRatingCard key={i} />
      ))}
    </Container>
  )
}
