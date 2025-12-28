import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
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

export const generateStaticParams = async () => {
  const totalPages = Math.ceil(allBlogs.length / POSTS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))

  return paths
}

export default async function Page(props: { params: Promise<{ locale: string; page: string }> }) {
  const params = await props.params
  const { locale } = params
  const posts = allCoreContent(sortPosts(allBlogs.filter((post) => post.locale === locale)))
  const pageNumber = parseInt(params.page as string)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
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
