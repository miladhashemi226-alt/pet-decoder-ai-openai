import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function FriendlyError({ 
  title = "Oops! Something went wrong",
  message = "We encountered an unexpected error. Please try again.",
  error,
  onRetry,
  showHomeButton = true,
  showContactSupport = false
}) {
  const getErrorSuggestion = (error) => {
    if (!error) return null;

    const errorMessage = error.message?.toLowerCase() || "";
    
    if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
      return "Check your internet connection and try again.";
    }
    if (errorMessage.includes("timeout")) {
      return "The request took too long. Please try again.";
    }
    if (errorMessage.includes("not found") || errorMessage.includes("404")) {
      return "The requested resource was not found.";
    }
    if (errorMessage.includes("unauthorized") || errorMessage.includes("401")) {
      return "Your session may have expired. Please log in again.";
    }
    if (errorMessage.includes("forbidden") || errorMessage.includes("403")) {
      return "You don't have permission to access this resource.";
    }
    if (errorMessage.includes("server") || errorMessage.includes("500")) {
      return "Our servers are experiencing issues. Please try again later.";
    }
    
    return null;
  };

  const suggestion = getErrorSuggestion(error);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center py-12 px-4"
    >
      <Card className="max-w-md w-full border-2 border-red-200 bg-red-50/50 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {title}
          </h2>

          <p className="text-gray-700 mb-4">
            {message}
          </p>

          {suggestion && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-900">
                <strong>Tip:</strong> {suggestion}
              </p>
            </div>
          )}

          {error && (
            <details className="text-left bg-gray-100 rounded-lg p-3 mb-4">
              <summary className="cursor-pointer text-sm font-semibold text-gray-700 mb-2">
                Technical Details
              </summary>
              <pre className="text-xs text-gray-600 overflow-auto max-h-40 whitespace-pre-wrap break-words">
                {error.stack || error.message || String(error)}
              </pre>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <Button
                onClick={onRetry}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}

            {showHomeButton && (
              <Link to={createPageUrl("Dashboard")}>
                <Button variant="outline" className="border-purple-300 hover:bg-purple-50 w-full sm:w-auto">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </Link>
            )}

            {showContactSupport && (
              <Link to={createPageUrl("Contact")}>
                <Button variant="outline" className="border-gray-300 hover:bg-gray-50 w-full sm:w-auto">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}