/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import * as Dialog from '@radix-ui/react-dialog'
import { Book } from 'phosphor-react'
import Select from 'react-select'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import {
  FormContainer,
  CoverSectionContainer,
  PreviewContainer,
  ImagePreview,
  DividerLine,
  WarningContainer,
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
import { checkImageExists } from '@/utils/checkImageExists'
import toast from 'react-hot-toast'

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
  publishingYear: z
    .string()
    .min(3, { message: 'Publishing year is required.' }),
  publisher: z.string().min(3, { message: 'Book publisher is required.' }),
  language: z.string().min(2, { message: 'Book language is required' }),
  isbn: z.string().min(3, { message: 'ISBN is required' }),
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
    .min(1, { message: 'You must select at least one category.' }),
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

  async function checkIfBookExists({
    isbn,
    title,
  }: {
    isbn?: string
    title?: string
  }) {
    try {
      let url = '/books/check?'
      if (isbn) url += `isbn=${encodeURIComponent(isbn)}`
      if (title) url += `${isbn ? '&' : ''}title=${encodeURIComponent(title)}`

      const response = await api.get(url)
      return response.data
    } catch (error) {
      console.error('Error checking book:', error)
      return { exists: false, book: null }
    }
  }

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

  async function getBookInfoWithGoogleBooks(isbn: string | undefined) {
    if (!isbn) return

    try {
      setIsLoading(true)
      const cleanedIsbn = isbn.replace(/[-\s]/g, '')

      const response = await api.get(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(
          cleanedIsbn,
        )}&langRestrict=en`,
      )

      const books = response.data.items?.filter(
        (book: GoogleBookProps) => book.volumeInfo.language === 'en',
      )

      if (!books?.length) {
        throw new Error('Book not found in Google Books')
      }

      const googleBook = books[0].volumeInfo
      const bookTitle = googleBook.title

      const bookCheck = await checkIfBookExists({
        isbn: cleanedIsbn,
        title: bookTitle,
      })

      if (bookCheck.exists) {
        toast.error(
          `"${bookCheck.book.name}" by "${bookCheck.book.author}" is already registered in our system!`,
        )
        setIsValidBook(false)
        return
      }

      setIsValidBook(true)
      setValue('name', bookTitle)
      setValue('author', googleBook.authors?.[0])
      setValue('summary', googleBook.description)
      setValue('totalPages', googleBook.pageCount?.toString())
      setValue('publisher', googleBook.publisher)
      setValue('publishingYear', formatDate(googleBook.publishedDate))
      setValue('isbn', cleanedIsbn)
      setValue('language', googleBook.language)

      const coverUrl = `https://covers.openlibrary.org/b/isbn/${cleanedIsbn}-L.jpg`

      if (await checkImageExists(coverUrl)) {
        setCoverPreview(coverUrl)
        setCoverUrl(coverUrl)
      }
    } catch (error) {
      toast.error(`Oops, we couldn't find any books. Please check the ISBN.`)
      setIsValidBook(false)
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

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'isbn' && isValidBook) {
        setIsValidBook(false)
        setCoverPreview(null)
        setCoverUrl(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, isValidBook])

  return (
    <Dialog.Portal>
      <BaseModal
        isLarger
        onClose={() => {
          onClose()
          setShowErrors(false)
          setCoverPreview('')
          setCoverUrl('')
          setIsValidBook(false)
          reset()
        }}
        title="Missing a Book?"
      >
        <WarningContainer>
          Submit a new book to our platform! Make sure all information is
          accurate — if in doubt, check bookstore websites or Google. Help us
          keep the platform high-quality!
        </WarningContainer>
        <FormContainer onSubmit={handleSubmit(handleSubmitBook, onInvalid)}>
          <InputContainer>
            <Controller
              name="isbn"
              control={control}
              render={({ field }) => (
                <Input
                  variant="secondary"
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

              {options && options.length && (
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
