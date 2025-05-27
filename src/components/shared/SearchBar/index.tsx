import { ChangeEvent } from 'react'
import { StyledSearchBar } from './styles'
import { MagnifyingGlass, X } from 'phosphor-react'

interface Props {
  search: string
  placeholder: string
  fullWidth?: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onClick: () => void
}

export const SearchBar = ({
  search,
  placeholder,
  onChange,
  onClick,
  fullWidth = false,
}: Props) => {
  return (
    <StyledSearchBar className={`${fullWidth ? 'full_width' : ''}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={onChange}
        spellCheck={false}
      />
      {search === '' ? <MagnifyingGlass /> : <X onClick={onClick} />}
    </StyledSearchBar>
  )
}
