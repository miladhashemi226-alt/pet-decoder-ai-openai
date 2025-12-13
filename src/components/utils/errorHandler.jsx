/**
 * Centralized error handling utilities
 */

export const handleAuthError = (error) => {
  const errorString = JSON.stringify(error);
  const errorMessage = error?.message || '';
  
  const is401Error = 
    error?.response?.status === 401 || 
    error?.status === 401 || 
    errorMessage.includes('401') ||
    errorMessage.toLowerCase().includes('unauthorized') ||
    errorString.includes('401') ||
    errorString.toLowerCase().includes('unauthorized');
  
  if (is401Error) {
    console.log("Authentication error detected (401), redirecting to landing page...");
    
    try {
      localStorage.removeItem('video_analysis_consent');
    } catch (e) {
      console.error("Error clearing cache:", e);
    }
    
    setTimeout(() => {
      window.location.href = '/Landing';
    }, 100);
    
    return true;
  }
  
  return false;
};

export const isAuthError = (error) => {
  const errorString = JSON.stringify(error);
  const errorMessage = error?.message || '';
  
  return error?.response?.status === 401 || 
         error?.status === 401 || 
         errorMessage.includes('401') ||
         errorMessage.toLowerCase().includes('unauthorized') ||
         errorString.includes('401') ||
         errorString.toLowerCase().includes('unauthorized');
};

export const getFriendlyErrorMessage = (error, fallback = "An error occurred. Please try again.") => {
  if (isAuthError(error)) {
    return "Your session has expired. Please sign in again.";
  }
  
  const errorMessage = error?.message || '';
  const errorString = JSON.stringify(error);
  
  // Database timeout errors
  if (errorMessage.includes('DatabaseTimeout') || 
      errorMessage.includes('database timed out') ||
      errorMessage.includes('statusCode\': 544') ||
      errorString.includes('DatabaseTimeout')) {
    return "The server is experiencing high load. Please wait a moment and try again.";
  }
  
  // Other HTTP errors
  if (error?.response?.status === 403 || error?.status === 403 || errorMessage.includes('403')) {
    return "You don't have permission to access this resource.";
  }
  
  if (error?.response?.status === 404 || error?.status === 404 || errorMessage.includes('404')) {
    return "The requested resource was not found.";
  }
  
  if (error?.response?.status === 500 || error?.status === 500 || errorMessage.includes('500')) {
    return "Server error. Please try again later.";
  }
  
  if (error?.response?.status === 503 || error?.status === 503 || errorMessage.includes('503')) {
    return "Service temporarily unavailable. Please try again in a few moments.";
  }
  
  if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('fetch failed')) {
    return "Network error. Please check your internet connection.";
  }
  
  if (errorMessage.toLowerCase().includes('timeout')) {
    return "Request timed out. Please check your connection and try again.";
  }
  
  return errorMessage || fallback;
};