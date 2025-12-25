'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@/navigation'
import type { Blog } from 'contentlayer/generated'
import { CoreContent } from 'pliny/utils/contentlayer'
import { X, BookOpen, Clock } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

interface SeriesRoadmapProps {
  series: string
  currentPostSlug: string
  posts: CoreContent<Blog>[]
}

export default function SeriesRoadmap({ series, currentPostSlug, posts }: SeriesRoadmapProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter and sort posts for the series
  const seriesPosts = posts
    .filter((post) => post.series === series)
    .sort((a, b) => (a.step || 0) - (b.step || 0))

  const toggleOpen = () => setIsOpen(!isOpen)

  useEffect(() => {
    if (isOpen && containerRef.current) {
      disableBodyScroll(containerRef.current)
    } else {
      clearAllBodyScrollLocks()
    }
    return () => clearAllBodyScrollLocks()
  }, [isOpen])

  // Dimensions
  const NODE_WIDTH = 280
  const START_PADDING = 100
  const HALF_NODE = NODE_WIDTH / 2
  const AMPLITUDE = 60 // Vertical offset for staggering
  const SVG_HEIGHT = AMPLITUDE * 2 + 100 // Enough height for waves
  const CENTER_Y = SVG_HEIGHT / 2

  // Generate Path for the Beam
  const generatePath = () => {
    if (seriesPosts.length < 2) return ''

    let path = `M ${START_PADDING + HALF_NODE} ${CENTER_Y + (0 % 2 === 0 ? -AMPLITUDE : AMPLITUDE)}`

    for (let i = 0; i < seriesPosts.length - 1; i++) {
      const startX = START_PADDING + i * NODE_WIDTH + HALF_NODE
      const startY = CENTER_Y + (i % 2 === 0 ? -AMPLITUDE : AMPLITUDE)
      const endX = START_PADDING + (i + 1) * NODE_WIDTH + HALF_NODE
      const endY = CENTER_Y + ((i + 1) % 2 === 0 ? -AMPLITUDE : AMPLITUDE)

      // Control points for smooth S-curve
      const cp1X = startX + NODE_WIDTH / 2
      const cp1Y = startY
      const cp2X = endX - NODE_WIDTH / 2
      const cp2Y = endY

      path += ` C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`
    }
    return path
  }

  return (
    <>
      <button
        onClick={toggleOpen}
        className="group border-primary-500/20 bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 dark:border-primary-400/20 dark:bg-primary-400/10 dark:text-primary-400 mb-8 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
      >
        <BookOpen className="h-4 w-4" />
        <span>View Series Roadmap</span>
        <span className="bg-primary-500/20 text-primary-600 dark:bg-primary-400/20 dark:text-primary-300 ml-1 rounded-full px-2 py-0.5 text-xs">
          {seriesPosts.length} posts
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-white/95 backdrop-blur-xl dark:bg-gray-950/95"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
              <div className="flex flex-col">
                <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Series Roadmap
                </span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{series}</h2>
              </div>
              <button
                onClick={toggleOpen}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Scrollable Area */}
            <div
              className="relative flex h-full items-center overflow-x-auto overflow-y-hidden"
              ref={containerRef}
            >
              <div
                className="relative flex min-h-full min-w-full items-center px-[100px]"
                style={{
                  width: `${Math.max(100, seriesPosts.length * NODE_WIDTH + 200)}px`,
                  height: '100%',
                }}
              >
                {/* Glowing Beam (SVG) */}
                <svg
                  className="pointer-events-none absolute left-0 overflow-visible"
                  style={{
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '100%',
                    height: SVG_HEIGHT,
                  }}
                  width="100%"
                  height={SVG_HEIGHT}
                >
                  {/* Background Path (Static dim line) */}
                  <path
                    d={generatePath()}
                    fill="none"
                    className="stroke-gray-200 dark:stroke-gray-800"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  {/* Animated Glowing Path */}
                  <motion.path
                    d={generatePath()}
                    fill="none"
                    stroke="url(#beam-gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: Math.max(2, seriesPosts.length * 0.4),
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatType: 'loop',
                      repeatDelay: 0.5,
                    }}
                  />
                  <defs>
                    <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="transparent" />
                      <stop offset="50%" stopColor="currentColor" className="text-primary-500" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Nodes */}
                {seriesPosts.map((post, index) => {
                  const isCurrent = post.slug === currentPostSlug
                  const isPast =
                    (post.step || 0) <
                    (seriesPosts.find((p) => p.slug === currentPostSlug)?.step || 0)

                  const isEven = index % 2 === 0
                  const yOffset = isEven ? -AMPLITUDE : AMPLITUDE

                  return (
                    <div
                      key={post.slug}
                      className="absolute flex flex-col items-center justify-center"
                      style={{
                        width: NODE_WIDTH,
                        left: START_PADDING + index * NODE_WIDTH,
                        top: '50%',
                        transform: `translateY(calc(-50% + ${yOffset}px))`,
                      }}
                    >
                      {/* Node Point */}
                      <Link href={`/blog/${post.slug}`} onClick={() => setIsOpen(false)}>
                        <motion.div
                          className={twMerge(
                            'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300',
                            isCurrent
                              ? 'border-primary-500 bg-primary-500 scale-125 text-white shadow-[0_0_20px_rgba(var(--color-primary-500),0.5)]'
                              : isPast
                                ? 'border-primary-500 bg-primary-500 text-white'
                                : 'border-gray-300 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-900'
                          )}
                          whileHover={{ scale: 1.3 }}
                        >
                          {isPast || isCurrent ? (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          ) : (
                            <span className="text-xs">{index + 1}</span>
                          )}
                        </motion.div>
                      </Link>

                      {/* Info Card (Hover) */}
                      <motion.div
                        initial={{ opacity: 0, y: isEven ? -10 : 10 }} // Slight slide in direction
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: '0px 0px -50px 0px' }}
                        className={twMerge(
                          'absolute w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-xl transition-all dark:border-gray-700 dark:bg-gray-900',
                          isCurrent
                            ? 'ring-primary-500/20 dark:ring-primary-400/20 ring-2'
                            : 'opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0',
                          // If node is UP (even, -offset), card goes DOWN (top: 100% + spacing)
                          // If node is DOWN (odd, +offset), card goes UP (bottom: 100% + spacing)
                          isEven ? 'top-12' : 'bottom-12'
                        )}
                      >
                        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-mono">Step {post.step ?? index}</span>
                          {post.readingTime && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.readingTime.text}
                              </span>
                            </>
                          )}
                        </div>
                        <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">
                          <Link href={`/blog/${post.slug}`} onClick={() => setIsOpen(false)}>
                            <span className="absolute inset-0" />
                            {post.title}
                          </Link>
                        </h3>
                        <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                          {post.summary}
                        </p>
                      </motion.div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
