/* eslint-disable @typescript-eslint/no-explicit-any */
export const customStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: '#181C2A',
    borderColor: 'rgba(131, 129, 217, 0.5)',
    borderRadius: 6,
    cursor: 'pointer',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#4F47A3',
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#121520',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: '#121520',
    cursor: 'pointer',
    color: state.isSelected ? '#8381D9' : '#D1D6E4',
    '&:hover': {
      backgroundColor: '#121520',
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
