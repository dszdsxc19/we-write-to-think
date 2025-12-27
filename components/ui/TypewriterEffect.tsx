'use client'

import { cn } from '@/lib/utils'
import { motion, stagger, useAnimate, useInView } from 'framer-motion'
import { useEffect } from 'react'

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
  onComplete,
}: {
  words: {
    text: string
    className?: string
  }[]
  className?: string
  cursorClassName?: string
  onComplete?: () => void
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(''),
    }
  })

  const [scope, animate] = useAnimate()
  const isInView = useInView(scope)
  useEffect(() => {
    if (isInView) {
      const controls = animate(
        'span',
        {
          display: 'inline-block',
          opacity: 1,
          width: 'fit-content',
        },
        {
          duration: 0.3,
          delay: stagger(0.1),
          ease: 'easeInOut',
        }
      )
      if (onComplete) {
        controls.then(() => {
          onComplete()
        })
      }
    }
  }, [isInView, animate, onComplete, words])

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <motion.span
                  initial={{}}
                  key={`char-${index}`}
                  className={cn(`hidden opacity-0`, word.className)}
                >
                  {char}
                </motion.span>
              ))}
              &nbsp;
            </div>
          )
        })}
      </motion.div>
    )
  }
  return (
    <div className={cn('text-center font-bold', className)}>
      {renderWords()}
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        className={cn('inline-block h-4 w-[4px] rounded-sm bg-blue-500', cursorClassName)}
      ></motion.span>
    </div>
  )
}
