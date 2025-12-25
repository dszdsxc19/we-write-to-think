import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import dynamic from 'next/dynamic'
import React, { ReactNode, ReactElement, isValidElement } from 'react'

const Mermaid = dynamic(() => import('./Mermaid'), {
  loading: () => <div className="flex justify-center my-4"><div className="animate-pulse bg-gray-100 h-24 w-full max-w-lg rounded text-center pt-8 text-gray-400">Loading Diagram...</div></div>
})

const extractText = (node: ReactNode): string => {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (isValidElement(node)) {
    // Explicitly cast props to any to avoid "unknown" type error
    const children = (node.props as any).children
    return extractText(children)
  }
  return ''
}

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: (props) => {
    // Find the code element
    // MDX code blocks are usually <pre><code className="...">...</code></pre>
    const children = props.children
    let codeElement: ReactElement | null = null

    if (isValidElement(children)) {
       codeElement = children as ReactElement
    } else if (Array.isArray(children)) {
       // Find the first element with props (likely the code element)
       // or specifically check for one that looks like it has the class
       const found = children.find(child =>
         isValidElement(child) &&
         (child.props as any)?.className?.includes('language-mermaid')
       )
       if (found) codeElement = found as ReactElement
    }

    if (codeElement) {
       const childProps = codeElement.props as any
       const className = childProps?.className

       if (typeof className === 'string' && className.includes('language-mermaid')) {
          const chart = extractText(childProps?.children)
          if (chart) {
            return <Mermaid chart={chart} />
          }
       }
    }

    return <Pre {...props} />
  },
  table: TableWrapper,
  BlogNewsletterForm,
  Mermaid,
}
