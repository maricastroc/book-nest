import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { api } from '@/lib/axios'
import { useAppContext } from '@/contexts/AppContext'
import { handleApiError } from '@/utils/handleApiError'

const editProfileFormSchema = (changePassword: boolean) =>
  z
    .object({
      email: z.string().min(3, { message: 'E-mail is required.' }),
      oldPassword: changePassword
        ? z.string().min(8, { message: 'Old password is required.' })
        : z.string().optional(),
      password: changePassword
        ? z
            .string()
            .min(8, { message: 'Password must be at least 8 characters long.' })
        : z.string().optional(),
      passwordConfirm: changePassword
        ? z
            .string()
            .min(8, { message: 'Password must be at least 8 characters long.' })
        : z.string().optional(),
      name: z.string().min(3, { message: 'Name is required.' }),
      avatarUrl: z
        .custom<File>((file) => file instanceof File && file.size > 0)
        .optional()
        .nullable(),
    })
    .refine(
      (data) =>
        changePassword ? data.password === data.passwordConfirm : true,
      {
        message: "Passwords don't match",
        path: ['passwordConfirm'],
      },
    )

export type EditProfileFormData = z.infer<
  ReturnType<typeof editProfileFormSchema>
>

export function useEditProfileForm({ onClose }: { onClose: () => void }) {
  const inputFileRef = useRef<HTMLInputElement>(null)

  const [showCropper, setShowCropper] = useState(false)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [changePassword, setChangePassword] = useState(false)

  const { loggedUser, handleSetLoggedUser } = useAppContext()
  const { data: session } = useSession()

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileFormSchema(changePassword)),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      passwordConfirm: '',
    },
  })

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setValue('avatarUrl', file)
      const reader = new FileReader()
      reader.onload = () => {
        setOriginalImage(reader.result as string)
        setShowCropper(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCroppedImage = (croppedImage: string) => {
    fetch(croppedImage)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
        setValue('avatarUrl', file)
        setAvatarPreview(croppedImage)
        setShowCropper(false)
      })
  }

  const handleDeleteAvatar = () => {
    setAvatarPreview(null)
    setValue('avatarUrl', null)
    if (inputFileRef.current) inputFileRef.current.value = ''
  }

  async function handleEditProfile(data: EditProfileFormData) {
    const hasChangedName = data.name !== loggedUser?.name
    const hasChangedEmail = data.email !== loggedUser?.email
    const hasChangedAvatar = !!data.avatarUrl || avatarPreview === null
    const hasChangedPassword =
      changePassword &&
      (!!data.oldPassword || !!data.password || !!data.passwordConfirm)

    if (
      !hasChangedName &&
      !hasChangedEmail &&
      !hasChangedAvatar &&
      !hasChangedPassword
    ) {
      onClose()
    }

    if (session?.user) {
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('name', data.name)
      formData.append('user_id', session.user.id.toString())

      if (avatarPreview === null && !!loggedUser?.avatarUrl) {
        formData.append('removeAvatar', 'true')
      } else if (data.avatarUrl) {
        formData.append('avatarUrl', data.avatarUrl)
      }

      if (data.oldPassword) formData.append('oldPassword', data.oldPassword)
      if (data.password) formData.append('password', data.password)

      try {
        const response = await api.put(
          `/user/edit/${session.user.id}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } },
        )
        toast.success('User successfully updated!')
        handleSetLoggedUser(response.data)
        onClose()
      } catch (error) {
        handleApiError(error)
      } finally {
        onClose()
      }
    }
  }

  const handleClose = () => {
    setChangePassword(false)
    reset()
    onClose()
  }

  useEffect(() => {
    if (loggedUser) {
      setValue('name', loggedUser.name)
      setValue('email', loggedUser.email ?? '')
      setAvatarPreview(loggedUser?.avatarUrl ? `${loggedUser.avatarUrl}` : null)
    }
  }, [loggedUser, setValue])

  return {
    control,
    errors,
    isSubmitting,
    changePassword,
    setChangePassword,
    inputFileRef,
    avatarPreview,
    showCropper,
    originalImage,
    setShowCropper,
    handleAvatarChange,
    handleCroppedImage,
    handleDeleteAvatar,
    handleSubmit,
    handleEditProfile,
    handleClose,
  }
}
