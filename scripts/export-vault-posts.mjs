import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const repoRoot = process.cwd()
const vaultRoot = path.resolve(repoRoot, '../obsidian-base')
const outputsRoot = path.join(vaultRoot, '40 Outputs')
const targetRoot = path.join(repoRoot, 'data', 'blog', 'zh')
const legacyRoot = path.join(repoRoot, 'data', 'blog', '_legacy')
const generatedAssetsRoot = path.join(repoRoot, 'public', 'static', 'vault')
const markerPath = path.join(targetRoot, '.vault-export.json')

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif'])

async function pathExists(target) {
  try {
    await fs.access(target)
    return true
  } catch {
    return false
  }
}

async function ensureDir(target) {
  await fs.mkdir(target, { recursive: true })
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        return walk(fullPath)
      }
      return [fullPath]
    })
  )
  return files.flat()
}

function slugify(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/\.(md|mdx)$/i, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-\/]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/\/+/g, '/')
    .replace(/(^[-/]+|[-/]+$)/g, '')
}

function stripWikiTarget(target) {
  return target.split('|')[0].trim()
}

function stripMarkdownExt(value) {
  return value.replace(/\.(md|mdx)$/i, '')
}

function toPosix(value) {
  return value.split(path.sep).join('/')
}

function pickSummary(data, content) {
  if (data.summary) return String(data.summary)
  if (data.description) return String(data.description)
  const firstParagraph = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .find((block) => block && !block.startsWith('#') && !block.startsWith('!['))
  return firstParagraph ? firstParagraph.slice(0, 180) : ''
}

function buildFrontmatter(note, content) {
  const frontmatter = {
    title: note.data.title ?? note.basename,
    date: note.data.created ?? note.data.updated ?? new Date().toISOString().slice(0, 10),
    tags: Array.isArray(note.data.tags) ? note.data.tags : [],
    summary: pickSummary(note.data, content),
    draft: Boolean(note.data.draft),
  }

  if (note.data.series) {
    frontmatter.series = note.data.series
  }
  if (typeof note.data.series_order !== 'undefined') {
    frontmatter.step = note.data.series_order
  }
  if (note.data.blog_layout) {
    frontmatter.layout = note.data.blog_layout
  } else {
    frontmatter.layout = 'PostLayout'
  }

  return matter.stringify(content, frontmatter)
}

async function buildAttachmentIndex(root) {
  const files = await walk(root)
  const index = new Map()
  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    if (!IMAGE_EXTENSIONS.has(ext)) continue
    const basename = path.basename(file)
    if (!index.has(basename)) {
      index.set(basename, [])
    }
    index.get(basename).push(file)
  }
  return index
}

function buildPublishIndex(notes) {
  const index = new Map()
  for (const note of notes) {
    const keys = new Set([
      note.data.title,
      note.basename,
      stripMarkdownExt(path.basename(note.file)),
      stripMarkdownExt(toPosix(path.relative(vaultRoot, note.file))),
      stripMarkdownExt(toPosix(path.relative(outputsRoot, note.file))),
    ])
    for (const key of keys) {
      if (!key) continue
      index.set(key, note.slug)
    }
  }
  return index
}

function resolveAttachment(note, target, attachmentIndex) {
  const cleanTarget = stripWikiTarget(target)
  const localCandidates = [
    path.join(path.dirname(note.file), 'attachments', cleanTarget),
    path.join(path.dirname(note.file), cleanTarget),
  ]

  for (const candidate of localCandidates) {
    if (attachmentIndex.has(path.basename(candidate))) {
      const exact = attachmentIndex
        .get(path.basename(candidate))
        .find((item) => path.resolve(item) === path.resolve(candidate))
      if (exact) return exact
    }
  }

  const indexed = attachmentIndex.get(path.basename(cleanTarget))
  return indexed?.[0] ?? null
}

