import { CircularProgress } from '@mui/material'
import { LoadingContent, LoadingPageWrapper } from './styles'

export function LoadingPage() {
  return (
    <LoadingPageWrapper>
      <LoadingContent>
        <CircularProgress size="3rem" style={{ color: '#8381D9' }} />
      </LoadingContent>
    </LoadingPageWrapper>
  )
}
