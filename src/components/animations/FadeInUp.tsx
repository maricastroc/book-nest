// src/components/animations/FadeInUp.tsx
import { motion } from 'framer-motion'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.2 },
}

export const FadeInUp = ({ children }: { children: React.ReactNode }) => (
  <motion.div {...fadeInUp}>{children}</motion.div>
)
