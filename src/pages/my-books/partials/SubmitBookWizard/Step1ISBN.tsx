import { Controller, Control, FieldErrors } from 'react-hook-form'

import { InputContainer } from '@/components/ui/InputContainer'
import { Input } from '@/components/ui/Input'
import { FormErrors } from '@/components/ui/FormErrors'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  errors: FieldErrors
  isbnValue?: string
  isLoading: boolean
  onFind: () => void
}

export function Step1ISBN({
  control,
  errors,
  isbnValue,
  isLoading,
  onFind,
}: Props) {
  return (
    <div className="w-full rounded-2xl border border-line bg-s1 px-10 py-10">
      <p className="mb-6 text-[0.85rem] leading-relaxed text-fg2">
        Enter the ISBN of the book you want to submit. We&apos;ll fetch the
        details automatically from Google Books.
      </p>

      <div className="flex flex-col gap-3">
        <InputContainer>
          <Controller
            name="isbn"
            control={control}
            render={({ field }) => (
              <Input
                variant="secondary"
                label="ISBN"
                placeholder="e.g. 978-0-7475-3269-9"
                {...field}
              />
            )}
          />
          {errors.isbn && <FormErrors error={errors.isbn.message as string} />}
        </InputContainer>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onFind}
            disabled={!isbnValue || isLoading}
            className="flex shrink-0 items-center rounded-lg bg-ac px-4 py-2 text-[13px] font-bold text-ac-ink transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {isLoading ? 'Searching…' : 'Find Book'}
          </button>
        </div>
      </div>
    </div>
  )
}
