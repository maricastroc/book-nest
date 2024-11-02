import * as Dialog from '@radix-ui/react-dialog'
import { Pencil, User, X } from 'phosphor-react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useRef, useState } from 'react'

import {
  Overlay,
  Description,
  Title,
  Content,
  CloseButton,
  FormContainer,
  ImageInput,
  Input,
  ImagePreview,
  EditBtn,
  PreviewContainer,
  AvatarSectionContainer,
  Header,
} from './styles'
import { CustomLabel } from '../shared/Label'
import { FormErrors } from '../shared/FormErrors'
import { InputContainer } from '../shared/InputContainer'
import { CustomButton } from '../shared/Button'
import { api } from '@/lib/axios'

interface SignUpModalProps {
  onClose: () => void
}

const signUpFormSchema = z
  .object({
    email: z.string().min(3, { message: 'E-mail is required.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' }),
    passwordConfirm: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' }),
    name: z.string().min(3, { message: 'Name is required.' }),
    avatarUrl: z.custom<File>((file) => file instanceof File && file.size > 0, {
      message: 'Avatar file is required.',
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ['passwordConfirm'],
  })

type SignUpFormData = z.infer<typeof signUpFormSchema>

export function SignUpModal({ onClose }: SignUpModalProps) {
  const inputFileRef = useRef<HTMLInputElement>(null)

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      passwordConfirm: '',
    },
  })

  async function handleCreateUser(data: SignUpFormData) {
    const formData = new FormData() // Create a new FormData instance
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('name', data.name)
    formData.append('avatarUrl', data.avatarUrl)

    try {
      await api.post(`/user`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('User successfully registered!')
      onClose()
    } catch (error) {
      console.log(error)
      toast.error('Failed to register user. Please try again.')
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setValue('avatarUrl', file)

      const reader = new FileReader()
      reader.onload = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileButtonClick = () => {
    inputFileRef.current?.click()
  }

  return (
    <Dialog.Portal>
      <Overlay className="DialogOverlay" />

      <Content className="DialogContent">
        <Header>
          <Title className="DialogTitle">
            Please, fill the fields above to sign up.
          </Title>
          <CloseButton>
            <X alt="Close" />
          </CloseButton>
        </Header>

        <Description className="DialogDescription">
          <FormContainer>
            <AvatarSectionContainer>
              <PreviewContainer>
                <ImagePreview>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" width={40} />
                  ) : (
                    <User />
                  )}
                </ImagePreview>
                <EditBtn onClick={handleFileButtonClick}>
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
                    onChange={handleFileChange}
                  />
                  <button type="button" onClick={handleFileButtonClick}>
                    Choose File
                  </button>
                  <span>{watch('avatarUrl')?.name}</span>
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

            <InputContainer>
              <CustomLabel>Your password here</CustomLabel>
              <Input
                type="password"
                placeholder="password"
                {...register('password')}
              />
              {errors.password && (
                <FormErrors error={errors.password.message} />
              )}
            </InputContainer>

            <InputContainer>
              <CustomLabel>Confirm your password</CustomLabel>
              <Input
                type="password"
                placeholder="confirm password"
                {...register('passwordConfirm')}
              />
              {errors.passwordConfirm && (
                <FormErrors error={errors.passwordConfirm.message} />
              )}
            </InputContainer>

            <CustomButton
              content="Sign Up"
              onClick={handleSubmit(handleCreateUser)}
              disabled={isSubmitting}
            />
          </FormContainer>
        </Description>
      </Content>
    </Dialog.Portal>
  )
}
