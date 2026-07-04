function getIssueNumber() {
  const start = new Date(2024, 0, 1)
  const now = new Date()
  return Math.ceil(
    (now.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000),
  )
}

// Uses the visitor's local clock, so the greeting matches their timezone.
function getGreeting() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 18) return 'Good afternoon'
  return 'Good evening'
}

interface HomeHeaderProps {
  userId?: string
  firstName: string
}

export function HomeHeader({ userId, firstName }: HomeHeaderProps) {
  const issueNumber = getIssueNumber()
  const formattedDate = new Date()
    .toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
    .toUpperCase()

  return (
    <header className="shrink-0 border-b border-line pb-5 pt-8">
      <div className="mb-2 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-fg3">
        <span>The Shelf</span>
        <span className="flex-1 border-t border-line" />
        <span>
          Issue {issueNumber} · {formattedDate}
        </span>
      </div>
      <h1 className="font-serif text-[2.4rem] font-semibold leading-[1.08] tracking-tight text-fg">
        {userId ? `${getGreeting()}, ${firstName}.` : 'Your reading journal.'}
      </h1>
      <p className="mt-1.5 text-[13px] text-fg2">
        {userId
          ? "Here's what's been happening on the shelf."
          : 'Discover what readers are finishing, loving, and recommending.'}
      </p>
    </header>
  )
}
