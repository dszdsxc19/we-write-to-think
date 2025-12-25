'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
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

const VISIBLE_RANGE = 3 // 显示active项前后各3个

export default function TableOfContents({ toc, triggerId, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const activeItemRef = useRef<HTMLLIElement>(null)

  // 计算应该显示的TOC项（hover时显示全部，未hover时只显示active项附近）
  const visibleToc = useMemo(() => {
    if (toc.length === 0) return []

    // hover 时显示全部 toc
    if (isHovered) {
      return toc
    }

    const activeIndex = toc.findIndex((item) => item.url === `#${activeId}`)

    if (activeIndex === -1) {
      return toc.slice(0, 2 * VISIBLE_RANGE + 1)
    }

    const start = Math.max(0, activeIndex - VISIBLE_RANGE)
    const end = Math.min(toc.length, activeIndex + VISIBLE_RANGE + 1)

    return toc.slice(start, end)
  }, [toc, activeId, isHovered])

  // Track active heading
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = toc
        .map((item) => document.getElementById(item.url.slice(1)))
        .filter(Boolean) as HTMLElement[]

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

    const handleTrigger = () => {
      if (!triggerId) {
        setIsVisible(true)
        return
      }

      const trigger = document.getElementById(triggerId)
      if (!trigger) return

      const rect = trigger.getBoundingClientRect()
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
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [toc, triggerId])

  // Scroll active item into view when it changes
  useEffect(() => {
    if (activeItemRef.current && listRef.current && !isHovered) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [activeId, isHovered])

  if (!toc || toc.length === 0) return null

  return (
    <div
      className={cn(
        'sticky top-24 w-full transition-opacity duration-500 ease-in-out',
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          'rounded-lg',
          'max-h-[calc((100vh-8rem)*0.5)] min-h-[100px]',
          'no-scrollbar overflow-y-auto',
          'transition-[max-height] duration-500 ease-in-out'
        )}
        ref={listRef}
        style={{
          maxHeight: isHovered ? 'calc((100vh-8rem)*0.5)' : 'min(400px, 60vh)',
        }}
      >
        <ul className="animate-fadeIn flex flex-col gap-2 py-1">
          {visibleToc.map((item, index) => {
            const isActive = item.url === `#${activeId}`

            return (
              <li
                key={item.url}
                ref={isActive ? activeItemRef : null}
                className={cn('group relative transition-all duration-500 ease-out', {
                  'scale-95 opacity-30': !isActive && !isHovered,
                  'scale-100 opacity-100': isActive || isHovered,
                })}
                style={{
                  animationDelay: `${Math.min(index * 50, 200)}ms`,
                }}
              >
                {/* Text Layer (Visible on Hover or Active) */}
                <a
                  href={item.url}
                  className={cn(
                    'line-clamp-2 block py-1.5 text-sm transition-all duration-300 ease-out',
                    isHovered || isActive
                      ? 'translate-x-0 opacity-100'
                      : 'pointer-events-none absolute top-0 left-0 w-full -translate-x-2 opacity-0',
                    isActive
                      ? 'text-primary-500 font-medium'
                      : 'hover:text-primary-500 text-gray-500 dark:text-gray-400'
                  )}
                  style={{
                    paddingLeft: isHovered || isActive ? `${(item.depth - 2) * 12}px` : 0,
                  }}
                  onClick={(e) => {
                    const el = document.getElementById(item.url.slice(1))
                    if (el) {
                      const headerOffset = 100
                      const elementPosition = el.getBoundingClientRect().top
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth',
                      })
                      // Update URL without page jump
                      history.pushState(null, '', item.url)
                    }
                  }}
                >
                  {item.value}
                </a>

                {/* Skeleton Layer (Visible when NOT Hovered and NOT Active) */}
                <div
                  className={cn(
                    'h-2 rounded-full transition-all duration-500 ease-out',
                    isHovered || isActive ? 'w-0 opacity-0' : 'opacity-100',
                    isActive ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                  )}
                  style={{
                    width:
                      isHovered || isActive
                        ? 0
                        : `${Math.max(30, 90 - (item.depth - 2) * 8 - (index % 3) * 10)}%`,
                    marginLeft: isHovered || isActive ? 0 : `${(item.depth - 2) * 12}px`,
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
