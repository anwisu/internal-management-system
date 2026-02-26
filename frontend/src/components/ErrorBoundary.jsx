import React from 'react';
import { Typography, Button } from '@material-tailwind/react';
import { FiAlertTriangle } from 'react-icons/fi';

/**
 * Error Boundary component
 * Catches React component errors and displays a fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="max-w-md w-full text-center bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-3xl p-8 sm:p-10 scale-100 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center text-red-500 shadow-inner">
              <FiAlertTriangle className="w-10 h-10" aria-hidden="true" />
            </div>
            <Typography variant="h3" color="blue-gray" className="mb-3 font-bold text-slate-800 tracking-tight">
              Oops! Something went wrong.
            </Typography>
            <Typography variant="paragraph" className="mb-8 text-slate-500 text-sm leading-relaxed max-w-[280px] mx-auto">
              {this.state.error?.message || "An unexpected error occurred while loading this page. Don't worry, we're looking into it."}
            </Typography>
            <Button
              onClick={this.handleReset}
              className="bg-primary-600 text-white px-8 py-3 rounded-full hover:bg-primary-700 shadow-soft-lg hover:shadow-soft-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              aria-label="Try resetting the page"
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

