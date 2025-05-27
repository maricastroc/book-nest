/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { BookProps } from '@/@types/book'
import { useAppContext } from '@/contexts/AppContext'
import { api } from '@/lib/axios'
import { CategoryProps } from '@/@types/category'
import { checkImageExists } from '@/utils/checkImageExists'
import { formatDate } from '@/utils/formatDate'
import toast from 'react-hot-toast'
import useRequest from '@/hooks/useRequest'
import { z } from 'zod'
import { formatCategoryArray } from '@/utils/formatCategoryArray'

export const submitBookFormSchema = z.object({
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
    .union([
      z.custom<File>((file) => file instanceof File, {
        message: 'Cover must be a file',
      }),
      z.string().url({
        message: 'Cover must be a valid URL',
      }),
    ])
    .refine((value) => value !== undefined, {
      message: 'Cover image is required',
    }),
  categories: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    )
    .min(1, { message: 'You must select at least one category.' }),
})

export type SubmitBookFormData = z.infer<typeof submitBookFormSchema>

interface UseSubmitBookFormProps {
  isEdit: boolean
  book?: BookProps | null
  onClose: () => void
  onUpdateBook?: (book: BookProps) => void
}

export function useSubmitBookForm({
  isEdit,
  book,
  onClose,
  onUpdateBook,
}: UseSubmitBookFormProps) {
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
      totalPages: '',
      publishingYear: '',
      coverUrl: '',
      categories: [],
      language: '',
      isbn: '',
      publisher: '',
      userId: '',
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
    } catch {
      return { exists: false, book: null }
    }
  }

  const handleCoverChangeClick = () => {
    inputFileRef.current?.click()
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
        (book: any) => book.volumeInfo.language === 'en',
      )

      if (!books?.length) throw new Error('Book not found')

      const googleBook = books[0].volumeInfo

      const bookCheck = await checkIfBookExists({
        isbn: cleanedIsbn,
        title: googleBook.title,
      })

      if (bookCheck.exists) {
        toast.error(
          `"${bookCheck.book.name}" by "${bookCheck.book.author}" already exists.`,
        )
        setIsValidBook(false)
        return
      }

      setIsValidBook(true)
      setValue('name', googleBook.title)
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
        setValue('coverUrl', coverUrl)
      }
    } catch {
      toast.error('No book found with this ISBN.')
      setIsValidBook(false)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmitBook(data: SubmitBookFormData) {
    const hasPublisherChange = data?.publisher !== book?.publisher

    const hasLanguageChange = data?.language !== book?.language

    const hasPublishingYearChange =
      data?.publishingYear !== book?.publishingYear

    const hasSummaryChange = data?.summary !== book?.summary

    const hasPagesNumberChange =
      String(data.totalPages) !== String(book?.totalPages)

    const hasCategoriesChange = !formatCategoryArray(
      data?.categories?.map((c) => c.value).sort(),
      book?.categories?.map((c: any) => c.id || (c as CategoryProps).id).sort(),
    )
    if (
      isEdit &&
      !hasPublisherChange &&
      !hasPublishingYearChange &&
      !hasSummaryChange &&
      !hasPagesNumberChange &&
      !hasLanguageChange &&
      !hasCategoriesChange
    ) {
      onClose()
      return
    }
    setShowErrors(true)

    const formData = new FormData()

    const categoryValues = data?.categories?.map(
      (category: any) => category.value,
    )

    formData.append('author', data.author)
    formData.append('name', data.name)
    formData.append('summary', data.summary)
    formData.append('totalPages', String(data.totalPages))
    formData.append('publisher', String(data.publisher || ''))
    formData.append('language', String(data.language || ''))
    formData.append('isbn', String(data.isbn || ''))
    formData.append('publishingYear', String(data.publishingYear))

    formData.append('categories', JSON.stringify(categoryValues))

    if (typeof data.coverUrl === 'string') {
      formData.append('coverUrl', data.coverUrl)
      formData.append('coverSource', 'openlibrary')
    } else if (data.coverUrl instanceof File) {
      formData.append('coverUrl', data.coverUrl)
      formData.append('coverSource', 'upload')
    }

    try {
      setIsSubmitting(true)

      const requestUrl = isEdit ? `/books/edit/${book?.id}` : '/books/create'
      const method = isEdit ? 'put' : 'post'
      const response = await api[method](requestUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      toast.success(response.data.message)

      if (onUpdateBook) {
        onUpdateBook(response.data.book)
      }

      onClose()
    } catch (error) {
      toast.error('Error submitting book.')
    } finally {
      setIsSubmitting(false)
      setShowErrors(false)
    }
  }

  useEffect(() => {
    if (loggedUser?.id) {
      setValue('userId', loggedUser.id.toString())
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
      setValue('coverUrl', book.coverUrl || '')
      setCoverPreview(book.coverUrl)
      setCoverUrl(book.coverUrl)
      setIsValidBook(true)

      if (book.publishingYear)
        setValue('publishingYear', book.publishingYear.toString())
      if (book.totalPages) setValue('totalPages', book.totalPages.toString())

      if (book.categories) {
        const formatted = book.categories.map((category) => ({
          value: (category as CategoryProps).id,
          label: (category as CategoryProps).name,
        }))

        setValue('categories', formatted)
      }
    }
  }, [isEdit, book])

  useEffect(() => {
    const subscription = watch((_, { name }) => {
      if (name === 'isbn' && isValidBook) {
        setIsValidBook(false)
        setCoverPreview(null)
        setCoverUrl(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, isValidBook])

  return {
    control,
    handleSubmit,
    handleSubmitBook,
    onInvalid: () => {
      setShowErrors(true)
      toast.error('Please correct the form errors before submitting.')
    },
    coverPreview,
    coverUrl,
    inputFileRef,
    handleCoverChange,
    handleCoverChangeClick,
    getBookInfoWithGoogleBooks,
    categoriesOptions:
      categories?.map((category) => ({
        value: category.id,
        label: category.name,
      })) ?? [],
    isValidBook,
    isSubmitting,
    isLoading,
    showErrors,
    errors,
    form: watch(),
    reset,
    setCoverPreview,
    setCoverUrl,
    setShowErrors,
    setIsValidBook,
  }
}
