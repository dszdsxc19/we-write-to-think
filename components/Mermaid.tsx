'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

const Mermaid = ({ chart }: { chart: string }) => {
  const [svg, setSvg] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    let isMounted = true

    const renderChart = async () => {
      if (!chart) return

      try {
        // Dynamically import mermaid to avoid server-side issues and bundle size
        const { default: mermaid } = await import('mermaid')

        if (!isMounted) return

        const mermaidTheme = resolvedTheme === 'dark' ? 'dark' : 'default'

        mermaid.initialize({
          startOnLoad: false,
          theme: mermaidTheme,
          securityLevel: 'loose',
          fontFamily: 'inherit',
        })

        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        const { svg: renderedSvg } = await mermaid.render(id, chart)

        if (isMounted) {
          setSvg(renderedSvg)
          setError(null)
        }
      } catch (err) {
        console.error('Mermaid render error:', err)
        if (isMounted) {
          setError('Failed to render diagram. Check syntax.')
        }
      }
    }

    renderChart()

    return () => {
      isMounted = false
    }
  }, [chart, resolvedTheme])

  if (error) {
    return (
      <div className="my-4 rounded bg-red-50 p-4 text-red-500 border border-red-200">
        <p className="font-bold">Mermaid Error:</p>
        <pre className="text-sm overflow-auto">{error}</pre>
        <pre className="mt-2 text-xs text-gray-500">{chart}</pre>
      </div>
    )
  }

  // Use a min-height or placeholder to minimize layout shift if possible,
  // but since size is unknown, we just render.
  return (
    <div
      className="mermaid-diagram my-6 flex justify-center overflow-x-auto bg-transparent p-4 rounded-lg"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export default Mermaid
