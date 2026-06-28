import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { type IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { Container, NavButton } from './styles'

interface NavigationItemProps {
  active: boolean
  onClick: () => void
  icon: IconDefinition
  label: string
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  active,
  onClick,
  icon,
  label,
}) => {
  return (
    <Container>
      <NavButton className={active ? 'active' : ''} onClick={onClick}>
        <FontAwesomeIcon icon={icon} />
        <p>{label}</p>
      </NavButton>
    </Container>
  )
}
