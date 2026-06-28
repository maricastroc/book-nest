interface SectionLabelProps {
  children: React.ReactNode
  noMargin?: boolean
}

export function SectionLabel({
  children,
  noMargin = false,
}: SectionLabelProps) {
  return (
    <p
      className={`text-[10.5px] font-medium uppercase tracking-[0.14em] text-fg3 ${
        noMargin ? '' : 'mb-3'
      }`}
    >
      {children}
    </p>
  )
}
