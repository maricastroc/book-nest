import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Rating, type RatingProps } from 'react-simple-star-rating'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

interface AnimatedRatingProps extends RatingProps {
  initialValue?: number
  onClick: (rate: number) => void
}

export function AnimatedRating({
  onClick,
  initialValue,
  ...props
}: AnimatedRatingProps) {
  const [clickedStar, setClickedStar] = useState<number | null>(null)

  function handleClick(rate: number) {
    setClickedStar(Math.ceil(rate / 20))
    onClick(rate)

    setTimeout(() => {
      setClickedStar(null)
    }, 1000)
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Rating
        onClick={handleClick}
        initialValue={initialValue}
        emptyIcon={<FontAwesomeIcon icon={faStar} style={{ fontSize: 20 }} />}
        fillIcon={<FontAwesomeIcon icon={faStar} style={{ fontSize: 20 }} />}
        emptyColor="#3a352a"
        fillColor="#e8b14c"
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
                style={{ color: '#e8b14c' }}
              >
                <FontAwesomeIcon icon={faStar} style={{ fontSize: 12 }} />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
