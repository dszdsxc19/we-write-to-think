'use client'

import { useEffect } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'inherit',
})

export default function MermaidLoader() {
  useEffect(() => {
    const renderMermaid = async () => {
      // Find all mermaid code blocks
      const mermaidPreBlocks = document.querySelectorAll('pre[class*="language-mermaid"]')

      for (const pre of Array.from(mermaidPreBlocks)) {
        // Skip if already rendered
        if (pre.parentElement?.classList.contains('mermaid-wrapper')) {
          continue
        }

        // Extract the code content
        const codeEl = pre.querySelector('code')
        if (!codeEl) continue

        const codeContent = codeEl.textContent || ''
        if (!codeContent.trim()) continue

        try {
          const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`
          const { svg } = await mermaid.render(id, codeContent.trim())

          // Create wrapper div
          const wrapper = document.createElement('div')
          wrapper.className =
            'mermaid-wrapper my-4 flex justify-center overflow-x-auto rounded-lg bg-gray-50 p-4 dark:bg-gray-800'
          wrapper.innerHTML = svg

          // Replace the pre block with the wrapper
          pre.parentElement?.replaceChild(wrapper, pre)
        } catch (error) {
          console.error('Mermaid render error:', error)
        }
      }
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(renderMermaid, 100)
    return () => clearTimeout(timer)
  }, [])

  return null
}
