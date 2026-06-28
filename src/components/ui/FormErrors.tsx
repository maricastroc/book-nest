import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

interface FormErrorsProps {
  error: string | undefined | null
}

export const FormErrors = ({ error }: FormErrorsProps) => {
  if (!error) return null

  return (
    <div className="flex items-center gap-1.5">
      <FontAwesomeIcon
        icon={faCircleXmark}
        className="text-[0.8rem] text-red-400"
      />
      <p className="text-[0.8375rem] text-fg2">{error}</p>
    </div>
  )
}
