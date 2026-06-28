import { ThreeDots } from 'react-loading-icons'

interface Props {
  hasOverlay?: boolean
  withBackground?: boolean
}

export const LoadingComponent = ({
  hasOverlay = false,
  withBackground = false,
}: Props) => {
  return (
    <div className="fixed right-0 top-0 z-[998] flex h-screen w-full items-center justify-center overflow-scroll">
      {hasOverlay && (
        <div
          className={`fixed inset-0 h-full w-screen ${
            withBackground ? 'bg-bg' : 'bg-black/60'
          }`}
        />
      )}
      <ThreeDots height={'12px'} className="animate-spin" />
    </div>
  )
}
