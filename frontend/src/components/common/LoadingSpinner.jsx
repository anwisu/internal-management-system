import { Spinner } from '@material-tailwind/react';

/**
 * Loading spinner component
 * Displays a centered loading indicator
 */
function LoadingSpinner({ size = 'lg' }) {
  const sizeClass = size === 'lg' ? 'h-12 w-12' : 'h-8 w-8';
  return (
    <div className="flex justify-center items-center py-12" role="status" aria-live="polite" aria-label="Loading">
      <Spinner color="blue" className={sizeClass} aria-hidden="true" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default LoadingSpinner;

