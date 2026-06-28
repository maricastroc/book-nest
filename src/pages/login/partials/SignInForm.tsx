import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Icon } from '@iconify/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faEnvelope,
  faLock,
  faRightToBracket,
  faRocket,
} from '@fortawesome/free-solid-svg-icons'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { FormField, formInputClass } from '@/components/ui/FormField'

const signInFormSchema = z.object({
  email: z.string().min(3, { message: 'E-mail is required.' }),
  password: z.string().min(3, { message: 'Password is required.' }),
})

type SignInFormData = z.infer<typeof signInFormSchema>

interface SignInFormProps {
  onClose?: () => void
}

const socialButtonClass =
  'flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-line-strong bg-s1 text-[13px] text-fg2 transition-colors hover:border-ac/40 hover:text-fg'

export default function SignInForm({ onClose }: SignInFormProps) {
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email: '', password: '' },
  })

  async function handleSocialSignIn(provider: 'google' | 'github') {
    await signIn(provider, { callbackUrl: '/home' })
  }

  function handleGuestAccess() {
    router.push('/home')
    onClose?.()
  }

  async function onSubmit(data: SignInFormData) {
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(result.error)
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
    <div className="mx-auto w-full max-w-md">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-serif text-[1.7rem] font-semibold tracking-tight text-fg">
            Welcome back
          </h2>
          <p className="mt-1 text-[13px] text-fg2">
            Pick up where you left off.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            id="email"
            label="Email"
            icon={faEnvelope}
            error={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  id="email"
                  placeholder="you@example.com"
                  className={formInputClass}
                  {...field}
                />
              )}
            />
          </FormField>

          <FormField
            id="password"
            label="Password"
            icon={faLock}
            error={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className={formInputClass}
                  {...field}
                />
              )}
            />
          </FormField>

          <Button
            type="submit"
            content="Sign in"
            loadingText="Signing in…"
            icon={faRightToBracket}
            isSubmitting={isSubmitting}
            className="mt-1 border-ac/60 py-3 text-[14px] font-bold shadow-[0_6px_20px_rgba(232,177,76,0.18)] hover:brightness-110 hover:shadow-[0_8px_28px_rgba(232,177,76,0.30)] disabled:opacity-60"
          />
        </form>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="whitespace-nowrap text-[11px] uppercase tracking-[0.14em] text-fg3">
            or continue with
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => handleSocialSignIn('google')}
            className={socialButtonClass}
          >
            <Icon icon="flat-color-icons:google" fontSize={16} />
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignIn('github')}
            className={socialButtonClass}
          >
            <Icon icon="ant-design:github-outlined" fontSize={16} />
            Continue with GitHub
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 border-t border-line pt-4">
          <button
            type="button"
            onClick={handleGuestAccess}
            className="group flex items-center gap-1.5 text-[13px] font-medium text-fg2 transition-colors hover:text-ac"
          >
            <FontAwesomeIcon icon={faRocket} style={{ fontSize: 14 }} />
            Continue as Guest
            <FontAwesomeIcon
              icon={faArrowRight}
              className="transition-transform group-hover:translate-x-0.5"
              style={{ fontSize: 12 }}
            />
          </button>

          <p className="text-[12.5px] text-fg3">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => router.push('/register')}
              className="font-medium text-ac transition-opacity hover:opacity-80"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
