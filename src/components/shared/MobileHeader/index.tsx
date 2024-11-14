import Image from 'next/image'
import { MobileHeaderBox, MobileHeaderContent } from './styles'
import Logo from '../../../../public/assets/logo.svg'

export function MobileHeader({ ...rest }) {
  return (
    <MobileHeaderBox {...rest}>
      <MobileHeaderContent>
        <Image
          src={Logo}
          width={200}
          alt="Logo Application."
          fetchPriority="high"
          quality={100}
        />
      </MobileHeaderContent>
    </MobileHeaderBox>
  )
}
