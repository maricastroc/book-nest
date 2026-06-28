import { useState } from 'react'
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

const signInFormSchema = z.object({
  email: z.string().min(3, { message: 'E-mail is required.' }),
  password: z.string().min(3, { message: 'Password is required.' }),
})

type SignInFormData = z.infer<typeof signInFormSchema>

interface SignInFormProps {
  onClose?: () => void
}

const inputClass =
  'w-full rounded-lg border border-line bg-bg py-3 pl-10 pr-3.5 text-[15px] text-fg outline-none transition-colors placeholder:text-fg3 hover:border-line-strong focus:border-ac/50 focus:bg-s2'
const labelClass = 'mb-1.5 block text-[13px] font-medium text-fg'

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

  const socialButtonClass =
    'flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-line bg-transparent text-[13px] text-fg2 transition-colors hover:border-ac/40 hover:text-fg'

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
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg3"
                style={{ fontSize: 16 }}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    id="email"
                    placeholder="you@example.com"
                    className={inputClass}
                    {...field}
                  />
                )}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-[12px] text-st-reading">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-[13px] font-medium text-fg"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg3"
                style={{ fontSize: 16 }}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className={inputClass}
                    {...field}
                  />
                )}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-[12px] text-st-reading">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="mt-1 flex items-center justify-center gap-2 rounded-lg border border-ac/60 bg-ac py-3 text-[14px] font-bold text-ac-ink shadow-[0_6px_20px_rgba(232,177,76,0.18)] transition-all hover:shadow-[0_8px_28px_rgba(232,177,76,0.30)] hover:brightness-110 disabled:opacity-60"
          >
            <FontAwesomeIcon icon={faRightToBracket} style={{ fontSize: 16 }} />
            {isSubmitting || isLoading ? 'Signing in…' : 'Sign in'}
          </button>
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
            onClick={() => handleSignIn('google')}
            className={socialButtonClass}
          >
            <Icon icon="flat-color-icons:google" fontSize={16} />
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => handleSignIn('github')}
            className={socialButtonClass}
          >
            <Icon icon="ant-design:github-outlined" fontSize={16} />
            Continue with GitHub
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 border-t border-line pt-4">
          <button
            type="button"
            onClick={() => router.push('/home')}
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
