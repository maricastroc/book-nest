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
    if (wizardStep > n) return 'text-[0.8rem] font-medium text-[#4a9e6e]'
    if (wizardStep === n) return 'text-[0.8rem] font-semibold text-fg'
    return 'text-[0.8rem] text-fg3'
  }

  return (
    <div className="flex items-center gap-3">
      {([1, 2, 3] as WizardStep[]).map((n, i) => (
        <div key={n} className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1.5">
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
            <span className={labelClass(n)}>{STEP_DISPLAY[i]}</span>
          </div>
          {i < 2 && (
            <div
              className={`mb-5 h-px w-16 rounded transition-colors duration-300 sm:w-24 ${
                wizardStep > n ? 'bg-[#4a9e6e]' : 'bg-line-strong'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
