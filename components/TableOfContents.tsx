'use client'

import { useEffect, useState } from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface TocItem {
  value: string
  url: string
  depth: number
}

interface TableOfContentsProps {
  toc: TocItem[]
  triggerId?: string
  className?: string
}

export default function TableOfContents({ toc, triggerId, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Track active heading
  useEffect(() => {
    const handleScroll = () => {
      // Find the heading that is closest to a specific vertical position (e.g., 100px from top)
      const headingElements = toc.map(item => document.getElementById(item.url.slice(1))).filter(Boolean) as HTMLElement[]

      if (headingElements.length === 0) return

      const topOffset = 150
      let currentActiveId = ''

      for (const heading of headingElements) {
         const rect = heading.getBoundingClientRect()
         if (rect.top <= topOffset) {
             currentActiveId = heading.id
         } else {
             break
         }
      }

      if (!currentActiveId && headingElements.length > 0 && window.scrollY < 100) {
          currentActiveId = headingElements[0].id
      }

      setActiveId(currentActiveId)
    }

    // Track trigger visibility
    const handleTrigger = () => {
        if (!triggerId) {
            setIsVisible(true)
            return
        }

        const trigger = document.getElementById(triggerId)
        if (!trigger) {
            return
        }

        const rect = trigger.getBoundingClientRect()
        // If the BOTTOM of the trigger is above the viewport
        if (rect.bottom < 0) {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    }

    const onScroll = () => {
        handleScroll()
        handleTrigger()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    // Initial check
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [toc, triggerId])

  if (!toc || toc.length === 0) return null

  return (
    <div
      className={cn(
        "sticky top-24 w-full transition-opacity duration-500 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
          "rounded-lg transition-all"
      )}>
        <ul className="flex flex-col gap-2">
            {toc.map((item, index) => {
                const isActive = item.url === `#${activeId}`
                return (
                    <li key={item.url} className="relative group">
                         {/* Text Layer (Visible on Hover) */}
                         <a
                            href={item.url}
                            className={cn(
                                "block text-sm py-1 transition-all duration-300 line-clamp-2",
                                isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 absolute top-0 left-0 w-full pointer-events-none",
                                isActive ? "text-primary-500 font-medium" : "text-gray-500 dark:text-gray-400 hover:text-primary-500"
                            )}
                            style={{ paddingLeft: isHovered ? `${(item.depth - 2) * 8}px` : 0 }}
                            onClick={(e) => {
                                e.preventDefault()
                                const el = document.getElementById(item.url.slice(1))
                                if (el) {
                                    const headerOffset = 100
                                    const elementPosition = el.getBoundingClientRect().top
                                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

                                    window.scrollTo({
                                        top: offsetPosition,
                                        behavior: "smooth"
                                    })
                                }
                            }}
                        >
                            {item.value}
                        </a>

                        {/* Skeleton Layer (Visible when NOT Hovered) */}
                         <div
                            className={cn(
                                "h-2 rounded-full transition-all duration-300",
                                isHovered ? "opacity-0 w-0" : "opacity-100",
                                isActive ? "bg-primary-500" : "bg-gray-200 dark:bg-gray-700",
                            )}
                            style={{
                                width: isHovered ? 0 : `${Math.max(20, 100 - (item.depth - 2) * 10 - (index % 3) * 15)}%`,
                                marginLeft: 0
                            }}
                        />
                    </li>
                )
            })}
        </ul>
      </div>
    </div>
  )
}
