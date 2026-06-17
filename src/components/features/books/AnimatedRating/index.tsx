/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import { Star } from 'phosphor-react'

interface AnimatedRatingProps {
  initialValue: number | undefined
  onClick: (rate: number) => void
  [key: string]: any
}

export const AnimatedRating = ({
  onClick,
  initialValue,
  ...props
}: AnimatedRatingProps) => {
  const [clickedStar, setClickedStar] = useState<number | null>(null)

  const handleClick = (rate: number) => {
    setClickedStar(Math.ceil(rate / 20))
    onClick(rate)

    setTimeout(() => setClickedStar(null), 1000)
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Rating
        onClick={handleClick}
        initialValue={initialValue}
        emptyIcon={<Star size={20} />}
        fillIcon={<Star weight="fill" size={20} />}
        emptyColor="#8381D9"
        fillColor="#8381D9"
        {...props}
      />

      <AnimatePresence>
        {clickedStar !== null && (
          <>
            {[...Array(3)].map((_, sparkleIndex) => (
              <motion.div
                key={sparkleIndex}
                initial={{
                  scale: 0,
                  opacity: 1,
                  position: 'absolute',
                  top: '50%',
                  left: `${clickedStar * 20 - 10}px`,
                  zIndex: 0,
                }}
                animate={{
                  scale: [1, 1.5, 0],
                  opacity: [1, 0.5, 0],
                  x: `${Math.cos(sparkleIndex * 2) * 20}px`,
                  y: `${Math.sin(sparkleIndex * 2) * 20 - 10}px`,
                  rotate: sparkleIndex % 2 === 0 ? 180 : -180,
                }}
                transition={{
                  duration: 0.8,
                  ease: 'easeOut',
                  delay: sparkleIndex * 0.1,
                }}
                style={{
                  color: '#8381D9',
                }}
              >
                <Star weight="fill" size={12} />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
