/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import * as Dialog from '@radix-ui/react-dialog'
import { Book } from 'phosphor-react'
import Select from 'react-select'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useEffect, useRef, useState } from 'react'
import {
  FormContainer,
  CoverSectionContainer,
  PreviewContainer,
  ImagePreview,
  DividerLine,
} from './styles'
import { handleApiError } from '@/utils/handleApiError'
import { api } from '@/lib/axios'
import { customStyles } from '@/utils/getCustomStyles'
import { CategoryProps } from '@/@types/category'
import { useAppContext } from '@/contexts/AppContext'
import { BookProps } from '@/@types/book'
import { formatDate } from '@/utils/formatDate'
import { disabledCustomStyles } from '@/utils/getDisabledCustomStyles'
import useRequest from '@/utils/useRequest'
import { InputContainer } from '@/components/core/InputContainer'
import { Input } from '@/components/core/Input'
import { Button } from '@/components/core/Button'
import { BaseModal } from '@/components/modals/BaseModal'
import { FileInput } from '@/components/core/FileInput'
import { FormErrors } from '@/components/core/FormErrors'
import { Textarea } from '@/components/core/Textarea'
import { Label } from '@/components/core/Label'

interface SubmitBookFormModalProps {
  isEdit?: boolean
  book?: BookProps | null
  onClose: () => void
  onUpdateBook?: (book: BookProps) => void
  onCreateBook?: (book: BookProps) => void
}

export interface GoogleBookProps extends BookProps {
  volumeInfo: {
    language: string
    title: string
    authors: string[]
    description: string
    pageCount: number
    publishedDate: string
  }
}

const submitBookFormSchema = z.object({
  userId: z.string(),
  author: z
    .string()
    .min(3, { message: 'Author must have at least 3 characters.' }),
  name: z
    .string()
    .min(3, { message: 'Title must have at least 3 characters.' }),
  summary: z
    .string()
    .min(20, { message: 'Summary must have at least 20 characters.' }),
  publishingYear: z.string().min(3, { message: 'Invalid year.' }),
  publisher: z.string().optional(),
  language: z.string().optional(),
  isbn: z.string().optional(),
  totalPages: z.string().min(1, { message: 'Pages number is required.' }),
  coverUrl: z
    .custom<File>((file) => file instanceof File && file.size > 0)
    .optional(),
  categories: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    )
    .min(1, { message: 'At least one category is required.' }),
})

type SubmitBookFormData = z.infer<typeof submitBookFormSchema>

