import type React from "react"
import { type ComponentType, Suspense } from "react"
import { ErrorBoundary } from "@/shared/components/ui-enhancements/error-boundary"

interface WithLazyLoadOptions {
  fallback?: React.ReactNode
  errorFallback?: React.ReactNode
}

export function withLazyLoad<P extends object>(Component: ComponentType<P>, options: WithLazyLoadOptions = {}) {
  const { fallback = <div className="py-20 animate-pulse" />, errorFallback } = options

  return function LazyLoadedComponent(props: P) {
    return (
      <ErrorBoundary fallback={errorFallback}>
        <Suspense fallback={fallback}>
          <Component {...props} />
        </Suspense>
      </ErrorBoundary>
    )
  }
}
