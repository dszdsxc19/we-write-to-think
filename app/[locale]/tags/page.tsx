import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { slug } from 'github-slugger'
import { allBlogs } from 'contentlayer/generated'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import { getTranslations } from 'next-intl/server'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params
  const { locale } = params
  const t = await getTranslations('tags')
  const filteredBlogs = allBlogs.filter(
    (post) => post.locale === locale && (process.env.NODE_ENV !== 'production' || !post.draft)
  )

  // Build tag counts from filtered blogs
  const tagCounts: Record<string, number> = {}
  filteredBlogs.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => {
        const tagSlug = slug(tag)
        tagCounts[tagSlug] = (tagCounts[tagSlug] || 0) + 1
      })
    }
  })

  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  return (
    <>
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0 dark:divide-gray-700">
        <div className="space-x-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14 dark:text-gray-100">
            {t('title')}
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {tagKeys.length === 0 && t('noTags')}
          {sortedTags.map((t) => {
            return (
              <div key={t} className="mt-2 mr-5 mb-2">
                <Tag text={t} />
                <Link
                  href={`/tags/${slug(t)}`}
                  className="-ml-2 text-sm font-semibold text-gray-600 uppercase dark:text-gray-300"
                  aria-label={`View posts tagged ${t}`}
                >
                  {` (${tagCounts[t]})`}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
