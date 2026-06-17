import {
  Book,
  BookData,
  BookSection,
  BookWrapper,
  Main,
  TitleAndAuthor,
} from './styles'
import { SkeletonBox } from '@/components/ui/Skeleton'

export function SkeletonMenuBookCard() {
  return (
    <BookWrapper>
      <BookSection>
        <Book>
          <SkeletonBox style={{ width: '100%', height: '13rem' }} />
        </Book>
        <BookData>
          <TitleAndAuthor>
            <SkeletonBox style={{ width: '100%', height: '2rem' }} />
            <SkeletonBox style={{ width: '100%', height: '2rem' }} />
          </TitleAndAuthor>
          <SkeletonBox style={{ width: '100%', height: '6rem' }} />
        </BookData>
      </BookSection>
      <Main>
        <SkeletonBox style={{ width: '100%', height: '6rem' }} />
      </Main>
    </BookWrapper>
  )
}
