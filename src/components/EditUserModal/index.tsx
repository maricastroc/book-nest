import * as Dialog from '@radix-ui/react-dialog'
import { Pencil, User, X } from 'phosphor-react'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useEffect, useRef, useState } from 'react'
import {
  Overlay,
  Description,
  Title,
  Content,
  StyledCheckbox,
  StyledIndicator,
  CloseButton,
  FormContainer,
  ImageInput,
  Input,
  ImagePreview,
  EditBtn,
  PreviewContainer,
  AvatarSectionContainer,
  Header,
  ChangePasswordInputContainer,
} from './styles'
import { CustomLabel } from '../shared/Label'
import { FormErrors } from '../shared/FormErrors'
import { InputContainer } from '../shared/InputContainer'
import { CustomButton } from '../shared/Button'
import { handleAxiosError } from '@/utils/handleAxiosError'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSession } from 'next-auth/react'
import { api } from '@/lib/axios'
import { CircularProgress } from '@mui/material'

interface SignUpModalProps {
  onClose: () => void
}

const signUpFormSchema = (changePassword: boolean) =>
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

type SignUpFormData = z.infer<ReturnType<typeof signUpFormSchema>>

export function EditUserModal({ onClose }: SignUpModalProps) {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [changePassword, setChangePassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema(changePassword)),
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
      reader.onload = () => setAvatarPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarChangeClick = () => {
    inputFileRef.current?.click()
  }

  async function handleEditUser(data: SignUpFormData) {
    if (session?.user) {
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('name', data.name)
      formData.append('user_id', session.user.id.toString())

      if (data.avatarUrl) formData.append('avatarUrl', data.avatarUrl)
      if (data.oldPassword) formData.append('oldPassword', data.oldPassword)
      if (data.password) formData.append('password', data.password)

      try {
        await api.put(`/user/edit/${session.user.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        toast.success('User successfully updated!')
        onClose()
      } catch (error) {
        handleAxiosError(error)
      }
    }
  }

  useEffect(() => {
    const loadUser = async () => {
      if (session?.user) {
        setIsLoading(true)
        try {
          const response = await api.get(`/profile/${session.user.id}`)
          if (response.data) {
            const user = response.data.profile.user
            setAvatarPreview(`../${user.avatarUrl}`)
            setAvatarUrl(`../${user.avatarUrl}`)
            setValue('name', user.name)
            setValue('email', user.email)
          }
        } catch (error) {
          handleAxiosError(error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadUser()
  }, [session?.user, setValue])

  return (
    <Dialog.Portal>
      <Overlay className="DialogOverlay" />
      <Content className="DialogContent">
        <Header>
          <Title className="DialogTitle">
            Please, fill the fields above to sign up.
          </Title>
          <CloseButton onClick={onClose}>
            <X alt="Close" />
          </CloseButton>
        </Header>
        <Description className="DialogDescription">
          <FormContainer onSubmit={handleSubmit(handleEditUser)}>
            <AvatarSectionContainer>
              <PreviewContainer>
                <ImagePreview>
                  {isLoading ? (
                    <CircularProgress size="3rem" />
                  ) : avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" />
                  ) : (
                    <User />
                  )}
                </ImagePreview>
                <EditBtn type="button" onClick={handleAvatarChangeClick}>
                  <Pencil />
                </EditBtn>
              </PreviewContainer>
              <InputContainer>
                <CustomLabel>Your avatar here</CustomLabel>
                <ImageInput>
                  <input
                    type="file"
                    ref={inputFileRef}
                    style={{ display: 'none' }}
                    onChange={handleAvatarChange}
                  />
                  <button type="button" onClick={handleAvatarChangeClick}>
                    Choose File
                  </button>
                  <span>
                    {!watch('avatarUrl')?.name
                      ? avatarUrl
                      : watch('avatarUrl')?.name}
                  </span>
                </ImageInput>
                {errors.avatarUrl && (
                  <FormErrors error={errors.avatarUrl.message} />
                )}
              </InputContainer>
            </AvatarSectionContainer>
            <InputContainer>
              <CustomLabel>Your name here</CustomLabel>
              <Input type="text" placeholder="Jon Doe" {...register('name')} />
              {errors.name && <FormErrors error={errors.name.message} />}
            </InputContainer>

            <InputContainer>
              <CustomLabel>Your e-mail here</CustomLabel>
              <Input placeholder="myuser@email.com" {...register('email')} />
              {errors.email && <FormErrors error={errors.email.message} />}
            </InputContainer>

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
                <CustomLabel htmlFor="c1">Change password</CustomLabel>
              </StyledCheckbox>
            </ChangePasswordInputContainer>

            {changePassword && (
              <>
                <InputContainer>
                  <CustomLabel>Old password</CustomLabel>
                  <Input type="password" {...register('oldPassword')} />
                  {errors.oldPassword && (
                    <FormErrors error={errors.oldPassword.message} />
                  )}
                </InputContainer>
                <InputContainer>
                  <CustomLabel>New password</CustomLabel>
                  <Input type="password" {...register('password')} />
                  {errors.password && (
                    <FormErrors error={errors.password.message} />
                  )}
                </InputContainer>
                <InputContainer>
                  <CustomLabel>Confirm password</CustomLabel>
                  <Input type="password" {...register('passwordConfirm')} />
                  {errors.passwordConfirm && (
                    <FormErrors error={errors.passwordConfirm.message} />
                  )}
                </InputContainer>
              </>
            )}

            <CustomButton
              content="Update Profile"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size="1rem" /> : 'Update'}
            </CustomButton>
          </FormContainer>
        </Description>
      </Content>
    </Dialog.Portal>
  )
}
