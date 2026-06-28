import { useEffect, useState } from 'react'

import { useSubmitBookForm } from '@/hooks/useSubmitBookForm'
import { useAppContext } from '@/contexts/AppContext'
import { BookProps } from '@/@types/book'

import { WizardStepper } from './WizardStepper'
import { BookPreviewCard } from './BookPreviewCard'
import { Step1ISBN } from './Step1ISBN'
import { Step2ReviewFields } from './Step2ReviewFields'
import { Step3Extras } from './Step3Extras'
import { WizardNavigation } from './WizardNavigation'

type WizardStep = 1 | 2 | 3

const STEP_LABELS: Record<WizardStep, string> = {
  1: 'Find book',
  2: 'Review information',
  3: 'Extras & submit',
}

interface Props {
  onClose: () => void
  isEdit?: boolean
  book?: BookProps | null
  onUpdateBook?: (book: BookProps) => void
}

export function SubmitBookWizard({
  onClose,
  isEdit = false,
  book = null,
  onUpdateBook,
}: Props) {
  const [wizardStep, setWizardStep] = useState<WizardStep>(isEdit ? 2 : 1)

  const { loggedUser } = useAppContext()
  const isAdmin = loggedUser?.role === 'ADMIN'

  const {
    control,
    data,
    handleSubmit,
    handleSubmitBook,
    handleRejectBook,
    onInvalid,
    coverPreview,
    handleCoverChange,
    getBookInfoWithGoogleBooks,
    categoriesOptions,
    isValidBook,
    isSubmitting,
    isLoading,
    errors,
    form,
  } = useSubmitBookForm({ isEdit, book, onClose, onUpdateBook })

  useEffect(() => {
    if (isValidBook && wizardStep === 1) setWizardStep(2)
  }, [isValidBook, wizardStep])

  useEffect(() => {
    if (!isEdit && !isValidBook) setWizardStep(1)
  }, [isValidBook, isEdit])

  return (
    <div className="mx-auto flex w-full max-w-215 flex-col items-center gap-12 pb-16">
      <WizardStepper wizardStep={wizardStep} />

      {wizardStep > 1 && (
        <div className="-mt-6 flex flex-col items-center gap-1 text-center">
          <span className="text-[0.7rem] font-semibold uppercase tracking-widest text-fg3">
            Step {wizardStep} of 3
          </span>
          <h3 className="text-[1.25rem] font-bold text-fg">
            {STEP_LABELS[wizardStep]}
          </h3>
        </div>
      )}

      <form
        className="flex w-full flex-col gap-8"
        onSubmit={handleSubmit(handleSubmitBook, onInvalid)}
      >
        {wizardStep === 1 && (
          <Step1ISBN
            control={control}
            errors={errors}
            isbnValue={form?.isbn}
            isLoading={isLoading}
            onFind={() => getBookInfoWithGoogleBooks(form?.isbn)}
          />
        )}

        {wizardStep >= 2 && isValidBook && (
          <>
            <BookPreviewCard
              name={data.name}
              author={data.author}
              totalPages={data.totalPages}
              publishingYear={data.publishingYear}
              publisher={data.publisher}
              language={data.language}
              coverPreview={coverPreview}
            />

            {wizardStep === 2 && (
              <Step2ReviewFields control={control} errors={errors} />
            )}

            {wizardStep === 3 && (
              <Step3Extras
                control={control}
                errors={errors}
                coverPreview={coverPreview}
                onCoverChange={handleCoverChange}
                categoriesOptions={categoriesOptions}
              />
            )}
          </>
        )}

        <WizardNavigation
          wizardStep={wizardStep}
          isSubmitting={isSubmitting}
          isEdit={isEdit}
          canReject={isEdit && isAdmin}
          onCancel={onClose}
          onBack={() => setWizardStep(2)}
          onNext={() => setWizardStep(3)}
          onReject={handleRejectBook}
        />
      </form>
    </div>
  )
}
