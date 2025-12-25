'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion'
import { Link } from '@/navigation'
import type { Blog } from 'contentlayer/generated'
import { CoreContent } from 'pliny/utils/contentlayer'
import { X, BookOpen, Clock, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
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

  // Calculate SVG path based on nodes
  const NODE_WIDTH = 280 // Width of card area + spacing
  const START_PADDING = 100
  const HALF_NODE = NODE_WIDTH / 2
  const pathLength = (seriesPosts.length - 1) * NODE_WIDTH

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
                className="relative flex min-w-full items-center px-[100px]"
                style={{ width: `${Math.max(100, seriesPosts.length * NODE_WIDTH + 200)}px` }}
              >
                {/* Connecting Line (Background) */}
                <div className="absolute top-1/2 right-0 left-0 h-0.5 -translate-y-1/2 bg-gray-200 dark:bg-gray-800" />

                {/* Glowing Beam (SVG) */}
                <svg
                  className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 overflow-visible"
                  width="100%"
                  height="20"
                  style={{ minWidth: '100%' }}
                >
                  <motion.path
                    d={`M ${START_PADDING + HALF_NODE} 10 L ${START_PADDING + HALF_NODE + pathLength} 10`}
                    fill="none"
                    stroke="url(#beam-gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 2,
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

                  return (
                    <div
                      key={post.slug}
                      className="group relative flex flex-shrink-0 flex-col items-center justify-center"
                      style={{ width: NODE_WIDTH }}
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
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: '0px 0px -50px 0px' }} // Adjust as needed
                        className={twMerge(
                          'absolute top-12 w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-xl transition-all dark:border-gray-700 dark:bg-gray-900',
                          isCurrent
                            ? 'ring-primary-500/20 dark:ring-primary-400/20 ring-2'
                            : 'opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0'
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
