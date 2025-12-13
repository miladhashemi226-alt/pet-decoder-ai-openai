import React from "react";
import FriendlyError from "./FriendlyError";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Log to error tracking service
    if (window.errorTracker) {
      window.errorTracker.logError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <FriendlyError
          title={this.props.title || "Component Error"}
          message={this.props.message || "This component encountered an error. Please try refreshing."}
          error={this.state.error}
          onRetry={this.handleReset}
          showHomeButton={this.props.showHomeButton !== false}
          showContactSupport={this.props.showContactSupport}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;