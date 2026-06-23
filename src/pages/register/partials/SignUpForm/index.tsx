import { useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { handleApiError } from '@/utils/handleApiError'
import { api } from '@/lib/axios'
import { z } from 'zod'
import { TrashSimple } from 'phosphor-react'

import { InputContainer } from '@/components/ui/InputContainer'
import { FormErrors } from '@/components/ui/FormErrors'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Form } from '@/components/ui/Form'
import { AvatarUploadPreview } from '@/components/ui/AvatarUploadPreview'
import { ImageCropper } from '@/components/ui/ImageCropper'
import { FileInput } from '@/components/ui/FileInput'
import AvatarDefaultImage from '../../../../../public/assets/avatar_mockup.png'

import {
  Wrapper,
  FormHeader,
  AvatarSection,
  AvatarLabel,
  AvatarActions,
  AvatarUploadWrapper,
  DeleteAvatarButton,
  LoginLink,
} from './styles'

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

export default function SignUpForm() {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const router = useRouter()

  const {
    handleSubmit,
    control,
    setValue,
    watch,
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
    if (data?.avatarUrl) formData.append('avatarUrl', data.avatarUrl)

    try {
      setIsLoading(true)
      await api.post(`/user/create`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('User successfully registered!')
      router.push('/')
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setValue('avatarUrl', file)
      const reader = new FileReader()
      reader.onload = () => {
        setAvatarPreview(reader.result as string)
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
    setValue('avatarUrl', undefined)
    if (inputFileRef.current) inputFileRef.current.value = ''
  }

  return (
    <Wrapper>
      <FormHeader>
        <h2>Create your account</h2>
        <p>Join BookNest and start your reading journey.</p>
      </FormHeader>

      <Dialog.Root open={!!originalImage && showCropper}>
        <ImageCropper
          src={originalImage as string}
          onCrop={handleCroppedImage}
          aspectRatio={1}
          onClose={() => setShowCropper(false)}
        />
      </Dialog.Root>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <AvatarSection>
          <AvatarUploadPreview
            avatarPreview={avatarPreview}
            defaultImage={AvatarDefaultImage.src}
          />
          <AvatarLabel>
            {avatarPreview ? 'Profile picture selected' : 'Add profile picture'}
          </AvatarLabel>
          <AvatarActions>
            <AvatarUploadWrapper>
              <FileInput
                hasBorder={false}
                buttonText="Choose file"
                accept="image/*"
                onChange={handleAvatarChange}
                content={watch('avatarUrl')?.name || ''}
              />
            </AvatarUploadWrapper>
            {avatarPreview && (
              <DeleteAvatarButton
                type="button"
                onClick={handleDeleteAvatar}
                aria-label="Remove avatar"
              >
                <TrashSimple size={18} />
              </DeleteAvatarButton>
            )}
          </AvatarActions>
          {errors.avatarUrl && <FormErrors error={errors.avatarUrl.message} />}
        </AvatarSection>

        <InputContainer>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                variant="secondary"
                label="Name"
                placeholder="Your full name"
                {...field}
              />
            )}
          />
          {errors.name && <FormErrors error={errors.name.message} />}
        </InputContainer>

        <InputContainer>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                variant="secondary"
                label="Email Address"
                placeholder="you@example.com"
                {...field}
              />
            )}
          />
          {errors.email && <FormErrors error={errors.email.message} />}
        </InputContainer>

        <InputContainer>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                variant="secondary"
                label="Password"
                type="password"
                placeholder="At least 8 characters"
                {...field}
              />
            )}
          />
          {errors.password && <FormErrors error={errors.password.message} />}
        </InputContainer>

        <Button
          type="submit"
          content="Create your account"
          isSubmitting={isSubmitting || isLoading}
          style={{ marginTop: '0.75rem' }}
        />
      </Form>

      <LoginLink>
        Already have an account?{' '}
        <a onClick={() => router.push('/')} href="#">
          Login
        </a>
      </LoginLink>
    </Wrapper>
  )
}
