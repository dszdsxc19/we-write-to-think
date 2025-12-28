import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { readFileSync } from 'fs'
import { join } from 'path'

const POSTS_PER_PAGE = 5

// Get tag counts from tag-data.json
function getTagCounts(): Record<string, number> {
  try {
    const tagDataPath = join(process.cwd(), 'public', 'tag-data.json')
    const tagDataContent = readFileSync(tagDataPath, 'utf-8')
    return JSON.parse(tagDataContent) as Record<string, number>
  } catch (e) {
    return {}
  }
}

export const metadata = genPageMetadata({ title: 'Blog' })

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page: string }>
}) {
  const { locale } = await params
  // Filter posts by locale
  const posts = allCoreContent(sortPosts(allBlogs.filter((post) => post.locale === locale)))
  const pageNumber = 1
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE * pageNumber)
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }
  const tagCounts = getTagCounts()

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
      tagCounts={tagCounts}
    />
  )
}
