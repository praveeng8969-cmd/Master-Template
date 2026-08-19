import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { siteConfig } from '../config/site.js'

const ThemeContext = createContext(null)

/** Applies design tokens from siteConfig.colors to CSS variables on <html>. */
function applyTokens(isDark) {
  const tokens = isDark ? siteConfig.colors.dark : siteConfig.colors.light
  const root = document.documentElement
  const map = {
    primary: '--primary',
    secondary: '--secondary',
    accent: '--accent',
  }
  Object.entries(map).forEach(([key, cssVar]) => {
    if (tokens[key]) root.style.setProperty(cssVar, tokens[key])
  })
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = window.localStorage.getItem('vortexnova_theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    applyTokens(isDark)
    window.localStorage.setItem('vortexnova_theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = useCallback(() => setIsDark((v) => !v), [])

  return <ThemeContext.Provider value={{ isDark, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
