/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faUpload } from '@fortawesome/free-solid-svg-icons'
import { Controller, Control, FieldErrors } from 'react-hook-form'
import Select from 'react-select'

import { InputContainer } from '@/components/ui/InputContainer'
import { Label } from '@/components/ui/Label'
import { FormErrors } from '@/components/ui/FormErrors'
import { customStyles } from '@/utils/getCustomStyles'

interface Props {
  control: Control<any>
  errors: FieldErrors
  coverPreview?: string | null
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  categoriesOptions: any[]
}

export function Step3Extras({
  control,
  errors,
  coverPreview,
  onCoverChange,
  categoriesOptions,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="w-full rounded-2xl border border-line bg-s1 px-10 py-10">
      <p className="mb-6 text-[0.72rem] font-semibold uppercase tracking-widest text-fg3">
        Cover image
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onCoverChange}
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        className="flex cursor-pointer items-center gap-6 rounded-xl border border-dashed border-line-strong bg-s2 p-5 transition-colors hover:border-ac/40 hover:bg-el"
      >
        <div className="flex h-24 w-17 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-s1">
          {coverPreview ? (
            <img
              src={coverPreview}
              alt="Book cover"
              className="h-full w-full object-cover"
            />
          ) : (
            <FontAwesomeIcon
              icon={faBook}
              className="text-fg3"
              style={{ fontSize: 24 }}
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <strong className="text-[0.9rem] font-semibold text-fg">
            {coverPreview ? 'Change cover image' : 'Upload cover image'}
          </strong>
          <span className="text-[0.78rem] text-fg2">
            {coverPreview
              ? 'Click to replace the current cover'
              : 'Click to select a file — JPG, PNG or WebP'}
          </span>
        </div>
        <FontAwesomeIcon
          icon={faUpload}
          className="ml-auto shrink-0 text-fg3"
          style={{ fontSize: 20 }}
        />
      </div>

      {categoriesOptions?.length > 0 && (
        <div className="mt-8">
          <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-widest text-fg3">
            Categories
          </p>
          <InputContainer>
            <Label content="Select one or more categories" />
            <Controller
              name="categories"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  menuPlacement="auto"
                  options={categoriesOptions as any}
                  styles={customStyles}
                  onChange={(selected) => field.onChange(selected)}
                />
              )}
            />
            {errors.categories && (
              <FormErrors error={errors.categories.message as string} />
            )}
          </InputContainer>
        </div>
      )}
    </div>
  )
}
