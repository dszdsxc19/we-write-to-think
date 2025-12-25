import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'
import { routing } from '@/navigation'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  // Filter posts by locale
  const sortedPosts = sortPosts(
    allBlogs.filter(
      (post) => post.locale === locale && (process.env.NODE_ENV !== 'production' || !post.draft)
    )
  )
  const posts = allCoreContent(sortedPosts)
  return <Main posts={posts} />
}
