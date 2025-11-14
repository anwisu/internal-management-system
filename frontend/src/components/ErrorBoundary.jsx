import React from 'react';
import { Typography, Button, Card, CardBody } from '@material-tailwind/react';

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
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="max-w-md w-full">
            <CardBody className="text-center">
              <Typography variant="h4" color="red" className="mb-4">
                Something went wrong
              </Typography>
              <Typography variant="paragraph" color="gray" className="mb-6">
                {this.state.error?.message || 'An unexpected error occurred'}
              </Typography>
              <Button onClick={this.handleReset} color="blue">
                Try Again
              </Button>
            </CardBody>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

