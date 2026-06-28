import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faBookOpen } from '@fortawesome/free-solid-svg-icons'

interface GuestSignInCalloutProps {
  onSignIn: () => void
}

export function GuestSignInCallout({ onSignIn }: GuestSignInCalloutProps) {
  return (
    <div className="bn-scope flex flex-col items-start gap-4 rounded-xl border border-ac-border bg-warm p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ac-soft text-ac">
          <FontAwesomeIcon icon={faBookOpen} style={{ fontSize: 15 }} />
        </span>
        <div>
          <p className="text-[13.5px] font-medium text-fg">
            Make this shelf yours.
          </p>
          <p className="text-[12.5px] text-fg2">
            Sign in to track your reading and get personalized picks.
          </p>
        </div>
      </div>
      <button
        onClick={onSignIn}
        className="flex shrink-0 items-center gap-2 rounded-lg bg-ac px-4 py-2 text-[13px] font-semibold text-ac-ink transition-[filter] hover:brightness-110"
      >
        Sign in
        <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 12 }} />
      </button>
    </div>
  )
}
