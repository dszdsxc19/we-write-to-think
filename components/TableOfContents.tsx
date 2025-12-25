'use client'

import { useEffect, useState, useRef } from 'react'
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
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [isHovered, setIsHovered] = useState(false)

  // Track active heading
  useEffect(() => {
    const handleScroll = () => {
      // Find the heading that is closest to a specific vertical position (e.g., 100px from top)
      const headingElements = toc
        .map((item) => document.getElementById(item.url.slice(1)))
        .filter(Boolean) as HTMLElement[]

      if (headingElements.length === 0) return

      const topOffset = 150 // Adjust based on header height
      let currentActiveId = ''

      // Strategy: Find the last heading that is above the offset
      for (const heading of headingElements) {
        const rect = heading.getBoundingClientRect()
        if (rect.top <= topOffset) {
          currentActiveId = heading.id
        } else {
          // If we found a heading below offset, the previous one (currentActiveId) is the active one.
          break
        }
      }

      // If no heading is above offset (top of page), use the first one if visible?
      // Or keep empty.
      if (!currentActiveId && headingElements.length > 0 && window.scrollY < 100) {
        // At very top, maybe first one?
        currentActiveId = headingElements[0].id
      }

      setActiveId(currentActiveId)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [toc])

  if (!toc || toc.length === 0) return null

  const activeIndex = toc.findIndex((item) => item.url === `#${activeId}`)
  const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex

  // Windowing logic for expanded view
  // Show active - 5 to active + 5
  const WINDOW_SIZE = 5
  const start = Math.max(0, safeActiveIndex - WINDOW_SIZE)
  const end = Math.min(toc.length, safeActiveIndex + WINDOW_SIZE + 1)
  const visibleItems = toc.slice(start, end)

  return (
    <div
      className={cn(
        'fixed top-1/2 right-8 z-50 hidden -translate-y-1/2 transition-all duration-300 ease-in-out xl:block',
        isHovered ? 'w-64' : 'w-12'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          'rounded-lg border border-gray-200 bg-white/90 p-3 shadow-xl backdrop-blur-md transition-all dark:border-gray-700 dark:bg-gray-900/90',
          isHovered ? 'max-h-[70vh] overflow-y-auto' : 'max-h-[60vh] overflow-hidden'
        )}
      >
        <ul className="flex flex-col gap-1.5">
          {/* Skeleton Mode (Not Hovered) */}
          {!isHovered &&
            toc.map((item, index) => {
              const isActive = item.url === `#${activeId}`
              // Only show a limited number of bars if there are too many?
              // Or show all but scale them? For now show all.
              return (
                <li key={item.url} className="flex justify-end pr-1">
                  <div
                    className={cn(
                      'h-1 rounded-full transition-all duration-300',
                      isActive ? 'bg-primary-500 w-6' : 'w-2 bg-gray-300 dark:bg-gray-600',
                      // Indentation logic: deeper levels are shorter or shifted?
                      // Let's just vary width slightly for depth?
                      // Or shift margin?
                      item.depth === 2 ? 'mr-0' : 'mr-1 opacity-70'
                    )}
                  />
                </li>
              )
            })}

          {/* Expanded Mode (Hovered) */}
          {isHovered &&
            visibleItems.map((item, index) => {
              const isActive = item.url === `#${activeId}`
              return (
                <li key={item.url} style={{ paddingLeft: `${(item.depth - 2) * 12}px` }}>
                  <a
                    href={item.url}
                    className={cn(
                      'hover:text-primary-500 line-clamp-2 block py-1 text-sm transition-colors',
                      isActive ? 'text-primary-500 font-medium' : 'text-gray-500 dark:text-gray-400'
                    )}
                    onClick={(e) => {
                      e.preventDefault()
                      const el = document.getElementById(item.url.slice(1))
                      if (el) {
                        const headerOffset = 100
                        const elementPosition = el.getBoundingClientRect().top
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth',
                        })
                      }
                    }}
                  >
                    {item.value}
                  </a>
                </li>
              )
            })}
        </ul>
      </div>
    </div>
  )
}
