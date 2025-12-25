import { visit } from 'unist-util-visit'

export function remarkMermaid() {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang === 'mermaid') {
        // Replace the code node with a div that has data-mermaid attribute
        const value = node.value.trim()
        const mermaidNode = {
          type: 'html',
          value: `<div class="mermaid-chart" data-chart="${encodeURIComponent(value)}"></div>`,
        }

        parent.children.splice(index, 1, mermaidNode)
      }
    })
  }
}
