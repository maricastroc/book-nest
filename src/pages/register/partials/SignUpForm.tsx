import { useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCamera,
  faEnvelope,
  faLock,
  faUser,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons'
import { handleApiError } from '@/utils/handleApiError'
import { api } from '@/lib/axios'
import { ImageCropper } from '@/components/ui/ImageCropper'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const signUpFormSchema = z.object({
  email: z.string().min(3, { message: 'E-mail is required.' }),
  name: z.string().min(3, { message: 'Name is required.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' }),
  avatarUrl: z
    .custom<File | undefined>()
    .refine((file) => !file || file instanceof File, {
      message: 'Avatar must be a valid file',
    })
    .optional(),
})

type SignUpFormData = z.infer<typeof signUpFormSchema>

function dataURLtoFile(dataUrl: string, filename: string): File {
  const [header, data] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg'
  const bytes = atob(data)
  const buffer = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) buffer[i] = bytes.charCodeAt(i)
  return new File([buffer], filename, { type: mime })
}

export default function SignUpForm() {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const router = useRouter()

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: SignUpFormData) {
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('name', data.name)
    if (data.avatarUrl) formData.append('avatarUrl', data.avatarUrl)

    try {
      await api.post('/user/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('User successfully registered!')
      router.push('/')
    } catch (error) {
      handleApiError(error)
    }
  }

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setValue('avatarUrl', file)
    const reader = new FileReader()
    reader.onload = () => {
      setOriginalImage(reader.result as string)
      setShowCropper(true)
    }
    reader.readAsDataURL(file)
  }

  function handleCroppedImage(croppedImage: string) {
    const file = dataURLtoFile(croppedImage, 'avatar.jpg')
    setValue('avatarUrl', file)
    setAvatarPreview(croppedImage)
    setShowCropper(false)
  }

  function handleDeleteAvatar() {
    setAvatarPreview(null)
    setValue('avatarUrl', undefined)
    if (inputFileRef.current) inputFileRef.current.value = ''
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Dialog.Root open={!!originalImage && showCropper}>
        <ImageCropper
          src={originalImage as string}
          onCrop={handleCroppedImage}
          aspectRatio={1}
          onClose={() => setShowCropper(false)}
        />
      </Dialog.Root>

      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-serif text-[1.7rem] font-semibold tracking-tight text-fg">
            Create your account
          </h2>
          <p className="mt-1 text-[13px] text-fg2">
            Join BookNest and start your reading journey.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                id="name"
                label="Name"
                icon={faUser}
                placeholder="Your full name"
                error={errors.name?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                id="email"
                label="Email"
                icon={faEnvelope}
                placeholder="you@example.com"
                error={errors.email?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                id="password"
                type="password"
                label="Password"
                icon={faLock}
                placeholder="At least 8 characters"
                error={errors.password?.message}
                {...field}
              />
            )}
          />

          <div className="flex items-center gap-3 rounded-lg border border-line bg-bg/40 p-2.5">
            <button
              type="button"
              onClick={() => inputFileRef.current?.click()}
              className="group flex flex-1 items-center gap-3 text-left"
            >
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-s2 transition-colors group-hover:border-ac/50">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faCamera}
                    className="text-fg3 transition-colors group-hover:text-ac"
                    style={{ fontSize: 18 }}
                  />
                )}
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[13px] font-medium text-fg2">
                  {avatarPreview
                    ? 'Profile picture added'
                    : 'Add profile picture'}
                </span>
                <span className="text-[11px] text-fg3">
                  Optional — you can do this later
                </span>
              </span>
            </button>
            {avatarPreview && (
              <button
                type="button"
                onClick={handleDeleteAvatar}
                className="shrink-0 px-1 text-[12px] text-fg3 transition-colors hover:text-st-reading"
              >
                Remove
              </button>
            )}
            <input
              ref={inputFileRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          {errors.avatarUrl && (
            <p className="-mt-2 text-[12px] text-st-reading">
              {errors.avatarUrl.message}
            </p>
          )}

          <Button
            type="submit"
            content="Create account"
            loadingText="Creating account…"
            icon={faUserPlus}
            isSubmitting={isSubmitting}
            className="mt-1 border-ac/60 py-3 text-[14px] font-bold shadow-[0_6px_20px_rgba(232,177,76,0.18)] hover:brightness-110 hover:shadow-[0_8px_28px_rgba(232,177,76,0.30)] disabled:opacity-60"
          />
        </form>

        <p className="text-center text-[12.5px] text-fg3">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/')}
            className="font-medium text-ac transition-opacity hover:opacity-80"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  )
}
