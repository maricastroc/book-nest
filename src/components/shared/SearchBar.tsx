import { ChangeEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'
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
    <div
      className={`relative rounded-xl border border-line bg-s1 transition-colors hover:border-line-strong focus-within:border-ac/50 ${
        fullWidth ? 'w-full' : 'w-full lg:w-[60%] lg:max-w-100'
      }`}
    >
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg3"
        style={{ fontSize: 17 }}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={onChange}
        spellCheck={false}
        className="w-full rounded-xl border-0 bg-transparent py-3 pl-11 pr-10 text-[14px] text-fg outline-none placeholder:text-fg3"
      />
      {search && (
        <button
          onClick={onClick}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fg3 transition-colors hover:text-fg"
        >
          <FontAwesomeIcon icon={faXmark} style={{ fontSize: 15 }} />
        </button>
      )}
    </div>
  )
}
