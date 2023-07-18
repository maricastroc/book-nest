import { ImgHTMLAttributes } from 'react'
import { AvatarContainer, AvatarDefault } from './styles'

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  avatarUrl: string
}

export function Avatar({ avatarUrl }: AvatarProps) {
  return (
    <AvatarContainer>
      <AvatarDefault src={avatarUrl} />
    </AvatarContainer>
  )
}
