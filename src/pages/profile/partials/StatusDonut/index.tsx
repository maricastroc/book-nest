import { StatusCounts } from '@/@types/user_statistics'

interface StatusDonutProps {
  statusCounts: StatusCounts
  total: number
}

const SEGMENTS: {
  key: keyof StatusCounts
  label: string
  color: string
}[] = [
  { key: 'read', label: 'Finished', color: 'var(--color-st-read)' },
  { key: 'reading', label: 'In Progress', color: 'var(--color-st-reading)' },
  { key: 'wantToRead', label: 'To Read', color: 'var(--color-st-want)' },
  { key: 'didNotFinish', label: 'Abandoned', color: 'var(--color-st-dnf)' },
]

const RADIUS = 42
const STROKE = 12
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function StatusDonut({ statusCounts, total }: StatusDonutProps) {
  let accumulated = 0

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative h-[148px] w-[148px]">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          {/* Track */}
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="var(--color-line)"
            strokeWidth={STROKE}
          />
          {total > 0 &&
            SEGMENTS.map(({ key, color }) => {
              const value = statusCounts[key]
              if (value === 0) return null

              const length = (value / total) * CIRCUMFERENCE
              const offset = accumulated
              accumulated += length

              return (
                <circle
                  key={key}
                  cx="50"
                  cy="50"
                  r={RADIUS}
                  fill="none"
                  stroke={color}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={`${Math.max(
                    length - 1.5,
                    0,
                  )} ${CIRCUMFERENCE}`}
                  strokeDashoffset={-offset}
                />
              )
            })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-[1.9rem] font-semibold leading-none text-fg">
            {total}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.16em] text-fg3">
            books
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid w-full grid-cols-2 gap-x-4 gap-y-2">
        {SEGMENTS.map(({ key, label, color }) => (
          <div key={key} className="flex items-center gap-2 text-[12px]">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-fg2">{label}</span>
            <span className="ml-auto font-semibold text-fg">
              {statusCounts[key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
