'use client';

import type React from 'react';
import { Component, type ComponentType } from 'react';
import { ErrorMessage } from '../components/molecules/error-message';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  fallback?: React.ReactNode
) {
  class ErrorBoundaryComponent extends Component<P, ErrorBoundaryState> {
    constructor(props: P) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error('[ErrorBoundary] Error caught:', error, errorInfo);
    }

    handleReset = () => {
      this.setState({ hasError: false, error: null });
    };

    render() {
      if (this.state.hasError) {
        if (fallback) {
          return fallback;
        }

        return (
          <div className="container mx-auto px-4 py-8">
            <ErrorMessage
              title="Something went wrong"
              message={
                this.state.error?.message || 'An unexpected error occurred'
              }
              onRetry={this.handleReset}
            />
          </div>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  }

  return ErrorBoundaryComponent as ComponentType<P>;
}
