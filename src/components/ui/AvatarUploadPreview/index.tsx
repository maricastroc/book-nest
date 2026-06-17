import { AvatarUploadPreviewContainer, AvatarImage } from './styles'

interface AvatarUploadPreviewProps {
  avatarPreview?: string | null
  defaultImage: string
}

export function AvatarUploadPreview({
  avatarPreview,
  defaultImage,
}: AvatarUploadPreviewProps) {
  return (
    <AvatarUploadPreviewContainer>
      <AvatarImage
        src={avatarPreview || defaultImage}
        alt={avatarPreview ? 'Avatar Preview' : 'Default Avatar'}
        isDefault={!avatarPreview}
      />
    </AvatarUploadPreviewContainer>
  )
}
