import * as Dialog from '@radix-ui/react-dialog'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import AvatarDefaultImage from '../../../../public/assets/avatar_mockup.png'
import { handleApiError } from '@/utils/handleApiError'
import { useSession } from 'next-auth/react'
import { api } from '@/lib/axios'
import { useAppContext } from '@/contexts/AppContext'
import { ImageCropper } from '@/components/ui/ImageCropper'
import { BaseModal } from '../BaseModal'

interface EditProfileModalProps {
  onClose: () => void
}

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

type EditProfileFormData = z.infer<ReturnType<typeof editProfileFormSchema>>

const inputClass =
  'w-full rounded-lg border border-line bg-bg px-3.5 py-2.5 text-[15px] text-fg outline-none transition-colors placeholder:text-fg3 focus:border-ac/50'
const labelClass = 'mb-1.5 block text-[12px] font-medium text-fg2'
const sectionLabelClass =
  'text-[10px] font-semibold uppercase tracking-[0.16em] text-fg3'

export function EditProfileModal({ onClose }: EditProfileModalProps) {
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

  const handleDeleteAvatar = () => {
    setAvatarPreview(null)
    setValue('avatarUrl', null)
    if (inputFileRef.current) inputFileRef.current.value = ''
  }

  useEffect(() => {
    if (loggedUser) {
      setValue('name', loggedUser.name)
      setValue('email', loggedUser.email ?? '')
      setAvatarPreview(loggedUser?.avatarUrl ? `${loggedUser.avatarUrl}` : null)
    }
  }, [loggedUser, setValue])

  const handleClose = () => {
    setChangePassword(false)
    reset()
    onClose()
  }

  if (originalImage && showCropper) {
    return (
      <Dialog.Portal>
        <ImageCropper
          src={originalImage}
          onCrop={handleCroppedImage}
          aspectRatio={1}
          onClose={() => setShowCropper(false)}
        />
      </Dialog.Portal>
    )
  }

  return (
    <Dialog.Portal>
      <BaseModal
        onClose={handleClose}
        title="Edit Profile"
        description="Keep your public profile up to date."
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-line px-4 py-2.5 text-[14px] font-medium text-fg2 transition-colors hover:border-line-strong hover:text-fg"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="editProfileForm"
              disabled={isSubmitting}
              className="rounded-lg bg-ac px-5 py-2.5 text-[14px] font-semibold text-ac-ink transition-[filter] hover:brightness-110 disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        }
      >
        <form
          id="editProfileForm"
          onSubmit={handleSubmit(handleEditProfile)}
          className="flex flex-col gap-7"
        >
          {/* Avatar block */}
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => inputFileRef.current?.click()}
              className="group relative h-22 w-22 overflow-hidden rounded-full border border-line"
            >
              <img
                src={avatarPreview || AvatarDefaultImage.src}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 bg-black/55 opacity-0 transition-opacity group-hover:opacity-100">
                <FontAwesomeIcon
                  icon={faCamera}
                  className="text-white"
                  style={{ fontSize: 18 }}
                />
                <span className="text-[10px] font-medium text-white">
                  Change
                </span>
              </span>
            </button>
            {avatarPreview && (
              <button
                type="button"
                onClick={handleDeleteAvatar}
                className="text-[12px] text-fg3 transition-colors hover:text-st-reading"
              >
                Remove photo
              </button>
            )}
            <input
              ref={inputFileRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            {errors.avatarUrl && (
              <p className="text-[12px] text-st-reading">
                {errors.avatarUrl.message}
              </p>
            )}
          </div>

          {/* Personal information */}
          <div className="flex flex-col gap-4 border-t border-line pt-6">
            <p className={sectionLabelClass}>Personal Information</p>

            <div>
              <label htmlFor="name" className={labelClass}>
                Name
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input id="name" className={inputClass} {...field} />
                )}
              />
              {errors.name && (
                <p className="mt-1 text-[12px] text-st-reading">
                  Name is required.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input id="email" className={inputClass} {...field} />
                )}
              />
              {errors.email && (
                <p className="mt-1 text-[12px] text-st-reading">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Security */}
          <div className="flex flex-col gap-4 border-t border-line pt-6">
            <p className={sectionLabelClass}>Security</p>

            <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-fg2">
              <input
                type="checkbox"
                checked={changePassword}
                onChange={() => setChangePassword((prev) => !prev)}
                className="h-4 w-4 accent-[var(--color-ac)]"
              />
              I want to change my password
            </label>

            {changePassword && (
              <>
                <div>
                  <label htmlFor="oldPassword" className={labelClass}>
                    Current password
                  </label>
                  <Controller
                    name="oldPassword"
                    control={control}
                    render={({ field }) => (
                      <input
                        id="oldPassword"
                        type="password"
                        className={inputClass}
                        {...field}
                      />
                    )}
                  />
                  {errors.oldPassword && (
                    <p className="mt-1 text-[12px] text-st-reading">
                      Password must be at least 8 characters.
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className={labelClass}>
                    New password
                  </label>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <input
                        id="password"
                        type="password"
                        className={inputClass}
                        {...field}
                      />
                    )}
                  />
                  {errors.password && (
                    <p className="mt-1 text-[12px] text-st-reading">
                      New password must be at least 8 characters.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </form>
      </BaseModal>
    </Dialog.Portal>
  )
}
