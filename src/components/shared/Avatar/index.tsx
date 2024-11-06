import { ImgHTMLAttributes } from 'react'
import { AvatarContainer, AvatarDefault } from './styles'
import { CircularProgress } from '@mui/material'

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  avatarUrl: string
  isClickable?: boolean
  variant?: '' | 'medium' | 'regular' | 'bigger' | 'large'
  onClick?: () => void
  isLoading?: boolean
}

export function Avatar({
  avatarUrl,
  onClick,
  isClickable = false,
  variant = '',
  isLoading = false,
}: AvatarProps) {
  return isLoading ? (
    <CircularProgress size="1.5rem" />
  ) : (
    <AvatarContainer
      className={variant}
      style={{ cursor: isClickable ? 'pointer' : 'default' }}
      onClick={isClickable && onClick ? onClick : undefined}
    >
      <AvatarDefault
        className={`${variant} ${isClickable && 'clickable'}`}
        src={avatarUrl}
      />
    </AvatarContainer>
  )
}
