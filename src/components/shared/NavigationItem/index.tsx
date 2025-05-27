import { ComponentType } from 'react'
import { Container, NavButton } from './styles'

interface NavigationItemProps {
  active: boolean
  onClick: () => void
  icon: ComponentType
  label: string
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  active,
  onClick,
  icon: Icon,
  label,
}) => {
  return (
    <Container>
      <NavButton className={active ? 'active' : ''} onClick={onClick}>
        <Icon />
        <p>{label}</p>
      </NavButton>
    </Container>
  )
}
