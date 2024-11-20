/* eslint-disable @typescript-eslint/no-explicit-any */
export const disabledCustomStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: '#8D95AF',
    borderColor: '#8D95AF',
    borderRadius: 6,
    cursor: 'not-allowed',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#8D95AF',
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#8D95AF',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: '#8D95AF',
    cursor: 'not-allowed',
    color: state.isSelected ? '#8D95AF' : '#8D95AF',
    '&:hover': {
      backgroundColor: '#8D95AF',
      color: '#8D95AF',
    },
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: '#8D95AF',
    color: '#8D95AF',
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: '#8D95AF',
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: '#8D95AF',
    '&:hover': {
      backgroundColor: '#8D95AF',
      color: '#8D95AF',
    },
  }),
}
