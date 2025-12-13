/**
 * Enhanced retry utility with exponential backoff and jitter
 */
export const retryWithBackoff = async (
  fn,
  maxRetries = 3,
  initialDelay = 1000,
  maxDelay = 10000,
  backoffFactor = 2
) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain error types
      if (isNonRetryableError(error)) {
        throw error;
      }
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Calculate delay with exponential backoff and jitter
      const baseDelay = Math.min(initialDelay * Math.pow(backoffFactor, attempt), maxDelay);
      const jitter = Math.random() * baseDelay * 0.3; // 30% jitter
      const delay = baseDelay + jitter;
      
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${Math.round(delay)}ms due to:`, error.message);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * Retry specifically for network requests
 */
export const retryNetworkRequest = async (fn, maxRetries = 3) => {
  return retryWithBackoff(fn, maxRetries, 1000, 10000, 2);
};

/**
 * Retry for API calls with shorter delays
 */
export const retryAPICall = async (fn, maxRetries = 2) => {
  return retryWithBackoff(fn, maxRetries, 500, 5000, 2);
};

/**
 * Check if error is retryable
 */
export const isRetryableError = (error) => {
  // Network errors
  if (error.message && (
    error.message.includes('network') ||
    error.message.includes('timeout') ||
    error.message.includes('ECONNRESET') ||
    error.message.includes('ETIMEDOUT') ||
    error.message.includes('fetch failed')
  )) {
    return true;
  }
  
  // HTTP status codes that should be retried
  if (error.status && [408, 429, 500, 502, 503, 504].includes(error.status)) {
    return true;
  }
  
  return false;
};

/**
 * Check if error should NOT be retried
 */
export const isNonRetryableError = (error) => {
  // Client errors that won't be fixed by retrying
  if (error.status && [400, 401, 403, 404, 422].includes(error.status)) {
    return true;
  }
  
  // Specific error messages that indicate non-retryable issues
  if (error.message && (
    error.message.includes('unauthorized') ||
    error.message.includes('forbidden') ||
    error.message.includes('not found') ||
    error.message.includes('invalid') ||
    error.message.includes('validation')
  )) {
    return true;
  }
  
  return false;
};

/**
 * Retry with timeout
 */
export const retryWithTimeout = async (fn, timeout = 30000, maxRetries = 3) => {
  return retryWithBackoff(
    async () => {
      return Promise.race([
        fn(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
      ]);
    },
    maxRetries
  );
};

/**
 * Batch retry - useful for multiple operations
 */
export const retryBatch = async (operations, maxRetries = 3) => {
  const results = [];
  const errors = [];
  
  for (const [index, operation] of operations.entries()) {
    try {
      const result = await retryWithBackoff(operation, maxRetries);
      results.push({ index, success: true, result });
    } catch (error) {
      console.error(`Operation ${index} failed after ${maxRetries} retries:`, error);
      errors.push({ index, error });
      results.push({ index, success: false, error });
    }
  }
  
  return {
    results,
    errors,
    allSuccessful: errors.length === 0
  };
};