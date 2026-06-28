import { ImgHTMLAttributes } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { Spinner } from '@/components/ui/Spinner'
import Image from 'next/image'

type AvatarVariant = '' | 'small' | 'medium' | 'regular' | 'bigger' | 'large'

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  avatarUrl?: string | null
  isClickable?: boolean
  variant?: AvatarVariant
  onClick?: () => void
  isLoading?: boolean
}

const sizes: Record<AvatarVariant, { box: string; img: number }> = {
  '': { box: 'h-[42px] w-[42px]', img: 40 },
  small: { box: 'h-[30px] w-[30px]', img: 28 },
  medium: { box: 'h-9 w-9', img: 34 },
  regular: { box: 'h-[42px] w-[42px]', img: 40 },
  bigger: { box: 'h-12 w-12', img: 46 },
  large: { box: 'h-[70px] w-[70px] mb-6', img: 66 },
}

const ringClass =
  'rounded-full outline outline-[1.5px] outline-offset-2 outline-ac/50'

export function Avatar({
  avatarUrl,
  onClick,
  isClickable = false,
  variant = '',
  isLoading = false,
}: AvatarProps) {
  if (isLoading) return <Spinner size="sm" />

  const { box, img } = sizes[variant]
  const hoverClass = isClickable ? 'transition hover:brightness-[1.15]' : ''

  return (
    <span
      onClick={isClickable && onClick ? onClick : undefined}
      className={`bn-scope inline-flex shrink-0 items-center justify-center rounded-full bg-s2 ${box} ${
        isClickable ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      {avatarUrl ? (
        <Image
          width={img}
          height={img}
          src={avatarUrl}
          alt="User Profile Photo"
          style={{ width: img, height: img }}
          className={`object-cover ${ringClass} ${hoverClass}`}
        />
      ) : (
        <span
          aria-label="User Profile Photo"
          style={{ width: img, height: img }}
          className={`inline-flex items-center justify-center bg-el text-fg3 ${ringClass} ${hoverClass}`}
        >
          <FontAwesomeIcon
            icon={faUser}
            style={{ fontSize: Math.round(img * 0.48) }}
          />
        </span>
      )}
    </span>
  )
}
