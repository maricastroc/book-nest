import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Icon } from '@iconify/react'
import { RocketLaunch } from 'phosphor-react'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputContainer } from '@/components/ui/InputContainer'
import { FormErrors } from '@/components/ui/FormErrors'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Form } from '@/components/ui/Form'
import {
  Wrapper,
  FormHeader,
  FieldGroup,
  Divider,
  SignupLink,
  SocialButton,
  SocialButtons,
} from './styles'

const signInFormSchema = z.object({
  email: z.string().min(3, { message: 'E-mail is required.' }),
  password: z.string().min(3, { message: 'Password is required.' }),
})

type SignInFormData = z.infer<typeof signInFormSchema>

interface SignInFormProps {
  onClose?: () => void
}

export default function SignInForm({ onClose }: SignInFormProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email: '', password: '' },
  })

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSignIn(provider: string) {
    setIsLoading(true)
    if (provider === 'google') {
      await signIn('google', { callbackUrl: '/home' })
    } else if (provider === 'github') {
      await signIn('github', { callbackUrl: '/home' })
    } else {
      router.push('/home')
    }
    setIsLoading(false)
    if (onClose) onClose()
  }

  async function onSubmit(data: SignInFormData) {
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(result?.error)
      } else {
        toast.success('Welcome to the Book Nest!')
        router.push('/home')
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.')
      console.error(error)
    }
  }

  return (
    <Wrapper>
      <FormHeader>
        <h2>Welcome back</h2>
        <p>Pick up where you left off.</p>
      </FormHeader>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
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
                  placeholder="Enter your password"
                  {...field}
                />
              )}
            />
            {errors.password && <FormErrors error={errors.password.message} />}
          </InputContainer>
        </FieldGroup>

        <Button
          type="submit"
          content="Login to your account"
          isSubmitting={isSubmitting || isLoading}
          style={{ marginTop: '0.75rem' }}
        />
      </Form>

      <SignupLink>
        Don&apos;t have an account?{' '}
        <a onClick={() => router.push('/register')} href="#">
          Sign up
        </a>
      </SignupLink>

      <Divider>
        <span>Or login with</span>
      </Divider>

      <SocialButtons>
        <SocialButton type="button" onClick={() => handleSignIn('google')}>
          <Icon icon="flat-color-icons:google" fontSize={16} />
          Continue with Google
        </SocialButton>

        <SocialButton type="button" onClick={() => handleSignIn('github')}>
          <Icon icon="ant-design:github-outlined" color="white" fontSize={16} />
          Continue with GitHub
        </SocialButton>

        <SocialButton type="button" onClick={() => router.push('/home')}>
          <RocketLaunch size={16} />
          Continue as Guest
        </SocialButton>
      </SocialButtons>
    </Wrapper>
  )
}
