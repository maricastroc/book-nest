import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface FadeInItemProps {
  children: ReactNode
}

export function FadeInItem({ children }: FadeInItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
