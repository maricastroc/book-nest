import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'phosphor-react'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useEffect, useRef, useState } from 'react'
import AvatarDefaultImage from '../../../../public/assets/avatar_mockup.png'
import {
  Title,
  Content,
  StyledCheckbox,
  StyledIndicator,
  Header,
  ChangePasswordInputContainer,
  CloseButton,
} from './styles'
import { handleApiError } from '@/utils/handleApiError'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSession } from 'next-auth/react'
import { api } from '@/lib/axios'
import { useAppContext } from '@/contexts/AppContext'
import { Overlay } from '@/styles/shared'
import { Input } from '@/components/core/Input'
import { InputContainer } from '@/components/core/InputContainer'
import { FormErrors } from '@/components/core/FormErrors'
import {
  AvatarSection,
  AvatarUploadButton,
  AvatarUploadWrapper,
} from '@/pages/register/partials/SignUpForm/styles'
import { AvatarUploadPreview } from '@/components/core/AvatarUploadPreview'
import { Form } from '@/components/core/Form'
import { Button } from '@/components/core/Button'
import { truncateMiddle } from '@/utils/truncateMiddle'
import { ImageCropper } from '@/components/shared/ImageCropper'

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
        .optional(),
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

export function EditProfileModal({ onClose }: EditProfileModalProps) {
  const inputFileRef = useRef<HTMLInputElement>(null)

  const [showCropper, setShowCropper] = useState(false)

  const [originalImage, setOriginalImage] = useState<string | null>(null)

  const [avatarPath, setAvatarPath] = useState('')

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const [changePassword, setChangePassword] = useState(false)

  const { loggedUser, handleSetLoggedUser } = useAppContext()

  const { data: session } = useSession()

  const {
    control,
    handleSubmit,
    setValue,
    watch,
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
        setAvatarPreview(reader.result as string)

        setOriginalImage(reader.result as string)
        setShowCropper(true)
      }

      reader.readAsDataURL(file)
    }
  }

  const handleAvatarChangeClick = () => {
    inputFileRef.current?.click()
  }

  const handleCroppedImage = (croppedImage: string) => {
    fetch(croppedImage)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], 'avatar.jpg', {
          type: 'image/jpeg',
        })
        setValue('avatarUrl', file)
        setAvatarPreview(croppedImage)
        setShowCropper(false)
      })
  }

  async function handleEditProfile(data: EditProfileFormData) {
    if (session?.user) {
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('name', data.name)
      formData.append('user_id', session.user.id.toString())

      if (data.avatarUrl) formData.append('avatarUrl', data.avatarUrl)
      if (data.oldPassword) formData.append('oldPassword', data.oldPassword)
      if (data.password) formData.append('password', data.password)

      try {
        const response = await api.put(
          `/user/edit/${session.user.id}`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        )

        toast.success('User successfully updated!')

        handleSetLoggedUser(response.data)

        onClose()
      } catch (error) {
        handleApiError(error)
      }
    }
  }

  useEffect(() => {
    if (loggedUser) {
      setAvatarPreview(`../${loggedUser.avatarUrl}`)
      setValue('name', loggedUser.name)
      setValue('email', loggedUser.email ?? '')

      if (loggedUser?.avatarUrl) {
        setAvatarPath(truncateMiddle(loggedUser?.avatarUrl))
      }
    }
  }, [loggedUser, setValue])

  return (
    <Dialog.Portal>
      {originalImage && !!showCropper ? (
        <ImageCropper
          src={originalImage as string}
          onCrop={handleCroppedImage}
          aspectRatio={1}
          onClose={() => setShowCropper(false)}
        />
      ) : (
        <>
          <Overlay className="DialogOverlay" />
          <Content className="DialogContent">
            <Header>
              <Title className="DialogTitle">Edit Profile</Title>
              <CloseButton onClick={onClose}>
                <X alt="Close" />
              </CloseButton>
            </Header>
            <Form hasGap onSubmit={handleSubmit(handleEditProfile)}>
              <AvatarSection>
                <InputContainer>
                  <AvatarUploadWrapper>
                    <AvatarUploadButton>
                      <input
                        type="file"
                        ref={inputFileRef}
                        style={{ display: 'none' }}
                        onChange={handleAvatarChange}
                      />
                      <button
                        type="button"
                        onClick={handleAvatarChangeClick}
                        style={{
                          color: `${watch('avatarUrl')?.name ? 'white' : ''}`,
                        }}
                      >
                        {avatarPath ||
                          watch('avatarUrl')?.name ||
                          'Add your avatar'}
                      </button>
                    </AvatarUploadButton>
                  </AvatarUploadWrapper>

                  {errors.avatarUrl && (
                    <FormErrors error={errors.avatarUrl.message} />
                  )}
                </InputContainer>
                <AvatarUploadPreview
                  avatarPreview={avatarPreview}
                  defaultImage={AvatarDefaultImage.src}
                  onClick={handleAvatarChangeClick}
                />
              </AvatarSection>

              <InputContainer>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input placeholder="Name" {...field} />
                  )}
                />
                {errors.name && (
                  <FormErrors
                    error={errors.name.message && 'Name is required.'}
                  />
                )}
              </InputContainer>

              <InputContainer>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input placeholder="Email Address" {...field} />
                  )}
                />
                {errors.email && <FormErrors error={errors.email.message} />}
              </InputContainer>

              {changePassword && (
                <>
                  <InputContainer>
                    <Controller
                      name="oldPassword"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="password"
                          placeholder="Current Password"
                          {...field}
                        />
                      )}
                    />
                    {errors.oldPassword && (
                      <FormErrors
                        error={
                          errors.oldPassword.message &&
                          'Password must be at least 8 characters'
                        }
                      />
                    )}
                  </InputContainer>

                  <InputContainer>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="password"
                          placeholder="New Password"
                          {...field}
                        />
                      )}
                    />
                    {errors.password && (
                      <FormErrors
                        error={
                          errors.password.message &&
                          'New password must be at least 8 characters'
                        }
                      />
                    )}
                  </InputContainer>
                </>
              )}

              <ChangePasswordInputContainer>
                <StyledCheckbox
                  className="CheckboxRoot"
                  defaultChecked={changePassword}
                  id="c1"
                  onCheckedChange={() => setChangePassword((prev) => !prev)}
                >
                  <StyledIndicator className="CheckboxIndicator">
                    <FontAwesomeIcon icon={faCheck} />
                  </StyledIndicator>
                </StyledCheckbox>
                Change password?
              </ChangePasswordInputContainer>

              <Button
                type="submit"
                content="Update profile"
                isSubmitting={isSubmitting}
                style={{
                  marginTop: '1rem',
                }}
              />
            </Form>
          </Content>
        </>
      )}
    </Dialog.Portal>
  )
}
