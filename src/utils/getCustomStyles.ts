/* eslint-disable @typescript-eslint/no-explicit-any */
export const customStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: '#161D2F',
    borderColor: '#5A698F',
    borderRadius: 6,
    cursor: 'pointer',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#5A698F',
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#20263f',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: '#20263f',
    cursor: 'pointer',
    color: state.isSelected ? '#8381D9' : '#D1D6E4',
    '&:hover': {
      backgroundColor: '#20263f',
      color: '#8381D9',
    },
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: '#252D4A',
    color: '#E6E8F2',
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: '#E6E8F2',
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: '#E6E8F2',
    '&:hover': {
      backgroundColor: '#843d3d',
      color: '#E6E8F2',
    },
  }),
}
