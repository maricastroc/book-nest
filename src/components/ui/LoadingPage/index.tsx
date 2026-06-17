import { Spinner } from '@/components/ui/Spinner'
import { LoadingContent, LoadingPageWrapper } from './styles'

export function LoadingPage() {
  return (
    <LoadingPageWrapper>
      <LoadingContent>
        <Spinner size="md" />
      </LoadingContent>
    </LoadingPageWrapper>
  )
}
