"use client"

import type { ComponentType } from "react"
import { LoadingSpinner } from "../components/atoms/loading-spinner"

interface WithLoadingProps {
  isLoading: boolean
}

export function withLoading<P extends object>(WrappedComponent: ComponentType<P>, LoadingComponent?: ComponentType) {
  return function WithLoadingComponent(props: P & WithLoadingProps) {
    const { isLoading, ...rest } = props

    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />
      }

      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      )
    }

    return <WrappedComponent {...(rest as P)} />
  }
}
