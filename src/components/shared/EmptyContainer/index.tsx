interface EmptyContainerProps {
  content?: string
  variant?: 'empty' | 'error'
}

export function EmptyContainer({
  content = 'reviewed books',
  variant = 'empty',
}: EmptyContainerProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line-strong bg-s1 px-6 py-10 text-center">
      {variant === 'error' ? (
        <>
          <p className="text-[0.95rem] font-bold text-fg">
            Something went wrong.
          </p>
          <span className="text-[0.82rem] leading-relaxed text-fg3">
            We couldn&apos;t load the {content}. Please try again later.
          </span>
        </>
      ) : (
        <>
          <p className="text-[0.95rem] font-bold text-fg">
            It&apos;s a little empty around here!
          </p>
          <span className="text-[0.82rem] leading-relaxed text-fg3">
            {`We couldn't find any ${content}.`}
          </span>
        </>
      )}
    </div>
  )
}
