/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import * as Dialog from '@radix-ui/react-dialog'
import { Book, Pencil, X } from 'phosphor-react'
import Select from 'react-select'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useEffect, useRef, useState } from 'react'
import {
  Title,
  Content,
  CloseButton,
  FormContainer,
  ImageInput,
  Input,
  Header,
  Textarea,
  CoverSectionContainer,
  PreviewContainer,
  ImagePreview,
  EditBtn,
} from './styles'
import { CustomLabel } from '@/components/shared/Label'
import { FormErrors } from '@/components/shared/FormErrors'
import { InputContainer } from '@/components/shared/InputContainer'
import { handleApiError } from '@/utils/handleApiError'
import { api } from '@/lib/axios'
import { Description, Overlay } from '@/styles/shared'
import { CustomButton } from '@/components/shared/Button'
import { customStyles } from '@/utils/getCustomStyles'
import { CategoryProps } from '@/@types/category'
import { useAppContext } from '@/contexts/AppContext'
import { BookProps } from '@/@types/book'

interface SubmitBookFormModalProps {
  isEdit?: boolean
  book?: BookProps | null
  onClose: () => Promise<void>
  onCloseWithoutUpdate: () => void
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
  onCloseWithoutUpdate,
  isEdit = false,
  book = null,
}: SubmitBookFormModalProps) {
  const inputFileRef = useRef<HTMLInputElement>(null)

  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  const [coverUrl, setCoverUrl] = useState<string | null>(null)

  const [showErrors, setShowErrors] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const { loggedUser, categories } = useAppContext()

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
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

  async function handleSubmitBook(data: SubmitBookFormData) {
    setShowErrors(true)

    const formData = new FormData()

    formData.append('author', data.author)
    formData.append('name', data.name)
    formData.append('summary', data.summary)
    formData.append('totalPages', String(data.totalPages))
    formData.append('publishingYear', String(data.publishingYear))

    if (data.coverUrl) formData.append('coverUrl', data.coverUrl)

    const categoryValues = data?.categories?.map(
      (category: any) => category.value,
    )

    formData.append('categories', JSON.stringify(categoryValues))

    try {
      setIsSubmitting(true)
      console.log(data.coverUrl)
      const requestUrl = isEdit ? `/books/edit/${book?.id}` : '/books/create'
      const method = isEdit ? 'put' : 'post'

      const response = await api[method](requestUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      toast.success(response.data.message)

      await onClose()
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
      setValue('userId', loggedUser.id)
    }
  }, [loggedUser])

  useEffect(() => {
    if (isEdit && book) {
      setValue('author', book.author)
      setValue('summary', book.summary)
      setValue('name', book.name)

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
      <Overlay className="DialogOverlay" onClick={onCloseWithoutUpdate} />
      <Content className="DialogContent">
        <Header>
          <Title className="DialogTitle">
            <h2>Missing a Book?</h2>
            <p>
              Here you can submit a new book to our platform! Just fill the
              fields above:
            </p>
          </Title>
          <CloseButton onClick={onCloseWithoutUpdate}>
            <X alt="Close" />
          </CloseButton>
        </Header>
        <Description className="DialogDescription">
          <FormContainer onSubmit={handleSubmit(handleSubmitBook, onInvalid)}>
            <CoverSectionContainer>
              <PreviewContainer>
                <ImagePreview>
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover Preview" />
                  ) : (
                    <Book />
                  )}
                </ImagePreview>
                <EditBtn type="button" onClick={handleCoverChangeClick}>
                  <Pencil />
                </EditBtn>
              </PreviewContainer>
              <InputContainer>
                <CustomLabel>Book cover here:</CustomLabel>
                <ImageInput>
                  <input
                    type="file"
                    ref={inputFileRef}
                    style={{ display: 'none' }}
                    onChange={handleCoverChange}
                  />
                  <button type="button" onClick={handleCoverChangeClick}>
                    Choose File
                  </button>
                  <span>
                    {watch('coverUrl')?.name
                      ? watch('coverUrl')?.name
                      : coverUrl}
                  </span>
                </ImageInput>
                {showErrors && !isEdit && !form.coverUrl && (
                  <FormErrors error={'Cover Image is required.'} />
                )}
              </InputContainer>
            </CoverSectionContainer>
            <InputContainer>
              <CustomLabel>Book Name</CustomLabel>
              <Input
                placeholder="e.g. The Lord of the Rings"
                {...register('name')}
              />
              {errors.name && <FormErrors error={errors.name.message} />}
            </InputContainer>

            <InputContainer>
              <CustomLabel>Book Author</CustomLabel>
              <Input
                type="text"
                placeholder="e.g. J.R.R. Tolkien"
                {...register('author')}
              />
              {errors.author && <FormErrors error={errors.author.message} />}
            </InputContainer>
            <InputContainer>
              <CustomLabel>Book Summary</CustomLabel>
              <Textarea
                placeholder="e.g. The Lord of the Rings is the saga of a group of sometimes reluctant heroes who set forth to save their world from consummate evil. Its many worlds and creatures were drawn from Tolkien’s extensive knowledge of philology and folklore."
                {...register('summary')}
              />
              {errors.summary && <FormErrors error={errors.summary.message} />}
            </InputContainer>
            <InputContainer>
              <CustomLabel>Pages Number</CustomLabel>
              <Input
                type="number"
                placeholder="e.g. 1137"
                {...register('totalPages')}
              />
              {errors.totalPages && (
                <FormErrors error={errors.totalPages.message} />
              )}
            </InputContainer>
            <InputContainer>
              <CustomLabel>Publishing Year</CustomLabel>
              <Input
                type="number"
                placeholder="e.g. 1954"
                {...register('publishingYear')}
              />
              {errors.publishingYear && (
                <FormErrors error={errors.publishingYear.message} />
              )}
            </InputContainer>

            {options && options.length && (
              <InputContainer>
                <CustomLabel>Book Categories</CustomLabel>
                <Controller
                  name="categories"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isMulti
                      options={options as any}
                      styles={customStyles}
                      onChange={(selected) => field.onChange(selected)}
                    />
                  )}
                />
                {errors.categories && (
                  <FormErrors error={errors.categories.message} />
                )}
              </InputContainer>
            )}

            <CustomButton
              type="submit"
              content={isEdit ? 'Save Changes' : 'Submit New Book'}
              disabled={isSubmitting}
            />
          </FormContainer>
        </Description>
      </Content>
    </Dialog.Portal>
  )
}
