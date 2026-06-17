import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ModalAnimationProps {
  children: ReactNode
}

export function ModalContent({ children }: ModalAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
