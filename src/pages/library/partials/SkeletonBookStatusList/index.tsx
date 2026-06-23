import { SkeletonBox } from '@/components/ui/Skeleton'
import { Container, Header, BooksRow, BookCoverSkeleton } from './styles'

export function SkeletonBookStatusList() {
  return (
    <Container>
      <Header>
        <SkeletonBox
          style={{ width: '8rem', height: '1.1rem', borderRadius: '6px' }}
        />
        <SkeletonBox
          style={{ width: '4.5rem', height: '1rem', borderRadius: '6px' }}
        />
      </Header>
      <BooksRow>
        {Array.from({ length: 6 }).map((_, i) => (
          <BookCoverSkeleton key={i} />
        ))}
      </BooksRow>
    </Container>
  )
}
