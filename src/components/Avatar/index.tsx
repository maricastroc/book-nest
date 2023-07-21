import { ImgHTMLAttributes } from 'react'
import { AvatarContainer, AvatarDefault } from './styles'

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  avatarUrl: string
  onClick: () => void
}

export function Avatar({ avatarUrl, onClick }: AvatarProps) {
  return (
    <AvatarContainer onClick={() => onClick()}>
      <AvatarDefault src={avatarUrl} />
    </AvatarContainer>
  )
}
