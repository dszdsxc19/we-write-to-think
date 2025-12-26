'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@/navigation'
import type { Blog } from 'contentlayer/generated'
import { CoreContent } from 'pliny/utils/contentlayer'
import { X, BookOpen, Clock, Calendar } from 'lucide-react'
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

  // Dimensions & Layout
  const NODE_WIDTH = 300
  const START_PADDING = 150
  const HALF_NODE = NODE_WIDTH / 2
  const AMPLITUDE = 80 // Increased amplitude
  const SVG_HEIGHT = AMPLITUDE * 2 + 200
  const CENTER_Y = SVG_HEIGHT / 2

  // Generate Path for the Beam
  const generatePath = () => {
    if (seriesPosts.length < 2) return ''

    let path = `M ${START_PADDING + HALF_NODE} ${CENTER_Y + -AMPLITUDE}`

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
        className="group border-primary-500/30 bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 dark:border-primary-400/30 dark:bg-primary-400/10 dark:text-primary-400 relative overflow-hidden rounded-lg border px-5 py-2.5 text-sm font-medium transition-all hover:shadow-lg"
      >
        <span className="relative z-10 flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span>View Series Roadmap</span>
          <span className="bg-primary-500/20 text-primary-700 dark:text-primary-300 ml-1 rounded-full px-2 py-0.5 text-xs">
            {seriesPosts.length}
          </span>
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-white/30 backdrop-blur-xl dark:bg-black/40"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/20 bg-white/50 px-8 py-5 backdrop-blur-md dark:border-white/10 dark:bg-black/50">
              <div className="flex flex-col">
                <span className="text-primary-600 dark:text-primary-400 text-xs font-bold tracking-widest uppercase">
                  Series Roadmap
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {series}
                </h2>
              </div>
              <button
                onClick={toggleOpen}
                className="rounded-full bg-gray-100/50 p-2 text-gray-500 transition-colors hover:bg-gray-200/50 hover:text-gray-900 dark:bg-gray-800/50 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-white"
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
                  width: `${Math.max(100, seriesPosts.length * NODE_WIDTH + 300)}px`,
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
                    className="stroke-gray-300/50 dark:stroke-gray-700/50"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Animated Glowing Path */}
                  <motion.path
                    d={generatePath()}
                    fill="none"
                    stroke="url(#beam-gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: Math.max(3, seriesPosts.length * 0.5),
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatType: 'loop',
                      repeatDelay: 1,
                    }}
                  />
                  <defs>
                    <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" /> {/* Blue */}
                      <stop offset="50%" stopColor="#8b5cf6" /> {/* Violet */}
                      <stop offset="100%" stopColor="#ec4899" /> {/* Pink */}
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
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
                      className="group absolute flex flex-col items-center justify-center"
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
                            'relative z-20 flex h-12 w-12 items-center justify-center rounded-full border-4 shadow-lg transition-all duration-500',
                            isCurrent
                              ? 'border-white bg-gradient-to-br from-blue-500 to-purple-600 text-white ring-4 shadow-blue-500/50 ring-blue-500/20 dark:border-gray-900'
                              : isPast
                                ? 'border-white bg-gray-900 text-white dark:border-gray-800 dark:bg-gray-700'
                                : 'border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-600'
                          )}
                          whileHover={{ scale: 1.2 }}
                        >
                          {isPast ? (
                            <span className="text-lg font-bold">✓</span>
                          ) : isCurrent ? (
                            <div className="h-3 w-3 animate-pulse rounded-full bg-white" />
                          ) : (
                            <span className="text-sm font-bold">{post.step ?? index + 1}</span>
                          )}
                        </motion.div>
                      </Link>

                      {/* Info Card (Hover or Current) */}
                      <div
                        className={twMerge(
                          'pointer-events-none absolute w-72 p-1 transition-all duration-300',
                          isEven ? 'top-16' : 'bottom-16',
                          isCurrent
                            ? 'pointer-events-auto z-10 opacity-100'
                            : 'z-0 opacity-0 group-hover:pointer-events-auto group-hover:z-30 group-hover:opacity-100'
                        )}
                      >
                        <div
                          className={twMerge(
                            'relative overflow-hidden rounded-2xl border bg-white/80 p-5 shadow-2xl backdrop-blur-md transition-all dark:bg-gray-900/80',
                            isCurrent
                              ? 'border-blue-500/30 dark:border-blue-400/30'
                              : 'border-white/20 dark:border-gray-700/50'
                          )}
                        >
                          {/* Decorate gradient for current */}
                          {isCurrent && (
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                          )}

                          <div className="relative">
                            <div className="mb-3 flex items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                              <span
                                className={twMerge(
                                  'rounded-full px-2 py-0.5',
                                  isCurrent
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                    : 'bg-gray-100 dark:bg-gray-800'
                                )}
                              >
                                Step {post.step ?? index + 1}
                              </span>
                              {post.readingTime && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {post.readingTime.text}
                                </span>
                              )}
                            </div>
                            <h3 className="mb-2 text-lg leading-tight font-bold text-gray-900 dark:text-gray-100">
                              <Link href={`/blog/${post.slug}`} onClick={() => setIsOpen(false)}>
                                <span className="absolute inset-0" />
                                {post.title}
                              </Link>
                            </h3>
                            <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                              {post.summary}
                            </p>
                          </div>
                        </div>
                      </div>
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