async function convertBody(note, publishIndex, attachmentIndex, copiedAssets, unresolvedAssets) {
  const segments = note.content.split(/(```[\s\S]*?```)/g)

  return segments
    .map((segment, index) => {
      if (index % 2 === 1) {
        return segment
      }

      let transformed = segment

      transformed = transformed.replace(/!\[\[([^\]]+)\]\]/g, (_, rawTarget) => {
        const attachment = resolveAttachment(note, rawTarget, attachmentIndex)
        if (!attachment) {
          unresolvedAssets.push({ file: note.file, target: rawTarget })
          return `![${rawTarget}](${rawTarget})`
        }

        const basename = path.basename(attachment)
        const assetRelativeDir = path.posix.join('static', 'vault', note.slug)
        const assetPublicPath = `/${assetRelativeDir}/${basename}`
        copiedAssets.push({
          source: attachment,
          target: path.join(repoRoot, 'public', assetRelativeDir, basename),
        })
        return `![](${assetPublicPath})`
      })

      transformed = transformed.replace(/\[\[([^\]]+)\]\]/g, (_, rawTarget) => {
        const [targetPart, labelPart] = rawTarget.split('|').map((item) => item.trim())
        const label = labelPart || path.basename(stripMarkdownExt(targetPart))
        const slug =
          publishIndex.get(targetPart) ||
          publishIndex.get(stripMarkdownExt(targetPart)) ||
          publishIndex.get(path.basename(stripMarkdownExt(targetPart)))
        if (!slug) {
          return label
        }
        return `[${label}](/zh/blog/${slug})`
      })

      return transformed
    })
    .join('')
}

async function cleanGeneratedRoots() {
  if (await pathExists(generatedAssetsRoot)) {
    await fs.rm(generatedAssetsRoot, { recursive: true, force: true })
  }

  const hasMarker = await pathExists(markerPath)
  if (hasMarker) {
    await fs.rm(targetRoot, { recursive: true, force: true })
    return
  }

  if (await pathExists(targetRoot)) {
    await ensureDir(legacyRoot)
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = path.join(legacyRoot, `zh-pre-vault-export-${stamp}`)
    await fs.rename(targetRoot, backupPath)
  }
}

async function loadPublishedNotes() {
  const files = (await walk(outputsRoot)).filter((file) => file.endsWith('.md'))
  const notes = []

  for (const file of files) {
    const raw = await fs.readFile(file, 'utf8')
    const parsed = matter(raw)
    if (parsed.data.publish !== 'blog') continue
    const slug = String(parsed.data.publish_slug || slugify(parsed.data.title || path.basename(file, '.md')))
    notes.push({
      file,
      basename: path.basename(file, '.md'),
      slug,
      data: parsed.data,
      content: parsed.content.trim(),
    })
  }

  return notes
}

async function copyAssets(copiedAssets) {
  const seen = new Set()
  for (const asset of copiedAssets) {
    const key = `${asset.source}=>${asset.target}`
    if (seen.has(key)) continue
    seen.add(key)
    await ensureDir(path.dirname(asset.target))
    await fs.copyFile(asset.source, asset.target)
  }
}

async function writePosts(notes, publishIndex, attachmentIndex) {
  const copiedAssets = []
  const unresolvedAssets = []

  for (const note of notes) {
    const convertedBody = await convertBody(
      note,
      publishIndex,
      attachmentIndex,
      copiedAssets,
      unresolvedAssets
    )
    const mdx = buildFrontmatter(note, convertedBody)
    const targetFile = path.join(targetRoot, `${note.slug}.mdx`)
    await ensureDir(path.dirname(targetFile))
    await fs.writeFile(targetFile, mdx, 'utf8')
  }

  await copyAssets(copiedAssets)
  await fs.writeFile(
    markerPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourceVault: vaultRoot,
        noteCount: notes.length,
        unresolvedAssets,
      },
      null,
      2
    )
  )

  return { copiedAssets: copiedAssets.length, unresolvedAssets }
}

async function main() {
  const notes = await loadPublishedNotes()
  const publishIndex = buildPublishIndex(notes)
  const attachmentIndex = await buildAttachmentIndex(outputsRoot)

  await cleanGeneratedRoots()
  await ensureDir(targetRoot)

  const result = await writePosts(notes, publishIndex, attachmentIndex)

  console.log(
    JSON.stringify(
      {
        exported: notes.length,
        copiedAssets: result.copiedAssets,
        unresolvedAssets: result.unresolvedAssets.length,
        targetRoot,
      },
      null,
      2
    )
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
