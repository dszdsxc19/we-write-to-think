import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'
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

export async function generateMetadata(props: {
  params: Promise<{ locale: string; tag: string }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
  })
}

// Get all unique tags from allBlogs across all locales
function getAllTags(): string[] {
  const tagSet = new Set<string>()
  allBlogs.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => {
        tagSet.add(slug(tag))
      })
    }
  })
  return Array.from(tagSet)
}

export const generateStaticParams = async () => {
  const tags = getAllTags()
  return tags.map((tag) => ({
    tag: encodeURI(tag),
  }))
}

export default async function TagPage(props: { params: Promise<{ locale: string; tag: string }> }) {
  const params = await props.params
  const { locale } = params
  const tag = decodeURI(params.tag)
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  const filteredPosts = allCoreContent(
    sortPosts(
      allBlogs.filter(
        (post) => post.locale === locale && post.tags && post.tags.map((t) => slug(t)).includes(tag)
      )
    )
  )
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = filteredPosts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: totalPages,
  }
  const tagCounts = getTagCounts()

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={title}
      tagCounts={tagCounts}
    />
  )
}
