import { CSSObjectWithLabel } from 'react-select'

export const disabledCustomStyles = {
  control: (provided: CSSObjectWithLabel) => ({
    ...provided,
    backgroundColor: '#5A698F',
    borderColor: '#5A698F',
    borderRadius: 6,
    cursor: 'not-allowed',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#5A698F',
    },
  }),
  menu: (provided: CSSObjectWithLabel) => ({
    ...provided,
    backgroundColor: '#5A698F',
  }),
  option: (provided: CSSObjectWithLabel, state: { isSelected: boolean }) => ({
    ...provided,
    backgroundColor: '#5A698F',
    cursor: 'not-allowed',
    color: state.isSelected ? '#5A698F' : '#5A698F',
    '&:hover': {
      backgroundColor: '#5A698F',
      color: '#5A698F',
    },
  }),
  multiValue: (provided: CSSObjectWithLabel) => ({
    ...provided,
    backgroundColor: '#5A698F',
    color: '#5A698F',
  }),
  multiValueLabel: (provided: CSSObjectWithLabel) => ({
    ...provided,
    color: '#5A698F',
  }),
  multiValueRemove: (provided: CSSObjectWithLabel) => ({
    ...provided,
    color: '#5A698F',
    '&:hover': {
      backgroundColor: '#5A698F',
      color: '#5A698F',
    },
  }),
}
