import { useEffect } from 'react'

export function useRequireClient() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      throw new Error('"use client" directive required')
    }
  }, [])
}
