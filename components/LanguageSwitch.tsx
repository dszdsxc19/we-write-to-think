'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/navigation'

const LanguageSwitch = () => {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const toggleLocale = () => {
    const newLocale = locale === 'zh' ? 'en' : 'zh'
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="relative inline-flex h-9 items-center rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
      <button
        type="button"
        onClick={toggleLocale}
        className={`relative z-10 h-7 rounded-md px-3 text-sm font-medium transition-colors duration-200 ${
          locale === 'zh'
            ? 'text-gray-900 dark:text-gray-100'
            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
        }`}
        aria-label="中文"
      >
        中
      </button>
      <button
        type="button"
        onClick={toggleLocale}
        className={`relative z-10 h-7 rounded-md px-3 text-sm font-medium transition-colors duration-200 ${
          locale === 'en'
            ? 'text-gray-900 dark:text-gray-100'
            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
        }`}
        aria-label="English"
      >
        En
      </button>
      <div
        className={`absolute top-1 h-7 rounded-md bg-white shadow-sm transition-all duration-200 dark:bg-gray-700 ${
          locale === 'zh'
            ? 'left-1 w-[calc(50%-4px)]'
            : 'left-1/2 w-[calc(50%-4px)] -translate-x-0.5'
        }`}
      />
    </div>
  )
}

export default LanguageSwitch