export function SubmitBookFormModal({
  onClose,
  onUpdateBook,
  onCreateBook,
  isEdit = false,
  book = null,
}: SubmitBookFormModalProps) {
  const inputFileRef = useRef<HTMLInputElement>(null)

  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  const [coverUrl, setCoverUrl] = useState<string | null>(null)

  const [showErrors, setShowErrors] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isValidBook, setIsValidBook] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const { loggedUser } = useAppContext()

  const { data: categories } = useRequest<CategoryProps[] | null>({
    url: '/categories',
    method: 'GET',
  })

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SubmitBookFormData>({
    resolver: zodResolver(submitBookFormSchema),
    defaultValues: {
      name: '',
      author: '',
      summary: '',
      totalPages: undefined,
      publishingYear: undefined,
      coverUrl: undefined,
    },
  })

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      setValue('coverUrl', file)
      const reader = new FileReader()
      reader.onload = () => setCoverPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleCoverChangeClick = () => {
    inputFileRef.current?.click()
  }

  const onInvalid = () => {
    setShowErrors(true)
    toast.error('Please correct any errors before submitting the form.')
  }

  async function getBookInfoWithGoogleBooks(title: string, author: string) {
    try {
      setIsLoading(true)

      const response = await api.get(
        `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
          title,
        )}+inauthor:${encodeURIComponent(author)}&langRestrict=en`,
      )

      const books = response.data.items.filter((book: GoogleBookProps) => {
        return book.volumeInfo.language === 'en'
      })

      if (books && books.length > 0) {
        setIsValidBook(true)

        const foundBook = books[0].volumeInfo

        setValue('name', foundBook?.title)
        setValue('author', foundBook?.authors?.[0])
        setValue('summary', foundBook?.description)
        setValue('totalPages', foundBook.pageCount?.toString())
        setValue('publisher', foundBook?.publisher)
        setValue('publishingYear', formatDate(foundBook?.publishedDate))
        setValue('isbn', foundBook?.industryIdentifiers[0]?.identifier)
        setValue('language', foundBook?.language)

        const isbn =
          foundBook?.industryIdentifiers.find(
            (id: { type: string }) => id.type === 'ISBN_13',
          )?.identifier ||
          foundBook?.industryIdentifiers.find(
            (id: { type: string }) => id.type === 'ISBN_10',
          )?.identifier ||
          ''

        const openLibraryCover = isbn
          ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
          : ''

        setCoverPreview(openLibraryCover)
        setCoverUrl(openLibraryCover)
      }
    } catch (error) {
      if (error) {
        toast.error(
          'The book information could not be verified. Please check the title and author.',
        )

        setIsValidBook(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmitBook(data: SubmitBookFormData) {
    setShowErrors(true)

    const formData = new FormData()

    formData.append('author', data.author)
    formData.append('name', data.name)
    formData.append('summary', data.summary)
    formData.append('totalPages', String(data.totalPages))
    formData.append('publisher', String(data.publisher || ''))
    formData.append('language', String(data.language || ''))
    formData.append('isbn', String(data.isbn || ''))
    formData.append('publishingYear', String(data.publishingYear))

    if (data.coverUrl) formData.append('coverUrl', data.coverUrl)

    const categoryValues = data?.categories?.map(
      (category: any) => category.value,
    )

    formData.append('categories', JSON.stringify(categoryValues))

    try {
      setIsSubmitting(true)

      const requestUrl = isEdit ? `/books/edit/${book?.id}` : '/books/create'

      const method = isEdit ? 'put' : 'post'

      const response = await api[method](requestUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      toast.success(response.data.message)

      if (isEdit && onUpdateBook) {
        onUpdateBook(response.data.book)

        onClose()
      }

      if (!isEdit && onCreateBook) {
        onCreateBook(response.data.book)

        onClose()
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsSubmitting(false)
      setShowErrors(false)
    }
  }

  const options = categories?.map((category) => ({
    value: category.id,
    label: category.name,
  }))

  useEffect(() => {
    if (loggedUser) {
      setValue('userId', loggedUser?.id?.toString())
    }
  }, [loggedUser])

  useEffect(() => {
    if (isEdit && book) {
      setValue('author', book.author)
      setValue('summary', book.summary)
      setValue('name', book.name)
      setValue('publisher', book.publisher || '')
      setValue('language', book.language || '')
      setValue('isbn', book.isbn || '')

      setIsValidBook(true)

      if (book?.publishingYear) {
        setValue('publishingYear', book.publishingYear.toString())
      }

      if (book?.totalPages) {
        setValue('totalPages', book.totalPages.toString())
      }

      if (book?.categories) {
        const formattedCategories = (book.categories as CategoryProps[]).map(
          (category) => ({
            value: category.id,
            label: category.name,
          }),
        )

        setValue('categories', formattedCategories)
      }

      setCoverPreview(book.coverUrl)
      setCoverUrl(book.coverUrl)
    }
  }, [isEdit, book])

  const form = watch()

  return (
    <Dialog.Portal>
      <BaseModal
        isLarger
        onClose={() => {
          onClose()
          setShowErrors(false)
          reset()
        }}
        title="Missing a Book?"
      >
        <p>
          Here you can submit a new book to our platform! Just fill the fields
          above:
        </p>
        <FormContainer onSubmit={handleSubmit(handleSubmitBook, onInvalid)}>
          <CoverSectionContainer>
            <div style={{ flex: 1, minWidth: 0 }}>
              <FileInput
                label="Book cover:"
                buttonText="Choose file"
                accept="image/*"
                onChange={handleCoverChange}
                content={
                  watch('coverUrl')?.name
                    ? watch('coverUrl')?.name
                    : coverUrl || 'No file chosen'
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
                  label="Book name:"
                  placeholder="e.g. The Lord of the Rings"
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
                  label="Book author:"
                  placeholder="e.g. J.R.R. Tolkien"
                  {...field}
                />
              )}
            />
            {errors.author && <FormErrors error={errors.author.message} />}
          </InputContainer>

          <Button
            type="button"
            content={isLoading ? 'Loading...' : 'Get Book Information'}
            onClick={() => getBookInfoWithGoogleBooks(form.name, form.author)}
            disabled={isSubmitting || !form.name || !form.author || isLoading}
            style={{ marginTop: '1rem' }}
          />

          {isValidBook && (
            <>
              <DividerLine />
              <InputContainer>
                <Controller
                  name="summary"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      label="Book Summary:"
                      rows={5}
                      maxLength={500}
                      {...field}
                    />
                  )}
                />
                {errors.summary && (
                  <FormErrors error={errors.summary.message} />
                )}
              </InputContainer>
              <InputContainer>
                <Input
                  label="Pages Number:"
                  disabled={!isValidBook}
                  type="number"
                  placeholder="e.g. 1137"
                  {...register('totalPages')}
                />
                {errors.totalPages && (
                  <FormErrors error={errors.totalPages.message} />
                )}
              </InputContainer>
              <InputContainer>
                <Input
                  label="Publishing Year:"
                  disabled={!isValidBook}
                  type="text"
                  placeholder="e.g. 1954"
                  {...register('publishingYear')}
                />
                {errors.publishingYear && (
                  <FormErrors error={errors.publishingYear.message} />
                )}
              </InputContainer>
              <InputContainer>
                <Input
                  label="Publisher:"
                  disabled={!isValidBook}
                  type="text"
                  placeholder="e.g. Raincoast Books"
                  {...register('publisher')}
                />
                {errors.publisher && (
                  <FormErrors error={errors.publisher.message} />
                )}
              </InputContainer>
              <InputContainer>
                <Input
                  label="Language:"
                  disabled={!isValidBook}
                  type="text"
                  placeholder="e.g. English"
                  {...register('language')}
                />
                {errors.language && (
                  <FormErrors error={errors.language.message} />
                )}
              </InputContainer>
              <InputContainer>
                <Input
                  label="ISBN:"
                  disabled={!isValidBook}
                  type="text"
                  placeholder="e.g. 978-316148410"
                  {...register('isbn')}
                />
                {errors.isbn && <FormErrors error={errors.isbn.message} />}
              </InputContainer>

              {options && options.length && (
                <InputContainer>
                  <Label content="Categories:" />
                  <Controller
                    name="categories"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isMulti
                        options={options as any}
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
