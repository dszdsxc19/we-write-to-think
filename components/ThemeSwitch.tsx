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
    className="h-6 w-6 transition-transform duration-300 ease-in-out group-hover:-rotate-12"
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
    overlay.style.width = '100vw'
    overlay.style.height = '100vh'
    overlay.style.zIndex = '9999' // Cover everything
    overlay.style.pointerEvents = 'none' // Don't block clicks during fade out (though we remove it)

    // Set solid background color based on target theme
    // We use a solid color to prevent color overlapping artifacts and flickering
    if (newTheme === 'dark') {
      overlay.style.backgroundColor = 'var(--color-gray-950, #030712)'
    } else {
      overlay.style.backgroundColor = '#ffffff'
    }

    // Initial mask state: Fully transparent (circle radius 0)
    // We use mask-image to create a soft-edged expanding circle
    const startRadius = 0
    // Calculate radius to cover the screen from top-right to bottom-left
    // Add extra buffer for the gradient edge
    const maxRadius = Math.hypot(window.innerWidth, window.innerHeight) + 50

    // Helper to set mask
    const setMask = (radius: number) => {
      const gradient = `radial-gradient(circle at top right, black ${radius}px, transparent ${radius + 50}px)`
      overlay.style.maskImage = gradient
      overlay.style.webkitMaskImage = gradient
    }

    setMask(startRadius)
    document.body.appendChild(overlay)

    // Force reflow
    void overlay.offsetHeight

    // Animation Loop
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-in-out ish)
      const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2

      const currentRadius = startRadius + (maxRadius - startRadius) * ease
      setMask(currentRadius)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Animation Complete: Overlay covers screen

        // 1. Switch Theme
        setTheme(newTheme)

        // 2. Wait a tick for theme to apply, then fade out
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
      }
    }

    requestAnimationFrame(animate)
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
