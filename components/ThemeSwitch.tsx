'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

const Sun = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="group-hover:text-gray-100 group-hover:rotate-90 h-6 w-6 transition-transform duration-300"
  >
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
      clipRule="evenodd"
    />
  </svg>
)
const Moon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="group-hover:text-gray-100 h-6 w-6 transition-transform duration-300 ease-in-out group-hover:-rotate-12"
  >
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
)

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'

    // Animation logic
    const duration = 500 // 0.5s expansion
    const fadeDuration = 300 // 0.3s fade out

    const overlay = document.createElement('div')

    // Style the overlay
    overlay.style.position = 'fixed'
    overlay.style.top = '0'
    overlay.style.right = '0'
    overlay.style.zIndex = '9999' // Cover everything
    overlay.style.borderRadius = '50%'
    // Start small
    overlay.style.width = '0px'
    overlay.style.height = '0px'
    overlay.style.transform = 'translate(50%, -50%)' // Center at top-right

    // Use white background with difference blend mode to invert colors underneath
    // This creates the visual effect of switching to the opposite theme without covering the text
    overlay.style.backgroundColor = '#ffffff'
    overlay.style.mixBlendMode = 'difference'

    overlay.style.transition = `width ${duration}ms ease-in, height ${duration}ms ease-in`

    document.body.appendChild(overlay)

    // Calculate radius to cover the screen from top-right to bottom-left
    const maxDimension = Math.hypot(window.innerWidth, window.innerHeight)
    const diameter = maxDimension * 2.5 // Safety margin

    // Force reflow
    void overlay.offsetHeight

    // Start expansion
    overlay.style.width = `${diameter}px`
    overlay.style.height = `${diameter}px`

    // When expansion ends, switch theme and then fade out
    setTimeout(() => {
      setTheme(newTheme)

      // Wait a tiny bit for React to update DOM (optional but safer)
      setTimeout(() => {
        overlay.style.transition = `opacity ${fadeDuration}ms ease-out`
        overlay.style.opacity = '0'

        // Remove after fade
        setTimeout(() => {
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay)
          }
        }, fadeDuration)
      }, 50)
    }, duration)
  }

  if (!mounted) {
    return null
  }

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="group mr-1 ml-1 h-8 w-8 rounded-full p-1 sm:ml-4"
      onClick={toggleTheme}
    >
      {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
    </button>
  )
}

export default ThemeSwitch
