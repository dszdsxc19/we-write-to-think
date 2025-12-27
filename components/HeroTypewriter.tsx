'use client'

import { useEffect, useRef } from 'react'

interface HeroTypewriterProps {
  descriptions: string[]
  defaultDescription: string
}

export function HeroTypewriter({ descriptions, defaultDescription }: HeroTypewriterProps) {
  const textRef = useRef('')
  const indexRef = useRef(0)
  const isDeletingRef = useRef(false)
  const isPausedRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const validDescriptions =
    descriptions && descriptions.length > 0 ? descriptions : [defaultDescription]

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const runTypewriter = () => {
      const currentText = validDescriptions[indexRef.current]

      if (isPausedRef.current) {
        timeoutRef.current = setTimeout(runTypewriter, 2000)
        return
      }

      if (!isDeletingRef.current) {
        // 打字中
        if (textRef.current.length < currentText.length) {
          textRef.current = currentText.slice(0, textRef.current.length + 1)
          container.textContent = textRef.current
          timeoutRef.current = setTimeout(runTypewriter, 100)
        } else {
          // 打完，暂停
          isPausedRef.current = true
          timeoutRef.current = setTimeout(() => {
            isPausedRef.current = false
            isDeletingRef.current = true
            runTypewriter()
          }, 2000)
        }
      } else {
        // 删除中
        if (textRef.current.length > 0) {
          textRef.current = textRef.current.slice(0, -1)
          container.textContent = textRef.current
          timeoutRef.current = setTimeout(runTypewriter, 50)
        } else {
          // 删除完，切换到下一条
          isDeletingRef.current = false
          indexRef.current = (indexRef.current + 1) % validDescriptions.length
          timeoutRef.current = setTimeout(runTypewriter, 500)
        }
      }
    }

    timeoutRef.current = setTimeout(runTypewriter, 500)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [validDescriptions])

  return (
    <div className="text-left text-lg leading-7 font-normal text-gray-500 dark:text-gray-400">
      <span ref={containerRef}></span>
      <span className="animate-blink ml-1 inline-block h-[1.125rem] w-[2px] bg-gray-500 align-middle md:h-[1.375rem] dark:bg-gray-400" />
    </div>
  )
}
