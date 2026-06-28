import { ReactNode } from 'react'

interface InputContainerProps {
  children: ReactNode
}

export const InputContainer = ({ children }: InputContainerProps) => {
  return <div className="flex w-full flex-col gap-1.5">{children}</div>
}
