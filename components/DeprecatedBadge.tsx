'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

interface DeprecatedBadgeProps {
  showWarning?: boolean
}

export default function DeprecatedBadge({ showWarning = false }: DeprecatedBadgeProps) {
  const t = useTranslations('deprecated')
  const params = useParams()
  const locale = params.locale as string

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium tracking-wide text-amber-700 uppercase dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
        <svg
          className="mr-0.5 h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        {t('label')}
      </span>
      {showWarning && (
        <span className="hidden text-xs text-amber-600 sm:inline dark:text-amber-400">
          {t('warning')}
        </span>
      )}
    </div>
  )
}
