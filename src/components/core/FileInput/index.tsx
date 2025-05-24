import { InputHTMLAttributes, useRef } from 'react'
import { Upload } from 'phosphor-react'
import {
  CustomFileButton,
  FileNameDisplay,
  HiddenFileInput,
  InputContainer,
  StyledLabel,
} from './styles'

interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isDisabled?: boolean
  label?: string
  buttonText?: string
  content?: string
  hasBorder?: boolean
}

export const FileInput = ({
  label,
  content,
  buttonText = 'Choose File',
  hasBorder = true,
  isDisabled = false,
  onChange,
  ...props
}: FileInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <div>
      {label && <StyledLabel style={{ marginLeft: 0 }}>{label}</StyledLabel>}
      <InputContainer hasBorder={hasBorder}>
        <HiddenFileInput
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          {...props}
        />
        <CustomFileButton
          disabled={isDisabled}
          type="button"
          onClick={handleButtonClick}
        >
          <Upload size={14} style={{ marginRight: '0.5rem' }} />
          {buttonText}
        </CustomFileButton>
        <FileNameDisplay>{content || 'No file chosen'}</FileNameDisplay>
      </InputContainer>
    </div>
  )
}
