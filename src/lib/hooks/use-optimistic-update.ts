"use client"

import { useState, useCallback } from "react"

interface UseOptimisticUpdateOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useOptimisticUpdate<T>(
  initialData: T,
  updateFn: (data: T) => Promise<T>,
  options: UseOptimisticUpdateOptions<T> = {},
) {
  const [data, setData] = useState<T>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const update = useCallback(
    async (optimisticData: T) => {
      // Store previous data for rollback
      const previousData = data

      // Optimistically update UI
      setData(optimisticData)
      setIsLoading(true)
      setError(null)

      try {
        // Perform actual update
        const result = await updateFn(optimisticData)
        setData(result)
        options.onSuccess?.(result)
      } catch (err) {
        // Rollback on error
        setData(previousData)
        const error = err instanceof Error ? err : new Error("Update failed")
        setError(error)
        options.onError?.(error)
      } finally {
        setIsLoading(false)
      }
    },
    [data, updateFn, options],
  )

  return { data, isLoading, error, update }
}
