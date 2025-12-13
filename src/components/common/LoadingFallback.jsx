import React, { Suspense } from "react";
import LoadingState from "./LoadingState";
import ErrorBoundary from "./ErrorBoundary";

/**
 * Wrapper component that combines Suspense for lazy loading and ErrorBoundary for error handling
 */
export default function LoadingFallback({ 
  children, 
  loadingMessage = "Loading...",
  errorTitle,
  errorMessage,
  fullScreen = false
}) {
  return (
    <ErrorBoundary title={errorTitle} message={errorMessage}>
      <Suspense fallback={<LoadingState message={loadingMessage} fullScreen={fullScreen} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}