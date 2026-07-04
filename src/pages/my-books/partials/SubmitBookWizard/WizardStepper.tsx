import { Fragment } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
type WizardStep = 1 | 2 | 3

const STEP_DISPLAY = ['Find book', 'Review info', 'Extras & submit']

interface Props {
  wizardStep: WizardStep
}

export function WizardStepper({ wizardStep }: Props) {
  const dotClass = (n: WizardStep) => {
    const base =
      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[0.75rem] font-bold transition-all duration-200'
    if (wizardStep > n) return `${base} bg-[#4a9e6e] text-white`
    if (wizardStep === n)
      return `${base} bg-ac text-ac-ink shadow-[0_0_0_4px_rgba(232,177,76,0.2)]`
    return `${base} border-2 border-line-strong text-fg3`
  }

  const labelClass = (n: WizardStep) => {
    if (wizardStep > n)
      return 'text-[0.72rem] font-medium text-[#4a9e6e] sm:text-[0.8rem]'
    if (wizardStep === n)
      return 'text-[0.72rem] font-semibold text-fg sm:text-[0.8rem]'
    return 'text-[0.72rem] text-fg3 sm:text-[0.8rem]'
  }

  return (
    <div className="mx-auto flex w-full max-w-md items-start">
      {([1, 2, 3] as WizardStep[]).map((n, i) => (
        <Fragment key={n}>
          <div className="flex flex-1 flex-col items-center gap-1.5">
            <div className={dotClass(n)}>
              {wizardStep > n ? (
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  style={{ fontSize: 16 }}
                />
              ) : (
                n
              )}
            </div>
            <span
              className={`px-0.5 text-center leading-tight ${labelClass(n)}`}
            >
              {STEP_DISPLAY[i]}
            </span>
          </div>
          {i < 2 && (
            <div
              className={`mt-[1.0625rem] h-px flex-1 rounded transition-colors duration-300 ${
                wizardStep > n ? 'bg-st-read' : 'bg-line-strong'
              }`}
            />
          )}
        </Fragment>
      ))}
    </div>
  )
}
