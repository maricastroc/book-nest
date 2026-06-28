/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines } from '@fortawesome/free-solid-svg-icons'
import { MainLayout } from '@/layouts/MainLayout'
import { OutlineButton } from '@/components/ui/OutlineButton'
import { SubmitBookWizard } from '@/pages/my-books/partials/SubmitBookWizard'
import { Spinner } from '@/components/ui/Spinner'

import { BookProps } from '@/@types/book'
import useRequest from '@/hooks/useRequest'
import { useAppContext } from '@/contexts/AppContext'

export default function ReviewSubmission() {
  const router = useRouter()
  const { loggedUser } = useAppContext()

  const bookId = Array.isArray(router.query.bookId)
    ? router.query.bookId[0]
    : router.query.bookId

  const isAdmin = loggedUser?.role === 'ADMIN'

  useEffect(() => {
    if (loggedUser && !isAdmin) router.replace('/home')
  }, [loggedUser, isAdmin])

  const { data, isValidating } = useRequest<{ book: BookProps }>(
    bookId ? { url: `/books/${bookId}`, method: 'GET' } : null,
  )

  const book = data?.book ?? null

  return (
    <MainLayout title="Review Submission | Book Nest" pageTitle="">
      <div className="bn-scope flex flex-col px-8 pb-12 pt-8 md:px-10">
        <header className="mb-7 border-b border-line pb-7">
          <div className="mb-1.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-fg3">
            <FontAwesomeIcon icon={faFileLines} style={{ fontSize: 12 }} />
            <span>Admin · Submissions</span>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-[2rem] font-semibold leading-tight tracking-tight text-fg">
                Review Submission
              </h1>
              <p className="mt-1 text-[13px] text-fg2">
                Review the details, then approve or reject this submission.
              </p>
            </div>

            <OutlineButton onClick={() => router.push('/submissions')}>
              Back to Submissions
            </OutlineButton>
          </div>
        </header>

        {isValidating || !book ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <SubmitBookWizard
            isEdit
            book={book}
            onClose={() => router.push('/submissions')}
          />
        )}
      </div>
    </MainLayout>
  )
}
