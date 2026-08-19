import { useState, useEffect } from 'react'

/**
 * useState that mirrors its value into localStorage.
 * Used by cart / wishlist / recently viewed persistence.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable — ignore */
    }
  }, [key, value])

  return [value, setValue]
}
