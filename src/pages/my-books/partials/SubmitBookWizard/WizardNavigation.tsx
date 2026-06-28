import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faArrowRight,
  faBookMedical,
  faCheck,
} from '@fortawesome/free-solid-svg-icons'

import { OutlineButton } from '@/components/ui/OutlineButton'

type WizardStep = 1 | 2 | 3

interface Props {
  wizardStep: WizardStep
  isSubmitting: boolean
  isEdit?: boolean
  canReject?: boolean
  onCancel: () => void
  onBack: () => void
  onNext: () => void
  onReject?: () => void
}

export function WizardNavigation({
  wizardStep,
  isSubmitting,
  isEdit = false,
  canReject = false,
  onCancel,
  onBack,
  onNext,
  onReject,
}: Props) {
  return (
    <div className="flex w-full items-center justify-between gap-4 border-t border-line pt-6">
      {wizardStep === 1 && (
        <>
          <OutlineButton type="button" onClick={onCancel}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              style={{ width: 13, height: 13 }}
            />{' '}
            Cancel
          </OutlineButton>
          <div />
        </>
      )}
      {wizardStep === 2 && (
        <>
          <OutlineButton type="button" onClick={onCancel}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              style={{ width: 13, height: 13 }}
            />{' '}
            Cancel
          </OutlineButton>
          <button
            type="button"
            onClick={onNext}
            className="flex items-center gap-1.5 rounded-lg bg-ac px-4 py-2 text-[13px] font-bold text-ac-ink transition-opacity hover:opacity-90"
          >
            Next{' '}
            <FontAwesomeIcon
              icon={faArrowRight}
              style={{ width: 13, height: 13 }}
            />
          </button>
        </>
      )}
      {wizardStep === 3 && (
        <>
          <OutlineButton type="button" onClick={onBack}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              style={{ width: 13, height: 13 }}
            />{' '}
            Back
          </OutlineButton>

          <div className="flex items-center gap-3">
            {isEdit && canReject && (
              <button
                type="button"
                onClick={onReject}
                disabled={isSubmitting}
                className="rounded-lg border border-line px-4 py-2 text-[13px] font-semibold text-st-reading transition-colors hover:border-st-reading disabled:opacity-40"
              >
                Reject
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-ac px-4 py-2 text-[13px] font-bold text-ac-ink transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <FontAwesomeIcon
                icon={isEdit ? faCheck : faBookMedical}
                style={{ width: 13, height: 13 }}
              />
              {isSubmitting
                ? 'Saving…'
                : isEdit
                ? 'Approve Book'
                : 'Submit Book'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
