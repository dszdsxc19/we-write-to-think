'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidProps {
  chart: string
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'inherit',
})

export default function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [id] = useState(() => `mermaid-${Math.random().toString(36).substring(2, 9)}`)

  useEffect(() => {
    const renderChart = async () => {
      try {
        // Clean up the chart content - remove leading/trailing whitespace
        const cleanChart = chart.trim()
        const { svg } = await mermaid.render(id, cleanChart)
        setSvg(svg)
      } catch (error) {
        console.error('Mermaid render error:', error)
        // Fallback: show the code
        setSvg(`<pre class="mermaid-error">${chart}</pre>`)
      }
    }

    if (chart && containerRef.current) {
      renderChart()
    }
  }, [chart, id])

  return (
    <div
      ref={containerRef}
      className="mermaid-container my-4 overflow-x-auto rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
