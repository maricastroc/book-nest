import { StylesConfig } from 'react-select'

type CategoryOption = { value: string; label: string }

export const customStyles: StylesConfig<CategoryOption, true> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'var(--color-s1)',
    borderColor: state.isFocused
      ? 'rgba(232,177,76,0.5)'
      : 'var(--color-line-strong)',
    borderRadius: 8,
    padding: '0.15rem 0.2rem',
    cursor: 'pointer',
    boxShadow: 'none',
    transition: 'border-color 150ms',
    '&:hover': {
      borderColor: 'var(--color-line-strong)',
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'var(--color-s2)',
    border: '1px solid var(--color-line-strong)',
    borderRadius: 8,
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: '200px',
    overflowY: 'auto',
    padding: '4px',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? 'rgba(232,177,76,0.15)'
      : state.isFocused
      ? 'var(--color-el)'
      : 'transparent',
    color: state.isSelected ? 'var(--color-ac)' : 'var(--color-fg2)',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: '0.9rem',
    padding: '0.625rem 0.75rem',
    '&:active': {
      backgroundColor: 'rgba(232,177,76,0.2)',
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: 'rgba(232,177,76,0.12)',
    border: '1px solid rgba(232,177,76,0.25)',
    borderRadius: 6,
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'var(--color-ac)',
    fontSize: '0.78rem',
    fontWeight: 600,
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: 'var(--color-ac)',
    borderRadius: '0 6px 6px 0',
    '&:hover': {
      backgroundColor: 'rgba(202,64,54,0.2)',
      color: 'var(--color-st-reading)',
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'var(--color-fg3)',
    fontSize: '0.9rem',
  }),
  input: (provided) => ({
    ...provided,
    color: 'var(--color-fg)',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: 'var(--color-fg3)',
    '&:hover': { color: 'var(--color-fg2)' },
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: 'var(--color-line-strong)',
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: 'var(--color-fg3)',
    '&:hover': { color: 'var(--color-fg2)' },
  }),
}
