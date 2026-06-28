import { RefObject } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faUser } from '@fortawesome/free-solid-svg-icons'

interface AvatarUploadFieldProps {
  avatarPreview: string | null
  inputFileRef: RefObject<HTMLInputElement>
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
  errorMessage?: string
}

export function AvatarUploadField({
  avatarPreview,
  inputFileRef,
  onFileChange,
  onRemove,
  errorMessage,
}: AvatarUploadFieldProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputFileRef.current?.click()}
        className="group relative h-22 w-22 overflow-hidden rounded-full border border-line"
      >
        {avatarPreview ? (
          <img
            src={avatarPreview}
            alt="Avatar"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-el text-fg3">
            <FontAwesomeIcon icon={faUser} style={{ fontSize: 34 }} />
          </span>
        )}
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 bg-black/55 opacity-0 transition-opacity group-hover:opacity-100">
          <FontAwesomeIcon
            icon={faCamera}
            className="text-white"
            style={{ fontSize: 18 }}
          />
          <span className="text-[10px] font-medium text-white">Change</span>
        </span>
      </button>
      {avatarPreview && (
        <button
          type="button"
          onClick={onRemove}
          className="text-[12px] text-fg3 transition-colors hover:text-st-reading"
        >
          Remove photo
        </button>
      )}
      <input
        ref={inputFileRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
      />
      {errorMessage && (
        <p className="text-[12px] text-st-reading">{errorMessage}</p>
      )}
    </div>
  )
}
