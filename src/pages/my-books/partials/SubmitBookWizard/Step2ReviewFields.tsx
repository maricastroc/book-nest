import { Controller, Control, FieldErrors } from 'react-hook-form'

import { InputContainer } from '@/components/ui/InputContainer'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { FormErrors } from '@/components/ui/FormErrors'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  errors: FieldErrors
}

export function Step2ReviewFields({ control, errors }: Props) {
  return (
    <div className="w-full rounded-2xl border border-line bg-s1 px-10 py-10">
      <p className="mb-6 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-fg3">
        Review &amp; edit if needed
      </p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="col-span-full">
          <InputContainer>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  variant="secondary"
                  label="Title"
                  placeholder="e.g. Harry Potter and the Philosopher's Stone"
                  {...field}
                />
              )}
            />
            {errors.name && (
              <FormErrors error={errors.name.message as string} />
            )}
          </InputContainer>
        </div>
        <InputContainer>
          <Controller
            name="author"
            control={control}
            render={({ field }) => (
              <Input
                variant="secondary"
                label="Author"
                placeholder="e.g. J. K. Rowling"
                {...field}
              />
            )}
          />
          {errors.author && (
            <FormErrors error={errors.author.message as string} />
          )}
        </InputContainer>
        <InputContainer>
          <Controller
            name="publisher"
            control={control}
            render={({ field }) => (
              <Input
                variant="secondary"
                label="Publisher"
                placeholder="e.g. Bloomsbury"
                {...field}
              />
            )}
          />
          {errors.publisher && (
            <FormErrors error={errors.publisher.message as string} />
          )}
        </InputContainer>
        <InputContainer>
          <Controller
            name="publishingYear"
            control={control}
            render={({ field }) => (
              <Input
                variant="secondary"
                label="Publishing year"
                placeholder="e.g. 1997"
                {...field}
              />
            )}
          />
          {errors.publishingYear && (
            <FormErrors error={errors.publishingYear.message as string} />
          )}
        </InputContainer>
        <InputContainer>
          <Controller
            name="totalPages"
            control={control}
            render={({ field }) => (
              <Input
                variant="secondary"
                label="Pages"
                placeholder="e.g. 320"
                {...field}
              />
            )}
          />
          {errors.totalPages && (
            <FormErrors error={errors.totalPages.message as string} />
          )}
        </InputContainer>
        <div className="col-span-full">
          <InputContainer>
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <Input
                  variant="secondary"
                  label="Language"
                  placeholder="e.g. English"
                  {...field}
                />
              )}
            />
            {errors.language && (
              <FormErrors error={errors.language.message as string} />
            )}
          </InputContainer>
        </div>
        <div className="col-span-full">
          <InputContainer>
            <Controller
              name="summary"
              control={control}
              render={({ field }) => (
                <Textarea
                  label="Summary"
                  rows={5}
                  maxLength={2000}
                  placeholder="A short description of the book…"
                  {...field}
                />
              )}
            />
            {errors.summary && (
              <FormErrors error={errors.summary.message as string} />
            )}
          </InputContainer>
        </div>
      </div>
    </div>
  )
}
