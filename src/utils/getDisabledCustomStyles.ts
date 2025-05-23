/* eslint-disable @typescript-eslint/no-explicit-any */
export const disabledCustomStyles = {
  control: (provided: any) => ({
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
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#5A698F',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: '#5A698F',
    cursor: 'not-allowed',
    color: state.isSelected ? '#5A698F' : '#5A698F',
    '&:hover': {
      backgroundColor: '#5A698F',
      color: '#5A698F',
    },
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: '#5A698F',
    color: '#5A698F',
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: '#5A698F',
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: '#5A698F',
    '&:hover': {
      backgroundColor: '#5A698F',
      color: '#5A698F',
    },
  }),
}
