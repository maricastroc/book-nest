import { Spinner } from '@/components/ui/Spinner'

export function LoadingPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-bg">
      <Spinner size="md" />
    </div>
  )
}
