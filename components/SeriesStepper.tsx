import Link from 'next/link'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Helper to merge tailwind classes
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs))
}

interface SeriesPost {
  title: string
  slug: string
  order: number
}

interface SeriesStepperProps {
  seriesTitle: string
  currentPostSlug: string
  posts: SeriesPost[]
}

export default function SeriesStepper({ seriesTitle, currentPostSlug, posts }: SeriesStepperProps) {
  if (!posts || posts.length === 0) return null

  // Ensure posts are sorted by order
  const sortedPosts = [...posts].sort((a, b) => a.order - b.order)

  return (
    <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
      <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">{seriesTitle}</h3>
      <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3">
        {sortedPosts.map((post, index) => {
          const isCurrent = post.slug === currentPostSlug
          return (
            <div key={post.slug} className="mb-6 ml-6 last:mb-0">
              <span
                className={cn(
                  "absolute -left-1.5 flex h-3 w-3 items-center justify-center rounded-full ring-4 ring-white dark:ring-gray-900",
                  isCurrent
                    ? "bg-primary-500 ring-primary-500/30"
                    : "bg-gray-200 dark:bg-gray-700"
                )}
              />
              <Link
                href={`/${post.slug}`}
                className={cn(
                  "block text-sm transition-colors hover:text-primary-500 dark:hover:text-primary-400",
                  isCurrent
                    ? "font-medium text-primary-500 dark:text-primary-400"
                    : "text-gray-600 dark:text-gray-400"
                )}
              >
                {post.title}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
