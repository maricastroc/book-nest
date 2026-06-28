import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen } from '@fortawesome/free-solid-svg-icons'
import { useLoadingOnRouteChange } from '@/hooks/useLoadingOnRouteChange'
import { LoadingComponent } from '@/components/ui/LoadingComponent'
import SignUpForm from '@/pages/register/partials/SignUpForm'
import { BookIllustration } from '@/pages/login/partials/BookIllustration'

function LogoLockup() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-ac text-ac-ink">
        <FontAwesomeIcon icon={faBookOpen} style={{ fontSize: 20 }} />
      </div>
      <div className="leading-none">
        <div className="font-serif text-[18px] font-semibold tracking-tight text-fg">
          booknest
        </div>
        <div className="mt-1.25 text-[8.5px] uppercase tracking-[0.18em] text-fg3">
          reading journal
        </div>
      </div>
    </div>
  )
}

export default function Register() {
  const isRouteLoading = useLoadingOnRouteChange()
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') router.push('/home')
  }, [status, router])

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <>
      <NextSeo
        title="Sign Up | Book Nest"
        additionalMetaTags={[
          {
            name: 'viewport',
            content:
              'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
          },
        ]}
      />
      {isRouteLoading ? (
        <LoadingComponent withBackground />
      ) : (
        <div className="bn-scope grid min-h-screen grid-cols-1 bg-bg md:h-screen md:grid-cols-2 md:overflow-hidden">
          <div className="relative hidden flex-col gap-3 overflow-hidden border-r border-white/4 bg-s1 p-14 md:flex">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-115 w-115 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(232,177,76,0.10) 0%, rgba(232,177,76,0) 68%)',
              }}
            />

            <LogoLockup />

            <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-hidden">
              <BookIllustration />
            </div>

            <div className="relative z-10">
              <h1 className="font-serif text-[1.7rem] font-semibold leading-snug tracking-tight text-fg">
                Start your reading
                <br />
                <span className="text-ac">journey.</span>
              </h1>
              <p className="mt-2 max-w-[24rem] text-[13px] leading-relaxed text-fg2">
                Track your reading, discover meaningful books, and connect with
                readers who love the same stories.
              </p>
            </div>
          </div>

          <div
            className="flex flex-col items-center justify-center gap-8 px-6 py-12 md:h-screen md:overflow-y-auto md:px-12"
            style={{
              background:
                'radial-gradient(60% 45% at 50% 42%, rgba(232,177,76,0.05) 0%, transparent 72%)',
            }}
          >
            <div className="flex flex-col items-center gap-4 text-center md:hidden">
              <LogoLockup />
              <div>
                <h2 className="font-serif text-[1.4rem] font-semibold tracking-tight text-fg">
                  Start your reading <span className="text-ac">journey.</span>
                </h2>
                <p className="mt-1.5 text-[13px] text-fg2">
                  Track your reading journey and discover new books.
                </p>
              </div>
            </div>

            <SignUpForm />
          </div>
        </div>
      )}
    </>
  )
}
