/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Dialog from '@radix-ui/react-dialog'
import { Book } from 'phosphor-react'
import Select from 'react-select'
import {
  FormContainer,
  CoverSectionContainer,
  PreviewContainer,
  ImagePreview,
  DividerLine,
  WarningContainer,
} from './styles'
import { InputContainer } from '@/components/core/InputContainer'
import { Input } from '@/components/core/Input'
import { Button } from '@/components/core/Button'
import { BaseModal } from '@/components/modals/BaseModal'
import { FileInput } from '@/components/core/FileInput'
import { FormErrors } from '@/components/core/FormErrors'
import { Textarea } from '@/components/core/Textarea'
import { Label } from '@/components/core/Label'

import { disabledCustomStyles } from '@/utils/getDisabledCustomStyles'
import { customStyles } from '@/utils/getCustomStyles'
import { Controller } from 'react-hook-form'
import { BookProps } from '@/@types/book'
import { useBookForm } from '@/hooks/useSubmitBookForm'

interface SubmitBookFormModalProps {
  isEdit?: boolean
  book?: BookProps | null
  onClose: () => void
  onUpdateBook?: (book: BookProps) => void
  onCreateBook?: (book: BookProps) => void
}

export function SubmitBookFormModal({
  onClose,
  onUpdateBook,
  onCreateBook,
  isEdit = false,
  book = null,
}: SubmitBookFormModalProps) {
  const {
    control,
    handleSubmit,
    handleSubmitBook,
    onInvalid,
    coverPreview,
    coverUrl,
    handleCoverChange,
    handleCoverChangeClick,
    getBookInfoWithGoogleBooks,
    categoriesOptions,
    isValidBook,
    isSubmitting,
    isLoading,
    showErrors,
    errors,
    form,
    reset,
  } = useBookForm({
    isEdit,
    book,
    onClose,
    onUpdateBook,
    onCreateBook,
  })
  return (
    <Dialog.Portal>
      <BaseModal
        isLarger
        onClose={() => {
          onClose()
          reset()
        }}
        title={isEdit ? 'Edit your book' : 'Missing a Book?'}
      >
        <WarningContainer>
          {isEdit ? (
            <>
              You&apos;re editing a book entry. Please review and update the
              information carefully. Ensure all details remain accurate.
            </>
          ) : (
            <>
              Submit a new book to our platform! Make sure all information is
              accurate — if in doubt, check bookstore websites or Google.
            </>
          )}
        </WarningContainer>

        <FormContainer onSubmit={handleSubmit(handleSubmitBook, onInvalid)}>
          <InputContainer>
            <Controller
              name="isbn"
              control={control}
              render={({ field }) => (
                <Input
                  variant="secondary"
                  disabled={isEdit}
                  label="ISBN:"
                  placeholder="e.g. 978-0-7475-3269-9"
                  {...field}
                />
              )}
            />
            {errors.isbn && <FormErrors error={errors.isbn.message} />}
          </InputContainer>

          {!isValidBook && (
            <Button
              type="button"
              content={isLoading ? 'Loading...' : 'Get Book Information'}
              onClick={() => getBookInfoWithGoogleBooks(form?.isbn)}
              disabled={isSubmitting || !form.isbn || isLoading}
              style={{ marginTop: '1rem' }}
            />
          )}

          {isValidBook && (
            <>
              <DividerLine />
              <CoverSectionContainer>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <FileInput
                    label="Book cover:"
                    buttonText="Choose file"
                    accept="image/*"
                    isDisabled={isEdit}
                    disabled={isEdit}
                    onChange={handleCoverChange}
                    content={
                      typeof form.coverUrl === 'string'
                        ? 'OpenLibrary Cover'
                        : (form.coverUrl as File)?.name ||
                          coverUrl ||
                          'No file chosen'
                    }
                  />
                  {showErrors && !isEdit && !form.coverUrl && (
                    <FormErrors error="Cover image is required" />
                  )}
                </div>
                <PreviewContainer>
                  <ImagePreview
                    type="button"
                    onClick={handleCoverChangeClick}
                    aria-label="Book cover preview"
                  >
                    {coverPreview ? (
                      <img
                        src={coverPreview}
                        alt="Book cover preview"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <Book size={32} />
                    )}
                  </ImagePreview>
                </PreviewContainer>
              </CoverSectionContainer>

              <InputContainer>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      disabled={isEdit}
                      variant="secondary"
                      label="Book name"
                      placeholder="e.g. Harry Potter and the Philosopher's Stone"
                      {...field}
                    />
                  )}
                />
                {errors.name && <FormErrors error={errors.name.message} />}
              </InputContainer>

              <InputContainer>
                <Controller
                  name="author"
                  control={control}
                  render={({ field }) => (
                    <Input
                      disabled={isEdit}
                      variant="secondary"
                      label="Book author"
                      placeholder="e.g. J. K. Rowling"
                      {...field}
                    />
                  )}
                />
                {errors.author && <FormErrors error={errors.author.message} />}
              </InputContainer>

              <InputContainer>
                <Controller
                  name="summary"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      label="Book Summary"
                      rows={5}
                      maxLength={1000}
                      placeholder="e.g. Adaptation of the first of J.K. Rowling's popular children's novels about Harry Potter, a boy who learns on his eleventh birthday that he is the orphaned son of two powerful wizards and possesses unique magical powers of his own."
                      {...field}
                    />
                  )}
                />
                {errors.summary && (
                  <FormErrors error={errors.summary.message} />
                )}
              </InputContainer>
              <InputContainer>
                <Controller
                  name="totalPages"
                  control={control}
                  render={({ field }) => (
                    <Input
                      variant="secondary"
                      label="Pages number"
                      placeholder="e.g. 232"
                      {...field}
                    />
                  )}
                />
                {errors.totalPages && (
                  <FormErrors error={errors.totalPages.message} />
                )}
              </InputContainer>
              <InputContainer>
                <Controller
                  name="publishingYear"
                  control={control}
                  render={({ field }) => (
                    <Input
                      variant="secondary"
                      label="Publishing Year"
                      placeholder="1994"
                      {...field}
                    />
                  )}
                />
                {errors.publishingYear && (
                  <FormErrors error={errors.publishingYear.message} />
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
                      placeholder="e.g. Bloomsbury Pub Ltd"
                      {...field}
                    />
                  )}
                />
                {errors.publisher && (
                  <FormErrors error={errors.publisher.message} />
                )}
              </InputContainer>
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
                  <FormErrors error={errors.language.message} />
                )}
              </InputContainer>

              {categoriesOptions && categoriesOptions.length && (
                <InputContainer>
                  <Label content="Categories" />
                  <Controller
                    name="categories"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isMulti
                        options={categoriesOptions as any}
                        styles={
                          !isValidBook ? disabledCustomStyles : customStyles
                        }
                        onChange={(selected) => field.onChange(selected)}
                      />
                    )}
                  />
                  {errors.categories && (
                    <FormErrors error={errors.categories.message} />
                  )}
                </InputContainer>
              )}

              <Button
                type="submit"
                content={isEdit ? 'Save Changes' : 'Submit New Book'}
                disabled={isSubmitting || !isValidBook}
                style={{ marginTop: '1rem' }}
              />
            </>
          )}
        </FormContainer>
      </BaseModal>
    </Dialog.Portal>
  )
}
